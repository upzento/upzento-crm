import { AnalyticsDashboard } from './analytics-dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics Dashboard',
  description: 'Comprehensive analytics and insights for your business',
};

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
} 