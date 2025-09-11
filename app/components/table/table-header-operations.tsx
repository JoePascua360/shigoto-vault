import { flexRender, type Header, type Table } from "@tanstack/react-table";
import { TableHead, TableRow } from "@/components/ui/table";
import { getPinningStyles } from "./data-table";
import { Button } from "../ui/button";
import { capitalizeFirstLetter } from "better-auth/react";
import {
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  EllipsisIcon,
  PinOffIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 *
 * Allows column pinning to persist by saving it on local storage
 *
 * @param header - derived from the objects inside the Table property in tanstack table
 * @param columnPinDirection - whether a column is pinned in first or last column
 * @param isUnpin - whether the current button is for unpin operation or not
 */
function pinColumn<TData>(
  header: Header<TData, unknown>,
  columnPinDirection: "left" | "right",
  isUnpin: boolean
) {
  const pinnedColumns = JSON.parse(
    localStorage.getItem("pinnedColumns") || "{}"
  );

  const currentDirection: string[] =
    pinnedColumns?.jobApplication?.[columnPinDirection] || [];

  let updatedDirection: string[] = [];

  if (isUnpin) {
    updatedDirection = currentDirection.filter((id) => id !== header.column.id);
  } else {
    updatedDirection = [...currentDirection, header.column.id];
  }

  localStorage.setItem(
    "pinnedColumns",
    JSON.stringify({
      jobApplication: {
        ...(pinnedColumns.jobApplication || {}),
        [columnPinDirection]: updatedDirection,
      },
    })
  );
}

interface TableHeaderOperationsProps<TData> {
  table: Table<TData>;
}

export default function TableHeaderOperations<TData>({
  table,
}: TableHeaderOperationsProps<TData>) {
  return (
    <>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="bg-muted/50">
          {headerGroup.headers.map((header) => {
            const { column } = header;
            const isPinned = header.column.getIsPinned();
            const isLastLeftPinned =
              isPinned === "left" && header.column.getIsLastColumn("left");
            const isFirstRightPinned =
              isPinned === "right" && header.column.getIsFirstColumn("right");

            return (
              <TableHead
                key={header.id}
                className="[&[data-pinned][data-last-col]]:border-border data-pinned:bg-muted/90 relative h-10 truncate border-t data-pinned:backdrop-blur-xs [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:border-l"
                colSpan={header.colSpan}
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
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </span>
                  {/* Pin/Unpin column controls */}
                  {!header.isPlaceholder &&
                    header.column.getCanPin() &&
                    (header.column.getIsPinned() ? (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="mr-0.5 size-7 shadow-none"
                        onClick={() => {
                          header.column.pin(false);
                          // determine which direction column is pinned
                          const pinnedSide = header.column.getIsPinned();
                          if (pinnedSide) {
                            pinColumn(header, pinnedSide, true);
                          }
                        }}
                        aria-label={`Unpin ${capitalizeFirstLetter(
                          header.column.id
                        )} column`}
                        title={`Unpin ${capitalizeFirstLetter(
                          header.column.id
                        )} column`}
                      >
                        <PinOffIcon
                          className="opacity-60"
                          size={16}
                          aria-hidden="true"
                        />
                      </Button>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="mr-1 size-7 shadow-none"
                            aria-label={`Pin options for ${capitalizeFirstLetter(
                              header.column.id
                            )} column`}
                            title={`Pin options for ${capitalizeFirstLetter(
                              header.column.id
                            )} column`}
                          >
                            <EllipsisIcon
                              className="opacity-60"
                              size={16}
                              aria-hidden="true"
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              header.column.pin("left");
                              pinColumn(header, "left", false);
                            }}
                          >
                            <ArrowLeftToLineIcon
                              size={16}
                              className="opacity-60"
                              aria-hidden="true"
                            />
                            Stick to left
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              header.column.pin("right");
                              pinColumn(header, "right", false);
                            }}
                          >
                            <ArrowRightToLineIcon
                              size={16}
                              className="opacity-60"
                              aria-hidden="true"
                            />
                            Stick to right
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ))}
                  {header.column.getCanResize() && (
                    <div
                      {...{
                        onDoubleClick: () => header.column.resetSize(),
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className:
                          "absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:-translate-x-px",
                      }}
                    />
                  )}
                </div>
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </>
  );
}
