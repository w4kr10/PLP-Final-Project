import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Upload } from 'lucide-react';
import { addInventoryItem } from '../../redux/slices/grocerySlice';
import { useToast } from '../../hooks/use-toast';
import api from '../../api/axiosConfig';

export default function AddProductDialog({ isOpen, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'fruits',
    price: '',
    unit: 'kg',
    quantity: '',
    isOrganic: false,
    isPregnancySafe: true,
    allergens: '',
    pregnancyBenefits: '',
    images: [],
  });

  const categories = ['fruits', 'vegetables', 'dairy', 'protein', 'grains', 'supplements', 'snacks', 'beverages'];
  const units = ['kg', 'lb', 'piece', 'pack', 'bottle', 'box'];

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploadingImage(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        return response.data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));

      toast({
        title: "Success",
        description: "Images uploaded successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload images",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        allergens: formData.allergens ? formData.allergens.split(',').map(a => a.trim()) : [],
        pregnancyBenefits: formData.pregnancyBenefits ? formData.pregnancyBenefits.split(',').map(b => b.trim()) : [],
      };

      await dispatch(addInventoryItem(productData)).unwrap();
      
      toast({
        title: "Success",
        description: "Product added successfully!",
      });
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: 'fruits',
        price: '',
        unit: 'kg',
        quantity: '',
        isOrganic: false,
        isPregnancySafe: true,
        allergens: '',
        pregnancyBenefits: '',
        images: [],
      });
      
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error || 'Failed to add product',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="col-span-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
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

            {/* Unit */}
            <div>
              <Label htmlFor="unit">Unit *</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map(unit => (
                    <SelectItem key={unit} value={unit}>
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            {/* Quantity */}
            <div>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>

            {/* Allergens */}
            <div className="col-span-2">
              <Label htmlFor="allergens">Allergens (comma-separated)</Label>
              <Input
                id="allergens"
                value={formData.allergens}
                onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                placeholder="e.g., nuts, dairy, soy"
              />
            </div>

            {/* Pregnancy Benefits */}
            <div className="col-span-2">
              <Label htmlFor="pregnancyBenefits">Pregnancy Benefits (comma-separated)</Label>
              <Input
                id="pregnancyBenefits"
                value={formData.pregnancyBenefits}
                onChange={(e) => setFormData({ ...formData, pregnancyBenefits: e.target.value })}
                placeholder="e.g., rich in iron, folic acid, calcium"
              />
            </div>

            {/* Checkboxes */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isOrganic"
                  checked={formData.isOrganic}
                  onCheckedChange={(checked) => setFormData({ ...formData, isOrganic: checked })}
                />
                <Label htmlFor="isOrganic" className="cursor-pointer">
                  Organic Product
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPregnancySafe"
                  checked={formData.isPregnancySafe}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPregnancySafe: checked })}
                />
                <Label htmlFor="isPregnancySafe" className="cursor-pointer">
                  Pregnancy Safe
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Add Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
