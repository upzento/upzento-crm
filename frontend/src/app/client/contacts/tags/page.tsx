'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { contactsApi } from '@/lib/api/api-client';
import { ArrowLeft, Plus, Edit, Trash2, Tag, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for tags - would come from API in real implementation
const mockTags = [
  { id: '1', name: 'VIP', color: '#FF6B6B', usageCount: 15 },
  { id: '2', name: 'Enterprise', color: '#4ECDC4', usageCount: 28 },
  { id: '3', name: 'SMB', color: '#FFD166', usageCount: 42 },
  { id: '4', name: 'Hot Lead', color: '#FF9F1C', usageCount: 19 },
  { id: '5', name: 'Cold Lead', color: '#6B9BFF', usageCount: 31 },
  { id: '6', name: 'Partner', color: '#A177FF', usageCount: 8 },
  { id: '7', name: 'Technical', color: '#5D576B', usageCount: 12 },
  { id: '8', name: 'Consultant', color: '#8AC926', usageCount: 23 }
];

export default function TagsPage() {
  const router = useRouter();
  const [tags, setTags] = useState(mockTags);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('#4ECDC4');
  
  // Load tags on mount
  useEffect(() => {
    // In a real implementation, this would fetch tags from the API
    // const fetchTags = async () => {
    //   try {
    //     const response = await contactsApi.getTags();
    //     setTags(response.data);
    //   } catch (error) {
    //     console.error('Error fetching tags:', error);
    //     toast({
    //       title: "Error",
    //       description: "Failed to load tags. Please try again.",
    //       variant: "destructive",
    //     });
    //   }
    // };
    // fetchTags();
  }, []);
  
  const handleCreateTag = async () => {
    if (!tagName.trim()) {
      toast({
        title: "Validation Error",
        description: "Tag name is required.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // In a real implementation, this would call the API
      // await contactsApi.createTag({ name: tagName, color: tagColor });
      
      // Mock creating a new tag
      const newTag = {
        id: String(tags.length + 1),
        name: tagName,
        color: tagColor,
        usageCount: 0
      };
      
      setTags([...tags, newTag]);
      setIsDialogOpen(false);
      setTagName('');
      setTagColor('#4ECDC4');
      
      toast({
        title: "Tag Created",
        description: `Tag "${tagName}" has been created.`,
      });
    } catch (error) {
      console.error('Error creating tag:', error);
      toast({
        title: "Error",
        description: "Failed to create tag. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditTag = async () => {
    if (!editingTag || !tagName.trim()) {
      toast({
        title: "Validation Error",
        description: "Tag name is required.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // In a real implementation, this would call the API
      // await contactsApi.updateTag(editingTag.id, { name: tagName, color: tagColor });
      
      // Mock updating the tag
      const updatedTags = tags.map(tag => 
        tag.id === editingTag.id 
          ? { ...tag, name: tagName, color: tagColor }
          : tag
      );
      
      setTags(updatedTags);
      setIsDialogOpen(false);
      setEditingTag(null);
      setTagName('');
      setTagColor('#4ECDC4');
      
      toast({
        title: "Tag Updated",
        description: `Tag "${tagName}" has been updated.`,
      });
    } catch (error) {
      console.error('Error updating tag:', error);
      toast({
        title: "Error",
        description: "Failed to update tag. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteTag = async (tag: any) => {
    if (!tag) return;
    
    if (tag.usageCount > 0) {
      toast({
        title: "Cannot Delete Tag",
        description: `This tag is currently used by ${tag.usageCount} contacts. Remove the tag from these contacts first.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // In a real implementation, this would call the API
      // await contactsApi.deleteTag(tag.id);
      
      // Mock deleting the tag
      const updatedTags = tags.filter(t => t.id !== tag.id);
      setTags(updatedTags);
      
      toast({
        title: "Tag Deleted",
        description: `Tag "${tag.name}" has been deleted.`,
      });
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast({
        title: "Error",
        description: "Failed to delete tag. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const openEditDialog = (tag: any) => {
    setEditingTag(tag);
    setTagName(tag.name);
    setTagColor(tag.color);
    setIsDialogOpen(true);
  };
  
  const openCreateDialog = () => {
    setEditingTag(null);
    setTagName('');
    setTagColor('#4ECDC4');
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/client/contacts')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Contacts
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Contact Tags</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>All Tags</CardTitle>
                  <CardDescription>
                    Manage your contact tags
                  </CardDescription>
                </div>
                <Button onClick={openCreateDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Tag
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tag</TableHead>
                      <TableHead>Color</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tags.map((tag) => (
                      <TableRow key={tag.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: tag.color }}
                            />
                            {tag.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm">{tag.color}</code>
                        </TableCell>
                        <TableCell>{tag.usageCount} contacts</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(tag)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTag(tag)}
                              disabled={tag.usageCount > 0}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Tag Guidelines</CardTitle>
              <CardDescription>
                Best practices for using tags
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Info className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-medium">Keep it Simple</p>
                  <p className="text-sm text-muted-foreground">
                    Use clear, concise names that are easy to understand and remember.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Tag className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-medium">Be Consistent</p>
                  <p className="text-sm text-muted-foreground">
                    Use a consistent naming convention for related tags.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Info className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-medium">Use Categories</p>
                  <p className="text-sm text-muted-foreground">
                    Group related tags into categories (e.g., Industry, Status, Source).
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Tag className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-medium">Color Coding</p>
                  <p className="text-sm text-muted-foreground">
                    Use colors to visually distinguish between different types of tags.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Create/Edit Tag Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTag ? 'Edit Tag' : 'Create New Tag'}
            </DialogTitle>
            <DialogDescription>
              {editingTag 
                ? 'Edit the tag details below.' 
                : 'Enter the details for the new tag.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tag Name</Label>
              <Input
                id="name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="Enter tag name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Tag Color</Label>
              <div className="flex gap-4">
                <Input
                  id="color"
                  type="color"
                  value={tagColor}
                  onChange={(e) => setTagColor(e.target.value)}
                  className="w-20 h-10 p-1"
                />
                <Input
                  value={tagColor}
                  onChange={(e) => setTagColor(e.target.value)}
                  placeholder="#000000"
                  className="font-mono"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={editingTag ? handleEditTag : handleCreateTag}
              disabled={isLoading}
            >
              {isLoading ? (
                <>Saving...</>
              ) : (
                <>{editingTag ? 'Save Changes' : 'Create Tag'}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 