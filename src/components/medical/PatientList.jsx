import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Users, Search, Calendar, Heart, Edit, Eye } from 'lucide-react';

export default function PatientList({ patients, onPatientClick }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.firstName?.toLowerCase().includes(searchLower) ||
      patient.lastName?.toLowerCase().includes(searchLower) ||
      patient.email?.toLowerCase().includes(searchLower) ||
      patient.phone?.includes(searchTerm)
    );
  });

  const calculateWeeksPregnant = (dueDate) => {
    if (!dueDate) return 0;
    const due = new Date(dueDate);
    const today = new Date();
    const daysDiff = Math.floor((due - today) / (1000 * 60 * 60 * 24));
    return Math.max(1, 40 - Math.floor(daysDiff / 7));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTrimesterColor = (stage) => {
    const colors = {
      'first-trimester': 'bg-green-100 text-green-800',
      'second-trimester': 'bg-blue-100 text-blue-800',
      'third-trimester': 'bg-purple-100 text-purple-800',
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            My Patients ({filteredPatients.length})
          </CardTitle>
        </div>
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No patients found
            </div>
          ) : (
            filteredPatients.map((patient) => {
              const weeksPregnant = calculateWeeksPregnant(patient.dueDate);
              return (
                  <div
                    key={patient._id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {patient.profileImage ? (
                          <img
                            src={patient.profileImage}
                            alt={`${patient.firstName} ${patient.lastName}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-lg font-semibold text-primary-600">
                              {patient.firstName?.[0]}{patient.lastName?.[0]}
                            </span>
                          </div>
                        )}
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold text-lg">
                                {patient.firstName} {patient.lastName}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">{patient.email}</div>
                          <div className="text-sm text-gray-600">{patient.phone}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        {patient.pregnancyStage && (
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getTrimesterColor(patient.pregnancyStage)}`}>
                            {patient.pregnancyStage.replace('-', ' ')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <div>
                          <div className="text-xs text-gray-500">Pregnancy Week</div>
                          <div className="font-semibold">{weeksPregnant} weeks</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary-500" />
                        <div>
                          <div className="text-xs text-gray-500">Due Date</div>
                          <div className="font-semibold">{formatDate(patient.dueDate)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-900" onClick={() => onPatientClick(patient)}>
                        View Details
                      </Button>
                    </div>
                  </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
