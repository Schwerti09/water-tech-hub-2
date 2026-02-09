import { Link } from "wouter";
import { Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
      <div className="mb-8 p-6 rounded-3xl bg-primary/5 text-primary">
        <Droplets className="w-16 h-16" />
      </div>
      <h1 className="text-4xl font-display font-bold mb-4 text-foreground">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Looks like this water source has dried up. Let's get you back to the main flow.
      </p>
      <Link href="/">
        <Button className="px-8 py-6 text-lg rounded-xl">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
