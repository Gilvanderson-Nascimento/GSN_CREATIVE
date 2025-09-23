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

export function PosSystem() {
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">
      <Card className="lg:col-span-2 flex flex-col">
        <CardHeader>
            <Input placeholder="Buscar produto por nome ou código de barras..." onChange={handleSearch} />
        </CardHeader>
        <CardContent className="flex-grow">
          <ScrollArea className="h-full">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {searchedProducts.map((product) => (
                <Card key={product.id} className="cursor-pointer hover:shadow-lg transition-shadow flex flex-col" onClick={() => addToCart(product)}>
                  <CardContent className="p-1 flex flex-col items-center text-center flex-grow">
                    <div className="w-full aspect-square bg-muted rounded-md mb-1 flex items-center justify-center overflow-hidden">
                        {product.imageUrl ? (
                             <Image 
                                src={product.imageUrl} 
                                alt={product.name} 
                                width={100} 
                                height={100} 
                                className="object-cover h-full w-full"
                                data-ai-hint="product image"
                            />
                        ) : (
                            <ImageIcon className="h-8 w-8 text-muted-foreground"/>
                        )}
                    </div>
                    <div className="font-semibold text-xs leading-tight">{product.name}</div>
                    <div className="text-xs text-muted-foreground">Estoque: {product.quantity}</div>
                  </CardContent>
                  <div className="p-1 border-t font-bold text-xs text-center">
                    R$ {product.salePrice.toFixed(2)}
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Carrinho de Compras
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <ScrollArea className="h-full">
            {cart.length === 0 ? (
                <div className="text-center text-muted-foreground h-full flex items-center justify-center">
                    Seu carrinho está vazio.
                </div>
            ) : (
                <div className="space-y-4">
                {cart.map((item) => (
                    <div key={item.productId} className="flex items-center">
                    <div>
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-muted-foreground">R$ {item.unitPrice.toFixed(2)} x {item.quantity}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.productId, -1)}><Minus className="h-4 w-4"/></Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.productId, 1)}><Plus className="h-4 w-4"/></Button>
                        <div className="font-bold w-16 text-right">R$ {item.totalPrice.toFixed(2)}</div>
                    </div>
                    </div>
                ))}
                </div>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 !p-4 border-t">
          <div className="w-full">
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
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
                className="rounded-r-none" 
                value={discount || ''}
                onChange={(e) => setDiscount(Number(e.target.value))}
            />
            <span className="p-2.5 inline-flex items-center justify-center rounded-r-md border border-l-0 bg-secondary">
                <Percent className="h-4 w-4 text-muted-foreground"/>
            </span>
          </div>

          <Separator />
          <div className="w-full flex justify-between text-sm">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
           <div className="w-full flex justify-between text-sm text-muted-foreground">
            <span>Desconto</span>
            <span>- R$ {(subtotal - total).toFixed(2)} ({discount}%)</span>
          </div>
          <div className="w-full flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <Button size="lg" className="w-full" onClick={handleCompleteSale}>
            Finalizar Venda
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
