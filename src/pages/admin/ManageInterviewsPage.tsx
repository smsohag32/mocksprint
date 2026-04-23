import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';

export default function ManageInterviewsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Manage Interviews</h1>
      <Card className="border-border/50">
        <CardContent className="text-center py-12 text-muted-foreground">
          Interview management tools coming soon. View all user interview sessions and analytics here.
        </CardContent>
      </Card>
    </div>
  );
}
