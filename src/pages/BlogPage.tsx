import { Link } from 'react-router-dom';
import { useGetBlogsQuery } from '@/api/endpoints/blog.api';
import { format } from 'date-fns';
import { Loader2, ArrowRight } from 'lucide-react';

export default function BlogPage() {
   const { data, isLoading } = useGetBlogsQuery({ page: 1, limit: 20 });
   const blogs = data?.blogs || [];

   return (
      <div className="min-h-screen bg-background py-20">
         <div className="container mx-auto max-w-6xl px-6">
            <div className="text-center mb-16">
               <h1 className="text-5xl font-bold mb-6 text-foreground">Our Blog</h1>
               <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Insights, tips, and updates from the MockSprint team to help you ace your next technical interview.
               </p>
            </div>

            {isLoading ? (
               <div className="flex justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
               </div>
            ) : blogs.length === 0 ? (
               <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
                  <h3 className="text-2xl font-semibold mb-2">No posts yet</h3>
                  <p className="text-muted-foreground">Check back soon for our latest articles.</p>
               </div>
            ) : (
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogs.map((blog: any) => (
                     <div key={blog.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all group flex flex-col">
                        {blog.coverImage ? (
                           <div className="h-48 overflow-hidden">
                              <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                           </div>
                        ) : (
                           <div className="h-48 bg-gradient-to-br from-blue-900/40 to-cyan-900/40" />
                        )}
                        <div className="p-6 flex-1 flex flex-col">
                           <div className="flex items-center gap-2 mb-3 flex-wrap">
                              {blog.tags?.slice(0, 2).map((tag: string) => (
                                 <span key={tag} className="text-xs font-semibold bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded-full">
                                    {tag}
                                 </span>
                              ))}
                           </div>
                           <h3 className="text-xl font-bold mb-3 text-foreground line-clamp-2">{blog.title}</h3>
                           <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-1">{blog.excerpt}</p>
                           <div className="flex items-center justify-between mt-auto">
                              <span className="text-xs text-muted-foreground">
                                 {format(new Date(blog.createdAt), 'MMM d, yyyy')} · {blog.author?.name}
                              </span>
                              <Link to={`/blogs/${blog.slug}`} className="text-sm font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                                 Read <ArrowRight className="w-4 h-4" />
                              </Link>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
}
