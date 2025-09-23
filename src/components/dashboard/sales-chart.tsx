'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { addDays, format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type ChartData = {
  name: string;
  total: number;
};

const generateDataForRange = (startDate: Date, endDate: Date): ChartData[] => {
  const data: ChartData[] = [];
  const days = differenceInDays(endDate, startDate);
  let currentDate = startDate;
  
  // Decide the grouping based on the range length
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
        const monthName = format(currentDate, 'MMM', { locale: ptBR });
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

const generateStaticData = (period: 'daily' | 'weekly' | 'monthly'): ChartData[] => {
    if (period === 'daily') {
        return Array.from({ length: 24 }, (_, i) => ({
            name: `${i}:00`,
            total: Math.floor(Math.random() * 500) + 50,
        }));
    }
    if (period === 'weekly') {
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        return days.map(day => ({
            name: day,
            total: Math.floor(Math.random() * 1000) + 200,
        }));
    }
    // monthly
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months.map(month => ({
        name: month,
        total: Math.floor(Math.random() * 5000) + 1000,
    }));
};


export function SalesChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -29),
    to: new Date(),
  });
  const [activeTab, setActiveTab] = useState<string>('custom');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (activeTab === 'custom' && dateRange?.from && dateRange?.to) {
        setData(generateDataForRange(dateRange.from, dateRange.to));
    } else if (activeTab === 'daily' || activeTab === 'weekly' || activeTab === 'monthly') {
        setData(generateStaticData(activeTab));
    }
  }, [activeTab, dateRange, isClient]);

  const chartTitle = useMemo(() => {
    if (activeTab === 'custom' && dateRange?.from && dateRange?.to) {
      return `Exibindo de ${format(dateRange.from, "dd/MM/yy")} a ${format(dateRange.to, "dd/MM/yy")}`;
    }
    if (activeTab === 'daily') return 'Vendas nas últimas 24 horas';
    if (activeTab === 'weekly') return 'Vendas na última semana';
    if (activeTab === 'monthly') return 'Vendas no último ano';
    return 'Vendas por Período'
  }, [activeTab, dateRange])


  if (!isClient) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Visão Geral das Vendas</CardTitle>
                 <CardDescription>Carregando dados do gráfico...</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="w-full h-[350px] bg-muted animate-pulse rounded-md" />
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle>Visão Geral das Vendas</CardTitle>
            <div className="flex items-center gap-2">
                <Tabs value={activeTab} onValueChange={(value) => {
                    setActiveTab(value);
                    if(value !== 'custom') setDateRange(undefined);
                }} className="hidden sm:block">
                    <TabsList>
                        <TabsTrigger value="daily">Diário</TabsTrigger>
                        <TabsTrigger value="weekly">Semanal</TabsTrigger>
                        <TabsTrigger value="monthly">Mensal</TabsTrigger>
                    </TabsList>
                </Tabs>

                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className="w-[260px] justify-start text-left font-normal"
                        onClick={() => setActiveTab('custom')}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                        dateRange.to ? (
                            <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(dateRange.from, "LLL dd, y")
                        )
                        ) : (
                        <span>Escolha um período</span>
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
                    />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
         {chartTitle && <CardDescription>{chartTitle}</CardDescription>}
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
