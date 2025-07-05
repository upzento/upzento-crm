'use client'

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Switch } from '../ui/switch';
import { Trash2, Plus, GripVertical } from 'lucide-react';

interface FormField {
  id: string;
  label: string;
  type: string;
  isRequired: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
  validation?: Record<string, any>;
}

interface FormBuilderProps {
  initialFields?: FormField[];
  onFieldsChange: (fields: FormField[]) => void;
}

const fieldTypes = [
  { value: 'text', label: 'Text Input' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'tel', label: 'Phone' },
  { value: 'select', label: 'Dropdown' },
  { value: 'radio', label: 'Radio Group' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'date', label: 'Date Picker' },
];

export const FormBuilder: React.FC<FormBuilderProps> = ({
  initialFields = [],
  onFieldsChange,
}) => {
  const [fields, setFields] = useState<FormField[]>(initialFields);

  const addField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      label: 'New Field',
      type: 'text',
      isRequired: false,
    };
    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    onFieldsChange(updatedFields);
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const updatedFields = fields.map((field, i) =>
      i === index ? { ...field, ...updates } : field
    );
    setFields(updatedFields);
    onFieldsChange(updatedFields);
  };

  const removeField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
    onFieldsChange(updatedFields);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFields(items);
    onFieldsChange(items);
  };

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="form-fields">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {fields.map((field, index) => (
                <Draggable
                  key={field.id}
                  draggableId={field.id}
                  index={index}
                >
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="border border-gray-200"
                    >
                      <CardHeader
                        className="flex flex-row items-center justify-between p-4"
                        {...provided.dragHandleProps}
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="text-gray-400" />
                          <h3 className="text-sm font-medium">Field {index + 1}</h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeField(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="grid gap-4">
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              placeholder="Field Label"
                              value={field.label}
                              onChange={(e) =>
                                updateField(index, { label: e.target.value })
                              }
                            />
                            <Select
                              value={field.type}
                              onValueChange={(value) =>
                                updateField(index, { type: value })
                              }
                            >
                              {fieldTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </Select>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={field.isRequired}
                              onCheckedChange={(checked) =>
                                updateField(index, { isRequired: checked })
                              }
                            />
                            <span className="text-sm">Required field</span>
                          </div>
                          {(field.type === 'select' || field.type === 'radio') && (
                            <Input
                              placeholder="Options (comma-separated)"
                              value={field.options?.join(', ') || ''}
                              onChange={(e) =>
                                updateField(index, {
                                  options: e.target.value.split(',').map((s) => s.trim()),
                                })
                              }
                            />
                          )}
                          <Input
                            placeholder="Placeholder text"
                            value={field.placeholder || ''}
                            onChange={(e) =>
                              updateField(index, { placeholder: e.target.value })
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button onClick={addField} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Field
      </Button>
    </div>
  );
}; 