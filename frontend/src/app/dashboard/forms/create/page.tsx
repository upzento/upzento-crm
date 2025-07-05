'use client';

import React from 'react';
import { FormBuilder } from '@/components/forms/form-builder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateFormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    isPublic: false,
    fields: [],
  });

  const handleFormSubmit = async () => {
    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create form');
      }

      const data = await response.json();
      router.push(`/dashboard/forms/${data.id}`);
    } catch (error) {
      console.error('Error creating form:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Create New Form</h1>
        <Button onClick={() => router.back()}>Back</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Form Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter form name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter form description"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="active">Active</Label>
                  <p className="text-sm text-gray-500">
                    Form is available for submissions
                  </p>
                </div>
                <Switch
                  id="active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="public">Public</Label>
                  <p className="text-sm text-gray-500">
                    Form can be accessed without authentication
                  </p>
                </div>
                <Switch
                  id="public"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isPublic: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg bg-gray-50">
                <h2 className="text-lg font-semibold">{formData.name || 'Untitled Form'}</h2>
                {formData.description && (
                  <p className="text-sm text-gray-600 mt-1">{formData.description}</p>
                )}
                {/* Add form field previews here */}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Form Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <FormBuilder
              initialFields={formData.fields}
              onFieldsChange={(fields) =>
                setFormData({ ...formData, fields })
              }
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleFormSubmit}>Create Form</Button>
      </div>
    </div>
  );
} 