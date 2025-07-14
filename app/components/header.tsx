import { AppConfig } from "@/app.config";
import Logo from "@/app/images/logo.png";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import AvatarMenu from "./avatar-menu";

export default function Header() {
  return (
    <header className="border-b sticky top-0 z-20 bg-muted/50 backdrop-blur-sm">
      <div className="px-4 h-16 flex items-center gap-2">
        <Button asChild variant="ghost" className="font-semibold text-lg gap-2">
          <Link href="/" replace>
            <Image src={Logo} alt="Biz Search" width={40} height={40} />
            {AppConfig.title}
          </Link>
        </Button>
        <span className="flex-1" />
        <AvatarMenu />
      </div>
    </header>
  );
}
