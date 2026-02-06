import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType, useCart } from '@/contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { book, quantity } = item;

  return (
    <div className="flex gap-4 border-b py-4 last:border-b-0">
      <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-muted">
          <span className="font-serif text-2xl text-muted-foreground/50">📚</span>
        </div>
      </div>
      
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-serif font-medium">{book.title}</h3>
          <p className="text-sm text-muted-foreground">{book.author}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(book._id, quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(book._id, quantity + 1)}
              disabled={quantity >= book.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <p className="font-semibold">₹{(book.price * quantity).toFixed(2)}</p>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => removeFromCart(book._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
