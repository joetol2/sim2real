import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { MeshStandardMaterial } from "three";

type Vec3 = [number, number, number];

function StlModel({ url, scale, position, rotation }: { url: string; scale: number; position: Vec3; rotation: Vec3 }) {
  const geometry = useLoader(STLLoader, url);
  const material = new MeshStandardMaterial({
    color: "#2563eb",
    metalness: 0.6,
    roughness: 0.4,
  });

  return (
    <mesh
      geometry={geometry}
      material={material}
      scale={scale}
      position={position}
      rotation={rotation}
    />
  );
}

function GltfModel({ url, scale, position, rotation }: { url: string; scale: number; position: Vec3; rotation: Vec3 }) {
  const { scene } = useGLTF(url);

  scene.scale.set(scale, scale, scale);
  scene.position.set(...position);
  scene.rotation.set(...rotation);

  scene.traverse((child: any) => {
    if (child.isMesh) {
      child.material.color.set("#2563eb");
      child.material.metalness = 0.6;
      child.material.roughness = 0.4;
    }
  });

  return <primitive object={scene} />;
}

function Model({ url, scale, position, rotation }: { url: string; scale: number; position: Vec3; rotation: Vec3 }) {
  const ext = url.split(".").pop()?.toLowerCase();
  return ext === "stl"
    ? <StlModel url={url} scale={scale} position={position} rotation={rotation} />
    : <GltfModel url={url} scale={scale} position={position} rotation={rotation} />;
}

function Scene({ modelUrl, scale, position, rotation }: { modelUrl: string; scale: number; position: Vec3; rotation: Vec3 }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={4} castShadow />
      <Suspense fallback={null}>
        <Model url={modelUrl} scale={scale} position={position} rotation={rotation} />
      </Suspense>
      <Grid
        position={[0, 0, 0]}
        args={[80, 80]}
        cellSize={1}
        cellThickness={1.5}
        cellColor="#334466"
        sectionSize={8}
        sectionThickness={1}
        sectionColor="#4466aa"
        fadeDistance={80}
        fadeStrength={0.8}
        followCamera={false}
        infiniteGrid={true}
      />
    </>
  );
}

function ViewerCell({ modelUrl, label, scale, position, rotation }: { modelUrl: string; label: string; scale: number; position: Vec3; rotation: Vec3 }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="flex flex-col gap-2">
      <div style={{ width: "100%", height: "300px" }}>
        <Canvas
          camera={{
            position: isMobile ? [15, 10, 15] : [12, 10, 12],
            fov: 70,
            up: [0, 1, 0],
          }}
          style={{ background: "rgb(10, 16, 30)" }}
        >
          <fog attach="fog" args={["#0a101e", 25, 50]} />
          <Scene modelUrl={modelUrl} scale={scale} position={position} rotation={rotation} />
          <OrbitControls
            enableZoom={true}
            zoomSpeed={0.5}
            autoRotate={true}
            autoRotateSpeed={0.5}
            enablePan={false}
            rotateSpeed={0.3}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.8}
            target={[0, 2.5, 0]}
            minDistance={8}
            maxDistance={20}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Canvas>
      </div>
      <p className="text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

const BASE = import.meta.env.BASE_URL;
const STL_ROT: Vec3 = [-Math.PI / 2, 0, 0];
const NO_ROT: Vec3  = [0, 0, 0];

const models = [
  { url: `${BASE}models/tycho_decimated.stl`, label: "Tycho",      scale: 0.008, position: [0, 0.5, 0] as Vec3, rotation: STL_ROT },
  { url: `${BASE}models/tycho.gltf`,          label: "MyCobot 280", scale: 0.025, position: [0, 5,   0] as Vec3, rotation: NO_ROT  },
  { url: `${BASE}models/rolli_assembly_05.stl`, label: "Rolli",    scale: 0.008, position: [0, 0.5, 0] as Vec3, rotation: STL_ROT },
];

export default function RobotViewer() {
  return (
    <section className="py-24 sm:py-32 border-t border-border">
      <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-20">
        <p className="text-base font-heading tracking-[0.3em] uppercase text-muted-foreground mb-6">
          3D Models
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-semibold tracking-tight leading-[1.15] mb-10">
          Interactive 3D models.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {models.map((m) => (
            <ViewerCell key={m.label} modelUrl={m.url} label={m.label} scale={m.scale} position={m.position} rotation={m.rotation} />
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Drag to rotate. Scroll to zoom.
        </p>
      </div>
    </section>
  );
}
