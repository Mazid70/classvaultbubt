import { useState } from 'react';
import UploadModal from './UploadModal';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdSearch } from 'react-icons/md';

const TopBar = ({ refetch, setSearch, resetPage,setFilter }) => {
  const [openModal, setOpenModal] = useState(false);
  const [input, setInput] = useState('');
  // Trigger search
  const handleSearch = value => {
    resetPage();
    setSearch(value.trim());
  };

  // Input change
  const handleInputChange = e => {
    setInput(e.target.value);
  };

  // Reset button click
  const handleReset = () => {
    setInput('');
    handleSearch('');
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center w-full">
      {/* Search Input + Buttons */}
      <div className="flex w-full md:w-auto gap-2">
        <input
          type="search"
          placeholder="Search notes, subjects..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={e => e.key === 'Enter' && handleSearch(input)}
          className="w-full md:w-[300px] bg-white/5 backdrop-blur-lg border border-white/10 rounded-full px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />

        <button
          onClick={() => handleSearch(input)}
          className="bg-indigo-500 px-4 py-2   cursor-pointer rounded-full text-white font-medium hover:bg-indigo-600 transition"
        >
          <MdSearch />
        </button>

        <button
          onClick={handleReset}
          className="bg-gray-500 cursor-pointer px-4 py-2 rounded-full text-white font-medium hover:bg-gray-600 transition"
        >
          Reset
        </button>
      </div>

      {/* Select + Upload */}
      <div className="flex gap-3 mt-2 md:mt-0">
        <select
          onChange={e => setFilter(e.target.value)}
          name="subject"
          required
          className="bg-[#252525] w-full backdrop-blur-lg border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none transition "
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

        <button
          onClick={() => setOpenModal(true)}
          className="bg-gradient-to-r cursor-pointer from-pink-400 to-purple-500 px-5 py-3 rounded-full text-white font-medium flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105 transform transition"
        >
          <FaCloudUploadAlt className="text-2xl" />{' '}
          <span className="hidden xl:block">Upload</span>
        </button>

        {openModal && (
          <UploadModal
            onClose={() => setOpenModal(false)}
            onSubmit={() => refetch()}
            refetch={refetch}
          />
        )}
      </div>
    </div>
  );
};

export default TopBar;
