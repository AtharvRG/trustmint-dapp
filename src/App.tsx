// src/App.tsx
import { BrowserRouter as Router } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Context';
import { UserProvider } from './contexts/UserContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AppRouter from './components/common/AppRouter'; // <-- Import our new router

function App() {
  return (
    <Web3Provider>
      <UserProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-dark-primary font-sans">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              <AppRouter /> {/* <-- The only thing inside main */}
            </main>
            <Footer />
          </div>
        </Router>
      </UserProvider>
    </Web3Provider>
  );
}

export default App;