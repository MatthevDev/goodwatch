import { createContext } from "react";

const MovieContext = createContext({
    movies: <Movie[]>[],
    setMovies: (value: Movie[]) => {},
    animateLast: false,
    setAnimateLast: (value: boolean) => {}
})

export default MovieContext