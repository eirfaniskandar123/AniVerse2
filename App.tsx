
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import DetailPage from './pages/DetailPage';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-eerie-black font-sans">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/anime/:id" element={<DetailPage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
