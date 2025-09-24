'use client';
import { useState, useContext } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Eye, MoreHorizontal, Pencil, PlusCircle, Trash2, Search } from 'lucide-react';
import type { Customer } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CustomerForm } from './customer-form';
import { DataContext } from '@/context/data-context';
import { useTranslation } from '@/providers/translation-provider';

export default function CustomerTable() {
  const { customers: initialCustomers, setCustomers } = useContext(DataContext);
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsSheetOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsSheetOpen(true);
  };

  const confirmDeleteCustomer = (customer: Customer) => {
    setDeletingCustomer(customer);
  }

  const handleDeleteCustomer = () => {
    if (deletingCustomer) {
      setCustomers(initialCustomers.filter((c) => c.id !== deletingCustomer.id));
      setDeletingCustomer(null);
    }
  };
  
  const handleSaveCustomer = (customerData: Omit<Customer, 'id' | 'salesCount' | 'totalSpent'>) => {
    if(editingCustomer) {
        setCustomers(initialCustomers.map(c => c.id === editingCustomer.id ? { ...editingCustomer, ...customerData } : c));
    } else {
        const newCustomer: Customer = {
          ...customerData,
          id: `CUST${Date.now()}`,
          salesCount: 0,
          totalSpent: 0,
        }
        setCustomers([...initialCustomers, newCustomer]);
    }
    setIsSheetOpen(false);
  }

  const filteredCustomers = initialCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(filter.toLowerCase()) ||
      customer.nickname.toLowerCase().includes(filter.toLowerCase()) ||
      customer.phone.includes(filter)
  );

  return (
    <>
       <Card className="bg-white shadow-md rounded-xl">
        <CardHeader className="p-6">
          <CardTitle className="text-xl font-bold text-gray-800">{t('customers.title')}</CardTitle>
          <CardDescription className="text-base text-gray-600">
            {t('customers.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4 gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder={t('customers.filter_placeholder')}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="pl-9 w-full bg-white border border-gray-300 rounded-lg py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                </div>
                <Button onClick={handleAddCustomer} className="bg-blue-600 text-white font-medium rounded-md px-4 py-2 hover:bg-blue-700 transition shadow-sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('customers.add_customer')}
                </Button>
            </div>
            <div className="rounded-xl border overflow-hidden">
                <Table className="w-full border-collapse divide-y divide-gray-200">
                <TableHeader>
                    <TableRow className="bg-gray-100 hover:bg-gray-100">
                    <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">{t('customers.name')}</TableHead>
                    <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">{t('customers.nickname')}</TableHead>
                    <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">{t('customers.phone')}</TableHead>
                    <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">{t('customers.sales')}</TableHead>
                    <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">{t('customers.total_spent')}</TableHead>
                    <TableHead>
                        <span className="sr-only">{t('global.actions')}</span>
                    </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                    {filteredCustomers.map((customer, index) => (
                    <TableRow key={customer.id} className="transition hover:bg-gray-50">
                        <TableCell className="px-4 py-3 font-medium text-gray-800">{customer.name}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-700">{customer.nickname}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-700">{customer.phone}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-700">{customer.salesCount}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-800 font-medium">R$ {customer.totalSpent.toFixed(2)}</TableCell>
                        <TableCell className="px-4 py-3">
                         <div className="flex justify-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost" className="text-gray-500 hover:text-gray-700">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>{t('global.actions')}</DropdownMenuLabel>
                                <Link href={`/customers/${customer.id}`} passHref>
                                    <DropdownMenuItem>
                                        <Eye className="mr-2 h-4 w-4" /> {t('global.view_details')}
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem onSelect={() => handleEditCustomer(customer)}>
                                    <Pencil className="mr-2 h-4 w-4" /> {t('global.edit')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => confirmDeleteCustomer(customer)} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" /> {t('global.delete')}
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                    </TableRow>
                    ))}
                    {filteredCustomers.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-sm text-gray-500">
                                {t('customers.no_customers_found')}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
        </CardContent>
        <CardFooter className="p-6">
            <div className="text-sm text-gray-500">
                {t('customers.showing_customers', { count: filteredCustomers.length, total: initialCustomers.length })}
            </div>
        </CardFooter>
      </Card>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingCustomer ? t('customers.edit_customer') : t('customers.add_new_customer')}</SheetTitle>
          </SheetHeader>
          <CustomerForm
            customer={editingCustomer}
            onSave={handleSaveCustomer}
            onCancel={() => setIsSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>
      <AlertDialog open={!!deletingCustomer} onOpenChange={(open) => !open && setDeletingCustomer(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('customers.delete_dialog_title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('customers.delete_dialog_description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingCustomer(null)}>{t('global.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCustomer} className="bg-destructive hover:bg-destructive/90">{t('global.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
