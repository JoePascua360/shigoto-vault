import { Button } from "@/components/ui/button";
import { ArrowBigRight, ArrowRight, ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="flex justify-center items-center h-svh">
      <div className="flex justify-center flex-col gap-5 items-center">
        <h1 className="text-xl md:text-5xl font-extrabold font-secondary-header">
          Track Your <span className="text-vault-purple">Job Applications</span>{" "}
          Easily!
        </h1>
        <h2 className="text-md md:text-3xl font-content">
          No login required. Try it out right away!
        </h2>
        <Button className="cursor-pointer">Get Started</Button>
      </div>
    </section>
  );
}
