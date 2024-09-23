import NextAuth, { Account, Profile, User } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { getAdmins } from "@/lib/db/admins"
import { AdapterUser } from "next-auth/adapters"
import { CredentialInput } from "next-auth/providers/credentials"
import { signIn } from "next-auth/react"

type SignInParams = {
  user: User | AdapterUser,
  account: Account | null,
  profile?: Profile
  email?: {
    verificationRequest?: boolean
  },
  credentials?: Record<string, CredentialInput>
}

export const googleProvider = GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
})

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET as string,
  // Configure one or more authentication providers
  providers: [
    googleProvider,
    // ...add more providers here
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  callbacks: {
    async signIn({ user }: SignInParams) {
      const admins = await getAdmins()
      const isAllowedToSignIn = admins.some((admin, _) => admin.email === user.email)
      if (isAllowedToSignIn) {
        return true
      } else {
        // Return false to display a default error message
        return '/unauthorized'
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
  }
}

export default NextAuth(authOptions)
