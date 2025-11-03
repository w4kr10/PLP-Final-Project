import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Users, Calendar, Activity, TrendingUp, Plus } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { getMedicalDashboard, getPatients, getMedicalAppointments, getPatientDetails } from '../../redux/slices/medicalSlice';
import Chat from '../../components/chat/Chat';
import PatientList from '../../components/medical/PatientList';
import PatientDetailModal from '../../components/medical/PatientDetailModal';
import AppointmentCalendar from '../../components/appointments/AppointmentCalendar';
import CreateAppointmentModal from '../../components/medical/CreateAppointmentModal';
import { useToast } from '../../hooks/use-toast';

export default function MedicalDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { dashboard, patients, appointments, selectedPatient, loading } = useSelector((state) => state.medical);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showCreateAppointment, setShowCreateAppointment] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    dispatch(getMedicalDashboard());
    dispatch(getPatients());
    dispatch(getMedicalAppointments({}));
  };

  const handlePatientClick = async (patient) => {
    await dispatch(getPatientDetails(patient._id));
    setShowPatientModal(true);
  };

  const handleAppointmentClick = (appointment) => {
    // Could open appointment details modal
    console.log('Appointment clicked:', appointment);
  };

  return (
    <div className="space-y-6 bg-sky-200 p-4 md:p-6 text-black">
      <div className="rounded-lg p-4 sm:p-6 text-blue-900">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Medical Dashboard</h1>
        <p className="text-base sm:text-lg opacity-90">Dr. {user?.firstName} {user?.lastName} - {user?.specialization}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 bg-sky-200">
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Patients</p>
                <p className="text-xl sm:text-2xl font-bold">{dashboard?.totalPatients || 0}</p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Today's Appointments</p>
                <p className="text-xl sm:text-2xl font-bold">{dashboard?.todayAppointments?.length || 0}</p>
              </div>
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Upcoming</p>
                <p className="text-xl sm:text-2xl font-bold">{dashboard?.upcomingAppointments?.length || 0}</p>
              </div>
              <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">This Month</p>
                <p className="text-xl sm:text-2xl font-bold">{appointments?.length || 0}</p>
              </div>
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="appointments" className="space-y-4">
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <TabsList className="grid w-full min-w-[480px] md:min-w-0 grid-cols-4">
            <TabsTrigger value="appointments" className="text-xs sm:text-sm">Appointments</TabsTrigger>
            <TabsTrigger value="patients" className="text-xs sm:text-sm">Patients</TabsTrigger>
            <TabsTrigger value="ai" className="text-xs sm:text-sm">AI Assistant</TabsTrigger>
            <TabsTrigger value="calendar" className="text-xs sm:text-sm">Calendar</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
              <CardDescription>Manage your patient appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboard?.todayAppointments && dashboard.todayAppointments.length > 0 ? (
                <div className="space-y-3">
                  {dashboard.todayAppointments.map((apt) => (
                    <div key={apt._id} className="p-3 sm:p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                        <div className="flex items-start gap-2 sm:gap-3 flex-1">
                          {apt.motherId?.profileImage ? (
                            <img
                              src={apt.motherId.profileImage}
                              alt={`${apt.motherId.firstName} ${apt.motherId.lastName}`}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-base sm:text-lg font-semibold text-primary-600">
                                {apt.motherId?.firstName?.[0]}{apt.motherId?.lastName?.[0]}
                              </span>
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-sm sm:text-base truncate">
                              {apt.motherId?.firstName} {apt.motherId?.lastName}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">
                              {apt.appointmentTime} - {apt.type}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 truncate">
                              {apt.motherId?.phone}
                            </div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                          apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                      {apt.notes && (
                        <div className="mt-2 text-xs sm:text-sm text-gray-600 pl-0 sm:pl-15">
                          <strong>Notes:</strong> {apt.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8 text-sm sm:text-base">No appointments scheduled for today</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients">
          <PatientList patients={patients} onPatientClick={handlePatientClick} />
        </TabsContent>

        <TabsContent value="ai">
          <Chat 
            roomId={`ai-medical-${user?.id}`}
            isAI={true}
          />
        </TabsContent>

        <TabsContent value="calendar">
          <AppointmentCalendar 
            appointments={appointments}
            onAppointmentClick={handleAppointmentClick}
          />
        </TabsContent>
      </Tabs>

      <PatientDetailModal
        isOpen={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        patientData={selectedPatient}
      />
    </div>
  );
}
