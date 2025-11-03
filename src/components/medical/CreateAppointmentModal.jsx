import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar, Clock, User, FileText } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import api from '../../api/axiosConfig';

export default function CreateAppointmentModal({ isOpen, onClose, onSuccess, patients = [] }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    motherId: '',
    appointmentDate: '',
    appointmentTime: '',
    type: 'checkup',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.motherId || !formData.appointmentDate || !formData.appointmentTime) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/medical/appointments', formData);
      
      toast({
        title: "Success",
        description: "Appointment created successfully!"
      });

      if (onSuccess) onSuccess(response.data.data);
      handleClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to create appointment"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      motherId: '',
      appointmentDate: '',
      appointmentTime: '',
      type: 'checkup',
      notes: ''
    });
    onClose();
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Appointment</DialogTitle>
          <DialogDescription>
            Schedule an appointment with your patient
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Selection */}
          <div className="space-y-2">
            <Label htmlFor="patient">
              <User className="inline h-4 w-4 mr-2" />
              Select Patient *
            </Label>
            <select
              id="patient"
              value={formData.motherId}
              onChange={(e) => setFormData({ ...formData, motherId: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Choose a patient...</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.firstName} {patient.lastName}
                  {patient.dueDate && ` - Due: ${new Date(patient.dueDate).toLocaleDateString()}`}
                </option>
              ))}
            </select>
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
              placeholder="Reason for appointment or special instructions..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-blue-600 hover:bg-blue-900 text-white"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-900"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
