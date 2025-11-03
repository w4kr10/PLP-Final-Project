import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, Store, MapPin, Package, ShoppingCart, DollarSign, Phone, Mail } from 'lucide-react';

export default function StoresList({ stores = [], onStoreClick, showMetrics = true }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, revenue, products, orders

  // Filter stores by search term
  const filteredStores = stores.filter(store =>
    store.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.storeAddress?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort stores
  const sortedStores = [...filteredStores].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.storeName || '').localeCompare(b.storeName || '');
      case 'revenue':
        return (b.metrics?.revenue || 0) - (a.metrics?.revenue || 0);
      case 'products':
        return (b.metrics?.products || 0) - (a.metrics?.products || 0);
      case 'orders':
        return (b.metrics?.orders || 0) - (a.metrics?.orders || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-4">
      {/* Search and Sort Controls */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search stores by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {showMetrics && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-md bg-white"
          >
            <option value="name">Sort by Name</option>
            <option value="products">Sort by Products</option>
            <option value="orders">Sort by Orders</option>
          </select>
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {sortedStores.length} of {stores.length} stores
      </div>

      {/* Store Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedStores.map((store) => (
          <Card key={store._id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start flex-1">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <Store className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{store.storeName}</CardTitle>
                    <div className="flex items-start mt-1 text-xs text-gray-600">
                      <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{store.storeAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Metrics */}
              {showMetrics && store.metrics && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-blue-50 p-2 rounded text-center">
                    <Package className="h-4 w-4 mx-auto text-blue-600 mb-1" />
                    <div className="text-sm font-bold">{store.metrics.products || 0}</div>
                    <div className="text-xs text-gray-600">Products</div>
                  </div>
                  <div className="bg-purple-50 p-2 rounded text-center">
                    <ShoppingCart className="h-4 w-4 mx-auto text-purple-600 mb-1" />
                    <div className="text-sm font-bold">{store.metrics.orders || 0}</div>
                    <div className="text-xs text-gray-600">Orders</div>
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="space-y-1 text-xs">
                {store.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-3 w-3 mr-2" />
                    <span>{store.phone}</span>
                  </div>
                )}
                {store.email && (
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-3 w-3 mr-2" />
                    <span className="truncate">{store.email}</span>
                  </div>
                )}
              </div>

              {/* View Details Button */}
              {onStoreClick && (
                <Button
                  onClick={() => onStoreClick(store)}
                  className="w-full bg-blue-600 hover:bg-blue-900"
                  size="sm"
                  variant="outline"
                >
                  View Details
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No results */}
      {sortedStores.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Store className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-semibold mb-1">No stores found</p>
            {searchTerm && (
              <p className="text-sm text-gray-500">
                Try adjusting your search criteria
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
