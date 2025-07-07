import { Button } from "@/components/ui/button";
import { ArrowBigRight, ArrowRight, ChevronRight } from "lucide-react";
import heroVault from "@/assets/hero-vault.jpg";
import { motion } from "motion/react";
import { LettersPullUp } from "@/components/letters-pull-up";
import { Link } from "react-router";

export default function Hero() {
  return (
    <section className="grid md:grid-cols-2 gap-10 sm:gap-5 h-full justify-items-center items-center mx-5">
      {/* Hero Image */}
      <aside className="md:order-2">
        <motion.div
          className="shadow-lg/90 shadow-vault-purple rounded-xl w-[35dvh] sm:w-[50dvh] md:w-[40dvh] lg:w-[60dvh] xl:w-[80dvh]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <img
            src={heroVault}
            alt="Vault Image"
            className="object-cover sm:object-contain rounded-xl"
          />
        </motion.div>
      </aside>
      {/* Hero Content */}

      <aside className="md:order-1 flex flex-col gap-10 lg:gap-20 items-center w-full z-50">
        {/* prettier-ignore */}
        <h1 className="text-center text-4xl sm:text-3xl leading-[1.1] md:text-4xl xl:text-6xl font-extrabold font-secondary-header break-words">
          Keep Track of Your {" "} <br className="hidden lg:inline" />
          <span className="text-vault-purple">Job Applications</span>!
        </h1>

        <div className="flex gap-2 justify-between items-center font-content">
          <h2 className="text-base md:text-xl lg:text-2xl">No login needed.</h2>
          <div className={`border border-amber-500 p-2 rounded-lg font-medium`}>
            <LettersPullUp
              text="Jump right in!"
              className="text-sm sm:text-xl md:text-xl lg:text-2xl "
            />
          </div>
        </div>
        <Button
          variant="default"
          className="h-14 font-secondary-header text-xl shadow-md shadow-vault-purple group w-50 cursor-pointer"
          asChild
        >
          <Link to="app/dashboard">
            Get Started
            <ArrowRight className="group-hover:translate-x-1 transition-all ease-in-out" />
          </Link>
        </Button>
      </aside>
    </section>
  );
}
