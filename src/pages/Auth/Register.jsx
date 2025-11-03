import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../redux/slices/userSlice';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';
import { AlertCircle, CheckCircle, MapPin } from 'lucide-react';
import Header from '../../components/layout/Header';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'mother',
    // Mother specific
    dueDate: '',
    pregnancyStage: 'first-trimester',
    // Medical specific
    licenseNumber: '',
    specialization: '',
    // Grocery specific
    storeName: '',
    storeAddress: '',
    latitude: '',
    longitude: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleChange = (value) => {
    setFormData({
      ...formData,
      role: value
    });
  };

  const getMyLocation = () => {
    if (navigator.geolocation) {
      setGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    // Show confirmation dialog
    setShowConfirmation(true);
  };

  const handleConfirmRegistration = async () => {
    const { confirmPassword, ...dataToSend } = formData;

    try {
      await dispatch(registerUser(dataToSend)).unwrap();
      setRegistrationSuccess(true);
      toast({
        title: "Success",
        description: "Registration successful! Redirecting to login...",
      });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err || "Registration failed",
      });
      setShowConfirmation(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-blue-50 p-4 mt-0">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center text-primary-600">
            Join MCaid
          </CardTitle>
          <CardDescription className="text-center">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Jane"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="jane.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1234567890"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">I am a...</Label>
              <Select onValueChange={handleRoleChange} defaultValue={formData.role}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mother">Pregnant Mother</SelectItem>
                  <SelectItem value="medical">Medical Personnel</SelectItem>
                  <SelectItem value="grocery">Grocery Store</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mother-specific fields */}
            {formData.role === 'mother' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pregnancyStage">Pregnancy Stage</Label>
                  <Select
                    onValueChange={(value) => setFormData({ ...formData, pregnancyStage: value })}
                    defaultValue={formData.pregnancyStage}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first-trimester">First Trimester (1-12 weeks)</SelectItem>
                      <SelectItem value="second-trimester">Second Trimester (13-26 weeks)</SelectItem>
                      <SelectItem value="third-trimester">Third Trimester (27-40 weeks)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Medical-specific fields */}
            {formData.role === 'medical' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    name="licenseNumber"
                    placeholder="MED12345"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    name="specialization"
                    placeholder="Obstetrician, Gynecologist, etc."
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            {/* Grocery-specific fields */}
            {formData.role === 'grocery' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    name="storeName"
                    placeholder="Healthy Foods Market"
                    value={formData.storeName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeAddress">Store Address</Label>
                  <Input
                    id="storeAddress"
                    name="storeAddress"
                    placeholder="123 Main St, City, State"
                    value={formData.storeAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                {/* Location fields */}
                <div className="space-y-2">
                  <Label>Store Location (Required for map display)</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={getMyLocation}
                      disabled={gettingLocation}
                      className="bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      {gettingLocation ? 'Getting Location...' : 'Use My Location'}
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="any"
                      placeholder="e.g., 40.7128"
                      value={formData.latitude}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="any"
                      placeholder="e.g., -74.0060"
                      value={formData.longitude}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  💡 Tip: Click "Use My Location" to auto-fill coordinates, or enter them manually. This helps customers find your store on the map.
                </p>
              </>
            )}

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {registrationSuccess ? (
              <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900">Registration Confirmed!</h3>
                  <p className="text-sm text-green-700 mt-1">Your account has been created successfully. Redirecting to login...</p>
                </div>
              </div>
            ) : showConfirmation ? (
              <>
                <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900">Confirm Registration</h3>
                    <p className="text-sm text-blue-700 mt-1">Please review your information and confirm to create your account.</p>
                    <div className="mt-3 text-sm text-blue-700 space-y-1">
                      <p><strong>Email:</strong> {formData.email}</p>
                      <p><strong>Role:</strong> {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShowConfirmation(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmRegistration}
                    disabled={loading}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium disabled:opacity-50"
                  >
                    {loading ? 'Creating Account...' : 'Confirm & Register'}
                  </button>
                </div>
              </>
            ) : (
              <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3" disabled={loading}>
                {loading ? 'Processing...' : 'Continue to Confirmation'}
              </Button>
            )}
            <p className="text-sm text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
      </div>
    </>
  );
}
