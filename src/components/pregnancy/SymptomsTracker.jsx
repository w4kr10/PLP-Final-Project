import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { AlertCircle, Plus, X } from 'lucide-react';
import { updatePregnancyRecord } from '../../redux/slices/pregnancySlice';
import { useToast } from '../../hooks/use-toast';

export default function SymptomsTracker({ symptoms = [] }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [newSymptom, setNewSymptom] = useState({
    name: '',
    severity: 'mild',
    notes: '',
  });

  const handleAddSymptom = async () => {
    if (!newSymptom.name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a symptom name",
      });
      return;
    }

    try {
      await dispatch(updatePregnancyRecord({
        symptoms: [{
          ...newSymptom,
          date: new Date(),
        }]
      })).unwrap();

      toast({
        title: "Success",
        description: "Symptom logged successfully!",
      });

      setNewSymptom({ name: '', severity: 'mild', notes: '' });
      setShowForm(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error || 'Failed to log symptom',
      });
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      mild: 'bg-green-100 text-green-800 border-green-300',
      moderate: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      severe: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[severity] || 'bg-sky-500 text-gray-100 border-gray-300';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Symptoms Tracker
          </CardTitle>
          <Button
            size="sm"
            onClick={() => setShowForm(!showForm)}
            className="bg-sky-600 hover:bg-blue-600"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4 mr-2" />}
            {showForm ? 'Cancel' : 'Log Symptom'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-4 p-4 border rounded-lg space-y-3">
            <div>
              <Label>Symptom</Label>
              <Input
                value={newSymptom.name}
                onChange={(e) => setNewSymptom({ ...newSymptom, name: e.target.value })}
                placeholder="e.g., Nausea, Headache, Fatigue"
              />
            </div>
            <div>
              <Label>Severity</Label>
              <Select
                value={newSymptom.severity}
                onValueChange={(value) => setNewSymptom({ ...newSymptom, severity: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes (Optional)</Label>
              <Input
                value={newSymptom.notes}
                onChange={(e) => setNewSymptom({ ...newSymptom, notes: e.target.value })}
                placeholder="Any additional details..."
              />
            </div>
            <Button onClick={handleAddSymptom} className="w-full bg-sky-600 hover:bg-blue-600">
              Add Symptom
            </Button>
          </div>
        )}

        <div className="space-y-2">
          {symptoms && symptoms.length > 0 ? (
            symptoms.slice().reverse().slice(0, 10).map((symptom, idx) => (
              <div key={idx} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{symptom.name}</div>
                    {symptom.notes && (
                      <div className="text-sm text-gray-600 mt-1">{symptom.notes}</div>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getSeverityColor(symptom.severity)}`}>
                    {symptom.severity}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {formatDate(symptom.date)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No symptoms logged yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
