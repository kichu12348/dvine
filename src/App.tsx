import { useState } from 'react';
import './App.css'
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/About';

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
          <main>
            <Hero onRegisterClick={handleRegisterClick} />
            <AboutSection />
            {/* Additional sections can be added here */}
          </main>
        </>
      )}
    </>
  )
}

export default App
