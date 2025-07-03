"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, MapPin, Edit, Trash2, ArrowLeft, Clock, Check } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Sample locations data
const sampleLocations = [
  {
    id: 1,
    name: "Main Office",
    address: "123 Business Ave",
    city: "San Francisco",
    state: "CA",
    zipCode: "94107",
    country: "United States",
    phone: "555-123-4567",
    email: "mainoffice@example.com",
    isDefault: true,
  },
  {
    id: 2,
    name: "Downtown Branch",
    address: "456 Market St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103",
    country: "United States",
    phone: "555-234-5678",
    email: "downtown@example.com",
    isDefault: false,
  },
];

// Sample business hours data
const sampleBusinessHours = [
  { locationId: 1, dayOfWeek: 0, startTime: "", endTime: "", isClosed: true }, // Sunday
  { locationId: 1, dayOfWeek: 1, startTime: "09:00", endTime: "17:00", isClosed: false }, // Monday
  { locationId: 1, dayOfWeek: 2, startTime: "09:00", endTime: "17:00", isClosed: false }, // Tuesday
  { locationId: 1, dayOfWeek: 3, startTime: "09:00", endTime: "17:00", isClosed: false }, // Wednesday
  { locationId: 1, dayOfWeek: 4, startTime: "09:00", endTime: "17:00", isClosed: false }, // Thursday
  { locationId: 1, dayOfWeek: 5, startTime: "09:00", endTime: "17:00", isClosed: false }, // Friday
  { locationId: 1, dayOfWeek: 6, startTime: "10:00", endTime: "15:00", isClosed: false }, // Saturday
  { locationId: 2, dayOfWeek: 0, startTime: "", endTime: "", isClosed: true }, // Sunday
  { locationId: 2, dayOfWeek: 1, startTime: "08:30", endTime: "18:00", isClosed: false }, // Monday
  { locationId: 2, dayOfWeek: 2, startTime: "08:30", endTime: "18:00", isClosed: false }, // Tuesday
  { locationId: 2, dayOfWeek: 3, startTime: "08:30", endTime: "18:00", isClosed: false }, // Wednesday
  { locationId: 2, dayOfWeek: 4, startTime: "08:30", endTime: "18:00", isClosed: false }, // Thursday
  { locationId: 2, dayOfWeek: 5, startTime: "08:30", endTime: "18:00", isClosed: false }, // Friday
  { locationId: 2, dayOfWeek: 6, startTime: "", endTime: "", isClosed: true }, // Saturday
];

// Sample services data
const sampleServices = [
  { id: 1, name: "Website Consultation", duration: 60 },
  { id: 2, name: "SEO Review", duration: 90 },
  { id: 3, name: "Logo Design Feedback", duration: 60 },
  { id: 4, name: "Marketing Strategy", duration: 120 },
];

// Sample staff data
const sampleStaff = [
  { id: 1, name: "Alice Smith", title: "Senior Consultant" },
  { id: 2, name: "Bob Johnson", title: "Design Specialist" },
  { id: 3, name: "Carol Williams", title: "Marketing Advisor" },
];

// Sample location services
const sampleLocationServices = [
  { locationId: 1, serviceId: 1 },
  { locationId: 1, serviceId: 2 },
  { locationId: 1, serviceId: 3 },
  { locationId: 1, serviceId: 4 },
  { locationId: 2, serviceId: 1 },
  { locationId: 2, serviceId: 2 },
];

// Sample location staff
const sampleLocationStaff = [
  { locationId: 1, staffId: 1 },
  { locationId: 1, staffId: 2 },
  { locationId: 2, staffId: 2 },
  { locationId: 2, staffId: 3 },
];

