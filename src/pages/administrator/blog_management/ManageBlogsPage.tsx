import { useState, useRef } from 'react';
import {
   useGetAdminBlogsQuery,
   useCreateBlogMutation,
   useUpdateBlogMutation,
   useDeleteBlogMutation,
} from '@/api/endpoints/blog.api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
   ChevronLeft,
   ChevronRight,
   Loader2,
   Plus,
   Edit,
   Trash2,
   Eye,
   ArrowLeft,
   FileText,
   Globe,
   BookOpen,
   Tag,
   AlignLeft,
   Type,
   ToggleLeft,
   Upload,
   X,
   ImageIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type View = 'list' | 'create' | 'edit' | 'preview';

const emptyForm = {
   title: '',
   content: '',
   excerpt: '',
   status: 'draft',
   tags: '',
};

/* ─── Stat Card ─────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, colorClass }: any) {
   return (
      <div className={`rounded-2xl border p-5 flex items-center gap-4 ${colorClass}`}>
         <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5">
            <Icon className="w-5 h-5" />
         </div>
         <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
         </div>
      </div>
   );
}

/* ─── Cover Image Uploader ───────────────────────────── */
function CoverUploader({ preview, onFile, onRemove }: {
   preview: string | null;
   onFile: (file: File) => void;
   onRemove: () => void;
}) {
   const inputRef = useRef<HTMLInputElement>(null);
   const [dragging, setDragging] = useState(false);

   const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) onFile(file);
      else toast.error('Please drop an image file.');
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFile(file);
   };

   if (preview) {
      return (
         <div className="relative group rounded-xl overflow-hidden border border-border aspect-video">
            <img src={preview} alt="cover preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
               <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => inputRef.current?.click()}
               >
                  <Upload className="w-4 h-4 mr-1" /> Change
               </Button>
               <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={onRemove}
               >
                  <X className="w-4 h-4 mr-1" /> Remove
               </Button>
            </div>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
         </div>
      );
   }

   return (
      <div
         onClick={() => inputRef.current?.click()}
         onDragOver={e => { e.preventDefault(); setDragging(true); }}
         onDragLeave={() => setDragging(false)}
         onDrop={handleDrop}
         className={`aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 gap-3 ${
            dragging ? 'border-blue-500 bg-blue-500/10' : 'border-border hover:border-blue-500/50 hover:bg-white/5'
         }`}
      >
         <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-blue-400" />
         </div>
         <div className="text-center">
            <p className="text-sm font-medium">Click to upload or drag & drop</p>
            <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP up to 5MB</p>
         </div>
         <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      </div>
   );
}

/* ─── Blog Card Row ──────────────────────────────────── */
function BlogRow({ blog, onEdit, onDelete, onPreview }: any) {
   return (
      <div className="group flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card hover:border-blue-500/40 hover:bg-blue-500/5 transition-all duration-200">
         <div className="hidden sm:flex w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-white/10">
            {blog.coverImage ? (
               <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
            ) : (
               <div className="w-full h-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-400/60" />
               </div>
            )}
         </div>

         <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate pr-4">{blog.title}</p>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
               <span className="text-xs text-muted-foreground">{blog.author?.name}</span>
               <span className="text-xs text-muted-foreground/50">·</span>
               <span className="text-xs text-muted-foreground">
                  {format(new Date(blog.createdAt), 'MMM d, yyyy')}
               </span>
               {blog.tags?.slice(0, 2).map((t: string) => (
                  <span key={t} className="text-[10px] font-medium bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">
                     {t}
                  </span>
               ))}
            </div>
         </div>

         <div className="shrink-0">
            {blog.status === 'published' ? (
               <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">
                  <Globe className="w-3 h-3 mr-1" /> Published
               </Badge>
            ) : (
               <Badge variant="outline" className="text-amber-500 border-amber-500/40">
                  <FileText className="w-3 h-3 mr-1" /> Draft
               </Badge>
            )}
         </div>

         <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" onClick={() => onPreview(blog)} className="h-8 w-8 text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10" title="Preview">
               <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onEdit(blog)} className="h-8 w-8 text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10" title="Edit">
               <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(blog.id)} className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-500/10" title="Delete">
               <Trash2 className="w-4 h-4" />
            </Button>
         </div>
      </div>
   );
}

