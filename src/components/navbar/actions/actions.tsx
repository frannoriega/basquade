import VLine from "@/components/navbar/actions/vline";
import Links from "@/components/navbar/actions/links";
import Profile from "@/components/navbar/actions/profile";
import Menu from "@/components/navbar/actions/menu";

export default function Actions() {
  return (
    <>
      <div className="flex-row hidden md:flex md:gap-8 gap-6 items-center">
        <Links />
        <VLine />
        <Profile />
      </div>
      <Menu className="md:hidden" />
    </>
  );
}
