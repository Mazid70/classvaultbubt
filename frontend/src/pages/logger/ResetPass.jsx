import React, { useState } from 'react';
import useCallData from '../../customHooks/useCallData';
import { FaLock } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { toast } from 'sonner';

const ResetPass = () => {
  const [isShow, setShow] = useState(false);
  const handlePass = () => setShow(!isShow);

  const axiosData = useCallData();
  const navigate = useNavigate();
  const { id, token } = useParams();

  const handleUpdate = async e => {
    e.preventDefault();
    const password = e.target.password.value;
    const toastId = toast.loading('Updating password...');

    try {
      const res = await axiosData.post(`users/reset-password/${id}/${token}`, {
        password,
      });

      if (res.data.success) {
        toast.success('Password updated successfully!', { id: toastId });
        navigate('/signin');
      } else {
        toast.error(res.data.message || 'Password update failed', {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Something went wrong', {
        id: toastId,
      });
    }
  };

  return (
    <main className="h-screen fixed inset-0 z-50 bg-[#1a1a1a] flex justify-center items-center">
      <div className="absolute left-1/2 top-1/2 h-[800px] w-[20px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-purple-500 to-pink-400 blur-[80px] rotate-6"></div>
      <div className="absolute left-1/2 top-1/2 h-[900px] w-[20px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-pink-400 to-purple-500  blur-[80px] rotate-90"></div>

      <form
        onSubmit={handleUpdate}
        className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-3 xl:p-8 w-[400px] max-w-[90%]"
      >
        <h1 className="font-bold text-xl">Reset Password</h1>

        <div className="w-full mt-4 relative">
          <FaLock className="absolute top-5 left-3 text-white/70" />
          <input
            required
            name="password"
            type={isShow ? 'text' : 'password'}
            minLength={6}
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
            title="Password must be at least 6 characters and include 1 uppercase, 1 lowercase, and 1 number"
            className="bg-white/5 mt-2 text-white pl-10 pr-10 py-2 rounded border border-white/20 focus:border-indigo-400 outline-none w-full"
            placeholder="Enter Your New Password"
          />
          {isShow ? (
            <BsFillEyeSlashFill
              onClick={handlePass}
              className="cursor-pointer absolute right-3 top-5 text-white/70 text-xl"
            />
          ) : (
            <BsFillEyeFill
              onClick={handlePass}
              className="cursor-pointer absolute right-3 top-5 text-white/70 text-xl"
            />
          )}
        </div>

        <input
          type="submit"
          value="Update Password"
          className="mt-6 font-medium cursor-pointer transition-all hover:scale-105 rounded bg-gradient-to-r from-pink-400 via-indigo-500 to-blue-500 py-2 w-full"
        />
      </form>
    </main>
  );
};

export default ResetPass;
