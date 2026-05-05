import { useState } from 'react';
import { useGetAdminInterviewsQuery } from '@/api/endpoints/interview.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2, PlayCircle, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function ManageInterviewsPage() {
   const [page, setPage] = useState(1);
   const limit = 10;
   const { data, isLoading } = useGetAdminInterviewsQuery({ page, limit });

   const interviews = data?.interviews || [];
   const total = data?.total || 0;
   const totalPages = Math.ceil(total / limit);

   const getStatusBadge = (status: string) => {
      switch (status) {
         case 'completed':
            return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</Badge>;
         case 'ongoing':
            return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"><PlayCircle className="w-3 h-3 mr-1" /> Ongoing</Badge>;
         case 'abandoned':
            return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20"><XCircle className="w-3 h-3 mr-1" /> Abandoned</Badge>;
         default:
            return <Badge variant="outline">{status}</Badge>;
      }
   };

   return (
      <div className="space-y-6 animate-fade-in">
         <h1 className="text-2xl font-bold text-foreground">Manage Interviews</h1>

         <Card className="border-border/50 bg-card">
            <CardHeader>
               <CardTitle className="text-lg">All Interview Sessions</CardTitle>
            </CardHeader>
            <CardContent>
               {isLoading ? (
                  <div className="flex justify-center py-12">
                     <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
               ) : (
                  <>
                     <div className="rounded-md border border-border">
                        <Table>
                           <TableHeader>
                              <TableRow>
                                 <TableHead>User</TableHead>
                                 <TableHead>Question</TableHead>
                                 <TableHead>Status</TableHead>
                                 <TableHead>Score</TableHead>
                                 <TableHead>Date</TableHead>
                              </TableRow>
                           </TableHeader>
                           <TableBody>
                              {interviews.length === 0 ? (
                                 <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                       No interviews found.
                                    </TableCell>
                                 </TableRow>
                              ) : (
                                 interviews.map((interview: any) => (
                                    <TableRow key={interview.id}>
                                       <TableCell>
                                          <div>
                                             <p className="font-medium">{interview.user?.name}</p>
                                             <p className="text-xs text-muted-foreground">{interview.user?.email}</p>
                                          </div>
                                       </TableCell>
                                       <TableCell className="max-w-[200px] truncate">
                                          {interview.question?.title || 'Unknown Question'}
                                       </TableCell>
                                       <TableCell>{getStatusBadge(interview.status)}</TableCell>
                                       <TableCell>
                                          {interview.score !== null ? (
                                             <span className="font-semibold text-blue-500">{interview.score}%</span>
                                          ) : (
                                             <span className="text-muted-foreground">-</span>
                                          )}
                                       </TableCell>
                                       <TableCell className="text-sm text-muted-foreground">
                                          {format(new Date(interview.createdAt), 'MMM d, yyyy h:mm a')}
                                       </TableCell>
                                    </TableRow>
                                 ))
                              )}
                           </TableBody>
                        </Table>
                     </div>

                     {/* Pagination */}
                     {totalPages > 1 && (
                        <div className="flex items-center justify-end space-x-2 mt-4">
                           <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPage((p) => Math.max(1, p - 1))}
                              disabled={page === 1}
                           >
                              <ChevronLeft className="h-4 w-4 mr-1" />
                              Previous
                           </Button>
                           <span className="text-sm text-muted-foreground px-2">
                              Page {page} of {totalPages}
                           </span>
                           <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                              disabled={page === totalPages}
                           >
                              Next
                              <ChevronRight className="h-4 w-4 ml-1" />
                           </Button>
                        </div>
                     )}
                  </>
               )}
            </CardContent>
         </Card>
      </div>
   );
}
