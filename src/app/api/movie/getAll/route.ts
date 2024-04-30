import { db } from "@/db"

export async function POST (request: Request) {
    const { userId } = await request.json()
    if(!userId) {
        return new Response("Missing userId", { status: 400 })
    }

    const movies = await db.movie.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            timeCreated: "asc"
        }
    })

    return Response.json({
        userId: userId,
        movies: movies
    })
}