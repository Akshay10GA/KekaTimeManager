import { useThree, useLoader } from '@react-three/fiber'
import { useVideoTexture } from '@react-three/drei'
import { TextureLoader } from 'three'

function Background() {
  const { scene } = useThree()
  const texture = useVideoTexture('/AI-baby.mp4', {
    loop: true,
    muted: true,
    autoplay: true,
  })

  scene.background = texture
  return null
}

export default Background;