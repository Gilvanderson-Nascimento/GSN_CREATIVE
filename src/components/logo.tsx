import { useContext } from 'react';
import Image from 'next/image';
import { DataContext } from '@/context/data-context';

export function Logo() {
  const { settings } = useContext(DataContext);
  // Use a placeholder image if no logoUrl is set
  const logoUrl = settings.sistema.logoUrl || 'https://picsum.photos/seed/logo/36/36';
  const companyName = settings.sistema.nome_empresa || 'GSN_GESTOR';
  
  return (
    <div className="flex items-center gap-2">
        <Image src={logoUrl} alt={`${companyName} Logo`} width={36} height={36} className="rounded-md" />
        <h1 className="text-lg font-bold text-foreground group-data-[collapsible=icon]:hidden duration-200 ease-linear">
            {companyName}
        </h1>
    </div>
  );
}
