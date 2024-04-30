import { hash } from 'bcrypt'
import { v4 as uuid } from 'uuid'
import { db } from '@/db'

export async function POST(request: Request) {
    const { username, password } = await request.json()
    if(!username || !password) {
        return new Response("Missing username or password", { status: 400 })
    }

    const existingUser = await db.user.findUnique({
        where: {
            name: username
        }
    })
    if(existingUser) {
        return Response.json({
            success: false,
            usernameTaken: true,
        })
    }

    const hashedPassword = await hash(password, 10)

    await db.user.create({
        data: {
            id: uuid(),
            name: username,
            hash: hashedPassword
        }
    })

    return Response.json({
        success: true
    })
}