import { NavLink } from 'react-router';

import Link from './Link';
import { useContext } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import logo from '../../assets/logo.png'
import Notification from './Notification';
const Navbar = () => {
   const { user, handleLogout } = useContext(AuthContext);
  const link = (
    <ul className="flex flex-col xl:flex-row  gap-5 xl:items-center">
      <Link link="/" title="HOME" />
      <Link link="/materials" title="MATERIALS" />
      <Link link="/coverpage" title="COVER PAGE" />
      <Link link="/leaderboard" title="LEADERBOARD" />
    </ul>
  );

  
  
  return (
    <nav className="px-5 h-16 xl:px-10 2xl:px-0 backdrop-blur-xl fixed top-0 border-b-[0.1px] border-gray-800 z-50 w-full flex items-center">
      <div className="w-7xl mx-auto text-white flex justify-between items-center">
        
        <div className=" flex items-center gap-3">
          <img src={logo} alt="" className="h-6 w-6" />
          <h1 className="font-bold">Class Vault</h1>
        </div>
        <div className="flex items-center gap-5">
          <div className="hidden xl:flex gap-5">
            {link} {user && <Notification />}
          </div>

          {!user && (
            <NavLink
              to="/signin"
              className="translate-x-[110px] xl:translate-x-0 p-[1px] bg-gradient-to-r rounded-full  from-pink-400 via-purple-500 to-blue-500"
            >
              <button className="cursor-pointer relative bg-[#1A1A1A] rounded-full  px-3 py-1 font-bold text-white transition-colors duration-300 ease-linear bg- before:absolute before:top-1/2 before:left-1/2 before:-z-10 before:h-7 before:w-[60px] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-gradient-to-r before:from-pink-500 before:to-purple-500 before:opacity-50 before:animate-ping hover:from-pink-600 hover:to-purple-600 hover:before:from-pink-600 hover:before:to-purple-600">
                Sign in
              </button>
            </NavLink>
          )}
        </div>
        <div className="lg:hidden ml-20">{user && <Notification />}</div>
        {user && (
          <div
            className="dropdown tooltip dropdown-hover tooltip-left  cursor-pointer"
            data-tip={user?.userName}
          >
            <div
              tabIndex={0}
              role="button"
              className="h-10 w-10 xl:mr-36 2xl:mr-0  cursor-pointer border rounded-full border-white/20"
            >
              <img
                src={user?.photoUrl}
                alt=""
                className="h-full w-full rounded-full "
              />
            </div>
            <ul
              tabIndex="-1"
              className="border bg-[#262030]  border-white/20 dropdown-content xl:bg-white/10 backdrop-blur-lg menu  rounded-box z-1 xl:w-40 2xl:w-52 p-2 shadow-sm -translate-x-20 xl:translate-x-0 z-20"
            >
              {/* glow */}

              <li>
                <NavLink to="/profile">Profile</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard">Dashboard</NavLink>
              </li>
              <li>
                <h1 onClick={handleLogout}>logout</h1>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
