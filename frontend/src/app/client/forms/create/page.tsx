'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Layout, 
  Grid, 
  Type, 
  Settings, 
  Eye,
  Save,
  RotateCcw
} from 'lucide-react'
import { MultiStepFormBuilder } from '@/components/forms/multi-step-form-builder'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const templates = [
  {
    id: 'contact',
    name: 'Contact Form',
    description: 'Simple contact form with name, email, and message',
    icon: '📝',
    fields: [
      { type: 'text', label: 'Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'textarea', label: 'Message', required: true }
    ]
  },
  {
    id: 'survey',
    name: 'Customer Survey',
    description: 'Detailed customer feedback survey',
    icon: '📊',
    fields: [
      { type: 'text', label: 'Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'rating', label: 'How satisfied are you?', required: true },
      { type: 'textarea', label: 'What could we improve?', required: false }
    ]
  },
  {
    id: 'registration',
    name: 'User Registration',
    description: 'Multi-step registration form',
    icon: '👤',
    fields: [
      { type: 'text', label: 'Full Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'password', label: 'Password', required: true },
      { type: 'password', label: 'Confirm Password', required: true }
    ]
  }
]

export default function CreateFormPage() {
  const [activeTab, setActiveTab] = useState('design')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    steps: [],
    settings: {
      submitButtonText: 'Submit',
      successMessage: 'Thank you for your submission!',
      redirectUrl: '',
      enableCaptcha: true,
      notifyEmail: '',
      showRequiredIndicator: true,
      showLabels: true,
      showHelpText: true,
      requiredMessage: 'This field is required',
      emailMessage: 'Please enter a valid email address',
      theme: {
        primaryColor: '#0066cc',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderRadius: '4px',
      },
      customCss: '',
      customJs: '',
    }
  })
  const [previewMode, setPreviewMode] = useState(false)

  const handleSave = async () => {
    try {
      // TODO: Implement form saving
      console.log('Saving form:', formData)
    } catch (error) {
      console.error('Error saving form:', error)
    }
  }

  const handleTemplateSelect = (template: any) => {
    setFormData(prev => ({
      ...prev,
      steps: [
        {
          id: `step-${Date.now()}`,
          title: 'Step 1',
          description: '',
          fields: template.fields
        }
      ]
    }))
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Create New Form</h1>
          <p className="text-muted-foreground">Design your form layout and fields</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit Mode' : 'Preview'}
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Form
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Form Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Form Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="templates">
                <Layout className="h-4 w-4 mr-2" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="design">
                <Grid className="h-4 w-4 mr-2" />
                Design
              </TabsTrigger>
              <TabsTrigger value="fields">
                <Type className="h-4 w-4 mr-2" />
                Fields
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="templates">
              <div className="grid grid-cols-3 gap-4">
                {templates.map(template => (
                  <Card 
                    key={template.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span>{template.icon}</span>
                        {template.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="design">
              <Card>
                <CardContent className="p-6">
                  <MultiStepFormBuilder
                    initialSteps={formData.steps}
                    onStepsChange={(steps) => setFormData(prev => ({ ...prev, steps }))}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fields">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Field Properties</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Configure global field properties that apply to all form fields.
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Required Field Indicator</Label>
                            <p className="text-sm text-muted-foreground">
                              Show asterisk (*) next to required fields
                            </p>
                          </div>
                          <Switch
                            checked={formData.settings.showRequiredIndicator}
                            onCheckedChange={(checked) =>
                              setFormData(prev => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  showRequiredIndicator: checked
                                }
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Field Labels</Label>
                            <p className="text-sm text-muted-foreground">
                              Show labels above form fields
                            </p>
                          </div>
                          <Switch
                            checked={formData.settings.showLabels}
                            onCheckedChange={(checked) =>
                              setFormData(prev => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  showLabels: checked
                                }
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Field Help Text</Label>
                            <p className="text-sm text-muted-foreground">
                              Show help text below form fields
                            </p>
                          </div>
                          <Switch
                            checked={formData.settings.showHelpText}
                            onCheckedChange={(checked) =>
                              setFormData(prev => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  showHelpText: checked
                                }
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Validation Messages</h3>
                      <div className="space-y-4">
                        <div>
                          <Label>Required Field Message</Label>
                          <Input
                            value={formData.settings.requiredMessage}
                            onChange={(e) =>
                              setFormData(prev => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  requiredMessage: e.target.value
                                }
                              }))
                            }
                            placeholder="This field is required"
                          />
                        </div>
                        <div>
                          <Label>Email Validation Message</Label>
                          <Input
                            value={formData.settings.emailMessage}
                            onChange={(e) =>
                              setFormData(prev => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  emailMessage: e.target.value
                                }
                              }))
                            }
                            placeholder="Please enter a valid email address"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Form Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <Label>Submit Button Text</Label>
                          <Input
                            value={formData.settings.submitButtonText}
                            onChange={(e) =>
                              setFormData(prev => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  submitButtonText: e.target.value
                                }
                              }))
                            }
                            placeholder="Submit"
                          />
                        </div>
                        <div>
                          <Label>Success Message</Label>
                          <Textarea
                            value={formData.settings.successMessage}
                            onChange={(e) =>
                              setFormData(prev => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  successMessage: e.target.value
                                }
                              }))
                            }
                            placeholder="Thank you for your submission!"
                          />
                        </div>
                        <div>
                          <Label>Redirect URL</Label>
                          <Input
                            value={formData.settings.redirectUrl}
                            onChange={(e) =>
                              setFormData(prev => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  redirectUrl: e.target.value
                                }
                              }))
                            }
                            placeholder="https://example.com/thank-you"
                          />
                          <p className="text-sm text-muted-foreground mt-1">
                            Redirect users to this URL after form submission (optional)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Security & Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Enable reCAPTCHA</Label>
                            <p className="text-sm text-muted-foreground">
                              Protect your form from spam and abuse
                            </p>
                          </div>
                          <Switch
                            checked={formData.settings.enableCaptcha}
                            onCheckedChange={(checked) =>
                              setFormData(prev => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  enableCaptcha: checked
                                }
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label>Notification Email</Label>
                          <Input
                            type="email"
                            value={formData.settings.notifyEmail}
                            onChange={(e) =>
                              setFormData(prev => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  notifyEmail: e.target.value
                                }
                              }))
                            }
                            placeholder="notifications@example.com"
                          />
                          <p className="text-sm text-muted-foreground mt-1">
                            Receive email notifications for new submissions
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Appearance</h3>
                      <div className="space-y-4">
                        <div>
                          <Label>Primary Color</Label>
                          <Input
                            type="color"
                            value={formData.settings.theme.primaryColor}
                            onChange={(e) =>
                              setFormData(prev => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  theme: {
                                    ...prev.settings.theme,
                                    primaryColor: e.target.value
                                  }
                                }
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label>Background Color</Label>
                          <Input
                            type="color"
                            value={formData.settings.theme.backgroundColor}
                            onChange={(e) =>
                              setFormData(prev => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  theme: {
                                    ...prev.settings.theme,
                                    backgroundColor: e.target.value
                                  }
                                }
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label>Text Color</Label>
                          <Input
                            type="color"
                            value={formData.settings.theme.textColor}
                            onChange={(e) =>
                              setFormData(prev => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  theme: {
                                    ...prev.settings.theme,
                                    textColor: e.target.value
                                  }
                                }
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label>Border Radius</Label>
                          <Select
                            value={formData.settings.theme.borderRadius}
                            onValueChange={(value) =>
                              setFormData(prev => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  theme: {
                                    ...prev.settings.theme,
                                    borderRadius: value
                                  }
                                }
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select border radius" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">None</SelectItem>
                              <SelectItem value="4px">Small</SelectItem>
                              <SelectItem value="8px">Medium</SelectItem>
                              <SelectItem value="12px">Large</SelectItem>
                              <SelectItem value="16px">Extra Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Advanced</h3>
                      <div className="space-y-4">
                        <div>
                          <Label>Custom CSS</Label>
                          <Textarea
                            value={formData.settings.customCss}
                            onChange={(e) =>
                              setFormData(prev => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  customCss: e.target.value
                                }
                              }))
                            }
                            placeholder=".my-form { /* Custom styles */ }"
                            className="font-mono"
                          />
                          <p className="text-sm text-muted-foreground mt-1">
                            Add custom CSS styles to your form
                          </p>
                        </div>
                        <div>
                          <Label>Custom JavaScript</Label>
                          <Textarea
                            value={formData.settings.customJs}
                            onChange={(e) =>
                              setFormData(prev => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  customJs: e.target.value
                                }
                              }))
                            }
                            placeholder="// Custom JavaScript code"
                            className="font-mono"
                          />
                          <p className="text-sm text-muted-foreground mt-1">
                            Add custom JavaScript code to your form
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 