import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { HealthModule } from './common/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { AgenciesModule } from './modules/agencies/agencies.module';
import { ClientsModule } from './modules/clients/clients.module';
import { DomainsModule } from './modules/domains/domains.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { DealsModule } from './modules/deals/deals.module';
import { ChatModule } from './modules/chat/chat.module';
import { FormsModule } from './modules/forms/forms.module';
import { PhoneSmsModule } from './modules/phone-sms/phone-sms.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ShopModule } from './modules/shop/shop.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SettingsModule } from './modules/settings/settings.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),

    // Database connection
    PrismaModule,
    
    // Health check
    HealthModule,
    
    // Core modules
    AuthModule,
    UsersModule,

    // Multi-tenancy modules
    TenantsModule,
    AgenciesModule,
    ClientsModule,
    DomainsModule,

    // Business modules
    ContactsModule,
    AppointmentsModule,
    DealsModule,
    ChatModule,
    FormsModule,
    PhoneSmsModule,
    ReviewsModule,
    ShopModule,
    CampaignsModule,
    AnalyticsModule,
    SettingsModule,
    PaymentModule,

    // Other modules will be added here as development progresses
  ],
  controllers: [],
  providers: [],
}) 