"use client";
import { useEffect, useRef, useState } from "react";
import { Color, Fog, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";

const RING_PROPAGATION_SPEED = 3;
const cameraZ = 300;

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

export function Globe({ globeConfig, data }: WorldProps) {
  // store the actual ThreeGlobe instance in state so we can render primitive only when ready
  const [globeObj, setGlobeObj] = useState<any | null>(null);
  const globeRef = useRef<any>(null); // optional, for direct access

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  };

  // create ThreeGlobe once after mount
  useEffect(() => {
    const g = new ThreeGlobe();
    globeRef.current = g;
    setGlobeObj(g);
    // cleanup if component unmounts
    return () => {
      try {
        // remove from parent if attached
        if (g && (g as any).parent) (g as any).parent.remove(g);
      } catch {}
    };
  }, []);

  // when globeObj exists, configure material and initial data
  useEffect(() => {
    if (!globeObj) return;

    // material
    const globeMaterial = globeObj.globeMaterial();
    if (globeMaterial) {
      globeMaterial.color = new Color(defaultProps.globeColor);
      globeMaterial.emissive = new Color(defaultProps.emissive);
      globeMaterial.emissiveIntensity = defaultProps.emissiveIntensity;
      globeMaterial.shininess = defaultProps.shininess;
    }

    // build points array from data
    const points: any[] = [];
    for (const arc of data) {
      const rgb = hexToRgb(arc.color) || { r: 255, g: 255, b: 255 };
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.startLat,
        lng: arc.startLng,
      });
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.endLat,
        lng: arc.endLng,
      });
    }
    const filteredPoints = points.filter(
      (v, i, a) => a.findIndex((v2) => v2.lat === v.lat && v2.lng === v.lng) === i
    );

    globeObj
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor(() => defaultProps.polygonColor);

    globeObj
      .arcsData(data)
      .arcStartLat((d: any) => d.startLat)
      .arcStartLng((d: any) => d.startLng)
      .arcEndLat((d: any) => d.endLat)
      .arcEndLng((d: any) => d.endLng)
      .arcColor((d: any) => d.color)
      .arcAltitude((d: any) => d.arcAlt)
      .arcStroke(() => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
      .arcDashLength(defaultProps.arcLength)
      .arcDashGap(15)
      .arcDashAnimateTime(defaultProps.arcTime);

    globeObj
      .pointsData(filteredPoints)
      .pointColor((d: any) => d.color)
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(2);

    globeObj
      .ringsData([])
      .ringColor(() => defaultProps.polygonColor)
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod((defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings);
  }, [globeObj, data, defaultProps]);

  // rings animation (example)
  useEffect(() => {
    if (!globeObj) return;
    const interval = setInterval(() => {
      const indices = genRandomNumbers(0, data.length, Math.max(1, Math.floor((data.length * 4) / 5)));
      const ringsData = data.filter((_, i) => indices.includes(i)).map((d) => ({ lat: d.startLat, lng: d.startLng, color: d.color }));
      globeObj.ringsData(ringsData);
    }, 2000);
    return () => clearInterval(interval);
  }, [globeObj, data]);

  // render primitive only when globeObj is ready
  if (!globeObj) return null;
  return <primitive object={globeObj} />;
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();
  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0x000000, 0);
  }, [gl, size]);
  return null;
}

export function World(props: { globeConfig: GlobeConfig; data: Position[] }) {
  const { globeConfig } = props;
  return (
    <Canvas camera={{ fov: 50, position: [0, 0, cameraZ], near: 180, far: 1800 }}>
      <fog attach="fog" args={[0xffffff, 400, 2000]} />
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight color={globeConfig.directionalLeftLight} position={[-400, 100, 400]} />
      <directionalLight color={globeConfig.directionalTopLight} position={[-200, 500, 200]} />
      <pointLight color={globeConfig.pointLight} position={[-200, 500, 200]} intensity={0.8} />
      <Globe {...props} />
      <OrbitControls enablePan={false} enableZoom={false} minDistance={cameraZ} maxDistance={cameraZ} autoRotateSpeed={1} autoRotate={true} minPolarAngle={Math.PI / 3.5} maxPolarAngle={Math.PI - Math.PI / 3} />
    </Canvas>
  );
}

/* helper functions (same as yours) */
export function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}
export function genRandomNumbers(min: number, max: number, count: number) {
  const arr: number[] = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (!arr.includes(r)) arr.push(r);
  }
  return arr;
}
