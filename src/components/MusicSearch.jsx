import { useState, useCallback, useRef } from 'react';
import { Search, Music, X, Plus, Disc3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Using iTunes Search API via CORS proxy for production
const ITUNES_BASE_URL = 'https://itunes.apple.com/search';
const CORS_PROXY = 'https://corsproxy.io/?';

export default function MusicSearch({ selectedSongs, onSongsChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef(null);
  const searchInputRef = useRef(null);

  // Search iTunes API
  const searchTracks = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      // Use CORS proxy in production, direct in development
      const itunesUrl = `${ITUNES_BASE_URL}?term=${encodeURIComponent(query)}&media=music&entity=song&limit=8`;
      const fetchUrl = window.location.hostname === 'localhost' 
        ? itunesUrl 
        : `${CORS_PROXY}${encodeURIComponent(itunesUrl)}`;
      
      const response = await fetch(fetchUrl);
      const data = await response.json();
      
      // Transform iTunes results to our format
      const tracks = data.results.map(track => ({
        id: track.trackId.toString(),
        name: track.trackName,
        artist: track.artistName,
        album: track.collectionName,
        albumArt: track.artworkUrl100.replace('100x100', '300x300'),
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
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      searchTracks(query);
    }, 300);
  };

  // Focus search input and scroll into view
  const focusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    }
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

  const canAddMore = selectedSongs.length < 3;

  return (
    <div className="space-y-4">
      {/* Search Input - Now at the top for better mobile UX */}
      {canAddMore && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-dusty" />
          </div>
          <input
            ref={searchInputRef}
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
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-cream-dark overflow-hidden z-20 max-h-80 overflow-y-auto"
              >
                {searchResults.map((track) => {
                  const isSelected = selectedSongs.some(s => s.id === track.id);
                  return (
                    <button
                      type="button"
                      key={track.id}
                      onClick={() => !isSelected && addSong(track)}
                      disabled={isSelected}
                      className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                        isSelected 
                          ? 'bg-cream-dark/50 opacity-50 cursor-not-allowed' 
                          : 'hover:bg-cream-dark/30 active:bg-cream-dark/50'
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

      {/* Selected Songs */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-dusty">
          <Disc3 className="w-4 h-4" />
          <span>Jouw Top 3 ({selectedSongs.length}/3)</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <AnimatePresence mode="popLayout">
            {/* Always show 3 slots */}
            {[0, 1, 2].map((slotIndex) => {
              const song = selectedSongs[slotIndex];
              
              if (song) {
                return (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    layout
                    className="relative bg-white rounded-xl shadow-md overflow-hidden border border-cream-dark"
                  >
                    <button
                      type="button"
                      onClick={() => removeSong(song.id)}
                      className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10 bg-white/90 hover:bg-red-50 text-dusty hover:text-red-500 rounded-full p-1 transition-colors shadow-sm"
                      aria-label="Verwijder nummer"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    
                    <div className="aspect-square relative">
                      <img 
                        src={song.albumArt} 
                        alt={`${song.album} album art`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 bg-navy/80 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full font-medium">
                        #{slotIndex + 1}
                      </div>
                    </div>
                    
                    <div className="p-2 sm:p-3">
                      <p className="font-semibold text-navy truncate text-xs sm:text-sm">{song.name}</p>
                      <p className="text-dusty text-xs truncate">{song.artist}</p>
                    </div>
                  </motion.div>
                );
              }
              
              // Empty slot - clickable to focus search
              return (
                <motion.button
                  type="button"
                  key={`empty-${slotIndex}`}
                  layout
                  onClick={focusSearch}
                  className="aspect-[4/5] bg-cream-dark/50 rounded-xl border-2 border-dashed border-dusty-light/30 flex flex-col items-center justify-center text-dusty-light hover:border-navy/30 hover:bg-cream-dark/70 transition-colors cursor-pointer"
                >
                  <Music className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 opacity-50" />
                  <span className="text-xs sm:text-sm opacity-70 text-center px-1">
                    {slotIndex === 0 ? 'Zoek hierboven' : 'Kies nummer'}
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      
      <p className="text-xs sm:text-sm text-dusty text-center">
        Help ons de perfecte playlist samen te stellen!
      </p>
    </div>
  );
}
