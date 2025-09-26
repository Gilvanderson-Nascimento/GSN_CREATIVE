'use client';
import { useState, useMemo, useEffect, useContext } from 'react';
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
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
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

import { MoreHorizontal, Pencil, PlusCircle, Trash2, Search, ShieldCheck, UserCog } from 'lucide-react';
import type { User, PagePermission } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { UserForm, type UserFormValues } from './user-form';
import { PermissionsForm } from './permissions-form';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { DataContext } from '@/context/data-context';
import { useTranslation } from '@/providers/translation-provider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

export default function UserTable() {
  const { users: initialUsers, setUsers } = useContext(DataContext);
  const { t } = useTranslation();
  const { toast } = useToast();
  const [filter, setFilter] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [managingPermissionsFor, setManagingPermissionsFor] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPermissionsSheetOpen, setIsPermissionsSheetOpen] = useState(false);
  const { user: currentUser, createUser } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const usersToDisplay = useMemo(() => 
    initialUsers.filter(u => u.username !== 'GSN_CREATIVE'),
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
  
  const handleSaveUser = async (userData: UserFormValues) => {
    if (editingUser) {
      // Logic for updating an existing user
      setUsers(initialUsers.map(u => u.id === editingUser.id ? { ...editingUser, ...userData } : u));
      toast({ title: "Usuário atualizado", description: `O usuário ${userData.name} foi atualizado.` });
    } else {
      // Logic for creating a new user
      if (!userData.password) {
        toast({ variant: 'destructive', title: "Senha necessária", description: "A senha é obrigatória para criar um novo usuário." });
        return;
      }
      try {
        await createUser(userData);
        toast({ title: "Usuário criado", description: `O usuário ${userData.name} foi criado com sucesso.` });
      } catch (error: any) {
        toast({ variant: 'destructive', title: "Erro ao criar usuário", description: error.message });
      }
    }
    setIsSheetOpen(false);
  };

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
  
  const canPerformActions = (targetUser: User) => {
    if (!isClient || !currentUser) return false;
    // Nobody can edit the super admin
    if (targetUser.username === 'GSN_CREATIVE') {
      return false;
    }
    // Admin can edit anyone else
    if (currentUser.role === 'admin') {
      return true;
    }
    // A user can edit themselves
    if (currentUser.id === targetUser.id) {
        return true;
    }
    return false;
  }

  return (
    <>
       <Card className="h-[calc(100vh-10rem)] flex flex-col">
        <CardHeader>
          <CardTitle>{t('users.title')}</CardTitle>
          <CardDescription>
            {t('users.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow overflow-hidden">
            <div className="flex items-center justify-between mb-4 gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('users.filter_placeholder')}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="pl-9"
                    />
                </div>
                {currentUser?.role === 'admin' && (
                  <Button onClick={handleAddUser}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t('users.add_user')}
                  </Button>
                )}
            </div>
            <div className="rounded-xl border flex-grow overflow-hidden">
                <ScrollArea className="h-full">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead>{t('users.full_name')}</TableHead>
                            <TableHead>{t('users.username')}</TableHead>
                            <TableHead>{t('users.role')}</TableHead>
                            <TableHead>{t('users.email')}</TableHead>
                            <TableHead>
                                <span className="sr-only">{t('global.actions')}</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              <Link href={`/users/${user.id}`} className="hover:underline text-primary flex items-center gap-2">
                                <UserCog className="h-4 w-4" />
                                {user.name}
                              </Link>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{user.username}</TableCell>
                            <TableCell><Badge variant="secondary" className="capitalize">{t(`users.roles.${user.role}`)}</Badge></TableCell>
                            <TableCell className="text-muted-foreground">{user.email || 'N/A'}</TableCell>
                            <TableCell>
                            <div className="flex justify-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost" disabled={!canPerformActions(user) || user.username === 'GSN_CREATIVE'}>
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>{t('global.actions')}</DropdownMenuLabel>
                                        <DropdownMenuItem onSelect={() => handleEditUser(user)}>
                                            <Pencil className="mr-2 h-4 w-4" /> {t('users.edit_user')}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleManagePermissions(user)}>
                                            <ShieldCheck className="mr-2 h-4 w-4" /> {t('users.manage_permissions')}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onSelect={() => confirmDeleteUser(user)} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" /> {t('users.delete_user')}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                        </TableRow>
                        ))}
                        {filteredUsers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    {t('users.no_users_found')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </ScrollArea>
            </div>
        </CardContent>
        <CardFooter>
            <div className="text-sm text-muted-foreground">
                {t('users.showing_users', { count: filteredUsers.length, total: usersToDisplay.length })}
            </div>
        </CardFooter>
      </Card>
      
      {/* Sheet para Adicionar/Editar Usuário */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto w-full max-w-md sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editingUser ? t('users.edit_user') : t('users.add_new_user')}</SheetTitle>
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
            <SheetTitle>{t('users.permissions_sheet_title')}</SheetTitle>
            {managingPermissionsFor && <SheetDescription>{t('users.permissions_sheet_description', { name: managingPermissionsFor.name })}</SheetDescription>}
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
            <AlertDialogTitle>{t('users.delete_dialog_title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('users.delete_dialog_description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingUser(null)}>{t('global.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">{t('global.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
