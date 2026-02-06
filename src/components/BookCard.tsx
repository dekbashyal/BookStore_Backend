import { Link } from 'react-router-dom';
import { Book } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (book.stock > 0) {
      addToCart(book, 1);
      toast.success(`Added "${book.title}" to cart`);
    }
  };

  return (
    <Link to={`/books/${book._id}`}>
      <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-4">
          <div className="mb-4 aspect-[3/4] overflow-hidden rounded-md bg-muted">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-muted">
              <span className="font-serif text-4xl text-muted-foreground/50">📚</span>
            </div>
          </div>
          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs">
              {book.category}
            </Badge>
            <h3 className="line-clamp-2 font-serif text-lg font-medium leading-tight group-hover:text-accent transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground">{book.author}</p>
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">₹{book.price.toFixed(2)}</p>
              <span className={`text-xs ${book.stock > 0 ? 'text-success' : 'text-destructive'}`}>
                {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            variant="secondary"
            className="w-full gap-2"
            onClick={handleAddToCart}
            disabled={book.stock === 0}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BookCard;
