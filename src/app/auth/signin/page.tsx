'use client'
import { signIn } from "next-auth/react"
import { googleProvider } from "@/lib/auth"
import GoogleIcon from "@/components/ui/icons/google"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

type SignInParams = {
  callbackUrl?: string
}

export default function SignIn({ searchParams }: { searchParams: SignInParams }) {
  const callbackUrl = searchParams.callbackUrl ? searchParams.callbackUrl : '/';
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100 dark:bg-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Iniciar sesión como administrador</CardTitle>
          <CardDescription className="text-center">
            Ingresá utilizando tu correo electrónico de Google.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full" onClick={() => signIn(googleProvider.id, { callbackUrl: callbackUrl })}>
            <GoogleIcon className="w-4 h-4 mr-2" />
            Iniciar sesión con Google
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-center w-full text-muted-foreground">
            Protegido por reCAPTCHA y sujero a la Política de Privacidad y Terminos y Condiciones de Servicio de Google.
          </p>
        </CardFooter>
      </Card>
    </div>
  )

}

