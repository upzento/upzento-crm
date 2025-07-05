'use client'

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, GripVertical, ArrowLeft, ArrowRight } from 'lucide-react';
import { FormBuilder } from './form-builder';

interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: any[];
}

interface MultiStepFormBuilderProps {
  initialSteps?: FormStep[];
  onStepsChange: (steps: FormStep[]) => void;
}

export const MultiStepFormBuilder: React.FC<MultiStepFormBuilderProps> = ({
  initialSteps = [],
  onStepsChange,
}) => {
  const [steps, setSteps] = useState<FormStep[]>(initialSteps);
  const [activeStep, setActiveStep] = useState(0);

  const addStep = () => {
    const newStep: FormStep = {
      id: `step-${Date.now()}`,
      title: `Step ${steps.length + 1}`,
      description: '',
      fields: [],
    };
    const updatedSteps = [...steps, newStep];
    setSteps(updatedSteps);
    onStepsChange(updatedSteps);
    setActiveStep(steps.length);
  };

  const updateStep = (index: number, updates: Partial<FormStep>) => {
    const updatedSteps = steps.map((step, i) =>
      i === index ? { ...step, ...updates } : step
    );
    setSteps(updatedSteps);
    onStepsChange(updatedSteps);
  };

  const removeStep = (index: number) => {
    if (steps.length <= 1) return;
    const updatedSteps = steps.filter((_, i) => i !== index);
    setSteps(updatedSteps);
    onStepsChange(updatedSteps);
    if (activeStep >= updatedSteps.length) {
      setActiveStep(updatedSteps.length - 1);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSteps(items);
    onStepsChange(items);
    setActiveStep(result.destination.index);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="w-64 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Form Steps</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="steps">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-1 p-2"
                    >
                      {steps.map((step, index) => (
                        <Draggable
                          key={step.id}
                          draggableId={step.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center justify-between p-2 rounded-md border ${
                                activeStep === index
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-background hover:bg-accent hover:text-accent-foreground'
                              }`}
                              onClick={() => setActiveStep(index)}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="flex items-center gap-2"
                              >
                                <GripVertical className="h-4 w-4" />
                                <span className="text-sm">{step.title}</span>
                              </div>
                              {steps.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeStep(index);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
          <Button onClick={addStep} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </div>

        <div className="flex-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Step {activeStep + 1} Configuration</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure the current step and its fields
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setActiveStep(Math.min(steps.length - 1, activeStep + 1))
                  }
                  disabled={activeStep === steps.length - 1}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Step Title"
                  value={steps[activeStep]?.title || ''}
                  onChange={(e) =>
                    updateStep(activeStep, { title: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Step Description (optional)"
                  value={steps[activeStep]?.description || ''}
                  onChange={(e) =>
                    updateStep(activeStep, { description: e.target.value })
                  }
                />
              </div>

              <FormBuilder
                initialFields={steps[activeStep]?.fields || []}
                onFieldsChange={(fields) =>
                  updateStep(activeStep, { fields })
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 