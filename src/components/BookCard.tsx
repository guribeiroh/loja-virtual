import Image from 'next/image';
import { Book } from '@/types/Book';

interface BookCardProps {
  book: Book;
  onAddToCart: (book: Book) => void;
}

export default function BookCard({ book, onAddToCart }: BookCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative h-64 w-full bg-gray-200">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt={`Capa do livro ${book.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-500">
            Sem imagem
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate" title={book.title}>{book.title}</h3>
        <p className="text-gray-600 text-sm mb-1">{book.author}</p>
        <p className="text-xs text-gray-500 mb-3">{book.category}</p>
        <p className="text-gray-600 text-sm mb-4 h-12 overflow-hidden">{book.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-blue-600">R$ {book.price.toFixed(2)}</span>
          <button 
            className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm"
            onClick={() => onAddToCart(book)}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
} 