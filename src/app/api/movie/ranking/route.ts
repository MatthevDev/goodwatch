import { db } from "@/db"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get("userId")
    const movieId = request.nextUrl.searchParams.get("movieId")
    if(!userId || !movieId) {
        return new Response("Missing userId or movieId", { status: 400 })
    }

    const movie = await db.movie.findUnique({
        where: {
            id: movieId,
            userId: userId
        }
    })

    if(!movie) {
        return new Response("Movie not found", { status: 404 })
    }

    return Response.json({
        ranking: movie.ranking
    })
}

export async function POST(request: NextRequest) {
    const {userId, movieId, value} = await request.json()

    if(!userId || !movieId || value == null) {
        return new Response("Missing userId, movieId or value", { status: 400 })
    }

    if(value < 0 || value > 5) {
        return new Response("Value must be between 0 and 5", { status: 400 })
    }

    const movie = await db.movie.findUnique({
        where: {
            id: movieId,
            userId: userId
        }
    })
    if(!movie) {
        return new Response("Movie not found", { status: 404 })
    }

    await db.movie.update({
        where: {
            id: movieId,
            userId: userId
        },
        data: {
            ranking: value
        }
    })

    return new Response("Ranking updated", { status: 200 })
}