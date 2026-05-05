import { useParams, Link } from 'react-router-dom';
import { useGetBlogBySlugQuery } from '@/api/endpoints/blog.api';
import { format } from 'date-fns';
import { Loader2, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BlogPostPage() {
   const { slug } = useParams();
   const { data, isLoading, isError } = useGetBlogBySlugQuery(slug || '');
   const blog = data?.blog;

   if (isLoading) {
      return (
         <div className="min-h-screen bg-background flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
         </div>
      );
   }

   if (isError || !blog) {
      return (
         <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or has been removed.</p>
            <Link to="/blogs" className="text-blue-500 hover:text-blue-400 flex items-center gap-2">
               <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-background py-20">
         <div className="container mx-auto max-w-3xl px-6">
            <Link to="/blogs" className="text-blue-500 hover:text-blue-400 flex items-center gap-2 mb-10 w-max font-medium">
               <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
            
            <div className="mb-10">
               {blog.tags?.length > 0 && (
                  <div className="flex gap-2 mb-4">
                     {blog.tags.map((tag: string) => (
                        <span key={tag} className="text-xs font-semibold bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full">
                           {tag}
                        </span>
                     ))}
                  </div>
               )}
               <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">{blog.title}</h1>
               <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-300 font-bold">
                     {blog.author?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                     <p className="font-semibold text-foreground text-sm">{blog.author?.name}</p>
                     <p className="text-xs">{format(new Date(blog.createdAt), 'MMMM d, yyyy')}</p>
                  </div>
               </div>
            </div>

            {blog.coverImage && (
               <div className="w-full aspect-video rounded-2xl overflow-hidden mb-12 border border-white/10">
                  <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
               </div>
            )}

            <div className="prose prose-invert prose-blue max-w-none prose-img:rounded-xl">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {blog.content}
               </ReactMarkdown>
            </div>
         </div>
      </div>
   );
}
