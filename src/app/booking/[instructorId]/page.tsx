'use client';

import { useState } from 'react';
import Calendar from '@/components/ui/Calendar';
import TimeSlotPicker from '@/components/booking/TimeSlotPicker';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';

const AVAILABLE_DATES = [
  '2024-02-15', '2024-02-16', '2024-02-17',
  '2024-02-19', '2024-02-20', '2024-02-21',
  '2024-02-22', '2024-02-23', '2024-02-24',
];

const AVAILABLE_SLOTS = [
  { id: '1', time: '09:00', duration: '1 hour' },
  { id: '2', time: '10:00', duration: '1 hour' },
  { id: '3', time: '11:00', duration: '1.5 hours' },
  { id: '4', time: '14:00', duration: '1 hour' },
  { id: '5', time: '15:00', duration: '1 hour' },
  { id: '6', time: '16:00', duration: '2 hours' },
];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;
  const hourlyRate = 35;

  const selectedSlotData = AVAILABLE_SLOTS.find(s => s.id === selectedSlot);

  const handleConfirmPayment = async () => {
    setLoading(true);
    // In production, this would create a Stripe payment intent
    setTimeout(() => {
      setStep(4);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Book a Lesson</h1>
          <p className="text-gray-600 mt-1">Step {step} of {totalSteps}</p>
          <ProgressBar value={progress} className="mt-4" />
        </div>

        {/* Step 1: Select Date */}
        {step === 1 && (
          <Card header={<h3 className="font-semibold text-gray-900">Select a Date</h3>}>
            <Calendar
              availableDates={AVAILABLE_DATES}
              selectedDate={selectedDate}
              onDateSelect={(date) => setSelectedDate(date)}
            />
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedDate}
              >
                Continue
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Select Time */}
        {step === 2 && (
          <Card header={<h3 className="font-semibold text-gray-900">Select a Time Slot</h3>}>
            <p className="text-sm text-gray-600 mb-4">
              Available slots for {selectedDate}
            </p>
            <TimeSlotPicker
              slots={AVAILABLE_SLOTS}
              selectedSlotId={selectedSlot}
              onSelect={setSelectedSlot}
            />
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)} disabled={!selectedSlot}>Continue</Button>
            </div>
          </Card>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <Card header={<h3 className="font-semibold text-gray-900">Confirm Booking</h3>}>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium text-gray-900">{selectedDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium text-gray-900">{selectedSlotData?.time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium text-gray-900">{selectedSlotData?.duration}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lesson fee</span>
                    <span className="font-medium text-gray-900">&pound;{hourlyRate}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    A 15% platform fee is included in the instructor&apos;s rate.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={handleConfirmPayment} loading={loading}>
                Pay &pound;{hourlyRate}
              </Button>
            </div>
          </Card>
        )}

        {/* Step 4: Payment Confirmation */}
        {step === 4 && (
          <Card>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600 mb-6">
                Your lesson has been booked for {selectedDate} at {selectedSlotData?.time}.
              </p>
              <Button onClick={() => window.location.href = '/dashboard/student/bookings'}>
                View My Bookings
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