/* ─── Editor ─────────────────────────────────────────── */
function BlogEditor({ form, setForm, coverFile, setCoverFile, coverPreview, setCoverPreview, onSubmit, onCancel, isSaving, isEdit, showPreview, setShowPreview }: any) {
   const handleFile = (file: File) => {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
   };
   const handleRemoveCover = () => {
      setCoverFile(null);
      setCoverPreview(null);
   };

   return (
      <div className="animate-fade-in">
         {/* Top bar */}
         <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <Button variant="ghost" onClick={onCancel} className="text-muted-foreground hover:text-foreground gap-2">
               <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <div className="flex items-center gap-2 flex-wrap justify-end">
               <Button type="button" variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)} className={showPreview ? 'border-blue-500 text-blue-500' : ''}>
                  <Eye className="w-4 h-4 mr-1" /> {showPreview ? 'Hide Preview' : 'Preview'}
               </Button>
               <Button type="button" onClick={() => onSubmit('draft')} variant="outline" size="sm" disabled={isSaving}>
                  Save Draft
               </Button>
               <Button type="button" onClick={() => onSubmit('published')} size="sm" disabled={isSaving} className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 text-white">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Globe className="w-4 h-4 mr-1.5" />}
                  {isEdit ? 'Update & Publish' : 'Publish'}
               </Button>
            </div>
         </div>

         <div className={`gap-8 ${showPreview ? 'grid lg:grid-cols-2' : 'block'}`}>
            {/* Left: Form */}
            <div className="space-y-5">
               <div>
                  <h1 className="text-2xl font-bold mb-1">{isEdit ? 'Edit Post' : 'New Blog Post'}</h1>
                  <p className="text-sm text-muted-foreground">Markdown is supported in the content area.</p>
               </div>

               {/* Title */}
               <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium"><Type className="w-4 h-4 text-blue-400" /> Post Title</Label>
                  <Input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="An engaging, descriptive title..." className="text-base h-11 bg-background" />
               </div>

               {/* Excerpt */}
               <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium"><AlignLeft className="w-4 h-4 text-blue-400" /> Excerpt <span className="text-muted-foreground font-normal">(shown in blog cards)</span></Label>
                  <Textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="A short, compelling summary..." rows={2} className="resize-none bg-background" />
               </div>

               {/* Tags */}
               <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium"><Tag className="w-4 h-4 text-blue-400" /> Tags <span className="text-muted-foreground font-normal">(comma separated)</span></Label>
                  <Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="e.g. React, TypeScript, DSA" className="bg-background" />
               </div>

               {/* Cover Image Upload */}
               <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium"><Upload className="w-4 h-4 text-blue-400" /> Cover Image</Label>
                  <CoverUploader preview={coverPreview} onFile={handleFile} onRemove={handleRemoveCover} />
               </div>

               {/* Content */}
               <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium"><BookOpen className="w-4 h-4 text-blue-400" /> Content <span className="text-muted-foreground font-normal">(Markdown)</span></Label>
                  <Textarea
                     required
                     value={form.content}
                     onChange={e => setForm({ ...form, content: e.target.value })}
                     placeholder={`# Heading\n\nStart writing your blog post here...\n\n## Section\n\nContent with **bold**, *italic*, and \`code\`.`}
                     className="font-mono text-sm leading-relaxed bg-background resize-none"
                     style={{ minHeight: 360 }}
                  />
               </div>
            </div>

            {/* Right: Live Preview */}
            {showPreview && (
               <div className="border border-border/60 rounded-2xl p-6 bg-card/40 overflow-auto max-h-[820px] hidden lg:block">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-5">Live Preview</p>
                  {coverPreview && (
                     <div className="w-full aspect-video rounded-xl overflow-hidden mb-6 border border-white/10">
                        <img src={coverPreview} alt="cover" className="w-full h-full object-cover" />
                     </div>
                  )}
                  {form.tags && (
                     <div className="flex gap-2 mb-3 flex-wrap">
                        {form.tags.split(',').map((t: string) => t.trim()).filter(Boolean).map((t: string) => (
                           <span key={t} className="text-xs font-semibold bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded-full">{t}</span>
                        ))}
                     </div>
                  )}
                  <h1 className="text-2xl font-bold mb-4">{form.title || 'Your Post Title'}</h1>
                  {form.excerpt && <p className="text-muted-foreground text-sm mb-5 border-l-2 border-blue-500 pl-4 italic">{form.excerpt}</p>}
                  <div className="prose prose-invert prose-blue max-w-none prose-sm">
                     <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content || '*Start writing to see preview...*'}</ReactMarkdown>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}

