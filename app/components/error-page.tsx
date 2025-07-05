import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ErrorPageProps {
  error: Error;
}

export default function ErrorPage({ error }: ErrorPageProps) {
  return (
    <>
      <title>Error Page! | Shigoto Vault</title>
      <meta property="og:title" content="Error! Something went wrong!" />
      <meta name="description" content="Something went wrong in this page!" />

      <main className="flex justify-center items-center h-full">
        <section className="grid grid-cols-1 justify-items-center gap-5 w-full">
          <aside className="flex flex-col gap-10 justify-center items-center">
            <div>
              <h1 className="text-6xl sm:text-8xl  text-center text-red-500 font-primary-header">
                500 {error.name}
              </h1>
              <h2 className="text-4xl sm:text-7xl font-primary-header">
                Something went wrong!
              </h2>
            </div>
            <div className="grid justify-items-center gap-5">
              <p className="text-base sm:text-xl text-center font-sub-text break-words w-[90%]">
                Error Message:{" "}
                <span className="text-red-500">{error.message}</span>
              </p>
              <Button className="h-12">
                Report this Error
                <ArrowRight />
              </Button>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}
