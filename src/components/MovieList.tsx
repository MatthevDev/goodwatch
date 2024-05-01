'use client'

import { Film, Loader2, MoreVertical, Trash2 } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import { Button } from "./ui/button"
import MovieContext from "./context/MovieContext"
import gsap from "gsap"
import { cn } from "@/lib/utils"
import { useToast } from "./ui/use-toast"
import StarRanking from "./movieBlock/StarRanking"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { describe } from "node:test"

interface Props {
    userId: string
}

const MovieBlock = ({movie, id, setMovies, userId, toast}: {movie: Movie, id: string, setMovies: (value: Movie[]) => void, userId: string, toast: Function}) => {
    const deleteMovie = async () => {
        console.log("Deleting movie")

        gsap.from(`#${movie.id}`, {
            marginBottom: 0,
            marginTop: 0,
        })
        gsap.to(`#${movie.id}`, {
            opacity: 0,
            marginBottom: -10,
            marginTop: -10,
            scaleY: 0,
            duration: 0.5,
        })

        const res = await fetch('/api/movie/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                movieId: movie.id
            }),
        })
        if(!res.ok) {
            toast({
                title: "Something went wrong...",
                variant: "destructive",
                duration: 2000,
            })
            gsap.from(`#${movie.id}`, {
                opacity: 0,
                marginBottom: -10,
                marginTop: -10,
                scaleY: 0,
                duration: 0.5,
            })
            gsap.to(`#${movie.id}`, {
                marginBottom: 8,
                marginTop: 8,
                opacity: 1,
                scaleY: 1,
                duration: 0.5,
            })
            return
        }

        gsap.to(`#${movie.id}`, {
            height: 0,
            duration: 0.5,
        })

        toast({
            title: "Movie deleted",
            variant: "default",
            duration: 1000
        })

        const timeout = setTimeout(() => {
            // @ts-ignore
            setMovies((prev: Movie[]) => {
                return prev.filter(m => m.id != movie.id)
            })
        }, 500)
    }

    const [ranking, setRanking] = useState<number>(movie.ranking)
    const [isUpating, setIsUpdating] = useState<boolean>(false)

    const updateRanking = async (value: number) => {
        const prev = movie.ranking
        setRanking(value)
        setIsUpdating(true)
        const res = await fetch('/api/movie/ranking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                movieId: movie.id,
                value: value
            }),
        }).finally(async () => {
            toast({
                title: `Movie: ${movie.title}`,
                description: "Ranking updated",
                variant: "default",
                duration: 1000
            })
            setIsUpdating(false)
        })
        if(!res.ok) {
            toast({
                title: "Something went wrong...",
                description: "Failed to update ranking",
                variant: "destructive",
                duration: 2000,
            })
            setRanking(prev)
        }
    }

    const createdTime = new Date(movie.timeCreated)

    return (
        <div id={movie.id} className={cn("bg-zinc-100 border border-zinc-300 rounded-lg px-4 py-2 my-2 flex justify-between items-center", id)}>
            <h1 className="text-xl font-medium">
                🍿 {movie.title}
            </h1>
            <div className="flex space-x-4 justify-center items-center">
                <StarRanking value={ranking} setValue={updateRanking} isLoading={isUpating} />
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <MoreVertical className="w-6 h-6 text-zinc-600 hover:text-zinc-800 transition-all" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem className="text-xs">
                            {createdTime.toLocaleString()}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={deleteMovie}
                        className="hover:cursor-pointer hover:text-red-500">
                            <Trash2 className="w-5 h-5 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

const MovieList = ({userId}: Props) => {
    const {toast} = useToast()
    const {movies, setMovies, animateLast, setAnimateLast} = useContext(MovieContext)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchMovies = async () => {
            const res = await fetch('/api/movie/getAll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId
                }),
            })
            const data = await res.json()
            setMovies(data.movies)
            setIsLoading(false)
        }
        fetchMovies()

        if(animateLast) {
            console.log("animating")
            gsap.from('.lastmovie', {
                opacity: 0,
                y: 50,
                duration: 0.5
            })
            gsap.to('.lastmovie', {
                opacity: 1,
                y: 0,
                duration: 0.5
            })
            setAnimateLast(false)
        }
    }, [userId, setMovies, animateLast, setAnimateLast])

    return (
        <div className="w-full h-full flex flex-col">
            {isLoading ? (
                <div className="w-full h-full flex justify-center items-center">
                    <Loader2 className="text-zinc-700 w-8 h-8 animate-spin" />
                </div>
            ) : (
                <div className={cn("grid grid-cols-1 items-start w-full pb-64", movies.length == 0 ? "h-full flex justify-center items-center" : "")}>
                    {movies.map((movie, i) => (
                        <MovieBlock key={movie.id}
                        toast={toast}
                        userId={userId}
                        movie={movie}
                        id={i == movies.length - 1 ? "lastmovie" : ""}
                        setMovies={setMovies}/>
                    ))}
                    {movies.length == 0 ? (
                        <div className="text-zinc-700 flex space-x-2 justify-center items-center">
                            <span className="text-xl">
                                Add your first movie!
                            </span>
                            <Film className="w-8 h-8" />
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    )
}

export default MovieList