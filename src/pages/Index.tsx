import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, productsApi } from '@/lib/api';
import BookCard from '@/components/BookCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowRight } from 'lucide-react';

const Index = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await productsApi.getAll();
      setBooks(response.data);
      console.log(response)
    } catch (error) {
      console.error('Failed to load books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredBooks = filteredBooks.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-secondary/50 to-background py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Discover Your Next
              <span className="block text-accent">Favorite Book</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Browse our curated collection of books across all genres. From timeless classics to modern bestsellers.
            </p>
            <div className="relative mx-auto max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by title, author, or category..."
                className="h-12 pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold md:text-3xl">
              {searchQuery ? 'Search Results' : 'Featured Books'}
            </h2>
            <Link to="/books">
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] rounded-lg bg-muted" />
                  <div className="mt-4 h-4 w-3/4 rounded bg-muted" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : featuredBooks.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
              {featuredBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery ? 'No books found matching your search.' : 'No books available yet.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      {!searchQuery && (
        <section className="border-t bg-secondary/30 py-12 md:py-16">
          <div className="container">
            <h2 className="mb-8 font-serif text-2xl font-semibold md:text-3xl">Browse by Category</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {['Fiction', 'Non-Fiction', 'Science', 'History'].map((category) => (
                <Link
                  key={category}
                  to={`/books?category=${category}`}
                  className="group rounded-lg border bg-background p-6 text-center transition-all hover:border-accent hover:shadow-md"
                >
                  <span className="font-serif text-lg font-medium group-hover:text-accent transition-colors">
                    {category}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
