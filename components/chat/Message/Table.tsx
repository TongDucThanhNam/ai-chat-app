import { cn } from "@/lib/utils";
import { memo } from "react";

export const TableComponent = memo(({ className, children, ...props }: any) => (
  <div className="w-full overflow-x-auto" {...props}>
    <table className={cn("w-full border-collapse", className)}>
      {children}
    </table>
  </div>
));
TableComponent.displayName = "TableComponent";

export const TheadComponent = memo(({ className, children, ...props }: any) => (
  <thead className={cn("", className)} {...props}>
    {children}
  </thead>
));

TheadComponent.displayName = "TheadComponent";

export const TbodyComponent = memo(({ className, children, ...props }: any) => (
  <tbody
    className={cn(
      "[&:hover_tr]:opacity-20 [&:hover_tr]:transition-opacity [&:hover_tr]:duration-200 [&:hover_tr]:ease-in",
      "[&_tr:hover]:opacity-100 [&_tr:hover]:transition-opacity [&_tr:hover]:duration-200 [&_tr:hover]:ease-in",
      className,
    )}
    {...props}
  >
    {children}
  </tbody>
));

TbodyComponent.displayName = "TbodyComponent";

export const TrComponent = memo(({ className, children, ...props }: any) => (
  <tr
    className={cn("border-b border-foreground/10 transition-colors", className)}
    {...props}
  >
    {children}
  </tr>
));

TrComponent.displayName = "TrComponent";

export const ThComponent = memo(({ className, children, ...props }: any) => (
  <th
    className={cn(
      "h-12 px-4 text-left align-middle font-bold text-foreground",
      "border-b-2 border-foreground/20 bg-background/80",
      "dark:border-foreground/30 dark:bg-background/90",
      className,
    )}
    {...props}
  >
    {children}
  </th>
));

ThComponent.displayName = "ThComponent";

export const TdComponent = memo(({ className, children, ...props }: any) => (
  <td
    className={cn(
      "p-4 align-middle",
      "border-b border-foreground/10",
      "hover:bg-foreground/5 hover:scale-[1.01] hover:z-[1]",
      "transition-all duration-200 ease-in-out",
      className,
    )}
    {...props}
  >
    {children}
  </td>
));

TdComponent.displayName = "TdComponent";
