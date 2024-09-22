'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const session = useSession();
  const sessionItem = session?.data?.user ?
    (
      <>
        <DropdownMenuItem className="dark:hover:bg-slate-700" onClick={() => router.push('/pending')}>Pendientes</DropdownMenuItem>
        <DropdownMenuItem className="dark:hover:bg-slate-700" onClick={() => signOut()}>Cerrar sesión</DropdownMenuItem>
      </>
    ) :
    <DropdownMenuItem onClick={() => signIn('google', { callbackUrl: '/admin' })}>Iniciar sesión</DropdownMenuItem>
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2 w-48 dark:bg-slate-800" align="end">
        {sessionItem}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
