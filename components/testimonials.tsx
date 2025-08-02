'use client'

import Image from 'next/image'

const testimonials = [
    {
      name: "Alice Johnson",
      username: "alice_dev",
      avatar: "https://i.pravatar.cc/150?img=1",
      feedback: "This platform made it incredibly easy for me to validate my SaaS idea and gather real feedback from the community. A game changer for solo founders."
    },
    {
      name: "Marcus Lee",
      username: "marcuslee23",
      avatar: "https://i.pravatar.cc/150?img=2",
      feedback: "I love how collaborative the environment is. You can share an idea and instantly start a conversation with like-minded people."
    },
    {
      name: "Sofia Ramirez",
      username: "sofiaram",
      avatar: "https://i.pravatar.cc/150?img=3",
      feedback: "The voting and comment features helped me refine my concept before investing time into development. Super helpful!"
    },
    {
      name: "Daniel Cho",
      username: "dancho",
      avatar: "https://i.pravatar.cc/150?img=4",
      feedback: "As a product manager, this platform is gold. It surfaces raw ideas and lets you test demand before writing a single line of code."
    },
    {
      name: "Lina Zhang",
      username: "linaz",
      avatar: "https://i.pravatar.cc/150?img=5",
      feedback: "I followed a few users with amazing ideas. Now my feed is full of inspiration and feedback loops."
    },
    {
      name: "Ahmed El-Masry",
      username: "ahmed.codes",
      avatar: "https://i.pravatar.cc/150?img=6",
      feedback: "The platform’s simplicity and speed are what sold me. I posted an idea and got over 30 responses in a day!"
    },
    {
      name: "Jessica Kim",
      username: "jessk_dev",
      avatar: "https://i.pravatar.cc/150?img=7",
      feedback: "It's like Product Hunt but for rough drafts and early validation. Love the no-pressure vibe."
    },
    {
      name: "Liam Carter",
      username: "liamux",
      avatar: "https://i.pravatar.cc/150?img=8",
      feedback: "This space is where I go when I'm stuck or unsure about an idea. The feedback helps me reframe and iterate fast."
    },
    {
      name: "Noah Becker",
      username: "noahbuilds",
      avatar: "https://i.pravatar.cc/150?img=9",
      feedback: "A must-have if you're a builder. You get feedback, support, and even beta testers just by sharing transparently."
    },
    {
      name: "Emily Stone",
      username: "stoneem",
      avatar: "https://i.pravatar.cc/150?img=10",
      feedback: "It’s like having a cofounder and a community in one place. Feedback here is better than from generic social media."
    },
    {
      name: "Tomás Rodríguez",
      username: "tomas_rdz",
      avatar: "https://i.pravatar.cc/150?img=11",
      feedback: "I love how easy it is to discover other projects. Voting on ideas feels meaningful and helps shape good products."
    },
    {
      name: "Claire Dubois",
      username: "cdubois",
      avatar: "https://i.pravatar.cc/150?img=12",
      feedback: "The fact that you can engage anonymously or with your brand name makes this flexible and low-risk."
    },
    {
      name: "Isaac Bennett",
      username: "isaacb",
      avatar: "https://i.pravatar.cc/150?img=13",
      feedback: "I've connected with developers and designers here who ended up joining my project. Worth every post!"
    },
    {
      name: "Hannah Nguyen",
      username: "hnguyen",
      avatar: "https://i.pravatar.cc/150?img=14",
      feedback: "This community saved me from launching a product no one needed. Got direct feedback before wasting months."
    },
    {
      name: "Mohamed Al-Fayed",
      username: "fayed_m",
      avatar: "https://i.pravatar.cc/150?img=15",
      feedback: "Amazing platform. It's not just idea sharing — it's collaborative brainstorming with a sharp audience."
    },
    {
      name: "Rebecca Owens",
      username: "rebecca_dev",
      avatar: "https://i.pravatar.cc/150?img=16",
      feedback: "I post an idea here before anywhere else. The insights I get are practical and straight to the point."
    },
    {
      name: "Aditya Sharma",
      username: "adisharma",
      avatar: "https://i.pravatar.cc/150?img=17",
      feedback: "Great way to keep a log of ideas and track their evolution. The comment history is super helpful."
    },
    {
      name: "Tina Brooks",
      username: "tinab",
      avatar: "https://i.pravatar.cc/150?img=18",
      feedback: "Some users gave me monetization tips I hadn’t considered. Way better than static idea boards elsewhere."
    },
    {
      name: "Jean-Paul Meunier",
      username: "jpmeunier",
      avatar: "https://i.pravatar.cc/150?img=19",
      feedback: "I’m a designer and just observing ideas here helped me refine my UI work by seeing early product logic."
    },
    {
      name: "Chloe Kim",
      username: "chloek",
      avatar: "https://i.pravatar.cc/150?img=20",
      feedback: "It’s fun, productive, and actually motivating. I log in just to check what new things people are thinking about."
    },
]
  


export default function Testimonials() {
    const duplicatedTestimonials = [...testimonials, ...testimonials];
    const top = duplicatedTestimonials.slice(0, 20);
    const bottom = duplicatedTestimonials.slice(10, 30);
  
    return (
      <div className="w-full max-w-5xl mx-auto" id='what-people-say'>
        <div className="text-center mb-12 px-4">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            What People Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from our satisfied customers and community members
          </p>
        </div>
  
        <div className="flex flex-col gap-10 overflow-hidden py-8 relative">
          <div className="absolute inset-y-0 left-0 w-60 bg-gradient-to-r from-background to-transparent z-20 rounded-r-full" />
          <div className="absolute inset-y-0 right-0 w-60 bg-gradient-to-l from-background to-transparent z-20 rounded-l-full" />
  
          {[top, bottom].map((group, idx) => (
            <div
              key={idx}
              className="relative w-full"
            >
              <div
                className={`flex gap-6 whitespace-nowrap animate-scroll ${
                  idx % 2 === 0 ? '' : 'animate-scroll-reverse'
                } group`}
              >
                {group.map((user, i) => (
                  <div 
                    key={i}
                    className='w-[400px] flex-shrink-0 bg-muted/10 hover:bg-muted/20 border border-muted rounded-md p-6 transition-all duration-300 hover:shadow-lg backdrop-blur-sm group-hover:[animation-play-state:paused] hover:[animation-play-state:paused]'
                    onMouseEnter={e => {
                      const track = e.currentTarget.closest('.group') as HTMLElement;
                      if (track) track.style.animationPlayState = 'paused';
                    }}
                    onMouseLeave={e => {
                      const track = e.currentTarget.closest('.group') as HTMLElement;
                      if (track) track.style.animationPlayState = 'running';
                    }}
                  >
                    <div className='flex gap-3 items-center'>
                      <Image 
                        src={user.avatar} 
                        width={40} 
                        height={40} 
                        alt="user avatar" 
                        className='rounded-sm'
                      />
                      <div className='flex flex-col'>
                        <p className='font-medium text-foreground'>{user.name}</p>
                        <span className='text-sm text-muted-foreground'>@{user.username}</span>
                      </div>
                    </div>
  
                    <div className='mt-4 whitespace-normal'>
                      <span className='text-foreground/90 leading-relaxed text-sm'>{user.feedback}</span>
                    </div>
                  </div>
                ))}
              </div>
  
              <div className={`absolute inset-y-0 ${idx % 2 === 0 ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-background/50 via-background/20 to-transparent w-86 z-10 pointer-events-none`} />
            </div>
          ))}
        </div>
      </div>
    )
  }
  