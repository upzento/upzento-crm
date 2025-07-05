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
import { CreateContactRelationshipDto, RelationshipType } from './dto/create-contact-relationship.dto';
import { AdvancedSearchDto } from './dto/advanced-search.dto';
import { CreateLeadCampaignDto } from './dto/create-lead-campaign.dto';
import { AssignCampaignDto } from './dto/assign-campaign.dto';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { CampaignMetricsDto } from './dto/campaign-metrics.dto';

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

  async createRelationship(dto: CreateContactRelationshipDto) {
    return this.prisma.contactRelationship.create({
      data: {
        contact1Id: dto.contactId1,
        contact2Id: dto.contactId2,
        type: dto.relationshipType,
        customLabel: dto.customLabel,
        notes: dto.notes,
        strength: dto.strength,
      },
      include: {
        contact1: true,
        contact2: true,
      },
    });
  }

  async getContactRelationships(contactId: string) {
    return this.prisma.contactRelationship.findMany({
      where: {
        OR: [
          { contact1Id: contactId },
          { contact2Id: contactId },
        ],
      },
      include: {
        contact1: true,
        contact2: true,
      },
    });
  }

  async deleteRelationship(relationshipId: string) {
    return this.prisma.contactRelationship.delete({
      where: { id: relationshipId },
    });
  }

  async createLeadCampaign(dto: CreateLeadCampaignDto, userId: string) {
    return this.prisma.leadCampaign.create({
      data: {
        name: dto.name,
        description: dto.description,
        triggerConditions: dto.triggerConditions,
        steps: dto.steps,
        isActive: dto.isActive,
        maxContacts: dto.maxContacts,
        createdBy: userId,
      },
    });
  }

  async assignCampaign(dto: AssignCampaignDto) {
    const assignments = dto.contactIds.map(contactId => ({
      campaignId: dto.campaignId,
      contactId,
      overrides: dto.overrides,
    }));

    return this.prisma.campaignAssignment.createMany({
      data: assignments,
      skipDuplicates: true,
    });
  }

  async advancedSearch(dto: AdvancedSearchDto) {
    const where = this.buildSearchQuery(dto.conditions, dto.combinator);
    
    const results = await this.prisma.contact.findMany({
      where,
      orderBy: dto.sort,
      skip: dto.page ? (dto.page - 1) * (dto.limit || 10) : undefined,
      take: dto.limit,
      select: dto.include ? this.buildSelectObject(dto.include) : undefined,
    });

    if (dto.saveSearch && dto.searchName) {
      await this.prisma.savedSearch.create({
        data: {
          name: dto.searchName,
          conditions: dto.conditions,
          userId: 'current-user-id', // Replace with actual user ID from context
        },
      });
    }

    return results;
  }

  private buildSearchQuery(conditions: any[], combinator: 'AND' | 'OR' = 'AND') {
    const queries = conditions.map(condition => {
      switch (condition.operator) {
        case 'equals':
          return { [condition.field]: condition.value };
        case 'contains':
          return { [condition.field]: { contains: condition.value, mode: 'insensitive' } };
        case 'greater_than':
          return { [condition.field]: { gt: condition.value } };
        case 'less_than':
          return { [condition.field]: { lt: condition.value } };
        case 'between':
          return { 
            AND: [
              { [condition.field]: { gte: condition.value } },
              { [condition.field]: { lte: condition.upperValue } },
            ],
          };
        case 'in':
          return { [condition.field]: { in: condition.value } };
        case 'not_in':
          return { [condition.field]: { notIn: condition.value } };
        case 'exists':
          return { [condition.field]: { not: null } };
        default:
          return {};
      }
    });

    return { [combinator]: queries };
  }

  private buildSelectObject(fields: string[]) {
    return fields.reduce((acc, field) => ({ ...acc, [field]: true }), {});
  }

  async createSegment(dto: CreateSegmentDto, userId: string) {
    return this.prisma.contactSegment.create({
      data: {
        name: dto.name,
        description: dto.description,
        conditions: dto.conditions,
        combinator: dto.combinator,
        isDynamic: dto.isDynamic,
        includeArchived: dto.includeArchived,
        createdBy: userId,
      },
    });
  }

  async getSegment(segmentId: string) {
    const segment = await this.prisma.contactSegment.findUnique({
      where: { id: segmentId },
    });

    if (!segment) {
      throw new NotFoundException(`Segment with ID ${segmentId} not found`);
    }

    // If dynamic, run the search to get current members
    if (segment.isDynamic) {
      const contacts = await this.advancedSearch({
        conditions: segment.conditions as any[],
        combinator: segment.combinator as 'AND' | 'OR',
      });

      return {
        ...segment,
        contacts,
      };
    }

    return segment;
  }

  async updateSegment(segmentId: string, dto: CreateSegmentDto) {
    return this.prisma.contactSegment.update({
      where: { id: segmentId },
      data: {
        name: dto.name,
        description: dto.description,
        conditions: dto.conditions,
        combinator: dto.combinator,
        isDynamic: dto.isDynamic,
        includeArchived: dto.includeArchived,
      },
    });
  }

  async deleteSegment(segmentId: string) {
    return this.prisma.contactSegment.delete({
      where: { id: segmentId },
    });
  }

  async listSegments() {
    return this.prisma.contactSegment.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCampaignMetrics(campaignId: string): Promise<CampaignMetricsDto> {
    const campaign = await this.prisma.leadCampaign.findUnique({
      where: { id: campaignId },
      include: {
        assignments: true,
      },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${campaignId} not found`);
    }

    const assignments = campaign.assignments;
    const totalContacts = assignments.length;
    const completedContacts = assignments.filter(a => a.status === 'COMPLETED').length;
    const inProgressContacts = assignments.filter(a => a.status === 'IN_PROGRESS').length;
    const pendingContacts = assignments.filter(a => a.status === 'PENDING').length;

    // Calculate average completion time
    const completedAssignments = assignments.filter(a => a.status === 'COMPLETED' && a.startedAt && a.completedAt);
    const averageCompletionTime = completedAssignments.length > 0
      ? completedAssignments.reduce((acc, curr) => {
          const completionTime = curr.completedAt.getTime() - curr.startedAt.getTime();
          return acc + completionTime;
        }, 0) / (completedAssignments.length * 24 * 60 * 60 * 1000) // Convert to days
      : undefined;

    // Calculate step metrics
    const steps = campaign.steps as any[];
    const stepMetrics = steps.map((_, index) => {
      const assignmentsAtStep = assignments.filter(a => a.currentStep === index);
      return {
        stepIndex: index,
        completed: assignmentsAtStep.filter(a => a.currentStep > index).length,
        pending: assignmentsAtStep.filter(a => a.currentStep === index && a.status !== 'COMPLETED').length,
        failed: assignmentsAtStep.filter(a => a.status === 'FAILED').length,
        averageTimeToComplete: undefined, // Would need additional tracking data
      };
    });

    // Calculate conversion metrics
    const conversions = await this.prisma.campaignConversion.findMany({
      where: { campaignId },
    });

    const conversionMetrics = {
      totalConversions: conversions.length,
      conversionRate: totalContacts > 0 ? conversions.length / totalContacts : 0,
      revenueGenerated: conversions.reduce((acc, curr) => acc + (curr.value || 0), 0),
    };

    // Calculate engagement metrics
    const engagementMetrics = {
      emailOpenRate: await this.calculateEmailOpenRate(campaignId),
      emailClickRate: await this.calculateEmailClickRate(campaignId),
      smsResponseRate: await this.calculateSMSResponseRate(campaignId),
      taskCompletionRate: await this.calculateTaskCompletionRate(campaignId),
    };

    return {
      totalContacts,
      completedContacts,
      inProgressContacts,
      pendingContacts,
      averageCompletionTime,
      successRate: totalContacts > 0 ? completedContacts / totalContacts : 0,
      stepMetrics,
      conversionMetrics,
      engagementMetrics,
    };
  }

  private async calculateEmailOpenRate(campaignId: string): Promise<number> {
    const emailSteps = await this.prisma.campaignStep.findMany({
      where: {
        campaignId,
        type: 'EMAIL',
      },
      include: {
        emailMetrics: true,
      },
    });

    if (emailSteps.length === 0) return 0;

    const totalEmails = emailSteps.reduce((acc, step) => acc + step.emailMetrics.length, 0);
    const openedEmails = emailSteps.reduce((acc, step) => 
      acc + step.emailMetrics.filter(m => m.opened).length, 0);

    return totalEmails > 0 ? openedEmails / totalEmails : 0;
  }

  private async calculateEmailClickRate(campaignId: string): Promise<number> {
    const emailSteps = await this.prisma.campaignStep.findMany({
      where: {
        campaignId,
        type: 'EMAIL',
      },
      include: {
        emailMetrics: true,
      },
    });

    if (emailSteps.length === 0) return 0;

    const totalEmails = emailSteps.reduce((acc, step) => acc + step.emailMetrics.length, 0);
    const clickedEmails = emailSteps.reduce((acc, step) => 
      acc + step.emailMetrics.filter(m => m.clicked).length, 0);

    return totalEmails > 0 ? clickedEmails / totalEmails : 0;
  }

  private async calculateSMSResponseRate(campaignId: string): Promise<number> {
    const smsSteps = await this.prisma.campaignStep.findMany({
      where: {
        campaignId,
        type: 'SMS',
      },
      include: {
        smsMetrics: true,
      },
    });

    if (smsSteps.length === 0) return 0;

    const totalSMS = smsSteps.reduce((acc, step) => acc + step.smsMetrics.length, 0);
    const respondedSMS = smsSteps.reduce((acc, step) => 
      acc + step.smsMetrics.filter(m => m.responded).length, 0);

    return totalSMS > 0 ? respondedSMS / totalSMS : 0;
  }

  private async calculateTaskCompletionRate(campaignId: string): Promise<number> {
    const taskSteps = await this.prisma.campaignStep.findMany({
      where: {
        campaignId,
        type: 'TASK',
      },
      include: {
        taskMetrics: true,
      },
    });

    if (taskSteps.length === 0) return 0;

    const totalTasks = taskSteps.reduce((acc, step) => acc + step.taskMetrics.length, 0);
    const completedTasks = taskSteps.reduce((acc, step) => 
      acc + step.taskMetrics.filter(m => m.completed).length, 0);

    return totalTasks > 0 ? completedTasks / totalTasks : 0;
  }
} 