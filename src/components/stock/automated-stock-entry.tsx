'use client';
import { useState, useRef, useContext } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, Wand2, Loader2, Save } from 'lucide-react';
import Image from 'next/image';
import { DataContext } from '@/context/data-context';
import type { Product } from '@/lib/types';
import { extractInvoiceData, type ExtractInvoiceDataOutput } from '@/ai/flows/extract-invoice-data';
import { useTranslation } from '@/providers/translation-provider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

type AutomatedStockEntrySheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AutomatedStockEntrySheet({ open, onOpenChange }: AutomatedStockEntrySheetProps) {
    const { t, formatCurrency } = useTranslation();
    const { toast } = useToast();
    const { products, setProducts } = useContext(DataContext);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [extractedData, setExtractedData] = useState<ExtractInvoiceDataOutput | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setExtractedData(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyzeInvoice = async () => {
        if (!imagePreview) {
            toast({
                variant: 'destructive',
                title: t('stock.automated_entry.no_image_title'),
                description: t('stock.automated_entry.no_image_description'),
            });
            return;
        }

        setIsLoading(true);
        try {
            const result = await extractInvoiceData({ invoiceImage: imagePreview });
            setExtractedData(result);
            toast({
                title: t('stock.automated_entry.analysis_complete_title'),
                description: t('stock.automated_entry.analysis_complete_description'),
            });
        } catch (error) {
            console.error('Error analyzing invoice:', error);
            toast({
                variant: 'destructive',
                title: t('stock.automated_entry.analysis_error_title'),
                description: t('stock.automated_entry.analysis_error_description'),
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSaveChanges = () => {
        if (!extractedData) return;

        let updatedProducts = [...products];
        const newProducts: Product[] = [];

        extractedData.products.forEach(extractedProduct => {
            const existingProductIndex = updatedProducts.findIndex(p => p.name.toLowerCase() === extractedProduct.name.toLowerCase());

            if (existingProductIndex > -1) {
                // Update existing product
                updatedProducts[existingProductIndex] = {
                    ...updatedProducts[existingProductIndex],
                    quantity: updatedProducts[existingProductIndex].quantity + extractedProduct.quantity,
                    purchasePrice: extractedProduct.purchasePrice, // Update purchase price
                };
            } else {
                // Add as a new product
                const newProduct: Product = {
                    id: `PROD${Date.now()}-${Math.random()}`,
                    name: extractedProduct.name,
                    quantity: extractedProduct.quantity,
                    purchasePrice: extractedProduct.purchasePrice,
                    salePrice: extractedProduct.purchasePrice * 1.5, // Suggest a sale price (e.g., 50% margin)
                    category: 'N/A',
                    barcode: extractedProduct.barcode || '',
                    imageUrl: '',
                };
                newProducts.push(newProduct);
            }
        });
        
        setProducts([...updatedProducts, ...newProducts]);

        toast({
            title: t('stock.automated_entry.stock_updated_title'),
            description: t('stock.automated_entry.stock_updated_description', { count: extractedData.products.length }),
        });
        
        handleClose();
    }

    const handleClose = () => {
        onOpenChange(false);
        setTimeout(() => {
            setImagePreview(null);
            setExtractedData(null);
            setIsLoading(false);
        }, 300);
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-3xl w-full flex flex-col">
                <SheetHeader>
                    <SheetTitle>{t('stock.automated_entry.title')}</SheetTitle>
                    <SheetDescription>{t('stock.automated_entry.description')}</SheetDescription>
                </SheetHeader>
                <div className="flex-grow flex flex-col md:flex-row gap-6 py-4 overflow-hidden">
                    {/* Upload Section */}
                    <div className='md:w-1/3 flex flex-col gap-4'>
                        <div 
                            className="aspect-square w-full rounded-lg border-2 border-dashed flex items-center justify-center text-center p-4 cursor-pointer hover:border-primary hover:bg-muted"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imagePreview ? (
                                <Image src={imagePreview} alt="Invoice preview" width={400} height={400} className="object-contain h-full w-full" data-ai-hint="invoice receipt" />
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <Upload className="h-8 w-8" />
                                    <span className="font-semibold">{t('stock.automated_entry.upload_cta')}</span>
                                    <span className="text-xs">{t('stock.automated_entry.upload_supported_formats')}</span>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/png, image/jpeg, image/webp"
                        />
                        <Button onClick={handleAnalyzeInvoice} disabled={isLoading || !imagePreview}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t('stock.automated_entry.analyzing')}
                                </>
                            ) : (
                                <>
                                    <Wand2 className="mr-2 h-4 w-4" />
                                    {t('stock.automated_entry.analyze_button')}
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Results Section */}
                    <div className='md:w-2/3 flex-grow flex flex-col overflow-hidden'>
                        <h3 className="text-lg font-semibold mb-2">{t('stock.automated_entry.extracted_data')}</h3>
                        <div className="rounded-lg border flex-grow overflow-hidden">
                            <ScrollArea className="h-full">
                                {extractedData && extractedData.products.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>{t('stock.product_name')}</TableHead>
                                                <TableHead className="text-center">{t('stock.quantity')}</TableHead>
                                                <TableHead className="text-right">{t('stock.purchase_price')}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {extractedData.products.map((product, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">{product.name}</TableCell>
                                                    <TableCell className="text-center">{product.quantity}</TableCell>
                                                    <TableCell className="text-right">{formatCurrency(product.purchasePrice)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-center text-muted-foreground p-4">
                                        {isLoading 
                                            ? <p>{t('stock.automated_entry.loading_analysis')}</p>
                                            : <p>{t('stock.automated_entry.no_data_placeholder')}</p>
                                        }
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </div>
                </div>
                <SheetFooter>
                    <Button variant="outline" onClick={handleClose}>{t('global.cancel')}</Button>
                    <Button onClick={handleSaveChanges} disabled={!extractedData || extractedData.products.length === 0}>
                        <Save className="mr-2 h-4 w-4"/>
                        {t('stock.automated_entry.save_to_stock')}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
