import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '../utils/motion';

function NeonOrb() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.25;
      meshRef.current.rotation.y = t * 0.32;
    }
  });

  return (
    <Float speed={1.4} floatIntensity={1} rotationIntensity={1.1}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <torusKnotGeometry args={[1.6, 0.45, 240, 32]} />
        <meshStandardMaterial
          color={'#6ddcff'}
          emissive={'#9c6bff'}
          emissiveIntensity={0.6}
          metalness={0.35}
          roughness={0.18}
        />
      </mesh>
    </Float>
  );
}

function NeonHalo() {
  return (
    <Float speed={1} floatIntensity={0.5}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.3, 2.7, 80]} />
        <meshBasicMaterial color={'#6ddcff'} opacity={0.22} transparent />
      </mesh>
    </Float>
  );
}

export default function Hero3D() {
  const reduceMotion = usePrefersReducedMotion();

  const canvas = useMemo(
    () => (
      <Canvas camera={{ position: [0, 0, 6.5], fov: 52 }} shadows>
        <color attach="background" args={[0, 0, 0]} />
        <ambientLight intensity={0.35} />
        <spotLight
          position={[6, 8, 10]}
          angle={0.6}
          intensity={1.25}
          penumbra={0.8}
          color="#9c6bff"
        />
        <pointLight position={[-6, -4, -6]} intensity={1.3} color="#6ddcff" />
        <NeonOrb />
        <NeonHalo />
      </Canvas>
    ),
    []
  );

  if (reduceMotion) {
    return (
      <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-primaryNeon/25 via-surface2 to-secondaryNeon/20" />
    );
  }

  return <div className="h-[360px] w-full overflow-hidden rounded-2xl border border-white/5 bg-black/50 shadow-neon">{canvas}</div>;
}
