import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getGroceryItems, addToCart, removeFromCart, updateCartQuantity } from '../../redux/slices/grocerySlice';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ShoppingCart, Heart, Star, Filter, Search } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

export default function MarketplaceProducts() {
  const dispatch = useDispatch();
  const { items, cart, loading } = useSelector((state) => state.grocery);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const categories = ['fruits', 'vegetables', 'dairy', 'protein', 'grains', 'supplements', 'snacks', 'beverages'];

  useEffect(() => {
    dispatch(getGroceryItems());
  }, [dispatch]);

  useEffect(() => {
    let filtered = Array.isArray(items) ? items : [];
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    setFilteredItems(filtered);
  }, [items, searchTerm, selectedCategory]);

  const toggleWishlist = (itemId) => {
    setWishlist(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      images: item.images,
      unit: item.unit,
      storeId: item.storeId._id
    }));
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`
    });
  };

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateCartQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Healthy Grocery Marketplace</h1>
        <p className="text-lg">Fresh, organic products delivered to your doorstep</p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Categories
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  variant={selectedCategory === '' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('')}
                  className="text-xs bg-green-300 hover:bg-green-400"
                >
                  All
                </Button>
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(cat)}
                    className="text-xs capitalize bg-green-300 hover:bg-green-400"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid and Cart */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Products */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <p className="text-gray-500">No products found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <Card key={item._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-4">
                    {/* Product Image */}
                    <div className="relative mb-4 h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400">No image</div>
                      )}
                      <button
                        onClick={() => toggleWishlist(item._id)}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            wishlist.includes(item._id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Product Info */}
                    <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>

                    {/* Tags and Info */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.isOrganic && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Organic</span>
                      )}
                      {item.isPregnancySafe && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Safe for Pregnancy</span>
                      )}
                    </div>

                    {/* Price and Unit */}
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-2xl font-bold text-green-600">${item.price}</p>
                        <p className="text-xs text-gray-500">per {item.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Stock: {item.quantity}</p>
                      </div>
                    </div>

                    {/* Rating */}
                    {item.rating && (
                      <div className="flex items-center gap-1 mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < Math.round(item.rating) ? 'fill-yellow-400' : ''}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">({item.ratingCount || 0})</span>
                      </div>
                    )}

                    {/* Store Info */}
                    <p className="text-xs text-gray-500 mb-4">Store: {item.storeId?.storeName}</p>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.quantity === 0}
                      className="w-full bg-green-500 hover:bg-green-600"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Shopping Cart Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cart ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm">{item.name}</h4>
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">${item.price} × {item.unit}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="px-2 py-1 bg-gray-200 hover:bg-red-700 rounded text-sm"
                          >
                            −
                          </button>
                          <span className="flex-1 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="px-2 py-1 bg-gray-200 hover:bg-emerald-700 rounded text-sm"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm font-semibold mt-2">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Cart Summary */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Delivery:</span>
                      <span>$5.00</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>${(cartTotal + 5).toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-green-500 hover:bg-green-600 mt-4"
                    disabled={cart.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
