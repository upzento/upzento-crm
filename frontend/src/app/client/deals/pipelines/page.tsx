'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Search,
  Plus,
  MoreHorizontal,
  Trash2,
  Edit,
  Copy,
  Eye,
  ArrowUpDown,
  MoveVertical,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  ChevronRight,
  FileText
} from 'lucide-react';

// Mock data for pipelines
const pipelines = [
  {
    id: '1',
    name: 'Default Sales Pipeline',
    stages: [
      { id: '1-1', name: 'Qualification', color: '#3b82f6', dealCount: 3 },
      { id: '1-2', name: 'Discovery', color: '#6366f1', dealCount: 2 },
      { id: '1-3', name: 'Proposal', color: '#8b5cf6', dealCount: 4 },
      { id: '1-4', name: 'Negotiation', color: '#f59e0b', dealCount: 2 },
      { id: '1-5', name: 'Closed Won', color: '#10b981', dealCount: 5 },
      { id: '1-6', name: 'Closed Lost', color: '#ef4444', dealCount: 3 }
    ],
    dealCount: 19,
    isDefault: true,
    createdAt: '2023-01-15'
  },
  {
    id: '2',
    name: 'Enterprise Sales Pipeline',
    stages: [
      { id: '2-1', name: 'Initial Contact', color: '#3b82f6', dealCount: 2 },
      { id: '2-2', name: 'Needs Assessment', color: '#6366f1', dealCount: 1 },
      { id: '2-3', name: 'Solution Presentation', color: '#8b5cf6', dealCount: 1 },
      { id: '2-4', name: 'Technical Review', color: '#ec4899', dealCount: 0 },
      { id: '2-5', name: 'Business Case', color: '#f59e0b', dealCount: 1 },
      { id: '2-6', name: 'Contract Negotiation', color: '#d97706', dealCount: 0 },
      { id: '2-7', name: 'Closed Won', color: '#10b981', dealCount: 2 },
      { id: '2-8', name: 'Closed Lost', color: '#ef4444', dealCount: 1 }
    ],
    dealCount: 8,
    isDefault: false,
    createdAt: '2023-03-22'
  },
  {
    id: '3',
    name: 'SMB Sales Pipeline',
    stages: [
      { id: '3-1', name: 'Lead In', color: '#3b82f6', dealCount: 5 },
      { id: '3-2', name: 'Demo', color: '#8b5cf6', dealCount: 3 },
      { id: '3-3', name: 'Proposal', color: '#f59e0b', dealCount: 2 },
      { id: '3-4', name: 'Closed Won', color: '#10b981', dealCount: 7 },
      { id: '3-5', name: 'Closed Lost', color: '#ef4444', dealCount: 4 }
    ],
    dealCount: 21,
    isDefault: false,
    createdAt: '2023-05-10'
  }
];

