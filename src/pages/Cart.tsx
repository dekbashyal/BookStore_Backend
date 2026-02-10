import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { ordersApi } from '@/lib/api';
import CartItem from '@/components/CartItem';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Cart = () => {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }

    setIsCheckingOut(true);
    try {
      const orderProducts = items.map((item) => ({
        product: item.book._id,
        quantity: item.quantity,
      }));

      await ordersApi.create(orderProducts, totalAmount);
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/50" />
        <h1 className="mt-6 font-serif text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Looks like you haven't added any books yet.
        </p>
        <Link to="/books">
          <Button className="mt-6 gap-2">
            Browse Books <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="font-serif text-3xl font-bold md:text-4xl">Shopping Cart</h1>
      <p className="mt-2 text-muted-foreground">{items.length} item(s) in your cart</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card p-4 md:p-6">
            {items.map((item) => (
              <CartItem key={item.book._id} item={item} />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border bg-card p-4 md:p-6">
            <h2 className="font-serif text-xl font-semibold">Order Summary</h2>
            <Separator className="my-4" />
            
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.book._id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.book.title} × {item.quantity}
                  </span>
                  <span>${(item.book.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />
            
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            <Button
              className="mt-6 w-full"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? 'Processing...' : 'Checkout'}
            </Button>

            {!user && (
              <p className="mt-4 text-center text-sm text-muted-foreground">
                <Link to="/login" className="text-accent hover:underline">
                  Login
                </Link>{' '}
                to complete your purchase
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
