'use client';

import { useAuth } from '@/lib/auth-context';

export default function DashboardPage() {
  const { user, tenantContext } = useAuth();
  
  return (
    <div className="space-y-8">
      <div className="cosmic-card">
        <h1 className="text-2xl font-bold font-space mb-4">
          Welcome, {user?.firstName}!
        </h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          This is your Upzento CRM dashboard. Here you can manage all your business growth activities in one place.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick stats cards */}
        <div className="cosmic-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl">
              💰
            </div>
            <div>
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
                Active Deals
              </p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </div>
        
        <div className="cosmic-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-xl">
              📅
            </div>
            <div>
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
                Today's Appointments
              </p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </div>
        
        <div className="cosmic-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xl">
              📇
            </div>
            <div>
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
                Total Contacts
              </p>
              <p className="text-2xl font-bold">248</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <div className="cosmic-card">
          <h2 className="text-xl font-bold font-space mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 pb-3 border-b border-light-text-secondary/10 dark:border-dark-text-secondary/10 last:border-0"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {activity.icon}
                </div>
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {activity.description}
                  </p>
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Quick actions */}
        <div className="cosmic-card">
          <h2 className="text-xl font-bold font-space mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="cosmic-card group p-4 hover:bg-primary hover:text-white transition-colors"
              >
                <div className="text-2xl mb-2">{action.icon}</div>
                <p className="font-medium">{action.title}</p>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary group-hover:text-white/80">
                  {action.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sample data for the dashboard
const recentActivities = [
  {
    icon: '💰',
    title: 'New deal created',
    description: 'Website redesign project for ABC Corp',
    time: '2 hours ago',
  },
  {
    icon: '📅',
    title: 'Appointment scheduled',
    description: 'Meeting with John Smith',
    time: '3 hours ago',
  },
  {
    icon: '📇',
    title: 'Contact added',
    description: 'Jane Doe (jane@example.com)',
    time: '5 hours ago',
  },
  {
    icon: '📝',
    title: 'Note added to deal',
    description: 'Client requested additional features',
    time: 'Yesterday',
  },
];

const quickActions = [
  {
    icon: '➕',
    title: 'Add Contact',
    description: 'Create a new contact',
  },
  {
    icon: '💰',
    title: 'Create Deal',
    description: 'Start a new sales opportunity',
  },
  {
    icon: '📅',
    title: 'Schedule',
    description: 'Book a new appointment',
  },
  {
    icon: '📊',
    title: 'Reports',
    description: 'View analytics and reports',
  },
]; 