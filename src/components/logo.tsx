import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="GSN Gestor Logo" width={36} height={36} />
        <h1 className="text-lg font-bold text-foreground group-data-[collapsible=icon]:hidden duration-200 ease-linear">
            GSN_GESTOR
        </h1>
    </div>
  );
}
