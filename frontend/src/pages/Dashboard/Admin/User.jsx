import React, { useState, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaTrash, FaCheck, FaBan } from 'react-icons/fa';
import useCallData from '../../../customHooks/useCallData';
import { AuthContext } from '../../../Provider/AuthProvider';
import Loader from '../../../Components/Loader/Loader';

// Status and role colors
const statusColors = {
  Pending: 'bg-yellow-500',
  Accepted: 'bg-green-500',
  Blocked: 'bg-red-500',
};

const roleColors = {
  admin: 'bg-purple-500',
  cr: 'bg-blue-500',
  student: 'bg-indigo-500',
};

const User = () => {
  const axiosData = useCallData();
  const { user: currentUser } = useContext(AuthContext);

  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(10);
  const [modalUser, setModalUser] = useState(null);
  const [blockReason, setBlockReason] = useState('');
  const [blockModal, setBlockModal] = useState(false);

  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['users', search, limit],
    queryFn: async () => {
      const res = await axiosData.get(`/users?search=${search}&limit=${limit}`);
      return res.data.users;
    },
    keepPreviousData: true,
  });

  const openStatusModal = user => {
    setModalUser(user);
    setBlockModal(false);
    setBlockReason('');
  };

  const handleStatusUpdate = async newStatus => {
    if (!modalUser) return;
    try {
      if (newStatus === 'Blocked' && !blockReason) {
        setBlockModal(true);
        return;
      }
      await axiosData.patch(`/users/${modalUser._id}/status`, {
        status: newStatus,
        reason: blockReason,
      });
      setModalUser(null);
      setBlockReason('');
      setBlockModal(false);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async userId => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await axiosData.delete(`/users/${userId}`);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading)
    return <Loader/>

  return (
    <div className="xl:p-6 w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-white text-2xl font-semibold">Users</h2>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users..."
          className="px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 placeholder-gray-400 focus:outline-none focus:border-indigo-400 backdrop-blur"
        />
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto rounded-2xl border-t border-white/20 "
        data-aos="zoom-in"
        data-aos-duration="600"
      >
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr>
              {[
                'Photo',
                'Name',
                'Student ID',
                'Email',
                'Role',
                'Status',
                'Actions',
              ].map(h => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {users.map(u => (
              <tr
                key={u?._id}
                className="bg-white/10 backdrop-blur-lg rounded-xl transition hover:bg-white/20"
              >
                {/* Photo */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={u?.photoUrl || 'https://i.pravatar.cc/40'}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border border-white/20 object-cover"
                  />
                </td>

                {/* Name */}
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {u?.userName || '?'}
                </td>

                {/* Student ID */}
                <td className="px-6 py-4 whitespace-nowrap text-white">
                  {u?.studentId || '?'}
                </td>

                {/* Email */}
                <td className="px-6 py-4 whitespace-nowrap text-white break-all">
                  {u?.email || '?'}
                </td>

                {/* Role */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-xl text-white text-xs ${
                      roleColors[u.role] || 'bg-gray-400'
                    }`}
                  >
                    {u?.role || '?'}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-xl text-white text-xs ${
                      statusColors[u?.status] || 'bg-yellow-500'
                    }`}
                  >
                    {u?.status || 'Pending'}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap flex justify-center gap-2">
                  {u?.role !== 'admin' && (
                    <>
                      {/* Accept button if not accepted */}
                      {u.status !== 'Accepted' && (
                        <button
                          onClick={() => openStatusModal(u)}
                          className="text-green-500 cursor-pointer hover:text-green-600 transition"
                          title="Accept"
                        >
                          <FaCheck />
                        </button>
                      )}

                      {/* Block button if accepted */}
                      {u.status === 'Accepted' && (
                        <button
                          onClick={() => {
                            setModalUser(u);
                            setBlockModal(true);
                          }}
                          className="text-red-500 cursor-pointer hover:text-red-600 transition"
                          title="Block"
                        >
                          <FaBan />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="text-red-400 cursor-pointer hover:text-red-500 transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Load More */}
      {users.length >= limit && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setLimit(prev => prev + 10)}
            className="px-6 py-2 rounded-xl bg-indigo-500/80 hover:bg-indigo-600 text-white transition"
          >
            Load More
          </button>
        </div>
      )}

      {/* Accept Modal */}
      {modalUser && !blockModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 w-96 relative">
            <h2 className="text-white text-lg font-semibold mb-4">
              Accept {modalUser.userName}
            </h2>
            <button
              onClick={() => handleStatusUpdate('Accepted')}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl transition mb-2"
            >
              Accept
            </button>
            <button
              onClick={() => {
                setModalUser(null);
                setBlockModal(false);
              }}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setModalUser(null);
                setBlockModal(false);
              }}
              className="absolute top-3 right-3 text-white text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Block Modal */}
      {modalUser && blockModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 w-96 relative">
            <h2 className="text-white text-lg font-semibold mb-4">
              Block {modalUser.userName}
            </h2>
            <textarea
              value={blockReason}
              onChange={e => setBlockReason(e.target.value)}
              placeholder="Enter reason for blocking..."
              className="w-full px-3 py-2 rounded-xl bg-white/10 text-white border border-white/20 backdrop-blur focus:outline-none mb-4"
            />
            <div className="flex gap-4">
              <button
                onClick={() => handleStatusUpdate('Blocked')}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition"
              >
                Block
              </button>
              <button
                onClick={() => {
                  setBlockModal(false);
                  setBlockReason('');
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-xl transition"
              >
                Cancel
              </button>
            </div>
            <button
              onClick={() => {
                setModalUser(null);
                setBlockModal(false);
                setBlockReason('');
              }}
              className="absolute top-3 right-3 text-white text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
