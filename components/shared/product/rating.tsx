import React from 'react'
import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number,
  size?: number
}

export default function Rating({ rating = 0, size = 6 }: StarRatingProps) {
  const fullStars = Math.floor(rating)
  const partialStar = rating % 1
  const emptyStars = 5 - Math.ceil(rating)

  return (
    <div className="flex items-center" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star 
          key={`full-${i}`} 
          className={`w-${size} h-${size} fill-primary text-primary`}
        />
      ))}
      {partialStar > 0 && (
        <div className="relative">
          <Star className={`w-${size} h-${size} text-primary`} />
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: `${partialStar * 100}%` }}
          >
            <Star className={`w-${size} h-${size} fill-primary text-primary`}/>
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={`w-${size} h-${size} text-gray-300`} />
      ))}
    </div>
  )
}