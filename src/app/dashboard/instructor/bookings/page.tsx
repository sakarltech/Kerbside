'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';

type Tab = 'upcoming' | 'past' | 'cancelled';

const MOCK_BOOKINGS = {
  upcoming: [
    { id: '1', student: 'Sarah Johnson', date: '2024-02-15', time: '09:00', duration: '1 hour', status: 'confirmed' as const },
    { id: '2', student: 'Mike Chen', date: '2024-02-15', time: '11:00', duration: '1.5 hours', status: 'confirmed' as const },
    { id: '3', student: 'Emma Williams', date: '2024-02-16', time: '14:00', duration: '1 hour', status: 'pending' as const },
  ],
  past: [
    { id: '4', student: 'Tom Brown', date: '2024-02-10', time: '10:00', duration: '1 hour', status: 'completed' as const },
    { id: '5', student: 'Lisa Park', date: '2024-02-08', time: '15:00', duration: '2 hours', status: 'completed' as const },
  ],
  cancelled: [
    { id: '6', student: 'John Lee', date: '2024-02-12', time: '13:00', duration: '1 hour', status: 'cancelled' as const },
  ],
};

export default function InstructorBookingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'past', label: 'Past' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const bookings = MOCK_BOOKINGS[activeTab];

  const statusVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success' as const;
      case 'pending': return 'warning' as const;
      case 'completed': return 'info' as const;
      case 'cancelled': return 'danger' as const;
      default: return 'default' as const;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-600 mt-1">Manage your lesson bookings.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={booking.student} size="md" />
                <div>
                  <p className="font-medium text-gray-900">{booking.student}</p>
                  <p className="text-sm text-gray-500">
                    {booking.date} at {booking.time} - {booking.duration}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={statusVariant(booking.status)}>{booking.status}</Badge>
                {activeTab === 'upcoming' && (
                  <div className="flex gap-2">
                    {booking.status === 'pending' && (
                      <Button size="sm" variant="primary">Confirm</Button>
                    )}
                    <Button size="sm" variant="danger">Cancel</Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}

        {bookings.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No {activeTab} bookings found.
          </div>
        )}
      </div>
    </div>
  );
}
