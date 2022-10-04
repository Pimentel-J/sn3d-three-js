import * as THREE from '../three/build/three.module.js';
import Orientation from './orientation.js';

/**
 * Default Data
 */

export const networkData = {
    url: './networks/Loquitas.json',
    credits: 'SGRAI',
    scale: new THREE.Vector3(1.0, 1.0, 1.0)
}

export const playerData = {
    url: './models/gltf/RobotExpressive/RobotExpressive.glb',
    credits: 'Model created by <a href="https://www.patreon.com/quaternius" target="_blank" rel="noopener">Tomás Laulhé</a>. CC0 1.0. Modified by <a href="https://donmccurdy.com/" target="_blank" rel="noopener">Don McCurdy</a>.',
    eyeHeight: 0.8, // % of character height
    scale: new THREE.Vector3(0.1, 0.1, 0.1),
    walkingSpeed: 0.75,
    initialDirection: 0.0, // Expressed in degrees
    turningSpeed: 75.0, // Expressed in degrees / second
    runningFactor: 2.0, // Affects walking speed and turning speed
    keyCodes: { firstPersonView: 'Digit1', topView: 'Digit2', viewMode: 'KeyV', userInterface: 'KeyU', miniMap: 'KeyM', help: 'KeyH', statistics: 'KeyC', ambientLight: 'KeyA', directionalLight: 'KeyD', spotLight: 'KeyS', flashLight: 'KeyF', run: 'KeyR', left: 'ArrowLeft', right: 'ArrowRight', backward: 'ArrowDown', forward: 'ArrowUp', jump: 'KeyJ', yes: 'KeyY', no: 'KeyN', wave: 'KeyW', punch: 'KeyP', thumbsUp: 'KeyT' }
}
export const parrotData = {
    url: '../three/examples/models/gltf/Parrot.glb',
    scale: new THREE.Vector3(0.01, 0.01, 0.01),
}
export const flamingoData = {
    url: '../three/examples/models/gltf/Flamingo.glb',
    scale: new THREE.Vector3(0.009, 0.009, 0.009),
}

export const emojiHappyData = {
    url: 'emoji/models/beaming_face_with_smiling_eyes.gltf',
    scale: new THREE.Vector3(0.2, 0.2, 0.2),
}

export const emojiSadData = {
    url: 'emoji/models/grinning_sad_face.gltf',
    scale: new THREE.Vector3(0.2, 0.2, 0.2),
}

export const emojiBigEyesData = {
    url: 'emoji/models/grinning_face_with_big_eyes.gltf',
    scale: new THREE.Vector3(0.2, 0.2, 0.2),
}

export const emojiLoveData = {
    url: 'emoji/models/love_emoji.gltf',
    scale: new THREE.Vector3(0.001, 0.001, 0.001),
}

export const lightsData = {
    ambientLight: { visible: true, color: 0xffffff, intensity: 1.0 },
    directionalLight: { visible: true, color: 0xffffff, intensity: 1.0, position: new THREE.Vector3(0.0, 1.0, 0.0) },
    spotLight: { visible: true, color: 0xffffff, intensity: 1.0, distance: 0.0, angle: Math.PI / 4.0, penumbra: 0.25, position: new THREE.Vector3(0.0, 0.0, 0.0) },
    flashLight: { visible: true, color: 0xffffff, intensity: 1.0, distance: 0.0, angle: Math.PI / 4.0, penumbra: 0.25 }
}

export const fogData = {
    enabled: false,
    color: 0xe0e0e0,
    near: 0.1,
    far: 14.0
}

export const cameraData = {
    view: 'fixed', // Fixed view: 'fixed'; first-person view: 'first-person'; third-person view: 'third-person'; top view: 'top'; mini-map: 'mini-map'
    multipleViewsViewport: new THREE.Vector4(0.0, 0.0, 1.0, 1.0), // Viewport position and size: % of window width and window height; MUST BE REDEFINED when creating an instance of ThumbRaiser() so that each view is assigned a different viewport
    target: new THREE.Vector3(0.0, 0.0, 0.0), // Target position
    initialOrientation: new Orientation(135.0, -45.0), // Horizontal and vertical orientation and associated limits (expressed in degrees)
    orientationMin: new Orientation(-180.0, -90.0),
    orientationMax: new Orientation(180.0, 0.0),
    initialDistance: 8.0, // Distance to the target and associated limits
    distanceMin: 4.0,
    distanceMax: 16.0,
    initialZoom: 1.0, // Zoom factor and associated limits
    zoomMin: 0.5,
    zoomMax: 2.0,
    initialFov: 45.0, // Field-of-view (expressed in degrees)
    near: 0.01, // Front clipping plane
    far: 100.0 // Back clipping plane
}

export const nodeData = {
    color: 0x0088de,
    position: {
        x: 0,
        y: 2,
        z: 1
    },
    geometry: {
        radius: 0.35,
        widthSegments: 32,
        heightSegments: 16
    }
}

// Textures order: ft bk up dn rt lf
export const skyboxTexturesData = {
    path: './textures/',
    format: '.jpg',
    divine: [
        'divine_ft',
        'divine_bk',
        'divine_up',
        'divine_dn',
        'divine_rt',
        'divine_lf'
    ],
    milkyWay: [
        'dark-s_px',
        'dark-s_nx',
        'dark-s_py',
        'dark-s_ny',
        'dark-s_pz',
        'dark-s_nz'
    ]
}