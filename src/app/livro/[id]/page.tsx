'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Book } from '@/types/Book';
import { books } from '@/data/books';
import Navbar from '@/components/Navbar';

interface CartItem extends Book {
  quantity: number;
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const bookId = params.id;
  const [book, setBook] = useState<Book | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar o livro com base no ID da URL
  useEffect(() => {
    setIsLoading(true);
    try {
      // Aqui no futuro podemos buscar do Supabase
      const foundBook = books.find(b => b.id === bookId);
      if (foundBook) {
        setBook(foundBook);
      } else {
        setError('Livro não encontrado');
      }
    } catch (err) {
      setError('Erro ao carregar informações do livro');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [bookId]);

  // Carregar o carrinho do localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Erro ao carregar o carrinho:', error);
      }
    }
  }, []);

  // Salvar o carrinho no localStorage quando for atualizado
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = () => {
    if (!book) return;
    
    setCartItems(prevItems => {
      // Verificar se o item já existe no carrinho
      const existingItem = prevItems.find(item => item.id === book.id);
      
      if (existingItem) {
        // Se o item já existe, aumentar a quantidade
        return prevItems.map(item =>
          item.id === book.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        // Se o item não existe, adicionar ao carrinho
        return [...prevItems, { ...book, quantity }];
      }
    });

    // Opcional: redirecionar para o carrinho ou mostrar mensagem de sucesso
    alert(`${quantity} unidade(s) de "${book.title}" adicionado(s) ao carrinho`);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar 
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
        />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <p className="text-xl">Carregando...</p>
        </main>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar 
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
        />
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <p className="text-xl text-red-500 mb-4">{error || 'Livro não encontrado'}</p>
          <Link href="/" className="bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors">
            Voltar para a loja
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-orange-600 hover:underline flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para a lista de livros
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Imagem do Livro */}
            <div className="flex justify-center items-start">
              <div className="relative h-80 md:h-96 w-full max-w-md bg-gray-200 rounded-lg overflow-hidden">
                {book.coverImage ? (
                  <Image
                    src={book.coverImage}
                    alt={`Capa do livro ${book.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-500">
                    Sem imagem disponível
                  </div>
                )}
              </div>
            </div>
            
            {/* Detalhes do Livro */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{book.title}</h1>
              <p className="text-gray-600 mb-1">Por <span className="font-semibold">{book.author}</span></p>
              <div className="mb-4">
                <span className="inline-block bg-orange-100 text-orange-800 text-sm px-2 py-1 rounded-full">
                  {book.category}
                </span>
              </div>
              
              <div className="text-2xl font-bold text-orange-600 mb-6">
                R$ {book.price.toFixed(2)}
              </div>
              
              <div className="mb-6">
                <h2 className="font-semibold text-lg mb-2">Descrição</h2>
                <p className="text-gray-700">{book.description}</p>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  {book.isbn && (
                    <div>
                      <span className="font-semibold block text-sm">ISBN:</span>
                      <span className="text-gray-700">{book.isbn}</span>
                    </div>
                  )}
                  {book.publishYear && (
                    <div>
                      <span className="font-semibold block text-sm">Ano de Publicação:</span>
                      <span className="text-gray-700">{book.publishYear}</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {book.language && (
                    <div>
                      <span className="font-semibold block text-sm">Idioma:</span>
                      <span className="text-gray-700">{book.language}</span>
                    </div>
                  )}
                  {book.pageCount && (
                    <div>
                      <span className="font-semibold block text-sm">Número de Páginas:</span>
                      <span className="text-gray-700">{book.pageCount}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Adicionar ao Carrinho */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="flex items-center justify-center w-12 text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-grow py-2 px-6 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Livraria Virtual. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
} 