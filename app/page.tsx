import CallToAction from "@/components/call-to-action";
import { FAQs } from "@/components/faqs";
import { Footer } from "@/components/footer";
import Example from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Navbar } from "@/components/navbar";
import Testimonials from "@/components/testimonials";

export default function Home() {
    return (
      <div>
        <Navbar />
        <Example />
        <HowItWorks />
        <FAQs />
        <Testimonials />
        <CallToAction />
        <Footer />
      </div>
    );
}
