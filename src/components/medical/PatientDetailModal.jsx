import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Card, CardContent } from '../ui/card';
import { Heart, Calendar, Pill, FileText, Plus } from 'lucide-react';
import { addPatientNotes, prescribeMedication } from '../../redux/slices/medicalSlice';
import { useToast } from '../../hooks/use-toast';

export default function PatientDetailModal({ isOpen, onClose, patientData }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [newNote, setNewNote] = useState('');
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [medicationForm, setMedicationForm] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
  });

  if (!patientData) return null;

  const { patient, pregnancyRecord, appointments } = patientData;

  // Guard against undefined patient data
  if (!patient) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8 text-gray-500">
            <p>Loading patient information...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const handleAddNote = async () => {
    if (!newNote.trim() || !patient?._id) return;

    try {
      await dispatch(addPatientNotes({ 
        patientId: patient._id, 
        content: newNote 
      })).unwrap();
      
      toast({
        title: "Success",
        description: "Note added successfully!",
      });
      setNewNote('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error || 'Failed to add note',
      });
    }
  };

  const handlePrescribeMedication = async (e) => {
    e.preventDefault();
    
    if (!patient?._id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Patient information is not available",
      });
      return;
    }
    
    try {
      const result = await dispatch(prescribeMedication({
        patientId: patient._id,
        medicationData: medicationForm,
      })).unwrap();
      
      console.log('Medication prescribed successfully:', result);
      
      toast({
        title: "Success",
        description: "Medication prescribed successfully!",
      });
      
      setMedicationForm({
        name: '',
        dosage: '',
        frequency: '',
        startDate: '',
        endDate: '',
      });
      setShowMedicationForm(false);
    } catch (error) {
      console.error('Failed to prescribe medication:', error);
      
      // Show error message
      toast({
        variant: "destructive",
        title: "Error",
        description: typeof error === 'string' ? error : (error?.message || 'Failed to prescribe medication'),
      });
    }
  };

  const calculateWeeksPregnant = () => {
    if (!patient?.dueDate) return 0;
    const dueDate = new Date(patient.dueDate);
    const today = new Date();
    const daysDiff = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
    return Math.max(1, 40 - Math.floor(daysDiff / 7));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {patient?.profileImage ? (
              <img
                src={patient.profileImage}
                alt={`${patient.firstName || ''} ${patient.lastName || ''}`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary-600">
                  {patient?.firstName?.[0] || ''}{patient?.lastName?.[0] || ''}
                </span>
              </div>
            )}
            <div>
              <div className="text-xl font-bold">
                {patient?.firstName || ''} {patient?.lastName || ''}
              </div>
              <div className="text-sm text-gray-500 font-normal">
                {patient?.email || 'N/A'} • {patient?.phone || 'N/A'}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-sm text-gray-600">Pregnancy Week</div>
                  <div className="text-2xl font-bold">{calculateWeeksPregnant()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary-500" />
                <div>
                  <div className="text-sm text-gray-600">Due Date</div>
                  <div className="text-lg font-bold">{formatDate(patient?.dueDate)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm text-gray-600">Trimester</div>
                  <div className="text-lg font-bold capitalize">
                    {pregnancyRecord?.trimester || 'N/A'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="health" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="health">Health Metrics</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          {/* Health Metrics Tab */}
          <TabsContent value="health" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-600 mb-1">Blood Pressure</div>
                  <div className="text-xl font-bold">
                    {pregnancyRecord?.healthMetrics?.bloodPressure?.systolic || '--'}/
                    {pregnancyRecord?.healthMetrics?.bloodPressure?.diastolic || '--'} mmHg
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-600 mb-1">Weight</div>
                  <div className="text-xl font-bold">
                    {pregnancyRecord?.healthMetrics?.weight || '--'} kg
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-600 mb-1">Blood Sugar</div>
                  <div className="text-xl font-bold">
                    {pregnancyRecord?.healthMetrics?.bloodSugar || '--'} mg/dL
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-600 mb-1">Heart Rate</div>
                  <div className="text-xl font-bold">
                    {pregnancyRecord?.healthMetrics?.heartRate || '--'} bpm
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Symptoms */}
            {pregnancyRecord?.symptoms && pregnancyRecord.symptoms.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Recent Symptoms</h4>
                <div className="space-y-2">
                  {pregnancyRecord.symptoms.slice(-5).reverse().map((symptom, idx) => (
                    <div key={idx} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium">{symptom.name}</span>
                          <span className={`ml-2 px-2 py-1 text-xs rounded ${
                            symptom.severity === 'severe' ? 'bg-red-100 text-red-800' :
                            symptom.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {symptom.severity}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(symptom.date)}
                        </span>
                      </div>
                      {symptom.notes && (
                        <div className="text-sm text-gray-600 mt-1">{symptom.notes}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Medications Tab */}
          <TabsContent value="medications" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Current Medications</h4>
              <Button
                size="sm"
                onClick={() => setShowMedicationForm(!showMedicationForm)}
                className="bg-blue-600 hover:bg-blue-900"
              >
                <Plus className="h-4 w-4 mr-2" />
                Prescribe Medication
              </Button>
            </div>

            {showMedicationForm && (
              <form onSubmit={handlePrescribeMedication} className="p-4 border rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Medication Name</Label>
                    <Input
                      value={medicationForm.name}
                      onChange={(e) => setMedicationForm({ ...medicationForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Dosage</Label>
                    <Input
                      value={medicationForm.dosage}
                      onChange={(e) => setMedicationForm({ ...medicationForm, dosage: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Frequency</Label>
                    <Input
                      value={medicationForm.frequency}
                      onChange={(e) => setMedicationForm({ ...medicationForm, frequency: e.target.value })}
                      placeholder="e.g., Twice daily"
                      required
                    />
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={medicationForm.startDate}
                      onChange={(e) => setMedicationForm({ ...medicationForm, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={medicationForm.endDate}
                      onChange={(e) => setMedicationForm({ ...medicationForm, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="bg-sky-600 hover:bg-blue-600">
                    Add Medication
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="bg-sky-600 hover:bg-rose-600"
                    variant="outline"
                    onClick={() => setShowMedicationForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {pregnancyRecord?.medications && pregnancyRecord.medications.length > 0 ? (
                pregnancyRecord.medications.map((med, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <Pill className="h-5 w-5 text-primary-600 mt-1" />
                        <div>
                          <div className="font-semibold">{med.name}</div>
                          <div className="text-sm text-gray-600">
                            {med.dosage} - {med.frequency}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatDate(med.startDate)} {med.endDate && `to ${formatDate(med.endDate)}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No medications prescribed
                </div>
              )}
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-2">
            {appointments && appointments.length > 0 ? (
              appointments.slice(0, 10).map((apt) => (
                <div key={apt._id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold capitalize">{apt.type}</div>
                      <div className="text-sm text-gray-600">
                        {formatDate(apt.appointmentDate)} at {apt.appointmentTime}
                      </div>
                      {apt.notes && (
                        <div className="text-sm text-gray-500 mt-1">{apt.notes}</div>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                      apt.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No appointments scheduled
              </div>
            )}
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-4">
            <div>
              <Label>Add Clinical Note</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter clinical notes..."
                />
                <Button onClick={handleAddNote} className="bg-sky-600 hover:bg-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {pregnancyRecord?.notes && pregnancyRecord.notes.length > 0 ? (
                pregnancyRecord.notes.slice().reverse().map((note, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <div className="flex items-start gap-2">
                      <FileText className="h-5 w-5 text-gray-600 mt-1" />
                      <div className="flex-1">
                        <div className="text-sm">{note.content}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(note.date)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No notes available
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
