
import * as THREE from "three";

// Membuat scene 3D
const scene = new THREE.Scene();
scene.background = null;

// Kamera
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
camera.position.z = 7;

// Renderer transparan
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.id = "ocean3d";
renderer.domElement.style.position = "fixed";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
renderer.domElement.style.width = "100%";
renderer.domElement.style.height = "100%";
renderer.domElement.style.pointerEvents = "none";
renderer.domElement.style.zIndex = "0";

document.body.prepend(renderer.domElement);

// Cahaya
const ambient = new THREE.AmbientLight(0x66ccff, 2);
scene.add(ambient);

const light = new THREE.PointLight(0x00ccff, 35);
light.position.set(2, 3, 5);
scene.add(light);

// Objek cincin 3D
const geometry = new THREE.TorusKnotGeometry(
    1.1, 0.22, 180, 24, 2, 3
);

const material = new THREE.MeshStandardMaterial({
    color: 0x00cfff,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x003b66,
    emissiveIntensity: 1.5,
    wireframe: true
});

const object3D = new THREE.Mesh(geometry, material);
scene.add(object3D);

// Partikel kecil di sekeliling objek
const particleGeometry = new THREE.BufferGeometry();
const particlePositions = [];

for (let i = 0; i < 500; i++) {
    particlePositions.push(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5
    );
}

particleGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(particlePositions, 3)
);

const particleMaterial = new THREE.PointsMaterial({
    color: 0x00ccff,
    size: 0.025,
    transparent: true,
    opacity: 0.8
});

const particles = new THREE.Points(
    particleGeometry,
    particleMaterial
);

scene.add(particles);

// Animasi
function animate() {
    requestAnimationFrame(animate);

    object3D.rotation.x += 0.003;
    object3D.rotation.y += 0.006;

    particles.rotation.y += 0.0005;

    renderer.render(scene, camera);
}

animate();

// Responsif
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});
