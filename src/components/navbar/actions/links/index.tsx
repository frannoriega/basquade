import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";

type LinksProps = {
  className?: string
  listClassName?: string
}

export default function Links({ className, listClassName }: LinksProps) {
  const lcn = cn("flex flex-row gap-8 items-center text-center", listClassName)
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList className={lcn}>
        <NavigationMenuItem>
          {/* TODO: Implement pending page */}
          <Link href="/acercade" legacyBehavior passHref>
            <NavigationMenuLink className="hover:underline hover:underline-offset-8">
              Acerca de
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          {/* TODO: Implement pending page */}
          <Link href="/quienessomos" legacyBehavior passHref>
            <NavigationMenuLink className="hover:underline hover:underline-offset-8">
              Contacto
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )

}
