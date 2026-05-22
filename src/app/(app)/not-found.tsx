import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 font-mono">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        404
      </p>
      <h1 className="font-display text-5xl tracking-tight">Not found</h1>
      <p className="text-sm text-muted-foreground">
        This page does not exist.
      </p>
      <Button asChild variant="outline">
        <Link href="/">Go home</Link>
      </Button>
    </main>
  );
}
