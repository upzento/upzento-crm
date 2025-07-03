"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, ArrowLeft, Code, Copy, ExternalLink, Settings, Palette, Calendar, CheckCircle, Trash2 } from "lucide-react";
import Link from "next/link";

// Sample booking widget data
const sampleWidget = {
  id: 1,
  name: "Main Booking Widget",
  slug: "main-booking",
  allowedDomains: ["example.com", "www.example.com"],
  settings: {
    theme: {
      primaryColor: "#3b82f6",
      textColor: "#1f2937",
      backgroundColor: "#ffffff",
      accentColor: "#8b5cf6",
    },
    steps: ["service", "staff", "datetime", "contact"],
    requiredFields: ["name", "email", "phone"],
    optionalFields: ["notes"],
    confirmation: {
      sendEmail: true,
      sendSMS: false,
      message: "Thank you for booking with us! We look forward to seeing you.",
    },
    availability: {
      daysInAdvance: 60,
      minNotice: 24,
      timeSlotInterval: 30,
    },
  },
};

// Sample services data
const sampleServices = [
  { id: 1, name: "Website Consultation", duration: 60, enabled: true },
  { id: 2, name: "SEO Review", duration: 90, enabled: true },
  { id: 3, name: "Logo Design Feedback", duration: 60, enabled: false },
  { id: 4, name: "Marketing Strategy", duration: 120, enabled: true },
];

// Sample staff data
const sampleStaff = [
  { id: 1, name: "Alice Smith", title: "Senior Consultant", enabled: true },
  { id: 2, name: "Bob Johnson", title: "Design Specialist", enabled: true },
  { id: 3, name: "Carol Williams", title: "Marketing Advisor", enabled: false },
];

