import { useState } from 'react';
import UploadModal from './UploadModal';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdSearch } from 'react-icons/md';
import { TiPlus } from 'react-icons/ti';
import '../../../App.css'
const TopBar = ({ refetch, search, setSearch, resetPage, setFilter,filter }) => {
  const [openModal, setOpenModal] = useState(false);
  const [input, setInput] = useState('');

  const handleSearch = () => {
    const trimmed = input.trim();
    resetPage();
    setSearch(trimmed);
  };

  const handleReset = () => {
    setInput('');
    setSearch('');
    resetPage();
  };

  return (
    <main>
      <button
        onClick={() => setOpenModal(true)}
        className="md:hidden fixed rounded-full h-10 w-10 bg-gradient-to-r from-pink-400 to-purple-500 bottom-16 z-50 right-3 flex justify-center items-center cursor-pointer"
      >
        <TiPlus />
      </button>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mt-3 md:mt-6">
        {/* Search */}
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="search"
            placeholder="Search notes..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="w-full md:w-[300px] bg-white/5 border border-white/10 rounded-full px-4 py-3 text-white"
          />

          <button
            onClick={handleSearch}
            className="bg-indigo-500 px-4 rounded-full text-white"
          >
            <MdSearch />
          </button>

          {/* ✅ Reset only when search exists */}
          {search && (
            <button
              onClick={handleReset}
              className="bg-gray-500 px-4 rounded-full text-white"
            >
              Reset
            </button>
          )}
        </div>

        {/* upload  */}
        <div>
          <button
            onClick={() => setOpenModal(true)}
            className="hidden cursor-pointer bg-gradient-to-r from-pink-400 to-purple-500 px-5 py-3 rounded-full text-white md:flex items-center gap-2"
          >
            <FaCloudUploadAlt className="text-xl" />
            Upload
          </button>

          {openModal && (
            <UploadModal
              onClose={() => setOpenModal(false)}
              onSubmit={refetch}
            />
          )}
        </div>
      </div>
      <div className="md:mt-6 flex gap-3 overflow-x-auto overflow-y-hidden px-2 md:p-0 scrollbar-hide justify-start md:justify-center ">
        {[
          'All',
          'CSE 207',
          'CSE 208',
          'CSE 209',
          'CSE 210',
          'CSE 231',
          'CSE 232',
          'Others',
        ].map((val, idx) => {
          const isActive = filter === val || (val === 'All' && filter === '');

          return (
            <button
              key={idx}
              onClick={() => setFilter(val === 'All' ? '' : val)}
              className={`flex-shrink-0 xl:w-36 2xl:w-[148px] px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer
          ${
            isActive
              ? 'bg-gradient-to-r from-pink-400/20 to-purple-500/20 text-white shadow-md scale-105'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
            >
              {val}
            </button>
          );
        })}
      </div>
    </main>
  );
};

export default TopBar;
