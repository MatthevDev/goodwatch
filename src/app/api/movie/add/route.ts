import { db } from "@/db"

export async function POST(request: Request) {
    const { userId, movieTitle } = await request.json()
    if(!userId || !movieTitle) {
        return new Response("Missing (uerId, title)", { status: 400 })
    }

    console.log("Adding movie:", userId, movieTitle)
    const movie = await db.movie.create({
        data: {
            title: movieTitle,
            userId: userId
        }
    })

    return Response.json({
        success: true,
        movie: {
            id: movie.id,
            title: movie.title
        }
    })
}