import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/store';
import { fetchAnimeSearch, fetchTopAnime, clearSearchResults, fetchNewestAnime, clearAllAnime } from '../store/slices/animeSlice';
import AnimeCard from '../components/AnimeCard';
import Pagination from '../components/Pagination';
import { CardGridSkeleton } from '../components/SkeletonLoader';
import Banner from '../components/Banner';
import LatestAnimeCarousel from '../components/LatestAnimeCarousel';

const SearchPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    searchResults, pagination, status, error, 
    latestAnime, bannerAnime, latestStatus,
    allAnime, allAnimePagination, allAnimeStatus 
  } = useSelector((state: RootState) => state.anime);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    dispatch(fetchTopAnime());
  }, [dispatch]);

  useEffect(() => {
    const abortController = new AbortController();
    
    if (query) {
      const trimmedQuery = query.trim();
      dispatch(clearAllAnime());
      if (trimmedQuery.length === 1) {
        dispatch(fetchAnimeSearch({ letter: trimmedQuery, page, signal: abortController.signal }));
      } else if (trimmedQuery.length >= 3) {
        dispatch(fetchAnimeSearch({ query: trimmedQuery, page, signal: abortController.signal }));
      } else {
        // For 2-char query, we should not fetch but clear results
        dispatch(clearSearchResults());
      }
    } else {
      dispatch(clearSearchResults());
      dispatch(fetchNewestAnime({ page, signal: abortController.signal }));
    }

    return () => {
      abortController.abort();
    };
  }, [query, page, dispatch]);

  const handlePageChange = (newPage: number) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...currentParams, page: newPage.toString() });
    window.scrollTo(0, 0);
  };

  const renderSearchResults = () => {
    if (query.trim().length === 2) {
      return <div className="text-center text-gray-400 mt-8">Please enter at least 3 characters for a search query.</div>;
    }
    if (status === 'loading') return <CardGridSkeleton />;
    if (status === 'failed') return <div className="text-center text-red-400 mt-8">Error: {error}</div>;
    if (searchResults.length === 0 && status === 'succeeded') {
      return <div className="text-center text-gray-400 mt-8">No anime found for "{query}". Try another search.</div>;
    }
    return (
      <section>
        <h2 className="text-2xl font-bold mb-4 text-white border-l-4 border-pantone-red pl-3">
          Search Results for "{query}"
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {searchResults.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
        {pagination && pagination.last_visible_page > 1 && (
          <Pagination
            currentPage={pagination.current_page}
            lastPage={pagination.last_visible_page}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    );
  };

  const renderHomepageContent = () => {
    if (allAnimeStatus === 'loading') return <CardGridSkeleton />;
    if (allAnimeStatus === 'failed') return <div className="text-center text-red-400 mt-8">Error: {error}</div>;
    if (allAnime.length > 0) {
      return (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-white border-l-4 border-pantone-red pl-3">
            Newest Releases
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allAnime.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
          {allAnimePagination && allAnimePagination.last_visible_page > 1 && (
            <Pagination
              currentPage={allAnimePagination.current_page}
              lastPage={allAnimePagination.last_visible_page}
              onPageChange={handlePageChange}
            />
          )}
        </section>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-8">
      {!query && (
        <>
          <Banner anime={bannerAnime} loading={latestStatus === 'loading'} />
          <LatestAnimeCarousel animeList={latestAnime} loading={latestStatus === 'loading'} />
        </>
      )}
      {query ? renderSearchResults() : renderHomepageContent()}
    </div>
  );
};

export default SearchPage;