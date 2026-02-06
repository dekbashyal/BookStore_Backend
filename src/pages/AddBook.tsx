import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BookForm from '@/components/BookForm';
import { toast } from 'sonner';

const AddBook = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/');
      toast.error('Access denied. Admin only.');
    }
  }, [user, isAdmin]);

  return (
    <div className="container py-8 md:py-12">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Add New Book</CardTitle>
        </CardHeader>
        <CardContent>
          <BookForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBook;
