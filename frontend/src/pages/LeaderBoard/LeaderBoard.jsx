import React, { useContext } from 'react';
import '../../App.css';
import useCallData from '../../customHooks/useCallData';
import { useQuery } from '@tanstack/react-query';
import Loader from '../../Components/Loader/Loader';
import NotUser from '../../Components/NotUser/NotUser';
import { AuthContext } from '../../Provider/AuthProvider';

const Leaderboard = () => {
  const axiosData = useCallData();
  const { user } = useContext(AuthContext);

  const { data = [], isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const res = await axiosData.get('/notes/leaderboard');
      return res.data;
    },
    enabled: !!user,
  });

  if (!user || user.status === 'Pending' || user.status === 'Blocked') {
    return <NotUser status={user?.status} />;
  }

  if (isLoading) return <Loader />;

  const [first, second, third, ...others] = data;

  return (
    <div
      className="min-h-screen xl:h-screen bg-[#0b0f1a] pt-24 pb-12 px-4 relative overflow-hidden"
      data-aos="fade-in"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 w-[300px] md:w-[900px] h-[300px] md:h-[900px] bg-gradient-to-b from-pink-400/10 to-purple-500/10 blur-[80px] md:blur-[180px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header */}
        <div
          className="text-center mb-10 md:mb-16"
          data-aos="fade-down"
          data-aos-duration="800"
        >
          <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide">
            Leaderboard
          </h1>
          <p className="text-gray-400 mt-2 text-xs md:text-sm px-4">
            Ranked by total reactions from shared Materials
          </p>
        </div>

        {/* TOP 3 - Responsive Flexbox */}
        <div className="flex flex-col md:flex-row justify-center items-center md:items-end gap-8 md:gap-6 lg:gap-10 mb-12">
          {/* Rank 2 - Shown 2nd on Desktop, 2nd on Mobile */}
          {second && (
            <div className="order-2 md:order-1">
              <TopCard
                user={second}
                rank={2}
                size="md"
                accent="from-slate-400/30"
                dataAos="fade-up"
                dataAosDuration="600"
                dataAosDelay="200"
              />
            </div>
          )}

          {/* Rank 1 - Shown 1st on Desktop (middle), 1st on Mobile */}
          {first && (
            <div className="order-1 md:order-2">
              <TopCard
                user={first}
                rank={1}
                size="lg"
                accent="from-pink-400/40"
                winner
                dataAos="zoom-in"
                dataAosDuration="700"
              />
            </div>
          )}

          {/* Rank 3 - Shown 3rd on Desktop, 3rd on Mobile */}
          {third && (
            <div className="order-3 md:order-3">
              <TopCard
                user={third}
                rank={3}
                size="md"
                accent="from-indigo-400/30"
                dataAos="fade-up"
                dataAosDuration="600"
                dataAosDelay="400"
              />
            </div>
          )}
        </div>

        {/* Others Table - Responsive Wrapper */}
        <div
          className="bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/10 overflow-hidden shadow-xl"
          data-aos="fade-up"
          data-aos-duration="700"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-white/5 text-gray-400">
                <tr>
                  <th className="px-6 py-4 text-left">Rank</th>
                  <th className="px-6 py-4 text-left">Student</th>
                  <th className="px-6 py-4 text-right">Materials</th>
                  <th className="px-6 py-4 text-right">Comments</th>
                  <th className="px-6 py-4 text-right">Reacts</th>
                </tr>
              </thead>

              <tbody>
                {others.map((u, i) => (
                  <tr
                    key={u._id}
                    className="border-t border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-300">
                      #{i + 4}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.photoUrl}
                          alt={u.userName}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10 shrink-0"
                        />
                        <div className="truncate">
                          <p className="text-white flex items-center gap-2">
                            <span className="truncate">{u.userName}</span>
                            {(u.role === 'admin' || u.role === 'cr') && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-400/30 uppercase shrink-0">
                                {u.role}
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            ID: {u.studentId}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right text-gray-300">
                      {u.totalNotes}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-300">
                      {u.totalComments}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-pink-400">
                      {u.totalReacts}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Internal UI Block ---------- */

const TopCard = ({
  user,
  rank,
  size,
  accent,
  winner,
  dataAos,
  dataAosDuration,
  dataAosDelay,
}) => {
  // Logic for responsive sizing of cards
  const cardWidth = size === 'lg' ? 'w-78 md:w-52' : 'w-78 md:w-52';
  const imgSize =
    size === 'lg' ? 'w-24 h-24 md:w-28 md:h-28' : 'w-20 h-20 md:w-24 md:h-24';

  return (
    <div
      className={`relative ${size === 'lg' ? 'md:scale-110' : ''}`}
      data-aos={dataAos}
      data-aos-duration={dataAosDuration}
      data-aos-delay={dataAosDelay}
    >
      {/* Glow */}
      <div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-b ${accent} to-transparent blur-xl`}
      />

      <div
        className={`relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/15 shadow-2xl ${cardWidth}`}
      >
        {/* Crown */}
        {winner && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-pink-400 text-3xl animate-bounce">
            👑
          </div>
        )}

        {/* Role badge */}
        {(user.role === 'admin' || user.role === 'cr') && (
          <span className="absolute top-3 right-3 px-2 py-0.5 text-[9px] rounded-full bg-green-500/20 text-green-400 border border-green-400/30 uppercase">
            {user.role}
          </span>
        )}

        <img
          src={user.photoUrl}
          alt={user.userName}
          className={`mx-auto rounded-full object-cover ring-2 ring-pink-400 ${imgSize}`}
        />

        <h3 className="mt-4 text-white font-semibold text-center truncate px-1">
          {user.userName}
        </h3>
        <p className="text-xs text-gray-400 text-center uppercase tracking-wider">
          Rank #{rank}
        </p>

        {/* Stats */}
        <div className="mt-5 bg-black/30 rounded-2xl py-3 text-center space-y-1">
          <p className="text-2xl font-bold text-pink-400">{user.totalReacts}</p>
          <p className="text-[10px] uppercase text-gray-400 font-medium">
            Reactions
          </p>
          <p className="text-xs text-gray-300">{user.totalNotes} Materials</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
