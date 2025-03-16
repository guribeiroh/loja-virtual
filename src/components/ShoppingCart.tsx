import { Book } from '@/types/Book';
import { useState } from 'react';

interface CartItem extends Book {
  quantity: number;
}

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export default function ShoppingCart({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout 
}: ShoppingCartProps) {
  const [isOpen, setIsOpen] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <span>Carrinho ({totalItems})</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-72 md:w-96 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4 max-h-96 overflow-y-auto">
            <h3 className="font-bold text-lg mb-4 border-b pb-2">Seu Carrinho</h3>
            
            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Seu carrinho está vazio</p>
            ) : (
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item.id} className="flex gap-3 border-b pb-3">
                    <div className="bg-gray-100 h-16 w-12 flex-shrink-0 flex items-center justify-center text-xs text-gray-500">
                      {item.coverImage ? (
                        <img 
                          src={item.coverImage} 
                          alt={item.title} 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        'Sem imagem'
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium text-sm truncate" title={item.title}>{item.title}</h4>
                      <p className="text-xs text-gray-500">R$ {item.price.toFixed(2)}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="text-gray-500 hover:text-blue-600 bg-gray-100 h-5 w-5 flex items-center justify-center rounded"
                          >
                            -
                          </button>
                          <span className="text-sm w-5 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="text-gray-500 hover:text-blue-600 bg-gray-100 h-5 w-5 flex items-center justify-center rounded"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="p-4 bg-gray-50 rounded-b-lg">
            <div className="flex justify-between mb-4 font-bold">
              <span>Total:</span>
              <span>R$ {totalPrice.toFixed(2)}</span>
            </div>
            <button 
              onClick={onCheckout}
              disabled={items.length === 0}
              className={`w-full py-2 rounded-md text-white text-center transition-colors ${
                items.length > 0 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Finalizar Pedido
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 