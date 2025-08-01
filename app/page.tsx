import { FAQs } from "@/components/faqs";
import Example from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Navbar } from "@/components/navbar";

export default function Home() {
    return (
      <div>
        <Navbar />
        <Example />
        <HowItWorks />
        <FAQs />
      </div>
    );
}
