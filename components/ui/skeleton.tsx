import { cn } from "@/lib/utils"

/**
 * A skeleton component that renders a simple, pulsing rectangle.
 *
 * This component is intended to be used as a placeholder while data is loading.
 * It can be used in a variety of contexts, such as in a list item or as the
 * content of a card.
 *
 * @example
 * <Skeleton />
 *
 * @example
 * <Skeleton className="h-16 w-full" />
 *
 * @param {React.HTMLAttributes<HTMLDivElement>} props
 * @returns {React.ReactElement}
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