/* ─── Preview Panel ──────────────────────────────────── */
function BlogPreviewPanel({ blog, onClose }: any) {
   return (
      <div className="animate-fade-in">
         <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground gap-2">
               <ArrowLeft className="w-4 h-4" /> Back to Blogs
            </Button>
            <Badge className={blog.status === 'published' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}>
               {blog.status === 'published' ? <Globe className="w-3 h-3 mr-1" /> : <FileText className="w-3 h-3 mr-1" />}
               {blog.status}
            </Badge>
         </div>
         <div className="max-w-3xl mx-auto">
            {blog.tags?.length > 0 && (
               <div className="flex gap-2 mb-4 flex-wrap">
                  {blog.tags.map((t: string) => (
                     <span key={t} className="text-xs font-semibold bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full">{t}</span>
                  ))}
               </div>
            )}
            <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>
            <div className="flex items-center gap-3 mb-8 text-muted-foreground">
               <div className="w-9 h-9 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-300 font-bold text-sm">
                  {blog.author?.name?.charAt(0).toUpperCase()}
               </div>
               <div>
                  <p className="text-sm font-medium text-foreground">{blog.author?.name}</p>
                  <p className="text-xs">{format(new Date(blog.createdAt), 'MMMM d, yyyy')}</p>
               </div>
            </div>
            {blog.coverImage && (
               <div className="w-full aspect-video rounded-2xl overflow-hidden mb-10 border border-white/10">
                  <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
               </div>
            )}
            {blog.excerpt && <p className="text-muted-foreground mb-8 text-lg border-l-4 border-blue-500 pl-5 italic">{blog.excerpt}</p>}
            <div className="prose prose-invert prose-blue max-w-none">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.content}</ReactMarkdown>
            </div>
         </div>
      </div>
   );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════ */
