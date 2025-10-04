import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google" // You can add more Providers ,refer official docs for more info
import bcrypt from "bcryptjs" // install the bcrypt package
import { dbConnect } from "@/lib/dbConnect" // Import your database file here

const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME = 2 * 60 * 60 * 1000 // 2 hours
export const runtime = "nodejs";

// Always pass authOptions in getServerSession to avoid errors
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", name: "email" },
        password: { label: "Password", type: "password", name: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        // Connect you database here
        await dbConnect()

        // Your Logic Here


        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Handle Google sign-in for students only
      if (account?.provider === "google") {
        try {
          // Import your database file here and connect the database
          await dbConnect()
          
          // Write your logic here
          
          return true
        } catch (error) {
          console.error("Error handling Google sign-in:", error)
          return false
        }
      }
      
      return true
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.name = user.name || user.email?.split("@")[0] || user.role?.toUpperCase() || "User"
        token.email = user.email
        // add more info as per your use case
      }
      if (trigger === "update" && session) {
        if (session.image) token.image = session.image
        if (session.name) token.name = session.name
      }
      return token
    },
    async session({ session, token }) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string
          // add more info as per your use case
        }
      
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  events: {
    async signIn({ user }) {
      console.log(`User ${user.email} signed in with role: ${user.role}`)
    },
    async signOut({ token }) {
      console.log(`User ${token?.email} signed out`)
    },
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
}