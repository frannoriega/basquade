import Image from "next/image";
import Header from "./components/layout/header";
import Aside from "./components/layout/aside";

export default function Home() {
  return (
    <main className="size-full">
      <Header />
      <div className=" bg-slate-600 size-full md:flex">
        <Aside />
        <div>content</div>
      </div>
    </main>
  );
}
