import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseUUIDPipe, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContextGuard } from '../auth/guards/tenant-context.guard';
import { RequiresTenantType } from '../auth/decorators/tenant-type.decorator';
import { PaymentService } from './payment.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

@ApiTags('payment')
@Controller('payment')
@UseGuards(JwtAuthGuard, TenantContextGuard)
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // Plan endpoints
  @Post('plans')
  @RequiresTenantType('admin')
  @ApiOperation({ summary: 'Create a new plan' })
  @ApiResponse({ status: 201, description: 'Plan created successfully' })
  createPlan(@Body() createPlanDto: CreatePlanDto) {
    return this.paymentService.createPlan(createPlanDto);
  }

  @Get('plans')
  @ApiOperation({ summary: 'Get all plans' })
  @ApiResponse({ status: 200, description: 'Plans retrieved successfully' })
  @ApiQuery({ name: 'planType', required: false, description: 'Filter by plan type (AGENCY or CLIENT)' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
  findAllPlans(
    @Query('planType') planType?: string,
    @Query('isActive') isActive?: string,
  ) {
    const where: any = {};
    
    if (planType) {
      where.planType = planType;
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }
    
    return this.paymentService.findAllPlans({ where });
  }

  @Get('plans/:id')
  @ApiOperation({ summary: 'Get a plan by ID' })
  @ApiResponse({ status: 200, description: 'Plan retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  findPlanById(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.findPlanById(id);
  }

  @Patch('plans/:id')
  @RequiresTenantType('admin')
  @ApiOperation({ summary: 'Update a plan' })
  @ApiResponse({ status: 200, description: 'Plan updated successfully' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  updatePlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePlanDto: UpdatePlanDto,
  ) {
    return this.paymentService.updatePlan(id, updatePlanDto);
  }

  @Delete('plans/:id')
  @RequiresTenantType('admin')
  @ApiOperation({ summary: 'Delete a plan' })
  @ApiResponse({ status: 200, description: 'Plan deleted successfully' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  @ApiResponse({ status: 400, description: 'Plan is being used by subscriptions' })
  deletePlan(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.deletePlan(id);
  }

  // Subscription endpoints
  @Post('subscriptions')
  @RequiresTenantType(['admin', 'agency_admin'])
  @ApiOperation({ summary: 'Create a new subscription' })
  @ApiResponse({ status: 201, description: 'Subscription created successfully' })
  createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @Request() req,
  ) {
    // If agency admin, set agencyId to their agency
    if (req.user.tenantContext.role === 'AGENCY_ADMIN') {
      createSubscriptionDto.agencyId = req.user.tenantContext.agencyId;
      createSubscriptionDto.clientId = undefined; // Ensure no clientId is set
    }
    
    return this.paymentService.createSubscription(createSubscriptionDto);
  }

  @Get('subscriptions')
  @ApiOperation({ summary: 'Get all subscriptions' })
  @ApiResponse({ status: 200, description: 'Subscriptions retrieved successfully' })
  findAllSubscriptions(@Request() req) {
    const where: any = {};
    
    // Filter based on tenant context
    if (req.user.tenantContext.role === 'ADMIN') {
      // Admin can see all subscriptions
    } else if (req.user.tenantContext.role === 'AGENCY_ADMIN') {
      where.agencyId = req.user.tenantContext.agencyId;
    } else if (req.user.tenantContext.role === 'CLIENT_ADMIN' || req.user.tenantContext.role === 'CLIENT_USER') {
      where.clientId = req.user.tenantContext.clientId;
    }
    
    return this.paymentService.findAllSubscriptions({
      where,
      include: {
        plan: true,
        agency: true,
        client: true,
      },
    });
  }

  @Get('subscriptions/:id')
  @ApiOperation({ summary: 'Get a subscription by ID' })
  @ApiResponse({ status: 200, description: 'Subscription retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  findSubscriptionById(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.paymentService.findSubscriptionById(id);
  }

  @Patch('subscriptions/:id')
  @RequiresTenantType(['admin', 'agency_admin'])
  @ApiOperation({ summary: 'Update a subscription' })
  @ApiResponse({ status: 200, description: 'Subscription updated successfully' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  updateSubscription(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
    @Request() req,
  ) {
    return this.paymentService.updateSubscription(id, updateSubscriptionDto);
  }

  @Delete('subscriptions/:id')
  @RequiresTenantType(['admin', 'agency_admin'])
  @ApiOperation({ summary: 'Delete a subscription' })
  @ApiResponse({ status: 200, description: 'Subscription deleted successfully' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  @ApiResponse({ status: 400, description: 'Subscription has invoices' })
  deleteSubscription(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.deleteSubscription(id);
  }

  // Invoice endpoints
  @Post('invoices')
  @RequiresTenantType(['admin', 'agency_admin'])
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiResponse({ status: 201, description: 'Invoice created successfully' })
  createInvoice(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @Request() req,
  ) {
    // If agency admin, set agencyId to their agency
    if (req.user.tenantContext.role === 'AGENCY_ADMIN') {
      createInvoiceDto.agencyId = req.user.tenantContext.agencyId;
      createInvoiceDto.clientId = undefined; // Ensure no clientId is set
    }
    
    return this.paymentService.createInvoice(createInvoiceDto);
  }

  @Get('invoices')
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiResponse({ status: 200, description: 'Invoices retrieved successfully' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by invoice status' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter by due date (start)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter by due date (end)' })
  findAllInvoices(
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Request() req?,
  ) {
    const where: any = {};
    
    // Filter based on tenant context
    if (req.user.tenantContext.role === 'ADMIN') {
      // Admin can see all invoices
    } else if (req.user.tenantContext.role === 'AGENCY_ADMIN') {
      where.agencyId = req.user.tenantContext.agencyId;
    } else if (req.user.tenantContext.role === 'CLIENT_ADMIN' || req.user.tenantContext.role === 'CLIENT_USER') {
      where.clientId = req.user.tenantContext.clientId;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (startDate || endDate) {
      where.dueDate = {};
      
      if (startDate) {
        where.dueDate.gte = new Date(startDate);
      }
      
      if (endDate) {
        where.dueDate.lte = new Date(endDate);
      }
    }
    
    return this.paymentService.findAllInvoices({
      where,
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
        agency: true,
        client: true,
      },
    });
  }

  @Get('invoices/:id')
  @ApiOperation({ summary: 'Get an invoice by ID' })
  @ApiResponse({ status: 200, description: 'Invoice retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  findInvoiceById(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.findInvoiceById(id);
  }

  @Patch('invoices/:id')
  @RequiresTenantType(['admin', 'agency_admin'])
  @ApiOperation({ summary: 'Update an invoice' })
  @ApiResponse({ status: 200, description: 'Invoice updated successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  updateInvoice(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.paymentService.updateInvoice(id, updateInvoiceDto);
  }

  @Delete('invoices/:id')
  @RequiresTenantType(['admin', 'agency_admin'])
  @ApiOperation({ summary: 'Delete an invoice' })
  @ApiResponse({ status: 200, description: 'Invoice deleted successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiResponse({ status: 400, description: 'Invoice has payments' })
  deleteInvoice(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.deleteInvoice(id);
  }

  // Payment endpoints
  @Post('payments')
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @Request() req,
  ) {
    // Set appropriate ID based on tenant context
    if (req.user.tenantContext.role === 'AGENCY_ADMIN') {
      createPaymentDto.agencyId = req.user.tenantContext.agencyId;
      createPaymentDto.clientId = undefined;
    } else if (req.user.tenantContext.role === 'CLIENT_ADMIN' || req.user.tenantContext.role === 'CLIENT_USER') {
      createPaymentDto.clientId = req.user.tenantContext.clientId;
      createPaymentDto.agencyId = undefined;
    }
    
    return this.paymentService.createPayment(createPaymentDto);
  }

  @Get('payments')
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  findAllPayments(@Request() req) {
    const where: any = {};
    
    // Filter based on tenant context
    if (req.user.tenantContext.role === 'ADMIN') {
      // Admin can see all payments
    } else if (req.user.tenantContext.role === 'AGENCY_ADMIN') {
      where.agencyId = req.user.tenantContext.agencyId;
    } else if (req.user.tenantContext.role === 'CLIENT_ADMIN' || req.user.tenantContext.role === 'CLIENT_USER') {
      where.clientId = req.user.tenantContext.clientId;
    }
    
    return this.paymentService.findAllPayments({
      where,
      include: {
        invoice: true,
      },
    });
  }

  @Get('payments/:id')
  @ApiOperation({ summary: 'Get a payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  findPaymentById(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.findPaymentById(id);
  }

  @Patch('payments/:id')
  @RequiresTenantType(['admin', 'agency_admin'])
  @ApiOperation({ summary: 'Update a payment' })
  @ApiResponse({ status: 200, description: 'Payment updated successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  updatePayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentService.updatePayment(id, updatePaymentDto);
  }

  @Delete('payments/:id')
  @RequiresTenantType(['admin', 'agency_admin'])
  @ApiOperation({ summary: 'Delete a payment' })
  @ApiResponse({ status: 200, description: 'Payment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  deletePayment(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.deletePayment(id);
  }

  // Payment Method endpoints
  @Post('payment-methods')
  @ApiOperation({ summary: 'Create a new payment method' })
  @ApiResponse({ status: 201, description: 'Payment method created successfully' })
  createPaymentMethod(
    @Body() createPaymentMethodDto: CreatePaymentMethodDto,
    @Request() req,
  ) {
    // Set appropriate ID based on tenant context
    if (req.user.tenantContext.role === 'AGENCY_ADMIN') {
      createPaymentMethodDto.agencyId = req.user.tenantContext.agencyId;
      createPaymentMethodDto.clientId = undefined;
    } else if (req.user.tenantContext.role === 'CLIENT_ADMIN' || req.user.tenantContext.role === 'CLIENT_USER') {
      createPaymentMethodDto.clientId = req.user.tenantContext.clientId;
      createPaymentMethodDto.agencyId = undefined;
    }
    
    return this.paymentService.createPaymentMethod(createPaymentMethodDto);
  }

  @Get('payment-methods')
  @ApiOperation({ summary: 'Get all payment methods' })
  @ApiResponse({ status: 200, description: 'Payment methods retrieved successfully' })
  findAllPaymentMethods(@Request() req) {
    const where: any = {};
    
    // Filter based on tenant context
    if (req.user.tenantContext.role === 'ADMIN') {
      // Admin can see all payment methods
    } else if (req.user.tenantContext.role === 'AGENCY_ADMIN') {
      where.agencyId = req.user.tenantContext.agencyId;
    } else if (req.user.tenantContext.role === 'CLIENT_ADMIN' || req.user.tenantContext.role === 'CLIENT_USER') {
      where.clientId = req.user.tenantContext.clientId;
    }
    
    return this.paymentService.findAllPaymentMethods({ where });
  }

  @Get('payment-methods/:id')
  @ApiOperation({ summary: 'Get a payment method by ID' })
  @ApiResponse({ status: 200, description: 'Payment method retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Payment method not found' })
  findPaymentMethodById(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.findPaymentMethodById(id);
  }

  @Patch('payment-methods/:id')
  @ApiOperation({ summary: 'Update a payment method' })
  @ApiResponse({ status: 200, description: 'Payment method updated successfully' })
  @ApiResponse({ status: 404, description: 'Payment method not found' })
  updatePaymentMethod(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ) {
    return this.paymentService.updatePaymentMethod(id, updatePaymentMethodDto);
  }

  @Delete('payment-methods/:id')
  @ApiOperation({ summary: 'Delete a payment method' })
  @ApiResponse({ status: 200, description: 'Payment method deleted successfully' })
  @ApiResponse({ status: 404, description: 'Payment method not found' })
  deletePaymentMethod(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.deletePaymentMethod(id);
  }

  // Utility endpoints
  @Get('client-subscriptions')
  @RequiresTenantType(['client_admin', 'client_user'])
  @ApiOperation({ summary: 'Get subscriptions for the current client' })
  @ApiResponse({ status: 200, description: 'Client subscriptions retrieved successfully' })
  getClientSubscriptions(@Request() req) {
    const clientId = req.user.tenantContext.clientId;
    return this.paymentService.getClientSubscriptions(clientId);
  }

  @Get('agency-subscriptions')
  @RequiresTenantType('agency_admin')
  @ApiOperation({ summary: 'Get subscriptions for the current agency' })
  @ApiResponse({ status: 200, description: 'Agency subscriptions retrieved successfully' })
  getAgencySubscriptions(@Request() req) {
    const agencyId = req.user.tenantContext.agencyId;
    return this.paymentService.getAgencySubscriptions(agencyId);
  }

  @Get('client-invoices')
  @RequiresTenantType(['client_admin', 'client_user'])
  @ApiOperation({ summary: 'Get invoices for the current client' })
  @ApiResponse({ status: 200, description: 'Client invoices retrieved successfully' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by invoice status' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter by due date (start)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter by due date (end)' })
  getClientInvoices(
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Request() req?,
  ) {
    const clientId = req.user.tenantContext.clientId;
    
    return this.paymentService.getClientInvoices(clientId, {
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
    });
  }

  @Get('agency-invoices')
  @RequiresTenantType('agency_admin')
  @ApiOperation({ summary: 'Get invoices for the current agency' })
  @ApiResponse({ status: 200, description: 'Agency invoices retrieved successfully' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by invoice status' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter by due date (start)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter by due date (end)' })
  getAgencyInvoices(
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Request() req?,
  ) {
    const agencyId = req.user.tenantContext.agencyId;
    
    return this.paymentService.getAgencyInvoices(agencyId, {
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
    });
  }

  @Get('client-payment-methods')
  @RequiresTenantType(['client_admin', 'client_user'])
  @ApiOperation({ summary: 'Get payment methods for the current client' })
  @ApiResponse({ status: 200, description: 'Client payment methods retrieved successfully' })
  getClientPaymentMethods(@Request() req) {
    const clientId = req.user.tenantContext.clientId;
    return this.paymentService.getClientPaymentMethods(clientId);
  }

  @Get('agency-payment-methods')
  @RequiresTenantType('agency_admin')
  @ApiOperation({ summary: 'Get payment methods for the current agency' })
  @ApiResponse({ status: 200, description: 'Agency payment methods retrieved successfully' })
  getAgencyPaymentMethods(@Request() req) {
    const agencyId = req.user.tenantContext.agencyId;
    return this.paymentService.getAgencyPaymentMethods(agencyId);
  }

  @Get('upcoming-invoices')
  @ApiOperation({ summary: 'Get upcoming invoices' })
  @ApiResponse({ status: 200, description: 'Upcoming invoices retrieved successfully' })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days in the future to look' })
  getUpcomingInvoices(
    @Query('days') days?: string,
    @Request() req?,
  ) {
    const params: any = {
      days: days ? parseInt(days) : 30,
    };
    
    // Set appropriate ID based on tenant context
    if (req.user.tenantContext.role === 'AGENCY_ADMIN') {
      params.agencyId = req.user.tenantContext.agencyId;
    } else if (req.user.tenantContext.role === 'CLIENT_ADMIN' || req.user.tenantContext.role === 'CLIENT_USER') {
      params.clientId = req.user.tenantContext.clientId;
    } else if (req.user.tenantContext.role === 'ADMIN') {
      // Admin needs to specify either agencyId or clientId in query params
      if (!req.query.agencyId && !req.query.clientId) {
        throw new BadRequestException('Either agencyId or clientId must be provided');
      }
      
      if (req.query.agencyId) {
        params.agencyId = req.query.agencyId;
      } else {
        params.clientId = req.query.clientId;
      }
    }
    
    return this.paymentService.getUpcomingInvoices(params);
  }

  @Get('overdue-invoices')
  @ApiOperation({ summary: 'Get overdue invoices' })
  @ApiResponse({ status: 200, description: 'Overdue invoices retrieved successfully' })
  getOverdueInvoices(@Request() req?) {
    const params: any = {};
    
    // Set appropriate ID based on tenant context
    if (req.user.tenantContext.role === 'AGENCY_ADMIN') {
      params.agencyId = req.user.tenantContext.agencyId;
    } else if (req.user.tenantContext.role === 'CLIENT_ADMIN' || req.user.tenantContext.role === 'CLIENT_USER') {
      params.clientId = req.user.tenantContext.clientId;
    } else if (req.user.tenantContext.role === 'ADMIN') {
      // Admin needs to specify either agencyId or clientId in query params
      if (!req.query.agencyId && !req.query.clientId) {
        throw new BadRequestException('Either agencyId or clientId must be provided');
      }
      
      if (req.query.agencyId) {
        params.agencyId = req.query.agencyId;
      } else {
        params.clientId = req.query.clientId;
      }
    }
    
    return this.paymentService.getOverdueInvoices(params);
  }

  @Get('payment-summary')
  @ApiOperation({ summary: 'Get payment summary' })
  @ApiResponse({ status: 200, description: 'Payment summary retrieved successfully' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter by payment date (start)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter by payment date (end)' })
  getPaymentSummary(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Request() req?,
  ) {
    const params: any = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
    
    // Set appropriate ID based on tenant context
    if (req.user.tenantContext.role === 'AGENCY_ADMIN') {
      params.agencyId = req.user.tenantContext.agencyId;
    } else if (req.user.tenantContext.role === 'CLIENT_ADMIN' || req.user.tenantContext.role === 'CLIENT_USER') {
      params.clientId = req.user.tenantContext.clientId;
    } else if (req.user.tenantContext.role === 'ADMIN') {
      // Admin needs to specify either agencyId or clientId in query params
      if (!req.query.agencyId && !req.query.clientId) {
        throw new BadRequestException('Either agencyId or clientId must be provided');
      }
      
      if (req.query.agencyId) {
        params.agencyId = req.query.agencyId;
      } else {
        params.clientId = req.query.clientId;
      }
    }
    
    return this.paymentService.getPaymentSummary(params);
  }
} 