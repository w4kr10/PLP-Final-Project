import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Store, MapPin, Phone, Mail, Package, ShoppingCart, DollarSign, Calendar } from 'lucide-react';

export default function StoreInfoCard({ store, showMetrics = true }) {
  if (!store) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Store className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No store selected</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start">
          <div className="bg-green-100 p-3 rounded-lg mr-4">
            <Store className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl">{store.storeName}</CardTitle>
            <CardDescription className="mt-1 flex items-start">
              <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
              {store.storeAddress}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Metrics Grid */}
        {showMetrics && store.metrics && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Package className="h-6 w-6 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-900">{store.metrics.products || 0}</div>
              <div className="text-sm text-gray-600 mt-1">Total Products</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <ShoppingCart className="h-6 w-6 mx-auto text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-purple-900">{store.metrics.orders || 0}</div>
              <div className="text-sm text-gray-600 mt-1">Total Orders</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <DollarSign className="h-6 w-6 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-900">${(store.metrics.revenue || 0).toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">Total Revenue</div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">Contact Information</h4>
          <div className="space-y-2">
            {store.phone && (
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 text-gray-500 mr-3" />
                <span>{store.phone}</span>
              </div>
            )}
            {store.email && (
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 text-gray-500 mr-3" />
                <span>{store.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Store Details */}
        {store.createdAt && (
          <div className="border-t pt-4">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Joined {new Date(store.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        )}

        {/* Distance (if available) */}
        {store.distance !== undefined && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Distance from you</span>
              <span className="font-semibold text-blue-700">{store.distance.toFixed(2)} km</span>
            </div>
            {store.estimatedDeliveryTime && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-700">Estimated delivery</span>
                <span className="text-sm text-gray-900">{store.estimatedDeliveryTime}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
