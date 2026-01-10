import { useQuery } from '@tanstack/react-query';
import { FaEdit, FaTrash, FaFileAlt } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'sonner';
import useCallData from '../../../customHooks/useCallData';
import Loader from '../../../Components/Loader/Loader';

const MyNotes = () => {
  const axiosData = useCallData();

  // ================= STATE =================
  const [editNote, setEditNote] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ================= FETCH NOTES =================
  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['my-notes'],
    queryFn: async () => {
      const res = await axiosData.get('/notes/my');
      return res.data.data;
    },
  });

  // ================= DELETE NOTE =================
  const handleDelete = async id => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await axiosData.delete(`/notes/my/${id}`);
      toast.success('Note deleted successfully');
      refetch();
    } catch (err) {
      toast.error('Failed to delete note');
      console.error(err);
    }
  };

  // ================= UPDATE NOTE =================
  const handleUpdate = async () => {
    if (!editNote) return;

    try {
      let fileUrl = editNote.link;

      // Upload new PDF if selected
      if (pdfFile) {
        setUploading(true);

        const formData = new FormData();
        formData.append('file', pdfFile);
        formData.append('upload_preset', 'classValut2');
        formData.append('folder', 'classvault/notes');

        const res = await axios.post(
          'https://api.cloudinary.com/v1_1/dczr62vlu/raw/upload',
          formData
        );

        fileUrl = res.data.secure_url;
      }

      // Update note data
      await axiosData.patch(`/notes/my/${editNote._id}`, {
        title: editNote.title,
        subject: editNote.subject,
        link: fileUrl,
      });

      toast.success('Note updated successfully');

      setEditNote(null);
      setPdfFile(null);
      setUploading(false);
      refetch();
    } catch (err) {
      toast.error('Update failed');
      setUploading(false);
      console.error(err);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      {/* ================= SONNER TOASTER ================= */}
      <Toaster position="top-right" richColors />

      <section className="mt-10 space-y-6">
        {/* ================= HEADER ================= */}
        <div>
          <h2 className="text-3xl font-semibold text-white">My Notes</h2>
          <p className="text-sm text-white/60">
            Manage your uploaded study materials
          </p>
        </div>

        {/* ================= EMPTY ================= */}
        {data.length === 0 && (
          <div className="text-white/50 text-sm">
            You haven’t uploaded any notes yet.
          </div>
        )}

        {/* ================= NOTES LIST ================= */}
        <div className="grid gap-4">
          {data.map(note => (
            <div
              key={note._id}
              className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 flex justify-between items-start hover:border-indigo-400/40 transition"
            >
              {/* NOTE INFO */}
              <div className="space-y-1">
                <h4 className="text-white font-medium">{note.title}</h4>
                <p className="text-sm text-white/60">{note.subject}</p>

                <span
                  className={`inline-block text-xs px-3 py-1 rounded-full ${
                    note.approved
                      ? 'bg-green-400/10 text-green-400'
                      : 'bg-yellow-400/10 text-yellow-400'
                  }`}
                >
                  {note.approved ? 'Approved' : 'Pending'}
                </span>

                {/* FILE LINK */}
                {note.link && (
                  <a
                    href={note.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:underline mt-1"
                  >
                    <FaFileAlt /> View File
                  </a>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex gap-4 opacity-70 group-hover:opacity-100 transition">
                <button
                  onClick={() => setEditNote(note)}
                  className="text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => handleDelete(note._id)}
                  className="text-red-400 hover:text-red-300 cursor-pointer"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ================= EDIT MODAL ================= */}
        {editNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121212] p-6">
              <h3 className="text-white text-lg font-semibold mb-4">
                Edit Note
              </h3>

              {/* TITLE */}
              <input
                className="w-full mb-3 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-white outline-none focus:border-indigo-400"
                value={editNote.title}
                onChange={e =>
                  setEditNote({ ...editNote, title: e.target.value })
                }
                placeholder="Title"
              />

              {/* SUBJECT */}
              <input
                className="w-full mb-3 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-white outline-none focus:border-indigo-400"
                value={editNote.subject}
                onChange={e =>
                  setEditNote({ ...editNote, subject: e.target.value })
                }
                placeholder="Subject"
              />

              {/* FILE */}
              <label className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white cursor-pointer hover:border-indigo-400 mb-4">
                <FaFileAlt className="text-indigo-400" />
                <span className="truncate text-sm">
                  {pdfFile ? pdfFile.name : 'Replace file (optional)'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  hidden
                  onChange={e => setPdfFile(e.target.files[0])}
                />
              </label>

              {uploading && (
                <p className="text-xs text-white/60 mb-2">Uploading file...</p>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setEditNote(null);
                    setPdfFile(null);
                    setUploading(false);
                  }}
                  className="text-white/50 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  disabled={uploading}
                  onClick={handleUpdate}
                  className="text-green-400 hover:text-green-300 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default MyNotes;
