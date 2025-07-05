'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { contactsApi } from '@/lib/api/api-client';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export default function EditContactPage() {
  const router = useRouter();
  const params = useParams();
  const contactId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [contact, setContact] = useState<any>(null);
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    // In a real implementation, this would fetch the contact data from the API
    const fetchContact = async () => {
      setIsLoading(true);
      try {
        // For demo purposes, using the mock data (would use API in real app)
        // const response = await contactsApi.getContact(contactId);
        // const contactData = response.data;
        
        // Mock data for demo
        const contactData = {
          id: contactId,
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@example.com',
          phone: '+1 (555) 123-4567',
          company: 'Acme Inc.',
          jobTitle: 'Marketing Director',
          type: 'customer',
          tags: ['VIP', 'Enterprise'],
          leadStatus: 'customer',
          leadSource: 'Website',
          notes: 'Key decision maker for the enterprise account.'
        };
        
        setContact(contactData);
        
        // Initialize form state
        setFirstName(contactData.firstName);
        setLastName(contactData.lastName);
        setEmail(contactData.email || '');
        setPhone(contactData.phone || '');
        setCompany(contactData.company || '');
        setJobTitle(contactData.jobTitle || '');
        setNotes(contactData.notes || '');
      } catch (error) {
        console.error('Error fetching contact:', error);
        toast({
          title: "Error",
          description: "Failed to load contact information. Please try again.",
          variant: "destructive",
        });
        router.push('/client/contacts');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (contactId) {
      fetchContact();
    }
  }, [contactId, router]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName) {
      toast({
        title: "Validation Error",
        description: "First name and last name are required.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const updatedContact = {
        firstName,
        lastName,
        email,
        phone,
        company,
        jobTitle,
        notes
      };
      
      // In a real implementation, this would call the API
      // await contactsApi.updateContact(contactId, updatedContact);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Contact Updated",
        description: `${firstName} ${lastName} has been updated.`,
      });
      
      router.push('/client/contacts');
    } catch (error) {
      console.error('Error updating contact:', error);
      toast({
        title: "Error",
        description: "Failed to update contact. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin mr-4" />
        <p>Loading contact information...</p>
      </div>
    );
  }
  
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
        <h1 className="text-3xl font-bold tracking-tight">Edit Contact</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Contact Information</CardTitle>
          <CardDescription>
            Update the details for {firstName} {lastName}. Fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input 
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input 
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Work Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Work Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input 
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input 
                    id="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Notes */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Notes</h3>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/client/contacts')}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 