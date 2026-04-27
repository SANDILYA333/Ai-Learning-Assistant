import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ParticleField from './ParticleField';

// ─── Brain Mesh ───────────────────────────────────────────────
function BrainMesh() {
  const meshRef = useRef();
  const edgesRef = useRef();

  // Crystalline geometry: IcosahedronGeometry detail=2 gives ~80 vertices
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.4, 2), []);

  // Wireframe edges for the crystalline look
  const edgesGeometry = useMemo(
    () => new THREE.EdgesGeometry(geometry),
    [geometry]
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Idle rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.08;
    }
    if (edgesRef.current) {
      edgesRef.current.rotation.y = meshRef.current.rotation.y;
      edgesRef.current.rotation.x = meshRef.current.rotation.x;
    }
  });

  return (
    <group>
      {/* Solid inner core — very transparent */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color="#FFB347"
          transparent
          opacity={0.08}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      {/* Crystalline edges */}
      <lineSegments ref={edgesRef} geometry={edgesGeometry}>
        <lineBasicMaterial color="#FFB347" transparent opacity={0.6} />
      </lineSegments>
    </group>
  );
}

// ─── Neuron Connections ────────────────────────────────────────
function NeuronConnections() {
  const linesRef = useRef();

  const { positions } = useMemo(() => {
    const baseGeom = new THREE.IcosahedronGeometry(1.4, 2);
    const pos = baseGeom.attributes.position;
    const vertices = [];
    for (let i = 0; i < pos.count; i++) {
      vertices.push(new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)));
    }

    const linePositions = [];
    const count = Math.min(50, vertices.length);
    for (let i = 0; i < count; i++) {
      const a = vertices[Math.floor(Math.random() * vertices.length)];
      const b = vertices[Math.floor(Math.random() * vertices.length)];
      linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    baseGeom.dispose();
    return { positions: new Float32Array(linePositions), lineCount: count };
  }, []);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (linesRef.current) {
      // Pulse opacity with sine wave, period ~3s
      linesRef.current.material.opacity = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.7));
      // Rotate with the brain
      linesRef.current.rotation.y += 0.002;
      linesRef.current.rotation.x = Math.sin(t * 0.3) * 0.08;
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial
        color="#FFB347"
        transparent
        opacity={0.6}
        linewidth={1}
      />
    </lineSegments>
  );
}

// ─── Brain Particles (neural pathway drift) ────────────────────
function BrainParticles() {
  const pointsRef = useRef();

  const { positions, phases } = useMemo(() => {
    const count = 300;
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Distribute on a sphere of radius ~1.8 (just outside brain)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.4 + Math.random() * 0.8;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      ph[i] = Math.random() * Math.PI * 2; // random phase offset
    }
    return { positions: pos, phases: ph };
  }, []);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3));
    return g;
  }, [positions]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position;
      for (let i = 0; i < phases.length; i++) {
        const phi = phases[i];
        // Subtle oscillation along radial direction
        const base = positions.slice(i * 3, i * 3 + 3);
        const len = Math.sqrt(base[0] ** 2 + base[1] ** 2 + base[2] ** 2);
        const offset = 0.08 * Math.sin(t * 1.5 + phi);
        const scale = (len + offset) / len;
        pos.setXYZ(i, base[0] * scale, base[1] * scale, base[2] * scale);
      }
      pos.needsUpdate = true;
      pointsRef.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#FFB347"
        size={0.03}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Scene Lights ──────────────────────────────────────────────
function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 3, 3]} color="#FFB347" intensity={2} distance={10} />
      <pointLight position={[-3, -2, -2]} color="#4FC3F7" intensity={1} distance={8} />
    </>
  );
}

// ─── Main Canvas Export ────────────────────────────────────────
export default function Brain3D({ style }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: 'none', ...style }}
    >
      <SceneLights />
      <BrainMesh />
      <NeuronConnections />
      <BrainParticles />
      <ParticleField count={1000} spread={12} />
    </Canvas>
  );
}
