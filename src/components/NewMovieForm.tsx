'use client'

import { Loader2, Plus } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem} from "./ui/form"
import { useToast } from "./ui/use-toast"
import { useContext, useEffect, useState } from "react"
import MovieContext from "./context/MovieContext"

const formSchema = z.object({
    title: z.string().min(1).max(100),
})

interface Props {
    userId: string
}

const NewMovieForm = ({userId}: Props) => {
    const {toast} = useToast()
    const {movies, setMovies, setAnimateLast} = useContext(MovieContext)
    const [isAddLoading, setIsAddLoading] = useState<boolean>(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        } 
    })

    useEffect(() => {
        if(form.formState.isSubmitting && !form.formState.isValid) {
            toast({
                description: "Please fill in all required fields",
                variant: "destructive",
                duration: 1000,
            })
        }
    }, [toast, form.formState.isSubmitting, form.formState.isValid])

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        setIsAddLoading(true)
        const res = await fetch('/api/movie/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                movieTitle: values.title
            }),
        }).finally(async () => {
            setIsAddLoading(false) 
        })
        if(res.ok) {
            const data = await res.json()
            if(data.success) {
                toast({
                    title: "Movie added",
                    duration: 2000,
                })
                // @ts-ignore
                setMovies((prev: Movie[]) => {
                    return [...prev, data.movie as Movie]
                })
                setAnimateLast(true)
                form.reset()
            }
        } else {
            toast({
                title: "Something went wrong...",
                variant: "destructive",
                duration: 2000,
            })
        }
    }

    return (
        <Form {...form}>
            <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex justify-between items-center space-x-4">
                <FormField
                control={form.control}
                name="title"
                render={({ field }) => {
                    return (
                        <FormItem className="w-full">
                            <FormControl>
                                <Input
                                placeholder="Title"
                                disabled={isAddLoading}
                                {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )
                }}
                />
                <Button type="submit" className="p-2" disabled={isAddLoading}>
                    {isAddLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <Plus className="w-6 h-6" />
                    )}
                </Button>
            </form>
            
        </Form>
        
    )
}

export default NewMovieForm