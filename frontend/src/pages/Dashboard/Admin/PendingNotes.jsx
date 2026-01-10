import { useQuery } from '@tanstack/react-query';
import {
  FaCheck,
  FaTrash,
  FaEye,
  FaClock,
  FaUserCircle,
  FaTimes,
} from 'react-icons/fa';
import { useState } from 'react';
import useCallData from '../../../customHooks/useCallData';
import TimeAgo from '../../../Components/TimeAgo/TimeAgo';
import { toast, Toaster } from 'sonner';
import Loader from '../../../Components/Loader/Loader';

const PendingNotes = () => {
  const axiosData = useCallData();
  const [page, setPage] = useState(1);
  const limit = 3;

  // 🔴 Delete modal states
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [reason, setReason] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['pending-notes', page],
    queryFn: async () => {
      const res = await axiosData.get(
        `/notes/pending?page=${page}&limit=${limit}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const notes = data?.data || [];
  const totalPages = data?.totalPages || 1;

  // 🔹 Approve
  const handleApprove = async id => {
    try {
      await axiosData.patch(`/notes/${id}/approve`);
      toast.success('Note approved successfully!');
      refetch();
    } catch (err) {
      console.error(err);
      toast.error('Failed to approve note.');
    }
  };

  // 🔹 Open delete modal
  const openDeleteModal = id => {
    setDeleteId(id);
    setOpenModal(true);
  };

  // 🔹 Confirm delete
  const handleDelete = async () => {
    if (!reason.trim()) return;

    try {
      await axiosData.delete(`/notes/${deleteId}`, { data: { reason } });
      toast.success('Note deleted successfully!');
      setOpenModal(false);
      setReason('');
      setDeleteId(null);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete note.');
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      {/* ================= SONNER TOASTER ================= */}
      <Toaster position="top-right" richColors />

      <div className="space-y-6 relative mt-10 w-full">
        {/* Header */}
        <div data-aos="fade-up">
          <h2 className="text-2xl font-semibold text-white">Pending Notes</h2>
          <p className="text-gray-400 text-sm">
            Review and approve notes submitted by students
          </p>
        </div>

        {/* Notes */}
        {notes.length === 0 ? (
          <div className="text-gray-400 text-sm backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4">
            🎉 No pending notes found
          </div>
        ) : (
          notes.map(note => (
            <div
              key={note._id}
              data-aos="fade-up"
              className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 space-y-3"
            >
              {/* Top */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-white font-medium text-lg">
                    {note.title}
                  </h4>
                  <p className="text-sm text-gray-400">
                    Subject: {note.subject}
                  </p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                  Pending
                </span>
              </div>

              {/* User info */}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-3">
                  {note.user?.photoUrl ? (
                    <img
                      src={note.user.photoUrl}
                      alt="user"
                      className="w-8 h-8 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <FaUserCircle className="text-3xl text-gray-500" />
                  )}

                  <div>
                    <p className="text-gray-300">
                      {note.user?.userName || 'Student'}
                    </p>
                    <p className="text-gray-500">ID: {note.user?.studentId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <FaClock />
                  <span>
                    <TimeAgo date={note.createdAt} />
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                <a
                  href={note.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm cursor-pointer"
                >
                  <FaEye /> View
                </a>

                <button
                  onClick={() => handleApprove(note._id)}
                  className="flex items-center gap-1 text-green-400 hover:text-green-300 text-sm cursor-pointer"
                >
                  <FaCheck /> Approve
                </button>

                <button
                  onClick={() => openDeleteModal(note._id)}
                  className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm cursor-pointer"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-4 fixed bottom-20 left-1/2 -translate-x-1/2 w-full">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 rounded bg-white/10 text-gray-300 cursor-pointer disabled:opacity-40"
            >
              Prev
            </button>

            <span className="text-sm text-gray-400 px-2">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 rounded bg-white/10 text-gray-300 cursor-pointer disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}

        {/* 🔴 Delete Modal */}
        {openModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1A1A1A] border border-white/10 rounded-xl w-full max-w-md p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg text-white font-semibold">
                  Delete Note
                </h3>
                <FaTimes
                  onClick={() => setOpenModal(false)}
                  className="text-gray-400 cursor-pointer hover:text-white"
                />
              </div>

              <p className="text-sm text-gray-400">
                Please provide a reason for deleting this note.
              </p>

              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Write delete reason..."
                className="w-full h-24 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 p-3 focus:outline-none"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 rounded bg-white/10 text-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={!reason.trim()}
                  className="px-4 py-2 rounded bg-red-500/20 text-red-400 border border-red-500/30 cursor-pointer disabled:opacity-40"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PendingNotes;
