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
  Tag,
  Trash2,
  Edit,
  Save,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Mock data for tags
const initialTags = [
  { id: '1', name: 'VIP', color: '#FF6B6B', contactCount: 12 },
  { id: '2', name: 'Enterprise', color: '#4ECDC4', contactCount: 28 },
  { id: '3', name: 'SMB', color: '#FFD166', contactCount: 45 },
  { id: '4', name: 'Hot Lead', color: '#FF9F1C', contactCount: 17 },
  { id: '5', name: 'Cold Lead', color: '#6B9BFF', contactCount: 23 },
  { id: '6', name: 'Partner', color: '#A177FF', contactCount: 9 },
  { id: '7', name: 'Technical', color: '#5D576B', contactCount: 14 },
  { id: '8', name: 'Consultant', color: '#8AC926', contactCount: 6 }
];

export default function TagsPage() {
  const [tags, setTags] = useState(initialTags);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#4ECDC4');
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editTagName, setEditTagName] = useState('');
  const [editTagColor, setEditTagColor] = useState('');
  const [showNewTagForm, setShowNewTagForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Filter tags based on search query
  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Add new tag
  const addTag = () => {
    // Validate input
    if (!newTagName.trim()) {
      setErrorMessage('Tag name cannot be empty');
      return;
    }
    
    // Check for duplicate tag name
    if (tags.some(tag => tag.name.toLowerCase() === newTagName.toLowerCase())) {
      setErrorMessage('A tag with this name already exists');
      return;
    }
    
    // Add new tag
    const newTag = {
      id: `${tags.length + 1}`,
      name: newTagName,
      color: newTagColor,
      contactCount: 0
    };
    
    setTags([...tags, newTag]);
    setNewTagName('');
    setNewTagColor('#4ECDC4');
    setShowNewTagForm(false);
    setSuccessMessage('Tag created successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  // Start editing tag
  const startEditTag = (tag: any) => {
    setEditingTagId(tag.id);
    setEditTagName(tag.name);
    setEditTagColor(tag.color);
    setErrorMessage('');
  };
  
  // Cancel editing tag
  const cancelEditTag = () => {
    setEditingTagId(null);
    setEditTagName('');
    setEditTagColor('');
    setErrorMessage('');
  };
  
  // Save edited tag
  const saveEditTag = (tagId: string) => {
    // Validate input
    if (!editTagName.trim()) {
      setErrorMessage('Tag name cannot be empty');
      return;
    }
    
    // Check for duplicate tag name
    if (tags.some(tag => tag.id !== tagId && tag.name.toLowerCase() === editTagName.toLowerCase())) {
      setErrorMessage('A tag with this name already exists');
      return;
    }
    
    // Update tag
    setTags(tags.map(tag => 
      tag.id === tagId ? { ...tag, name: editTagName, color: editTagColor } : tag
    ));
    
    setEditingTagId(null);
    setEditTagName('');
    setEditTagColor('');
    setSuccessMessage('Tag updated successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  // Delete tag
  const deleteTag = (tagId: string) => {
    const tagToDelete = tags.find(tag => tag.id === tagId);
    if (tagToDelete && tagToDelete.contactCount > 0) {
      setErrorMessage(`Cannot delete tag "${tagToDelete.name}" because it is used by ${tagToDelete.contactCount} contacts`);
      return;
    }
    
    setTags(tags.filter(tag => tag.id !== tagId));
    setSuccessMessage('Tag deleted successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <a href="/client/contacts">
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Contact Tags</h1>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Manage Tags</CardTitle>
              <CardDescription>
                Create and manage tags for organizing contacts
              </CardDescription>
            </div>
            <Button onClick={() => setShowNewTagForm(!showNewTagForm)}>
              <Plus className="mr-2 h-4 w-4" />
              New Tag
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
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
          
          {showNewTagForm && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Tag</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="newTagName" className="text-sm font-medium">Tag Name</label>
                    <Input
                      id="newTagName"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Enter tag name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="newTagColor" className="text-sm font-medium">Tag Color</label>
                    <div className="flex gap-2">
                      <Input
                        id="newTagColor"
                        type="color"
                        value={newTagColor}
                        onChange={(e) => setNewTagColor(e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <div className="flex-1 flex items-center border rounded-md px-3">
                        <div 
                          className="h-4 w-4 rounded-full mr-2" 
                          style={{ backgroundColor: newTagColor }}
                        ></div>
                        <span>{newTagColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewTagForm(false)}>
                  Cancel
                </Button>
                <Button onClick={addTag}>
                  Create Tag
                </Button>
              </CardFooter>
            </Card>
          )}
          
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tags..."
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
                  <TableHead>Tag</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Contacts</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTags.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No tags found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell>
                        {editingTagId === tag.id ? (
                          <Input
                            value={editTagName}
                            onChange={(e) => setEditTagName(e.target.value)}
                            className="max-w-[200px]"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4" style={{ color: tag.color }} />
                            <span>{tag.name}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTagId === tag.id ? (
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={editTagColor}
                              onChange={(e) => setEditTagColor(e.target.value)}
                              className="w-16 h-8 p-1"
                            />
                            <span className="text-sm">{editTagColor}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div 
                              className="h-4 w-4 rounded-full" 
                              style={{ backgroundColor: tag.color }}
                            ></div>
                            <span className="text-sm">{tag.color}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{tag.contactCount}</TableCell>
                      <TableCell className="text-right">
                        {editingTagId === tag.id ? (
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={cancelEditTag}>
                              <X className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => saveEditTag(tag.id)}>
                              <Save className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
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
                              <DropdownMenuItem onClick={() => startEditTag(tag)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => deleteTag(tag.id)}
                                className="text-red-600"
                                disabled={tag.contactCount > 0}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Tag Usage</CardTitle>
          <CardDescription>
            Visualization of tag distribution across contacts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[300px] border-2 border-dashed rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Tag distribution chart will be displayed here</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Most Used Tags</h3>
                <div className="space-y-2">
                  {[...tags]
                    .sort((a, b) => b.contactCount - a.contactCount)
                    .slice(0, 5)
                    .map((tag) => (
                      <div key={tag.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-3 w-3 rounded-full" 
                            style={{ backgroundColor: tag.color }}
                          ></div>
                          <span>{tag.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{tag.contactCount} contacts</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Tag Best Practices</h3>
              <ul className="space-y-1 text-sm">
                <li>â¢ Use consistent naming conventions for your tags</li>
                <li>â¢ Create tags for industry, lead status, and customer segments</li>
                <li>â¢ Avoid creating too many tags that serve similar purposes</li>
                <li>â¢ Regularly review and clean up unused tags</li>
                <li>â¢ Use distinctive colors for different tag categories</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 