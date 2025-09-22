import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/settings/theme-toggle';

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Configurações" />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>
              Personalize a aparência do sistema para se adequar à sua preferência.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
                <span className="font-medium">Tema</span>
                <ThemeToggle />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
