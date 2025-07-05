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
    steps: []
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
                  {/* Field configuration panel will go here */}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardContent className="p-6">
                  {/* Form settings will go here */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 