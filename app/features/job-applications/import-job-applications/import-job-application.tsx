import DropdownMenuComponent from "@/components/dropdown-component";
import DynamicDialog from "@/components/dynamic-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useDialog } from "@/hooks/use-dialog";
import { Import, ImportIcon, Link } from "lucide-react";
import { useState } from "react";
import { BsFiletypeCsv } from "react-icons/bs";
import ImportLinkJobApplication from "./import-link-job-application";

export default function ImportJobApplication() {
  const importLinkDialog = useDialog();

  return (
    <>
      {/* declare dialogs at top level */}
      <ImportLinkJobApplication dialog={importLinkDialog} />

      <DropdownMenuComponent
        contentAlignment="start"
        triggerText="Import"
        icon={<ImportIcon />}
        triggerConfig={{ size: "default", variant: "secondary" }}
      >
        <>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => importLinkDialog.trigger()}
          >
            <Link />
            Link
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BsFiletypeCsv className="text-green-500" />
            CSV
          </DropdownMenuItem>
        </>
      </DropdownMenuComponent>
    </>
  );
}
