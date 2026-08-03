'use client';

import { Clock } from 'lucide-react';

interface TimeSlot {
  id: string;
  time: string;
  duration: string;
}

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlotId: string | null;
  onSelect: (slotId: string) => void;
}

export default function TimeSlotPicker({
  slots,
  selectedSlotId,
  onSelect,
}: TimeSlotPickerProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {slots.map((slot) => (
        <button
          key={slot.id}
          onClick={() => onSelect(slot.id)}
          className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
            selectedSlotId === slot.id
              ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
              : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
          }`}
        >
          <Clock className={`w-4 h-4 flex-shrink-0 ${
            selectedSlotId === slot.id ? 'text-primary-600' : 'text-gray-400'
          }`} />
          <div>
            <p className={`text-sm font-medium ${
              selectedSlotId === slot.id ? 'text-primary-700' : 'text-gray-900'
            }`}>
              {slot.time}
            </p>
            <p className="text-xs text-gray-500">{slot.duration}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
