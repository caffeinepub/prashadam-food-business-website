import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageCircle, Copy, CheckCircle2, ExternalLink, MapPin, Truck, Info } from 'lucide-react';
import { useActor } from '@/hooks/useActor';
import type { MenuItem, OrderType } from '@/backend';

type CartItem = {
  name: string;
  price: number;
  quantity: number;
};

interface UPICheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  total: number;
  upiId: string;
  whatsappNumber: string;
  onPaymentSuccess: () => void;
}

export function UPICheckoutDialog({
  open,
  onClose,
  cart,
  total,
  upiId,
  whatsappNumber,
  onPaymentSuccess,
}: UPICheckoutDialogProps) {
  const [copied, setCopied] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [address, setAddress] = useState('');
  const [deliveryDistance, setDeliveryDistance] = useState('');
  const [addressError, setAddressError] = useState('');
  const [distanceError, setDistanceError] = useState('');
  const { actor } = useActor();

  // Calculate delivery charge based on order total and distance
  const calculateDeliveryCharge = (orderTotal: number, distanceKm: number): number => {
    if (orderTotal >= 600) {
      // Free delivery for first 3km, then ₹70/km
      if (distanceKm <= 3) {
        return 0;
      } else {
        return (distanceKm - 3) * 70;
      }
    } else {
      // ₹70/km for orders under ₹600
      return distanceKm * 70;
    }
  };

  const distanceKm = parseFloat(deliveryDistance) || 0;
  const deliveryCharge = calculateDeliveryCharge(total, distanceKm);
  const finalTotal = total + deliveryCharge;

  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy UPI ID:', err);
    }
  };

  const validateInputs = (): boolean => {
    let isValid = true;

    // Validate address
    if (!address.trim()) {
      setAddressError('Delivery address is required');
      isValid = false;
    } else if (address.trim().length < 10) {
      setAddressError('Please enter a complete delivery address');
      isValid = false;
    } else {
      setAddressError('');
    }

    // Validate distance
    if (!deliveryDistance.trim()) {
      setDistanceError('Delivery distance is required');
      isValid = false;
    } else if (distanceKm <= 0 || distanceKm > 50) {
      setDistanceError('Distance must be between 1 and 50 km');
      isValid = false;
    } else {
      setDistanceError('');
    }

    return isValid;
  };

  const handlePayViaUPI = () => {
    if (!validateInputs()) {
      return;
    }

    // Generate UPI payment intent URL with final total including delivery
    const upiUrl = `upi://pay?pa=${upiId}&pn=Prashadam Food&am=${finalTotal.toFixed(2)}&cu=INR&tn=Order Payment`;
    
    // Try to open UPI app
    window.location.href = upiUrl;
    
    // Store order in backend with delivery information
    if (actor) {
      const menuItems: MenuItem[] = cart.map(item => ({
        name: item.name,
        description: '',
        price: item.price,
        category: 'Order',
        isJain: true,
        isVaishnav: true,
      }));

      const orderType: OrderType = { __kind__: 'cart', cart: { items: menuItems } };

      actor.placeOrder(
        orderType,
        total,
        address.trim(),
        distanceKm
      ).catch(err => console.error('Failed to store order:', err));
    }
  };

  const handleConfirmPayment = () => {
    if (!validateInputs()) {
      return;
    }

    setPaymentConfirmed(true);
    
    // Send order details via WhatsApp with delivery information
    let message = 'Hello! I have completed the UPI payment for my order:\n\n';
    message += `💳 Payment Amount: ₹${finalTotal.toFixed(0)}\n`;
    message += `📍 UPI ID: ${upiId}\n\n`;
    
    message += '📦 Order Details:\n';
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      message += `${item.quantity}x ${item.name} - ₹${item.price.toFixed(0)} = ₹${itemTotal.toFixed(0)}\n`;
    });
    
    message += `\nSubtotal: ₹${total.toFixed(0)}\n`;
    
    // Add delivery information
    message += `\n🚚 Delivery Information:\n`;
    message += `Distance: ${distanceKm.toFixed(1)} km\n`;
    message += `Delivery Charge: ₹${deliveryCharge.toFixed(0)}\n`;
    if (total >= 600 && distanceKm <= 3) {
      message += `(Free delivery for orders ₹600+ up to 3km)\n`;
    } else if (total >= 600) {
      message += `(Free for first 3km, ₹70/km after)\n`;
    } else {
      message += `(₹70/km for orders under ₹600)\n`;
    }
    
    message += `\n📍 Delivery Address:\n${address.trim()}\n`;
    
    message += `\n💰 Total Paid: ₹${finalTotal.toFixed(0)}\n\n`;
    message += 'Please confirm my order. Thank you!';
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Call success callback after a short delay
    setTimeout(() => {
      onPaymentSuccess();
      setPaymentConfirmed(false);
      setAddress('');
      setDeliveryDistance('');
      setAddressError('');
      setDistanceError('');
    }, 1000);
  };

  const handleClose = () => {
    setAddress('');
    setDeliveryDistance('');
    setAddressError('');
    setDistanceError('');
    setCopied(false);
    setPaymentConfirmed(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Checkout - UPI Payment</DialogTitle>
          <DialogDescription>
            Enter delivery details and complete your payment using UPI
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Delivery Information */}
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Delivery Information</h3>
              </div>

              {/* Address Input */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Delivery Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="address"
                  placeholder="Enter your complete delivery address"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (addressError) setAddressError('');
                  }}
                  className={addressError ? 'border-destructive' : ''}
                />
                {addressError && (
                  <p className="text-sm text-destructive">{addressError}</p>
                )}
              </div>

              {/* Distance Input */}
              <div className="space-y-2">
                <Label htmlFor="distance" className="text-sm font-medium">
                  Approximate Distance (km) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="distance"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="50"
                  placeholder="e.g., 5.5"
                  value={deliveryDistance}
                  onChange={(e) => {
                    setDeliveryDistance(e.target.value);
                    if (distanceError) setDistanceError('');
                  }}
                  className={distanceError ? 'border-destructive' : ''}
                />
                {distanceError && (
                  <p className="text-sm text-destructive">{distanceError}</p>
                )}
              </div>

              {/* Delivery Terms */}
              <Alert className="bg-primary/5 border-primary/20">
                <Info className="h-4 w-4 text-primary" />
                <AlertDescription className="text-xs">
                  <strong>Delivery Terms:</strong> Free delivery for orders ₹600+ (first 3km). 
                  ₹70/km after 3km or for orders under ₹600.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.name} className="flex justify-between items-center text-sm">
                    <div className="flex-1">
                      <span className="font-medium">{item.quantity}x {item.name}</span>
                      <span className="text-muted-foreground ml-2">@ ₹{item.price.toFixed(0)}</span>
                    </div>
                    <span className="font-semibold">₹{(item.price * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              
              {/* Subtotal */}
              <div className="flex justify-between items-center text-sm mb-2">
                <span>Subtotal:</span>
                <span className="font-semibold">₹{total.toFixed(0)}</span>
              </div>

              {/* Delivery Charge */}
              {deliveryDistance && distanceKm > 0 && (
                <div className="flex justify-between items-center text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-primary" />
                    <span>Delivery Charge ({distanceKm.toFixed(1)} km):</span>
                  </div>
                  <span className="font-semibold text-primary">
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(0)}`}
                  </span>
                </div>
              )}

              {/* Delivery explanation */}
              {deliveryDistance && distanceKm > 0 && (
                <p className="text-xs text-muted-foreground mb-3">
                  {total >= 600 && distanceKm <= 3 && '✓ Free delivery (order ₹600+, within 3km)'}
                  {total >= 600 && distanceKm > 3 && `✓ Free for first 3km, ₹70/km after (${(distanceKm - 3).toFixed(1)}km × ₹70)`}
                  {total < 600 && `₹70/km for orders under ₹600 (${distanceKm.toFixed(1)}km × ₹70)`}
                </p>
              )}

              <Separator className="my-4" />

              {/* Final Total */}
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-primary">₹{finalTotal.toFixed(0)}</span>
              </div>
            </CardContent>
          </Card>

          {/* UPI Payment Section */}
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4">UPI Payment Details</h3>
              
              {/* UPI ID */}
              <div className="mb-6">
                <label className="text-sm text-muted-foreground mb-2 block">UPI ID</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-lg font-semibold">
                    {upiId}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyUPI}
                    className="h-12 w-12"
                  >
                    {copied ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>

              {/* QR Code */}
              <div className="mb-6">
                <label className="text-sm text-muted-foreground mb-2 block">Scan QR Code to Pay</label>
                <div className="flex justify-center p-4 bg-white rounded-lg border-2 border-dashed border-primary/30">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiId}&pn=Prashadam Food&am=${finalTotal.toFixed(2)}&cu=INR`}
                    alt="UPI QR Code"
                    className="w-48 h-48"
                  />
                </div>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Scan this QR code with any UPI app to pay ₹{finalTotal.toFixed(0)}
                </p>
              </div>

              {/* Pay via UPI Button */}
              <Button
                onClick={handlePayViaUPI}
                className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 text-white font-semibold"
                size="lg"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Pay ₹{finalTotal.toFixed(0)} via UPI
              </Button>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3">Payment Instructions:</h4>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-semibold text-primary">1.</span>
                  <span>Enter your complete delivery address and approximate distance</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-primary">2.</span>
                  <span>Scan the QR code or click "Pay via UPI" to open your UPI app</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-primary">3.</span>
                  <span>Complete the payment of ₹{finalTotal.toFixed(0)} (including delivery) to {upiId}</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-primary">4.</span>
                  <span>After successful payment, click "Confirm Payment" below</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-primary">5.</span>
                  <span>Your order details with delivery address will be sent to us via WhatsApp automatically</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Confirm Payment Button */}
          <div className="space-y-3">
            <Button
              onClick={handleConfirmPayment}
              disabled={paymentConfirmed}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {paymentConfirmed ? 'Sending Order...' : 'Confirm Payment & Send Order'}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              By confirming, you agree that you have completed the UPI payment and your order with delivery details will be sent via WhatsApp
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
