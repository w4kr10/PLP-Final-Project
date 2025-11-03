import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../../hooks/use-toast';
import api from '../../api/axiosConfig';

export default function CheckoutModal({ isOpen, onClose, cart, total }) {
  const { user } = useSelector((state) => state.user);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '');

  const handleCheckout = async () => {
    if (!phone.match(/^254[7-9][0-9]{8}$/)) {
      toast({
        variant: "destructive",
        title: "Invalid Phone Number",
        description: "Please enter a valid Safaricom number starting with 254"
      });
      return;
    }

    setLoading(true);
    try {
      // Create order first
      const orderResponse = await api.post('/mother/orders', {
        items: cart.map(item => ({
          itemId: item.id,
          quantity: item.quantity,
          storeId: item.storeId
        })),
        deliveryAddress: user.address,
        phone: phone
      });

      // Initiate payment
      const paymentResponse = await api.post('/payment/initiate', {
        phone: phone,
        amount: total,
        orderId: orderResponse.data.data._id
      });

      toast({
        title: "Payment Initiated",
        description: "Please check your phone for the STK push and complete the payment"
      });

      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Checkout Failed",
        description: error.response?.data?.message || "Failed to process checkout"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Purchase</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="phone">M-Pesa Phone Number (Format: 254XXXXXXXXX)</Label>
            <Input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="254712345678"
              required
            />
          </div>

          <div className="py-4 border-t">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Amount:</span>
              <span>KES {total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay with M-Pesa"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}