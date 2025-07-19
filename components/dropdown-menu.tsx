import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Session } from "next-auth"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import Link from "next/link"
import { signOut } from "next-auth/react"

export function ProfileMenu({ session }: { session: Session }) {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
                {
                    session?.user.image && <AvatarImage src={session?.user.image} />
                }
                <AvatarFallback>{session?.user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuGroup>
                <DropdownMenuItem className="flex flex-col justify-start items-start gap-[-10px]">
                    <span className="font-semibold">{session.user.name}</span>
                    <span className="text-xs">{session.user.email}</span>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuGroup>
                <DropdownMenuItem>
                    <Link href={`/${session.user.username}`}>
                        My profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Saved ideas
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Account settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Keyboard shortcuts
                </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
                <Link href={'https://github.com/soufianboukir/startify'} target="_blank">
                    Github
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuItem disabled>API</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
                Log out
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}
