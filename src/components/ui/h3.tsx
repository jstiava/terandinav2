import { cn } from "@/utilities/ui";

export function TypographyH3({children, className, style = {}} : {children : any, className?: string, style?: any}) {
  return (
    <h3 style={style} className={cn(
      "scroll-m-20 w-fit text-3xl font-gloock tracking-normal text-balance",
      className,
    )}>
      {children}
    </h3>
  )
}
