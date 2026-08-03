'use client';

import { useState } from 'react';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';

export default function MatchFilters() {
  const [distance, setDistance] = useState('10');
  const [maxPrice, setMaxPrice] = useState('');
  const [gender, setGender] = useState('');
  const [carType, setCarType] = useState('');
  const [style, setStyle] = useState('');
  const [anxietyOnly, setAnxietyOnly] = useState(false);
  const [availability, setAvailability] = useState('');

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 items-end">
        <Input
          label="Distance (miles)"
          type="number"
          placeholder="10"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        />
        <Input
          label="Max Price (GBP)"
          type="number"
          placeholder="Any"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <Select
          label="Gender"
          options={[
            { value: '', label: 'Any' },
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
          ]}
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        />
        <Select
          label="Car Type"
          options={[
            { value: '', label: 'Any' },
            { value: 'hatchback', label: 'Hatchback' },
            { value: 'sedan', label: 'Saloon' },
            { value: 'suv', label: 'SUV' },
          ]}
          value={carType}
          onChange={(e) => setCarType(e.target.value)}
        />
        <Select
          label="Teaching Style"
          options={[
            { value: '', label: 'Any' },
            { value: 'patient', label: 'Patient' },
            { value: 'structured', label: 'Structured' },
            { value: 'friendly', label: 'Friendly' },
            { value: 'focused', label: 'Focused' },
          ]}
          value={style}
          onChange={(e) => setStyle(e.target.value)}
        />
        <Select
          label="Day"
          options={[
            { value: '', label: 'Any day' },
            { value: 'weekday', label: 'Weekdays' },
            { value: 'weekend', label: 'Weekends' },
          ]}
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        />
        <label className="flex items-center gap-2 cursor-pointer pb-2">
          <input
            type="checkbox"
            checked={anxietyOnly}
            onChange={(e) => setAnxietyOnly(e.target.checked)}
            className="w-4 h-4 text-primary-500 rounded border-gray-300 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700 whitespace-nowrap">Anxiety-friendly</span>
        </label>
      </div>
    </div>
  );
}
