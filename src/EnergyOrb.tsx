import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface EnergyOrbProps {
  distance: number
  isActive: boolean
}

const EnergyOrb = ({ distance, isActive }: EnergyOrbProps) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<THREE.Points | null>(null)
  const lightRef = useRef<THREE.PointLight | null>(null)
  const animationSpeedRef = useRef<number>(1)
  const targetSpeedRef = useRef<number>(1)

  useEffect(() => {
    if (!mountRef.current) return

    const currentMount = mountRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 127 / 127, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(127, 127)
    renderer.setPixelRatio(window.devicePixelRatio)
    currentMount.appendChild(renderer.domElement)

    camera.position.z = 1.5

    const light = new THREE.PointLight(0x00ffff, 1, 10)
    light.position.set(0, 0, 0)
    lightRef.current = light
    scene.add(light)

    const particlesCount = 2000
    const positions = new Float32Array(particlesCount * 3)
    const velocities = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 0.9 + Math.random() * 0.1

      const i3 = i * 3
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)

      velocities[i3] = (Math.random() - 0.5) * 0.001
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.001
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.001
    }

    const particlesGeometry = new THREE.BufferGeometry()
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x8b5cf6, // สีม่วงอวกาศ (Purple space)
      size: 0.012,     // ลดขนาดจาก 0.02 เป็น 0.012
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    particlesRef.current = particles
    scene.add(particles)

    let time = 0

    const animate = () => {
      requestAnimationFrame(animate)

      animationSpeedRef.current += (targetSpeedRef.current - animationSpeedRef.current) * 0.1

      time += 0.01 * animationSpeedRef.current

      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.002 * animationSpeedRef.current
        particlesRef.current.rotation.x += 0.001 * animationSpeedRef.current

        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

        for (let i = 0; i < particlesCount; i++) {
          const i3 = i * 3

          const x = positions[i3]
          const y = positions[i3 + 1]
          const z = positions[i3 + 2]

          const currentRadius = Math.sqrt(x * x + y * y + z * z)
          const targetRadius = 0.9

          const normalizedX = x / currentRadius
          const normalizedY = y / currentRadius
          const normalizedZ = z / currentRadius

          positions[i3] += (normalizedX * targetRadius - x) * 0.01 + velocities[i3] * animationSpeedRef.current
          positions[i3 + 1] += (normalizedY * targetRadius - y) * 0.01 + velocities[i3 + 1] * animationSpeedRef.current
          positions[i3 + 2] += (normalizedZ * targetRadius - z) * 0.01 + velocities[i3 + 2] * animationSpeedRef.current

          positions[i3] += Math.sin(time + i * 0.1) * 0.001 * animationSpeedRef.current
          positions[i3 + 1] += Math.cos(time + i * 0.1) * 0.001 * animationSpeedRef.current
          positions[i3 + 2] += Math.sin(time * 1.5 + i * 0.1) * 0.001 * animationSpeedRef.current
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true
      }

      if (lightRef.current) {
        lightRef.current.intensity = 1 + Math.sin(time * 3) * 0.3 * animationSpeedRef.current
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      if (currentMount && renderer.domElement.parentNode === currentMount) {
        currentMount.removeChild(renderer.domElement)
      }
      renderer.dispose()
      particlesGeometry.dispose()
      particlesMaterial.dispose()
    }
  }, [])

  useEffect(() => {
    if (!particlesRef.current || !lightRef.current) return

    const material = particlesRef.current.material as THREE.PointsMaterial
    const light = lightRef.current

    if (isActive) {
      targetSpeedRef.current = 5

      if (distance < 10) {
        material.color.setHex(0x00ff00)
        material.size = 0.06
        material.opacity = 1
        light.color.setHex(0x00ff00)
        light.intensity = 3
      } else if (distance < 25) {
        material.color.setHex(0xffff00)
        material.size = 0.055
        material.opacity = 0.95
        light.color.setHex(0xffff00)
        light.intensity = 2.5
      } else if (distance < 50) {
        material.color.setHex(0xff6600)
        material.size = 0.05
        material.opacity = 0.9
        light.color.setHex(0xff6600)
        light.intensity = 2
      } else {
        material.color.setHex(0xff0000)
        material.size = 0.045
        material.opacity = 0.85
        light.color.setHex(0xff0000)
        light.intensity = 1.5
      }

      setTimeout(() => {
        targetSpeedRef.current = 1
        material.color.setHex(0x00ffff)
        material.size = 0.03
        material.opacity = 0.8
        light.color.setHex(0x00ffff)
        light.intensity = 1
      }, 1000)
    }
  }, [distance, isActive])

  return (
    <div
      ref={mountRef}
      style={{
        width: '127px',
        height: '127px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
      }}
    />
  )
}

export default EnergyOrb
