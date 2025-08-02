import CallToAction from "@/components/call-to-action";
import { FAQs } from "@/components/faqs";
import { Footer } from "@/components/footer";
import Hero from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Navbar } from "@/components/navbar";
import Testimonials from "@/components/testimonials";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions)

    return (
      <div>
        <Navbar session={session!}/>
        <Hero />
        <HowItWorks />
        <FAQs />
        <Testimonials />
        <CallToAction />
        <Footer />
      </div>
    );
}
