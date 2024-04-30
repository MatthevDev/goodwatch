import { db } from "@/db"

export async function POST(request: Request) {
    const { userId, movieId } = await request.json()
    if(!userId || !movieId)
        return new Response("Missing userId or movieId", { status: 400 })

    const movie = await db.movie.findUnique({
        where: {
            id: movieId,
            userId: userId,
        }
    })
    if(!movie) {
        return new Response("Movie not found", { status: 404 })
    }

    await db.movie.delete({
        where: {
            id: movieId,
            userId: userId
        }
    })

    return new Response("Movie deleted", { status: 200 })
}