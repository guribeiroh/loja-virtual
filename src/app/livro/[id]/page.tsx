import { Book } from '@/types/Book';
import { books } from '@/data/books';
import BookDetailClient from './BookDetailClient';

export default function Page({ params }: { params: { id: string } }) {
  const bookId = params.id;
  // Aqui teríamos a lógica do servidor para buscar o livro 
  // Neste caso simulamos isso com dados estáticos
  const book = books.find(b => b.id === bookId) || null;

  return <BookDetailClient book={book} bookId={bookId} />;
} 