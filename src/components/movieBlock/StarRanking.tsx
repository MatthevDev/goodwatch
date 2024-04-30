'use client'

import { cn } from "@/lib/utils"
import { Star } from "lucide-react"
import { useState } from "react"

interface StarProps {
    value: number,
    setValue: (value: number) => void,
    hoverValue: number,
    setHoverValue: (value: number) => void,
    position: number
}

const InteractiveStar = ({value, setValue,
    hoverValue, setHoverValue, position}: StarProps) => {
    return (
        <Star
        className={cn("w-6 h-6", hoverValue > position ? "text-yellow-500" : "text-gray-500")}
        onMouseEnter={() => setHoverValue(position + 1)}
        onMouseLeave={() => setHoverValue(value)}
        onClick={() => {
            if(value === position + 1) {
                setValue(0)
            } else {
                setValue(position + 1)
            }
        }}
        />
    )
}

interface StarRankingProps {
    value: number,
    setValue: (value: number) => void,
    disabled?: boolean
}

const StarRanking = ({value, setValue, disabled}: StarRankingProps) => {
    const [hoverValue, setHoverValue] = useState<number>(value)

    return (
        <div className={cn("flex space-x-2", disabled && "pointer-events-none text-gray-300")}>
            <InteractiveStar
            value={value}
            setValue={setValue}
            position={0}
            hoverValue={hoverValue}
            setHoverValue={setHoverValue} />
            <InteractiveStar
            value={value}
            setValue={setValue}
            position={1}
            hoverValue={hoverValue}
            setHoverValue={setHoverValue} />
            <InteractiveStar
            value={value}
            setValue={setValue}
            position={2}
            hoverValue={hoverValue}
            setHoverValue={setHoverValue} />
            <InteractiveStar
            value={value}
            setValue={setValue}
            position={3}
            hoverValue={hoverValue}
            setHoverValue={setHoverValue} />
            <InteractiveStar
            value={value}
            setValue={setValue}
            position={4}
            hoverValue={hoverValue}
            setHoverValue={setHoverValue} />
        </div>
    ) 
}

export default StarRanking