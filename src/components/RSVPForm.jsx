import { useState, useMemo, useEffect } from 'react';
import { User, Users, Check, X, MessageSquare, Send, Loader2, Clock, Plus, Trash2, Music, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import MusicSearch from './MusicSearch';

// Gift Info Component - shown after RSVP submission
function GiftInfo() {
  const [copied, setCopied] = useState(false);
  const bankNumber = 'BE82 7330 7478 1168';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bankNumber.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="mt-8 pt-6 border-t border-cream-dark"
    >
      <p className="text-dusty text-sm mb-2">
        💌 Een bijdrage is altijd welkom:
      </p>
      <div className="flex items-center justify-center gap-2">
        <span className="font-mono text-sm text-navy">
          {bankNumber}
        </span>
        <button
          type="button"
          onClick={copyToClipboard}
          className="p-1.5 hover:bg-navy/10 rounded transition-colors"
          title="Kopieer"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 text-dusty" />
          )}
        </button>
      </div>
      <p className="text-xs text-dusty mt-1">HOFMAN-LOENDERS</p>
    </motion.div>
  );
}

// Google Apps Script Web App URL from environment variable
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';

// All event options with times
const allEventOptions = [
  { id: 'ceremony', label: 'Burgerlijk huwelijk & een glaasje', time: '10:30', icon: '💍', location: 'Oude Vredegerecht, Berchem' },
  { id: 'reception', label: 'Receptie', time: '17:00', icon: '🥂', location: 'Outfort, Hoboken' },
  { id: 'dinner', label: 'Diner', time: '19:00', icon: '🍽️', location: 'Outfort, Hoboken' },
  { id: 'party', label: 'Feest', time: '21:00', icon: '🎉', location: 'Outfort, Hoboken' },
];

// Obfuscated invite codes - change these to your own random strings!
// Simple, readable invite codes - easy to type!
const INVITE_CODES = {
  'JAWOORD': 'ceremonyall', // Ceremony + Reception + Dinner + Party (full day from 10:30)
  'BUBBELS': 'reception',   // Reception only (17:00)
  'DANS': 'partyonly',      // Party only (21:00)
  'DINNER': 'full',         // Reception + Dinner + Party (17:00 onwards)
  'TESTCODE': 'test',       // Test mode - full access but doesn't send to Google
};

// Invite level descriptions
const INVITE_DESCRIPTIONS = {
  'ceremony': {
    title: 'Jullie zijn uitgenodigd voor de huwelijksceremonie',
    description: 'Om 10:30 trouwen we in het Oude Vredegerecht te Berchem. We verwachten jullie tussen 10:00 en 10:30.',
    icon: '💍',
    extraLocation: {
      name: 'Oude Vredegerecht',
      address: 'Grote Steenweg 13, 2600 Berchem',
    },
  },
  'ceremonyall': {
    title: 'Jullie zijn uitgenodigd voor de hele dag',
    description: 'Om 10:30 trouwen we in het Oude Vredegerecht te Berchem. Daarna verwelkomen we jullie vanaf 17:00 in Outfort voor de receptie, het diner en het feest.',
    icon: '💒',
    extraLocation: {
      name: 'Oude Vredegerecht',
      address: 'Grote Steenweg 13, 2600 Berchem',
    },
  },
  'reception': {
    title: 'Jullie zijn uitgenodigd voor de receptie',
    description: 'Vanaf 17:00 verwelkomen we jullie graag voor een gezellige receptie in Outfort.',
    icon: '🥂',
  },
  'dinner': {
    title: 'Jullie zijn uitgenodigd voor de receptie en het diner',
    description: 'Vanaf 17:00 verwelkomen we jullie graag in Outfort. Om 19:00 schuiven we aan voor het diner.',
    icon: '🍽️',
  },
  'partyonly': {
    title: 'Jullie zijn uitgenodigd voor het avondfeest',
    description: 'Vanaf 21:00 verwelkomen we jullie graag in Outfort om samen te feesten!',
    icon: '🎉',
  },
  'full': {
    title: 'Jullie zijn uitgenodigd voor de receptie, het diner en het feest',
    description: 'Vanaf 17:00 verwelkomen we jullie in Outfort voor de receptie, gevolgd door het diner om 19:00 en het feest om 21:00.',
    icon: '🥳',
  },
  'test': {
    title: '🧪 Test Modus',
    description: 'Dit is een test. Alle opties zijn beschikbaar maar er wordt niets verzonden.',
    icon: '🧪',
    extraLocation: {
      name: 'Oude Vredegerecht',
      address: 'Grote Steenweg 13, 2600 Berchem',
    },
  },
};

