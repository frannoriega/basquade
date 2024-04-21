"use client";
import Image from "next/image";
import Header from "../components/layout/header";
import Aside from "../components/layout/aside";
import Logo from "@/components/logo";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const documentId = searchParams.get("documentId");

  return (
    <div className="mx-auto mt-10 h-[2000px] w-[600px] border-4 border-dotted border-red-800 bg-white">
      {documentId ? <span>{documentId}</span> : <span>No document</span>}
    </div>
  );
}
