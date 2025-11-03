import { useDispatch } from 'react-redux';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Shield, CheckCircle, XCircle, FileText } from 'lucide-react';
import { verifyUser } from '../../redux/slices/adminSlice';
import { useToast } from '../../hooks/use-toast';
import { useState } from 'react';

export default function VerificationManagement({ pendingVerifications, onRefresh }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [verifyingId, setVerifyingId] = useState(null);

  const handleVerify = async (userId, status) => {
    try {
      setVerifyingId(userId);
      await dispatch(verifyUser({ userId, status, feedback: '' })).unwrap();
      toast({
        title: "Success",
        description: `User ${status === 'approved' ? 'approved' : 'rejected'} successfully!`,
      });
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error || 'Failed to verify user',
      });
    } finally {
      setVerifyingId(null);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      medical: 'bg-blue-100 text-blue-800',
      grocery: 'bg-green-100 text-green-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Pending Verifications ({pendingVerifications.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingVerifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No pending verifications
            </div>
          ) : (
            pendingVerifications.map((user) => (
              <div key={user._id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 w-full">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg sm:text-xl font-semibold text-gray-600">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <h4 className="font-semibold text-base sm:text-lg truncate">
                          {user.firstName} {user.lastName}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded w-fit ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                        <div className="truncate">📧 {user.email}</div>
                        <div>📱 {user.phone}</div>
                        
                        {user.role === 'medical' && (
                          <>
                            <div className="break-words"><strong>License:</strong> {user.licenseNumber}</div>
                            <div className="break-words"><strong>Specialization:</strong> {user.specialization}</div>
                            {user.credentials && user.credentials.length > 0 && (
                              <div className="mt-2">
                                <strong>Credentials:</strong>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {user.credentials.map((url, idx) => (
                                    <a
                                      key={idx}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline flex items-center gap-1 text-xs sm:text-sm"
                                    >
                                      <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                                      Doc {idx + 1}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        
                        {user.role === 'grocery' && (
                          <>
                            <div className="break-words"><strong>Store:</strong> {user.storeName}</div>
                            <div className="break-words"><strong>Address:</strong> {user.storeAddress}</div>
                            {user.businessLicense && (
                              <div className="mt-2">
                                <a
                                  href={user.businessLicense}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline flex items-center gap-1 text-xs sm:text-sm"
                                >
                                  <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                                  Business License
                                </a>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button
                    onClick={() => handleVerify(user._id, 'approved')}
                    disabled={verifyingId === user._id}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {verifyingId === user._id ? 'Approving...' : 'Approve'}
                  </Button>
                  <Button
                    onClick={() => handleVerify(user._id, 'rejected')}
                    disabled={verifyingId === user._id}
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    {verifyingId === user._id ? 'Rejecting...' : 'Reject'}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