export default function PipelinesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPipeline, setShowNewPipeline] = useState(false);
  const [newPipelineName, setNewPipelineName] = useState('');
  const [editingPipelineId, setEditingPipelineId] = useState<string | null>(null);
  const [editPipelineName, setEditPipelineName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingStages, setEditingStages] = useState<any[]>([]);
  const [newStageName, setNewStageName] = useState('');
  const [newStageColor, setNewStageColor] = useState('#3b82f6');
  
  // Filter pipelines based on search query
  const filteredPipelines = pipelines.filter(pipeline => 
    pipeline.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Start editing pipeline
  const startEditPipeline = (pipeline: any) => {
    setEditingPipelineId(pipeline.id);
    setEditPipelineName(pipeline.name);
    setEditingStages([...pipeline.stages]);
    setErrorMessage('');
  };
  
  // Cancel editing pipeline
  const cancelEditPipeline = () => {
    setEditingPipelineId(null);
    setEditPipelineName('');
    setEditingStages([]);
    setErrorMessage('');
  };
  
  // Save edited pipeline
  const saveEditPipeline = () => {
    // Validate input
    if (!editPipelineName.trim()) {
      setErrorMessage('Pipeline name cannot be empty');
      return;
    }
    
    if (editingStages.length < 2) {
      setErrorMessage('Pipeline must have at least 2 stages');
      return;
    }
    
    // In a real app, this would update the pipeline in the database
    setSuccessMessage('Pipeline updated successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
    
    // Reset form
    setEditingPipelineId(null);
    setEditPipelineName('');
    setEditingStages([]);
  };
  
  // Create new pipeline
  const createPipeline = () => {
    // Validate input
    if (!newPipelineName.trim()) {
      setErrorMessage('Pipeline name cannot be empty');
      return;
    }
    
    // In a real app, this would create a new pipeline in the database
    setSuccessMessage('Pipeline created successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
    
    // Reset form
    setNewPipelineName('');
    setShowNewPipeline(false);
  };
  
  // Add new stage
  const addStage = () => {
    // Validate input
    if (!newStageName.trim()) {
      setErrorMessage('Stage name cannot be empty');
      return;
    }
    
    // Add new stage
    const newStage = {
      id: `new-${Date.now()}`,
      name: newStageName,
      color: newStageColor,
      dealCount: 0
    };
    
    setEditingStages([...editingStages, newStage]);
    setNewStageName('');
    setNewStageColor('#3b82f6');
    setErrorMessage('');
  };
  
  // Remove stage
  const removeStage = (stageId: string) => {
    setEditingStages(editingStages.filter(stage => stage.id !== stageId));
  };
  
  // Move stage up
  const moveStageUp = (index: number) => {
    if (index === 0) return;
    
    const newStages = [...editingStages];
    const temp = newStages[index];
    newStages[index] = newStages[index - 1];
    newStages[index - 1] = temp;
    
    setEditingStages(newStages);
  };
  
  // Move stage down
  const moveStageDown = (index: number) => {
    if (index === editingStages.length - 1) return;
    
    const newStages = [...editingStages];
    const temp = newStages[index];
    newStages[index] = newStages[index + 1];
    newStages[index + 1] = temp;
    
    setEditingStages(newStages);
  };
  
  // Update stage field
  const updateStageField = (index: number, field: string, value: string) => {
    const newStages = [...editingStages];
    newStages[index] = { ...newStages[index], [field]: value };
    setEditingStages(newStages);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <a href="/client/deals">
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Sales Pipelines</h1>
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Create and manage your sales pipelines and stages
        </p>
        <Button onClick={() => setShowNewPipeline(!showNewPipeline)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Pipeline
        </Button>
      </div>
      
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}
      
      {showNewPipeline && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Pipeline</CardTitle>
            <CardDescription>
              Set up a new sales pipeline with custom stages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="pipelineName" className="text-sm font-medium">Pipeline Name</label>
              <Input
                id="pipelineName"
                value={newPipelineName}
                onChange={(e) => setNewPipelineName(e.target.value)}
                placeholder="Enter pipeline name"
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Default Stages</h3>
              <p className="text-sm text-muted-foreground">
                Your pipeline will be created with default stages. You can customize them after creation.
              </p>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {pipelines[0].stages.map((stage) => (
                  <Badge 
                    key={stage.id} 
                    variant="outline" 
                    style={{ backgroundColor: `${stage.color}20`, borderColor: stage.color, color: stage.color }}
                  >
                    {stage.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowNewPipeline(false)}>
              Cancel
            </Button>
            <Button onClick={createPipeline}>
              Create Pipeline
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>All Pipelines</CardTitle>
          <CardDescription>
            Manage your sales pipelines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pipelines..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pipeline Name</TableHead>
                  <TableHead>Stages</TableHead>
                  <TableHead>Deals</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPipelines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No pipelines found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPipelines.map((pipeline) => (
                    <TableRow key={pipeline.id}>
                      <TableCell>
                        <div className="font-medium">{pipeline.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Created on {pipeline.createdAt}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {pipeline.stages.map((stage) => (
                            <Badge 
                              key={stage.id} 
                              variant="outline" 
                              style={{ backgroundColor: `${stage.color}20`, borderColor: stage.color, color: stage.color }}
                              className="text-xs"
                            >
                              {stage.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{pipeline.dealCount}</TableCell>
                      <TableCell>
                        {pipeline.isDefault ? (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Default</Badge>
                        ) : (
                          <Badge variant="outline">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => startEditPipeline(pipeline)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" /> Duplicate
                            </DropdownMenuItem>
                            {!pipeline.isDefault && (
                              <DropdownMenuItem>
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Set as Default
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {!pipeline.isDefault && pipeline.dealCount === 0 && (
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {editingPipelineId && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Pipeline</CardTitle>
            <CardDescription>
              Customize pipeline stages and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="editPipelineName" className="text-sm font-medium">Pipeline Name</label>
              <Input
                id="editPipelineName"
                value={editPipelineName}
                onChange={(e) => setEditPipelineName(e.target.value)}
                placeholder="Enter pipeline name"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Pipeline Stages</h3>
                <p className="text-sm text-muted-foreground">
                  Drag to reorder stages
                </p>
              </div>
              
              <div className="space-y-2">
                {editingStages.map((stage, index) => (
                  <div 
                    key={stage.id} 
                    className="flex items-center gap-2 p-3 border rounded-md bg-muted/50"
                  >
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <Input
                        value={stage.name}
                        onChange={(e) => updateStageField(index, 'name', e.target.value)}
                        placeholder="Stage name"
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={stage.color}
                          onChange={(e) => updateStageField(index, 'color', e.target.value)}
                          className="w-10 h-10 p-1"
                        />
                        <div className="flex-1 flex items-center border rounded-md px-3">
                          <div 
                            className="h-4 w-4 rounded-full mr-2" 
                            style={{ backgroundColor: stage.color }}
                          ></div>
                          <span className="text-sm">{stage.color}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {stage.dealCount} deals
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => moveStageUp(index)}
                        disabled={index === 0}
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeStage(stage.id)}
                        disabled={editingStages.length <= 2 || stage.dealCount > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 border-t pt-4">
                <h4 className="text-sm font-medium">Add New Stage</h4>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label htmlFor="newStageName" className="text-xs text-muted-foreground">Stage Name</label>
                    <Input
                      id="newStageName"
                      value={newStageName}
                      onChange={(e) => setNewStageName(e.target.value)}
                      placeholder="Enter stage name"
                    />
                  </div>
                  <div>
                    <label htmlFor="newStageColor" className="text-xs text-muted-foreground">Color</label>
                    <Input
                      id="newStageColor"
                      type="color"
                      value={newStageColor}
                      onChange={(e) => setNewStageColor(e.target.value)}
                      className="w-10 h-10 p-1"
                    />
                  </div>
                  <Button onClick={addStage}>
                    Add Stage
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={cancelEditPipeline}>
              Cancel
            </Button>
            <Button onClick={saveEditPipeline}>
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Best Practices</CardTitle>
            <CardDescription>
              Tips for effective sales pipeline management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Keep it simple</p>
                  <p className="text-sm text-muted-foreground">
                    Start with 5-7 stages that reflect your actual sales process. Too many stages can become unwieldy.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Define clear stage criteria</p>
                  <p className="text-sm text-muted-foreground">
                    Establish specific criteria for when a deal should move from one stage to the next.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Create multiple pipelines for different processes</p>
                  <p className="text-sm text-muted-foreground">
                    Consider separate pipelines for different products, services, or customer segments.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Regularly review and optimize</p>
                  <p className="text-sm text-muted-foreground">
                    Analyze where deals get stuck and refine your pipeline stages accordingly.
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Templates</CardTitle>
            <CardDescription>
              Common pipeline structures for different sales processes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">B2B Sales Pipeline</h3>
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="outline" style={{ backgroundColor: '#3b82f620', borderColor: '#3b82f6', color: '#3b82f6' }}>Lead In</Badge>
                  <Badge variant="outline" style={{ backgroundColor: '#6366f120', borderColor: '#6366f1', color: '#6366f1' }}>Qualification</Badge>
                  <Badge variant="outline" style={{ backgroundColor: '#8b5cf620', borderColor: '#8b5cf6', color: '#8b5cf6' }}>Meeting</Badge>
                  <Badge variant="outline" style={{ backgroundColor: '#ec489920', borderColor: '#ec4899', color: '#ec4899' }}>Needs Analysis</Badge>
                  <Badge variant="outline" style={{ backgroundColor: '#f59e0b20', borderColor: '#f59e0b', color: '#f59e0b' }}>Proposal</Badge>
                  <Badge variant="outline" style={{ backgroundColor: '#d9770620', borderColor: '#d97706', color: '#d97706' }}>Negotiation</Badge>
                  <Badge variant="outline" style={{ backgroundColor: '#10b98120', borderColor: '#10b981', color: '#10b981' }}>Closed Won</Badge>
                  <Badge variant="outline" style={{ backgroundColor: '#ef444420', borderColor: '#ef4444', color: '#ef4444' }}>Closed Lost</Badge>
                </div>
                <Button variant="outline" size="sm">Use Template</Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">E-commerce Sales Pipeline</h3>
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="outline" style={{ backgroundColor: '#3b82f620', borderColor: '#3b82f6', color: '#3b82f6' }}>Cart Created</Badge>
                  <Badge variant="outline" style={{ backgroundColor: '#6366f120', borderColor: '#6366f1', color: '#6366f1' }}>Checkout Started</Badge>
                  <Badge variant="outline" style={{ backgroundColor: '#8b5cf620', borderColor: '#8b5cf6', color: '#8b5cf6' }}>Payment Pending</Badge>
                  <Badge variant="outline" style={{ backgroundColor: '#10b98120', borderColor: '#10b981', color: '#10b981' }}>Purchased</Badge>
                  <Badge variant="outline" style={{ backgroundColor: '#ef444420', borderColor: '#ef4444', color: '#ef4444' }}>Abandoned</Badge>
                </div>
                <Button variant="outline" size="sm">Use Template</Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Service Business Pipeline</h3>
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="outline" style={{ backgroundColor: '#3b82f620', borderColor: '#3b82f6', color: '#3b82f6' }}>Inquiry</Badge>
                  <Badge variant="outline" style={{ backgroundColor: '#6366f120', borderColor: '#6366f1', color: '#6366f1' }}>Consultation</Badge>
                  <Badge variant="outline" style={{ backgroundColor: '#8b5cf620', borderColor: '#8b5cf6', color: '#8b5cf6' }}>Proposal</Badge>
                  <Badge variant="outline" style={{ backgroundColor: '#f59e0b20', borderColor: '#f59e0b', color: '#f59e0b' }}>Follow-up</Badge>
                  <Badge variant="outline" style={{ backgroundColor: '#10b98120', borderColor: '#10b981', color: '#10b981' }}>Closed Won</Badge>
                  <Badge variant="outline" style={{ backgroundColor: '#ef444420', borderColor: '#ef4444', color: '#ef4444' }}>Closed Lost</Badge>
                </div>
                <Button variant="outline" size="sm">Use Template</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 