import { ModeToggle } from "@/components/mode-toggle";

export default function Footer() {
  return (
    <footer className="border-t sticky top-full bg-muted/50">
      <div className="px-4 h-16 gap-1 flex items-center">
        <p className="text-muted-foreground">&copy; TK</p>
        <span className="flex-1"></span>
        <ModeToggle />
      </div>
    </footer>
  );
}
