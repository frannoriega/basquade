'use client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogIn } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
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
    return <Link href="/auth/signin" className="focus:bg-gray-200 dark:focus:bg-gray-700 p-2 rounded-md focus:underline-offset-8 w-fit">
      <LogIn />
    </Link>
  }

  const avatar = session?.data?.user?.image || undefined;
  return (
    <>
      <div className="hidden lg:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage referrerPolicy='no-referrer' src={avatar} alt='Imagen de usuario' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2 w-48 bg-gray-100 dark:bg-gray-800" align="end">
            <DropdownMenuItem className="focus:bg-green-200 dark:focus:bg-green-800" onClick={() => router.push('/admin')}>Administrar</DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-green-200 dark:focus:bg-green-800" onClick={() => signOut()}>Cerrar sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="lg:hidden">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <Avatar>
                <AvatarImage referrerPolicy='no-referrer' src={avatar} alt='Imagen de usuario' />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 pt-2">
              <Link href="/admin">Administrar</Link>
              <Link href="/" onClick={() => signOut()}>Cerrar sesión</Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
