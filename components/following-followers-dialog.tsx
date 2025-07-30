'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import Link from "next/link"
import { DeleteDialog } from "./delete-dialog"
import { Follower, Following } from "@/interfaces/follower"
import { FollowButton } from "./follow-btn"

type FollowingFollowersProps = {
  type: 'following' | 'followers'
  followers?: Follower[]
  following?: Following[]
}

export function FollowingFollowers({ type, followers = [], following = [] }: FollowingFollowersProps) {
    const list = type === 'followers' ? followers : following
    const isFollowers = type === 'followers'

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex items-center gap-1 text-lg cursor-pointer">
                    <span className="font-semibold">{list.length}</span>
                    <span className='text-sm'>{type}</span>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                <DialogTitle>Your {type}</DialogTitle>
                <DialogDescription>
                    {isFollowers
                    ? 'These users are following you. You can view their profiles or remove them.'
                    : 'These are the users you are currently following. You can visit their profiles or unfollow them.'}
                </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 max-h-[500px] overflow-auto">
                {list.map((entry) => {
                    const user = isFollowers
                    ? (entry as Follower).followerUser
                    : (entry as Following).followingUser

                    return (
                    <div key={entry._id} className="flex justify-between items-center bg-gray-100 dark:bg-muted/30 cursor-pointer duration-100 px-2 py-1 rounded-md">
                        <div className="flex gap-2 items-center">
                            <Avatar>
                                <AvatarImage src={user?.image || ''} />
                                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <Link href={`/${user?.username}`} className="font-medium hover:underline">{user?.name}</Link>
                                <span className="text-sm">@{user?.username}</span>
                            </div>
                        </div>
                        {
                            isFollowers && user?._id && <DeleteDialog followerId={user?._id} type={'Follower'} />
                        }
                        {
                            !isFollowers && user?._id && <FollowButton userId={user?._id} isFollowing={true}/>
                        }
                    </div>
                    )
                })}
                </div>

                <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
