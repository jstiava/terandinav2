import { cn } from "@/utilities/ui";

export function TypographyH2({children, className, style = {}} : {children : any, className?: string, style?: any}) {
  return (
    <h2 style={style} className={cn(
      "scroll-m-20 w-fit text-1xl lg:text-2xl font-garamond tracking-normal text-balance",
      className,
    )}>
      {children}
    </h2>
  )
}
