import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Добро пожаловать</h1>
        <p className="text-sm text-muted-foreground">
          Ваш дашборд PipelineHQ
        </p>
      </div>

      <Card className="rounded-2xl border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground">
            Начните с онбординга, чтобы настроить вашу стратегию.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
