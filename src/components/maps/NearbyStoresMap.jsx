import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Store, Navigation, Clock, Package } from 'lucide-react';
import { Button } from '../ui/button';

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// User location icon
const createUserIcon = () => {
  return L.divIcon({
    className: 'custom-user-marker',
    html: `<div style="
      background-color: #3b82f6;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 4px solid white;
      box-shadow: 0 2px 12px rgba(59,130,246,0.5);
      animation: pulse 2s infinite;
    ">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <circle cx="12" cy="12" r="10"/>
      </svg>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

// Store icon
const createStoreIcon = (distance) => {
  const color = distance < 3 ? '#10b981' : distance < 7 ? '#f59e0b' : '#ef4444';
  return L.divIcon({
    className: 'custom-store-marker',
    html: `<div style="
      background-color: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    </div>
    <div style="
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: bold;
      white-space: nowrap;
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    ">${distance.toFixed(1)} km</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

// Component to fit bounds
function MapController({ userLocation, stores }) {
  const map = useMap();

  useEffect(() => {
    if (userLocation && stores && stores.length > 0) {
      const points = [
        [userLocation.lat, userLocation.lng],
        ...stores.map(store => [
          store.location?.coordinates?.[1],
          store.location?.coordinates?.[0]
        ])
      ];
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 13);
    }
  }, [userLocation, stores, map]);

  return null;
}

export default function NearbyStoresMap({ 
  userLocation, 
  stores = [], 
  onStoreSelect,
  radius = 10,
  height = '500px' 
}) {
  const [selectedStore, setSelectedStore] = useState(null);

  const handleStoreClick = (store) => {
    setSelectedStore(store);
    if (onStoreSelect) {
      onStoreSelect(store);
    }
  };

  // Default center (Nairobi, Kenya)
  const DEFAULT_CENTER = userLocation 
    ? [userLocation.lat, userLocation.lng]
    : [-1.2921, 36.8219];

  return (
    <div style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
      <MapContainer
        center={DEFAULT_CENTER}
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

        {userLocation && stores && <MapController userLocation={userLocation} stores={stores} />}

        {/* User's location marker */}
        {userLocation && (
          <>
            <Marker 
              position={[userLocation.lat, userLocation.lng]} 
              icon={createUserIcon()}
            >
              <Popup>
                <div className="p-2 text-center">
                  <MapPin className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <p className="font-semibold">Your Location</p>
                </div>
              </Popup>
            </Marker>

            {/* Search radius circle */}
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={radius * 1000} // Convert km to meters
              pathOptions={{
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.1,
                weight: 2,
                dashArray: '5, 10'
              }}
            />
          </>
        )}

        {/* Store markers */}
        {stores.map((store) => {
          const position = [
            store.location?.coordinates?.[1] || 0,
            store.location?.coordinates?.[0] || 0
          ];

          if (!position[0] || !position[1]) return null;

          return (
            <Marker
              key={store._id}
              position={position}
              icon={createStoreIcon(store.distance || 0)}
              eventHandlers={{
                click: () => handleStoreClick(store),
              }}
            >
              <Popup className="store-popup" maxWidth={280}>
                <div className="p-3">
                  <div className="flex items-start mb-3">
                    <Store className="h-5 w-5 text-green-600 mr-2 mt-1" />
                    <div>
                      <h3 className="font-bold text-base">{store.storeName}</h3>
                      <p className="text-xs text-gray-600 mt-1">{store.storeAddress}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-sm">
                      <Navigation className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="font-semibold text-blue-600">{store.distance?.toFixed(2)} km away</span>
                    </div>
                    
                    {store.estimatedDeliveryTime && (
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{store.estimatedDeliveryTime}</span>
                      </div>
                    )}

                    {store.productCount !== undefined && (
                      <div className="flex items-center text-sm">
                        <Package className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{store.productCount} products available</span>
                      </div>
                    )}
                  </div>

                  {onStoreSelect && (
                    <Button
                      onClick={() => onStoreSelect(store)}
                      className="w-full"
                      size="sm"
                    >
                      View Products
                    </Button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {!userLocation && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[1000]">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-700 font-semibold mb-2">Location Required</p>
            <p className="text-sm text-gray-600">
              Please enable location access to find nearby stores
            </p>
          </div>
        </div>
      )}

      {userLocation && stores.length === 0 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg z-[1000]">
          <p className="text-sm text-gray-600">No stores found within {radius} km</p>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
