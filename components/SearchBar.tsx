import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';
import { fetchAnimeSearch, clearPreviewResults } from '../store/slices/animeSlice';
import { useDebounce } from '../hooks/useDebounce';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 250);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { previewResults, previewStatus } = useSelector((state: RootState) => state.anime);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const abortController = new AbortController();
    const trimmedQuery = debouncedQuery.trim();

    if (trimmedQuery.length === 1) {
      dispatch(fetchAnimeSearch({ letter: trimmedQuery, page: 1, limit: 5, signal: abortController.signal }));
    } else if (trimmedQuery.length >= 3) {
      dispatch(fetchAnimeSearch({ query: trimmedQuery, page: 1, limit: 5, signal: abortController.signal }));
    } else {
      dispatch(clearPreviewResults());
    }

    return () => {
      abortController.abort();
    };
  }, [debouncedQuery, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        dispatch(clearPreviewResults());
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery.length > 0 && trimmedQuery.length !== 2) {
      navigate(`/?q=${encodeURIComponent(trimmedQuery)}`);
      setQuery('');
      dispatch(clearPreviewResults());
    }
  };
  
  const handleResultClick = () => {
    setQuery('');
    dispatch(clearPreviewResults());
  };

  return (
    <div className="relative" ref={searchContainerRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Anime..."
          className="w-full pl-4 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors"
        />
        <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3">
           <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </button>
      </form>

      {debouncedQuery.trim().length > 0 && debouncedQuery.trim().length !== 2 && (
        <div className="absolute mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
          {previewStatus === 'loading' && <div className="p-4 text-center text-gray-400">Loading...</div>}
          {previewStatus === 'succeeded' && previewResults.length === 0 && <div className="p-4 text-center text-gray-400">No results found.</div>}
          {previewStatus === 'succeeded' && previewResults.length > 0 && (
            <ul>
              {previewResults.map((anime) => (
                <li key={anime.mal_id} className="border-b border-gray-700 last:border-b-0">
                  <Link to={`/anime/${anime.mal_id}`} onClick={handleResultClick} className="flex items-center p-3 hover:bg-gray-700 transition-colors">
                    <img src={anime.images.jpg.small_image_url} alt={anime.title} className="w-10 h-14 object-cover rounded mr-3" />
                    <span className="flex-1 text-sm text-white">{anime.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;