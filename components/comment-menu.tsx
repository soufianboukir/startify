import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical } from "lucide-react"
import { DeleteDialog } from "./delete-dialog"
import { ReportDialog } from "./report-dialog"

export function CommentActions({ isCurrentUser, commentId }: { isCurrentUser: boolean, commentId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisVertical className="w-6 h-6"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer" asChild>
            <ReportDialog commentId={commentId} type="Comment"/>
          </DropdownMenuItem>
          {
            isCurrentUser && (
              <DropdownMenuItem asChild>
                <DeleteDialog commentId={commentId} type="Comment"/>
              </DropdownMenuItem>
            )
          }
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}