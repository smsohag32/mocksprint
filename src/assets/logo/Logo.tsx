import logoImage from "@/assets/logo.webp";

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
   className?: string;
}

export default function Logo({ className, ...rest }: LogoProps) {
   return (
      <img
         src={logoImage}
         alt="MockSprint logo"
         className={className}
         {...rest}
      />
   );
}
