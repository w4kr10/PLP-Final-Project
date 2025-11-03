import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getOrders } from '../../redux/slices/grocerySlice';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Package, Truck, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function OrderTracking() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.grocery);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const activeOrders = Array.isArray(orders) ? orders.filter(order => !['delivered', 'cancelled'].includes(order.status)) : [];
  const completedOrders = Array.isArray(orders) ? orders.filter(order => order.status === 'delivered') : [];
  const cancelledOrders = Array.isArray(orders) ? orders.filter(order => order.status === 'cancelled') : [];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      preparing: 'bg-purple-100 text-purple-800 border-purple-300',
      'out-for-delivery': 'bg-indigo-100 text-indigo-800 border-indigo-300',
      delivered: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      confirmed: <Package className="h-4 w-4" />,
      preparing: <Package className="h-4 w-4" />,
      'out-for-delivery': <Truck className="h-4 w-4" />,
      delivered: <CheckCircle className="h-4 w-4" />,
      cancelled: <AlertCircle className="h-4 w-4" />
    };
    return icons[status];
  };

  const getProgressPercentage = (status) => {
    const statusOrder = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered'];
    const index = statusOrder.indexOf(status);
    return ((index + 1) / statusOrder.length) * 100;
  };

  const OrderCard = ({ order }) => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        {/* Order Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-semibold">{order.trackingNumber}</p>
          </div>
          <div className={`px-3 py-1 rounded-full border flex items-center gap-2 ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="capitalize text-sm font-medium">{order.status}</span>
          </div>
        </div>

        {/* Progress Bar */}
        {order.status !== 'cancelled' && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>Pending</span>
              <span>Confirmed</span>
              <span>Preparing</span>
              <span>Out for Delivery</span>
              <span>Delivered</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${getProgressPercentage(order.status)}%` }}
              />
            </div>
          </div>
        )}

        {/* Delivery Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Delivery Date</p>
            <p className="font-semibold">
              {new Date(order.deliveryDate).toLocaleDateString()}
            </p>
            {order.deliveryTime && (
              <p className="text-sm text-gray-600">{order.deliveryTime}</p>
            )}
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Delivery Address
            </p>
            <p className="font-semibold text-sm">
              {order.deliveryAddress?.street}
            </p>
            <p className="text-xs text-gray-600">
              {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zipCode}
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Total Amount</p>
            <p className="font-semibold text-lg text-green-600">
              ${order.totalAmount?.toFixed(2)}
            </p>
            <p className={`text-xs font-medium mt-1 ${
              order.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'
            }`}>
              {order.paymentStatus === 'paid' ? '✓ Paid' : 'Payment Pending'}
            </p>
          </div>
        </div>

        {/* Items List */}
        <div className="mb-4">
          <p className="font-semibold text-sm mb-2">Order Items</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {order.items?.map((item, index) => (
              <div key={index} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{item.groceryItemId?.name || 'Product'}</p>
                  <p className="text-xs text-gray-600">
                    {item.quantity} × {item.groceryItemId?.unit || 'unit'} @ ${item.price}
                  </p>
                </div>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Store Info */}
        {order.storeId && (
          <div className="p-3 bg-blue-50 rounded-lg mb-4">
            <p className="text-xs font-semibold text-blue-900 mb-1">Store</p>
            <p className="font-semibold text-sm">{order.storeId.storeName}</p>
            {order.storeId.phone && (
              <p className="text-sm text-blue-700">📞 {order.storeId.phone}</p>
            )}
          </div>
        )}

        {/* Timeline */}
        {(order.estimatedDeliveryTime || order.actualDeliveryTime) && (
          <div className="space-y-2 text-sm">
            {order.estimatedDeliveryTime && (
              <p className="text-gray-600">
                📅 Est. Delivery: {new Date(order.estimatedDeliveryTime).toLocaleString()}
              </p>
            )}
            {order.actualDeliveryTime && (
              <p className="text-green-600 font-semibold">
                ✓ Delivered: {new Date(order.actualDeliveryTime).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1 text-xs">
            View Details
          </Button>
          {order.status === 'delivered' && (
            <Button variant="outline" className="flex-1 text-xs">
              Leave Review
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Order Tracking</h1>
        <p className="text-lg opacity-90">Track your grocery deliveries in real-time</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active Orders ({activeOrders.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedOrders.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <p className="text-gray-500">Loading orders...</p>
            </div>
          ) : activeOrders.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No active orders</p>
                <p className="text-gray-400 text-sm">Your completed orders will appear here</p>
              </div>
            </div>
          ) : (
            <div>{activeOrders.map(order => <OrderCard key={order._id} order={order} />)}</div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedOrders.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No completed orders</p>
              </div>
            </div>
          ) : (
            <div>{completedOrders.map(order => <OrderCard key={order._id} order={order} />)}</div>
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {cancelledOrders.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No cancelled orders</p>
              </div>
            </div>
          ) : (
            <div>{cancelledOrders.map(order => <OrderCard key={order._id} order={order} />)}</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
