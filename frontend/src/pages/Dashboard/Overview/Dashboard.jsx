import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import useCallData from '../../../customHooks/useCallData';
import Loader from '../../../Components/Loader/Loader';


const Dashboard = () => {
  const axiosData = useCallData();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: async () => {
      const res = await axiosData.get('/notes/overview');
      return res.data;
    },
  });

  if (isLoading) {
    return <Loader/>;
  }

  const {
    role,
    totalNotes,
    approvedNotes,
    pendingNotes,
    totalStudents,
    totalReacts,
    subjectStats = [],
    recentNotes = [],
  } = data;
console.log(totalReacts)
  // 🔹 Cards (role based)
  const cards =
    role === 'student'
      ? [
          { label: 'My Notes', value: totalNotes },
          { label: 'Approved', value: approvedNotes },
          { label: 'Pending', value: pendingNotes },
          { label: 'Reacts', value: totalReacts },
        ]
      : [
          { label: 'Total Notes', value: totalNotes },
          { label: 'Approved', value: approvedNotes },
          { label: 'Pending', value: pendingNotes },
          { label: 'Students', value: totalStudents },
        ];

  const pieData = [
    { name: 'Approved', value: approvedNotes },
    { name: 'Pending', value: pendingNotes },
  ];

  const COLORS = ['#22c55e', '#facc15'];

  return (
    <div className="space-y-10 mt-10 w-full">
      {/* ================= CARDS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4"
          >
            <p className="text-sm text-gray-400">{card.label}</p>
            <h3 className="text-2xl font-semibold text-white">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid  md:grid-cols-2 gap-6">
        {/* Pie */}
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">Notes Status</h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={60}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar */}
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">Subject-wise Notes</h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={subjectStats}>
              <XAxis dataKey="_id" stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="count" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-5">
        <h3 className="text-white font-medium mb-4">
          {role === 'student' ? 'My Recent Notes' : 'Recent Notes'}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-white/10">
              <tr>
                <th className="text-left py-2">Title</th>
                {role !== 'student' && <th>Student ID</th>}
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {recentNotes.map(note => (
                <tr
                  key={note._id}
                  className="border-b border-white/5 text-gray-300"
                >
                  <td className="py-2">{note.title}</td>

                  {role !== 'student' && (
                    <td className="text-center">{note.user?.studentId}</td>
                  )}

                  <td className="text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        note.approved
                          ? 'bg-green-400/10 text-green-400'
                          : 'bg-yellow-400/10 text-yellow-400'
                      }`}
                    >
                      {note.approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>

                  <td className="text-center">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {recentNotes.length === 0 && (
          <p className="text-gray-400 text-sm mt-3">No recent activity found</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
