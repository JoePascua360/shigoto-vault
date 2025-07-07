import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import notFoundImg from "@/assets/not-found-bg.jpg";

export default function MissingPage() {
  const location = useLocation();

  const isInsideApp = location.pathname.includes("/app/");
  return (
    <>
      <title>Page Not Found | Shigoto Vault</title>
      <meta property="og:title" content="Page Not Found" />
      <meta name="description" content="Missing Page!" />

      <main className={`flex justify-center items-center h-full`}>
        <section className="grid grid-cols-1 xl:grid-cols-2 justify-items-center gap-5 w-full">
          <aside className="flex flex-col gap-10 justify-center items-center">
            <div>
              <h1 className="text-8xl text-center text-vault-purple font-primary-header">
                404
              </h1>
              <h2 className="text-5xl sm:text-7xl font-primary-header">
                Page Not Found!
              </h2>
            </div>
            <div className="grid justify-items-center gap-3">
              <p className="text-base sm:text-xl text-center font-sub-text break-words">
                Sorry, the page you're looking for does not exist.
              </p>
              <Button asChild>
                <Link to={isInsideApp ? "/app/dashboard" : "/"}>
                  <ArrowLeft />
                  Go back home
                </Link>
              </Button>
            </div>
          </aside>
          <aside className="hidden w-[450px] xl:block  xl:w-[500px] 2xl:w-[600px]">
            <img
              src={notFoundImg}
              alt="Desert Image"
              className="object-contain rounded-xl"
            />
          </aside>
        </section>
      </main>
    </>
  );
}
