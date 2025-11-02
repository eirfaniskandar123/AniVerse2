
import React from 'react';
import { Link } from 'react-router-dom';
import { Anime } from '../types/jikan';
import { BannerSkeleton } from './SkeletonLoader';

interface BannerProps {
    anime: Anime | null;
    loading: boolean;
}

const Banner: React.FC<BannerProps> = ({ anime, loading }) => {
    if (loading) {
        return <BannerSkeleton />;
    }
    
    if (!anime) {
        return null;
    }

    return (
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden my-8 shadow-2xl">
            <img 
                src={anime.images.jpg.large_image_url} 
                alt={anime.title}
                className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white">
                <h2 className="text-2xl md:text-4xl font-bold mb-2">{anime.title_english || anime.title}</h2>
                <p className="text-sm md:text-base max-w-lg hidden md:block">{anime.synopsis.substring(0, 150)}...</p>
                <Link to={`/anime/${anime.mal_id}`} className="mt-4 inline-block bg-pantone-red text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 transition-colors">
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default Banner;
