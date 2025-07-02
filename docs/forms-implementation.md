# Forms Module Implementation

## Overview

The Forms Module provides a comprehensive solution for creating, managing, and embedding custom forms within the Upzento CRM platform. This module enables clients to build forms with a drag-and-drop interface, collect and manage submissions, and securely embed forms on their websites with domain verification.

## Core Features

### 1. Form Builder

- **Drag-and-Drop Interface**: Intuitive builder for creating forms without coding
- **Multiple Field Types**: Support for text, email, phone, textarea, select, checkbox, radio, date, file upload, and rating fields
- **Multi-Step Forms**: Create forms with multiple pages/steps
- **Conditional Logic**: Show/hide fields based on user responses
- **Form Styling**: Customize appearance with themes and branding options
- **Form Settings**: Configure submission behavior, success messages, and redirects

### 2. Form Management

- **Form Dashboard**: Central location to view and manage all forms
- **Form Analytics**: Track submission rates, completion rates, and other metrics
- **Form Status**: Enable/disable forms as needed
- **Form Duplication**: Clone existing forms for quick creation
- **Form Categories**: Organize forms by type or purpose

### 3. Submission Management

- **Submission Dashboard**: View and filter all form submissions
- **Submission Details**: Examine individual submission data
- **Submission Export**: Download submissions in CSV/Excel format
- **Submission Notifications**: Receive alerts for new submissions
- **Submission Status Tracking**: Mark submissions as viewed, flagged, or archived

### 4. Form Embedding

- **Embed Code Generation**: JavaScript and iframe embedding options
- **Domain Verification**: Restrict form usage to authorized domains only
- **Responsive Design**: Forms adapt to all screen sizes
- **Custom Styling**: Match form appearance to website branding
- **CAPTCHA Protection**: Prevent spam submissions

### 5. Integration Capabilities

- **Contact Creation**: Create contacts from form submissions
- **Deal Association**: Link submissions to deals
- **Webhook Support**: Send submission data to external systems
- **Email Notifications**: Configure email alerts for submissions
- **API Access**: Programmatically access form data

## Technical Implementation

### Frontend Components

1. **Form Builder Interface**
   - Drag-and-drop field management
   - Field configuration panel
   - Form preview
   - Form settings panel

2. **Form Management Dashboard**
   - Form listing with search and filtering
   - Form analytics and metrics
   - Form status controls

3. **Submission Management Interface**
   - Submission listing with search and filtering
   - Submission detail view
   - Submission export options

4. **Embed Management Interface**
   - Embed code generation
   - Domain management
   - Embed settings configuration

### Backend Services

1. **Form Service**
   - Form CRUD operations
   - Form validation and sanitization
   - Form version management

2. **Submission Service**
   - Submission processing and storage
   - Submission validation
   - Spam protection

3. **Embed Service**
   - Domain verification
   - Embed code generation
   - Cross-origin resource management

4. **Integration Service**
   - Webhook management
   - Contact/deal integration
   - Email notification handling

### Database Schema

The module extends the Prisma schema with the following models:

```prisma
model Form {
  id            String   @id @default(cuid())
  name          String
  description   String?
  status        String   // active, inactive, draft
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  tenantId      String
  
  // Relations
  fields        FormField[]
  steps         FormStep[]
  submissions   FormSubmission[]
  settings      FormSettings?
  webhooks      FormWebhook[]
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
}

model FormField {
  id            String   @id @default(cuid())
  formId        String
  type          String   // text, email, phone, textarea, select, checkbox, radio, date, file, rating
  label         String
  placeholder   String?
  required      Boolean  @default(false)
  order         Int
  stepId        String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  form          Form     @relation(fields: [formId], references: [id], onDelete: Cascade)
  step          FormStep? @relation(fields: [stepId], references: [id])
  options       FormFieldOption[]
  validations   FormFieldValidation[]
}

model FormFieldOption {
  id            String   @id @default(cuid())
  fieldId       String
  label         String
  value         String
  order         Int
  
  // Relations
  field         FormField @relation(fields: [fieldId], references: [id], onDelete: Cascade)
}

model FormFieldValidation {
  id            String   @id @default(cuid())
  fieldId       String
  type          String   // required, email, min, max, pattern
  value         String?
  message       String?
  
  // Relations
  field         FormField @relation(fields: [fieldId], references: [id], onDelete: Cascade)
}

model FormStep {
  id            String   @id @default(cuid())
  formId        String
  title         String
  description   String?
  order         Int
  
  // Relations
  form          Form     @relation(fields: [formId], references: [id], onDelete: Cascade)
  fields        FormField[]
}

model FormSettings {
  id                String   @id @default(cuid())
  formId            String   @unique
  submitButtonText  String   @default("Submit")
  successMessage    String?
  redirectUrl       String?
  enableCaptcha     Boolean  @default(true)
  notifyEmail       String?
  theme             String   @default("default")
  
  // Relations
  form              Form     @relation(fields: [formId], references: [id], onDelete: Cascade)
}

model FormSubmission {
  id            String   @id @default(cuid())
  formId        String
  data          Json
  status        String   @default("new") // new, viewed, flagged, archived
  ipAddress     String?
  userAgent     String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  form          Form     @relation(fields: [formId], references: [id])
  contactId     String?
  contact       Contact? @relation(fields: [contactId], references: [id])
}

model FormWebhook {
  id            String   @id @default(cuid())
  formId        String
  url           String
  secret        String?
  active        Boolean  @default(true)
  events        String[] // submission_created, submission_updated
  
  // Relations
  form          Form     @relation(fields: [formId], references: [id], onDelete: Cascade)
}

model FormDomain {
  id            String   @id @default(cuid())
  domain        String
  verified      Boolean  @default(false)
  tenantId      String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  tenant        Tenant   @relation(fields: [tenantId], references: [id])
}
```

