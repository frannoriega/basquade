import Links from "@/components/navbar/actions/links";
import Profile from "@/components/navbar/actions/profile";
import Menu from "@/components/navbar/actions/menu";
import ThemeButton from "../theme-button";
import * as Separator from '@radix-ui/react-separator';

export default function Actions() {
  return (
    <>
      <div className="md:flex-row hidden md:flex md:gap-8 gap-6 items-center">
        <Links/>
        <Separator.Root className="self-stretch flex items-center" orientation="vertical"/>
        <Profile />
        <ThemeButton/>
      </div>
      <Menu className="md:hidden" />
    </>
  );
}
