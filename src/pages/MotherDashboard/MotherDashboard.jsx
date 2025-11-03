import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPregnancyRecord, getAppointments, updateHealthMetrics } from '../../redux/slices/pregnancySlice';
import { getGroceryItems, getNearbyStores } from '../../redux/slices/grocerySlice';
import { updateProfile } from '../../redux/slices/userSlice';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Heart, Calendar, ShoppingCart, MessageSquare, Activity, MapPin } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import Chat from '../../components/chat/Chat';
import HealthMetricsModal from '../../components/modals/HealthMetricsModal';
import MarketplaceProducts from '../../components/marketplace/MarketplaceProducts';
import OrderTracking from '../../components/marketplace/OrderTracking';
import AIMealPlanner from '../../components/marketplace/AIMealPlanner';
import AppointmentCalendar from '../../components/appointments/AppointmentCalendar';
import SymptomsTracker from '../../components/pregnancy/SymptomsTracker';
import MedicationsList from '../../components/pregnancy/MedicationsList';
import NearbyStoresMap from '../../components/maps/NearbyStoresMap';
import StoresList from '../../components/stores/StoresList';
import BookAppointmentModal from '../../components/appointments/BookAppointmentModal';
import EditAppointmentModal from '../../components/appointments/EditAppointmentModal';

