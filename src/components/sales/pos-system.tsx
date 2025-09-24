'use client';
import { useState, useContext } from 'react';
import Image from 'next/image';
import type { Product, SaleItem, Customer } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { X, Plus, Minus, Percent, ShoppingCart, UserPlus, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DataContext } from '@/context/data-context';
import { useAuth } from '@/hooks/use-auth';

export default function PosSystem() {
  const { products, customers, completeSale, settings } = useContext(DataContext);
  const { user } = useAuth();
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | undefined>(undefined);
  const [discount, setDiscount] = useState(0);
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const searchedProducts = searchQuery
    ? products.filter(
        (p) =>
          (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.barcode.includes(searchQuery)) && p.quantity > 0
      )
    : products.filter(p => p.quantity > 0);

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.productId === product.id);
    const productInStock = products.find(p => p.id === product.id);
    
    if (!productInStock || productInStock.quantity <= (existingItem?.quantity || 0)) {
        toast({
            variant: "destructive",
            title: "Produto Fora de Estoque",
            description: "Não há mais unidades disponíveis para este produto.",
        });
        return;
    }

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.unitPrice }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: product.salePrice,
          totalPrice: product.salePrice,
        },
      ]);
    }
  };
  
  const updateQuantity = (productId: string, amount: number) => {
      const existingItem = cart.find((item) => item.productId === productId);
      const productInStock = products.find(p => p.id === productId);

      if (amount > 0) {
          if (!productInStock || productInStock.quantity <= (existingItem?.quantity || 0)) {
              toast({
                  variant: "destructive",
                  title: "Produto Fora de Estoque",
                  description: "Não há mais unidades disponíveis para este produto.",
              });
              return;
          }
      }

      setCart(cart.map(item => {
          if (item.productId === productId) {
              const newQuantity = item.quantity + amount;
              return newQuantity > 0 ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.unitPrice } : null;
          }
          return item;
      }).filter((item): item is SaleItem => item !== null));
  }

  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const total = subtotal - (subtotal * (discount / 100));

  const handleCompleteSale = () => {
    if (cart.length === 0) {
        toast({
            variant: "destructive",
            title: "Carrinho Vazio",
            description: "Adicione produtos ao carrinho para completar a venda.",
        });
        return;
    }
   
    const salePayload = {
      items: cart,
      customerId: selectedCustomer,
      subtotal,
      discount,
      total,
      sellerId: settings.vendas.associar_vendedor && user ? user.id : undefined,
      sellerName: settings.vendas.associar_vendedor && user ? user.name : undefined,
    };

    completeSale(salePayload);
    
    toast({
      title: "Venda Realizada com Sucesso!",
      description: `Total: R$ ${total.toFixed(2)}`,
      action: <div className="p-2 bg-green-500 rounded-full"><CheckCircle className="text-white"/></div>
    });

    setCart([]);
    setDiscount(0);
    setSelectedCustomer(undefined);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full md:h-[calc(100vh-10rem)]">
      <Card className="lg:col-span-3 flex flex-col h-full bg-white shadow-md rounded-xl">
        <CardHeader className="p-4">
            <Input 
              placeholder="Buscar produto por nome ou código de barras..." 
              onChange={handleSearch} 
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
        </CardHeader>
        <CardContent className="flex-grow p-4">
          <ScrollArea className="h-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {searchedProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="cursor-pointer bg-white shadow-md rounded-xl p-0 overflow-hidden flex flex-col items-center justify-between transition hover:shadow-lg hover:ring-1 hover:ring-blue-500" 
                  onClick={() => addToCart(product)}
                >
                  <div className="w-full h-24 bg-gray-100 flex items-center justify-center">
                      {product.imageUrl ? (
                           <Image 
                              src={product.imageUrl} 
                              alt={product.name} 
                              width={150} 
                              height={150} 
                              className="w-full h-full object-cover"
                              data-ai-hint="product image"
                          />
                      ) : (
                          <ImageIcon className="h-8 w-8 text-gray-400"/>
                      )}
                  </div>
                  <div className="p-2 text-center w-full">
                    <p className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">{product.name}</p>
                    <p className="text-xs text-gray-500">Estoque: {product.quantity}</p>
                    <p className="text-blue-600 font-bold text-base mt-2">R$ {product.salePrice.toFixed(2)}</p>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1 flex flex-col bg-white shadow-md rounded-xl p-0">
        <CardHeader className="p-6">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Carrinho de Compras
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-6 pt-0">
             <ScrollArea className="h-full pr-4">
                {cart.length === 0 ? (
                    <div className="text-center text-gray-500 italic h-full flex items-center justify-center">
                        Seu carrinho está vazio.
                    </div>
                ) : (
                    <div className="space-y-2">
                    {cart.map((item) => (
                        <div key={item.productId} className="flex items-center text-sm">
                        <div className="flex-grow">
                            <p className="font-medium text-gray-800 leading-tight line-clamp-2">{item.productName}</p>
                            <p className="text-xs text-gray-500">R$ {item.unitPrice.toFixed(2)} x {item.quantity}</p>
                        </div>
                        <div className="ml-4 flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500" onClick={() => updateQuantity(item.productId, -1)}><Minus className="h-4 w-4"/></Button>
                            <span className="font-medium text-gray-800 w-4 text-center">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500" onClick={() => updateQuantity(item.productId, 1)}><Plus className="h-4 w-4"/></Button>
                            <div className="font-bold text-gray-800 w-14 text-right">R$ {item.totalPrice.toFixed(2)}</div>
                        </div>
                        </div>
                    ))}
                    </div>
                )}
            </ScrollArea>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 p-6 border-t border-gray-200 mt-auto">
          <div className="w-full">
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder={<div className="flex items-center gap-2"><UserPlus className="h-4 w-4"/>Associar Cliente</div>} />
                </SelectTrigger>
                <SelectContent>
                    {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
          <div className="w-full flex items-center">
            <Input 
                type="number" 
                placeholder="Desconto %" 
                className="rounded-r-none w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500" 
                value={discount || ''}
                onChange={(e) => setDiscount(Number(e.target.value))}
            />
            <span className="p-2.5 inline-flex items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50">
                <Percent className="h-4 w-4 text-gray-500"/>
            </span>
          </div>

          <Separator className="my-2 bg-gray-200" />
          <div className="w-full space-y-2 text-sm">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
             <div className="flex justify-between text-gray-700">
              <span>Desconto</span>
              <span>- R$ {(subtotal - total).toFixed(2)} ({discount}%)</span>
            </div>
            <div className="flex justify-between font-bold text-xl text-gray-900">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>
          <Button size="lg" className="w-full bg-blue-600 text-white font-medium rounded-md px-4 py-2 hover:bg-blue-700 transition" onClick={handleCompleteSale}>
            Finalizar Venda
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
