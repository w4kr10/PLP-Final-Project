import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { ShoppingCart, Phone, MapPin, Clock } from 'lucide-react';
import { updateOrderStatus } from '../../redux/slices/grocerySlice';
import { useToast } from '../../hooks/use-toast';

export default function OrderManagement({ orders, onRefresh }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, status: newStatus })).unwrap();
      toast({
        title: "Success",
        description: "Order status updated successfully!",
      });
      onRefresh && onRefresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error || 'Failed to update order status',
      });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      preparing: 'bg-purple-100 text-purple-800 border-purple-300',
      'out-for-delivery': 'bg-orange-100 text-orange-800 border-orange-300',
      delivered: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'out-for-delivery',
      'out-for-delivery': 'delivered',
    };
    return statusFlow[currentStatus];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Orders Management
          </CardTitle>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No orders found
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-lg">Order #{order.trackingNumber}</span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
                        {order.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Placed on {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${order.totalAmount.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.paymentStatus}
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4 mb-3 p-3 bg-gray-50 rounded">
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 mt-1 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium">
                        {order.motherId?.firstName} {order.motherId?.lastName}
                      </div>
                      <div className="text-xs text-gray-600">{order.motherId?.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1 text-gray-600" />
                    <div className="text-sm">
                      {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-3">
                  <div className="text-sm font-semibold mb-2">Items ({order.items?.length})</div>
                  <div className="space-y-1">
                    {order.items?.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.groceryItemId?.name} x {item.quantity}</span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{order.items.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="flex items-center gap-2 mb-3 text-sm">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span>
                    Delivery: {formatDate(order.deliveryDate)} at {order.deliveryTime}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(order._id, getNextStatus(order.status))}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {getNextStatus(order.status) === 'confirmed' && 'Confirm Order'}
                        {getNextStatus(order.status) === 'preparing' && 'Start Preparing'}
                        {getNextStatus(order.status) === 'out-for-delivery' && 'Out for Delivery'}
                        {getNextStatus(order.status) === 'delivered' && 'Mark as Delivered'}
                      </Button>
                      {order.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                          className="text-red-600 hover:text-red-700"
                        >
                          Cancel Order
                        </Button>
                      )}
                    </>
                  )}
                </div>

                {order.deliveryNotes && (
                  <div className="mt-3 pt-3 border-t text-sm">
                    <span className="font-medium">Notes: </span>
                    <span className="text-gray-600">{order.deliveryNotes}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
