"use client";

import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, MapPin, Briefcase, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";

// Set up the localizer for the calendar
const localizer = momentLocalizer(moment);

// Sample data for appointments
const sampleAppointments = [
  {
    id: 1,
    title: "Consultation with John Doe",
    start: new Date(2023, 6, 15, 10, 0),
    end: new Date(2023, 6, 15, 11, 0),
    resourceId: 1,
    status: "confirmed",
    customerName: "John Doe",
    service: "Website Consultation",
    staff: "Alice Smith",
  },
  {
    id: 2,
    title: "SEO Review with Jane Smith",
    start: new Date(2023, 6, 15, 14, 0),
    end: new Date(2023, 6, 15, 15, 30),
    resourceId: 2,
    status: "confirmed",
    customerName: "Jane Smith",
    service: "SEO Review",
    staff: "Bob Johnson",
  },
  {
    id: 3,
    title: "Logo Design Feedback with Mike Brown",
    start: new Date(2023, 6, 16, 11, 0),
    end: new Date(2023, 6, 16, 12, 0),
    resourceId: 1,
    status: "confirmed",
    customerName: "Mike Brown",
    service: "Logo Design Feedback",
    staff: "Alice Smith",
  },
];

// Event styles for the calendar
const eventStyleGetter = (event: any) => {
  let style = {
    backgroundColor: "#3b82f6",
    borderRadius: "4px",
    color: "white",
    border: "none",
    display: "block",
  };
  
  if (event.status === "canceled") {
    style.backgroundColor = "#ef4444";
  } else if (event.status === "completed") {
    style.backgroundColor = "#22c55e";
  }
  
  return { style };
};

export default function AppointmentsPage() {
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [selectedStaff, setSelectedStaff] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedService, setSelectedService] = useState("all");
  
  // Sample data for upcoming appointments
  const upcomingAppointments = sampleAppointments.filter(
    (appointment) => appointment.start > new Date()
  );
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <div className="flex space-x-2">
          <Link href="/client/appointments/staff">
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Staff
            </Button>
          </Link>
          <Link href="/client/appointments/services">
            <Button variant="outline" size="sm">
              <Briefcase className="h-4 w-4 mr-2" />
              Services
            </Button>
          </Link>
          <Link href="/client/appointments/locations">
            <Button variant="outline" size="sm">
              <MapPin className="h-4 w-4 mr-2" />
              Locations
            </Button>
          </Link>
          <Link href="/client/appointments/widget">
            <Button variant="outline" size="sm">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Booking Widget
            </Button>
          </Link>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Appointment Calendar</CardTitle>
                <div className="flex space-x-2">
                  <Select value={view} onValueChange={setView}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="View" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="agenda">Agenda</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => setDate(new Date())}>
                    Today
                  </Button>
                </div>
              </div>
              <CardDescription>
                Manage your appointments and schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Staff" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Staff</SelectItem>
                    <SelectItem value="1">Alice Smith</SelectItem>
                    <SelectItem value="2">Bob Johnson</SelectItem>
                    <SelectItem value="3">Carol Williams</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="1">Main Office</SelectItem>
                    <SelectItem value="2">Downtown Branch</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="1">Website Consultation</SelectItem>
                    <SelectItem value="2">SEO Review</SelectItem>
                    <SelectItem value="3">Logo Design Feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="h-[600px]">
                <Calendar
                  localizer={localizer}
                  events={sampleAppointments}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: "100%" }}
                  view={view as any}
                  onView={(newView) => setView(newView)}
                  date={date}
                  onNavigate={setDate}
                  eventPropGetter={eventStyleGetter}
                  tooltipAccessor={(event) => `${event.title} - ${event.staff}`}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>
                Next scheduled appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-3 border rounded-lg hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    >
                      <div className="font-medium">{appointment.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {moment(appointment.start).format("MMM D, YYYY • h:mm A")}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Staff:</span> {appointment.staff}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Service:</span> {appointment.service}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No upcoming appointments
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Appointment Statistics</CardTitle>
          <CardDescription>
            Overview of your appointment metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Total Appointments</div>
              <div className="text-2xl font-bold">128</div>
              <div className="text-xs text-muted-foreground">This month</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Completed</div>
              <div className="text-2xl font-bold">86</div>
              <div className="text-xs text-green-500">67% completion rate</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Canceled</div>
              <div className="text-2xl font-bold">12</div>
              <div className="text-xs text-red-500">9% cancellation rate</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">No-shows</div>
              <div className="text-2xl font-bold">5</div>
              <div className="text-xs text-amber-500">4% no-show rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
