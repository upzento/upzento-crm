import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Contact, ContactTag, ContactCustomField, Prisma } from '@prisma/client';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { CreateContactTagDto } from './dto/create-contact-tag.dto';
import { UpdateContactTagDto } from './dto/update-contact-tag.dto';
import { CreateContactCustomFieldDto } from './dto/create-contact-custom-field.dto';
import { UpdateContactCustomFieldDto } from './dto/update-contact-custom-field.dto';
import { ImportContactsDto } from './dto/import-contacts.dto';
import * as csv from 'csv-parser';
import { Readable } from 'stream';
import * as Papa from 'papaparse';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  // Contact CRUD operations
  async createContact(createContactDto: CreateContactDto, clientId: string, userId?: string): Promise<Contact> {
    const contact = await this.prisma.contact.create({
      data: {
        ...createContactDto,
        customFields: createContactDto.customFields as unknown as Prisma.JsonObject,
        clientId,
      },
    });

    // Create contact history record
    await this.createContactHistory({
      contactId: contact.id,
      action: 'Created',
      description: 'Contact created',
      performedById: userId,
    });

    return contact;
  }

  async findAllContacts(clientId: string): Promise<Contact[]> {
    return this.prisma.contact.findMany({
      where: { clientId },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findContactById(id: string, clientId: string): Promise<Contact> {
    const contact = await this.prisma.contact.findFirst({
      where: { 
        id,
        clientId,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        history: {
          include: {
            performedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return contact;
  }

  async updateContact(id: string, updateContactDto: UpdateContactDto, clientId: string, userId?: string): Promise<Contact> {
    // Check if contact exists and belongs to the client
    const existingContact = await this.findContactById(id, clientId);

    // Create history record with changes
    const changes = this.getChanges(existingContact, updateContactDto);
    
    const contact = await this.prisma.contact.update({
      where: { id },
      data: {
        ...updateContactDto,
        customFields: updateContactDto.customFields ? 
          updateContactDto.customFields as unknown as Prisma.JsonObject : 
          undefined,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Create contact history record if there were changes
    if (Object.keys(changes).length > 0) {
      await this.createContactHistory({
        contactId: contact.id,
        action: 'Updated',
        description: 'Contact information updated',
        metadata: changes as unknown as Prisma.JsonObject,
        performedById: userId,
      });
    }

    // If contact was converted from lead to contact or vice versa, add history record
    if (updateContactDto.isLead !== undefined && updateContactDto.isLead !== existingContact.isLead) {
      await this.createContactHistory({
        contactId: contact.id,
        action: updateContactDto.isLead ? 'ConvertedToLead' : 'ConvertedToContact',
        description: updateContactDto.isLead ? 'Converted to lead' : 'Converted to contact',
        performedById: userId,
      });
    }

    return contact;
  }

  async removeContact(id: string, clientId: string, userId?: string): Promise<Contact> {
    // Check if contact exists and belongs to the client
    await this.findContactById(id, clientId);

    return this.prisma.contact.delete({
      where: { id },
    });
  }

  // Contact Tag CRUD operations
  async createContactTag(createContactTagDto: CreateContactTagDto, clientId: string): Promise<ContactTag> {
    return this.prisma.contactTag.create({
      data: {
        ...createContactTagDto,
        clientId,
      },
    });
  }

  async findAllContactTags(clientId: string): Promise<ContactTag[]> {
    return this.prisma.contactTag.findMany({
      where: { clientId },
    });
  }

  async findContactTagById(id: string, clientId: string): Promise<ContactTag> {
    const tag = await this.prisma.contactTag.findFirst({
      where: { 
        id,
        clientId,
      },
    });

    if (!tag) {
      throw new NotFoundException(`Contact tag with ID ${id} not found`);
    }

    return tag;
  }

  async updateContactTag(id: string, updateContactTagDto: UpdateContactTagDto, clientId: string): Promise<ContactTag> {
    // Check if tag exists and belongs to the client
    await this.findContactTagById(id, clientId);

    return this.prisma.contactTag.update({
      where: { id },
      data: updateContactTagDto,
    });
  }

  async removeContactTag(id: string, clientId: string): Promise<ContactTag> {
    // Check if tag exists and belongs to the client
    await this.findContactTagById(id, clientId);

    return this.prisma.contactTag.delete({
      where: { id },
    });
  }

  // Tag assignment operations
  async addTagToContact(contactId: string, tagId: string, clientId: string, userId?: string): Promise<void> {
    // Verify both contact and tag exist and belong to the client
    await this.findContactById(contactId, clientId);
    const tag = await this.findContactTagById(tagId, clientId);

    await this.prisma.contactToTag.create({
      data: {
        contactId,
        tagId,
      },
    });

    // Create contact history record
    await this.createContactHistory({
      contactId,
      action: 'Tagged',
      description: `Tagged with "${tag.name}"`,
      performedById: userId,
    });
  }

  async removeTagFromContact(contactId: string, tagId: string, clientId: string, userId?: string): Promise<void> {
    // Verify both contact and tag exist and belong to the client
    await this.findContactById(contactId, clientId);
    const tag = await this.findContactTagById(tagId, clientId);

    await this.prisma.contactToTag.delete({
      where: {
        contactId_tagId: {
          contactId,
          tagId,
        },
      },
    });

    // Create contact history record
    await this.createContactHistory({
      contactId,
      action: 'UnTagged',
      description: `Tag "${tag.name}" removed`,
      performedById: userId,
    });
  }

  // Search and filter operations
  async searchContacts(query: string, clientId: string): Promise<Contact[]> {
    return this.prisma.contact.findMany({
      where: {
        clientId,
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query } },
          { company: { contains: query, mode: 'insensitive' } },
          { jobTitle: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async filterContactsByTags(tagIds: string[], clientId: string): Promise<Contact[]> {
    return this.prisma.contact.findMany({
      where: {
        clientId,
        tags: {
          some: {
            tagId: {
              in: tagIds,
            },
          },
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  // Custom field operations
  async createCustomField(createCustomFieldDto: CreateContactCustomFieldDto, clientId: string): Promise<ContactCustomField> {
    return this.prisma.contactCustomField.create({
      data: {
        ...createCustomFieldDto,
        options: createCustomFieldDto.options as unknown as Prisma.JsonObject,
        clientId,
      },
    });
  }

  async findAllCustomFields(clientId: string): Promise<ContactCustomField[]> {
    return this.prisma.contactCustomField.findMany({
      where: { clientId },
    });
  }

  async findCustomFieldById(id: string, clientId: string): Promise<ContactCustomField> {
    const customField = await this.prisma.contactCustomField.findFirst({
      where: { 
        id,
        clientId,
      },
    });

    if (!customField) {
      throw new NotFoundException(`Custom field with ID ${id} not found`);
    }

    return customField;
  }

  async updateCustomField(id: string, updateCustomFieldDto: UpdateContactCustomFieldDto, clientId: string): Promise<ContactCustomField> {
    // Check if custom field exists and belongs to the client
    await this.findCustomFieldById(id, clientId);

    return this.prisma.contactCustomField.update({
      where: { id },
      data: {
        ...updateCustomFieldDto,
        options: updateCustomFieldDto.options as unknown as Prisma.JsonObject,
      },
    });
  }

  async removeCustomField(id: string, clientId: string): Promise<ContactCustomField> {
    // Check if custom field exists and belongs to the client
    await this.findCustomFieldById(id, clientId);

    return this.prisma.contactCustomField.delete({
      where: { id },
    });
  }

  // Lead management operations
  async convertToLead(id: string, leadStatus: string, leadSource: string, clientId: string, userId?: string): Promise<Contact> {
    const contact = await this.findContactById(id, clientId);
    
    const updatedContact = await this.prisma.contact.update({
      where: { id },
      data: {
        isLead: true,
        leadStatus,
        leadSource,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Create contact history record
    await this.createContactHistory({
      contactId: contact.id,
      action: 'ConvertedToLead',
      description: 'Converted to lead',
      metadata: { leadStatus, leadSource } as unknown as Prisma.JsonObject,
      performedById: userId,
    });

    return updatedContact;
  }

  async convertToContact(id: string, clientId: string, userId?: string): Promise<Contact> {
    const contact = await this.findContactById(id, clientId);
    
    const updatedContact = await this.prisma.contact.update({
      where: { id },
      data: {
        isLead: false,
        leadStatus: null,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Create contact history record
    await this.createContactHistory({
      contactId: contact.id,
      action: 'ConvertedToContact',
      description: 'Converted to contact',
      performedById: userId,
    });

    return updatedContact;
  }

  async assignContact(id: string, assignedToId: string, clientId: string, userId?: string): Promise<Contact> {
    const contact = await this.findContactById(id, clientId);
    
    // Check if the user exists
    const user = await this.prisma.user.findUnique({
      where: { id: assignedToId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${assignedToId} not found`);
    }

    const updatedContact = await this.prisma.contact.update({
      where: { id },
      data: {
        assignedToId,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Create contact history record
    await this.createContactHistory({
      contactId: contact.id,
      action: 'Assigned',
      description: `Assigned to ${user.firstName} ${user.lastName}`,
      performedById: userId,
    });

    return updatedContact;
  }

  // Import/Export operations
  async importContacts(importDto: ImportContactsDto, clientId: string, userId?: string): Promise<{ total: number; created: number; errors: any[] }> {
    const results = {
      total: 0,
      created: 0,
      errors: [],
    };

    // Parse CSV data
    const parsedData = Papa.parse(importDto.csvData, {
      header: importDto.skipHeader,
      skipEmptyLines: true,
    });

    if (parsedData.errors && parsedData.errors.length > 0) {
      throw new BadRequestException('Invalid CSV format');
    }

    const rows = parsedData.data;
    results.total = rows.length;

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];
        const contactData: any = {
          firstName: '',
          lastName: '',
          customFields: {},
        };

        // Apply field mapping
        Object.keys(importDto.fieldMapping).forEach(columnIndex => {
          const field = importDto.fieldMapping[columnIndex];
          const value = row[columnIndex];

          if (field.startsWith('customFields.')) {
            const customFieldName = field.replace('customFields.', '');
            contactData.customFields[customFieldName] = value;
          } else {
            contactData[field] = value;
          }
        });

        // Apply default values
        if (importDto.defaultLeadStatus) {
          contactData.isLead = true;
          contactData.leadStatus = importDto.defaultLeadStatus;
        }

        if (importDto.defaultLeadSource) {
          contactData.leadSource = importDto.defaultLeadSource;
        }

        // Create contact
        const contact = await this.createContact(contactData, clientId, userId);

        // Apply tags if provided
        if (importDto.tagIds && importDto.tagIds.length > 0) {
          for (const tagId of importDto.tagIds) {
            await this.addTagToContact(contact.id, tagId, clientId, userId);
          }
        }

        results.created++;
      } catch (error) {
        results.errors.push({
          row: i + 1,
          error: error.message,
        });
      }
    }

    return results;
  }

  async exportContacts(clientId: string, tagIds?: string[]): Promise<string> {
    // Get contacts, optionally filtered by tags
    let contacts: Contact[];
    if (tagIds && tagIds.length > 0) {
      contacts = await this.filterContactsByTags(tagIds, clientId);
    } else {
      contacts = await this.findAllContacts(clientId);
    }

    // Get custom fields
    const customFields = await this.findAllCustomFields(clientId);
    
    // Prepare data for CSV
    const data = contacts.map(contact => {
      const row: any = {
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
        jobTitle: contact.jobTitle,
        address: contact.address,
        isLead: contact.isLead,
        leadStatus: contact.leadStatus,
        leadSource: contact.leadSource,
        assignedTo: contact.assignedTo ? `${contact.assignedTo.firstName} ${contact.assignedTo.lastName}` : '',
        tags: contact.tags.map(t => t.tag.name).join(', '),
        createdAt: contact.createdAt.toISOString(),
        updatedAt: contact.updatedAt.toISOString(),
      };

      // Add custom fields
      if (contact.customFields) {
        const customFieldsObj = contact.customFields as any;
        customFields.forEach(field => {
          if (customFieldsObj[field.name]) {
            row[`custom_${field.name}`] = customFieldsObj[field.name];
          } else {
            row[`custom_${field.name}`] = '';
          }
        });
      }

      return row;
    });

    // Generate CSV
    return Papa.unparse(data);
  }

  // Contact merging operations
  async findDuplicates(clientId: string): Promise<any[]> {
    const contacts = await this.findAllContacts(clientId);
    const duplicates = [];
    const emailMap = new Map();
    const phoneMap = new Map();

    // Find duplicates by email and phone
    contacts.forEach(contact => {
      if (contact.email) {
        const email = contact.email.toLowerCase();
        if (!emailMap.has(email)) {
          emailMap.set(email, []);
        }
        emailMap.get(email).push(contact);
      }

      if (contact.phone) {
        const phone = contact.phone.replace(/\D/g, ''); // Remove non-digits
        if (!phoneMap.has(phone)) {
          phoneMap.set(phone, []);
        }
        phoneMap.get(phone).push(contact);
      }
    });

    // Collect email duplicates
    for (const [email, contacts] of emailMap.entries()) {
      if (contacts.length > 1) {
        duplicates.push({
          type: 'email',
          value: email,
          contacts,
        });
      }
    }

    // Collect phone duplicates
    for (const [phone, contacts] of phoneMap.entries()) {
      if (contacts.length > 1) {
        duplicates.push({
          type: 'phone',
          value: phone,
          contacts,
        });
      }
    }

    return duplicates;
  }

  async mergeContacts(primaryId: string, secondaryIds: string[], clientId: string, userId?: string): Promise<Contact> {
    // Check if primary contact exists
    const primaryContact = await this.findContactById(primaryId, clientId);
    
    // Check if all secondary contacts exist
    for (const secondaryId of secondaryIds) {
      await this.findContactById(secondaryId, clientId);
    }

    // Start a transaction to ensure all operations succeed or fail together
    return this.prisma.$transaction(async (prisma) => {
      // For each secondary contact
      for (const secondaryId of secondaryIds) {
        const secondaryContact = await prisma.contact.findUnique({
          where: { id: secondaryId },
          include: {
            tags: true,
          },
        });

        // Merge tags
        for (const tagRelation of secondaryContact.tags) {
          // Check if primary contact already has this tag
          const existingTag = await prisma.contactToTag.findUnique({
            where: {
              contactId_tagId: {
                contactId: primaryId,
                tagId: tagRelation.tagId,
              },
            },
          });

          // If not, add it
          if (!existingTag) {
            await prisma.contactToTag.create({
              data: {
                contactId: primaryId,
                tagId: tagRelation.tagId,
              },
            });
          }
        }

        // Merge custom fields
        const primaryCustomFields = primaryContact.customFields as any || {};
        const secondaryCustomFields = secondaryContact.customFields as any || {};
        
        const mergedCustomFields = {
          ...primaryCustomFields,
          ...secondaryCustomFields,
        };

        // Update primary contact with merged custom fields
        await prisma.contact.update({
          where: { id: primaryId },
          data: {
            customFields: mergedCustomFields as unknown as Prisma.JsonObject,
          },
        });

        // Update relationships in other tables to point to primary contact
        await this.updateRelationships(prisma, primaryId, secondaryId);

        // Create history record for the merge
        await this.createContactHistory({
          contactId: primaryId,
          action: 'Merged',
          description: `Merged with contact ${secondaryContact.firstName} ${secondaryContact.lastName}`,
          metadata: { secondaryId } as unknown as Prisma.JsonObject,
          performedById: userId,
        }, prisma);

        // Delete the secondary contact
        await prisma.contact.delete({
          where: { id: secondaryId },
        });
      }

      // Return the updated primary contact
      return prisma.contact.findUnique({
        where: { id: primaryId },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });
    });
  }

  // Helper methods
  private async createContactHistory(data: {
    contactId: string;
    action: string;
    description: string;
    metadata?: Prisma.JsonObject;
    performedById?: string;
  }, prismaClient?: any) {
    const client = prismaClient || this.prisma;
    
    return client.contactHistory.create({
      data,
    });
  }

  private getChanges(original: any, updated: any): Record<string, { old: any; new: any }> {
    const changes = {};
    
    Object.keys(updated).forEach(key => {
      if (updated[key] !== undefined && JSON.stringify(original[key]) !== JSON.stringify(updated[key])) {
        changes[key] = {
          old: original[key],
          new: updated[key],
        };
      }
    });
    
    return changes;
  }

  private async updateRelationships(prisma: any, primaryId: string, secondaryId: string): Promise<void> {
    // Update deals
    await prisma.deal.updateMany({
      where: { contactId: secondaryId },
      data: { contactId: primaryId },
    });

    // Update appointments
    await prisma.appointment.updateMany({
      where: { contactId: secondaryId },
      data: { contactId: primaryId },
    });

    // Update calls
    await prisma.call.updateMany({
      where: { contactId: secondaryId },
      data: { contactId: primaryId },
    });

    // Update SMS messages
    await prisma.sMSMessage.updateMany({
      where: { contactId: secondaryId },
      data: { contactId: primaryId },
    });

    // Update SMS conversations
    await prisma.sMSConversation.updateMany({
      where: { contactId: secondaryId },
      data: { contactId: primaryId },
    });

    // Update bulk SMS recipients
    await prisma.bulkSMSRecipient.updateMany({
      where: { contactId: secondaryId },
      data: { contactId: primaryId },
    });

    // Update reviews
    await prisma.review.updateMany({
      where: { contactId: secondaryId },
      data: { contactId: primaryId },
    });

    // Update orders
    await prisma.order.updateMany({
      where: { contactId: secondaryId },
      data: { contactId: primaryId },
    });

    // Update message recipients
    await prisma.messageRecipient.updateMany({
      where: { contactId: secondaryId },
      data: { contactId: primaryId },
    });
  }
} 