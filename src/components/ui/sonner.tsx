import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      expand={true}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg data-[rich-colors=true]:data-[type=success]:!bg-green-600 data-[rich-colors=true]:data-[type=success]:!text-white data-[rich-colors=true]:data-[type=success]:!border-green-700 data-[rich-colors=true]:data-[type=error]:!bg-red-600 data-[rich-colors=true]:data-[type=error]:!text-white data-[rich-colors=true]:data-[type=error]:!border-red-700 data-[rich-colors=true]:data-[type=warning]:!bg-amber-500 data-[rich-colors=true]:data-[type=warning]:!text-white data-[rich-colors=true]:data-[type=warning]:!border-amber-600",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
