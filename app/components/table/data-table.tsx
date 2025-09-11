import {
  type Column,
  type ColumnDef,
  type ColumnPinningState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, type CSSProperties } from "react";

import DataTableHeaders from "./data-table-headers";
import DataTableFooter from "./data-table-footer";
import TableSkeletonLoader from "../loaders/table-skeleton-loader";
import TableHeaderOperations from "./table-header-operations";

export function getPinningStyles<TData>(column: Column<TData>): CSSProperties {
  const isPinned = column.getIsPinned();
  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  dropdownChildButton?: React.ReactElement;
  isLoading: boolean;
  searchableColumns: string[];
  getRowId: (originalRow: TData, index: number, parent?: Row<TData>) => string;
}

export function DataTable<TData, TValue>({
  data,
  columns,
  dropdownChildButton,
  isLoading,
  searchableColumns,
  getRowId,
}: DataTableProps<TData, TValue>) {
  const visibleColumns = JSON.parse(
    localStorage.getItem("visibleColumns") || "{}"
  );
  const pinnedColumns = JSON.parse(
    localStorage.getItem("pinnedColumns") || "{}"
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    visibleColumns.jobApplication || {}
  );
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(
    pinnedColumns.jobApplication || {}
  );

  const [rowSelection, setRowSelection] = useState({});

  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: parseInt(localStorage.getItem("rowsPerPage") || "5") || 5, //default page size
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination,
      columnPinning,
    },
    manualFiltering: true,
    columnResizeMode: "onChange",
    onPaginationChange: setPagination,
    getRowId,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
  });

  return (
    <>
      {/* table operations such as search, filter, hiding columns and create buttons */}
      <DataTableHeaders table={table} searchableColumns={searchableColumns}>
        {dropdownChildButton}
      </DataTableHeaders>

      <main className="space-y-4">
        <Table
          className="[&_td]:border-border [&_th]:border-border table-fixed border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b"
          style={{
            width: table.getTotalSize(),
          }}
        >
          <TableHeader className="font-secondary-header">
            {/* Table header's pin/unpin controls is inside this component */}
            <TableHeaderOperations table={table} />
          </TableHeader>
          {isLoading ? (
            <TableSkeletonLoader table={table} />
          ) : (
            <TableBody className="font-sub-text">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const { column } = cell;
                      const isPinned = column.getIsPinned();
                      const isLastLeftPinned =
                        isPinned === "left" && column.getIsLastColumn("left");
                      const isFirstRightPinned =
                        isPinned === "right" &&
                        column.getIsFirstColumn("right");

                      return (
                        <TableCell
                          key={cell.id}
                          className="[&[data-pinned][data-last-col]]:border-border data-pinned:bg-background/90 truncate data-pinned:backdrop-blur-xs [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l"
                          style={{ ...getPinningStyles(column) }}
                          data-pinned={isPinned || undefined}
                          data-last-col={
                            isLastLeftPinned
                              ? "left"
                              : isFirstRightPinned
                              ? "right"
                              : undefined
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getTotalSize()}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
        <footer className="flex justify-between items-center w-full gap-2 ">
          <DataTableFooter table={table} />
        </footer>
      </main>
    </>
  );
}
