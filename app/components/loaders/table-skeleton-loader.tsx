import type { Table } from "@tanstack/react-table";
import { getPinningStyles } from "../table/data-table";
import { Skeleton } from "../ui/skeleton";
import { TableBody, TableCell, TableRow } from "../ui/table";

interface TableSkeletonLoaderProps<TData> {
  table: Table<TData>;
}

export default function TableSkeletonLoader<TData>({
  table,
}: TableSkeletonLoaderProps<TData>) {
  return (
    <TableBody>
      {Array.from({ length: table.getState().pagination.pageSize }).map(
        (_, rowIndex) => (
          <TableRow key={rowIndex}>
            {table.getVisibleFlatColumns().map((column, colIndex) => {
              const isPinned = column.getIsPinned();
              const isLastLeftPinned =
                isPinned === "left" && column.getIsLastColumn("left");
              const isFirstRightPinned =
                isPinned === "right" && column.getIsFirstColumn("right");

              return (
                <TableCell
                  key={colIndex}
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
                  <Skeleton className="animate-pulse h-12 w-full" />
                </TableCell>
              );
            })}
          </TableRow>
        )
      )}
    </TableBody>
  );
}
