import * as THREE from '../three/build/three.module.js';

/**
 * Connection
 * 
 * @parameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3
 * }
 */
export default class Connection {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            Object.defineProperty(this, key, { value: value, writable: true, configurable: true, enumerable: true });
        }

        // New part
        const geometry = new THREE.CylinderGeometry(0.035, 0.035, 1, 32);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                color1: {
                    value: new THREE.Color(0xf4f8ff)
                },
                color2: {
                    value: new THREE.Color("blue")
                }
            },
            vertexShader: `
            varying vec2 vUv;
            
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
            `,
            fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            
            varying vec2 vUv;
            
            void main() {
                // gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
                
                // smooth Hermite interpolation between 0 and 1
                gl_FragColor = vec4(mix(color1, color2, smoothstep(0.0, 1.0, vUv.y)), 1.0);
            }
            `,
            // lights: true
        });

        this.object = new THREE.Mesh(geometry, material);

        this.object.castShadow = false;
        this.object.receiveShadow = false;
    }
}

