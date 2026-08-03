'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  availableDates?: string[];
  selectedDate?: string | null;
  onDateSelect?: (date: string) => void;
}

export default function Calendar({
  availableDates = [],
  selectedDate,
  onDateSelect,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [];
    // Adjust for Monday-start week (UK)
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      days.push(d);
    }
    return days;
  }, [currentMonth]);

  const formatDateString = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-${String(day).padStart(2, '0')}`;
  };

  const isAvailable = (day: number) => {
    return availableDates.includes(formatDateString(day));
  };

  const isSelected = (day: number) => {
    return selectedDate === formatDateString(day);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const monthLabel = currentMonth.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="text-sm font-semibold text-gray-900">{monthLabel}</h3>
        <button
          onClick={goToNextMonth}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-1"
          >
            {day}
          </div>
        ))}

        {daysInMonth.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} />;
          }

          const available = isAvailable(day);
          const selected = isSelected(day);
          const today = isToday(day);

          return (
            <button
              key={day}
              onClick={() => available && onDateSelect?.(formatDateString(day))}
              disabled={!available}
              className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${
                selected
                  ? 'bg-primary-500 text-white font-semibold'
                  : available
                  ? 'bg-primary-50 text-primary-700 hover:bg-primary-100 font-medium'
                  : 'text-gray-400 cursor-default'
              } ${today && !selected ? 'ring-2 ring-primary-300' : ''}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
