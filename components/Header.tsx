
import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-eerie-black/80 backdrop-blur-sm shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="text-2xl md:text-3xl font-bold tracking-tight text-white hover:text-pantone-red transition-colors">
            AniVerse
          </Link>
          <div className="w-full max-w-xs md:max-w-md lg:max-w-lg">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
