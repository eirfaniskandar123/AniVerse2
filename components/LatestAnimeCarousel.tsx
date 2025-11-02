
import React from 'react';
import { Anime } from '../types/jikan';
import AnimeCard from './AnimeCard';
import { CarouselSkeleton } from './SkeletonLoader';

interface LatestAnimeCarouselProps {
    animeList: Anime[];
    loading: boolean;
}

const LatestAnimeCarousel: React.FC<LatestAnimeCarouselProps> = ({ animeList, loading }) => {
    return (
        <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white border-l-4 border-pantone-red pl-3">
                Top Airing
            </h2>
             {loading ? (
                <CarouselSkeleton />
            ) : (
                <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
                {animeList.map(anime => (
                    <AnimeCard key={anime.mal_id} anime={anime} variant="carousel"/>
                ))}
                </div>
            )}
        </section>
    );
};

export default LatestAnimeCarousel;
