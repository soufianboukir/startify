
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Idea } from "@/interfaces/idea"
import { EllipsisVertical } from "lucide-react"
import { DeleteDialog } from "./delete-dialog"
import { ReportDialog } from "./report-dialog"
import { ToggleSave } from "./toggle-save"


export function IdeaMenu({ isCurrentUser, idea, saved }: { isCurrentUser: boolean, idea: Idea, saved?: boolean}) {
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisVertical className="w-6 h-6"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer" asChild>
            <ToggleSave ideaId={idea._id} isSaved={saved}/>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" asChild>
            <ReportDialog ideaId={idea._id} type="Idea"/>
          </DropdownMenuItem>
          {
            isCurrentUser && (
              <DropdownMenuItem className="text-red-500 hover:text-red-600 cursor-pointer" asChild>
                <DeleteDialog ideaId={idea._id} type="Idea"/>
              </DropdownMenuItem>
            )
          }
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
