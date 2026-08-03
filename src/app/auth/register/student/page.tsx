'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

const TEACHING_STYLES = [
  { value: 'patient', label: 'Patient & Calm' },
  { value: 'structured', label: 'Structured & Methodical' },
  { value: 'friendly', label: 'Friendly & Chatty' },
  { value: 'focused', label: 'Focused & Efficient' },
  { value: 'no-preference', label: 'No preference' },
];

const CAR_TYPES = [
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'sedan', label: 'Saloon' },
  { value: 'suv', label: 'SUV' },
  { value: 'no-preference', label: 'No preference' },
];

const GOAL_TIMELINES = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '3-months', label: 'Within 3 months' },
  { value: '6-months', label: 'Within 6 months' },
  { value: 'no-rush', label: 'No rush, learning at my pace' },
];

export default function StudentRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Account info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [postcode, setPostcode] = useState('');

  // Preferences
  const [preferredGender, setPreferredGender] = useState('');
  const [language, setLanguage] = useState('');
  const [teachingStyle, setTeachingStyle] = useState('');
  const [carType, setCarType] = useState('');
  const [anxietyFriendly, setAnxietyFriendly] = useState(false);
  const [lessonFormat, setLessonFormat] = useState('');
  const [pickupFlexibility, setPickupFlexibility] = useState('');
  const [goalTimeline, setGoalTimeline] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          postcode,
          preferredGender,
          language,
          teachingStyle,
          carType,
          anxietyFriendly,
          lessonFormat,
          pickupFlexibility,
          goalTimeline,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/auth/signin?registered=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-2xl font-bold text-dark-800">KerbSide</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">
            Create Your Student Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Tell us about yourself so we can find you the perfect instructor.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Account Details
              </h3>
              <Input
                label="Full Name"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                label="Postcode"
                placeholder="SW1A 1AA"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                helperText="Used to find nearby instructors"
                required
              />
            </div>

            {/* Preferences */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Preferences
              </h3>
              <Select
                label="Preferred Instructor Gender"
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'no-preference', label: 'No preference' },
                ]}
                placeholder="Select preference"
                value={preferredGender}
                onChange={(e) => setPreferredGender(e.target.value)}
              />
              <Input
                label="Preferred Language"
                placeholder="English"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                helperText="Language you'd prefer lessons in"
              />
              <Select
                label="Teaching Style"
                options={TEACHING_STYLES}
                placeholder="Select preferred style"
                value={teachingStyle}
                onChange={(e) => setTeachingStyle(e.target.value)}
              />
              <Select
                label="Car Type"
                options={CAR_TYPES}
                placeholder="Select car preference"
                value={carType}
                onChange={(e) => setCarType(e.target.value)}
              />

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={anxietyFriendly}
                  onChange={(e) => setAnxietyFriendly(e.target.checked)}
                  className="w-4 h-4 text-primary-500 rounded border-gray-300 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">
                  I would prefer an anxiety-friendly instructor
                </span>
              </label>

              <Select
                label="Lesson Format"
                options={[
                  { value: 'weekly', label: 'Weekly lessons' },
                  { value: 'intensive', label: 'Intensive course' },
                  { value: 'flexible', label: 'Flexible scheduling' },
                ]}
                placeholder="Select format"
                value={lessonFormat}
                onChange={(e) => setLessonFormat(e.target.value)}
              />
              <Select
                label="Pickup Flexibility"
                options={[
                  { value: 'home-only', label: 'Home pickup only' },
                  { value: 'flexible', label: 'Flexible - can meet nearby' },
                  { value: 'anywhere', label: 'Happy to travel' },
                ]}
                placeholder="Select flexibility"
                value={pickupFlexibility}
                onChange={(e) => setPickupFlexibility(e.target.value)}
              />
              <Select
                label="Goal Timeline"
                options={GOAL_TIMELINES}
                placeholder="When do you want to pass?"
                value={goalTimeline}
                onChange={(e) => setGoalTimeline(e.target.value)}
              />
            </div>

            <Button type="submit" fullWidth loading={loading}>
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link
            href="/auth/signin"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
