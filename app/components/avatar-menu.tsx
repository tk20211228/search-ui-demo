"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";
import Avatar from "@/app/images/avatar.png";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function AvatarMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="icon" variant="outline" className="rounded-full">
          <Image
            src={Avatar}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>マイアカウント</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem>
        <User className="mr-2 h-4 w-4" />
        <span>プロフィール</span>
      </DropdownMenuItem> */}
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>設定</span>
          </Link>
        </DropdownMenuItem>
        {/* <DropdownMenuSeparator />
      <DropdownMenuItem className="text-red-600 dark:text-red-400">
        <LogOut className="mr-2 h-4 w-4" />
        <span>ログアウト</span>
      </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
