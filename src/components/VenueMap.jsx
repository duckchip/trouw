import { MapPin, Navigation, Clock, Phone } from 'lucide-react';

// Google Maps API Key from environment variable
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export default function VenueMap() {
  // Venue address
  const venueName = "Outfort";
  const venueAddress = "Hoofdfrontweg 1, 2660 Hoboken, België";
  const venueAddressEncoded = encodeURIComponent(venueAddress);
  
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
                {venueName}<br />
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
                Ceremonie: 14:00<br />
                Receptie: 15:00<br />
                Diner: 18:00
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
        
        <a
          href="tel:+31612345678"
          className="flex items-center justify-center gap-2 bg-white text-navy py-3 px-6 rounded-xl border border-navy hover:bg-navy/5 transition-colors font-medium"
        >
          <Phone className="w-5 h-5" />
          Bel voor vragen
        </a>
      </div>
    </div>
  );
}