export default function ManageBlogsPage() {
   const [page, setPage] = useState(1);
   const limit = 8;
   const [view, setView] = useState<View>('list');
   const [selectedBlog, setSelectedBlog] = useState<any>(null);
   const [showPreview, setShowPreview] = useState(false);
   const [form, setForm] = useState({ title: '', content: '', excerpt: '', status: 'draft', tags: '' });
   const [coverFile, setCoverFile] = useState<File | null>(null);
   const [coverPreview, setCoverPreview] = useState<string | null>(null);

   const { data, isLoading } = useGetAdminBlogsQuery({ page, limit });
   const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
   const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
   const [deleteBlog] = useDeleteBlogMutation();

   const blogs = data?.blogs || [];
   const total = data?.total || 0;
   const totalPages = Math.ceil(total / limit);
   const publishedCount = blogs.filter((b: any) => b.status === 'published').length;
   const draftCount = blogs.filter((b: any) => b.status === 'draft').length;

   const openCreate = () => {
      setForm({ title: '', content: '', excerpt: '', status: 'draft', tags: '' });
      setCoverFile(null);
      setCoverPreview(null);
      setShowPreview(false);
      setView('create');
   };

   const openEdit = (blog: any) => {
      setSelectedBlog(blog);
      setForm({
         title: blog.title,
         content: blog.content,
         excerpt: blog.excerpt || '',
         status: blog.status,
         tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags || '',
      });
      setCoverFile(null);
      setCoverPreview(blog.coverImage || null);
      setShowPreview(false);
      setView('edit');
   };

   const backToList = () => { setView('list'); setSelectedBlog(null); };

   /** Build FormData and submit */
   const handleSubmit = async (statusOverride: string) => {
      if (!form.title.trim() || !form.content.trim()) {
         toast.error('Title and content are required.');
         return;
      }
      try {
         const fd = new FormData();
         fd.append('title', form.title);
         fd.append('content', form.content);
         fd.append('excerpt', form.excerpt);
         fd.append('status', statusOverride);
         fd.append('tags', form.tags.split(',').map(t => t.trim()).filter(Boolean).join(','));
         if (coverFile) {
            fd.append('coverImage', coverFile);
         }

         if (view === 'edit' && selectedBlog) {
            await updateBlog({ id: selectedBlog.id, data: fd }).unwrap();
            toast.success('Blog updated 🎉');
         } else {
            await createBlog(fd).unwrap();
            toast.success('Blog published 🎉');
         }
         backToList();
      } catch (err: any) {
         toast.error(err?.data?.message || 'Something went wrong');
      }
   };

   const handleDelete = async (id: string) => {
      if (!window.confirm('Delete this blog post? This cannot be undone.')) return;
      try {
         await deleteBlog(id).unwrap();
         toast.success('Blog deleted');
      } catch (err: any) {
         toast.error(err?.data?.message || 'Failed to delete');
      }
   };

   if (view === 'create' || view === 'edit') {
      return (
         <BlogEditor
            form={form} setForm={setForm}
            coverFile={coverFile} setCoverFile={setCoverFile}
            coverPreview={coverPreview} setCoverPreview={setCoverPreview}
            onSubmit={handleSubmit} onCancel={backToList}
            isSaving={isCreating || isUpdating}
            isEdit={view === 'edit'}
            showPreview={showPreview} setShowPreview={setShowPreview}
         />
      );
   }

   if (view === 'preview' && selectedBlog) {
      return <BlogPreviewPanel blog={selectedBlog} onClose={backToList} />;
   }

   return (
      <div className="space-y-6 animate-fade-in">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-2xl font-bold text-foreground">Manage Blogs</h1>
               <p className="text-sm text-muted-foreground mt-1">Create, edit, and publish your articles</p>
            </div>
            <Button onClick={openCreate} className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 text-white shadow-md shadow-blue-500/25">
               <Plus className="w-4 h-4 mr-2" /> New Post
            </Button>
         </div>

         {!isLoading && (
            <div className="grid grid-cols-3 gap-4">
               <StatCard label="Total Posts" value={total} icon={FileText} colorClass="border-border/50" />
               <StatCard label="Published" value={publishedCount} icon={Globe} colorClass="border-emerald-500/20 text-emerald-400" />
               <StatCard label="Drafts" value={draftCount} icon={ToggleLeft} colorClass="border-amber-500/20 text-amber-400" />
            </div>
         )}

         <div className="space-y-3">
            {isLoading ? (
               <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
            ) : blogs.length === 0 ? (
               <div className="text-center py-20 border border-dashed border-border rounded-2xl">
                  <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                  <h3 className="font-semibold mb-1">No blog posts yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Create your first post to get started.</p>
                  <Button onClick={openCreate} variant="outline"><Plus className="w-4 h-4 mr-2" /> Create First Post</Button>
               </div>
            ) : (
               blogs.map((blog: any) => (
                  <BlogRow key={blog.id} blog={blog}
                     onEdit={openEdit}
                     onDelete={handleDelete}
                     onPreview={(b: any) => { setSelectedBlog(b); setView('preview'); }}
                  />
               ))
            )}
         </div>

         {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
               <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
               </Button>
               <span className="text-sm text-muted-foreground px-3">
                  Page <span className="font-semibold text-foreground">{page}</span> of {totalPages}
               </span>
               <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  Next <ChevronRight className="h-4 w-4 ml-1" />
               </Button>
            </div>
         )}
      </div>
   );
}
