import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Store, MapPin } from 'lucide-react';

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom store icon
const createStoreIcon = () => {
  return L.divIcon({
    className: 'custom-store-marker',
    html: `<div style="
      background-color: #10b981;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 4px solid white;
      box-shadow: 0 4px 12px rgba(16,185,129,0.4);
    ">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

export default function SingleStoreMap({ 
  storeLocation, 
  storeName, 
  storeAddress,
  serviceRadius = 10, // in km
  height = '400px',
  showServiceArea = true 
}) {
  // Extract coordinates
  const position = storeLocation?.coordinates 
    ? [storeLocation.coordinates[1], storeLocation.coordinates[0]] // [lat, lng]
    : [-1.2921, 36.8219]; // Default: Nairobi

  const hasValidLocation = storeLocation?.coordinates?.[0] && storeLocation?.coordinates?.[1];

  return (
    <div style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        dragging={true}
        touchZoom={true}
        doubleClickZoom={true}
        boxZoom={true}
        keyboard={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hasValidLocation && (
          <>
            {/* Service area circle */}
            {showServiceArea && (
              <Circle
                center={position}
                radius={serviceRadius * 1000} // Convert km to meters
                pathOptions={{
                  color: '#10b981',
                  fillColor: '#10b981',
                  fillOpacity: 0.15,
                  weight: 2,
                  dashArray: '10, 5'
                }}
              />
            )}

            {/* Store marker */}
            <Marker position={position} icon={createStoreIcon()}>
              <Popup className="store-popup">
                <div className="p-3 min-w-[200px]">
                  <div className="flex items-center mb-2">
                    <Store className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-bold text-base">{storeName || 'Your Store'}</h3>
                  </div>
                  
                  {storeAddress && (
                    <div className="flex items-start text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1 mt-0.5" />
                      <p>{storeAddress}</p>
                    </div>
                  )}

                  {showServiceArea && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500">
                        Service Area: <span className="font-semibold text-green-600">{serviceRadius} km radius</span>
                      </p>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>

      {!hasValidLocation && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-[1000]">
          <div className="text-center p-6">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-700 font-semibold mb-2">No Location Set</p>
            <p className="text-sm text-gray-600">
              Please update your store location in settings
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