export default function LocationsManagementPage() {
  const [locations, setLocations] = useState(sampleLocations);
  const [businessHours, setBusinessHours] = useState(sampleBusinessHours);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [isEditHoursOpen, setIsEditHoursOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("locations");

  const selectedLocation = selectedLocationId
    ? locations.find((loc) => loc.id === selectedLocationId)
    : null;

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getLocationBusinessHours = (locationId: number) => {
    return businessHours.filter((hour) => hour.locationId === locationId);
  };

  const getLocationServices = (locationId: number) => {
    const serviceIds = sampleLocationServices
      .filter((ls) => ls.locationId === locationId)
      .map((ls) => ls.serviceId);
    return sampleServices.filter((service) => serviceIds.includes(service.id));
  };

  const getLocationStaff = (locationId: number) => {
    const staffIds = sampleLocationStaff
      .filter((ls) => ls.locationId === locationId)
      .map((ls) => ls.staffId);
    return sampleStaff.filter((staff) => staffIds.includes(staff.id));
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
          <h1 className="text-3xl font-bold tracking-tight">Location Management</h1>
        </div>
        <Button onClick={() => setIsAddLocationOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="hours">Business Hours</TabsTrigger>
          <TabsTrigger value="services">Services by Location</TabsTrigger>
          <TabsTrigger value="staff">Staff by Location</TabsTrigger>
        </TabsList>

        <TabsContent value="locations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Location Directory</CardTitle>
              <CardDescription>
                Manage your business locations and their details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {locations.map((location) => (
                  <Card key={location.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 mr-2 text-primary" />
                          <div>
                            <CardTitle>{location.name}</CardTitle>
                            {location.isDefault && (
                              <Badge className="mt-1">Default Location</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLocationId(location.id);
                              setIsEditHoursOpen(true);
                            }}
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <div className="font-medium">Address:</div>
                          <div>{location.address}</div>
                          <div>
                            {location.city}, {location.state} {location.zipCode}
                          </div>
                          <div>{location.country}</div>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">Contact:</div>
                          <div>{location.phone}</div>
                          <div>{location.email}</div>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">Services:</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {getLocationServices(location.id).map((service) => (
                              <Badge key={service.id} variant="outline">
                                {service.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">Staff:</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {getLocationStaff(location.id).map((staff) => (
                              <Badge key={staff.id} variant="secondary">
                                {staff.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>
                Set operating hours for each of your locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {locations.map((location) => (
                  <div key={location.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-primary" />
                        <div className="font-medium">{location.name}</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedLocationId(location.id);
                          setIsEditHoursOpen(true);
                        }}
                      >
                        Edit Hours
                      </Button>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Day</TableHead>
                          <TableHead>Hours</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getLocationBusinessHours(location.id).map((hour) => (
                          <TableRow key={`${location.id}-${hour.dayOfWeek}`}>
                            <TableCell className="font-medium">
                              {daysOfWeek[hour.dayOfWeek]}
                            </TableCell>
                            <TableCell>
                              {hour.isClosed
                                ? "Closed"
                                : `${hour.startTime} - ${hour.endTime}`}
                            </TableCell>
                            <TableCell>
                              {hour.isClosed ? (
                                <Badge variant="outline">Closed</Badge>
                              ) : (
                                <Badge variant="default">Open</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Services by Location</CardTitle>
              <CardDescription>
                Manage which services are offered at each location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {locations.map((location) => (
                  <div key={location.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-primary" />
                        <div className="font-medium">{location.name}</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit Services
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {sampleServices.map((service) => {
                        const isOffered = sampleLocationServices.some(
                          (ls) =>
                            ls.locationId === location.id &&
                            ls.serviceId === service.id
                        );
                        return (
                          <div
                            key={`${location.id}-${service.id}`}
                            className={`flex items-center p-3 border rounded-lg ${
                              isOffered
                                ? "border-primary bg-primary/5"
                                : "border-muted bg-muted/10"
                            }`}
                          >
                            <div className="flex-1">
                              <div className="font-medium">{service.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {service.duration} minutes
                              </div>
                            </div>
                            {isOffered && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Staff by Location</CardTitle>
              <CardDescription>
                Manage which staff members work at each location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {locations.map((location) => (
                  <div key={location.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-primary" />
                        <div className="font-medium">{location.name}</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Assign Staff
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {sampleStaff.map((staff) => {
                        const isAssigned = sampleLocationStaff.some(
                          (ls) =>
                            ls.locationId === location.id &&
                            ls.staffId === staff.id
                        );
                        return (
                          <div
                            key={`${location.id}-${staff.id}`}
                            className={`flex items-center p-3 border rounded-lg ${
                              isAssigned
                                ? "border-primary bg-primary/5"
                                : "border-muted bg-muted/10"
                            }`}
                          >
                            <div className="flex-1">
                              <div className="font-medium">{staff.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {staff.title}
                              </div>
                            </div>
                            {isAssigned && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Location Dialog */}
      <Dialog open={isAddLocationOpen} onOpenChange={setIsAddLocationOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Location</DialogTitle>
            <DialogDescription>
              Create a new location for your business where services can be provided.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Location Name</Label>
                <Input id="name" placeholder="Location name" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" placeholder="Street address" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="City" />
              </div>
              <div>
                <Label htmlFor="state">State/Province</Label>
                <Input id="state" placeholder="State/Province" />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                <Input id="zipCode" placeholder="ZIP/Postal Code" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="Phone number" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Email address" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="isDefault" className="h-4 w-4" />
              <Label htmlFor="isDefault">Set as default location</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddLocationOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddLocationOpen(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Business Hours Dialog */}
      <Dialog open={isEditHoursOpen} onOpenChange={setIsEditHoursOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Edit Business Hours for {selectedLocation?.name}
            </DialogTitle>
            <DialogDescription>
              Set the operating hours for this location.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {daysOfWeek.map((day, index) => {
              const dayHours = businessHours.find(
                (hour) =>
                  hour.locationId === selectedLocationId &&
                  hour.dayOfWeek === index
              );
              
              return (
                <div
                  key={day}
                  className="grid grid-cols-[1fr_2fr_2fr_1fr] gap-4 items-center"
                >
                  <Label>{day}</Label>
                  <div>
                    <Select
                      defaultValue={
                        dayHours?.isClosed
                          ? "closed"
                          : dayHours?.startTime || "09:00"
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Start time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                        <SelectItem value="08:30">8:30 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="09:30">9:30 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select
                      defaultValue={
                        dayHours?.isClosed
                          ? "closed"
                          : dayHours?.endTime || "17:00"
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="End time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="16:30">4:30 PM</SelectItem>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                        <SelectItem value="17:30">5:30 PM</SelectItem>
                        <SelectItem value="18:00">6:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`closed-${day}`}
                      className="h-4 w-4"
                      checked={dayHours?.isClosed}
                      onChange={() => {}}
                    />
                    <Label htmlFor={`closed-${day}`}>Closed</Label>
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditHoursOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditHoursOpen(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 