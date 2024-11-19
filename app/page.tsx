'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SkipForward } from 'lucide-react'
import Image from 'next/image'

interface FlashCard {
  icon: string
  name: string
}

interface VideoData {
  videoId: string
  flashcards: FlashCard[]
}

declare global {
  interface Window {
    YT: {
      Player: new (elementId: string, options: any) => any
      PlayerState: {
        PLAYING: number
        PAUSED: number
        ENDED: number
      }
    }
    onYouTubeIframeAPIReady: () => void
  }
}

export default function Dashboard() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set())
  const playerRef = useRef<any>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)

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
      videoId: 'DcTlthUip-Y',
      flashcards: [
        { icon: '/car.png', name: 'Car' },
        { icon: '/cat.png', name: 'Cat' },
        { icon: '/cow.png', name: 'Cow' },
      ]
    }
  ]

  const currentVideo = videos[currentVideoIndex]

  useEffect(() => {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = initializePlayer

    return () => {
      window.onYouTubeIframeAPIReady = () => {}
    }
  }, [])

  const initializePlayer = () => {
    if (playerContainerRef.current && !playerRef.current) {
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        height: '100%',
        width: '100%',
        videoId: currentVideo.videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: onPlayerReady,
        },
      })
    }
  }

  const onPlayerReady = () => {
    setIsReady(true)
  }

  useEffect(() => {
    if (isReady && playerRef.current) {
      playerRef.current.loadVideoById(currentVideo.videoId)
    }
    // Reset selected cards when changing videos
    setSelectedCards(new Set())
  }, [currentVideo, isReady])

  const handleNextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
  }

  const toggleCardSelection = (index: number) => {
    setSelectedCards((prevSelected) => {
      const newSelected = new Set(prevSelected)
      if (newSelected.has(index)) {
        newSelected.delete(index)
      } else {
        newSelected.add(index)
      }
      return newSelected
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <nav className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
        <h1 className="text-2xl font-bold">Sarah Andino&apos;s project</h1>
      </nav>
      <main className="flex-grow p-4 flex items-center justify-center">
        <div className="w-full max-w-4xl space-y-4">
          <div className="relative w-[70%] mx-auto aspect-video overflow-hidden rounded-lg bg-muted">
            <div ref={playerContainerRef} />
          </div>

          <div className="flex justify-center my-2">
            <Button onClick={handleNextVideo} variant="outline" size="icon" disabled={!isReady}>
              <SkipForward className="h-4 w-4" />
              <span className="sr-only">Next video</span>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {currentVideo.flashcards.map((card, index) => (
              <Card 
                key={index} 
                className={`overflow-hidden cursor-pointer transition-colors ${
                  selectedCards.has(index) ? 'bg-primary text-primary-foreground' : ''
                }`}
                onClick={() => toggleCardSelection(index)}
              >
                <CardContent className="p-2">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative h-16 w-16">
                      <Image
                        src={card.icon}
                        alt={card.name}
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                    <p className="text-center text-sm font-medium">{card.name}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
