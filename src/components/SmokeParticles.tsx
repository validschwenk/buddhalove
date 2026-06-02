'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

// 전역 마우스/터치 상태 관리 (최적화를 위해 외부 변수 사용)
const globalMouse = { x: 0, y: 0 };

if (typeof window !== 'undefined') {
  const handleMove = (e: MouseEvent | TouchEvent) => {
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }
    
    globalMouse.x = (clientX / window.innerWidth) * 2 - 1;
    globalMouse.y = -(clientY / window.innerHeight) * 2 + 1;
  };
  
  window.addEventListener('mousemove', handleMove);
  window.addEventListener('touchmove', handleMove, { passive: true });
}

type SmokeLineProps = {
  offsetX: number;
  phase: number;
  speedY: number;
  swayAmplitude: number;
  thickness: number;
  opacityMultiplier: number;
};

function SmokeLine({ offsetX, phase, speedY, swayAmplitude, thickness, opacityMultiplier }: SmokeLineProps) {
  const lineRef = useRef<any>(null);
  const { viewport } = useThree();
  
  const numPoints = 850;
  
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < numPoints; i++) {
      pts.push(new THREE.Vector3(offsetX, -4.8 + i * speedY, 0));
    }
    return pts;
  }, [numPoints, offsetX, speedY]);
  
  const velocities = useMemo(() => new Float32Array(numPoints), [numPoints]);
  const positions = useMemo(() => new Float32Array(numPoints * 3), [numPoints]);

  useFrame((state) => {
    if (!lineRef.current) return;
    
    const mouseX = (globalMouse.x * viewport.width) / 2;
    const mouseY = (globalMouse.y * viewport.height) / 2;
    const time = state.clock.elapsedTime;
    
    points[0].set(offsetX, -4.8, 0); 
    velocities[0] = 0;
    
    for (let i = numPoints - 1; i > 0; i--) {
      // 1. 물리적 위치(Points)를 위로 밀어올림
      points[i].copy(points[i - 1]);
      points[i].y += speedY; 
      velocities[i] = velocities[i - 1]; 
      
      const heightFactor = i / numPoints;
      
      // 2. 마우스 인터랙션 (물리적 힘 적용)
      const dx = points[i].x - mouseX;
      const dy = points[i].y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // 반경을 더 넓히고 힘을 대폭 강화하여 확실하게 흩날리게 함
      if (dist < 4.0) {
        const force = (4.0 - dist) / 4.0;
        velocities[i] += (dx / dist) * force * 0.04;
      }
      
      // 3. 관성 및 복원력 적용
      points[i].x += velocities[i];
      velocities[i] *= 0.96; 
      points[i].x += (offsetX - points[i].x) * 0.015; // 제자리로 복구되는 힘
      
      // 4. 시각적인 흔들림(Sway)
      const sway1 = Math.sin(time * 1.5 - heightFactor * 10 + phase) * 0.6 * heightFactor * swayAmplitude;
      const sway2 = Math.cos(time * 0.8 + heightFactor * 15 + phase * 2.0) * 0.3 * heightFactor * swayAmplitude;
      const finalX = points[i].x + sway1 + sway2;
      
      positions[i * 3] = finalX;
      positions[i * 3 + 1] = points[i].y;
      positions[i * 3 + 2] = points[i].z;
    }
    
    positions[0] = points[0].x;
    positions[1] = points[0].y;
    positions[2] = points[0].z;
    
    lineRef.current.geometry.setPositions(positions);
  });

  return (
    <Line
      ref={lineRef}
      points={points} 
      color="white"
      opacity={0.35 * opacityMultiplier}
      transparent
      lineWidth={thickness}
      depthWrite={false}
      blending={THREE.AdditiveBlending}
    />
  );
}

export default function SmokeParticles() {
  return (
    <div 
      className="absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-70 filter blur-[8px]"
      style={{
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 20%, black 60%, black 100%)',
        maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 20%, black 60%, black 100%)'
      }}
    >
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        {/* 모든 연기가 향 끝(한 점, offsetX=0)에서 시작되도록 수정 */}
        <SmokeLine offsetX={0} phase={0} speedY={0.015} swayAmplitude={1.0} thickness={14} opacityMultiplier={1.0} />
        <SmokeLine offsetX={0} phase={Math.PI / 3} speedY={0.012} swayAmplitude={1.3} thickness={10} opacityMultiplier={0.7} />
        <SmokeLine offsetX={0} phase={Math.PI / 1.5} speedY={0.014} swayAmplitude={1.5} thickness={8} opacityMultiplier={0.8} />
        <SmokeLine offsetX={0} phase={Math.PI} speedY={0.011} swayAmplitude={1.8} thickness={6} opacityMultiplier={0.5} />
        <SmokeLine offsetX={0} phase={Math.PI * 1.5} speedY={0.013} swayAmplitude={1.6} thickness={7} opacityMultiplier={0.6} />
      </Canvas>
    </div>
  );
}
