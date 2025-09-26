import { useContext } from 'react';
import Image from 'next/image';
import { DataContext } from '@/context/data-context';

export function Logo() {
  const { settings } = useContext(DataContext);
  const logoUrl = settings.sistema.logoUrl || '/logo.png';
  const companyName = settings.sistema.nome_empresa || 'GSN_GESTOR';
  
  return (
    <div className="flex items-center gap-2">
        <Image src={logoUrl} alt={`${companyName} Logo`} width={36} height={36} />
        <h1 className="text-lg font-bold text-foreground group-data-[collapsible=icon]:hidden duration-200 ease-linear">
            {companyName}
        </h1>
    </div>
  );
}
