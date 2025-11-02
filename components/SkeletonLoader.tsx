
import React from 'react';

const CardSkeleton: React.FC<{ variant?: 'default' | 'carousel'}> = ({ variant = 'default' }) => {
    const cardClasses = variant === 'carousel' ? "w-48 flex-shrink-0" : "w-full";
    return (
        <div className={`${cardClasses} animate-pulse`}>
            <div className="bg-gray-700 rounded-lg aspect-[2/3]"></div>
        </div>
    );
};

export const CardGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {Array.from({ length: 12 }).map((_, index) => (
      <CardSkeleton key={index} />
    ))}
  </div>
);

export const CarouselSkeleton: React.FC = () => (
    <div className="flex space-x-4 overflow-hidden">
         {Array.from({ length: 5 }).map((_, index) => (
            <CardSkeleton key={index} variant="carousel" />
         ))}
    </div>
);


export const BannerSkeleton: React.FC = () => (
    <div className="animate-pulse w-full h-64 md:h-96 bg-gray-700 rounded-lg"></div>
);

export const DetailPageSkeleton: React.FC = () => (
    <div className="animate-pulse flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-gray-700 aspect-[2/3] rounded-lg"></div>
        </div>
        <div className="w-full md:w-2/3 lg:w-3/4 space-y-6">
            <div className="h-10 bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
             <div className="h-6 bg-gray-700 rounded w-1/2"></div>
        </div>
    </div>
);
