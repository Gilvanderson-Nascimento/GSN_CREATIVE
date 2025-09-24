'use client';
import { useState, useContext } from 'react';
import Image from 'next/image';
import type { Product, SaleItem, Customer } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { X, Plus, Minus, Percent, ShoppingCart, UserPlus, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DataContext } from '@/context/data-context';
import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/providers/translation-provider';

export default function PosSystem() {
  const { products, customers, completeSale, settings } = useContext(DataContext);
  const { user } = useAuth();
  const { t } = useTranslation();
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
            title: t('sales.product_out_of_stock_title'),
            description: t('sales.product_out_of_stock_description'),
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
                  title: t('sales.product_out_of_stock_title'),
                  description: t('sales.product_out_of_stock_description'),
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
            title: t('sales.empty_cart_title'),
            description: t('sales.empty_cart_description'),
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
      title: t('sales.sale_success_title'),
      description: t('sales.sale_success_description', { total: total.toFixed(2) }),
      action: <div className="p-2 bg-green-500 rounded-full"><CheckCircle className="text-white"/></div>
    });

    setCart([]);
    setDiscount(0);
    setSelectedCustomer(undefined);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full md:h-[calc(100vh-10rem)]">
      <Card className="lg:col-span-3 flex flex-col h-full">
        <CardHeader className="p-4">
            <Input 
              placeholder={t('sales.search_placeholder')} 
              onChange={handleSearch}
            />
        </CardHeader>
        <CardContent className="flex-grow p-4">
          <ScrollArea className="h-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {searchedProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="cursor-pointer p-0 overflow-hidden flex flex-col items-center justify-between transition hover:shadow-lg hover:ring-2 hover:ring-primary" 
                  onClick={() => addToCart(product)}
                >
                  <div className="w-full h-24 bg-muted flex items-center justify-center">
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
                          <ImageIcon className="h-8 w-8 text-muted-foreground"/>
                      )}
                  </div>
                  <div className="p-2 text-center w-full">
                    <p className="font-semibold text-sm leading-tight line-clamp-2">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{t('stock.quantity')}: {product.quantity}</p>
                    <p className="text-primary font-bold text-base mt-2">R$ {product.salePrice.toFixed(2)}</p>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1 flex flex-col p-0">
        <CardHeader className="p-6">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            {t('sales.shopping_cart')}
          </CardTitle>
        </CardHeader>
        <div className="flex flex-col gap-4 p-6 pt-0 border-b">
            <div className="w-full">
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger>
                        <SelectValue placeholder={<div className="flex items-center gap-2"><UserPlus className="h-4 w-4"/>{t('sales.associate_customer')}</div>} />
                    </SelectTrigger>
                    <SelectContent>
                        {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="w-full flex items-center">
                <Input 
                    type="number" 
                    placeholder={t('sales.discount_percent')}
                    className="rounded-r-none" 
                    value={discount || ''}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                />
                <span className="p-2.5 inline-flex items-center justify-center rounded-r-md border border-l-0 bg-muted">
                    <Percent className="h-4 w-4 text-muted-foreground"/>
                </span>
            </div>

            <Separator className="my-2" />
            <div className="w-full space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                <span>{t('sales.subtotal')}</span>
                <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                <span>{t('sales.discount')}</span>
                <span>- R$ {(subtotal - total).toFixed(2)} ({discount}%)</span>
                </div>
                <div className="flex justify-between font-bold text-xl">
                <span>{t('sales.total')}</span>
                <span>R$ {total.toFixed(2)}</span>
                </div>
            </div>
            <Button size="lg" className="w-full" onClick={handleCompleteSale}>
                {t('sales.complete_sale')}
            </Button>
        </div>
        <CardContent className="flex-grow overflow-hidden p-6 pt-4">
             <ScrollArea className="h-full pr-4">
                {cart.length === 0 ? (
                    <div className="text-center text-muted-foreground italic h-full flex items-center justify-center">
                        {t('sales.empty_cart_message')}
                    </div>
                ) : (
                    <div className="space-y-2">
                    {cart.map((item) => (
                        <div key={item.productId} className="flex items-center text-sm">
                        <div className="flex-grow">
                            <p className="font-medium leading-tight line-clamp-2">{item.productName}</p>
                            <p className="text-xs text-muted-foreground">R$ {item.unitPrice.toFixed(2)} x {item.quantity}</p>
                        </div>
                        <div className="ml-4 flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => updateQuantity(item.productId, -1)}><Minus className="h-4 w-4"/></Button>
                            <span className="font-medium w-4 text-center">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => updateQuantity(item.productId, 1)}><Plus className="h-4 w-4"/></Button>
                            <div className="font-bold w-14 text-right">R$ {item.totalPrice.toFixed(2)}</div>
                        </div>
                        </div>
                    ))}
                    </div>
                )}
            </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
