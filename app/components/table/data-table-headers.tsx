import { ArrowRightIcon, Columns, Filter, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import DropdownMenuComponent from "../dropdown-component";
import type { Table } from "@tanstack/react-table";
import { useState, type ReactElement } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation, useSearchParams } from "react-router";
import { SelectGroup, SelectItem, SelectLabel } from "@/components/ui/select";
import SelectComponent from "../select-component";

interface DataTableHeadersProps<TData> {
  table: Table<TData>;
  children?: ReactElement;
  searchableColumns: string[];
}

export default function DataTableHeaders<TData>({
  table,
  children,
  searchableColumns,
}: DataTableHeadersProps<TData>) {
  const isMobile = useIsMobile();

  const location = useLocation();
  const currentPath = location.pathname.replace("/app/", "");

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState("");

  const [column, setColumn] = useState(
    localStorage.getItem(`${currentPath}SearchColumn`) || "role"
  );

  return (
    <header className="grid grid-cols-1 lg:grid-cols-2  mb-3 gap-3">
      <section className="flex flex-wrap gap-2">
        {/* search input */}
        <article className="flex">
          <SelectComponent
            selectElementConfig={{
              placeholder: "Select Column",
              position: "popper",
              isForm: false,
            }}
            className="rounded-none"
            state={{
              value: column,
              onValueChange(value) {
                localStorage.setItem(`${currentPath}SearchColumn`, value);
                setColumn(value);
              },
            }}
          >
            <SelectGroup>
              <SelectLabel>Searchable columns</SelectLabel>
              {searchableColumns.map((column, index) => {
                return (
                  <SelectItem key={index} value={column}>
                    {column}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectComponent>
          <div className="relative">
            <Input
              className="peer ps-9 pe-9 rounded-none border-l-0"
              placeholder="Search..."
              type="search"
              value={searchValue}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (searchValue) {
                    setSearchParams(
                      new URLSearchParams({
                        [`${currentPath}SearchParams`]: searchValue,
                      })
                    );
                  }
                }
              }}
              onChange={(e) => {
                // used to specify whether search is enabled since searchParams is empty.
                if (e.target.value === "") {
                  setSearchParams("");
                  setSearchValue(e.target.value);
                } else {
                  setSearchValue(e.target.value);
                }
              }}
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
            <button
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              aria-label="Submit search"
              title="Click or press enter to search"
              onClick={() => {
                if (searchValue) {
                  setSearchParams(
                    new URLSearchParams({
                      [`${currentPath}SearchParams`]: searchValue,
                    })
                  );
                }
              }}
            >
              <ArrowRightIcon size={16} aria-hidden="true" />
            </button>
          </div>
        </article>
        {/* Filters */}
        <article>
          <DropdownMenuComponent
            contentAlignment="start"
            icon={<Filter />}
            triggerConfig={{ size: "icon", variant: "outline" }}
            triggerTitle="Filter by status"
            className="font-sub-text"
          >
            <>
              <DropdownMenuLabel>Filter By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Role</DropdownMenuItem>
            </>
          </DropdownMenuComponent>
        </article>
      </section>
      <section className="flex justify-self-center sm:justify-self-end gap-2">
        <DropdownMenuComponent
          contentAlignment={children ? "start" : "end"}
          icon={<Columns />}
          triggerText={isMobile ? "" : "Hide Columns"}
          triggerConfig={{ variant: "outline" }}
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
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
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
