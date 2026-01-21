import { MapPin, Navigation, Clock, Mail, ExternalLink } from 'lucide-react';

// Google Maps API Key from environment variable
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export default function VenueMap() {
  // Venue address
  const venueName = "Outfort";
  const venueAddress = "Hoofdfrontweg 1, 2660 Hoboken, België";
  const venueAddressEncoded = encodeURIComponent(venueAddress);

  // Bot-proof email - split into parts to prevent scraping
  const emailUser = 'hannaentristan' + 'gaantrouwen';
  const emailDomain = 'gmail' + '.' + 'com';
  
  const handleEmailClick = () => {
    // Create a temporary anchor and click it - works better on mobile
    const email = emailUser + '@' + emailDomain;
    const link = document.createElement('a');
    link.href = 'mailto:' + email;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="space-y-6">
      {/* Venue Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-cream-dark">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-navy/10 rounded-lg">
              <MapPin className="w-5 h-5 text-navy" />
            </div>
            <div>
              <h4 className="font-semibold text-navy mb-1">Locatie</h4>
              <p className="text-dusty text-sm">
                <a 
                  href="https://outfort.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-navy hover:text-navy-dark font-medium inline-flex items-center gap-1 hover:underline"
                >
                  {venueName}
                  <ExternalLink className="w-3 h-3" />
                </a><br />
                Hoofdfrontweg 1<br />
                2660 Hoboken, België
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-cream-dark">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-navy/10 rounded-lg">
              <Clock className="w-5 h-5 text-navy" />
            </div>
            <div>
              <h4 className="font-semibold text-navy mb-1">Tijden</h4>
              <p className="text-dusty text-sm">
                Receptie: 17:00<br />
                Diner: 19:00<br />
                Feest: 21:00
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Google Maps Embed */}
      <div className="rounded-xl overflow-hidden shadow-lg border border-cream-dark">
        <iframe
          src={GOOGLE_MAPS_API_KEY 
            ? `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${venueAddressEncoded}&zoom=15`
            : `https://maps.google.com/maps?q=${venueAddressEncoded}&t=&z=15&ie=UTF8&iwloc=&output=embed`
          }
          width="100%"
          height="350"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Venue Location"
          className="w-full"
        />
      </div>

      {/* Navigation Button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${venueAddressEncoded}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-navy text-white py-3 px-6 rounded-xl hover:bg-navy-dark transition-colors font-medium"
        >
          <Navigation className="w-5 h-5" />
          Open in Google Maps
        </a>
        
        <button
          type="button"
          onClick={handleEmailClick}
          className="flex items-center justify-center gap-2 bg-white text-navy py-3 px-6 rounded-xl border border-navy hover:bg-navy/5 transition-colors font-medium cursor-pointer"
        >
          <Mail className="w-5 h-5" />
          Mail voor vragen
        </button>
      </div>
    </div>
  );
}
