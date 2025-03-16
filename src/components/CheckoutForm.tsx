import { Book } from '@/types/Book';
import { FormEvent, useState } from 'react';

interface CartItem extends Book {
  quantity: number;
}

interface CheckoutFormProps {
  cartItems: CartItem[];
  onClose: () => void;
  onCheckoutSuccess: () => void;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function CheckoutForm({ cartItems, onClose, onCheckoutSuccess }: CheckoutFormProps) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Preparar os dados para enviar ao webhook
      const orderData = {
        customer: customerInfo,
        items: cartItems.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        totalPrice,
        orderDate: new Date().toISOString(),
      };
      
      // URL do webhook a ser substituída pelo real
      const webhookUrl = 'https://webhook.site/af25d820-e37b-4e7a-9e6b-951208a9ffa8';
      
      // Enviar dados para o webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao enviar o pedido: ${response.statusText}`);
      }
      
      // Limpar o carrinho e exibir mensagem de sucesso
      onCheckoutSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao processar seu pedido');
      console.error('Erro no checkout:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Finalizar Pedido</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5">
          <h3 className="font-bold mb-3">Suas Informações</h3>
          
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo*</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={customerInfo.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail*</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={customerInfo.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone*</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={customerInfo.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo*</label>
            <textarea
              id="address"
              name="address"
              required
              value={customerInfo.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-5">
            <h3 className="font-bold mb-3">Resumo do Pedido</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <ul className="mb-3">
                {cartItems.map(item => (
                  <li key={item.id} className="flex justify-between py-1 text-sm">
                    <span>{item.title} x{item.quantity}</span>
                    <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t pt-2 font-bold flex justify-between">
                <span>Total:</span>
                <span>R$ {totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isSubmitting ? 'Enviando...' : 'Confirmar Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 