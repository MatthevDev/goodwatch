'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
})

function LoginForm() {
    const {toast} = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        }
    })

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        console.log('values', values)
        const res = await fetch('/api/userauth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
        if(res.ok) {
            const data = await res.json()
            if(!data.success) {
                if(data.usernameTaken) {
                    toast({
                        title: "Username is taken",
                        variant: "destructive",
                        duration: 2000,
                    })
                }
            } else {
                toast({
                    title: "Account created",
                    duration: 2000,
                })

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
            onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="border-0 shadow-none md:shadow-sm md:border-2 md:w-auto w-full md:mx-auto md:max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Sign Up</CardTitle>
                    <CardDescription>
                    Enter your information to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                    <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="w-full">
                        Create an account
                    </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/api/auth/signin" className="underline">
                        Sign in
                    </Link>
                    </div>
                </CardContent>
                </Card>
            </form>
        </Form>
        
    )
}

const RegisterPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm />
    </div>
  )
}

export default RegisterPage