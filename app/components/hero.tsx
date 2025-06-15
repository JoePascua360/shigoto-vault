import { Button } from "@/components/ui/button";
import { ArrowBigRight, ArrowRight, ChevronRight } from "lucide-react";
import heroVault from "@/assets/hero-vault.jpg";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <section className="flex justify-center items-center h-full">
      <div className="flex gap-10 justify-between items-center">
        <aside>
          <div className="flex justify-center flex-col gap-5 items-center">
            <h1 className="text-xl md:text-5xl font-extrabold font-secondary-header">
              Track Your{" "}
              <span className="text-vault-purple">Job Applications</span>{" "}
              Easily!
            </h1>

            <div className="flex gap-5 justify-between items-center">
              <h2 className="text-md md:text-3xl font-content">
                No login needed.{" "}
                <span
                  className={`border border-amber-500 p-2 rounded-lg font-medium`}
                >
                  Jump right in!
                </span>
              </h2>
            </div>
            <Button>
              <ArrowBigRight />
              Get Started!
            </Button>
          </div>
        </aside>
        <aside>
          <motion.div
            className="shadow-lg/90 shadow-vault-purple rounded-xl"
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
              className="h-[80dvh] w-auto rounded-xl"
            />
          </motion.div>
        </aside>
      </div>
    </section>
  );
}
