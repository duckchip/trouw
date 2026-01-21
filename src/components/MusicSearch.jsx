import { useState, useCallback, useRef } from 'react';
import { Search, Music, X, Plus, Disc3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Using iTunes Search API - free, no API key needed!
const ITUNES_SEARCH_URL = 'https://itunes.apple.com/search';

export default function SpotifySearch({ selectedSongs, onSongsChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef(null);

  // Search iTunes API
  const searchTracks = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const response = await fetch(
        `${ITUNES_SEARCH_URL}?term=${encodeURIComponent(query)}&media=music&entity=song&limit=8`
      );
      const data = await response.json();
      
      // Transform iTunes results to our format
      const tracks = data.results.map(track => ({
        id: track.trackId.toString(),
        name: track.trackName,
        artist: track.artistName,
        album: track.collectionName,
        albumArt: track.artworkUrl100.replace('100x100', '300x300'), // Get higher res
      }));
      
      setSearchResults(tracks);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Debounce the search
    debounceRef.current = setTimeout(() => {
      searchTracks(query);
    }, 300);
  };

  const addSong = (track) => {
    if (selectedSongs.length >= 3) return;
    if (selectedSongs.some(s => s.id === track.id)) return;
    onSongsChange([...selectedSongs, track]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeSong = (trackId) => {
    onSongsChange(selectedSongs.filter(s => s.id !== trackId));
  };

  return (
    <div className="space-y-6">
      {/* Selected Songs */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-dusty">
          <Disc3 className="w-4 h-4" />
          <span>Jouw Top 3 ({selectedSongs.length}/3)</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {selectedSongs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
                className="relative bg-white rounded-xl shadow-md overflow-hidden border border-cream-dark"
              >
                <button
                  onClick={() => removeSong(song.id)}
                  className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-red-50 text-dusty hover:text-red-500 rounded-full p-1 transition-colors shadow-sm"
                  aria-label="Verwijder nummer"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="aspect-square relative">
                  <img 
                    src={song.albumArt} 
                    alt={`${song.album} album art`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-navy/80 text-white text-xs px-2 py-1 rounded-full font-medium">
                    #{index + 1}
                  </div>
                </div>
                
                <div className="p-3">
                  <p className="font-semibold text-navy truncate text-sm">{song.name}</p>
                  <p className="text-dusty text-xs truncate">{song.artist}</p>
                </div>
              </motion.div>
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: 3 - selectedSongs.length }).map((_, index) => (
              <motion.div
                key={`empty-${index}`}
                layout
                className="aspect-[4/5] bg-cream-dark/50 rounded-xl border-2 border-dashed border-dusty-light/30 flex flex-col items-center justify-center text-dusty-light"
              >
                <Music className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-sm opacity-70">Kies een nummer</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Search Input */}
      {selectedSongs.length < 3 && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-dusty" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Zoek een nummer of artiest..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-cream-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
          />
          
          {/* Search Results Dropdown */}
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-cream-dark overflow-hidden z-20 max-h-72 overflow-y-auto"
              >
                {searchResults.map((track) => {
                  const isSelected = selectedSongs.some(s => s.id === track.id);
                  return (
                    <button
                      key={track.id}
                      onClick={() => !isSelected && addSong(track)}
                      disabled={isSelected}
                      className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                        isSelected 
                          ? 'bg-cream-dark/50 opacity-50 cursor-not-allowed' 
                          : 'hover:bg-cream-dark/30'
                      }`}
                    >
                      <img 
                        src={track.albumArt} 
                        alt="" 
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-navy truncate">{track.name}</p>
                        <p className="text-sm text-dusty truncate">{track.artist}</p>
                      </div>
                      {!isSelected && (
                        <Plus className="w-5 h-5 text-navy flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
          
          {isSearching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}
      
      <p className="text-sm text-dusty text-center">
        Help ons de perfecte playlist samen te stellen!
      </p>
    </div>
  );
}
