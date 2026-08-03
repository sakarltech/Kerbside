import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { PoundSterling, TrendingUp, Wallet } from 'lucide-react';

export default function EarningsPage() {
  // Placeholder data
  const stats = {
    thisWeek: 480,
    thisMonth: 1920,
    total: 12450,
  };

  const payoutHistory = [
    { id: '1', date: '2024-02-01', amount: 1850, status: 'paid' },
    { id: '2', date: '2024-01-01', amount: 2100, status: 'paid' },
    { id: '3', date: '2023-12-01', amount: 1780, status: 'paid' },
    { id: '4', date: '2023-11-01', amount: 1950, status: 'paid' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-gray-600 mt-1">Track your income and payouts.</p>
      </div>

      {/* Earnings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <PoundSterling className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">&pound;{stats.thisWeek}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">&pound;{stats.thisMonth}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Wallet className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">&pound;{stats.total.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Commission Info */}
      <Card>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-lg mt-0.5">
            <PoundSterling className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Commission Structure</h3>
            <p className="text-sm text-gray-600 mt-1">
              KerbSide charges a 15% commission on each booking. This covers payment processing,
              platform maintenance, matching services, and customer support. Your earnings shown
              above are after commission has been deducted.
            </p>
          </div>
        </div>
      </Card>

      {/* Payout History */}
      <Card header={<h3 className="font-semibold text-gray-900">Payout History</h3>}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {payoutHistory.map((payout) => (
                <tr key={payout.id} className="border-b border-gray-50">
                  <td className="py-3 text-gray-900">{payout.date}</td>
                  <td className="py-3 text-gray-900 font-medium">&pound;{payout.amount.toLocaleString()}</td>
                  <td className="py-3">
                    <Badge variant="success">{payout.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
