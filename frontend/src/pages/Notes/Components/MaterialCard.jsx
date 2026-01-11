import { FaRegHeart, FaHeart, FaRegCommentDots } from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { useState, useEffect, useContext } from 'react';
import CommentModal from './CommentModal';
import TimeAgo from '../../../Components/TimeAgo/TimeAgo';
import useCallData from '../../../customHooks/useCallData';
import { AuthContext } from '../../../Provider/AuthProvider';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { MdDelete } from 'react-icons/md';
import { toast } from 'sonner';

AOS.init();

const MaterialCard = ({ note, refetch }) => {
  const { user } = useContext(AuthContext);
  const axiosData = useCallData();

  const [open, setOpen] = useState(false);
  const [reacts, setReacts] = useState(note?.reacts || []);

  // keep likes synced after refetch
  useEffect(() => {
    setReacts(note?.reacts || []);
  }, [note?.reacts]);

  const handleLike = async () => {
    const userId = user?.studentId;
    const alreadyLiked = reacts.includes(userId);

    // 🔥 Optimistic UI update
    setReacts(prev =>
      alreadyLiked ? prev.filter(id => id !== userId) : [...prev, userId]
    );

    try {
      await axiosData.patch(`/notes/${note._id}/react`);
    } catch (err) {
      // ❌ rollback on error
      setReacts(note?.reacts || []);
      console.error(err);
    }
  };
 const handleDelete = async () => {
   const toastId = toast.loading('Deleting note...');

   try {
     await axiosData.delete(`/notes/all/${note._id}`);

     toast.success('Note deleted successfully', {
       id: toastId,
     });

     refetch(); // refresh notes list if needed
   } catch (error) {
     toast.error('Failed to delete note', {
       id: toastId,
     });
     console.error(error);
   }
 };
  return (
    <>
      <div
        className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 hover:border-indigo-400/60 hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] transition-all relative"
        data-aos="zoom-in"
        data-aos-duration="600"
      >
        {
         (user?.role==='admin'||user?.role==='cr') &&<MdDelete onClick={handleDelete} className="absolute right-5 text-xl text-red-400 cursor-pointer hover:scale-110 hover:text-red-500 transition-all" />
        }
        {/* Title */}
        <div className="flex gap-3">
          <HiOutlineDocumentText className="text-indigo-400 text-2xl mt-1" />
          <div>
            <h3 className="text-white font-semibold leading-snug">
              {note?.title}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Subject: {note?.subject}
            </p>
          </div>
        </div>

        {/* Uploader */}
        <div className="flex items-center gap-3 mt-4">
          <img
            src={note?.user?.photoUrl}
            className="w-9 h-9 rounded-full border border-white/20"
            alt="user"
          />
          <div className="text-xs">
            <p className="text-gray-200 font-medium">{note?.user?.userName}</p>
            <p className="text-gray-500">ID: {note?.user?.studentId}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-5 text-xs text-gray-400">
          <span>
            <TimeAgo date={note?.createdAt} />
          </span>

          <div className="flex items-center gap-4 text-sm">
            {/* LIKE */}
            <button
              onClick={handleLike}
              className="flex items-center gap-1 hover:text-red-400 transition"
            >
              {reacts.includes(user?.studentId) ? (
                <FaHeart className="text-red-500 cursor-pointer" />
              ) : (
                <FaRegHeart className="cursor-pointer" />
              )}
              {reacts.length}
            </button>

            {/* COMMENT */}
            <button
              onClick={() => setOpen(true)}
              className="flex items-center cursor-pointer gap-1 hover:text-indigo-400 transition"
            >
              <FaRegCommentDots />
              {note?.comments?.length || 0}
            </button>

            {/* VIEW */}
            <a
              href={note?.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline"
            >
              View
            </a>
          </div>
        </div>
      </div>

      {open && (
        <CommentModal
          onClose={() => setOpen(false)}
          comments={note.comments}
          noteId={note._id}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default MaterialCard;