## API Endpoints

### Forms Management

- `GET /forms` - List all forms
- `POST /forms` - Create new form
- `GET /forms/:id` - Get form details
- `PATCH /forms/:id` - Update form
- `DELETE /forms/:id` - Delete form
- `POST /forms/:id/duplicate` - Duplicate form

### Form Fields Management

- `GET /forms/:formId/fields` - List form fields
- `POST /forms/:formId/fields` - Add field to form
- `PATCH /forms/:formId/fields/:fieldId` - Update field
- `DELETE /forms/:formId/fields/:fieldId` - Delete field
- `POST /forms/:formId/fields/:fieldId/options` - Add field option
- `PATCH /forms/:formId/fields/:fieldId/options/:optionId` - Update field option
- `DELETE /forms/:formId/fields/:fieldId/options/:optionId` - Delete field option

### Form Steps Management

- `GET /forms/:formId/steps` - List form steps
- `POST /forms/:formId/steps` - Add step to form
- `PATCH /forms/:formId/steps/:stepId` - Update step
- `DELETE /forms/:formId/steps/:stepId` - Delete step

### Form Settings

- `GET /forms/:formId/settings` - Get form settings
- `PATCH /forms/:formId/settings` - Update form settings

### Submissions Management

- `GET /forms/:formId/submissions` - List form submissions
- `GET /forms/:formId/submissions/:submissionId` - Get submission details
- `PATCH /forms/:formId/submissions/:submissionId` - Update submission status
- `DELETE /forms/:formId/submissions/:submissionId` - Delete submission
- `GET /forms/:formId/submissions/export` - Export submissions

### Embed Management

- `GET /forms/:formId/embed` - Get embed code
- `GET /forms/:formId/domains` - List allowed domains
- `POST /forms/:formId/domains` - Add allowed domain
- `DELETE /forms/:formId/domains/:domainId` - Remove allowed domain

### Public Endpoints

- `GET /forms-embed/:id` - Get embeddable form (public)
- `POST /forms-embed/:id/submit` - Submit form (public)

## Integration Points

### 1. Contacts Module

- Create or update contacts from form submissions
- Associate form submissions with existing contacts
- Use contact data for form prefilling

### 2. Deals Module

- Create deals from form submissions
- Associate form submissions with existing deals
- Track deal source from forms

### 3. Marketing Campaigns Module

- Embed forms in marketing campaigns
- Track form submissions from campaigns
- Use form data for campaign segmentation

### 4. Analytics Module

- Track form performance metrics
- Analyze submission patterns
- Monitor conversion rates

## Security & Compliance

### 1. Data Protection

- Form data encryption in transit and at rest
- Secure file uploads with virus scanning
- Data retention policies for submissions

### 2. Domain Verification

- Strict domain validation for form embedding
- Prevention of unauthorized form usage
- Domain ownership verification process

### 3. CAPTCHA & Anti-Spam

- Google reCAPTCHA integration
- Rate limiting for submissions
- IP-based spam detection

### 4. GDPR Compliance

- Consent tracking for data collection
- Data export capabilities
- Data deletion workflows

## User Experience Considerations

1. **Intuitive Builder**: Drag-and-drop interface accessible to non-technical users
2. **Mobile Responsiveness**: Forms work seamlessly on all devices
3. **Performance**: Fast loading and submission processing
4. **Accessibility**: WCAG-compliant form elements
5. **Error Handling**: Clear validation messages for users

## Future Enhancements

1. **Advanced Logic**:
   - Complex conditional logic with multiple conditions
   - Calculation fields for dynamic values
   - Form branching based on user responses

2. **Enhanced Integration**:
   - Integration with payment processors
   - Connection to third-party CRM systems
   - Integration with marketing automation platforms

3. **Advanced Analytics**:
   - Heatmaps for form interaction
   - Funnel analysis for multi-step forms
   - A/B testing for form variations

4. **AI-Powered Features**:
   - Smart form suggestions based on business type
   - Automated response categorization
   - Sentiment analysis for text responses

## Implementation Timeline

1. **Phase 1** - Core Functionality:
   - Basic form builder
   - Submission management
   - Simple embedding

2. **Phase 2** - Enhanced Features:
   - Multi-step forms
   - Conditional logic
   - Advanced field types
   - Domain verification

3. **Phase 3** - Advanced Capabilities:
   - Integrations with other modules
   - Advanced analytics
   - Webhook support
   - API access 