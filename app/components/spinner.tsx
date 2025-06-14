import { LoaderCircle } from "lucide-react";

interface Props {
  isLoading: boolean;
}

export default function Spinner({ isLoading = false }: Props) {
  return (
    <main
      className="h-dvh"
      role="main"
      aria-busy="true"
      aria-label="Loading content"
    >
      <div className="flex justify-center items-center h-full">
        <LoaderCircle className={`w-30 h-30 ${isLoading && "animate-spin"}`} />
        <span className="sr-only">Loading Spinner Icon</span>
      </div>
    </main>
  );
}
