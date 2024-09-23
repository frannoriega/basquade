'use client'
import { signIn } from "next-auth/react"
import { googleProvider } from "@/lib/auth"
import GoogleIcon from "@/components/ui/icons/google"

export default function SignIn() {
  return (
    <div className="self-center w-full flex flex-col items-center">
      <button onClick={() => signIn(googleProvider.id)} className="flex flex-row items-stretch content-center">
        <div className="p-4 bg-slate-100 rounded-l-lg border border-slate-900 dark:border-slate-50">
          <GoogleIcon className="w-6" />
        </div>
        <span className="flex items-center rounded-r-lg border-t border-r border-b border-slate-900 dark:border-slate-50 bg-slate-200 dark:bg-slate-800 px-4">Iniciar sesión con {googleProvider.name}</span>
      </button>
    </div>
  )

}

