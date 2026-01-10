import React from 'react';
import Hero from './components/Hero';
import Services from './components/Services';
import Footer from '../../Components/Footer/Footer';

const Home = () => {
  return (
    <main className="  overflow-hidden">
      <div className="xl:p-10">
        <Hero />
        <Services />
      </div>

      <Footer />
    </main>
  );
};

export default Home;
