import '../../../App.css';
import BTN from './BTN'
import CountUp from 'react-countup';
import hero from '../../../assets/hero.png'
import { Link } from 'react-router';
const Hero = () => {
  return (
    <main className="min-h-screen relative p-5 xl:p-0">
      <div className=" bg-pink-400 h-[200px] w-[200px] rounded-full blur-[150px] absolute left-0 top-[30%] -translate-x-1/2"></div>
      <div className=" bg-purple-500 h-[200px] w-[200px] rounded-full blur-[150px] absolute right-0 top-[10%] translate-x-1/2"></div>

      <section className="container mx-auto mt-20   flex justify-center flex-col items-center">
        {/* for text  */}
        <div className="text-center" data-aos="zoom-in" data-aos-duration="500">
          {' '}
          <div className="flex gap-3 alegreya items-center">
            <h1 className="font-bold text-[42px] xl:text-8xl bg-gradient-to-r from-white  to-gray-600  text-transparent bg-clip-text">
              {' '}
              Students
            </h1>
            <h1 className="font-bold text-[42px] xl:text-8xl bg-gradient-to-r from-gray-600  to-white  text-transparent bg-clip-text">
              {' '}
              CSE 54(1)
            </h1>
          </div>
          <h2 className="font-bold text-[42px]  xl:text-8xl mt-4 alegreya ">
            {' '}
            Of{' '}
            <span className="bg-gradient-to-r bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 text-transparent bg-clip-text ">
              BUBT.
            </span>{' '}
          </h2>
        </div>

        {/* for pic  */}

        {/* card */}
        <div className="flex  flex-col xl:flex-row justify-evenly  w-full ">
          <div className="2xl:flex-1  ">
            <div
              className="rounded-l mt-10 h-[150px] w-[200px] flex flex-col justify-center items-center  rounded-3xl  backdrop-blur-[2px] border-l-0 border border-white/20 bg-gradient-to-l from-white/5 via-white/5 to-transparent"
              data-aos="fade-right"
              data-aos-duration="600"
              data-aos-delay="200"
            >
              <h1 className="font-semibold text-3xl xl:text-5xl">
                <CountUp
                  start={0}
                  end={35}
                  delay={1}
                  scrollSpyOnce
                  enableScrollSpy
                >
                  {({ countUpRef }) => (
                    <div>
                      <span ref={countUpRef} />+
                    </div>
                  )}
                </CountUp>
              </h1>

              <h1 className="text-white/70 font-semibold mt-2">STUDENTS</h1>
            </div>
            <div
              className=" ml-10  mt-10 h-[150px] w-[220px] flex rounded-r flex-col justify-center items-center  rounded-2xl  border-r-0 border border-white/20 backdrop-blur-[2px] border-l-0 border border-white/20 bg-gradient-to-r from-white/5 via-white/5 to-transparent"
              data-aos="fade-left"
              data-aos-duration="500"
              data-aos-delay="400"
            >
              <h1 className="font-semibold text-3xl xl:text-5xl">
                <CountUp
                  start={0}
                  end={6}
                  delay={2}
                  scrollSpyOnce
                  enableScrollSpy
                >
                  {({ countUpRef }) => (
                    <div>
                      <span ref={countUpRef} />+
                    </div>
                  )}
                </CountUp>
              </h1>

              <h1 className="text-white/70 font-semibold mt-2">COURSES</h1>
            </div>
          </div>

          <div
            className="2xl:absolute "
            data-aos="zoom-in"
            data-aos-duration="500"
            data-aos-delay="600"
          >
            <img
              src={hero}
              alt=""
              className="h-[250px] xl:h-[400px] 2xl:h-[500px]  w-full  "
            />
          </div>
          <div>
            <ul
              className="text-white/70 text-lg space-y-2 mb-5  xl:mt-0"
              data-aos="fade-left"
              data-aos-duration="500"
              data-aos-delay="800"
            >
              <li>Section-Only Secure Access</li>
              <li>Notes & Study Material Sharing</li>
              <li>Beautiful Leaderboard</li>
              <li>Modern Animated Dark UI</li>
            </ul>
            <Link to="/register">
              <BTN />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Hero;
