import Link from 'next/link';
import { Book } from '@/types/Book';
import ShoppingCart from './ShoppingCart';

interface CartItem extends Book {
  quantity: number;
}

interface NavbarProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export default function Navbar({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout }: NavbarProps) {
  return (
    <nav className="bg-blue-600 text-white p-4 sticky top-0 z-10 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Livraria Virtual</Link>
        
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-blue-200 transition-colors">Início</Link>
          <Link href="/produtos" className="hover:text-blue-200 transition-colors">Livros</Link>
          <Link href="#" className="hover:text-blue-200 transition-colors">Sobre</Link>
          <Link href="#" className="hover:text-blue-200 transition-colors">Contato</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <ShoppingCart 
            items={cartItems} 
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
            onCheckout={onCheckout}
          />
        </div>
      </div>
    </nav>
  );
} 