function getInviteLevel() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('i')?.toUpperCase();
  if (code && INVITE_CODES[code]) {
    return INVITE_CODES[code];
  }
  return null;
}

function launchCelebration() {
  const duration = 3000;
  const end = Date.now() + duration;
  const colors = ['#d4af37', '#ffffff', '#93c5fd', '#fef3c7'];

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors,
  });
  frame();
}

function FlyingDoves() {
  const doves = [
    { delay: 0, startX: -50, startY: 300 },
    { delay: 0.3, startX: -80, startY: 250 },
    { delay: 0.6, startX: -30, startY: 350 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {doves.map((dove, i) => (
        <motion.div
          key={i}
          initial={{ x: dove.startX, y: dove.startY, opacity: 0 }}
          animate={{
            x: [dove.startX, 150, 400],
            y: [dove.startY, dove.startY - 150, dove.startY - 100],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 2.5, delay: dove.delay, ease: 'easeOut' }}
          className="absolute text-4xl"
        >
          🕊️
        </motion.div>
      ))}
    </div>
  );
}

export default function RSVPForm() {
  const [guests, setGuests] = useState([{ name: '', dietary: '' }]);
  const [attendance, setAttendance] = useState(null);
  const [eventType, setEventType] = useState('');
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Initialize from URL (for QR scans) or null (show code input)
  const [inviteLevel, setInviteLevel] = useState(() => getInviteLevel());

  const availableEvents = useMemo(() => {
    if (!inviteLevel) return [];
    switch (inviteLevel) {
      case 'ceremony':
        return allEventOptions.filter((e) => e.id === 'ceremony');
      case 'ceremonyall':
      case 'test': // Test mode has access to all events
        return allEventOptions; // All events including ceremony
      case 'reception':
        return allEventOptions.filter((e) => e.id === 'reception');
      case 'dinner':
        return allEventOptions.filter((e) => e.id === 'reception' || e.id === 'dinner');
      case 'partyonly':
        return allEventOptions.filter((e) => e.id === 'party');
      case 'full':
        return allEventOptions.filter((e) => e.id !== 'ceremony'); // Reception, dinner, party (no ceremony)
      default:
        return [];
    }
  }, [inviteLevel]);

  const singleEvent = availableEvents.length === 1;

  const showDietary = useMemo(() => {
    // Party-only guests don't need dietary (no food served)
    if (inviteLevel === 'partyonly') return false;
    if (singleEvent && availableEvents.length > 0) {
      const eventId = availableEvents[0]?.id;
      return eventId === 'ceremony' || eventId === 'reception' || eventId === 'dinner';
    }
    return eventType === 'ceremony' || eventType === 'reception' || eventType === 'dinner';
  }, [inviteLevel, singleEvent, availableEvents, eventType]);

  useEffect(() => {
    if (isSubmitted && attendance) {
      setShowCelebration(true);
      launchCelebration();
    }
  }, [isSubmitted, attendance]);

  const addGuest = () => {
    if (guests.length < 6) {
      setGuests([...guests, { name: '', dietary: '' }]);
    }
  };

  const removeGuest = (index) => {
    if (guests.length > 1) {
      setGuests(guests.filter((_, i) => i !== index));
    }
  };

  const updateGuest = (index, field, value) => {
    const updated = [...guests];
    updated[index] = { ...updated[index], [field]: value };
    setGuests(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filledGuests = guests.filter((g) => g.name.trim());
    if (filledGuests.length === 0) {
      toast.error('Vul alsjeblieft minstens één naam in');
      return;
    }

    if (attendance === null) {
      toast.error('Laat ons weten of jullie erbij zijn');
      return;
    }

    const selectedEventId = singleEvent ? availableEvents[0]?.id : eventType;
    if (attendance && !selectedEventId) {
      toast.error('Selecteer vanaf welk moment jullie erbij zijn');
      return;
    }

    setIsSubmitting(true);

    const selectedEvent = allEventOptions.find((e) => e.id === selectedEventId);
    const eventLabel = selectedEvent ? `${selectedEvent.label} (${selectedEvent.time})` : 'N.v.t.';

    try {
      // Skip Google submission in test mode
      if (inviteLevel === 'test') {
        console.log('TEST MODE - Skipping Google submission');
        console.log('Would have submitted:', filledGuests.map(guest => ({
          name: guest.name,
          attendance: attendance ? 'Ja' : 'Nee',
          eventType: eventLabel,
          dietary: guest.dietary || 'Geen',
          songs: selectedSongs.map((s) => `${s.name} - ${s.artist}`),
        })));
      } else {
        // Submit each guest separately to Google Sheets
        for (const guest of filledGuests) {
          const submissionData = {
            name: guest.name,
            attendance: attendance ? 'Ja' : 'Nee',
            eventType: eventLabel,
            dietary: guest.dietary || 'Geen',
            songs: selectedSongs.map((s) => `${s.name} - ${s.artist}`),
            submittedAt: new Date().toISOString(),
          };

          await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submissionData),
          });
        }
      }

      setIsSubmitted(true);
      
      // Scroll to top of RSVP section
      setTimeout(() => {
        document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      
      toast.success(
        inviteLevel === 'test'
          ? `🧪 Test succesvol! (niet verzonden)`
          : filledGuests.length > 1
            ? `Bedankt! ${filledGuests.length} gasten geregistreerd.`
            : 'Bedankt voor je reactie!'
      );
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Er ging iets mis. Probeer het opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [inviteCode, setInviteCode] = useState('');
  const [codeError, setCodeError] = useState('');

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    setCodeError('');
    
    const code = inviteCode.trim().toUpperCase();
    if (!code) return;

    // Check if it's a valid code
    if (INVITE_CODES[code]) {
      setInviteLevel(INVITE_CODES[code]);
      // Scroll to top of RSVP section
      setTimeout(() => {
        document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      setCodeError('Ongeldige code. Controleer je uitnodiging.');
    }
  };

  if (!inviteLevel) {
    return (
      <div className="text-center py-8 px-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-navy/10 rounded-full mb-6">
          <span className="text-4xl">💌</span>
        </div>
        <h3 className="font-serif text-2xl md:text-3xl text-navy mb-4">Welkom!</h3>
        <p className="text-dusty max-w-md mx-auto mb-6">
          Vul de code in van je uitnodiging om je aan te melden.
        </p>

        <form onSubmit={handleCodeSubmit} className="max-w-xs mx-auto space-y-4">
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            placeholder="CODE"
            className="w-full px-4 py-4 border-2 border-cream-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-center text-2xl font-medium tracking-widest uppercase"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
          {codeError && (
            <p className="text-red-500 text-sm">{codeError}</p>
          )}
          <button
            type="submit"
            className="bg-navy text-white py-3 px-8 rounded-xl hover:bg-navy-dark transition-colors font-medium w-full"
          >
            Ga verder
          </button>
        </form>
      </div>
    );
  }

  if (isSubmitted) {
    const guestCount = guests.filter((g) => g.name.trim()).length;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 px-8 relative"
      >
        {showCelebration && <FlyingDoves />}

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-gold/20 to-navy/10 rounded-full mb-6 relative"
        >
          <span className="text-5xl">{attendance ? '🎉' : '💝'}</span>
          {attendance && (
            <>
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-2 -right-2 text-2xl"
              >
                🕊️
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="absolute -bottom-1 -left-2 text-2xl"
              >
                🕊️
              </motion.span>
            </>
          )}
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-serif text-3xl md:text-4xl text-navy mb-4"
        >
          {attendance ? 'Tot dan!' : 'Jammer!'}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-dusty text-lg max-w-md mx-auto"
        >
          {attendance
            ? guestCount > 1
              ? `We kijken ernaar uit om jullie ${guestCount} te zien op onze speciale dag!`
              : 'We kijken ernaar uit om je te zien op onze speciale dag!'
            : 'We zullen jullie missen, maar we begrijpen het. We houden jullie op de hoogte!'}
        </motion.p>

        {attendance && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 flex justify-center gap-2 text-2xl"
          >
            {['💒', '💍', '🥂', '💐', '🎶'].map((emoji, i) => (
              <motion.span
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 + i * 0.1 }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>
        )}

        {/* Gift info - only show if attending */}
        {attendance && (
          <GiftInfo />
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={() => {
            setIsSubmitted(false);
            setShowCelebration(false);
            setGuests([{ name: '', dietary: '' }]);
            setAttendance(null);
            setEventType('');
            setSelectedSongs([]);
          }}
          className="mt-8 text-dusty hover:text-navy underline underline-offset-4 transition-colors"
        >
          Nog meer gasten aanmelden?
        </motion.button>
      </motion.div>
    );
  }

  const inviteInfo = INVITE_DESCRIPTIONS[inviteLevel];

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Invite Info Banner */}
      {inviteInfo && (
        <div className="bg-gradient-to-r from-navy/5 to-gold/10 rounded-xl p-5 text-center border border-cream-dark">
          <span className="text-3xl mb-2 block">{inviteInfo.icon}</span>
          <h3 className="font-serif text-lg md:text-xl text-navy mb-2">{inviteInfo.title}</h3>
          <p className="text-sm text-dusty">{inviteInfo.description}</p>
          
          {/* Extra location for ceremony */}
          {inviteInfo.extraLocation && (
            <div className="mt-4 pt-4 border-t border-cream-dark">
              <p className="text-xs text-dusty uppercase tracking-wide mb-1">Locatie ceremonie</p>
              <p className="text-sm font-medium text-navy">{inviteInfo.extraLocation.name}</p>
              <p className="text-sm text-dusty">{inviteInfo.extraLocation.address}</p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(inviteInfo.extraLocation.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-xs text-navy underline underline-offset-2 hover:text-navy-dark"
              >
                Routebeschrijving →
              </a>
            </div>
          )}
        </div>
      )}

      {/* Guest Names */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-navy font-medium">
          <Users className="w-4 h-4" />
          Wie komt er?
        </label>
        <p className="text-sm text-dusty -mt-2">
          Vul de volledige namen in (voor- en achternaam)
        </p>

        <div className="space-y-3">
          {guests.map((guest, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2"
            >
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-dusty" />
                </div>
                <input
                  type="text"
                  value={guest.name}
                  onChange={(e) => updateGuest(index, 'name', e.target.value)}
                  placeholder={index === 0 ? 'Voornaam + Achternaam' : `Gast ${index + 1} - Voornaam + Achternaam`}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-cream-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors text-base"
                  autoComplete="off"
                />
              </div>
              {guests.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeGuest(index)}
                  className="px-3 py-3 text-dusty hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  aria-label="Verwijder gast"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {guests.length < 6 && (
          <button
            type="button"
            onClick={addGuest}
            className="flex items-center gap-2 text-navy hover:text-navy-dark font-medium text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nog iemand toevoegen
          </button>
        )}
      </div>

      {/* Attendance */}
      <div className="space-y-3">
        <label className="text-navy font-medium">
          {guests.length > 1 ? 'Zijn jullie erbij?' : 'Ben je erbij?'}
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setAttendance(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl border-2 transition-all ${
              attendance === true
                ? 'bg-navy text-white border-navy shadow-lg'
                : 'bg-white text-navy border-cream-dark hover:border-navy/30'
            }`}
          >
            <Check className="w-5 h-5" />
            <span className="font-medium">{guests.length > 1 ? 'Ja, wij komen!' : 'Ja, ik kom!'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAttendance(false);
              setEventType('');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl border-2 transition-all ${
              attendance === false
                ? 'bg-dusty text-white border-dusty shadow-lg'
                : 'bg-white text-dusty border-cream-dark hover:border-dusty/30'
            }`}
          >
            <X className="w-5 h-5" />
            <span className="font-medium">Helaas niet</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {attendance === true && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-8"
          >
            {/* Event Type Selection */}
            {!singleEvent && (
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-navy font-medium">
                  <Clock className="w-4 h-4" />
                  {guests.length > 1 ? 'Vanaf welk moment kunnen jullie erbij zijn?' : 'Vanaf welk moment kan je erbij zijn?'}
                </label>
                <div
                  className={`grid grid-cols-2 gap-3 ${
                    availableEvents.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
                  }`}
                >
                  {availableEvents.map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => setEventType(event.id)}
                      className={`flex flex-col items-center gap-2 py-4 px-4 rounded-xl border-2 transition-all ${
                        eventType === event.id
                          ? 'bg-navy text-white border-navy shadow-lg'
                          : 'bg-white text-navy border-cream-dark hover:border-navy/30'
                      }`}
                    >
                      <span className="text-2xl">{event.icon}</span>
                      <span className="font-medium">{event.label}</span>
                      <span className={`text-sm ${eventType === event.id ? 'text-white/80' : 'text-dusty'}`}>
                        {event.time}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {singleEvent && availableEvents.length > 0 && (
              <div className="bg-cream-dark/50 rounded-xl p-4 text-center">
                <span className="text-2xl">{availableEvents[0].icon}</span>
                <p className="text-navy font-medium mt-2">
                  {availableEvents[0].label} om {availableEvents[0].time}
                </p>
              </div>
            )}

            {/* Dietary Restrictions per guest */}
            {(singleEvent || eventType) && showDietary && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                <label className="flex items-center gap-2 text-navy font-medium">
                  <MessageSquare className="w-4 h-4" />
                  Dieetwensen of allergieën
                </label>
                {guests.map(
                  (guest, index) =>
                    guest.name.trim() && (
                      <div key={index} className="space-y-1">
                        <label className="text-sm text-dusty">{guest.name}</label>
                        <textarea
                          value={guest.dietary}
                          onChange={(e) => updateGuest(index, 'dietary', e.target.value)}
                          placeholder="Geen bijzonderheden"
                          rows={2}
                          className="w-full px-4 py-3 bg-white border border-cream-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors resize-none text-base"
                        />
                      </div>
                    )
                )}
                {!guests.some((g) => g.name.trim()) && (
                  <p className="text-sm text-dusty italic">Vul eerst de namen in hierboven</p>
                )}
              </motion.div>
            )}

            {/* Music Selection */}
            {(singleEvent || eventType) && (
              <div className="space-y-3 pt-4 border-t border-cream-dark">
                <label className="flex items-center gap-2 text-navy font-medium">
                  <Music className="w-4 h-4" />
                  Muziekwensen
                </label>
                <p className="text-dusty text-sm">
                  Kies tot 3 nummers die jullie graag willen horen op ons feest!
                </p>
                <MusicSearch selectedSongs={selectedSongs} onSongsChange={setSelectedSongs} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || attendance === null}
        className="w-full flex items-center justify-center gap-2 bg-navy text-white py-4 px-8 rounded-xl font-medium text-lg hover:bg-navy-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Even geduld...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Verstuur RSVP
          </>
        )}
      </button>
    </motion.form>
  );
}
