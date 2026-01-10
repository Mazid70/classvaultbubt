import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaEnvelope,
} from 'react-icons/fa';
import { HiOutlineAcademicCap, HiOutlineCode } from 'react-icons/hi';
import AOS from 'aos';
import { useEffect } from 'react';

const Footer = () => {
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  return (
    <footer className="relative mt-32 border-t border-white/10 bg-black/70 backdrop-blur-xl">
      {/* Glow */}
      <div className="absolute left-1/2 top-0 h-[150px] w-[300px] -translate-x-1/2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-20 blur-[120px]" />

      <div className="container mx-auto px-6 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div data-aos="fade-up">
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineAcademicCap className="text-3xl text-indigo-400" />
              <h2 className="text-2xl font-bold text-white">Class Vault</h2>
            </div>
            <p className="text-white/70 leading-relaxed">
              A secure academic vault built for BUBT CSE intake 54 section 01 students to share
              notes, and essential learning resources ,Genarate cove page etc .
            </p>
          </div>

          {/* Quick Links */}
          <div data-aos="fade-up" data-aos-delay="100">
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-white/70">
              <li className="hover:text-white transition cursor-pointer">
                Home
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Notes
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Announcements
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Dashboard
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div data-aos="fade-up" data-aos-delay="200">
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <p className="text-white/70 mb-4">
              Suggestions or issues? Reach out anytime.
            </p>

            <div className="flex gap-4">
              <a className="footer-icon" href="#">
                <FaFacebookF />
              </a>
              <a className="footer-icon" href="#">
                <FaGithub />
              </a>
              <a className="footer-icon" href="#">
                <FaLinkedinIn />
              </a>
              <a className="footer-icon" href="#">
                <FaEnvelope />
              </a>
            </div>
          </div>

          {/* Developer Info */}
          <div data-aos="fade-up" data-aos-delay="300">
            <h3 className="text-lg font-semibold text-white mb-4">Developer</h3>

            <div className="flex items-start gap-3">
              <HiOutlineCode className="text-2xl text-indigo-400 mt-1" />
              <div>
                <p className="text-white font-semibold">Mazidur Rahman</p>
                <p className="text-white/70 text-sm">Mern Stack Developer</p>
                <p className="text-white/60 text-sm">B.Sc in CSE · BUBT (running)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 border-t border-white/10 text-center text-white/60 text-sm">
          © {new Date().getFullYear()} Class Vault · Designed & Developed by
          <span className="text-white font-medium"> Mazidur Rahman</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
