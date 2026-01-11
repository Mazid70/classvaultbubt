import { useState } from 'react';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { FaFileAlt, FaUpload } from 'react-icons/fa';
import BTN from '../../Home/components/BTN';
import axios from 'axios';
import useCallData from '../../../customHooks/useCallData';
import { toast } from 'sonner';

const UploadModal = ({ onClose, refetch }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const axiosData = useCallData();

  const handleFileChange = e => {
    setSelectedFile(e.target.files[0]);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setProgress(0);
    onClose();
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error('Please select a file!');
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      const toastId = toast.loading('Uploading file...');

      /* ---------- Upload to Cloudinary ---------- */
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', 'classValut2');
      formData.append('folder', 'classvault/notes');

      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dczr62vlu/raw/upload',
        formData,
        {
          onUploadProgress: e => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress(percent);
            toast.loading(`Uploading ${percent}%`, { id: toastId });
          },
        }
      );

      const fileUrl = res.data.secure_url;

      /* ---------- Send metadata to backend ---------- */
      await axiosData.post('/notes/upload', {
        title: e.target.title.value,
        subject: e.target.subject.value,
        link: fileUrl,
      });

      toast.success('File uploaded successfully!', { id: toastId });
      refetch();
      handleClose();
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error(err?.response?.data?.error || 'Upload failed', {
        id: toastId,
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        data-aos="zoom-in"
        data-aos-duration="600"
        className="relative w-[420px] max-w-[90%] rounded-2xl border border-white/10 bg-[#1A1A1A]/90 p-8 shadow-xl"
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute cursor-pointer right-4 top-4 text-xl text-white/70 hover:text-white"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-white">
          <HiOutlineDocumentText className="text-indigo-400" />
          Upload Material
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title */}
          <div className="relative">
            <HiOutlineDocumentText className="absolute left-3 top-3 text-indigo-400" />
            <input
              type="text"
              name="title"
              required
              placeholder="Title"
              className="w-full rounded-xl border border-white/20 bg-white/5 py-2 pl-10 pr-4 text-white outline-none focus:border-indigo-400"
            />
          </div>

          {/* Subject */}
          <div className="relative">
            <HiOutlineDocumentText className="absolute left-3 top-3 text-indigo-400" />
            <select
              name="subject"
              required
              className="bg-[#252525] w-full backdrop-blur-lg border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none transition"
            >
              <option value="">Select Subject</option>
              <option value="CSE 207">CSE 207</option>
              <option value="CSE 208">CSE 208</option>
              <option value="CSE 209">CSE 209</option>
              <option value="CSE 210">CSE 210</option>
              <option value="CSE 231">CSE 231</option>
              <option value="CSE 232">CSE 232</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* File */}
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white transition hover:border-indigo-400">
            <FaFileAlt className="text-xl text-indigo-400" />
            <span className="truncate text-sm">
              {selectedFile ? selectedFile.name : 'Select PDF / DOC file'}
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              hidden
              onChange={handleFileChange}
            />
          </label>

          {selectedFile && (
            <p className="text-xs text-gray-400">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          )}

          {/* Progress */}
          {uploading && (
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-2 rounded-full bg-indigo-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="bg-gradient-to-r from-pink-400 to-indigo-600 h-10 cursor-pointer font-bold rounded-2xl hover:scale-105 transition-all flex justify-center items-center gap-3"
            text={uploading ? `Uploading ${progress}%` : 'Upload'}
            disabled={uploading}
          >
            <FaUpload /> Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
