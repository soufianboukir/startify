
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Idea } from "@/interfaces/idea"
import { EllipsisVertical, Flag, Save } from "lucide-react"
import { DeleteIdea } from "./delete-idea"
import { IdeaForm } from "./idea-form"


export function IdeaMenu({ isCurrentUser, idea }: { isCurrentUser: boolean, idea: Idea}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisVertical className="w-6 h-6"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          {
            isCurrentUser && (
              <DropdownMenuItem className="cursor-pointer" asChild>
                <IdeaForm idea={idea}/>
              </DropdownMenuItem>
            )
          }
          <DropdownMenuItem className="cursor-pointer">
            <Save className="w-6 h-6"/>
            Save
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Flag className="w-6 h-6"/>
            Report
          </DropdownMenuItem>
          {
            isCurrentUser && (
              <DropdownMenuItem className="text-red-500 hover:text-red-600 cursor-pointer" asChild>
                <DeleteIdea ideaId={idea._id}/>
              </DropdownMenuItem>
            )
          }
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