export default function MotherDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { pregnancyRecord, appointments, loading } = useSelector((state) => state.pregnancy);
  const { nearbyStores } = useSelector((state) => state.grocery);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const { toast } = useToast();

  const handleUpdateHealthMetrics = async (metricsData) => {
    try {
      console.log('Updating health metrics:', metricsData);
      // Update user profile first
      await dispatch(updateProfile(metricsData)).unwrap();
      // Then update Redux pregnancy state
      dispatch(updateHealthMetrics(metricsData.healthMetrics));
      toast({
        title: "Success",
        description: "Health metrics updated successfully!",
      });
    } catch (error) {
      console.error('Update error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error || 'Failed to update health metrics',
      });
      throw error;
    }
  };

  useEffect(() => {
    dispatch(getPregnancyRecord());
    dispatch(getAppointments());
  }, [dispatch]);

  const handleAppointmentBooked = (newAppointment) => {
    dispatch(getAppointments()); // Refresh appointments
    toast({
      title: "Success",
      description: "Your appointment has been booked!",
    });
  };

    const handleAppointmentEdit = (appointment) => {
      setSelectedAppointment(appointment);
      setShowEditModal(true);
    };

    const handleAppointmentUpdated = () => {
      dispatch(getAppointments()); // Refresh appointments
      toast({
        title: "Success",
        description: "Your appointment has been updated!",
      });
    };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          // Fetch nearby stores
          dispatch(getNearbyStores({ lat: location.lat, lng: location.lng, radius: 10 }));
          setLoadingLocation(false);
          toast({
            title: "Success",
            description: "Location detected successfully!",
          });
        },
        (error) => {
          setLoadingLocation(false);
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Please enable location access to find nearby stores",
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

  const calculateWeeksPregnant = () => {
    if (!user?.dueDate) return 0;
    const dueDate = new Date(user.dueDate);
    const today = new Date();
    const daysDiff = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
    return Math.max(1, 40 - Math.floor(daysDiff / 7));
  };

  const currentWeek = pregnancyRecord?.currentWeek || calculateWeeksPregnant();

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg p-4 sm:p-6 text-blue-900">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-base sm:text-lg opacity-90">You are {currentWeek} weeks pregnant</p>
        <div className="mt-4 flex items-center space-x-2">
          <div className="h-2 bg-white/30 rounded-full flex-1">
            <div
              className="h-2 bg-gradient-to-r from-cyan-200 to-blue-900 rounded-full transition-all"
              style={{ width: `${(currentWeek / 40) * 100}%` }}
            />
          </div>
          <span className="text-xs sm:text-sm font-medium">{Math.round((currentWeek / 40) * 100)}%</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Week</p>
                <p className="text-2xl font-bold">{currentWeek}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Trimester</p>
                <p className="text-2xl font-bold capitalize">
                  {pregnancyRecord?.trimester || 'N/A'}
                </p>
              </div>
              <Activity className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Appointments</p>
                <p className="text-2xl font-bold">{appointments?.length || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Due Date</p>
                <p className="text-sm font-bold">
                  {user?.dueDate ? new Date(user.dueDate).toLocaleDateString() : 'Not set'}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="health" className="space-y-4">
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <TabsList className="grid w-full min-w-[640px] md:min-w-0 grid-cols-8 gap-1">
            <TabsTrigger value="health" className="text-xs sm:text-sm px-2 sm:px-3">Health</TabsTrigger>
            <TabsTrigger value="symptoms" className="text-xs sm:text-sm px-2 sm:px-3">Symptoms</TabsTrigger>
            <TabsTrigger value="medications" className="text-xs sm:text-sm px-2 sm:px-3">Meds</TabsTrigger>
            <TabsTrigger value="appointments" className="text-xs sm:text-sm px-2 sm:px-3">Appts</TabsTrigger>
            <TabsTrigger value="stores" className="text-xs sm:text-sm px-2 sm:px-3">Stores</TabsTrigger>
            <TabsTrigger value="marketplace" className="text-xs sm:text-sm px-2 sm:px-3">Market</TabsTrigger>
            <TabsTrigger value="meal" className="text-xs sm:text-sm px-2 sm:px-3">Meals</TabsTrigger>
            <TabsTrigger value="ai" className="text-xs sm:text-sm px-2 sm:px-3">AI</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Metrics</CardTitle>
              <CardDescription>Track your pregnancy health indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600">Blood Pressure</p>
                  <p className="text-sm sm:text-lg font-semibold">
                    {pregnancyRecord?.healthMetrics?.bloodPressure?.systolic || '--'}/
                    {pregnancyRecord?.healthMetrics?.bloodPressure?.diastolic || '--'}
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600">Weight</p>
                  <p className="text-sm sm:text-lg font-semibold">
                    {pregnancyRecord?.healthMetrics?.weight || '--'} kg
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600">Blood Sugar</p>
                  <p className="text-sm sm:text-lg font-semibold">
                    {pregnancyRecord?.healthMetrics?.bloodSugar || '--'} mg/dL
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600">Heart Rate</p>
                  <p className="text-sm sm:text-lg font-semibold">
                    {pregnancyRecord?.healthMetrics?.heartRate || '--'} bpm
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => setShowHealthModal(true)}
                className="mt-4 bg-sky-500 hover:bg-sky-900"
              >
                Update Health Metrics
              </Button>
              
              <HealthMetricsModal 
                isOpen={showHealthModal}
                onClose={() => setShowHealthModal(false)}
                onSave={handleUpdateHealthMetrics}
                initialData={pregnancyRecord?.healthMetrics}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="symptoms">
          <SymptomsTracker symptoms={pregnancyRecord?.symptoms} />
        </TabsContent>

        <TabsContent value="medications">
          <MedicationsList medications={pregnancyRecord?.medications} />
        </TabsContent>

        <TabsContent value="appointments">
          <div className="space-y-4">
            <AppointmentCalendar
              appointments={appointments}
              onAppointmentClick={handleAppointmentEdit}
            />
            <EditAppointmentModal
              isOpen={showEditModal}
              onClose={() => {
                setShowEditModal(false);
                setSelectedAppointment(null);
              }}
              appointment={selectedAppointment}
              onSuccess={handleAppointmentUpdated}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled medical appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {appointments && appointments.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {appointments.slice(0, 5).map((apt) => (
                      <div key={apt._id} className="p-3 sm:p-4 border rounded-lg">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                          <div>
                            <p className="font-semibold capitalize text-sm sm:text-base">{apt.type}</p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {new Date(apt.appointmentDate).toLocaleDateString()} at {apt.appointmentTime}
                            </p>
                            {apt.medicalPersonnelId && (
                              <p className="text-xs sm:text-sm text-gray-600">
                                Dr. {apt.medicalPersonnelId.firstName} {apt.medicalPersonnelId.lastName}
                                {apt.medicalPersonnelId.specialization && ` - ${apt.medicalPersonnelId.specialization}`}
                              </p>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                            apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-4 text-sm sm:text-base">No upcoming appointments</p>
                )}
                <Button 
                  onClick={() => setShowAppointmentModal(true)}
                  className="mt-4 bg-sky-500 hover:bg-sky-900"
                >
                  Book New Appointment
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <BookAppointmentModal
          isOpen={showAppointmentModal}
          onClose={() => setShowAppointmentModal(false)}
          onSuccess={handleAppointmentBooked}
        />

        <TabsContent value="stores">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Find Nearby Stores</CardTitle>
                  <CardDescription>Discover pregnancy-safe grocery stores near you</CardDescription>
                </div>
                <Button onClick={getUserLocation} disabled={loadingLocation} className="bg-blue-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {loadingLocation ? 'Locating...' : 'Find Stores'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <NearbyStoresMap
                userLocation={userLocation}
                stores={nearbyStores || []}
                radius={10}
                height="450px"
              />
              {nearbyStores && nearbyStores.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {nearbyStores.slice(0, 6).map((store) => (
                    <div key={store._id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                      <h4 className="font-semibold text-sm">{store.storeName}</h4>
                      <p className="text-xs text-gray-600 mt-1">{store.distance?.toFixed(1)} km away</p>
                      <p className="text-xs text-gray-500 mt-1">{store.productCount} products</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace">
          <Tabs defaultValue="products" className="space-y-4">
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <TabsList className="grid w-full min-w-[320px] md:min-w-0 grid-cols-2">
                <TabsTrigger value="products">Browse Products</TabsTrigger>
                <TabsTrigger value="orders">My Orders & Delivery</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="products">
              <MarketplaceProducts />
            </TabsContent>
            
            <TabsContent value="orders">
              <OrderTracking />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="meal">
          <AIMealPlanner />
        </TabsContent>

        <TabsContent value="ai">
          <Chat roomId={`ai-${user?.id}`} isAI={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