export default function BookingWidgetPage() {
  const [widget, setWidget] = useState(sampleWidget);
  const [activeTab, setActiveTab] = useState("general");
  const [isAddDomainOpen, setIsAddDomainOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [embedCode, setEmbedCode] = useState(
    `<script src="https://upzento.com/widgets/booking/${widget.slug}.js"></script>\n<div id="upzento-booking-widget"></div>`
  );

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);
  };

  const handleAddDomain = () => {
    if (newDomain && !widget.allowedDomains.includes(newDomain)) {
      setWidget({
        ...widget,
        allowedDomains: [...widget.allowedDomains, newDomain],
      });
      setNewDomain("");
    }
    setIsAddDomainOpen(false);
  };

  const handleRemoveDomain = (domain: string) => {
    setWidget({
      ...widget,
      allowedDomains: widget.allowedDomains.filter((d) => d !== domain),
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/client/appointments">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Appointments
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Booking Widget</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsPreviewOpen(true)}>
            Preview Widget
          </Button>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Widget
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Widget Configuration</CardTitle>
              <CardDescription>
                Customize your online booking widget
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-5 mb-6">
                  <TabsTrigger value="general">
                    <Settings className="h-4 w-4 mr-2" />
                    General
                  </TabsTrigger>
                  <TabsTrigger value="appearance">
                    <Palette className="h-4 w-4 mr-2" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger value="services">
                    <Calendar className="h-4 w-4 mr-2" />
                    Services
                  </TabsTrigger>
                  <TabsTrigger value="staff">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Staff
                  </TabsTrigger>
                  <TabsTrigger value="embed">
                    <Code className="h-4 w-4 mr-2" />
                    Embed
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="widgetName">Widget Name</Label>
                      <Input
                        id="widgetName"
                        value={widget.name}
                        onChange={(e) =>
                          setWidget({ ...widget, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="widgetSlug">Widget Slug</Label>
                      <Input
                        id="widgetSlug"
                        value={widget.slug}
                        onChange={(e) =>
                          setWidget({ ...widget, slug: e.target.value })
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Used in the widget URL: upzento.com/w/{widget.slug}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Booking Flow Steps</Label>
                    <div className="flex flex-wrap gap-2">
                      {["service", "staff", "datetime", "contact", "confirmation"].map(
                        (step) => (
                          <div
                            key={step}
                            className={`border rounded-md p-2 cursor-pointer ${
                              widget.settings.steps.includes(step)
                                ? "border-primary bg-primary/5"
                                : "border-muted"
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={widget.settings.steps.includes(step)}
                                onCheckedChange={() => {}}
                              />
                              <span className="capitalize">{step}</span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="daysInAdvance">Days in Advance</Label>
                      <Input
                        id="daysInAdvance"
                        type="number"
                        value={widget.settings.availability.daysInAdvance}
                        onChange={() => {}}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        How far in advance can appointments be booked
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="minNotice">Minimum Notice (hours)</Label>
                      <Input
                        id="minNotice"
                        type="number"
                        value={widget.settings.availability.minNotice}
                        onChange={() => {}}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Minimum notice required for booking
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="timeSlotInterval">
                        Time Slot Interval (minutes)
                      </Label>
                      <Select
                        value={widget.settings.availability.timeSlotInterval.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Contact Information</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="nameField"
                          checked={widget.settings.requiredFields.includes("name")}
                        />
                        <Label htmlFor="nameField">Name</Label>
                        <Badge className="ml-2">Required</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="emailField"
                          checked={widget.settings.requiredFields.includes("email")}
                        />
                        <Label htmlFor="emailField">Email</Label>
                        <Badge className="ml-2">Required</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="phoneField"
                          checked={widget.settings.requiredFields.includes("phone")}
                        />
                        <Label htmlFor="phoneField">Phone</Label>
                        <Badge className="ml-2">Required</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="notesField"
                          checked={widget.settings.optionalFields.includes("notes")}
                        />
                        <Label htmlFor="notesField">Notes</Label>
                        <Badge variant="outline" className="ml-2">
                          Optional
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmationMessage">
                      Confirmation Message
                    </Label>
                    <Textarea
                      id="confirmationMessage"
                      value={widget.settings.confirmation.message}
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="sendEmail"
                        checked={widget.settings.confirmation.sendEmail}
                      />
                      <Label htmlFor="sendEmail">Send Email Confirmation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="sendSMS"
                        checked={widget.settings.confirmation.sendSMS}
                      />
                      <Label htmlFor="sendSMS">Send SMS Confirmation</Label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          id="primaryColor"
                          value={widget.settings.theme.primaryColor}
                          className="w-10 h-10 rounded-md"
                        />
                        <Input
                          value={widget.settings.theme.primaryColor}
                          onChange={() => {}}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="accentColor">Accent Color</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          id="accentColor"
                          value={widget.settings.theme.accentColor}
                          className="w-10 h-10 rounded-md"
                        />
                        <Input
                          value={widget.settings.theme.accentColor}
                          onChange={() => {}}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="textColor">Text Color</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          id="textColor"
                          value={widget.settings.theme.textColor}
                          className="w-10 h-10 rounded-md"
                        />
                        <Input
                          value={widget.settings.theme.textColor}
                          onChange={() => {}}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="backgroundColor">Background Color</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          id="backgroundColor"
                          value={widget.settings.theme.backgroundColor}
                          className="w-10 h-10 rounded-md"
                        />
                        <Input
                          value={widget.settings.theme.backgroundColor}
                          onChange={() => {}}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <Label className="mb-2 block">Widget Preview</Label>
                    <div
                      className="border rounded-md p-4 mt-2"
                      style={{
                        backgroundColor: widget.settings.theme.backgroundColor,
                        color: widget.settings.theme.textColor,
                      }}
                    >
                      <div className="text-lg font-bold mb-4">Book an Appointment</div>
                      <div className="mb-4">
                        <div className="mb-1 font-medium">Select a Service</div>
                        <div
                          className="p-3 rounded-md mb-2"
                          style={{
                            backgroundColor: widget.settings.theme.primaryColor,
                            color: "#ffffff",
                          }}
                        >
                          Website Consultation
                        </div>
                        <div className="p-3 border rounded-md mb-2">SEO Review</div>
                        <div className="p-3 border rounded-md">
                          Marketing Strategy
                        </div>
                      </div>
                      <div className="mt-4">
                        <button
                          className="px-4 py-2 rounded-md"
                          style={{
                            backgroundColor: widget.settings.theme.accentColor,
                            color: "#ffffff",
                          }}
                        >
                          Next Step
                        </button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="services" className="space-y-4">
                  <div className="space-y-4">
                    {sampleServices.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-3 border rounded-md"
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox checked={service.enabled} />
                          <div>
                            <div className="font-medium">{service.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {service.duration} minutes
                            </div>
                          </div>
                        </div>
                        <Badge variant={service.enabled ? "default" : "outline"}>
                          {service.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="staff" className="space-y-4">
                  <div className="space-y-4">
                    {sampleStaff.map((staff) => (
                      <div
                        key={staff.id}
                        className="flex items-center justify-between p-3 border rounded-md"
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox checked={staff.enabled} />
                          <div>
                            <div className="font-medium">{staff.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {staff.title}
                            </div>
                          </div>
                        </div>
                        <Badge variant={staff.enabled ? "default" : "outline"}>
                          {staff.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="embed" className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Embed Code</Label>
                    <div className="relative">
                      <Textarea
                        value={embedCode}
                        readOnly
                        rows={3}
                        className="font-mono text-sm pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleCopyCode}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Copy this code and paste it into your website where you want
                      the booking widget to appear.
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Allowed Domains</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAddDomainOpen(true)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Domain
                      </Button>
                    </div>
                    <div className="border rounded-md p-4">
                      {widget.allowedDomains.length > 0 ? (
                        <div className="space-y-2">
                          {widget.allowedDomains.map((domain) => (
                            <div
                              key={domain}
                              className="flex justify-between items-center p-2 border rounded-md"
                            >
                              <div className="font-mono text-sm">{domain}</div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveDomain(domain)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No domains added yet. Add domains to restrict where this
                          widget can be embedded.
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      For security, the widget will only work on these domains.
                      Leave empty to allow any domain.
                    </p>
                  </div>

                  <div>
                    <Label className="mb-2 block">Direct Booking Link</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={`https://upzento.com/w/${widget.slug}`}
                        readOnly
                      />
                      <Button variant="outline" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Share this link directly with clients to book appointments.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Widget Status</CardTitle>
              <CardDescription>
                Current status and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded-md">
                <div className="font-medium">Status</div>
                <Badge>Active</Badge>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Bookings This Month</div>
                <div className="text-3xl font-bold">24</div>
                <div className="text-sm text-muted-foreground">
                  +12% from last month
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Conversion Rate</div>
                <div className="text-3xl font-bold">18.5%</div>
                <div className="text-sm text-muted-foreground">
                  Visitors who complete a booking
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Most Popular Service</div>
                <div className="font-medium">Website Consultation</div>
                <div className="text-sm text-muted-foreground">
                  42% of all bookings
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Most Popular Staff</div>
                <div className="font-medium">Alice Smith</div>
                <div className="text-sm text-muted-foreground">
                  56% of all bookings
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Domain Dialog */}
      <Dialog open={isAddDomainOpen} onOpenChange={setIsAddDomainOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Allowed Domain</DialogTitle>
            <DialogDescription>
              Add a domain where this widget can be embedded.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="domain">Domain Name</Label>
            <Input
              id="domain"
              placeholder="example.com"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Enter the domain without http:// or https:// (e.g., example.com)
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDomainOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDomain}>Add Domain</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Widget Preview</DialogTitle>
            <DialogDescription>
              Preview how your booking widget will appear to customers
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 h-[500px] border rounded-md flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Calendar className="h-16 w-16 mx-auto mb-2" />
              <div className="text-lg font-medium">Widget Preview</div>
              <div className="max-w-xs mx-auto mt-2">
                This is where the live widget preview would be displayed.
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPreviewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 