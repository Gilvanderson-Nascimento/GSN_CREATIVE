import { ShoppingBasket } from 'lucide-react';
import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center gap-2" >
        <ShoppingBasket className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-bold text-foreground group-data-[collapsible=icon]:hidden duration-200 ease-linear">
            GSN_GESTOR
        </h1>
    </div>
  );
}
