import { cn } from "@/utilities/ui";

export function TypographyH1({children, className, style = {}} : {children : any, className?: string, style?: any}) {
  return (
    <h1 style={style} className={cn(
      "scroll-m-20 w-fit text-5xl font-garamond text-balance",
      className
    )}>
      {children}
    </h1>
  )
}
