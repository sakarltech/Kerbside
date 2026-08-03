'use client';

import { useState } from 'react';
import MatchCard from '@/components/matching/MatchCard';
import MatchFilters from '@/components/matching/MatchFilters';

const MOCK_MATCHES = [
  {
    id: '1',
    name: 'James Wilson',
    score: 95,
    hourlyRate: 35,
    matchFactors: ['Location', 'Teaching Style', 'Anxiety Friendly', 'Language'],
    avatar: null,
  },
  {
    id: '2',
    name: 'Sarah Miller',
    score: 88,
    hourlyRate: 38,
    matchFactors: ['Location', 'Gender', 'Teaching Style'],
    avatar: null,
  },
  {
    id: '3',
    name: 'David Lee',
    score: 82,
    hourlyRate: 32,
    matchFactors: ['Location', 'Car Type', 'Language'],
    avatar: null,
  },
  {
    id: '4',
    name: 'Emma Thompson',
    score: 79,
    hourlyRate: 40,
    matchFactors: ['Teaching Style', 'Anxiety Friendly'],
    avatar: null,
  },
  {
    id: '5',
    name: 'Robert Clarke',
    score: 75,
    hourlyRate: 30,
    matchFactors: ['Location', 'Car Type'],
    avatar: null,
  },
];

export default function StudentMatchesPage() {
  const [matches] = useState(MOCK_MATCHES);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Matches</h1>
        <p className="text-gray-600 mt-1">
          Instructors matched to your preferences, sorted by compatibility.
        </p>
      </div>

      <MatchFilters />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((match) => (
          <MatchCard key={match.id} {...match} />
        ))}
      </div>

      {matches.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No matches found. Try adjusting your filters.
        </div>
      )}
    </div>
  );
}
