import { useState } from 'react';
import './App.css'
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/About';
import BenefitsSection from './components/Benefits';
import FAQSection from './components/FAQ';
import Footer from './components/Footer';
import Background from './components/Background';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleRegisterClick = () => {
    // Handle registration logic here
    console.log("Registration button clicked!");
    // Could open a modal, redirect to a form, etc.
  };

  return (
    <>
      {isLoading && (
        <LoadingScreen
          minimumDurationMs={3000}
          onComplete={handleLoadingComplete}
        />
      )}
      
      {!isLoading && (
        <>
          <Header />
          <Background />
          <main>
            <Hero onRegisterClick={handleRegisterClick} />
            <AboutSection />
            <BenefitsSection />
            <FAQSection />
          </main>
          <Footer />
        </>
      )}
    </>
  )
}

export default App
