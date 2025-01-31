import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const StoryPoemList = () => {
  const [stories, setStories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get("/storypoem");
        setStories(response.data.stories);
      } catch (err) {
        console.error("Error fetching stories:", err);
        setError(err.response?.data?.error || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-900 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-amber-900 font-serif text-lg">Casting Spells...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
        <div className="bg-red-100 border-2 border-red-800 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-serif text-xl mb-2">Magical Mishap!</h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (<>
  <Navbar></Navbar>
    <div className="min-h-screen bg-amber-50 py-12 px-4 sm:px-6 lg:px-8">
     

      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-900 mb-4 tracking-wide">
          The Magical Collection
        </h1>
        <p className="text-amber-800 text-lg font-serif italic">
          A treasury of enchanted tales and poetic spells
        </p>
      </div>

      {stories.length === 0 ? (
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber-800 font-serif text-xl">
            The magical archives appear to be empty. Perhaps it's time to create some enchanting tales?
          </p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid gap-8 md:gap-12">
          {stories.map((story) => (
            <div 
              key={story.id}
              className="bg-gradient-to-b from-amber-100 to-amber-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-amber-200"
            >
              {/* Story Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-amber-800/10 to-transparent border-b border-amber-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h3 className="text-2xl font-serif font-bold text-amber-900">
                    {story.type}
                  </h3>
                  {story.genres && story.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {story.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-3 py-1 bg-amber-800/10 text-amber-900 rounded-full text-sm font-medium font-serif"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Story Content */}
              <div className="p-6">
                <p className="text-amber-900 font-serif leading-relaxed whitespace-pre-wrap">
                  {story.text}
                </p>
              </div>

              {/* Images Section */}
              {story.images && story.images.length > 0 && (
                <div className="px-6 pb-6">
                  <h4 className="font-serif text-amber-900 mb-4 text-lg">Magical Illustrations</h4>
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-amber-600 scrollbar-track-amber-200">
                    {story.images.map((image, index) => (
                      <div key={index} className="flex-none">
                        <img
                          src={image.url}
                          alt={`Story ${story.id} Image ${index + 1}`}
                          className="w-48 h-48 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border-2 border-amber-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer Decoration */}
      <div className="max-w-2xl mx-auto mt-16 text-center">
        <div className="h-px bg-gradient-to-r from-transparent via-amber-800/30 to-transparent"></div>
        <p className="text-amber-800/60 font-serif italic mt-4">
          ~ Mischief Managed ~
        </p>
      </div>
    </div></>
  );
};

export default StoryPoemList;