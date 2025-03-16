import Image from 'next/image';
import Link from 'next/link';
import { Book } from '@/types/Book';

interface BookCardProps {
  book: Book;
  onAddToCart: (book: Book) => void;
}

export default function BookCard({ book, onAddToCart }: BookCardProps) {
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Evitar que o clique no botão também navegue para a página de detalhes
    onAddToCart(book);
  };

  return (
    <Link href={`/livro/${book.id}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
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
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-lg mb-1 truncate" title={book.title}>{book.title}</h3>
          <p className="text-gray-600 text-sm mb-1">{book.author}</p>
          <p className="text-xs text-gray-500 mb-3">{book.category}</p>
          <p className="text-gray-600 text-sm mb-4 h-12 overflow-hidden flex-grow">{book.description}</p>
          <div className="flex justify-between items-center mt-auto">
            <span className="font-bold text-orange-600">R$ {book.price.toFixed(2)}</span>
            <button 
              className="bg-orange-600 text-white py-1 px-3 rounded-md hover:bg-orange-700 transition-colors text-sm"
              onClick={handleAddToCartClick}
              aria-label={`Adicionar ${book.title} ao carrinho`}
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
} 