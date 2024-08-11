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
  const lcn = cn("flex flex-row gap-8 items-center", listClassName)
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList className={lcn}>
        <NavigationMenuItem className="md:w-16 text-center">
          {/* TODO: Implement pending page */}
          <Link href="/quienessomos" legacyBehavior passHref>
            <NavigationMenuLink >
              Quienes somos
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="text-center">
          {/* TODO: Implement pending page */}
          <Link href="/blog" legacyBehavior passHref>
            <NavigationMenuLink >
              Blog
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="text-center">
          {/* TODO: Implement pending page */}
          <Link href="/quienessomos" legacyBehavior passHref>
            <NavigationMenuLink >
              Contacto
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )

}
