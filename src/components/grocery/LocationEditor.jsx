import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { MapPin, Save } from 'lucide-react';
import { updateProfile } from '../../redux/slices/userSlice';
import { useToast } from '../../hooks/use-toast';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

// Component to recenter map when position changes
function MapUpdater({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && center[0] !== 0 && center[1] !== 0) {
      map.setView(center, 15);
    }
  }, [center, map]);
  
  return null;
}

export default function LocationEditor() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { toast } = useToast();
  const [gettingLocation, setGettingLocation] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    storeAddress: user?.storeAddress || '',
    latitude: '',
    longitude: ''
  });

  const [mapPosition, setMapPosition] = useState([0, 0]);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    // Initialize form with user data on mount or when user changes
    if (user) {
      const newFormData = {
        storeAddress: user.storeAddress || '',
        latitude: '',
        longitude: ''
      };

      if (user.location?.coordinates && user.location.coordinates.length === 2) {
        const [lng, lat] = user.location.coordinates;
        if (!isNaN(lat) && !isNaN(lng)) {
          newFormData.latitude = lat.toString();
          newFormData.longitude = lng.toString();
          setMapPosition([lat, lng]);
          setMapKey(prev => prev + 1); // Force map refresh
        }
      }

      setFormData(newFormData);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'latitude' || name === 'longitude') {
      const lat = name === 'latitude' ? parseFloat(value) : parseFloat(formData.latitude);
      const lng = name === 'longitude' ? parseFloat(value) : parseFloat(formData.longitude);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapPosition([lat, lng]);
      }
    }
  };

  const getMyLocation = () => {
    if (navigator.geolocation) {
      setGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setFormData(prev => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString()
          }));
          setMapPosition([lat, lng]);
          setGettingLocation(false);
          
          toast({
            title: "Success",
            description: "Location detected successfully!",
          });
        },
        (error) => {
          setGettingLocation(false);
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Please enable location access or enter coordinates manually",
          });
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Geolocation is not supported by your browser",
      });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        toast({
          variant: "destructive",
          title: "Invalid Coordinates",
          description: "Please enter valid latitude and longitude values",
        });
        setSaving(false);
        return;
      }
      
      const updateData = {
        storeAddress: formData.storeAddress,
        latitude: lat,
        longitude: lng
      };

      await dispatch(updateProfile(updateData)).unwrap();
      
      // Update map position and force refresh
      setMapPosition([lat, lng]);
      setMapKey(prev => prev + 1);
      
      toast({
        title: "Success",
        description: "Store location updated successfully! Your location is now visible on the map.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error || "Failed to update location",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleMapClick = (newPosition) => {
    setFormData(prev => ({
      ...prev,
      latitude: newPosition[0].toString(),
      longitude: newPosition[1].toString()
    }));
    setMapPosition(newPosition);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Location</CardTitle>
        <CardDescription>
          Update your store's location to help customers find you on the map
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="storeAddress">Store Address</Label>
          <Input
            id="storeAddress"
            name="storeAddress"
            value={formData.storeAddress}
            onChange={handleInputChange}
            placeholder="123 Main St, City, State"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              name="latitude"
              type="number"
              step="any"
              value={formData.latitude}
              onChange={handleInputChange}
              placeholder="e.g., 40.7128"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              name="longitude"
              type="number"
              step="any"
              value={formData.longitude}
              onChange={handleInputChange}
              placeholder="e.g., -74.0060"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={getMyLocation}
            disabled={gettingLocation}
            variant="outline"
            className="flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            {gettingLocation ? 'Getting Location...' : 'Use My Location'}
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={saving || !formData.latitude || !formData.longitude}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Location'}
          </Button>
        </div>

        {/* Map */}
        {mapPosition[0] !== 0 && mapPosition[1] !== 0 && (
          <div className="mt-4 rounded-lg overflow-hidden border">
            <MapContainer
              key={mapKey}
              center={mapPosition}
              zoom={15}
              style={{ height: '400px', width: '100%' }}
              scrollWheelZoom={true}
              dragging={true}
              touchZoom={true}
              doubleClickZoom={true}
              boxZoom={true}
              keyboard={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapUpdater center={mapPosition} />
              <LocationPicker position={mapPosition} setPosition={handleMapClick} />
            </MapContainer>
            <p className="text-xs text-gray-500 p-2 bg-gray-50">
              💡 Click on the map to set your store location, or scroll to zoom and drag to pan
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
