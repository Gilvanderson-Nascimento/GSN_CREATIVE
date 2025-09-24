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
import { ptBR } from 'date-fns/locale';

type ChartData = {
  name: string;
  total: number;
};

const generateDataForRange = (startDate: Date, endDate: Date): ChartData[] => {
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
        return days.map((day) => ({
            name: day,
            total: Math.floor(Math.random() * 1000) + 200,
        }));
    }
    // monthly
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months.map((month) => ({
        name: month,
        total: Math.floor(Math.random() * 5000) + 1000,
    }));
};


export function SalesChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>('custom');
  const [isClient, setIsClient] = useState(false);

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
        setData(generateDataForRange(dateRange.from, dateRange.to));
    } else if (activeTab === 'daily' || activeTab === 'weekly' || activeTab === 'monthly') {
        setData(generateStaticData(activeTab as 'daily' | 'weekly' | 'monthly'));
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

  const average = useMemo(() => data.reduce((acc, item) => acc + item.total, 0) / (data.length || 1), [data]);


  if (!isClient) {
    return (
        <Card className="bg-white rounded-xl shadow-md p-4">
            <CardHeader className="p-2">
                <CardTitle className="text-lg font-semibold text-gray-800">Visão Geral das Vendas</CardTitle>
                 <CardDescription className="text-sm text-gray-500">Carregando dados do gráfico...</CardDescription>
            </CardHeader>
            <CardContent className="pl-2 pt-4">
                <div className="w-full h-[350px] bg-gray-100 animate-pulse rounded-md" />
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="bg-white rounded-xl shadow-md h-full">
      <CardHeader className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
                <CardTitle className="text-lg font-semibold text-gray-800">Visão Geral das Vendas</CardTitle>
                {chartTitle && <CardDescription className="text-sm text-gray-500 mt-1">{chartTitle}</CardDescription>}
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <Tabs value={activeTab} onValueChange={(value) => {
                    setActiveTab(value);
                    if(value !== 'custom') setDateRange(undefined);
                }} className="hidden sm:block">
                    <TabsList className="bg-gray-100 p-1">
                        <TabsTrigger value="daily" className="text-xs px-3 py-1">Diário</TabsTrigger>
                        <TabsTrigger value="weekly" className="text-xs px-3 py-1">Semanal</TabsTrigger>
                        <TabsTrigger value="monthly" className="text-xs px-3 py-1">Mensal</TabsTrigger>
                    </TabsList>
                </Tabs>

                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className="w-full sm:w-[260px] justify-start text-left font-normal text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg"
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
      </CardHeader>
      <CardContent className="pl-2 pr-6 pb-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
            <Tooltip
              cursor={{ fill: 'rgba(179, 195, 212, 0.2)' }}
              contentStyle={{ 
                  background: "white", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  fontSize: '12px'
              }}
              labelStyle={{ fontWeight: 'bold' }}
              formatter={(value: number) => [`R$${value.toFixed(2)}`, 'Total']}
            />
            <Bar dataKey="total" radius={[4, 4, 0, 0]} fill="#60A5FA" />
            <ReferenceLine y={average} label={{ value: 'Média', position: 'insideTopLeft', fill: '#6B7280', fontSize: 10 }} stroke="#F87171" strokeDasharray="3 3" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
