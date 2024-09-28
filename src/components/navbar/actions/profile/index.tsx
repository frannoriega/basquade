'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const session = useSession();

  if (session?.status == 'loading') {
    return <Avatar>
      <AvatarFallback className="animate-pulse"></AvatarFallback>
    </Avatar>
  }
  if (!session?.data?.user) {
    return <Link href="/auth/signin" className="hover:underline hover:underline-offset-8">Administrar</Link>
  }

  const avatar = session?.data?.user?.image || undefined;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage referrerPolicy='no-referrer' src={avatar} alt='Imagen de usuario'/>
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2 w-48 dark:bg-slate-800" align="end">
        <DropdownMenuItem className="dark:hover:bg-slate-700" onClick={() => router.push('/admin')}>Administrar</DropdownMenuItem>
        <DropdownMenuItem className="dark:hover:bg-slate-700" onClick={() => router.push('/pendientes')}>Pendientes</DropdownMenuItem>
        <DropdownMenuItem className="dark:hover:bg-slate-700" onClick={() => signOut()}>Cerrar sesión</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
