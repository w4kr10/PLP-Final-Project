import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Users, Search, Shield, ShieldAlert } from 'lucide-react';
import { updateUserStatus, deleteUser } from '../../redux/slices/adminSlice';
import { useToast } from '../../hooks/use-toast';

export default function UserManagement({ users, onRefresh }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await dispatch(updateUserStatus({ userId, isVerified: !currentStatus })).unwrap();
      toast({
        title: "Success",
        description: "User status updated successfully!",
      });
      onRefresh && onRefresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error || 'Failed to update user status',
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await dispatch(deleteUser(userId)).unwrap();
      toast({
        title: "Success",
        description: "User deleted successfully!",
      });
      onRefresh && onRefresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error || 'Failed to delete user',
      });
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      mother: 'bg-pink-100 text-pink-800',
      medical: 'bg-blue-100 text-blue-800',
      grocery: 'bg-green-100 text-green-800',
      admin: 'bg-purple-100 text-purple-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management ({filteredUsers.length})
          </CardTitle>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="mother">Mothers</SelectItem>
              <SelectItem value="medical">Medical</SelectItem>
              <SelectItem value="grocery">Grocery</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3 text-left text-sm font-semibold">User</th>
                <th className="p-3 text-left text-sm font-semibold">Role</th>
                <th className="p-3 text-left text-sm font-semibold">Contact</th>
                <th className="p-3 text-left text-sm font-semibold">Status</th>
                <th className="p-3 text-left text-sm font-semibold">Joined</th>
                <th className="p-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-semibold text-gray-600">
                              {user.firstName?.[0]}{user.lastName?.[0]}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3 text-sm">{user.phone}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {user.isVerified ? (
                          <Shield className="h-4 w-4 text-green-600" />
                        ) : (
                          <ShieldAlert className="h-4 w-4 text-yellow-600" />
                        )}
                        <span className={`text-sm ${user.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                          {user.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(user._id, user.isVerified)}
                        >
                          {user.isVerified ? 'Suspend' : 'Verify'}
                        </Button>
                        {user.role !== 'admin' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
