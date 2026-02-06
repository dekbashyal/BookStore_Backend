import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book, productsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Minus, Plus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadBook();
  }, [id]);

  const loadBook = async () => {
    try {
      const response = await productsApi.getById(id!);
      setBook(response.data);
    } catch (error) {
      toast.error('Book not found');
      navigate('/books');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (book && book.stock > 0) {
      addToCart(book, quantity);
      toast.success(`Added ${quantity} × "${book.title}" to cart`);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse">
          <div className="h-6 w-24 rounded bg-muted mb-8" />
          <div className="grid gap-8 md:grid-cols-2">
            <div className="aspect-[3/4] rounded-lg bg-muted" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
              <div className="h-24 rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="container py-8 md:py-12">
      <Button
        variant="ghost"
        className="mb-8 gap-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        {/* Book Image */}
        <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted">
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-muted">
            <span className="font-serif text-8xl text-muted-foreground/30">📚</span>
          </div>
        </div>

        {/* Book Details */}
        <div className="flex flex-col">
          <Badge variant="secondary" className="mb-4 w-fit">
            {book.category}
          </Badge>
          <h1 className="font-serif text-3xl font-bold md:text-4xl">{book.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">by {book.author}</p>
          
          <p className="mt-6 text-3xl font-bold">₹{book.price.toFixed(2)}</p>
          
          <div className="mt-4">
            <span className={`text-sm font-medium ${book.stock > 0 ? 'text-success' : 'text-destructive'}`}>
              {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <p className="mt-6 leading-relaxed text-muted-foreground">
            {book.description}
          </p>

          {book.stock > 0 && (
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.min(book.stock, q + 1))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button className="gap-2 flex-1 sm:flex-initial" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
