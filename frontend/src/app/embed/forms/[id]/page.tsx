'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { FormEmbed } from '@/components/forms/form-embed';

export default function FormEmbedPage() {
  const params = useParams();
  const formId = params.id as string;

  return (
    <div className="min-h-screen bg-background">
      <FormEmbed formId={formId} mode="embed" />
    </div>
  );
} 