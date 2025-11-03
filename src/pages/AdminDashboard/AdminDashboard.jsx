import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Users, Activity, ShoppingCart, TrendingUp, Store as StoreIcon } from 'lucide-react';
import { getAdminDashboard, getAllUsers, getPendingVerifications, getStores } from '../../redux/slices/adminSlice';
import UserManagement from '../../components/admin/UserManagement';
import VerificationManagement from '../../components/admin/VerificationManagement';
import StoreLocatorMap from '../../components/maps/StoreLocatorMap';
import StoresList from '../../components/stores/StoresList';
import StoreInfoCard from '../../components/stores/StoreInfoCard';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { dashboard, users, pendingVerifications, stores, loading } = useSelector((state) => state.admin);
  const [selectedStore, setSelectedStore] = useState(null);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    dispatch(getAdminDashboard());
    dispatch(getAllUsers({}));
    dispatch(getPendingVerifications());
    dispatch(getStores());
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-4 sm:p-6 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-base sm:text-lg opacity-90">Platform Overview & Management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{users?.length || 0}</p>
              </div>
              <Users className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Verifications</p>
                <p className="text-2xl font-bold">{pendingVerifications?.length || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Stores</p>
                <p className="text-2xl font-bold">{stores?.length || 0}</p>
              </div>
              <StoreIcon className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Medical Staff</p>
                <p className="text-2xl font-bold">{users?.filter(u => u.role === 'medical').length || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <TabsList className="grid w-full min-w-[480px] md:min-w-0 grid-cols-4">
            <TabsTrigger value="users" className="text-xs sm:text-sm">Users</TabsTrigger>
            <TabsTrigger value="stores" className="text-xs sm:text-sm">Stores</TabsTrigger>
            <TabsTrigger value="verifications" className="text-xs sm:text-sm">Verifications</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="users">
          <UserManagement users={users || []} onRefresh={loadDashboardData} />
        </TabsContent>

        <TabsContent value="stores">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Grocery Stores</CardTitle>
                  <CardDescription>View and manage all registered grocery stores</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'map' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('map')}
                  >
                    Map View
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    List View
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === 'map' ? (
                <StoreLocatorMap
                  stores={stores || []}
                  onStoreClick={setSelectedStore}
                  height="600px"
                />
              ) : (
                <StoresList
                  stores={stores || []}
                  onStoreClick={setSelectedStore}
                  showMetrics={true}
                />
              )}
            </CardContent>
          </Card>

          {selectedStore && (
            <div className="mt-4">
              <StoreInfoCard store={selectedStore} showMetrics={true} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="verifications">
          <VerificationManagement 
            pendingVerifications={pendingVerifications || []} 
            onRefresh={loadDashboardData} 
          />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>View platform performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-pink-50 rounded-lg">
                  <div className="text-xs sm:text-sm text-gray-600">Mothers</div>
                  <div className="text-xl sm:text-2xl font-bold text-pink-600">
                    {users?.filter(u => u.role === 'mother').length || 0}
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <div className="text-xs sm:text-sm text-gray-600">Medical Staff</div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    {users?.filter(u => u.role === 'medical').length || 0}
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
                  <div className="text-xs sm:text-sm text-gray-600">Grocery Stores</div>
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {users?.filter(u => u.role === 'grocery').length || 0}
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-purple-50 rounded-lg">
                  <div className="text-xs sm:text-sm text-gray-600">Verified Users</div>
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">
                    {users?.filter(u => u.isVerified).length || 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
