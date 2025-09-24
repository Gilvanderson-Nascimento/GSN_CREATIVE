'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { addDays, format, differenceInDays } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { useTranslation } from '@/providers/translation-provider';

type ChartData = {
  name: string;
  total: number;
};

const generateDataForRange = (startDate: Date, endDate: Date, locale: Locale): ChartData[] => {
  const data: ChartData[] = [];
  const days = differenceInDays(endDate, startDate);
  let currentDate = startDate;
  
  if (days <= 31) { // Daily
    for (let i = 0; i <= days; i++) {
      data.push({
        name: format(currentDate, 'dd/MM'),
        total: Math.floor(Math.random() * 800) + 100,
      });
      currentDate = addDays(currentDate, 1);
    }
  } else if (days <= 365) { // Monthly
    const monthMap = new Map<string, number>();
    for (let i = 0; i <= days; i++) {
        const monthName = format(currentDate, 'MMM', { locale });
        const currentTotal = monthMap.get(monthName) || 0;
        monthMap.set(monthName, currentTotal + (Math.floor(Math.random() * 200) + 20));
        currentDate = addDays(currentDate, 1);
    }
     monthMap.forEach((total, name) => {
        data.push({ name, total: Math.round(total) });
    });
  } else { // Yearly
     const yearMap = new Map<string, number>();
    for (let i = 0; i <= days; i++) {
        const yearName = format(currentDate, 'yyyy');
        const currentTotal = yearMap.get(yearName) || 0;
        yearMap.set(yearName, currentTotal + (Math.floor(Math.random() * 50) + 10));
        currentDate = addDays(currentDate, 1);
    }
    yearMap.forEach((total, name) => {
        data.push({ name, total: Math.round(total) });
    });
  }

  return data;
};

const generateStaticData = (period: 'daily' | 'weekly' | 'monthly', locale: Locale): ChartData[] => {
    if (period === 'daily') {
        return Array.from({ length: 24 }, (_, i) => ({
            name: `${i}:00`,
            total: Math.floor(Math.random() * 500) + 50,
        }));
    }
    if (period === 'weekly') {
        const days = Array.from({ length: 7 }, (_, i) => format(addDays(new Date(), i - new Date().getDay()), 'E', { locale }));
        return days.map((day) => ({
            name: day,
            total: Math.floor(Math.random() * 1000) + 200,
        }));
    }
    // monthly
    const months = Array.from({ length: 12 }, (_, i) => format(new Date(0, i), 'MMM', { locale }));
    return months.map((month) => ({
        name: month,
        total: Math.floor(Math.random() * 5000) + 1000,
    }));
};


export function SalesChart() {
  const { t, language } = useTranslation();
  const [data, setData] = useState<ChartData[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>('custom');
  const [isClient, setIsClient] = useState(false);
  const locale = language === 'pt-BR' ? ptBR : enUS;

  useEffect(() => {
    setIsClient(true);
    setDateRange({
        from: addDays(new Date(), -29),
        to: new Date(),
    });
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (activeTab === 'custom' && dateRange?.from && dateRange?.to) {
        setData(generateDataForRange(dateRange.from, dateRange.to, locale));
    } else if (activeTab === 'daily' || activeTab === 'weekly' || activeTab === 'monthly') {
        setData(generateStaticData(activeTab as 'daily' | 'weekly' | 'monthly', locale));
    }
  }, [activeTab, dateRange, isClient, locale]);

  const chartTitle = useMemo(() => {
    if (activeTab === 'custom' && dateRange?.from && dateRange?.to) {
      return t('dashboard.displaying_from_to', { from: format(dateRange.from, "dd/MM/yy"), to: format(dateRange.to, "dd/MM/yy") });
    }
    if (activeTab === 'daily') return t('dashboard.sales_last_24_hours');
    if (activeTab === 'weekly') return t('dashboard.sales_last_week');
    if (activeTab === 'monthly') return t('dashboard.sales_last_year');
    return t('dashboard.sales_overview');
  }, [activeTab, dateRange, t])

  const average = useMemo(() => data.reduce((acc, item) => acc + item.total, 0) / (data.length || 1), [data]);


  if (!isClient) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('dashboard.sales_overview')}</CardTitle>
                 <CardDescription>{t('dashboard.loading_chart_data')}</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="w-full h-[350px] bg-muted animate-pulse rounded-md" />
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
                <CardTitle>{t('dashboard.sales_overview')}</CardTitle>
                {chartTitle && <CardDescription className="mt-1">{chartTitle}</CardDescription>}
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <Tabs value={activeTab} onValueChange={(value) => {
                    setActiveTab(value);
                    if(value !== 'custom') setDateRange(undefined);
                }} className="hidden sm:block">
                    <TabsList>
                        <TabsTrigger value="daily">{t('dashboard.daily')}</TabsTrigger>
                        <TabsTrigger value="weekly">{t('dashboard.weekly')}</TabsTrigger>
                        <TabsTrigger value="monthly">{t('dashboard.monthly')}</TabsTrigger>
                    </TabsList>
                </Tabs>

                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className="w-full sm:w-[260px] justify-start text-left font-normal"
                        onClick={() => setActiveTab('custom')}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                        dateRange.to ? (
                            <>
                            {format(dateRange.from, "dd/MM/y")} -{" "}
                            {format(dateRange.to, "dd/MM/y")}
                            </>
                        ) : (
                            format(dateRange.from, "dd/MM/y")
                        )
                        ) : (
                        <span>{t('dashboard.pick_a_period')}</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        locale={locale}
                    />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
      </CardHeader>
      <CardContent className="pl-2 pr-6 pb-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
            <Tooltip
              cursor={{ fill: 'hsla(var(--muted))' }}
              contentStyle={{ 
                  backgroundColor: "hsl(var(--background))", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: 'var(--radius)',
                  fontSize: '12px'
              }}
              labelStyle={{ fontWeight: 'bold' }}
              formatter={(value: number) => [`R$${value.toFixed(2)}`, t('dashboard.total')]}
            />
            <Bar dataKey="total" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" />
            <ReferenceLine y={average} label={{ value: t('dashboard.average'), position: 'insideTopLeft', fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
