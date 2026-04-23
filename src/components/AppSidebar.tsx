import {
   LayoutDashboard,
   Code2,
   BookOpen,
   Trophy,
   User,
   History,
   Shield,
   Users,
   FileQuestion,
   BarChart3,
   ChevronRight,
   ChevronLeft,
   FolderTree,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarHeader,
   SidebarMenuBadge,
   SidebarMenuSub,
   SidebarMenuSubButton,
   SidebarMenuSubItem,
   useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Logo from "@/assets/logo/Logo";
import { cn } from "@/lib/utils";

interface SidebarItem {
   title: string;
   url?: string;
   icon: any;
   badge?: string;
   items?: { title: string; url: string; icon: any }[];
}

const mainItems: SidebarItem[] = [
   { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
   {
      title: "Practice",
      icon: Code2,
      items: [
         { title: "Interview Practice", url: "/interview", icon: Code2 },
         { title: "Question Bank", url: "/questions", icon: BookOpen },
      ],
   },
   { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
   { title: "History", url: "/history", icon: History, badge: "New" },
];

const accountItems: SidebarItem[] = [{ title: "Profile", url: "/profile", icon: User }];

const adminItems: SidebarItem[] = [
   { title: "Admin Dashboard", url: "/admin", icon: BarChart3 },
   { title: "Manage Users", url: "/admin/users", icon: Users },
   {
      title: "Question Management",
      icon: FileQuestion,
      items: [
         { title: "Question Bank", url: "/admin/questions", icon: BookOpen },
         { title: "Categories", url: "/admin/categories", icon: FolderTree },
      ],
   },
   { title: "Manage Interviews", url: "/admin/interviews", icon: Shield },
];

export function AppSidebar() {
   const { state, toggleSidebar } = useSidebar();
   const collapsed = state === "collapsed";
   const location = useLocation();
   const user = useAppSelector((s) => s.auth.user);
   const isAdmin = user?.role === "admin";

   const isActive = (path: string) => location.pathname === path;

   return (
      <Sidebar
         collapsible="icon"
         className="border-r border-sidebar-border bg-sidebar shadow-xl">
         <SidebarHeader className="py-4 px-4 flex flex-row items-center justify-between relative group/header transition-all duration-300 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
            <div
               className={cn(
                  "flex items-center gap-3 transition-all duration-300",
                  collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto",
               )}>
               <Logo className="w-28 object-contain" />
            </div>
            <button
               onClick={toggleSidebar}
               className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-all duration-300 hover:bg-accent hover:text-accent-foreground z-50",
                  collapsed
                     ? "absolute -right-2 top-1/2 "
                     : "absolute -right-3 top-1/2 -translate-y-1/2 opacity-100",
               )}
               title={collapsed ? "Expand" : "Collapse"}>
               {collapsed ? (
                  <ChevronRight className="h-3.5 w-3.5" />
               ) : (
                  <ChevronLeft className="h-3.5 w-3.5" />
               )}
            </button>
         </SidebarHeader>
         <SidebarContent className="px-2 py-4 group-data-[collapsible=icon]:px-0">
            <SidebarGroup>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {mainItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                           {item.items ? (
                              <Collapsible
                                 asChild
                                 className="group/collapsible">
                                 <div>
                                    <CollapsibleTrigger asChild>
                                       <SidebarMenuButton tooltip={item.title}>
                                          <item.icon className="h-4 w-4" />
                                          <span>{item.title}</span>
                                          <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                                       </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                       <SidebarMenuSub>
                                          {item.items.map((subItem) => (
                                             <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton
                                                   asChild
                                                   isActive={isActive(subItem.url)}>
                                                   <NavLink to={subItem.url}>
                                                      <span>{subItem.title}</span>
                                                   </NavLink>
                                                </SidebarMenuSubButton>
                                             </SidebarMenuSubItem>
                                          ))}
                                       </SidebarMenuSub>
                                    </CollapsibleContent>
                                 </div>
                              </Collapsible>
                           ) : (
                              <SidebarMenuButton
                                 asChild
                                 isActive={isActive(item.url)}
                                 tooltip={item.title}>
                                 <NavLink to={item.url}>
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.title}</span>
                                    {item.badge && (
                                       <SidebarMenuBadge className="bg-primary/10 text-primary font-bold group-data-[collapsible=icon]:hidden">
                                          {item.badge}
                                       </SidebarMenuBadge>
                                    )}
                                 </NavLink>
                              </SidebarMenuButton>
                           )}
                        </SidebarMenuItem>
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
               <SidebarGroupLabel className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 group-data-[collapsible=icon]:hidden">
                  Account
               </SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {accountItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                           <SidebarMenuButton
                              asChild
                              isActive={isActive(item.url)}
                              tooltip={item.title}>
                              <NavLink to={item.url}>
                                 <item.icon className="h-4 w-4" />
                                 <span>{item.title}</span>
                              </NavLink>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>

            {isAdmin && (
               <SidebarGroup className="mt-4">
                  <SidebarGroupLabel className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wider text-primary/70 group-data-[collapsible=icon]:hidden">
                     Admin Control
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                     <SidebarMenu>
                        {adminItems.map((item) => (
                           <SidebarMenuItem key={item.title}>
                              {item.items ? (
                                 <Collapsible
                                    asChild
                                    className="group/collapsible">
                                    <div>
                                       <CollapsibleTrigger asChild>
                                          <SidebarMenuButton tooltip={item.title}>
                                             <item.icon className="h-4 w-4" />
                                             <span>{item.title}</span>
                                             <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                                          </SidebarMenuButton>
                                       </CollapsibleTrigger>
                                       <CollapsibleContent>
                                          <SidebarMenuSub>
                                             {item.items.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                   <SidebarMenuSubButton
                                                      asChild
                                                      isActive={isActive(subItem.url)}>
                                                      <NavLink to={subItem.url}>
                                                         <span>{subItem.title}</span>
                                                      </NavLink>
                                                   </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                             ))}
                                          </SidebarMenuSub>
                                       </CollapsibleContent>
                                    </div>
                                 </Collapsible>
                              ) : (
                                 <SidebarMenuButton
                                    asChild
                                    isActive={isActive(item.url || "")}
                                    tooltip={item.title}>
                                    <NavLink to={item.url || ""}>
                                       <item.icon className="h-4 w-4" />
                                       <span>{item.title}</span>
                                       {item.badge && (
                                          <SidebarMenuBadge className="bg-destructive/10 text-destructive font-bold group-data-[collapsible=icon]:hidden">
                                             {item.badge}
                                          </SidebarMenuBadge>
                                       )}
                                    </NavLink>
                                 </SidebarMenuButton>
                              )}
                           </SidebarMenuItem>
                        ))}
                     </SidebarMenu>
                  </SidebarGroupContent>
               </SidebarGroup>
            )}
         </SidebarContent>
      </Sidebar>
   );
}
