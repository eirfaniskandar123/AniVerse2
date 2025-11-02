import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchAnimeById, fetchAnimeRelations } from '../store/slices/animeDetailSlice';
import { DetailPageSkeleton } from '../components/SkeletonLoader';

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { anime, status, error, relations, relationsStatus } = useSelector((state: RootState) => state.animeDetail);

  useEffect(() => {
    if (id) {
      dispatch(fetchAnimeById(Number(id)));
      dispatch(fetchAnimeRelations(Number(id)));
    }
    window.scrollTo(0, 0);
  }, [id, dispatch]);

  if (status === 'loading') {
    return <DetailPageSkeleton />;
  }

  if (status === 'failed') {
    return <div className="text-center text-red-400 mt-8">Error: {error}</div>;
  }

  if (!anime) {
    return <div className="text-center text-gray-400 mt-8">Anime not found.</div>;
  }
  
  const renderDetailItem = (label: string, value: string | number | null | undefined) => {
    if (!value) return null;
    return <p><span className="font-semibold text-gray-400">{label}:</span> {value}</p>
  }

  const renderRelations = () => {
    if (relationsStatus === 'succeeded' && relations.length > 0) {
      return (
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-4 border-l-4 border-pantone-red pl-3">Related Anime</h3>
          <div className="space-y-4">
            {relations.map(relation => (
              <div key={relation.relation}>
                <h4 className="text-lg font-semibold text-gray-300">{relation.relation}</h4>
                <ul className="list-disc list-inside pl-4">
                  {relation.entry.map(entry => (
                    <li key={entry.mal_id} className="text-pantone-red">
                      <Link to={`/anime/${entry.mal_id}`} className="text-white hover:underline">
                        {entry.name} ({entry.type})
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="py-8">
      <Link to="/" className="inline-flex items-center mb-6 text-pantone-red hover:text-red-300 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Back to Search
      </Link>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full rounded-lg shadow-lg" />
        </div>
        <div className="w-full md:w-2/3 lg:w-3/4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{anime.title}</h1>
          <h2 className="text-xl text-gray-400 mb-4">{anime.title_english}</h2>
          
           <div className="flex items-center space-x-4 mb-4 text-yellow-400">
                <div className="flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <span className="font-bold text-lg">{anime.score}</span>
                    <span className="text-sm text-gray-400 ml-1">({anime.scored_by?.toLocaleString()} users)</span>
                </div>
                 <span className="text-gray-400">|</span>
                <span className="font-semibold">Rank: #{anime.rank}</span>
            </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {anime.genres.map(g => <span key={g.mal_id} className="bg-gray-700 text-xs font-semibold px-3 py-1 rounded-full">{g.name}</span>)}
          </div>
          
          <p className="text-gray-300 leading-relaxed mb-6">{anime.synopsis}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-gray-300">
            {renderDetailItem('Type', anime.type)}
            {renderDetailItem('Episodes', anime.episodes)}
            {renderDetailItem('Status', anime.status)}
            {renderDetailItem('Aired', anime.aired.string)}
            {renderDetailItem('Season', `${anime.season} ${anime.year}`)}
            {renderDetailItem('Rating', anime.rating)}
          </div>

        </div>
      </div>
       {anime.trailer?.embed_url && (
            <div className="mt-10">
                <h3 className="text-2xl font-bold mb-4">Trailer</h3>
                <div className="aspect-w-16 aspect-h-9">
                    <iframe 
                        src={anime.trailer.embed_url} 
                        title={`${anime.title} Trailer`}
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className="w-full h-full rounded-lg shadow-lg"
                        style={{ height: '500px'}}
                    ></iframe>
                </div>
            </div>
        )}
        {renderRelations()}
    </div>
  );
};

export default DetailPage;
