import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            SkillGapGuide
          </Link>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link to="/courses" className="text-gray-600 hover:text-gray-900">Courses</Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Link to="/" className="block text-gray-600 hover:text-gray-900">Home</Link>
            <Link to="/courses" className="block text-gray-600 hover:text-gray-900">Courses</Link>
            <Link to="/about" className="block text-gray-600 hover:text-gray-900">About</Link>
            <Link to="/login" className="block text-gray-600 hover:text-gray-900">Login</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
