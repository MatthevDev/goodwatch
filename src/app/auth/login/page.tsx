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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { useToast } from "@/components/ui/use-toast"

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"

const formSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
})

function LoginForm() {
    const {toast} = useToast()
    const params = useSearchParams()
    const error = params.get("error")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        }
    })

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        console.log('values', values)
        signIn("credentials", {
            username: values.username,
            password: values.password,
            callbackUrl: "/",
            redirect: true,
        })
    }

    return (
        <Form {...form}>
            <form
            onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="w-full md:w-auto md:mx-auto md:max-w-sm
                md:border-2 md:shadow-sm border-0 shadow-none">
                <CardHeader>
                    <CardTitle className="text-xl">Sign In</CardTitle>
                    <CardDescription>
                    Enter your information to sign in
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
                        Sign In
                    </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/register" className="underline">
                        Sign up
                    </Link>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        {error == "CredentialsSignin" && <p className="text-red-500">Invalid username or password</p>}
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