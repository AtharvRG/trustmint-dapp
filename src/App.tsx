// src/App.tsx
import { BrowserRouter as Router } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Context';
import { UserProvider } from './contexts/UserContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AppRouter from './components/common/AppRouter';
import { AnimatePresence } from 'framer-motion';

function App() {
  return (
    <Web3Provider>
      <UserProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-dark-primary font-sans">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 pt-28"> {/* Added padding-top to account for sticky header */}
              {/* ARCHITECT'S TOUCH: AnimatePresence enables fluid page transitions */}
              <AnimatePresence mode="wait">
                <AppRouter />
              </AnimatePresence>
            </main>
            <Footer />
          </div>
        </Router>
      </UserProvider>
    </Web3Provider>
  );
}

export default App;