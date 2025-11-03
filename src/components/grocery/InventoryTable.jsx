import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Package, Plus, Edit, Trash2, Search } from 'lucide-react';
import { updateInventoryItem, deleteInventoryItem } from '../../redux/slices/grocerySlice';
import { useToast } from '../../hooks/use-toast';

export default function InventoryTable({ inventory, onAddClick, onRefresh }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingItem, setEditingItem] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const categories = ['all', 'fruits', 'vegetables', 'dairy', 'protein', 'grains', 'supplements', 'snacks', 'beverages'];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (item) => {
    setEditingItem({ ...item });
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    try {
      await dispatch(updateInventoryItem({ id: editingItem._id, data: editingItem })).unwrap();
      toast({
        title: "Success",
        description: "Product updated successfully!",
      });
      setShowEditDialog(false);
      setEditingItem(null);
      onRefresh && onRefresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error || 'Failed to update product',
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await dispatch(deleteInventoryItem(id)).unwrap();
      toast({
        title: "Success",
        description: "Product deleted successfully!",
      });
      onRefresh && onRefresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error || 'Failed to delete product',
      });
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { color: 'text-red-600', text: 'Out of Stock' };
    if (quantity < 10) return { color: 'text-orange-600', text: 'Low Stock' };
    return { color: 'text-green-600', text: 'In Stock' };
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Inventory
            </CardTitle>
            <Button onClick={onAddClick} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3 text-left text-sm font-semibold">Product</th>
                  <th className="p-3 text-left text-sm font-semibold">Category</th>
                  <th className="p-3 text-left text-sm font-semibold">Price</th>
                  <th className="p-3 text-left text-sm font-semibold">Stock</th>
                  <th className="p-3 text-left text-sm font-semibold">Status</th>
                  <th className="p-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item) => {
                    const stockStatus = getStockStatus(item.quantity);
                    return (
                      <tr key={item._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            {item.images && item.images[0] && (
                              <img
                                src={item.images[0]}
                                alt={item.name}
                                className="w-12 h-12 rounded object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-500 truncate max-w-[200px]">
                                {item.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-3 font-semibold">
                          ${item.price} / {item.unit}
                        </td>
                        <td className="p-3">{item.quantity} {item.unit}s</td>
                        <td className="p-3">
                          <span className={`font-medium ${stockStatus.color}`}>
                            {stockStatus.text}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(item._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {showEditDialog && editingItem && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Product Name</Label>
                <Input
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={editingItem.category}
                  onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== 'all').map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={editingItem.quantity}
                  onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Unit</Label>
                <Select
                  value={editingItem.unit}
                  onValueChange={(value) => setEditingItem({ ...editingItem, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kg</SelectItem>
                    <SelectItem value="lb">Lb</SelectItem>
                    <SelectItem value="piece">Piece</SelectItem>
                    <SelectItem value="pack">Pack</SelectItem>
                    <SelectItem value="bottle">Bottle</SelectItem>
                    <SelectItem value="box">Box</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Description</Label>
                <Input
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
