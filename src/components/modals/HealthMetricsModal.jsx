import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../../hooks/use-toast';

export default function HealthMetricsModal({ isOpen, onClose, onSave, initialData = {} }) {
  const [formData, setFormData] = useState({
    bloodPressureSystolic: initialData?.bloodPressure?.systolic || '',
    bloodPressureDiastolic: initialData?.bloodPressure?.diastolic || '',
    weight: initialData?.weight || '',
    bloodSugar: initialData?.bloodSugar || '',
    heartRate: initialData?.heartRate || '',
    temperature: initialData?.temperature || '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.weight || !formData.bloodPressureSystolic || !formData.bloodPressureDiastolic) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in required fields (Weight, Blood Pressure)",
      });
      return;
    }

    setLoading(true);
    try {
      const metricsData = {
        healthMetrics: {
          weight: parseFloat(formData.weight),
          bloodPressure: {
            systolic: parseInt(formData.bloodPressureSystolic),
            diastolic: parseInt(formData.bloodPressureDiastolic),
          },
          bloodSugar: formData.bloodSugar ? parseInt(formData.bloodSugar) : null,
          heartRate: formData.heartRate ? parseInt(formData.heartRate) : null,
          temperature: formData.temperature ? parseFloat(formData.temperature) : null,
          lastUpdated: new Date().toISOString(),
        }
      };

      console.log('Modal: Saving metrics:', metricsData);
      await onSave(metricsData);
      
      onClose();
    } catch (error) {
      console.error('Modal save error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update health metrics",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Health Metrics</DialogTitle>
          <DialogDescription>
            Record your health measurements for this check-in
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Blood Pressure */}
          <div className="space-y-2">
            <Label htmlFor="bloodPressureSystolic">Blood Pressure (Systolic/Diastolic)*</Label>
            <div className="flex gap-2">
              <Input
                id="bloodPressureSystolic"
                name="bloodPressureSystolic"
                type="number"
                placeholder="Systolic (e.g., 120)"
                value={formData.bloodPressureSystolic}
                onChange={handleChange}
                required
              />
              <span className="flex items-center">/</span>
              <Input
                id="bloodPressureDiastolic"
                name="bloodPressureDiastolic"
                type="number"
                placeholder="Diastolic (e.g., 80)"
                value={formData.bloodPressureDiastolic}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)*</Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              step="0.1"
              placeholder="e.g., 75.5"
              value={formData.weight}
              onChange={handleChange}
              required
            />
          </div>

          {/* Blood Sugar */}
          <div className="space-y-2">
            <Label htmlFor="bloodSugar">Blood Sugar (mg/dL)</Label>
            <Input
              id="bloodSugar"
              name="bloodSugar"
              type="number"
              placeholder="e.g., 95"
              value={formData.bloodSugar}
              onChange={handleChange}
            />
          </div>

          {/* Heart Rate */}
          <div className="space-y-2">
            <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
            <Input
              id="heartRate"
              name="heartRate"
              type="number"
              placeholder="e.g., 72"
              value={formData.heartRate}
              onChange={handleChange}
            />
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature (°C)</Label>
            <Input
              id="temperature"
              name="temperature"
              type="number"
              step="0.1"
              placeholder="e.g., 37.0"
              value={formData.temperature}
              onChange={handleChange}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} className="bg-gray-100 hover:bg-rose-500">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-sky-500 hover:bg-sky-900">
              {loading ? 'Saving...' : 'Save Metrics'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
