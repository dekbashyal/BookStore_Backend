import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order, ordersApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { format } from 'date-fns';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      const response = await ordersApi.getAll();
      setOrders(response.orders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container py-16 text-center">
        <Package className="mx-auto h-16 w-16 text-muted-foreground/50" />
        <h1 className="mt-6 font-serif text-2xl font-semibold">No orders yet</h1>
        <p className="mt-2 text-muted-foreground">
          Your order history will appear here once you make a purchase.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="font-serif text-3xl font-bold md:text-4xl">My Orders</h1>
      <p className="mt-2 text-muted-foreground">{orders.length} order(s)</p>

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <Card key={order._id}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg font-medium">
                  Order #{order._id.slice(-8).toUpperCase()}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(order.createdAt), 'PPP')}
                </p>
              </div>
              <Badge variant="secondary">Completed</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {order.products.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.product?.title || 'Unknown Book'} × {item.quantity}
                    </span>
                    <span>${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between border-t pt-4 font-semibold">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
