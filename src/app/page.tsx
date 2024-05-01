'use client'
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const {data: session, status} = useSession()
  const router = useRouter()

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="px-24 py-12 bg-white border border-zinc-300 rounded-lg shadow-md">
        <h1 className="font-semibold text-3xl text-center mb-6">
          Welcome
        </h1>
        <div className="flex justify-center items-center space-x-4">
          {status === "loading" ? (
            <>
              <Loader2 className="text-zinc-600 w-8 h-8 animate-spin" />
            </>
          ) : status === "authenticated" ? (
            <>
              <Link
              href="/movies">
                <Button
                variant={'outline'}>
                  Open App
                </Button>
              </Link>
              <Button
              onClick={() => {
                signOut({
                  callbackUrl: "/",
                })
              }}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
              variant={"outline"}
              onClick={() => {router.push("/api/auth/signin")}}>
                Sign in 
              </Button>
              <Button
              onClick={() => {router.push("/auth/register")}}>
                Sign up
              </Button>
            </>  
          )}
        </div>
      </div>
    </div>
  );
}
