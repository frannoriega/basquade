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
        <Separator.Root className="self-center w-px h-7 bg-slate-900 dark:bg-slate-50" decorative orientation="vertical"/>
        <Profile />
        <ThemeButton className="h-10 w-10"/>
      </div>
      <Menu className="md:hidden" />
    </>
  );
}
