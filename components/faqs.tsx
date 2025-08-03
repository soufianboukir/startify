import React from 'react'


const faqs = [
    {
      question: "What is this platform about?",
      answer:
        "This platform is a space where creators, entrepreneurs, and curious thinkers can share startup, SaaS, or product ideas and receive real feedback from the community. It’s designed to spark innovation and improve ideas through collaboration."
    },
    {
      question: "Do I need an account to browse ideas?",
      answer:
        "Yes, you need an account to explore ideas, this helps as know what you like and what you don't also to comment, vote, or follow users, you’ll need to create an account so your actions can be saved and personalized."
    },
    {
      question: "How can I post an idea?",
      answer:
        "After signing in, go to the 'Post an Idea' section. Fill out the title, description, and optionally attach visuals or links. Once submitted, your idea will be visible to the community for feedback and interaction."
    },
    {
      question: "What happens after I post an idea?",
      answer:
        "Once published, your idea becomes visible to others who can upvote, comment, or share insights. You can engage in discussions, receive constructive criticism, and refine your concept based on community input."
    },
    {
      question: "Can I delete or edit my idea?",
      answer:
        "Yes, you're allowed to edit or delete your ideas at any time through your profile dashboard. This ensures you can iterate or remove posts based on feedback or personal preference."
    },
    {
      question: "Is feedback from users moderated?",
      answer:
        "Comments and reports are reviewed to maintain respectful and valuable discussions. Users can report inappropriate content, and moderation tools are in place to handle abuse or spam."
    }
];

  
export const FAQs = () => {
    return (
        <div className='min-h-screen lg:px-[6%] md:px-8 px-5 py-24 flex gap-6 md:flex-row flex-col md:gap-0 md:justify-between' id='faqs'>
            <div className='md:w-[40%]'>
                <h1 className='text-3xl font-semibold'>Frequently Asked Questions</h1>
            </div>
            <div className='md:w-[55%] flex flex-col gap-5'>
                {
                    faqs.map((faq, index) => (
                        <div key={index}>
                            <h1 className='text-xl font-semibold'>{faq.question}</h1>
                            <span className='text-sm'>{faq.answer}</span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
