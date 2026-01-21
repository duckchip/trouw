import { useState, useRef, useEffect } from 'react';
import { Search, Music, X, Plus, Disc3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Deezer API - doesn't trigger iOS Music app redirect like iTunes does
const DEEZER_SEARCH_URL = 'https://api.deezer.com/search';

// CORS proxy for production (Deezer needs proxy from browsers)
const CORS_PROXY = 'https://corsproxy.io/?';

export default function MusicSearch({ selectedSongs, onSongsChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [searchKey, setSearchKey] = useState(0);
  const debounceRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Fetch with CORS proxy
  const fetchWithProxy = async (url) => {
    const fetchUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  };

  // Track current search to prevent race conditions
  const currentSearchRef = useRef(0);

  const searchTracks = async (query) => {
    const searchId = ++currentSearchRef.current;
    
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchError(false);
      return;
    }

    setIsSearching(true);
    setSearchError(false);

    try {
      // Deezer API endpoint
      const url = `${DEEZER_SEARCH_URL}?q=${encodeURIComponent(query)}&limit=8`;
      const data = await fetchWithProxy(url);

      // Only update if this is still the current search
      if (searchId !== currentSearchRef.current) return;

      // Deezer returns data in a different format than iTunes
      const tracks = (data.data || []).map((track, index) => ({
        id: track.id?.toString() || `track-${Date.now()}-${index}`,
        name: track.title || 'Onbekend nummer',
        artist: track.artist?.name || 'Onbekende artiest',
        album: track.album?.title || '',
        albumArt: track.album?.cover_medium || track.album?.cover || '',
      }));

      setSearchResults(tracks);
      setSearchError(false);
      setIsSearching(false);
    } catch (error) {
      // Only show error if this is still the current search
      if (searchId !== currentSearchRef.current) return;
      
      console.error('Search failed:', error);
      setSearchResults([]);
      setSearchError(true);
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchError(false);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(() => {
      searchTracks(query);
    }, 600);
  };

  const focusSearch = () => {
    if (searchInputRef.current) {
      // Use 'nearest' to avoid aggressive scrolling on mobile
      searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const addSong = (track) => {
    if (selectedSongs.length >= 3) return;
    if (selectedSongs.some((s) => s.id === track.id)) return;

    onSongsChange([...selectedSongs, track]);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setSearchError(false);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    setSearchKey((prev) => prev + 1);
  };

  const removeSong = (trackId) => {
    onSongsChange(selectedSongs.filter((s) => s.id !== trackId));
  };

  const canAddMore = selectedSongs.length < 3;

  return (
    <div className="space-y-4">
      {canAddMore && (
        <div className="relative" key={`search-${searchKey}`}>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-dusty" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Zoek een nummer of artiest..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-cream-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
            style={{ fontSize: '16px' }}
          />

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-cream-dark overflow-hidden z-50 max-h-80 overflow-y-auto -webkit-overflow-scrolling-touch">
              {searchResults.map((track) => {
                const isSelected = selectedSongs.some((s) => s.id === track.id);
                return (
                  <div
                    key={track.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      if (!isSelected) addSong(track);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isSelected) addSong(track);
                    }}
                    className={`w-full flex items-center gap-3 p-3 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-cream-dark/50 opacity-50 cursor-not-allowed'
                        : 'hover:bg-cream-dark/30 active:bg-cream-dark/50'
                    }`}
                  >
                    {track.albumArt ? (
                      <img
                        src={track.albumArt}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-cream-dark"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-cream-dark flex items-center justify-center flex-shrink-0">
                        <Music className="w-6 h-6 text-dusty" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-navy truncate">{track.name}</p>
                      <p className="text-sm text-dusty truncate">{track.artist}</p>
                    </div>
                    {!isSelected && <Plus className="w-5 h-5 text-navy flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
          )}

          {/* Error state */}
          {searchError && !isSearching && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-cream-dark p-4 z-50 text-center">
              <p className="text-dusty text-sm">
                Zoeken lukt niet. Typ je nummer handmatig hieronder:
              </p>
              <button
                type="button"
                onClick={() => {
                  const manualTrack = {
                    id: `manual-${Date.now()}`,
                    name: searchQuery,
                    artist: 'Handmatig toegevoegd',
                    album: '',
                    albumArt: '',
                  };
                  addSong(manualTrack);
                }}
                className="mt-2 text-navy underline text-sm"
              >
                "{searchQuery}" toevoegen
              </button>
            </div>
          )}

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
                      {song.albumArt ? (
                        <img
                          src={song.albumArt}
                          alt={`${song.album} album art`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-cream-dark flex items-center justify-center">
                          <Music className="w-8 h-8 text-dusty" />
                        </div>
                      )}
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

              return (
                <motion.div
                  key={`empty-${slotIndex}`}
                  layout
                  onClick={focusSearch}
                  className="aspect-[4/5] bg-cream-dark/50 rounded-xl border-2 border-dashed border-dusty-light/30 flex flex-col items-center justify-center text-dusty-light hover:border-navy/30 hover:bg-cream-dark/70 transition-colors cursor-pointer"
                >
                  <Music className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 opacity-50" />
                  <span className="text-xs sm:text-sm opacity-70 text-center px-1">
                    {slotIndex === 0 ? 'Zoek hierboven' : 'Kies nummer'}
                  </span>
                </motion.div>
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
