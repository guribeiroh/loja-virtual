'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/types/Book';
import { books } from '@/data/books';
import BookCard from '@/components/BookCard';
import Navbar from '@/components/Navbar';
import CheckoutForm from '@/components/CheckoutForm';

interface CartItem extends Book {
  quantity: number;
}

export default function ProductsPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Obter categorias únicas dos livros
  const categories = Array.from(new Set(books.map(book => book.category)));

  // Filtrar livros com base na pesquisa e categoria
  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategory ? book.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (book: Book) => {
    setCartItems(prevItems => {
      // Verificar se o item já existe no carrinho
      const existingItem = prevItems.find(item => item.id === book.id);
      
      if (existingItem) {
        // Se o item já existe, aumentar a quantidade
        return prevItems.map(item =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Se o item não existe, adicionar ao carrinho
        return [...prevItems, { ...book, quantity: 1 }];
      }
    });
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
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    setCartItems([]);
    setIsCheckoutOpen(false);
    setShowSuccessMessage(true);
    
    // Esconder a mensagem de sucesso após 5 segundos
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };
  
  // Armazenar o carrinho no localStorage
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
  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Nossa Coleção de Livros</h1>
        
        {showSuccessMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md text-center">
            Pedido enviado com sucesso! Em breve você receberá um e-mail com os detalhes.
          </div>
        )}
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Pesquisar por título ou autor..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={selectedCategory || ''}
                onChange={e => setSelectedCategory(e.target.value || null)}
                className="w-full md:w-auto p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Todas Categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          {filteredBooks.length === 0 && (
            <p className="text-center text-gray-500 my-12">Nenhum livro encontrado com os filtros selecionados.</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map(book => (
            <BookCard 
              key={book.id} 
              book={book} 
              onAddToCart={handleAddToCart} 
            />
          ))}
        </div>
      </main>
      
      {isCheckoutOpen && (
        <CheckoutForm 
          cartItems={cartItems} 
          onClose={() => setIsCheckoutOpen(false)} 
          onCheckoutSuccess={handleCheckoutSuccess} 
        />
      )}
      
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Livraria Virtual. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
} 