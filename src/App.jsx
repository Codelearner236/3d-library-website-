import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Books from './pages/Books';
import Events from './pages/Events';
import Exams from './pages/Exams';
import About from './pages/About';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Footer';
import { ThemeProvider } from './components/ThemeProvider';
import { FluidBackground } from './components/FluidBackground';
import { Preloader } from './components/Preloader';

const BackgroundManager = () => {
  const location = useLocation();
  // Don't render fluid background on Home page since it has its own 3D scene
  if (location.pathname === '/') return null;
  return <FluidBackground />;
};

function App() {
  return (
    <ThemeProvider>
      <Preloader>
        <Router>
          <BackgroundManager />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Books />} />
            <Route path="/events" element={<Events />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <Footer />
        </Router>
      </Preloader>
    </ThemeProvider>
  );
}

export default App;
