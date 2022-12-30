import { Canvas } from '@react-three/fiber'
import { Clone, OrbitControls, OrthographicCamera, ContactShadows } from '@react-three/drei'
import { Debug, Physics, usePlane } from '@react-three/cannon'
import useSpline from '@splinetool/r3f-spline'
import { useCompoundBody } from '@react-three/cannon'

export default function App() {
  return (
    <Canvas flat linear>
      <color attach="background" args={['#feeaea']} />
      <directionalLight intensity={0.7} position={[20, 30, 30]} />
      <OrthographicCamera makeDefault far={10000} near={0.1} zoom={70} position={[0, 100, 1000]} />
      <hemisphereLight intensity={0.75} color="#eaeaea" position={[0, 1, 0]} />
      <Physics iterations={6} gravity={[0, -20, 0]}>
        {/** Un-comment debug component to see the compound body */}
        <Debug scale={1.1}>
          <Ground rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} />
          <Little position={[2.5, 1, 0]} rotation={[0, -0.5, 0]} />
          <Little position={[0, 2, 0]} rotation={[0.6, 0.5, 0]} />
          <Little position={[-2.5, 3, 0]} rotation={[0, -0.5, 0.8]} />
          <Big position={[0, 1, 0]} rotation={[0, 0, 0]} />
        </Debug>
      </Physics>
      <OrbitControls />
    </Canvas>
  )
}

function Little(props) {
  const { nodes } = useSpline('/bigandsmall.spline')
  console.log("pkp:  ~ file: App.js:31 ~ Little ~ nodes", nodes)
  const [little] = useCompoundBody(() => ({
    mass: 1,
    ...props,
    shapes: [
      { type: 'Sphere', args: [0.7], position: [0, -0.1, 0.1] },
      { type: 'Sphere', args: [0.2], position: [-0.1, 0.7, 0.2] },
      { type: 'Sphere', args: [0.2], position: [0, -0.5, -0.6] },
      { type: 'Sphere', args: [0.1], position: [-0.4, -0.9, 0.2] },
      { type: 'Sphere', args: [0.1], position: [0.2, -0.9, 0.5] },
    ],
  }))
  return <Clone ref={little} scale={0.01} position={[0, 0, 0]} object={nodes.Little} dispose={null} />
}

function Big(props) {
  const { nodes } = useSpline('/bigandsmall.spline')
  const [big] = useCompoundBody(() => ({
    mass: 100,
    ...props,
    shapes: [
      { type: 'Sphere', args: [2], position: [-0.2, -0.3, -0.2] },
      { type: 'Sphere', args: [0.4], position: [-0.6, 2.2, 0] },
      { type: 'Sphere', args: [0.4], position: [0.2, 2.2, 0] },
      { type: 'Sphere', args: [0.3], position: [-0.2, -0.8, 2] },
      { type: 'Sphere', args: [0.3], position: [0.8, -0.8, 2] },
      { type: 'Sphere', args: [0.3], position: [0.9, -2.4, 0.6] },
      { type: 'Sphere', args: [0.3], position: [-0.9, -2.4, 0.6] },
      { type: 'Sphere', args: [0.5], position: [-0.1, -1.8, -1.6] },
    ],
  }))
  return <Clone ref={big} scale={0.01} position={[0, 0, 0]} object={nodes.Big} dispose={null} />
}

function Ground(props) {
  usePlane(() => ({ type: 'Static', ...props }))
  return <ContactShadows position={[0, -3, 0]} scale={20} blur={2} far={3} opacity={0.75} />
}
