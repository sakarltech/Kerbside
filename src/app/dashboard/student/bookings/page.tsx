'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';

type Tab = 'upcoming' | 'past';

const MOCK_BOOKINGS = {
  upcoming: [
    { id: '1', instructor: 'James Wilson', date: '2024-02-15', time: '10:00', location: 'Home pickup', status: 'confirmed' as const },
    { id: '2', instructor: 'Sarah Miller', date: '2024-02-20', time: '14:00', location: 'Home pickup', status: 'confirmed' as const },
  ],
  past: [
    { id: '3', instructor: 'James Wilson', date: '2024-02-12', time: '10:00', location: 'Home pickup', status: 'completed' as const, reviewed: false },
    { id: '4', instructor: 'James Wilson', date: '2024-02-08', time: '10:00', location: 'Home pickup', status: 'completed' as const, reviewed: true },
    { id: '5', instructor: 'David Lee', date: '2024-02-05', time: '09:00', location: 'Station pickup', status: 'completed' as const, reviewed: true },
  ],
};

export default function StudentBookingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'past', label: 'Past' },
  ];

  const bookings = MOCK_BOOKINGS[activeTab];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-1">View and manage your lesson bookings.</p>
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

      {/* Bookings */}
      <div className="space-y-3">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={booking.instructor} />
                <div>
                  <p className="font-medium text-gray-900">{booking.instructor}</p>
                  <p className="text-sm text-gray-500">
                    {booking.date} at {booking.time} - {booking.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={booking.status === 'confirmed' ? 'success' : 'info'}>
                  {booking.status}
                </Badge>
                {activeTab === 'past' && !(booking as { reviewed?: boolean }).reviewed && (
                  <Button size="sm" variant="outline">Leave Review</Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
