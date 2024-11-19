'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pause, Play, SkipForward } from 'lucide-react'

interface FlashCard {
  icon: string
  name: string
}

interface VideoData {
  videoId: string
  flashcards: FlashCard[]
}

export default function Dashboard() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const videos: VideoData[] = [
    {
      videoId: 'tMjALn2rPU4',
      flashcards: [
        { icon: '/apple.png', name: 'Apple' },
        { icon: '/ant.png', name: 'Ant' },
        { icon: '/arrow.png', name: 'Arrow' },
      ]
    },
    {
      videoId: 'DcTlthUip-Y', // Example second video
      flashcards: [
        { icon: '/car.png', name: 'Car' },
        { icon: '/cat.png', name: 'Cat' },
        { icon: '/cow.png', name: 'Cow' },
      ]
    }
  ]

  const currentVideo = videos[currentVideoIndex]

  const handleNextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
    setIsPlaying(false)
  }

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl space-y-4">
        {/* Video Player */}
        <div className="relative w-[70%] mx-auto aspect-video overflow-hidden rounded-lg bg-muted">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 my-2">
          <Button onClick={handleNextVideo} variant="outline" size="icon">
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Flashcards */}
        <div className="grid grid-cols-3 gap-2">
          {currentVideo.flashcards.map((card, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-2">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative h-16 w-16">
                    <img
                      src={card.icon}
                      alt={card.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <p className="text-center text-sm font-medium">{card.name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}