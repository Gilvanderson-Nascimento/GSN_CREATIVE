'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';

const generateMonthlyData = () => [
  { month: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Fev', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Abr', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Mai', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Jul', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Ago', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Set', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Out', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Nov', total: Math.floor(Math.random() * 5000) + 1000 },
  { month: 'Dez', total: Math.floor(Math.random() * 5000) + 1000 },
];

const generateWeeklyData = () => [
  { day: 'Dom', total: Math.floor(Math.random() * 1000) + 200 },
  { day: 'Seg', total: Math.floor(Math.random() * 1000) + 200 },
  { day: 'Ter', total: Math.floor(Math.random() * 1000) + 200 },
  { day: 'Qua', total: Math.floor(Math.random() * 1000) + 200 },
  { day: 'Qui', total: Math.floor(Math.random() * 1000) + 200 },
  { day: 'Sex', total: Math.floor(Math.random() * 1000) + 200 },
  { day: 'Sáb', total: Math.floor(Math.random() * 1000) + 200 },
];


export function SalesChart() {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setMonthlyData(generateMonthlyData());
    setWeeklyData(generateWeeklyData());
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Vendas por Período</CardTitle>
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
        <CardTitle>Vendas por Período</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <Tabs defaultValue="month">
            <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="month">Mês</TabsTrigger>
                <TabsTrigger value="week">Semana</TabsTrigger>
            </TabsList>
            <TabsContent value="month">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                    <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
            </TabsContent>
             <TabsContent value="week">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={weeklyData}>
                    <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                    <Bar dataKey="total" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
            </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
