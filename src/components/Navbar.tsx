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
        <a href="/">
          <span className="text-xl font-bold">Livraria Virtual</span>
        </a>
        
        <div className="hidden md:flex space-x-6">
          <a href="/" className="hover:text-orange-200 transition-colors">
            <span>Livros</span>
          </a>
          <a href="#" className="hover:text-orange-200 transition-colors">
            <span>Sobre</span>
          </a>
          <a href="#" className="hover:text-orange-200 transition-colors">
            <span>Contato</span>
          </a>
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