import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import io from 'socket.io-client';
import axios from 'axios';
const socket = io('http://localhost:8000');

const ChatComponent = () => {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('');
  const [image, setImage] = useState('');
  const [isTextLoading, setIsTextLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [error, setError] = useState('');
  const [type, setType] = useState('');
  const [genres, setGenres] = useState([]);
  const [userPrompt, setUserPrompt] = useState('');

  
  const handleGenreUpdate = (e) => {
    e.preventDefault();
    const selectedGenre = e.target.value;
    
    setGenres(prevGenres => {
      if (!prevGenres.includes(selectedGenre)) {
        return [...prevGenres, selectedGenre];
      }
      return prevGenres;
    });
  };

  
  const extractGeneratedContent = (responseText) => {
      const startMarker = "------ Generated content below ------";
      
      
      let startIndex = responseText.indexOf(startMarker);
      
      // If the marker is found, extract everything after it
      if (startIndex !== -1) {
          return responseText.slice(startIndex + startMarker.length).trim();
      }
  
      return "Generated content not found.";
  };
  // Fixed type selection handlers
  const handleTypeSelect = (selectedType) => {
    setType(selectedType);
  };

  useEffect(() => {
    
      const VALID_TYPES = ['story', 'poem'];

      // Format genres with proper grammar
      const formatGenres = (genres) => {
        if (genres.length === 0) return '';
        if (genres.length === 1) return genres[0];
        if (genres.length === 2) return `${genres[0]} and ${genres[1]}`;
        return `${genres.slice(0, -1).join(', ')}, and ${genres[genres.length - 1]}`;
      };
      
      // Check if the requested type is valid
      const isValidType = (type) => {
        return VALID_TYPES.includes(type?.toLowerCase());
      };
      
      const template = `Hi! I'm your creative writing assistant. Let me help you craft something amazing!
      
      ${type ? 
        isValidType(type) ?
          `Type: I'll create a ${type.toLowerCase()} for you` :
          `I notice you've requested to create a "${type}". However, I specialize in creating stories and poems only. 
          Please choose either a story or poem, and I'll be happy to help you create something wonderful!
          
          For now, I'll pause here until you specify either a story or poem.`
        : 'Type: I can create either a story or poem - just let me know which you prefer!'
      }
      
      ${isValidType(type) && genres.length > 0 ? `Genre${genres.length > 1 ? 's' : ''}: ${formatGenres(genres)}` : ''}
      
      ${isValidType(type) && prompt ? `Your prompt: "${prompt}"` : ''}
      
      ${isValidType(type) ? 
        `I'll weave together a creative piece that brings your vision to life${genres.length > 0 ? ` while blending elements of ${formatGenres(genres)}` : ''}.
      
      ------ Generated content below ------`
        : ''
      }`;
      
      setUserPrompt(template);
    
    setUserPrompt(template);
  
    setUserPrompt(template);
  }, [prompt, genres, type]);

  const handleSave = async () => {
    try {
      console.log("Saving start")
      if ((story && type && genres.length > 0) || image) {
        const data = { text: story, type: type, genres: genres, images: image };
        const response = await axios.post('add-story', data);
        if (response.status === 201) {
          console.log('Successfully saved:', response.data);
        }
      }
      console.log('happy')
    } catch (error) {
      console.error('Error saving:', error);
      setError('Failed to save the content');
    }
  };

  useEffect(() => {
    socket.on('text_response', (data) => {
      if (data.error) {
        setError(data.error);
        setIsTextLoading(false);
      } else {
        const uhooo=extractGeneratedContent(data.text)
        setStory(uhooo);
        setIsTextLoading(false);
      }
    });

    socket.on('status', (data) => {
      console.log('Status update:', data.message);
    });

    socket.on('image_response', (data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setImage(data.image);
      }
      setIsImageLoading(false);
    });

    socket.on('error', (data) => {
      setError(data.message);
      setIsTextLoading(false);
      setIsImageLoading(false);
    });

    return () => {
      socket.off('text_response');
      socket.off('status');
      socket.off('image_response');
      socket.off('error');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || !type || genres.length === 0) {
      setError('Please select a type and at least one genre before generating');
      return;
    }

    setIsTextLoading(true);
    setIsImageLoading(true);
    setError('');
    setStory('');
    setImage('');
    
    socket.emit('message', userPrompt);
  };

  return (<>
   <Navbar></Navbar>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
     
      <h1 className="text-4xl font-serif text-center mb-12 text-amber-900 border-b-2 border-amber-900/20 pb-4">Story Generator</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your story prompt..."
            className="w-full p-4 bg-amber-50/50 border-2 border-amber-900/20 rounded-lg font-serif text-lg focus:outline-none focus:ring-2 focus:ring-amber-900/30 focus:border-transparent min-h-[120px] shadow-inner"
            rows={3}
          />
          <button
            type="submit"
            disabled={isTextLoading || !prompt.trim()}
            className="px-4 py-2 bg-amber-900 text-amber-50 rounded-lg hover:bg-amber-800 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg 
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
            Generate
          </button>
        </div>
      </form>

      {isTextLoading && !story && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Generating your story...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="space-y-6">
        {story && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <svg 
                  className="w-5 h-5 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                  <path d="M10 9H8" />
                </svg>
                Generated Content
              </h2>
              <p className="whitespace-pre-wrap">{story}</p>
            </div>
          </div>
        )}
        
        {(isImageLoading || image) && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <svg 
                className="w-5 h-5 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
              Generated Image
            </h2>
            
            {isImageLoading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Generating image...</p>
              </div>
            )}
            
            {image && (
              <img
                src={`data:image/jpeg;base64,${image}`}
                alt="Generated story illustration"
                className="max-w-full rounded-lg shadow-lg"
                onLoad={() => setIsImageLoading(false)}
                style={{ display: isImageLoading ? 'none' : 'block' }}
              />
            )}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-serif text-amber-900 mb-4">Selected Genres: {genres.join(', ')}</h2>
          <div className="flex flex-wrap gap-2">
            {['Fantasy', 'Horror', 'Sci-Fi', 'Comedy', 'Romance'].map((g) => (
              <button
                key={g}
                value={g}
                onClick={handleGenreUpdate}
                className={`px-5 py-2 rounded-full shadow-md transition-all transform hover:scale-105 font-serif
                  ${genres.includes(g) 
                    ? 'bg-amber-900 text-amber-50' 
                    : 'bg-amber-100 text-amber-900 hover:bg-amber-200'}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-serif text-amber-900 mb-4">Selected Type: {type}</h2>
          <div className="flex gap-2">
            {['Poem', 'Story'].map((t) => (
              <button
                key={t}
                onClick={() => handleTypeSelect(t)}
                className={`px-6 py-3 rounded-lg shadow-md transition-all transform hover:scale-105 font-serif
                  ${type === t 
                    ? 'bg-amber-900 text-amber-50' 
                    : 'bg-amber-100 text-amber-900 hover:bg-amber-200'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={!story || !type || genres.length === 0}
          className="w-full px-6 py-3 bg-amber-900 text-amber-50 rounded-lg hover:bg-amber-800 disabled:bg-gray-400 disabled:cursor-not-allowed font-serif text-lg shadow-md transition-colors duration-200"
        >
          Save
        </button>
      </div>
    </div></>
  );
};

export default ChatComponent;