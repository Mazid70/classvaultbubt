import React, { useContext, useState } from 'react';
import TopBar from './Components/TopBar';
import MaterialCard from './Components/MaterialCard';
import '../../App.css';
import useCallData from '../../customHooks/useCallData';
import { useQuery } from '@tanstack/react-query';
import NotUser from '../../Components/NotUser/NotUser';
import { AuthContext } from '../../Provider/AuthProvider';
import Pagination from '../../Components/Pagination/Pagination';
import NoDataFound from '../../Components/NoData/NoDataFound';
import Loader from '../../Components/Loader/Loader';

const Notes = () => {
  const axiosData = useCallData();
  const { user } = useContext(AuthContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const itemsPerPage = 6;

  const {
    data: notesData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['notes', search, currentPage, filter],
    queryFn: async () => {
      const res = await axiosData.get(
        `/notes?search=${search}&filter=${filter}&page=${currentPage}&limit=${itemsPerPage}`
      );
      return res.data;
    },
    enabled: !!user,
  });

  // Destructure
  const notes = notesData?.data || [];
  const totalCount = notesData?.totalCount || 0;

  // Pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const pages = [...Array(totalPages).keys()];

  const resetPage = () => setCurrentPage(1);

  // User check
  if (!user || user.status === 'Pending' || user.status === 'Blocked') {
    return <NotUser status={user?.status} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] px-5 py-10 relative py-20 overflow-x-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none z-0 absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-to-b from-pink-400/10 to-purple-500/10 blur-[120px] -translate-x-1/2 -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header */}
        <div className=" mb-2 md:mb-8">
          <h1 className=" text-xl xl:text-3xl font-semibold text-white">
            Notes & Study Materials
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Share and access section-wise academic resources
          </p>
        </div>

        {/* Top Bar */}
        <TopBar
          refetch={refetch}
          search={search}        
          setSearch={setSearch}
          resetPage={resetPage}
          setFilter={setFilter}
          filter={filter}
        />

        {/* Cards */}
        {notes.length === 0 ? (
          <NoDataFound message="No Notes Found" />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {notes.map(note => (
              <MaterialCard
                key={note._id}
                note={note}
                refetch={refetch}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          pages={pages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Notes;
