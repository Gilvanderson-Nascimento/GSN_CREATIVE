'use client';
import { useState } from 'react';
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
import { Eye, MoreHorizontal, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import type { Customer } from '@/lib/types';

type CustomerTableProps = {
  initialCustomers: Customer[];
};

export function CustomerTable({ initialCustomers }: CustomerTableProps) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [filter, setFilter] = useState('');

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(filter.toLowerCase()) ||
      customer.nickname.toLowerCase().includes(filter.toLowerCase()) ||
      customer.phone.includes(filter)
  );

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Filtrar clientes..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Cliente
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Apelido</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Vendas</TableHead>
              <TableHead>Total Gasto</TableHead>
              <TableHead>
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.nickname}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.salesCount}</TableCell>
                <TableCell>R$ {customer.totalSpent.toFixed(2)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <Link href={`/customers/${customer.id}`} passHref>
                        <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" /> Editar
                      </DropdownMenuItem>
                       <DropdownMenuItem className="text-destructive">
                         <Trash2 className="mr-2 h-4 w-4" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
