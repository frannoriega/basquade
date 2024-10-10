'use client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogIn, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeButton from "../../theme-button";

export default function Profile() {
  const router = useRouter();
  const session = useSession();

  if (session?.status == 'loading') {
    return <Avatar>
      <AvatarFallback className="animate-pulse"></AvatarFallback>
    </Avatar>
  }
  if (!session?.data?.user) {
    return <Link href="/auth/signin" className="focus:bg-gray-200 dark:focus:bg-gray-700 rounded-md flex flex-row gap-2 focus:underline-offset-8 w-fit">
      <LogIn className="hidden lg:block m-2"/>
      <span className="block lg:hidden p-4">
        Iniciar sesión
      </span>
    </Link>
  }

  const avatar = session?.data?.user?.image || undefined;
  return (
    <>
      <div className="hidden lg:block">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <ConfiguredAvatar avatar={avatar} />
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
            <AccordionTrigger className="mx-4 ">
              <ConfiguredAvatar avatar={avatar} />
            </AccordionTrigger>
            <AccordionContent className="p-0 flex flex-col justify-between bg-gray-200 dark:bg-gray-700">
              <Link href="/admin" className="p-2 hover:bg-green-300 dark:hover:bg-green-700">Administrar</Link>
              <Link href="/" className="p-2 hover:bg-green-300 dark:hover:bg-green-700" onClick={() => signOut()}>Cerrar sesión</Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}

function ConfiguredAvatar({ avatar }: { avatar: string | undefined } & React.ComponentProps<typeof Avatar>) {
  return (
    <Avatar>
      <AvatarImage referrerPolicy='no-referrer' src={avatar} alt='Imagen de usuario' />
      <AvatarFallback><User /></AvatarFallback>
    </Avatar>
  )
}
