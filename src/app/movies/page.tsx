'use client'
import NewMovieForm from "@/components/NewMovieForm"
import { redirect } from "next/navigation"
import MovieList from "@/components/MovieList"
import MovieContext from "@/components/context/MovieContext"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { ArrowLeftCircle, Loader2 } from "lucide-react"
import { DefaultSession } from "next-auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type UserWithId = DefaultSession["user"] & { id: string }
const Page = () => {
    const {data: session, status} = useSession({
        required: true,
        onUnauthenticated: () => {
            redirect("/")
        }
    })

    const [movies, setMovies] = useState<Movie[]>([])
    const [animateLast, setAnimateLast] = useState<boolean>(false)

    return(
        <div className="w-screen fix-mobile flex justify-center items-stretch md:items-center">
            <div className="fix-mobile grid grid-cols-1 items-stretch grid-rows-[auto,1fr,auto] space-y-4 w-full md:w-2/5 md:h-[calc(100%-4rem)] md:min-w-80 px-5 md:px-12 py-4 md:py-6 md:border md:border-zinc-200 md:shadow-md md:rounded-lg">
                <div className="flex justify-between items-center">
                    <Link href="/">
                        <Button
                        className="p-2"
                        aria-label="Go Back">
                            <ArrowLeftCircle className="w-6 h-6" />
                        </Button> 
                    </Link>
                    <h1 className="font-semibold text-xl md:text-3xl">
                        Your Movies 🎬
                    </h1>
                </div>
                <MovieContext.Provider value={{movies: movies, setMovies: setMovies, animateLast: animateLast, setAnimateLast: setAnimateLast}}>
                    {status === "loading" || !(session.user as UserWithId).id ? (
                        <Loader2 className="text-zinc-600 w-8 h-8 animate-spin" />
                    ) : (session.user as UserWithId).id ? (
                        <>
                            <div className="w-full max-h-full h-full overflow-auto">
                                <MovieList userId={(session.user as UserWithId).id} />
                            </div>
                            <div className="w-full">
                                <NewMovieForm userId={(session.user as UserWithId).id} />
                            </div>
                        </>
                    ) : null}
                </MovieContext.Provider>
            </div>
        </div>
    )
}

export default Page