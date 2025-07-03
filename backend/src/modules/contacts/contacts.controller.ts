import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Request,
  Query,
  ParseUUIDPipe,
  ParseArrayPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { CreateContactTagDto } from './dto/create-contact-tag.dto';
import { UpdateContactTagDto } from './dto/update-contact-tag.dto';
import { CreateContactCustomFieldDto } from './dto/create-contact-custom-field.dto';
import { UpdateContactCustomFieldDto } from './dto/update-contact-custom-field.dto';
import { ImportContactsDto } from './dto/import-contacts.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContextGuard } from '../auth/guards/tenant-context.guard';
import { RequiresTenantType } from '../auth/decorators/tenant-type.decorator';

@ApiTags('contacts')
@Controller('contacts')
@UseGuards(JwtAuthGuard, TenantContextGuard)
@ApiBearerAuth()
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  // Contact endpoints
  @Post()
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Create a new contact' })
  @ApiResponse({ status: 201, description: 'Contact created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  createContact(@Body() createContactDto: CreateContactDto, @Request() req) {
    const clientId = req.user.tenantContext.clientId;
    const userId = req.user.id;
    return this.contactsService.createContact(createContactDto, clientId, userId);
  }

  @Get()
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Get all contacts' })
  @ApiResponse({ status: 200, description: 'Contacts retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAllContacts(@Request() req) {
    const clientId = req.user.tenantContext.clientId;
    return this.contactsService.findAllContacts(clientId);
  }

  @Get('search')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Search contacts' })
  @ApiQuery({ name: 'query', required: true, description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Contacts retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  searchContacts(@Query('query') query: string, @Request() req) {
    const clientId = req.user.tenantContext.clientId;
    return this.contactsService.searchContacts(query, clientId);
  }

  @Get('filter')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Filter contacts by tags' })
  @ApiQuery({ 
    name: 'tagIds', 
    required: true, 
    description: 'Tag IDs to filter by (comma-separated)', 
    type: String 
  })
  @ApiResponse({ status: 200, description: 'Contacts retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  filterContactsByTags(@Query('tagIds') tagIdsString: string, @Request() req) {
    const clientId = req.user.tenantContext.clientId;
    const tagIds = tagIdsString.split(',');
    return this.contactsService.filterContactsByTags(tagIds, clientId);
  }

  @Get(':id')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Get a contact by ID' })
  @ApiResponse({ status: 200, description: 'Contact retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findContactById(@Param('id') id: string, @Request() req) {
    const clientId = req.user.tenantContext.clientId;
    return this.contactsService.findContactById(id, clientId);
  }

  @Patch(':id')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Update a contact' })
  @ApiResponse({ status: 200, description: 'Contact updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  updateContact(
    @Param('id') id: string, 
    @Body() updateContactDto: UpdateContactDto, 
    @Request() req
  ) {
    const clientId = req.user.tenantContext.clientId;
    const userId = req.user.id;
    return this.contactsService.updateContact(id, updateContactDto, clientId, userId);
  }

  @Delete(':id')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Delete a contact' })
  @ApiResponse({ status: 200, description: 'Contact deleted successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  removeContact(@Param('id') id: string, @Request() req) {
    const clientId = req.user.tenantContext.clientId;
    const userId = req.user.id;
    return this.contactsService.removeContact(id, clientId, userId);
  }

  // Contact tag endpoints
  @Post('tags')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Create a new contact tag' })
  @ApiResponse({ status: 201, description: 'Tag created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  createContactTag(@Body() createContactTagDto: CreateContactTagDto, @Request() req) {
    const clientId = req.user.tenantContext.clientId;
    return this.contactsService.createContactTag(createContactTagDto, clientId);
  }

  @Get('tags')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Get all contact tags' })
  @ApiResponse({ status: 200, description: 'Tags retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAllContactTags(@Request() req) {
    const clientId = req.user.tenantContext.clientId;
    return this.contactsService.findAllContactTags(clientId);
  }

  @Get('tags/:id')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Get a contact tag by ID' })
  @ApiResponse({ status: 200, description: 'Tag retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findContactTagById(@Param('id') id: string, @Request() req) {
    const clientId = req.user.tenantContext.clientId;
    return this.contactsService.findContactTagById(id, clientId);
  }

  @Patch('tags/:id')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Update a contact tag' })
  @ApiResponse({ status: 200, description: 'Tag updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  updateContactTag(
    @Param('id') id: string, 
    @Body() updateContactTagDto: UpdateContactTagDto, 
    @Request() req
  ) {
    const clientId = req.user.tenantContext.clientId;
    return this.contactsService.updateContactTag(id, updateContactTagDto, clientId);
  }

  @Delete('tags/:id')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Delete a contact tag' })
  @ApiResponse({ status: 200, description: 'Tag deleted successfully' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  removeContactTag(@Param('id') id: string, @Request() req) {
    const clientId = req.user.tenantContext.clientId;
    return this.contactsService.removeContactTag(id, clientId);
  }

  // Tag assignment endpoints
  @Post(':contactId/tags/:tagId')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Add a tag to a contact' })
  @ApiResponse({ status: 201, description: 'Tag added to contact successfully' })
  @ApiResponse({ status: 404, description: 'Contact or tag not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  addTagToContact(
    @Param('contactId') contactId: string, 
    @Param('tagId') tagId: string, 
    @Request() req
  ) {
    const clientId = req.user.tenantContext.clientId;
    const userId = req.user.id;
    return this.contactsService.addTagToContact(contactId, tagId, clientId, userId);
  }

  @Delete(':contactId/tags/:tagId')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Remove a tag from a contact' })
  @ApiResponse({ status: 200, description: 'Tag removed from contact successfully' })
  @ApiResponse({ status: 404, description: 'Contact or tag not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  removeTagFromContact(
    @Param('contactId') contactId: string, 
    @Param('tagId') tagId: string, 
    @Request() req
  ) {
    const clientId = req.user.tenantContext.clientId;
    const userId = req.user.id;
    return this.contactsService.removeTagFromContact(contactId, tagId, clientId, userId);
  }

  // Custom fields endpoints
  @Post('custom-fields')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Create a new custom field' })
  @ApiResponse({ status: 201, description: 'Custom field created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  createCustomField(@Body() createCustomFieldDto: CreateContactCustomFieldDto, @Request() req) {
    const clientId = req.user.tenantContext.clientId;
    return this.contactsService.createCustomField(createCustomFieldDto, clientId);
  }

  @Get('custom-fields')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Get all custom fields' })
  @ApiResponse({ status: 200, description: 'Custom fields retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAllCustomFields(@Request() req) {
    const clientId = req.user.tenantContext.clientId;
    return this.contactsService.findAllCustomFields(clientId);
  }

  @Get('custom-fields/:id')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Get a custom field by ID' })
  @ApiResponse({ status: 200, description: 'Custom field retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Custom field not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findCustomFieldById(@Param('id') id: string, @Request() req) {
    const clientId = req.user.tenantContext.clientId;
    return this.contactsService.findCustomFieldById(id, clientId);
  }

  @Patch('custom-fields/:id')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Update a custom field' })
  @ApiResponse({ status: 200, description: 'Custom field updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Custom field not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  updateCustomField(
    @Param('id') id: string, 
    @Body() updateCustomFieldDto: UpdateContactCustomFieldDto, 
    @Request() req
  ) {
    const clientId = req.user.tenantContext.clientId;
    return this.contactsService.updateCustomField(id, updateCustomFieldDto, clientId);
  }

  @Delete('custom-fields/:id')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Delete a custom field' })
  @ApiResponse({ status: 200, description: 'Custom field deleted successfully' })
  @ApiResponse({ status: 404, description: 'Custom field not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  removeCustomField(@Param('id') id: string, @Request() req) {
    const clientId = req.user.tenantContext.clientId;
    return this.contactsService.removeCustomField(id, clientId);
  }

  // Lead management endpoints
  @Post(':id/convert-to-lead')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Convert a contact to a lead' })
  @ApiResponse({ status: 200, description: 'Contact converted to lead successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        leadStatus: { type: 'string', example: 'New' },
        leadSource: { type: 'string', example: 'Website' },
      },
      required: ['leadStatus', 'leadSource'],
    },
  })
  convertToLead(
    @Param('id') id: string,
    @Body() body: { leadStatus: string; leadSource: string },
    @Request() req
  ) {
    const clientId = req.user.tenantContext.clientId;
    const userId = req.user.id;
    return this.contactsService.convertToLead(id, body.leadStatus, body.leadSource, clientId, userId);
  }

  @Post(':id/convert-to-contact')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Convert a lead to a contact' })
  @ApiResponse({ status: 200, description: 'Lead converted to contact successfully' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  convertToContact(@Param('id') id: string, @Request() req) {
    const clientId = req.user.tenantContext.clientId;
    const userId = req.user.id;
    return this.contactsService.convertToContact(id, clientId, userId);
  }

  @Post(':id/assign')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Assign a contact to a user' })
  @ApiResponse({ status: 200, description: 'Contact assigned successfully' })
  @ApiResponse({ status: 404, description: 'Contact or user not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        assignedToId: { type: 'string', format: 'uuid' },
      },
      required: ['assignedToId'],
    },
  })
  assignContact(
    @Param('id') id: string,
    @Body() body: { assignedToId: string },
    @Request() req
  ) {
    const clientId = req.user.tenantContext.clientId;
    const userId = req.user.id;
    return this.contactsService.assignContact(id, body.assignedToId, clientId, userId);
  }

  // Import/Export endpoints
  @Post('import')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Import contacts from CSV' })
  @ApiResponse({ status: 201, description: 'Contacts imported successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  importContacts(@Body() importDto: ImportContactsDto, @Request() req) {
    const clientId = req.user.tenantContext.clientId;
    const userId = req.user.id;
    return this.contactsService.importContacts(importDto, clientId, userId);
  }

  @Get('export')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Export contacts to CSV' })
  @ApiQuery({ 
    name: 'tagIds', 
    required: false, 
    description: 'Tag IDs to filter by (comma-separated)', 
    type: String 
  })
  @ApiResponse({ status: 200, description: 'Contacts exported successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async exportContacts(@Query('tagIds') tagIdsString: string, @Request() req) {
    const clientId = req.user.tenantContext.clientId;
    const tagIds = tagIdsString ? tagIdsString.split(',') : undefined;
    return this.contactsService.exportContacts(clientId, tagIds);
  }

  // Contact merging endpoints
  @Get('duplicates')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Find duplicate contacts' })
  @ApiResponse({ status: 200, description: 'Duplicates found successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findDuplicates(@Request() req) {
    const clientId = req.user.tenantContext.clientId;
    return this.contactsService.findDuplicates(clientId);
  }

  @Post('merge')
  @RequiresTenantType('client')
  @ApiOperation({ summary: 'Merge contacts' })
  @ApiResponse({ status: 200, description: 'Contacts merged successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        primaryId: { type: 'string', format: 'uuid' },
        secondaryIds: { 
          type: 'array',
          items: { type: 'string', format: 'uuid' },
          minItems: 1
        },
      },
      required: ['primaryId', 'secondaryIds'],
    },
  })
  mergeContacts(
    @Body() body: { primaryId: string; secondaryIds: string[] },
    @Request() req
  ) {
    const clientId = req.user.tenantContext.clientId;
    const userId = req.user.id;
    return this.contactsService.mergeContacts(body.primaryId, body.secondaryIds, clientId, userId);
  }
} 