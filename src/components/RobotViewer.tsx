import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { MeshStandardMaterial } from "three";

function StlModel({ url }: { url: string }) {
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
      scale={0.008}
      position={[0, 0.5, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    />
  );
}

function GltfModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  scene.scale.set(0.008, 0.008, 0.008);
  scene.position.set(0, 0.5, 0);
  scene.rotation.set(-Math.PI / 2, 0, 0);

  scene.traverse((child: any) => {
    if (child.isMesh) {
      child.material.color.set("#2563eb");
      child.material.metalness = 0.6;
      child.material.roughness = 0.4;
    }
  });

  return <primitive object={scene} />;
}

function Model({ url }: { url: string }) {
  const ext = url.split(".").pop()?.toLowerCase();
  return ext === "stl" ? <StlModel url={url} /> : <GltfModel url={url} />;
}

function Scene({ modelUrl }: { modelUrl: string }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={4} castShadow />
      <Suspense fallback={null}>
        <Model url={modelUrl} />
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

const MODEL_URL = `${import.meta.env.BASE_URL}models/tycho_decimated.stl`;

export default function RobotViewer() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <section className="py-24 sm:py-32 border-t border-border">
      <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-20">
        <p className="text-xs font-heading tracking-[0.3em] uppercase text-muted-foreground mb-6">
          Robot Model
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-semibold tracking-tight leading-[1.15] mb-10">
          Meet Tycho.
        </h2>
      </div>
      <div style={{ width: "100%", height: "600px" }}>
        <Canvas
          camera={{
            position: isMobile ? [15, 10, 15] : [12, 10, 12],
            fov: isMobile ? 60 : 70,
            up: [0, 1, 0],
          }}
          style={{ background: "rgb(10, 16, 30)" }}
        >
          <fog attach="fog" args={["#0a101e", 25, 50]} />
          <Scene modelUrl={MODEL_URL} />
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
      <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-20 mt-4">
        <p className="text-sm text-muted-foreground">
          Drag to rotate. Scroll to zoom.
        </p>
      </div>
    </section>
  );
}
