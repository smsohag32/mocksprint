import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetHistoryQuery } from '@/services/api/interviewApi';

export default function HistoryPage() {
  const { data: history, isLoading } = useGetHistoryQuery();

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Interview History</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        ) : history?.length ? (
          <div className="space-y-3">
            {history.map((h: any) => (
              <Card key={h.id} className="border-border/50">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{h.questions?.title || 'Interview Session'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(h.started_at).toLocaleDateString()} · {new Date(h.started_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {h.completed_at && (
                      <span className="text-xs text-muted-foreground">
                        {Math.round((new Date(h.completed_at).getTime() - new Date(h.started_at).getTime()) / 60000)} min
                      </span>
                    )}
                    <Badge variant={h.status === 'completed' ? 'default' : h.status === 'abandoned' ? 'destructive' : 'secondary'}>
                      {h.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-border/50">
            <CardContent className="text-center py-12 text-muted-foreground">
              No interviews yet. Start practicing!
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
