import CredentialsProvider from "next-auth/providers/credentials"
import {v4 as uuid} from 'uuid'
import { db } from "@/db"
import {compare} from 'bcrypt'


export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null
                }

                const user = await db.user.findUnique({
                    where: {
                        name: credentials.username
                    }
                })
                if(!user) {
                    return null
                }

                const isValid = await compare(credentials.password, user.hash)
                if(!isValid) {
                    return null
                }
                
                return { id: user.id, name: user.name }
            }
        }),
    ],
    callbacks: {
        async session({ session, token }: { session: any, token: any }) {
            session.user.id = token.id;
            return session
        },
        async jwt({ token, user }: { token: any, user: any }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    }
}