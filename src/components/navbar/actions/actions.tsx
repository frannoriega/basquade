import Links from "@/components/navbar/actions/links";
import Profile from "@/components/navbar/actions/profile";
import Menu from "@/components/navbar/actions/menu";
import VLine from "@/components/navbar/actions/vline";

export default function Actions() {
  return (
    <>
      <div className="md:flex-row hidden md:flex md:gap-8 gap-6 items-center">
        <Links/>
        <VLine className="self-stretch flex items-center" lineClassName="h-3/5 bg-black"/>
        <Profile />
      </div>
      <Menu className="md:hidden" />
    </>
  );
}
