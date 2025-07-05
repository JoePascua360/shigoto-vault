import { ArrowRightIcon, Columns, Filter, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import DropdownMenuComponent from "./dropdown-component";
import type { Table } from "@tanstack/react-table";
import type { ReactElement } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DataTableHeadersProps<TData> {
  table: Table<TData>;
  children?: ReactElement;
}

export default function DataTableHeaders<TData>({
  table,
  children,
}: DataTableHeadersProps<TData>) {
  const isMobile = useIsMobile();

  return (
    <header className="grid grid-cols-1 sm:grid-cols-2  mb-3 gap-3">
      <section className="flex gap-2">
        <div className="relative">
          <Input
            className="peer ps-9 pe-9"
            placeholder="Search..."
            type="search"
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <SearchIcon size={16} />
          </div>
          <button
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Submit search"
            title="Click or press enter to search"
          >
            <ArrowRightIcon size={16} aria-hidden="true" />
          </button>
        </div>
        <DropdownMenuComponent
          contentAlignment="start"
          icon={<Filter />}
          triggerSize="icon"
          className="font-sub-text"
        >
          <>
            <DropdownMenuLabel>Filter By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Role</DropdownMenuItem>
          </>
        </DropdownMenuComponent>
      </section>
      <section className="flex justify-self-center sm:justify-self-end gap-3">
        <DropdownMenuComponent
          contentAlignment={children ? "start" : "end"}
          icon={<Columns />}
          triggerText={isMobile ? "" : "Hide Columns"}
          className="font-sub-text h-96"
        >
          <>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => {
                      column.toggleVisibility(!!value);
                    }}
                    onSelect={(event) => event.preventDefault()}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </>
        </DropdownMenuComponent>

        {children}
      </section>
    </header>
  );
}
