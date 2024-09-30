'use client'
import { signIn } from "next-auth/react"
import { googleProvider } from "@/lib/auth"
import GoogleIcon from "@/components/ui/icons/google"

type SignInParams = {
  callbackUrl?: string
}

export default function SignIn({ searchParams }: { searchParams: SignInParams }) {
  const callbackUrl = searchParams.callbackUrl ? searchParams.callbackUrl : '/';
  return (
    <div className="self-center w-full flex flex-col items-center">
      <div className="flex flex-col gap-4 items-center rounded-lg bg-green-200 dark:bg-green-900 p-4 w-fit">
        <h1 className="text-3xl font-black">Solo administradores</h1>
        <span className="max-w-prose">Este espacio esta reservado exclusivamente para administradores de la Biblioteca Basqüadé</span>
        <button onClick={() => signIn(googleProvider.id, { callbackUrl: callbackUrl })} className="flex flex-row items-stretch content-center">
          <div className="p-4 bg-slate-100 rounded-l-lg border border-slate-900 dark:border-slate-50">
            <GoogleIcon className="w-6" />
          </div>
          <span className="flex items-center rounded-r-lg border-t border-r border-b border-slate-900 dark:border-slate-50 bg-slate-100 dark:bg-slate-800 px-4">Iniciar sesión con {googleProvider.name}</span>
        </button>
      </div>
    </div>
  )

}

