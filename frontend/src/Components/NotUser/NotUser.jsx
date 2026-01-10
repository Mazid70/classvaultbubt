import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotUser = ({ status }) => {
  const message =
    status === 'Pending' || status === 'Blocked'
      ? 'You have registered successfully. Please wait for the CR/Admin to approve your account before accessing this page.'
      : 'Your account has not been verified yet. Please complete the verification process to access this page.';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] relative overflow-hidden px-4">
      {/* Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full" />

      {/* Glass Card */}
      <div
        className="relative w-full max-w-md p-[1px] rounded-3xl bg-gradient-to-tr from-indigo-500/30 via-transparent to-purple-500/30 shadow-lg"
        data-aos="zoom-in"
        data-aos-duration="600"
      >
        <div className="relative bg-[#232323]/60 backdrop-blur-xl rounded-3xl p-8 md:p-10 text-center border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
          {/* Inner Glow Border */}
          <div className="absolute inset-0 rounded-3xl border border-white/5 pointer-events-none" />

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-tr from-red-500 to-yellow-400 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg">
              <FaExclamationTriangle className="text-white text-2xl md:text-3xl" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
            Access Restricted
          </h1>

          {/* Subtitle */}
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            {message}
          </p>

          {/* Contact Info */}
          <p className="text-gray-400 mt-4 text-xs md:text-sm">
            If you have any questions, contact us at:{' '}
            <span className="text-indigo-400 font-medium">
              support@classvault.com
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotUser;
