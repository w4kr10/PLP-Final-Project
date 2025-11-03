import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Pill, Calendar, User } from 'lucide-react';

export default function MedicationsList({ medications = [] }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isActiveMedication = (med) => {
    if (!med.endDate) return true;
    return new Date(med.endDate) >= new Date();
  };

  const activeMedications = medications.filter(isActiveMedication);
  const pastMedications = medications.filter(med => !isActiveMedication(med));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5" />
          My Medications
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeMedications.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-sm text-gray-700 mb-3">Current Medications</h4>
            <div className="space-y-3">
              {activeMedications.map((med, idx) => (
                <div key={idx} className="p-4 border border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
                        <Pill className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{med.name}</div>
                        <div className="text-sm text-gray-700 mt-1">
                          <span className="font-medium">Dosage:</span> {med.dosage}
                        </div>
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">Frequency:</span> {med.frequency}
                        </div>
                        {med.prescribedBy && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
                            <User className="h-3 w-3" />
                            <span>
                              Prescribed by Dr. {med.prescribedBy.firstName} {med.prescribedBy.lastName}
                              {med.prescribedBy.specialization && ` (${med.prescribedBy.specialization})`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-green-200 text-sm">
                    <div className="flex items-center gap-1 text-gray-700">
                      <Calendar className="h-4 w-4" />
                      <span>Started: {formatDate(med.startDate)}</span>
                    </div>
                    {med.endDate && (
                      <div className="flex items-center gap-1 text-gray-700">
                        <Calendar className="h-4 w-4" />
                        <span>Ends: {formatDate(med.endDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pastMedications.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-3">Past Medications</h4>
            <div className="space-y-2">
              {pastMedications.map((med, idx) => (
                <div key={idx} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold">{med.name}</div>
                      <div className="text-sm text-gray-600">
                        {med.dosage} - {med.frequency}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(med.startDate)} to {formatDate(med.endDate)}
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {medications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No medications prescribed yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}
