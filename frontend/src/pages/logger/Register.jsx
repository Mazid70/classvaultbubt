import { useContext, useEffect, useState } from 'react';
import { BiSolidUserAccount } from 'react-icons/bi';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { toast } from 'sonner';
import useCallData from '../../customHooks/useCallData';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../../Provider/AuthProvider';
import bg from '../../assets/bg.jpg';

// CSS
const labelCss = `relative w-[250px] rounded-md p-[1.5px] bg-gray-700 transition-all duration-300 focus-within:bg-gradient-to-r focus-within:from-pink-400 focus-within:to-blue-500 focus-within:shadow-[0_0_18px_rgba(236,72,153,0.5)]`;

const inputCss = `absolute left-3 top-4 text-white/70 transition-all duration-300 pointer-events-none peer-focus:top-1 peer-focus:text-xs peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:text-xs peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm`;

const Register = () => {
  const [isShow, setShow] = useState(false);
  const handlePass = () => setShow(!isShow);
  const navigate = useNavigate();

  const { user, refetch } = useContext(AuthContext);
  const axiosData = useCallData();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleRegister = async e => {
    e.preventDefault();
    const form = e.target;

    const userName = form.name.value;
    const studentId = form.id.value;
    const email = form.email.value;
    const password = form.password.value;

    const userData = { userName, studentId, email, password };

    const toastId = toast.loading('Creating account...');

    try {
      await axiosData.post('/users/register', userData);

      toast.success('Account created successfully!', { id: toastId });

      // Optional: auto-login after registration
      await axiosData.post('/users/signin', { studentId, password });
      if (refetch) await refetch(); // Update AuthContext

      navigate('/');
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Registration failed', {
        id: toastId,
      });
    }
  };

  return (
    <main className="h-screen flex bg-[#0C1019] overflow-hidden">
      {/* LEFT SIDE */}
      <div className="p-5 xl:p-0 flex-1 flex justify-center items-center container mx-auto">
        <div
          className="max-w-lg w-full"
          data-aos="zoom-in"
          data-aos-duration="600"
        >
          <h1 className="font-bold text-sm text-white/60">START FOR FREE</h1>
          <h2 className="font-extrabold text-4xl text-white mt-2">
            Create new Account.
          </h2>

          <p className="mt-2 text-white/60">
            Already a member?{' '}
            <Link to="/signin" className="text-blue-400 hover:underline">
              Log in
            </Link>
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleRegister}>
            {/* Name + ID */}
            <div className="flex flex-col xl:flex-row gap-5">
              {/* Name */}
              <div className={`w-full xl:w-[250px] ${labelCss}`}>
                <input
                  required
                  type="text"
                  name="name"
                  placeholder=""
                  className="peer w-full h-13 rounded-md bg-gray-700 pl-3 pt-5 text-white outline-none pb-2"
                />
                <label className={inputCss}>Your Name</label>
                <FaUser className="absolute right-3 top-4 text-white/70 text-xl" />
              </div>

              {/* ID */}
              <div className={`w-full xl:w-[250px] ${labelCss}`}>
                <input
                  required
                  type="text"
                  name="id"
                  placeholder=""
                  min={11}
                  className="peer w-full h-13 rounded-md bg-gray-700 pl-3 pt-5 text-white outline-none pb-2"
                />
                <label className={inputCss}>Your ID</label>
                <BiSolidUserAccount className="absolute right-3 top-4 text-white/70 text-xl" />
              </div>
            </div>

            {/* Email */}
            <div className={`w-full ${labelCss}`}>
              <input
                required
                type="email"
                name="email"
                placeholder=""
                className="peer w-full h-13 rounded-md bg-gray-700 pl-3 pt-5 text-white outline-none pb-2"
              />
              <label className={inputCss}>Your Email</label>
              <MdEmail className="absolute right-3 top-4 text-white/70 text-xl" />
            </div>

            {/* Password */}
            <div className={`w-full ${labelCss}`}>
              <input
                required
                type={isShow ? 'text' : 'password'}
                name="password"
                minLength={6}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                title="Password must be at least 6 characters and include 1 uppercase, 1 lowercase, and 1 number"
                placeholder=""
                className="peer w-full h-13 rounded-md bg-gray-700 pl-3 pt-5 text-white outline-none pb-2"
              />
              <label className={inputCss}>Password</label>
              {isShow ? (
                <BsFillEyeSlashFill
                  onClick={handlePass}
                  className="cursor-pointer absolute right-3 top-4 text-white/70 text-xl"
                />
              ) : (
                <BsFillEyeFill
                  onClick={handlePass}
                  className="cursor-pointer absolute right-3 top-4 text-white/70 text-xl"
                />
              )}
            </div>

            {/* Submit Button */}
            <input
              type="submit"
              value="Create Account"
              className="w-full mt-4 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 cursor-pointer hover:opacity-90 transition-all"
            />
          </form>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div
        className="hidden xl:block flex-1 relative bg-cover"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="absolute inset-0 bg-gray-900/60" />
      </div>
    </main>
  );
};

export default Register;
