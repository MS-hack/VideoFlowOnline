import * as React from 'react'
import VideoPlayer from './components/VideoPlayer'
import { useState } from 'react'

export const VideoPlayerComponent = () => {
  const [cardImage, setCardImage] = useState()
  return (
    <div className='player-wrapper'>
      <VideoPlayer
        onCapture={(blob: any) => {
          setCardImage(blob)
        }}
      />
      {cardImage && (
        <div>
          <h2>Preview</h2>
          <img src={cardImage && URL.createObjectURL(cardImage)} />
        </div>
      )}
    </div>
  )
}
