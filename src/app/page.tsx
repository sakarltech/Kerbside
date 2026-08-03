import Link from 'next/link';
import { Target, BarChart3, Calendar, Shield } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';

const features = [
  {
    icon: <Target className="w-8 h-8 text-primary-500" />,
    title: 'Smart Matching',
    description:
      'Our algorithm matches you with instructors based on your preferences, location, learning style, and personality.',
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-primary-500" />,
    title: 'Progress Tracking',
    description:
      'Track your learning journey with visual skill progress, lesson notes, and milestone tracking.',
  },
  {
    icon: <Calendar className="w-8 h-8 text-primary-500" />,
    title: 'Flexible Booking',
    description:
      'Book lessons that fit your schedule with real-time availability and instant confirmation.',
  },
  {
    icon: <Shield className="w-8 h-8 text-primary-500" />,
    title: 'Continuity Guarantee',
    description:
      'If your instructor becomes unavailable, we instantly match you with a compatible replacement.',
  },
];

const studentSteps = [
  { step: 1, title: 'Create Profile', description: 'Tell us your preferences and location' },
  { step: 2, title: 'Get Matched', description: 'Receive top instructor matches instantly' },
  { step: 3, title: 'Book & Learn', description: 'Book lessons and track your progress' },
];

const instructorSteps = [
  { step: 1, title: 'Sign Up', description: 'Register with your ADI credentials' },
  { step: 2, title: 'Set Availability', description: 'Configure your weekly schedule' },
  { step: 3, title: 'Start Teaching', description: 'Accept bookings and grow your business' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-dark-800 to-dark-900 text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Find Your Perfect
              <br />
              <span className="text-primary-400">Driving Instructor</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Smart matching connects you with the ideal instructor based on your
              preferences, location, and learning style. Start your driving journey
              with confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register/student">
                <Button variant="primary" size="lg">
                  Find an Instructor
                </Button>
              </Link>
              <Link href="/auth/register/instructor">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Join as Instructor
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose KerbSide?
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                We are building the smartest way to connect learner drivers with
                qualified instructors across the UK.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="text-center p-6 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all"
                >
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Students */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                  For Students
                </h3>
                <div className="space-y-6">
                  {studentSteps.map((item) => (
                    <div key={item.step} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructors */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                  For Instructors
                </h3>
                <div className="space-y-6">
                  {instructorSteps.map((item) => (
                    <div key={item.step} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-500 text-white flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-primary-500">1,000+</p>
                <p className="text-gray-600 mt-1">Instructors</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary-500">50,000+</p>
                <p className="text-gray-600 mt-1">Lessons Completed</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary-500">4.8</p>
                <p className="text-gray-600 mt-1">Average Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-primary-100 mb-8 text-lg">
              Join thousands of learners and instructors on KerbSide today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register/student">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary-600"
                >
                  Find an Instructor
                </Button>
              </Link>
              <Link href="/auth/register/instructor">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary-600"
                >
                  Join as Instructor
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
