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
import { User } from "@/interfaces/user"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Follower } from "@/interfaces/follower"

type FollowingFollowersProps = {
    type: 'following' | 'followers'
    followers?: {
        _id: string
        followerUser: User;
        createdAt: Date
    }[]
    following?: User[]
}

export function FollowingFollowers({ type, followers, following}: FollowingFollowersProps) {
    console.log(followers);
    
  return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <div className="flex items-center gap-1 text-lg cursor-pointer">
                        {
                            type === 'followers' ?
                                <>
                                    <span className="font-semibold">{followers?.length}</span>
                                    <span className='text-sm'>{type}</span>
                                </>
                            :<>
                                <span className="font-semibold">{following?.length}</span>
                                <span className='text-sm'>{type}</span>
                            </>
                        }
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Your {type}</DialogTitle>
                    <DialogDescription>
                        {type === 'followers'
                            ? 'These users are following you. You can view their profiles or follow them back.'
                            : 'These are the users you are currently following. You can visit their profiles or unfollow them at any time.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        {
                            followers && followers.length ? followers.map((follower: Follower) => (
                                <div key={follower._id}>
                                    <div className="flex gap-2 items-center">
                                        <Avatar>
                                            <AvatarImage src={follower?.followerUser?.image}/>
                                            <AvatarFallback>{follower?.followerUser?.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>

                                        <div className="flex flex-col">
                                            <span className="font-medium">{follower?.followerUser?.name}</span>
                                            <span className="text-sm">{follower?.followerUser?.username}</span>
                                        </div>
                                    </div>
                                </div>
                            )): null
                        }
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
  )
}
