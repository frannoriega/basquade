import Image from "next/image";
import Header from "../components/layout/header";
import Aside from "../components/layout/aside";
import Logo from "@/components/logo";

export default function Home() {
  return (
    <main className="size-full flex">
      <div className="bg-red-500 flex flex-col w-3/12">
        <Logo />
        <Aside />
      </div>
      <Header />
      {/* <div className=" bg-slate-600 size-full md:flex">
        <div>content</div>
      </div> */}
    </main>
  );
}
