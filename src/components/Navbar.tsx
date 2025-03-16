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
    <nav className="bg-orange-600 text-white p-4 sticky top-0 z-10 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <span className="text-xl font-bold">Livraria Virtual</span>
        </Link>
        
        <div className="hidden md:flex space-x-6">
          <Link href="/">
            <span className="hover:text-orange-200 transition-colors">Livros</span>
          </Link>
          <Link href="#">
            <span className="hover:text-orange-200 transition-colors">Sobre</span>
          </Link>
          <Link href="#">
            <span className="hover:text-orange-200 transition-colors">Contato</span>
          </Link>
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