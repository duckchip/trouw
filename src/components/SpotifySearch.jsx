import { useState, useCallback } from 'react';
import { Search, Music, X, Plus, Disc3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock tracks for demonstration
// To use real Spotify API, add VITE_SPOTIFY_CLIENT_ID to .env and implement OAuth flow
const mockTracks = [
  { id: '1', name: 'Perfect', artist: 'Ed Sheeran', album: 'Divide', albumArt: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200&h=200&fit=crop' },
  { id: '2', name: 'Thinking Out Loud', artist: 'Ed Sheeran', album: 'x', albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop' },
  { id: '3', name: 'All of Me', artist: 'John Legend', album: 'Love in the Future', albumArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop' },
  { id: '4', name: 'A Thousand Years', artist: 'Christina Perri', album: 'The Twilight Saga', albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop' },
  { id: '5', name: 'Can\'t Help Falling in Love', artist: 'Elvis Presley', album: 'Blue Hawaii', albumArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=200&fit=crop' },
  { id: '6', name: 'Marry You', artist: 'Bruno Mars', album: 'Doo-Wops & Hooligans', albumArt: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=200&h=200&fit=crop' },
  { id: '7', name: 'At Last', artist: 'Etta James', album: 'At Last!', albumArt: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=200&h=200&fit=crop' },
  { id: '8', name: 'L-O-V-E', artist: 'Nat King Cole', album: 'L-O-V-E', albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop' },
];

export default function SpotifySearch({ selectedSongs, onSongsChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Simulated Spotify search (replace with actual API call in production)
  const searchTracks = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Filter mock tracks based on query
    const filtered = mockTracks.filter(
      track => 
        track.name.toLowerCase().includes(query.toLowerCase()) ||
        track.artist.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(filtered);
    setIsSearching(false);
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchTracks(query);
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
            placeholder="Zoek een nummer..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-cream-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
          />
          
          {/* Search Results Dropdown */}
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-cream-dark overflow-hidden z-20 max-h-64 overflow-y-auto"
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

