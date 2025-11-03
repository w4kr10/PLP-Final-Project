import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Package, ShoppingCart, TrendingUp, DollarSign, MapPin } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { getGroceryDashboard, getInventory, getStoreOrders, getGroceryAnalytics } from '../../redux/slices/grocerySlice';
import Chat from '../../components/chat/Chat';
import InventoryTable from '../../components/grocery/InventoryTable';
import OrderManagement from '../../components/grocery/OrderManagement';
import AddProductDialog from '../../components/grocery/AddProductDialog';
import SimpleBarChart from '../../components/analytics/SimpleBarChart';
import SimpleLineChart from '../../components/analytics/SimpleLineChart';
import SingleStoreMap from '../../components/maps/SingleStoreMap';
import LocationEditor from '../../components/grocery/LocationEditor';

export default function GroceryDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { dashboard, inventory, storeOrders, analytics, loading } = useSelector((state) => state.grocery);
  const [showAddProduct, setShowAddProduct] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    dispatch(getGroceryDashboard());
    dispatch(getInventory());
    dispatch(getStoreOrders());
    dispatch(getGroceryAnalytics());
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-green-900">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-4 sm:p-6 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Grocery Store Dashboard</h1>
        <p className="text-base sm:text-lg text-white">Welcome {user?.storeName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{dashboard?.totalProducts || 0}</p>
              </div>
              <Package className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold">{dashboard?.pendingOrders || 0}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Orders</p>
                <p className="text-2xl font-bold">{dashboard?.todayOrders || 0}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold">${(analytics?.totalRevenue || 0).toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <TabsList className="grid w-full min-w-[480px] md:min-w-0 grid-cols-5">
            <TabsTrigger value="orders" className="text-xs sm:text-sm">Orders</TabsTrigger>
            <TabsTrigger value="inventory" className="text-xs sm:text-sm">Inventory</TabsTrigger>
            <TabsTrigger value="location" className="text-xs sm:text-sm">Location</TabsTrigger>
            <TabsTrigger value="ai" className="text-xs sm:text-sm">AI Insights</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="orders">
          <OrderManagement orders={storeOrders} onRefresh={loadDashboardData} />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryTable 
            inventory={inventory} 
            onAddClick={() => setShowAddProduct(true)}
            onRefresh={loadDashboardData}
          />
        </TabsContent>

        <TabsContent value="location">
          <LocationEditor />
          
          {user?.location?.coordinates && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Current Store Location</CardTitle>
                <CardDescription>Your store is visible to customers on the map</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SingleStoreMap
                  storeLocation={user?.location}
                  storeName={user?.storeName}
                  storeAddress={user?.storeAddress}
                  serviceRadius={10}
                  height="400px"
                  showServiceArea={true}
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-4">
                  <div className="p-2 sm:p-3 bg-green-50 rounded-lg text-center">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mx-auto text-green-600 mb-1" />
                    <div className="text-xs sm:text-sm font-semibold">10 km</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Service Radius</div>
                  </div>
                  <div className="p-2 sm:p-3 bg-blue-50 rounded-lg text-center">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 mx-auto text-blue-600 mb-1" />
                    <div className="text-xs sm:text-sm font-semibold">{dashboard?.totalProducts || 0}</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Products</div>
                  </div>
                  <div className="p-2 sm:p-3 bg-purple-50 rounded-lg text-center">
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mx-auto text-purple-600 mb-1" />
                    <div className="text-xs sm:text-sm font-semibold">{dashboard?.todayOrders || 0}</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">Today's Orders</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ai">
          <Chat 
            roomId={`ai-grocery-${user?.id}`}
            isAI={true}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Store Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600">Total Orders</div>
                    <div className="text-2xl font-bold text-blue-600">{analytics?.totalOrders || 0}</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600">Completed</div>
                    <div className="text-2xl font-bold text-green-600">{analytics?.completedOrders || 0}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {analytics?.topProducts && analytics.topProducts.length > 0 && (
              <SimpleBarChart
                data={analytics.topProducts.slice(0, 5).map(item => ({
                  name: item._id?.name || 'Unknown',
                  value: item.totalSold
                }))}
                title="Top Selling Products"
                dataKey="name"
                valueKey="value"
                color="#10b981"
              />
            )}

            {analytics?.ordersByMonth && analytics.ordersByMonth.length > 0 && (
              <div className="md:col-span-2">
                <SimpleLineChart
                  data={analytics.ordersByMonth.map(item => ({
                    month: `${item._id.month}/${item._id.year}`,
                    revenue: item.revenue
                  }))}
                  title="Revenue Trend (Last 6 Months)"
                  dataKey="month"
                  valueKey="revenue"
                  color="#3b82f6"
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AddProductDialog
        isOpen={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        onSuccess={loadDashboardData}
      />
    </div>
  );
}
