import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import React, { useRef } from "react";
import * as THREE from "three";

function OrbMesh() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = Math.sin(t / 2) * 0.2;
    ref.current.rotation.y = t * 0.3;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshStandardMaterial color={new THREE.Color("#8b5cf6")} metalness={0.35} roughness={0.25} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.9, 1]} />
        <meshBasicMaterial wireframe color={"#d946ef"} opacity={0.35} transparent />
      </mesh>
    </Float>
  );
}

export default function Orb({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 2, 2]} intensity={0.8} />
        <Environment preset="city" />
        <OrbMesh />
      </Canvas>
    </div>
  );
}
