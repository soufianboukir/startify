import { EditIdeaForm } from "@/components/edit-idea";
import { dbConnection } from "@/config/db";
import { authOptions } from "@/lib/auth";
import Idea from "@/models/idea";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

type PopulatedIdea = {
    _id: string;
    title: string;
    description: string;
    problem: string;
    tags: string[];
    isOpenToCollab: boolean;
    category: string;
    upVotes: string[];
    downVotes: string[];
    createdAt: Date;
    updatedAt: Date;
    
    author: {
      _id: string;
      name: string;
      username: string;
      image: string;
    };
};
  
export default async function Page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params
    const session = await getServerSession(authOptions)
    await dbConnection()
    const idea = await Idea.findById(id).populate('author', 'name username image').lean<PopulatedIdea>()
    const isUserOwner = session?.user.id === idea?.author?._id.toString();

    if (!idea) {
        return notFound();
    }
    if( !isUserOwner ){
        return notFound();
    }

    return (
        <EditIdeaForm idea={idea}/>
    )
}