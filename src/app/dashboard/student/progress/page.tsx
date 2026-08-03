import SkillChart from '@/components/progress/SkillChart';
import LessonLog from '@/components/progress/LessonLog';
import Card from '@/components/ui/Card';

export default function StudentProgressPage() {
  const skills = [
    { name: 'Manoeuvres', level: 4, maxLevel: 5 },
    { name: 'Road Awareness', level: 3, maxLevel: 5 },
    { name: 'Speed Control', level: 4, maxLevel: 5 },
    { name: 'Mirror Checks', level: 5, maxLevel: 5 },
    { name: 'Junctions', level: 3, maxLevel: 5 },
    { name: 'Roundabouts', level: 2, maxLevel: 5 },
    { name: 'Parking', level: 3, maxLevel: 5 },
    { name: 'Dual Carriageway', level: 2, maxLevel: 5 },
  ];

  const lessons = [
    {
      id: '1',
      date: '2024-02-12',
      instructor: 'James Wilson',
      skills: ['Roundabouts', 'Road Awareness'],
      notes: 'Good progress on roundabouts. Need to work on checking mirrors at approaches.',
      rating: 4,
    },
    {
      id: '2',
      date: '2024-02-08',
      instructor: 'James Wilson',
      skills: ['Manoeuvres', 'Parking'],
      notes: 'Parallel parking much improved. Bay parking still needs practice.',
      rating: 5,
    },
    {
      id: '3',
      date: '2024-02-05',
      instructor: 'James Wilson',
      skills: ['Speed Control', 'Junctions'],
      notes: 'Confident at T-junctions. Working on crossroads timing.',
      rating: 4,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Progress</h1>
        <p className="text-gray-600 mt-1">Track your driving skills development.</p>
      </div>

      <Card header={<h3 className="font-semibold text-gray-900">Skill Progress</h3>}>
        <SkillChart skills={skills} />
      </Card>

      <Card header={<h3 className="font-semibold text-gray-900">Lesson History</h3>}>
        <LessonLog lessons={lessons} />
      </Card>
    </div>
  );
}
