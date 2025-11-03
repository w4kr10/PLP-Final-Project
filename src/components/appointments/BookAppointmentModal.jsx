import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar, Clock, User, FileText } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import api from '../../api/axiosConfig';

export default function BookAppointmentModal({ isOpen, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [fetchingPersonnel, setFetchingPersonnel] = useState(false);
  const [medicalPersonnel, setMedicalPersonnel] = useState([]);
  const [formData, setFormData] = useState({
    medicalPersonnelId: '',
    appointmentDate: '',
    appointmentTime: '',
    type: 'checkup',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchMedicalPersonnel();
    } else {
      // Reset form when modal closes
      setFormData({
        medicalPersonnelId: '',
        appointmentDate: '',
        appointmentTime: '',
        type: 'checkup',
        notes: ''
      });
    }
  }, [isOpen]);

  const fetchMedicalPersonnel = async () => {
    setFetchingPersonnel(true);
    try {
      const response = await api.get('/mother/medical-personnel');
      const personnel = response.data.data || [];
      setMedicalPersonnel(personnel);
      
      if (personnel.length === 0) {
        toast({
          variant: "warning",
          title: "No Providers Available",
          description: "There are currently no verified medical providers available. Please try again later."
        });
      }
    } catch (error) {
      console.error('Error fetching medical personnel:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to load medical personnel"
      });
    } finally {
      setFetchingPersonnel(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.medicalPersonnelId || !formData.appointmentDate || !formData.appointmentTime) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/mother/appointments', formData);
      
      toast({
        title: "Success",
        description: "Appointment booked successfully!"
      });

      if (onSuccess) onSuccess(response.data.data);
      handleClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to book appointment"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      medicalPersonnelId: '',
      appointmentDate: '',
      appointmentTime: '',
      type: 'checkup',
      notes: ''
    });
    onClose();
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            Schedule an appointment with your healthcare provider
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Medical Personnel Selection */}
          <div className="space-y-2">
            <Label htmlFor="medicalPersonnel">
              <User className="inline h-4 w-4 mr-2" />
              Select Medical Personnel *
            </Label>
            <Select
              value={formData.medicalPersonnelId}
              onValueChange={(value) => setFormData({ ...formData, medicalPersonnelId: value })}
              disabled={fetchingPersonnel}
            >
              <SelectTrigger id="medicalPersonnel" className="w-full">
                <SelectValue placeholder={
                  fetchingPersonnel ? "Loading providers..." : 
                  medicalPersonnel.length === 0 ? "No providers available" :
                  "Choose a healthcare provider..."
                } />
              </SelectTrigger>
              <SelectContent>
                {fetchingPersonnel ? (
                  <div className="p-2 text-center text-muted-foreground">Loading...</div>
                ) : medicalPersonnel.length === 0 ? (
                  <div className="p-2 text-center text-muted-foreground">No medical providers available</div>
                ) : (
                  medicalPersonnel.map((person) => (
                    <SelectItem key={person._id} value={person._id}>
                      Dr. {person.firstName} {person.lastName}
                      {person.specialization && ` - ${person.specialization}`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Appointment Type */}
          <div className="space-y-2">
            <Label htmlFor="type">
              <FileText className="inline h-4 w-4 mr-2" />
              Appointment Type *
            </Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="checkup">Regular Check-up</option>
              <option value="ultrasound">Ultrasound</option>
              <option value="consultation">Consultation</option>
              <option value="emergency">Emergency</option>
              <option value="followup">Follow-up</option>
            </select>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">
              <Calendar className="inline h-4 w-4 mr-2" />
              Appointment Date *
            </Label>
            <Input
              id="date"
              type="date"
              min={getMinDate()}
              value={formData.appointmentDate}
              onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
              required
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time">
              <Clock className="inline h-4 w-4 mr-2" />
              Appointment Time *
            </Label>
            <select
              id="time"
              value={formData.appointmentTime}
              onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select time...</option>
              <option value="08:00">08:00 AM</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">01:00 PM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
              <option value="17:00">05:00 PM</option>
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              rows="3"
              placeholder="Any specific concerns or information..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-sky-600 hover:bg-rose-400"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-sky-600 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
