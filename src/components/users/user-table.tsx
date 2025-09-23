'use client';
import { useState } from 'react';
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

import { MoreHorizontal, Pencil, PlusCircle, Trash2, Search } from 'lucide-react';
import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { UserForm } from './user-form';
import { Badge } from '@/components/ui/badge';

type UserTableProps = {
  initialUsers: User[];
  setUsers: (users: User[]) => void;
};

export function UserTable({ initialUsers, setUsers }: UserTableProps) {
  const [filter, setFilter] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsSheetOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsSheetOpen(true);
  };

  const confirmDeleteUser = (user: User) => {
    setDeletingUser(user);
  }

  const handleDeleteUser = () => {
    if (deletingUser) {
        // Prevent deleting the master admin user
      if (deletingUser.username === 'GSN_CREATIVE') {
        // Here you can show a toast or alert
        console.error("Cannot delete the master admin account.");
        setDeletingUser(null);
        return;
      }
      setUsers(initialUsers.filter((c) => c.id !== deletingUser.id));
      setDeletingUser(null);
    }
  };
  
  const handleSaveUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    if(editingUser) {
        // Update existing user, keeping original password if not changed
        setUsers(initialUsers.map(u => u.id === editingUser.id ? { ...editingUser, ...userData, password: userData.password || editingUser.password } : u));
    } else {
        const newUser: User = {
          ...userData,
          id: `USER${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        setUsers([...initialUsers, newUser]);
    }
    setIsSheetOpen(false);
  }

  const filteredUsers = initialUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(filter.toLowerCase()) ||
      user.username.toLowerCase().includes(filter.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <>
       <Card>
        <CardHeader>
          <CardTitle>Usuários do Sistema</CardTitle>
          <CardDescription>
            Adicione, edite e gerencie os usuários que podem acessar o sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between mb-4 gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Filtrar por nome, usuário ou e-mail..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Button onClick={handleAddUser}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Usuário
                </Button>
            </div>
            <div className="rounded-md border">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Nome Completo</TableHead>
                    <TableHead>Nome de Usuário</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>
                        <span className="sr-only">Ações</span>
                    </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell><Badge variant="secondary">{user.role}</Badge></TableCell>
                        <TableCell>{user.email || 'N/A'}</TableCell>
                        <TableCell>
                         <div className="flex justify-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost" disabled={user.username === 'GSN_CREATIVE'}>
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem onSelect={() => handleEditUser(user)}>
                                    <Pencil className="mr-2 h-4 w-4" /> Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => confirmDeleteUser(user)} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                    </TableRow>
                    ))}
                    {filteredUsers.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                Nenhum usuário encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
        </CardContent>
        <CardFooter>
            <div className="text-xs text-muted-foreground">
                Mostrando <strong>{filteredUsers.length}</strong> de <strong>{initialUsers.length}</strong> usuários.
            </div>
        </CardFooter>
      </Card>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</SheetTitle>
          </SheetHeader>
          <UserForm
            user={editingUser}
            onSave={handleSaveUser}
            onCancel={() => setIsSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>
      <AlertDialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente o usuário
              e removerá seu acesso ao sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingUser(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
