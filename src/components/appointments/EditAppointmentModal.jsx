import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar, Clock, User, FileText } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import api from '../../api/axiosConfig';

export default function EditAppointmentModal({ isOpen, onClose, appointment, onSuccess }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    type: '',
    notes: ''
  });

  useEffect(() => {
    if (appointment) {
      setFormData({
        appointmentDate: appointment.appointmentDate.split('T')[0],
        appointmentTime: appointment.appointmentTime,
        type: appointment.type,
        notes: appointment.notes || ''
      });
    }
  }, [appointment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.appointmentDate || !formData.appointmentTime) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.put(`/mother/appointments/${appointment._id}`, formData);
      
      toast({
        title: "Success",
        description: "Appointment updated successfully!"
      });

      if (onSuccess) onSuccess(response.data.data);
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to update appointment"
      });
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>
          <DialogDescription>
            Modify your appointment details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Appointment Type */}
          <div className="space-y-2">
            <Label htmlFor="type">
              <FileText className="inline h-4 w-4 mr-2" />
              Appointment Type *
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checkup">Regular Check-up</SelectItem>
                <SelectItem value="ultrasound">Ultrasound</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="followup">Follow-up</SelectItem>
              </SelectContent>
            </Select>
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
            <Select
              value={formData.appointmentTime}
              onValueChange={(value) => setFormData({ ...formData, appointmentTime: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="08:00">08:00 AM</SelectItem>
                <SelectItem value="09:00">09:00 AM</SelectItem>
                <SelectItem value="10:00">10:00 AM</SelectItem>
                <SelectItem value="11:00">11:00 AM</SelectItem>
                <SelectItem value="12:00">12:00 PM</SelectItem>
                <SelectItem value="13:00">01:00 PM</SelectItem>
                <SelectItem value="14:00">02:00 PM</SelectItem>
                <SelectItem value="15:00">03:00 PM</SelectItem>
                <SelectItem value="16:00">04:00 PM</SelectItem>
                <SelectItem value="17:00">05:00 PM</SelectItem>
              </SelectContent>
            </Select>
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
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-sky-600 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}