import Link from 'next/link';

export default function Footer() {
  const columns = [
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Students',
      links: [
        { label: 'Find Instructor', href: '/instructors' },
        { label: 'How It Works', href: '/#how-it-works' },
        { label: 'FAQs', href: '/faqs' },
      ],
    },
    {
      title: 'Instructors',
      links: [
        { label: 'Join as Instructor', href: '/auth/register/instructor' },
        { label: 'Resources', href: '/resources' },
        { label: 'Support', href: '/support' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
      ],
    },
  ];

  return (
    <footer className="bg-dark-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                {column.title}
              </h4>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} KerbSide. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
