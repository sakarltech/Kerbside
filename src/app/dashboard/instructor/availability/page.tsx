'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7am to 9pm

interface TimeSlot {
  day: string;
  hour: number;
  recurring: boolean;
}

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [recurring, setRecurring] = useState(true);
  const [saving, setSaving] = useState(false);

  const toggleSlot = (day: string, hour: number) => {
    setSlots((prev) => {
      const exists = prev.find((s) => s.day === day && s.hour === hour);
      if (exists) {
        return prev.filter((s) => !(s.day === day && s.hour === hour));
      }
      return [...prev, { day, hour, recurring }];
    });
  };

  const isSelected = (day: string, hour: number) => {
    return slots.some((s) => s.day === day && s.hour === hour);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/instructor/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots }),
      });
    } catch (error) {
      console.error('Failed to save availability:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
          <p className="text-gray-600 mt-1">
            Click on time slots to set your available hours.
          </p>
        </div>
        <Button onClick={handleSave} loading={saving}>
          Save Changes
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={recurring}
              onChange={() => setRecurring(true)}
              className="text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Recurring weekly</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={!recurring}
              onChange={() => setRecurring(false)}
              className="text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">One-off</span>
          </label>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Header */}
            <div className="grid grid-cols-8 gap-1 mb-1">
              <div className="p-2 text-xs font-medium text-gray-500">Time</div>
              {DAYS.map((day) => (
                <div key={day} className="p-2 text-xs font-medium text-gray-700 text-center">
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>

            {/* Time grid */}
            {HOURS.map((hour) => (
              <div key={hour} className="grid grid-cols-8 gap-1 mb-1">
                <div className="p-2 text-xs text-gray-500 flex items-center">
                  {String(hour).padStart(2, '0')}:00
                </div>
                {DAYS.map((day) => (
                  <button
                    key={`${day}-${hour}`}
                    onClick={() => toggleSlot(day, hour)}
                    className={`p-2 rounded text-xs transition-colors ${
                      isSelected(day, hour)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-400'
                    }`}
                  >
                    {isSelected(day, hour) ? 'Available' : '-'}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-100" />
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
}
