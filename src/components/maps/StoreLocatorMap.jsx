import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Store, Package, DollarSign, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';

// Fix default marker icon issue with Leaflet + Webpack/Vite
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
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

// Component to recenter map when stores change
function MapController({ stores }) {
  const map = useMap();

  useEffect(() => {
    if (stores && stores.length > 0) {
      const bounds = L.latLngBounds(
        stores.map(store => [
          store.location?.coordinates?.[1] || 0,
          store.location?.coordinates?.[0] || 0
        ])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [stores, map]);

  return null;
}

export default function StoreLocatorMap({ stores = [], onStoreClick, height = '500px' }) {
  const [selectedStore, setSelectedStore] = useState(null);

  // Default center (Nairobi, Kenya)
  const DEFAULT_CENTER = [-1.2921, 36.8219];
  const DEFAULT_ZOOM = 12;

  const handleMarkerClick = (store) => {
    setSelectedStore(store);
    if (onStoreClick) {
      onStoreClick(store);
    }
  };

  return (
    <div style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
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

        {stores.length > 0 && <MapController stores={stores} />}

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
              icon={createStoreIcon()}
              eventHandlers={{
                click: () => handleMarkerClick(store),
              }}
            >
              <Popup className="store-popup">
                <div className="p-2 min-w-[250px]">
                  <div className="flex items-center mb-2">
                    <Store className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-bold text-lg">{store.storeName}</h3>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{store.storeAddress}</p>

                  {store.metrics && (
                    <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                      <div className="bg-blue-50 p-2 rounded">
                        <Package className="h-4 w-4 mx-auto text-blue-600 mb-1" />
                        <div className="text-xs font-semibold">{store.metrics.products}</div>
                        <div className="text-xs text-gray-600">Products</div>
                      </div>
                      <div className="bg-purple-50 p-2 rounded">
                        <ShoppingCart className="h-4 w-4 mx-auto text-purple-600 mb-1" />
                        <div className="text-xs font-semibold">{store.metrics.orders}</div>
                        <div className="text-xs text-gray-600">Orders</div>
                      </div>
                      <div className="bg-green-50 p-2 rounded">
                        <DollarSign className="h-4 w-4 mx-auto text-green-600 mb-1" />
                        <div className="text-xs font-semibold">${store.metrics.revenue?.toFixed(0)}</div>
                        <div className="text-xs text-gray-600">Revenue</div>
                      </div>
                    </div>
                  )}

                  {store.phone && (
                    <p className="text-sm mb-2">
                      <span className="font-semibold">Phone:</span> {store.phone}
                    </p>
                  )}

                  {onStoreClick && (
                    <Button
                      onClick={() => onStoreClick(store)}
                      className="w-full mt-2"
                      size="sm"
                    >
                      View Details
                    </Button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {stores.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No stores found</p>
          </div>
        </div>
      )}
    </div>
  );
}
