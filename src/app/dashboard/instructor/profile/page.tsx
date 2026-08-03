'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';

export default function InstructorProfilePage() {
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [name, setName] = useState('John Smith');
  const [phone, setPhone] = useState('07700 900000');
  const [bio, setBio] = useState('Experienced driving instructor with 10 years of teaching.');
  const [teachingStyle, setTeachingStyle] = useState('patient');
  const [carType, setCarType] = useState('hatchback');
  const [transmission, setTransmission] = useState('manual');
  const [hourlyRate, setHourlyRate] = useState('35');
  const [languages, setLanguages] = useState('English');
  const [postcodes, setPostcodes] = useState('SW1, SW2, W1');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/instructor/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone, bio, teachingStyle, carType,
          transmission, hourlyRate: parseFloat(hourlyRate),
          languages: languages.split(',').map(l => l.trim()),
          postcodes: postcodes.split(',').map(p => p.trim()),
        }),
      });
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (previewMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Profile Preview</h1>
          <Button variant="outline" onClick={() => setPreviewMode(false)}>
            Edit Profile
          </Button>
        </div>
        <Card>
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">{name}</h2>
            <p className="text-gray-600">{bio}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Teaching Style:</span> {teachingStyle}</div>
              <div><span className="text-gray-500">Car:</span> {carType} ({transmission})</div>
              <div><span className="text-gray-500">Rate:</span> &pound;{hourlyRate}/hr</div>
              <div><span className="text-gray-500">Languages:</span> {languages}</div>
              <div><span className="text-gray-500">Areas:</span> {postcodes}</div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-1">Update your instructor profile details.</p>
        </div>
        <Button variant="outline" onClick={() => setPreviewMode(true)}>
          Preview
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <Select
            label="Teaching Style"
            options={[
              { value: 'patient', label: 'Patient & Calm' },
              { value: 'structured', label: 'Structured & Methodical' },
              { value: 'friendly', label: 'Friendly & Chatty' },
              { value: 'focused', label: 'Focused & Efficient' },
            ]}
            value={teachingStyle}
            onChange={(e) => setTeachingStyle(e.target.value)}
          />
          <Select
            label="Car Type"
            options={[
              { value: 'hatchback', label: 'Hatchback' },
              { value: 'sedan', label: 'Saloon' },
              { value: 'suv', label: 'SUV' },
            ]}
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
          />
          <Select
            label="Transmission"
            options={[
              { value: 'manual', label: 'Manual' },
              { value: 'automatic', label: 'Automatic' },
              { value: 'both', label: 'Both' },
            ]}
            value={transmission}
            onChange={(e) => setTransmission(e.target.value)}
          />
          <Input label="Hourly Rate (GBP)" type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
          <Input label="Languages" value={languages} onChange={(e) => setLanguages(e.target.value)} helperText="Comma separated" />
          <Input label="Postcodes Served" value={postcodes} onChange={(e) => setPostcodes(e.target.value)} helperText="Comma separated" />

          <div className="pt-4">
            <Button type="submit" loading={saving}>Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
