import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
const StoryFilter = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState('Story');
  const [expandedStory, setExpandedStory] = useState(null);

  const fetchStories = async (type) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/story-filter', { type });
      const formattedStories = (response.data.stories || []).map(story => ({
        ...story,
        id: story.id || Math.random().toString(),
        text: story.text || '',
        type: story.type || 'Story',
        genres: Array.isArray(story.genres) ? story.genres : [],
        images: Array.isArray(story.images) ? story.images : [],
      }));
      setStories(formattedStories);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch stories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories(selectedType);
  }, [selectedType]);

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setExpandedStory(null);
  };

  const toggleExpand = (id) => {
    setExpandedStory(expandedStory === id ? null : id);
  };

  const renderGenres = (genres) => {
    if (!Array.isArray(genres)) return null;
    
    return genres.map((genre) => (
      <span
        key={genre.id}
        className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium tracking-wide border border-amber-200 hover:bg-amber-100 transition-colors"
      >
        {genre.name}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Navbar></Navbar>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Literary Collection
          </h1>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore our curated collection of {selectedType.toLowerCase()}s written by talented authors from around the world.
          </p>
          
          {/* Type Filter Buttons */}
          <div className="flex justify-center gap-6 mb-12">
            {['Story', 'Poem'].map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`px-8 py-3 rounded-lg font-serif text-lg transition-all transform
                  ${selectedType === type 
                    ? 'bg-amber-800 text-white shadow-lg scale-105 hover:bg-amber-900' 
                    : 'bg-white text-amber-900 border-2 border-amber-800 hover:bg-amber-50'}`}
              >
                {type}s
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="w-16 h-16 border-4 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Stories Grid */}
        <div className="grid gap-8">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-amber-100"
            >
              <div 
                className="cursor-pointer group"
                onClick={() => toggleExpand(story.id)}
              >
                {/* Story Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-amber-50 to-white border-b border-amber-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-3 group-hover:text-amber-800 transition-colors">
                        {`${story.type} #${story.id}`}
                      </h3>
                      <div className="flex gap-2 flex-wrap">
                        {renderGenres(story.genres)}
                      </div>
                    </div>
                    <svg 
                      className={`w-6 h-6 text-amber-600 transform transition-transform duration-300 ${
                        expandedStory === story.id ? 'rotate-180' : ''
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Story Content */}
                <div className={`transition-all duration-500 ease-in-out
                  ${expandedStory === story.id ? 'max-h-screen opacity-100' : 'max-h-32 opacity-80'}`}
                >
                  <div className="p-6">
                    <p className="text-gray-700 whitespace-pre-wrap font-serif leading-relaxed">
                      {story.text}
                    </p>
                  </div>
                </div>
              </div>

              {/* Images Section */}
              {story.images && story.images.length > 0 && (
                <div className="px-6 pb-6">
                  <div className="flex gap-4 overflow-x-auto py-4 scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-amber-50">
                    {story.images.map((image) => (
                      <img
                        key={image.id}
                        src={image.url}
                        alt={`Story image ${image.id}`}
                        className="h-40 w-auto object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-white border-t border-amber-100">
                <div className="flex justify-between items-center text-sm text-amber-800">
                  <span className="font-medium">ID: {story.id}</span>
                  {story.user_id && <span className="font-medium">User ID: {story.user_id}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && !error && stories.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-white rounded-lg shadow-md">
              <p className="text-lg text-gray-600">
                No {selectedType.toLowerCase()}s found. Try a different type or check back later.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryFilter;