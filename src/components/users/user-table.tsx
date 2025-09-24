'use client';
import { useState, useMemo, useEffect, useContext } from 'react';
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
  DropdownMenuSeparator,
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

import { MoreHorizontal, Pencil, PlusCircle, Trash2, Search, ShieldCheck } from 'lucide-react';
import type { User, PagePermission } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { UserForm } from './user-form';
import { PermissionsForm } from './permissions-form';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { DataContext } from '@/context/data-context';

export default function UserTable() {
  const { users: initialUsers, setUsers } = useContext(DataContext);
  const [filter, setFilter] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [managingPermissionsFor, setManagingPermissionsFor] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPermissionsSheetOpen, setIsPermissionsSheetOpen] = useState(false);
  const { user: currentUser } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const usersToDisplay = useMemo(() => 
    initialUsers.filter(user => user.username !== 'GSN_CREATIVE'),
    [initialUsers]
  );

  const handleAddUser = () => {
    setEditingUser(null);
    setIsSheetOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsSheetOpen(true);
  };

  const handleManagePermissions = (user: User) => {
    setManagingPermissionsFor(user);
    setIsPermissionsSheetOpen(true);
  }

  const confirmDeleteUser = (user: User) => {
    setDeletingUser(user);
  }

  const handleDeleteUser = () => {
    if (deletingUser) {
      setUsers(initialUsers.filter((c) => c.id !== deletingUser.id));
      setDeletingUser(null);
    }
  };
  
  const handleSaveUser = (userData: Omit<User, 'id' | 'createdAt' | 'permissions'>) => {
    if(editingUser) {
        setUsers(initialUsers.map(u => u.id === editingUser.id ? { ...editingUser, ...userData, password: userData.password || editingUser.password } : u));
    } else {
        const newUser: User = {
          ...userData,
          id: `USER${Date.now()}`,
          createdAt: new Date().toISOString(),
          permissions: {}, // Start with no permissions
        }
        setUsers([...initialUsers, newUser]);
    }
    setIsSheetOpen(false);
  }

  const handleSavePermissions = (permissions: Partial<Record<PagePermission, boolean>>) => {
    if (managingPermissionsFor) {
      setUsers(initialUsers.map(u => u.id === managingPermissionsFor.id ? { ...u, permissions } : u));
    }
    setIsPermissionsSheetOpen(false);
  }

  const filteredUsers = usersToDisplay.filter(
    (user) =>
      user.name.toLowerCase().includes(filter.toLowerCase()) ||
      user.username.toLowerCase().includes(filter.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(filter.toLowerCase()))
  );
  
  const isCurrentUserAdmin = isClient && currentUser?.role === 'admin';

  return (
    <>
       <Card className="bg-white shadow-md rounded-xl">
        <CardHeader className="p-6">
          <CardTitle className="text-xl font-bold text-gray-800">Usuários do Sistema</CardTitle>
          <CardDescription className="text-base text-gray-600">
            Adicione, edite e gerencie os usuários que podem acessar o sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4 gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Filtrar por nome, usuário ou e-mail..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="pl-9 w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                </div>
                <Button onClick={handleAddUser} className="bg-blue-600 text-white font-medium rounded-md px-4 py-2 hover:bg-blue-700 transition shadow-sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Usuário
                </Button>
            </div>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
                <Table className="w-full border-collapse divide-y divide-gray-200">
                <TableHeader>
                    <TableRow className="bg-gray-100 hover:bg-gray-100">
                        <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">Nome Completo</TableHead>
                        <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">Nome de Usuário</TableHead>
                        <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">Função</TableHead>
                        <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">E-mail</TableHead>
                        <TableHead>
                            <span className="sr-only">Ações</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="transition hover:bg-gray-50">
                        <TableCell className="px-4 py-3 font-medium text-gray-800">{user.name}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-700">{user.username}</TableCell>
                        <TableCell className="px-4 py-3"><Badge variant="secondary" className="capitalize">{user.role}</Badge></TableCell>
                        <TableCell className="px-4 py-3 text-gray-700">{user.email || 'N/A'}</TableCell>
                        <TableCell className="px-4 py-3">
                         <div className="flex justify-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost" disabled={!isCurrentUserAdmin} className="text-gray-500 hover:text-gray-700">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                    <DropdownMenuItem onSelect={() => handleEditUser(user)}>
                                        <Pencil className="mr-2 h-4 w-4" /> Editar Usuário
                                    </DropdownMenuItem>
                                     <DropdownMenuItem onSelect={() => handleManagePermissions(user)}>
                                        <ShieldCheck className="mr-2 h-4 w-4" /> Gerenciar Permissões
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={() => confirmDeleteUser(user)} className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" /> Excluir Usuário
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                    </TableRow>
                    ))}
                    {filteredUsers.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-sm text-gray-500">
                                Nenhum usuário encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
        </CardContent>
        <CardFooter className="p-6">
            <div className="text-sm text-gray-500">
                Mostrando <strong>{filteredUsers.length}</strong> de <strong>{usersToDisplay.length}</strong> usuários.
            </div>
        </CardFooter>
      </Card>
      
      {/* Sheet para Adicionar/Editar Usuário */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto w-full max-w-md sm:max-w-md">
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

      {/* Sheet para Gerenciar Permissões */}
       <Sheet open={isPermissionsSheetOpen} onOpenChange={setIsPermissionsSheetOpen}>
        <SheetContent className="overflow-y-auto w-full max-w-md sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Gerenciar Permissões</SheetTitle>
            <CardDescription>Defina quais abas {managingPermissionsFor?.name} pode acessar.</CardDescription>
          </SheetHeader>
          {managingPermissionsFor && (
            <PermissionsForm
                user={managingPermissionsFor}
                onSave={handleSavePermissions}
                onCancel={() => setIsPermissionsSheetOpen(false)}
            />
          )}
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
