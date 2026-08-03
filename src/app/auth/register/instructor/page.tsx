'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import ProgressBar from '@/components/ui/ProgressBar';

const SPECIALISMS = [
  'Nervous beginners',
  'Motorway driving',
  'Automatic only',
  'Pass Plus',
  'Refresher lessons',
  'Intensive courses',
  'Theory test prep',
  'Night driving',
];

const TEACHING_STYLES = [
  { value: 'patient', label: 'Patient & Calm' },
  { value: 'structured', label: 'Structured & Methodical' },
  { value: 'friendly', label: 'Friendly & Chatty' },
  { value: 'focused', label: 'Focused & Efficient' },
];

const CAR_TYPES = [
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'sedan', label: 'Saloon' },
  { value: 'suv', label: 'SUV' },
  { value: 'other', label: 'Other' },
];

const TRANSMISSION_OPTIONS = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatic', label: 'Automatic' },
  { value: 'both', label: 'Both' },
];

export default function InstructorRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Personal Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Step 2: ADI Details
  const [adiNumber, setAdiNumber] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [carType, setCarType] = useState('');
  const [transmission, setTransmission] = useState('');

  // Step 3: Profile
  const [bio, setBio] = useState('');
  const [specialisms, setSpecialisms] = useState<string[]>([]);
  const [teachingStyle, setTeachingStyle] = useState('');
  const [languages, setLanguages] = useState('');
  const [gender, setGender] = useState('');
  const [anxietyFriendly, setAnxietyFriendly] = useState(false);

  // Step 4: Coverage
  const [postcodes, setPostcodes] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const toggleSpecialism = (spec: string) => {
    setSpecialisms((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, totalSteps));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register/instructor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          adiNumber,
          yearsExperience: parseInt(yearsExperience),
          carType,
          transmission,
          bio,
          specialisms,
          teachingStyle,
          languages: languages.split(',').map((l) => l.trim()),
          gender,
          anxietyFriendly,
          postcodes: postcodes.split(',').map((p) => p.trim()),
          hourlyRate: parseFloat(hourlyRate),
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
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-2xl font-bold text-dark-800">KerbSide</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">
            Join as a Driving Instructor
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Step {step} of {totalSteps}
          </p>
        </div>

        <ProgressBar value={progress} className="mb-8" />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Personal Information
                </h3>
                <Input
                  label="Full Name"
                  placeholder="John Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
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
                  label="Phone Number"
                  type="tel"
                  placeholder="07700 900000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Step 2: ADI Details */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ADI Details
                </h3>
                <Input
                  label="ADI Number"
                  placeholder="Enter your ADI badge number"
                  value={adiNumber}
                  onChange={(e) => setAdiNumber(e.target.value)}
                  required
                />
                <Input
                  label="Years of Experience"
                  type="number"
                  placeholder="e.g. 5"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  required
                />
                <Select
                  label="Car Type"
                  options={CAR_TYPES}
                  placeholder="Select car type"
                  value={carType}
                  onChange={(e) => setCarType(e.target.value)}
                />
                <Select
                  label="Transmission"
                  options={TRANSMISSION_OPTIONS}
                  placeholder="Select transmission"
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                />
              </div>
            )}

            {/* Step 3: Profile */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Profile Setup
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={4}
                    placeholder="Tell students about yourself and your teaching approach..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialisms
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {SPECIALISMS.map((spec) => (
                      <label
                        key={spec}
                        className={`flex items-center px-3 py-2 rounded-lg border cursor-pointer transition-colors text-sm ${
                          specialisms.includes(spec)
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={specialisms.includes(spec)}
                          onChange={() => toggleSpecialism(spec)}
                          className="sr-only"
                        />
                        {spec}
                      </label>
                    ))}
                  </div>
                </div>

                <Select
                  label="Teaching Style"
                  options={TEACHING_STYLES}
                  placeholder="Select your style"
                  value={teachingStyle}
                  onChange={(e) => setTeachingStyle(e.target.value)}
                />

                <Input
                  label="Languages Spoken"
                  placeholder="English, Polish, Urdu"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  helperText="Comma separated"
                />

                <Select
                  label="Gender"
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                    { value: 'prefer-not-to-say', label: 'Prefer not to say' },
                  ]}
                  placeholder="Select gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                />

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={anxietyFriendly}
                    onChange={(e) => setAnxietyFriendly(e.target.checked)}
                    className="w-4 h-4 text-primary-500 rounded border-gray-300 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">
                    I am experienced with anxious or nervous learners
                  </span>
                </label>
              </div>
            )}

            {/* Step 4: Coverage */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Coverage & Pricing
                </h3>
                <Input
                  label="Postcodes Served"
                  placeholder="SW1, SW2, W1, W2"
                  value={postcodes}
                  onChange={(e) => setPostcodes(e.target.value)}
                  helperText="Comma separated postcode areas you cover"
                  required
                />
                <Input
                  label="Hourly Rate (GBP)"
                  type="number"
                  placeholder="35"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  helperText="Your standard lesson rate per hour"
                  required
                />
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
              ) : (
                <div />
              )}
              {step < totalSteps ? (
                <Button type="button" onClick={handleNext}>
                  Continue
                </Button>
              ) : (
                <Button type="submit" loading={loading}>
                  Complete Registration
                </Button>
              )}
            </div>
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
