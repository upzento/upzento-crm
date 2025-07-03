"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, MapPin, Briefcase, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";

export default function AppointmentsPage() {
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
      
      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
          <CardDescription>
            The calendar has been temporarily disabled for maintenance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please use the links above to manage your appointments, staff, services, and locations.</p>
        </CardContent>
      </Card>
    </div>
  );
}
