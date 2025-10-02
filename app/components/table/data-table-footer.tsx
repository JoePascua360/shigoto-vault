import { useEffect, useState } from "react";
import type { Table } from "@tanstack/react-table";
import { Button } from "../ui/button";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { showToast } from "@/utils/show-toast";
import SelectComponent from "../select-component";
import { useSearchParams } from "react-router";

interface DataTableFooter<TData> {
  table: Table<TData>;
}

export default function DataTableFooter<TData>({
  table,
}: DataTableFooter<TData>) {
  const [jumpValue, setJumpValue] = useState<string>("1");

  const [searchParams, setSearchParams] = useSearchParams();
  // get the current search params in the page
  const pageParams = new URLSearchParams(searchParams);

  return (
    <div className="text-sm flex flex-col sm:flex-row gap-5 justify-between items-center w-full font-sub-text">
      <section>
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </section>
      <section className="flex flex-col sm:flex-row gap-5">
        <article className="flex flex-col md:flex-row items-center gap-5">
          <div className="flex gap-1">
            <Label htmlFor="go-to-page">Jump to</Label>
            <Input
              id="go-to-page"
              className="w-15"
              maxLength={3}
              value={jumpValue}
              onChange={(e) => {
                setJumpValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const pageNum = parseInt(jumpValue) || 1;

                  if (pageNum > table.getPageCount()) {
                    showToast(
                      "warning",
                      `Cannot exceed ${table.getPageCount()}!`,
                      1000
                    );
                  } else {
                    table.setPageIndex(pageNum - 1);
                    // only change the page value in searchParams
                    pageParams.set(`page`, String(pageNum));
                    setSearchParams(pageParams);
                  }
                }
              }}
            />
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                const pageNum = parseInt(jumpValue) || 1;

                if (pageNum > table.getPageCount()) {
                  showToast(
                    "warning",
                    `Cannot exceed ${table.getPageCount()}!`,
                    1000
                  );
                } else {
                  table.setPageIndex(pageNum - 1);
                  pageParams.set(`page`, String(pageNum));
                  setSearchParams(pageParams);
                }
              }}
              title="Click or press enter to jump to page"
            >
              <ArrowUpRight />
            </Button>
          </div>
          <div>
            <SelectComponent
              selectElementConfig={{
                isForm: false,
                placeholder: "Rows",
                position: "item-aligned",
              }}
              className="rounded-none"
              state={{
                defaultValue: localStorage.getItem("rowsPerPage") || "5",
                onValueChange(value) {
                  localStorage.setItem("rowsPerPage", value);
                  table.setPageSize(parseInt(value));
                },
              }}
            >
              <SelectGroup>
                <SelectLabel className="font-sub-text">
                  Rows Per Page
                </SelectLabel>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="250">250</SelectItem>
              </SelectGroup>
            </SelectComponent>
          </div>
          <div>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
        </article>
        <article className="flex gap-2">
          {/* first page button */}
          <Button
            size="icon"
            variant="outline"
            disabled={!table.getCanPreviousPage()}
            onClick={() => {
              table.firstPage();

              pageParams.set(`page`, String(1));
              setSearchParams(pageParams);
            }}
            title="First Page"
          >
            <ChevronsLeft />
          </Button>
          {/* prev button */}
          <Button
            size="icon"
            variant="outline"
            disabled={!table.getCanPreviousPage()}
            onClick={() => {
              table.previousPage();

              const prevPage = table.getState().pagination.pageIndex - 1;

              pageParams.set(`page`, String(prevPage + 1));
              setSearchParams(pageParams);
            }}
            title="Previous Page"
          >
            <ChevronLeft />
          </Button>
          {/* next button */}
          <Button
            size="icon"
            variant="outline"
            disabled={!table.getCanNextPage()}
            onClick={() => {
              table.nextPage();

              const nextPage = table.getState().pagination.pageIndex + 1;

              pageParams.set(`page`, String(nextPage + 1));
              setSearchParams(pageParams);
            }}
            title="Next Page"
          >
            <ChevronRight />
          </Button>
          {/* last page button */}
          <Button
            size="icon"
            variant="outline"
            disabled={!table.getCanNextPage()}
            onClick={() => {
              table.lastPage();

              const lastPageCount = table.getPageCount();

              pageParams.set(`page`, String(lastPageCount));
              setSearchParams(pageParams);
            }}
            title="Last Page"
          >
            <ChevronsRight />
          </Button>
        </article>
      </section>
    </div>
  );
}
