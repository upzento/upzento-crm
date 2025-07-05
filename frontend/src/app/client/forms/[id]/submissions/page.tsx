'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Mail, Archive } from 'lucide-react';

// Mock data - replace with API call
const mockSubmissions = [
  {
    id: '1',
    submittedAt: '2024-02-25T15:30:00Z',
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message',
    },
    status: 'new',
  },
  {
    id: '2',
    submittedAt: '2024-02-24T10:15:00Z',
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      message: 'Another test message',
    },
    status: 'viewed',
  },
  // Add more mock submissions
];

export default function FormSubmissionsPage() {
  const params = useParams();
  const formId = params.id as string;
  const [submissions, setSubmissions] = useState(mockSubmissions);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleViewSubmission = (submissionId: string) => {
    // TODO: Implement submission view
    console.log('View submission:', submissionId);
  };

  const handleSendNotification = (submissionId: string) => {
    // TODO: Implement notification sending
    console.log('Send notification for submission:', submissionId);
  };

  const handleArchiveSubmission = (submissionId: string) => {
    // TODO: Implement submission archiving
    console.log('Archive submission:', submissionId);
  };

  const handleExportSubmissions = () => {
    // TODO: Implement submissions export
    console.log('Export all submissions');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Form Submissions</h1>
          <p className="text-muted-foreground">View and manage form responses</p>
        </div>
        <Button onClick={handleExportSubmissions}>
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">New</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {submissions.filter(s => s.status === 'new').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Viewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {submissions.filter(s => s.status === 'viewed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {submissions.filter(s => s.status === 'archived').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submitted</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                  <TableCell>{submission.data.name}</TableCell>
                  <TableCell>{submission.data.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        submission.status === 'new'
                          ? 'default'
                          : submission.status === 'viewed'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {submission.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewSubmission(submission.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSendNotification(submission.id)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleArchiveSubmission(submission.id)}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 