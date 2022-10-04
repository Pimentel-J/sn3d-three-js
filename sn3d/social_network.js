// Social Network 3D Graphic System and Interaction
// Authors: Filipe Costa | João Pimentel | Tiago Monteiro
// Based on: Thumb Raiser - 2021 JPP
// Credits: JPP

import * as THREE from '../three/build/three.module.js';
import Stats from '../three/examples/jsm/libs/stats.module.js';
import { networkData, playerData, lightsData, fogData, cameraData, nodeData, emojiHappyData, emojiSadData, emojiLoveData, emojiBigEyesData, parrotData, flamingoData } from './default_data.js';
import merge from './merge.js';
import Network from './network.js';
import Player from './player.js';
import EmojiHappy from './emoji/emoji_happy.js';
import EmojiBigEyes from './emoji/emoji_big_eyes.js';
import EmojiLove from './emoji/emoji_love.js';
import EmojiSad from './emoji/emoji_sad.js';
import Lights from './lights.js';
import Fog from './fog.js';
import Camera from './camera.js';
import UserInterface from './user_interface.js';
import { OrbitControls } from '../three/examples/jsm/controls/OrbitControls.js';
import { FirstPersonControls } from './FirstPersonControls.js';
import Skybox from './skybox.js';
import Tooltip from './tooltip_model.js';
import { userNetworkData } from './user-mock.js';
import { DDSLoader } from '../three/examples/jsm/loaders/DDSLoader.js';
import { TextGeometry } from '../three/examples/jsm/geometries/TextGeometry.js';

/**
 * Social Network
 * 
 * @param networkParameters
 * @param playerParameters
 * @param lightsParameters
 * @param fogParameters
 * @param miniMapCameraParameters
 */
export default class SocialNetwork {
    constructor(networkParameters, playerParameters, lightsParameters, fogParameters, miniMapCameraParameters) {

        this.networkParameters = merge(true, networkData, networkParameters);
        this.playerParameters = merge(true, playerData, playerParameters);
        this.lightsParameters = merge(true, lightsData, lightsParameters);
        this.fogParameters = merge(true, fogData, fogParameters);

        // Emojis
        this.emojiHappyParameters = merge(true, emojiHappyData, playerParameters);
        this.emojiSadParameters = merge(true, emojiSadData, playerParameters);
        this.emojiLoveParameters = merge(true, emojiLoveData, playerParameters);
        this.emojiBigEyesParameters = merge(true, emojiBigEyesData, playerParameters);

        this.miniMapCameraParameters = merge(true, cameraData, miniMapCameraParameters);

        // Tooltip avatar
        this.tooltipParrotParameters = merge(true, parrotData, playerParameters);
        this.tooltipFlamingoParameters = merge(true, flamingoData, playerParameters);

        // Create a 2D scene (the viewports frames)
        this.scene2D = new THREE.Scene();

        this.raycasterHighlight = new THREE.Raycaster();
        this.raycasterTooltipHighlight = new THREE.Raycaster();
        this.raycasterCollisions = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.pointer1 = new THREE.Vector2();

        // Create 2D scene boundary for minimap (a square)
        let points = [new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(1.0, 0.0, 0.0), new THREE.Vector3(1.0, 1.0, 0.0),
        new THREE.Vector3(0.0, 1.0, 0.0)];
        let geometry = new THREE.BufferGeometry().setFromPoints(points);
        let material = new THREE.LineBasicMaterial({ color: 0xffffff });
        this.square = new THREE.LineLoop(geometry, material);
        this.scene2D.add(this.square);

        // Create 2D scene camera
        this.camera2D = new THREE.OrthographicCamera(0.0, 1.0, 1.0, 0.0, 0.0, 1.0);

        // Create a 3D scene (the game itself)
        this.scene3D = new THREE.Scene();

        // Create the network
        this.network = new Network(this.networkParameters);

        // Create the player
        this.player = new Player(this.playerParameters);

        this.tooltipModelPlayer = new Tooltip(this.playerParameters);
        this.tooltipModelParrot = new Tooltip(this.tooltipParrotParameters);
        this.tooltipModelFlamingo = new Tooltip(this.tooltipFlamingoParameters);

        this.tooltipModels = new Array();
        this.tooltipModels.push(this.tooltipModelFlamingo);
        for (let k = 0; k < userNetworkData.totalPlayers - 2; k++) {
            if (k % 2 == 0) {
                this.tooltipModels.push(new Tooltip(this.tooltipParrotParameters));
            } else {
                this.tooltipModels.push(new Tooltip(this.playerParameters));
            }
        }
        this.tooltipModels.push(new Tooltip(this.tooltipFlamingoParameters));

        // Objects for emotional states of network users (nodes)
        this.estadoEmocionalFilipe = new EmojiHappy(this.emojiHappyParameters);
        this.estadoEmocionalTiago = new EmojiSad(this.emojiSadParameters);
        this.estadoEmocionalAna = new EmojiBigEyes(this.emojiBigEyesParameters);
        this.estadoEmocionalSergio = new EmojiHappy(this.emojiHappyParameters);

        this.estadoEmocionalMaria = new EmojiLove(this.emojiLoveParameters);
        this.estadoEmocionalJoana = new EmojiSad(this.emojiSadParameters);
        this.estadoEmocionalJoao = new EmojiBigEyes(this.emojiBigEyesParameters);
        this.estadoEmocionalLuis = new EmojiHappy(this.emojiHappyParameters);

        this.estadoEmocionalSara = new EmojiLove(this.emojiLoveParameters);
        this.estadoEmocionalJuliana = new EmojiSad(this.emojiSadParameters);
        this.estadoEmocionalPedro = new EmojiBigEyes(this.emojiBigEyesParameters);
        this.estadoEmocionalNuno = new EmojiBigEyes(this.emojiBigEyesParameters);

        this.estadoEmocionalCarla = new EmojiBigEyes(this.emojiBigEyesParameters);
        this.estadoEmocionalManuel = new EmojiBigEyes(this.emojiLoveParameters);

        this.emojis = new Array();
        this.emojis.push(this.estadoEmocionalFilipe, this.estadoEmocionalTiago, this.estadoEmocionalAna,
        this.estadoEmocionalSergio, this.estadoEmocionalMaria, this.estadoEmocionalJoana, this.estadoEmocionalJoao,
        this.estadoEmocionalLuis, this.estadoEmocionalSara, this.estadoEmocionalJuliana, this.estadoEmocionalPedro,
        this.estadoEmocionalNuno, this.estadoEmocionalCarla, this.estadoEmocionalManuel);

        // Create the lights
        this.lights = new Lights(this.lightsParameters);

        // Create the fog
        this.fog = new Fog(this.fogParameters);

        // Create a skybox
        this.skybox = new Skybox({});

        // Create the mini-map camera
        this.miniMapCamera = new Camera(this.miniMapCameraParameters, window.innerWidth, window.innerHeight);

        // Create the statistics and make its node invisible
        this.statistics = new Stats();
        this.statistics.dom.style.visibility = 'hidden';
        document.body.appendChild(this.statistics.dom);

        // Create a renderer and turn on shadows in the renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.autoClear = false;
        this.renderer.shadowMap.enabled = false;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Create 3D camera and OrbitControls
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.name = "TopView";
        this.firstPersonCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        this.firstPersonCamera.name = "FirstPerson";
        this.firstPersonCamera.position.set(-0.25, 1.75, 3.5);

        // Q/E [left/right rot.] | WASD [strafing] | P or Space/L [up/down strafing] | Arrows [no strafing]
        this.firstPersonControls = new FirstPersonControls(this.firstPersonCamera, this.renderer.domElement);
        this.firstPersonControls.movementSpeed = 3;
        this.firstPersonControls.lookSpeed = 0.15;

        this.dir = new THREE.Vector3();
        this.intersects = [];
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.camera.position.set(0.0, 5.0, 7.5, 0.5);
        this.controls.minDistance = nodeData.geometry.radius * 5;
        this.controls.maxDistance = 25;
        this.controls.zoomSpeed = 2;
        this.controls.update();

        // Create minimap DOM element (2D scene)
        const content = document.getElementById('parent');
        const element = document.createElement('div');
        element.className = 'minimap';

        this.scene2D.userData.element = element;
        content.appendChild(element);

        // Create minimap camera and OrbitControls
        this.minimapCam = new THREE.OrthographicCamera(-5.0, 5.0, 5.0, -5.0, 1.0, 120.0);
        this.minimapCam.position.set(0, 3, 0);
        this.scene2D.userData.camera = this.minimapCam;

        this.minimapControls = new OrbitControls(this.scene2D.userData.camera, this.scene2D.userData.element);
        this.minimapControls.minZoom = nodeData.geometry.radius;
        this.minimapControls.maxZoom = 10;
        this.minimapControls.zoomSpeed = 2;
        this.minimapControls.enableRotate = false;
        this.scene2D.userData.controls = this.minimapControls;

        // Set the mouse move action (none)
        this.dragMiniMap = false;
        this.changeCameraDistance = false;
        this.changeCameraOrientation = false;
        this.panMiniMap = false;

        // Set the game state
        this.gameRunning = false;

        // To save all node positions
        this.nodePositions = new Array();

        // To save all connection Box3 positions
        this.connectionBoxes = new Array();

        // Get and configure the panel's <div> elements
        this.viewsPanel = document.getElementById('views-panel');
        this.view = document.getElementById('view');
        this.reset = document.getElementById('reset');
        this.helpPanel = document.getElementById('help-panel');
        this.helpPanel.style.visibility = 'hidden';
        this.subwindowsPanel = document.getElementById('subwindows-panel');
        this.userInterfaceCheckBox = document.getElementById('user-interface');
        this.userInterfaceCheckBox.checked = true;
        this.miniMapCheckBox = document.getElementById('mini-map');
        this.miniMapCheckBox.checked = true;
        this.helpCheckBox = document.getElementById('help');
        this.helpCheckBox.checked = false;
        this.statisticsCheckBox = document.getElementById('statistics');
        this.statisticsCheckBox.checked = false;

        // Build the help panel
        this.buildHelpPanel();

        // Set the active view camera (fixed view)
        this.setActiveViewCamera(this.camera);

        // Register the event handler to be called on window resize
        window.addEventListener('resize', event => this.windowResize(event));

        // Register the event handler to be called on key press
        document.addEventListener('keydown', event => this.keyChange(event, true));

        // Register the event handler to be called on key release
        document.addEventListener('keyup', event => this.keyChange(event, false));

        // Register the event handler to be called on mouse down
        this.renderer.domElement.addEventListener('mousedown', event => this.mouseDown(event));

        // Register the event handler to be called on mouse move
        this.renderer.domElement.addEventListener('mousemove', event => this.mouseMove(event));

        // Register the event handler to be called on mouse up
        this.renderer.domElement.addEventListener('mouseup', event => this.mouseUp(event));

        // Register the event handler to be called on context menu
        this.renderer.domElement.addEventListener('contextmenu', event => this.contextMenu(event));

        // Register the event handler to be called on select, input number, or input checkbox change
        this.view.addEventListener('change', event => this.elementChange(event));

        this.userInterfaceCheckBox.addEventListener('change', event => this.elementChange(event));
        this.helpCheckBox.addEventListener('change', event => this.elementChange(event));
        this.statisticsCheckBox.addEventListener('change', event => this.elementChange(event));

        // Register the event handler to be called on input button click
        this.reset.addEventListener('click', event => this.buttonClick(event));
        // this.resetAll.addEventListener('click', event => this.buttonClick(event));

        this.activeElement = document.activeElement;

        // Ambient sound
        const listener = new THREE.AudioListener();
        this.camera.add(listener);
        // Create a global audio source
        const sound = new THREE.Audio(listener);
        // Load a sound and set it as the Audio object's buffer
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('sounds/spaceship-cruising.ogg', function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(0.3);
            sound.play();
        });
    }

    // Help panel
    buildHelpPanel() {
        const table = document.getElementById('help-table');
        let i = 0;
        for (const key in this.player.keyCodes) {
            while (table.rows[i].cells.length < 2) {
                i++;
            };
            table.rows[i++].cells[0].innerHTML = this.player.keyCodes[key];
        }
        table.rows[i].cells[0].innerHTML = this.network.credits + '<br>' + this.player.credits;
    }

    displayPanel(view) {
        this.view.options.selectedIndex = ['top-view', 'first-person'].indexOf(view);
    }

    // Set active view camera
    setActiveViewCamera(camera) {
        this.activeViewCamera = camera;
    }

    pointerIsOverViewport(pointer, viewport) {
        return (
            pointer.x >= viewport.x &&
            pointer.x < viewport.x + viewport.width &&
            pointer.y >= viewport.y &&
            pointer.y < viewport.y + viewport.height);
    }

    getPointedViewport(pointer) {
        let viewport;
        // Check if the pointer is over the mini-map camera viewport
        if (this.miniMapCheckBox.checked) {
            const viewport = this.miniMapCamera.getViewport();
            if (this.pointerIsOverViewport(pointer, viewport)) {
                return this.miniMapCamera.view;
            }
        } else {
            if (this.activeViewCamera != null)
                return this.activeViewCamera.view;
        }
        return 'none';
    }

    setViewMode(multipleViews) { // Single-view mode: false; multiple-views mode: true
        this.multipleViewsCheckBox.checked = multipleViews;
        this.arrangeViewports(this.multipleViewsCheckBox.checked);
    }

    setUserInterfaceVisibility(visible) {
        this.userInterfaceCheckBox.checked = visible;
        this.viewsPanel.style.visibility = visible ? 'visible' : 'hidden';
        this.subwindowsPanel.style.visibility = visible ? 'visible' : 'hidden';
        this.userInterface.setVisibility(visible);
    }

    setMiniMapVisibility(visible) { // Hidden: false; visible: true
        this.miniMapCheckBox.checked = visible;
    }

    setHelpVisibility(visible) { // Hidden: false; visible: true
        this.helpCheckBox.checked = visible;
        this.helpPanel.style.visibility = visible ? 'visible' : 'hidden';
    }

    setStatisticsVisibility(visible) { // Hidden: false; visible: true
        this.statisticsCheckBox.checked = visible;
        this.statistics.dom.style.visibility = visible ? 'visible' : 'hidden';
    }

    windowResize() {
        this.miniMapCamera.updateWindowSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.firstPersonCamera.aspect = window.innerWidth / window.innerHeight;
        this.firstPersonCamera.updateProjectionMatrix();

        this.minimapCam.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    keyChange(event, state) {
        // Allow digit and arrow keys to be used when entering numbers
        if (document.activeElement == document.body) {

            // Prevent the 'Space' and 'Arrow' keys from scrolling the document's content
            if (event.code == 'Space' || event.code == 'ArrowLeft' || event.code == 'ArrowRight' || event.code == 'ArrowDown' || event.code == 'ArrowUp') {
                event.preventDefault();
            }

            if (event.code == this.player.keyCodes.firstPersonView && state) { // Select first-person view
                this.setActiveViewCamera(this.firstPersonCamera);
            } else if (event.code == this.player.keyCodes.topView && state) {
                this.setActiveViewCamera(this.camera);
            }            
            if (event.code == this.player.keyCodes.userInterface && state) { // Display / hide user interface
                this.setUserInterfaceVisibility(!this.userInterfaceCheckBox.checked);
            }
            if (event.code == this.player.keyCodes.miniMap && state) { // Display / hide mini-map
                this.setMiniMapVisibility(!this.miniMapCheckBox.checked);
            }
            if (event.code == this.player.keyCodes.help && state) { // Display / hide help
                this.setHelpVisibility(!this.helpCheckBox.checked);
            }
            if (event.code == this.player.keyCodes.statistics && state) { // Display / hide statistics
                this.setStatisticsVisibility(!this.statisticsCheckBox.checked);
            }
            if (event.code == this.player.keyCodes.ambientLight && state) { // Turn on / off ambient light
                // this.lights.object.ambientLight.visible = !this.lights.object.ambientLight.visible;
            }
            if (event.code == this.player.keyCodes.directionalLight && state) { // Turn on / off directional light
                // this.lights.object.directionalLight.visible = !this.lights.object.directionalLight.visible;
            }
            if (event.code == this.player.keyCodes.cameraSpotLightLight && state) { // Turn on / off camera's spotlight
                // this.lights.object.cameraSpotLightLight.visible = !this.lights.object.cameraSpotLightLight.visible;
            }
            if (event.code == this.player.keyCodes.spotLight && state) { // Turn on / off spotlight
                // this.lights.object.spotLight.visible = !this.lights.object.spotLight.visible;
            }
            if (event.code == this.player.keyCodes.spotLight2 && state) { // Turn on / off 2nd spotlight
                this.lights.object.spotLight2.visible = !this.lights.object.spotLight2.visible;
            }
            if (event.code == this.player.keyCodes.flashLight && state) { // Turn on / off flashlight
                this.lights.object.flashLight.visible = !this.lights.object.flashLight.visible;
            }
            if (event.code == this.player.keyCodes.run) {
                this.player.keyStates.run = state;
            }
            if (event.code == this.player.keyCodes.left) {
                this.player.keyStates.left = state;
            }
            else if (event.code == this.player.keyCodes.right) {
                this.player.keyStates.right = state;
            }
            if (event.code == this.player.keyCodes.backward) {
                this.player.keyStates.backward = state;
            }
            else if (event.code == this.player.keyCodes.forward) {
                this.player.keyStates.forward = state;
            }
            if (event.code == this.player.keyCodes.jump) {
                this.player.keyStates.jump = state;
            }
            else if (event.code == this.player.keyCodes.yes) {
                this.player.keyStates.yes = state;
            }
            else if (event.code == this.player.keyCodes.no) {
                this.player.keyStates.no = state;
            }
            else if (event.code == this.player.keyCodes.wave) {
                this.player.keyStates.wave = state;
            }
            else if (event.code == this.player.keyCodes.punch) {
                this.player.keyStates.punch = state;
            }
            else if (event.code == this.player.keyCodes.thumbsUp) {
                this.player.keyStates.thumbsUp = state;
            }
        }
    }

    mouseDown(event) {
        if (event.buttons == 1) { // Primary or secondary button down
            // Store current mouse position in window coordinates (mouse coordinate system: origin in the top-left corner; window coordinate system: origin in the bottom-left corner)
            this.mousePosition = new THREE.Vector2(event.clientX, window.innerHeight - event.clientY - 1);
            // Select the camera whose view is being pointed
            const cameraView = this.getPointedViewport(this.mousePosition);

            if (this.activeViewCamera.name != "FirstPerson") {
                this.connectionHighlighter();
            }
        }
    }

    mouseMove(event) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

        if (this.activeViewCamera.name != "FirstPerson") {
            this.connectionTooltipHighlighter();
        }

        if (event.buttons == 1 || event.buttons == 2) { // Primary or secondary button down
            if (this.changeCameraDistance || this.changeCameraOrientation || this.dragMiniMap) { // Mouse action in progress
                // Compute mouse movement and update mouse position
                const newMousePosition = new THREE.Vector2(event.clientX, window.innerHeight - event.clientY - 1);
                const mouseIncrement = newMousePosition.clone().sub(this.mousePosition);
                this.mousePosition = newMousePosition;


                if (event.buttons == 1) { // Primary button down
                    if (this.changeCameraDistance) {
                        this.activeViewCamera.updateDistance(-0.05 * (mouseIncrement.x + mouseIncrement.y));
                        this.displayPanel();
                    }
                    else if (this.dragMiniMap) {
                        const windowMinSize = Math.min(window.innerWidth, window.innerHeight);
                        const width = this.miniMapCamera.viewport.width * windowMinSize;
                        const height = this.miniMapCamera.viewport.height * windowMinSize;
                        this.miniMapCamera.viewport.x += mouseIncrement.x / (window.innerWidth - width);
                        this.miniMapCamera.viewport.y += mouseIncrement.y / (window.innerHeight - height);
                        // console.log("X -> " + this.miniMapCamera.viewport.x);
                        // console.log("Y -> " + this.miniMapCamera.viewport.y);
                    }
                }
                else { // Secondary button down
                    const windowMinSize2 = Math.min(window.innerWidth, window.innerHeight);
                    const width2 = windowMinSize2;

                    // Z initial position value = -4.898587196589413e-16
                    let newTarget = new THREE.Vector3(0.0, 0.0, 0.0);

                    newTarget.x += mouseIncrement.x / (window.innerWidth - width2);
                    newTarget.z -= mouseIncrement.y / (window.innerWidth - width2);

                    //this.topViewCamera.updateTarget(newTarget);
                    this.miniMapCamera.updateTarget(newTarget);

                    if (this.panMiniMap == true) {
                    }
                }
            }
        }
    }

    // Reset mouse move action
    mouseUp(event) {
        this.dragMiniMap = false;
        this.changeCameraDistance = false;
        this.changeCameraOrientation = false;
    }

    // Prevent the context menu from appearing when the secondary mouse button is clicked
    contextMenu(event) {
        event.preventDefault();
    }

    elementChange(event) {
        switch (event.target.id) {
            case 'view':
                this.setActiveViewCamera([this.camera, this.firstPersonCamera][this.view.options.selectedIndex]);
                break;
            case 'user-interface':
                this.setUserInterfaceVisibility(event.target.checked);
                break;
            case 'help':
                this.setHelpVisibility(event.target.checked);
                break;
            case 'statistics':
                this.setStatisticsVisibility(event.target.checked);
                break;
        }
    }

    buttonClick(event) {
        switch (event.target.id) {
            case 'reset':
                if (this.activeViewCamera.name == "FirstPerson") {
                    this.controls.reset();
                    this.firstPersonControls.movementSpeed = 3;
                    this.firstPersonControls.lookSpeed = 0.15;
                    this.activeViewCamera.position.set(-0.25, 1.75, 3.5);
                } else {
                    this.controls.reset();
                    this.controls.minDistance = nodeData.geometry.radius * 5;
                    this.controls.maxDistance = 25;
                    this.controls.zoomSpeed = 2;
                    this.controls.update();
                    this.activeViewCamera.position.set(0.0, 5.0, 7.5, 0.5);
                }
                break;
        }
    }

    ///Update all scene, objects and views
    update() {
        if (!this.gameRunning) {
            // Filter any unloaded object
            this.unloadedEmojiObjects = this.emojis.filter(object => (!object.loaded));
            this.unloadedTooltipObjects = this.tooltipModels.filter(object => (!object.loaded));

            if (this.network.loaded && this.player.loaded && this.unloadedEmojiObjects.length == 0 &&
                this.unloadedTooltipObjects.length == 0) {
                this.AddObjects();
            }
        } else {
            this.updateAllObjects();
        }
    }

    AddObjects() {
        // Create the clock
        this.clock = new THREE.Clock();

        // Add the network, player, lights and skybox to the scene
        this.group = new THREE.Group();
        this.group.add(this.lights.object);
        this.group.add(this.network.object);

        // Adicionar Emojis ao THREE Group
        this.group.add(this.player.object);

        this.emojis.forEach(emoji => {
            this.group.add(emoji.object);
        });

        this.tooltipModels.forEach(tooltipModel => {
            this.group.add(tooltipModel.object);
        });

        this.group.add(this.skybox.object);

        this.scene3D.add(this.group);

        //Posição dos objectos para estados de humor
        var delta_pos = 0.5;

        //Filipe [0.0, 0.0, 0.0]        
        this.estadoEmocionalFilipe.object.position.set(0.0 + delta_pos, 0.0 + delta_pos, 0.0);
        //Maria position: [2.7, 0.0, 2.2]        
        this.estadoEmocionalMaria.object.position.set(3.5 + delta_pos, -0.3 + delta_pos, 2.2);
        //Joana position: [0.55, 0.0, 1.7]        
        this.estadoEmocionalJoana.object.position.set(0.75 + delta_pos, -1.5 + delta_pos, 1.7);
        //Ana position: [1.9, 0.0, 0.9]        
        this.estadoEmocionalAna.object.position.set(1.9 + delta_pos, 1.5 + delta_pos, 1.2);
        this.estadoEmocionalTiago.object.position.set(-2.2 + delta_pos, 0.75 + delta_pos, 1.5);
        //Sergio [3.1, 0.0, -1.5]        
        this.estadoEmocionalSergio.object.position.set(3.5 + delta_pos, 0.0 + delta_pos, -2.5);
        //Joao position: [1.35, 0.0, 3.05]        
        this.estadoEmocionalJoao.object.position.set(1.5 + delta_pos, -0.25 + delta_pos, 3.75);
        //Luis position: [-0.95, 0.0, 2.7]        
        this.estadoEmocionalLuis.object.position.set(-2.95 + delta_pos, -0.75 + delta_pos, 2.7);
        //Sara position: [0.0, 0.0, -1.7]        
        this.estadoEmocionalSara.object.position.set(0.0 + delta_pos, 0.5 + delta_pos, -3.5);
        //Juliana position: [-1.7, 0.0, -2.3]        
        this.estadoEmocionalJuliana.object.position.set(-3.0 + delta_pos, -0.5 + delta_pos, -3.2);
        //Pedro position: [1.5, 0.0, -1.2]        
        this.estadoEmocionalPedro.object.position.set(1.5 + delta_pos, -1.0 + delta_pos, -2.0);
        //Nuno position: [-1.7, 0.0, -0.5]        
        this.estadoEmocionalNuno.object.position.set(-5.0 + delta_pos, 0.3 + delta_pos, -2.0);
        // position: [-6.0, -0.5, 0.3]
        this.estadoEmocionalCarla.object.position.set(-6.0 + delta_pos, -0.5 + delta_pos, 0.3);
        // position: [2.0, -0.5, -5.7],
        this.estadoEmocionalManuel.object.position.set(2.0 + delta_pos, -0.5 + delta_pos, -5.7);


        this.emojis.forEach(emoji => {
            emoji.object.visible = true;
        });

        // SpotLight pointed at the camera's target
        this.lights.object.cameraSpotLight.visible = true;

        this.camera.add(this.lights.object.cameraSpotLight);
        this.scene3D.add(this.camera);

        this.firstPersonCamera.add(this.lights.object.cameraSpotLight.clone());
        this.scene3D.add(this.firstPersonCamera);

        // Set the 2nd spotlight target
        this.lights.object.spotLight2.target.position.set(1.5, -0.25, 3.75);
        this.lights.object.spotLight2.target.updateMatrixWorld();

        // Create the user interface
        this.userInterface = new UserInterface(this.scene3D, this.renderer, this.lights, this.fog, this.player.object);

        this.connectionsListForCollision = new Array();
        // Save all node positions and connection objects
        this.scene3D.children[0].children[1].children.forEach(element => {
            if (element.geometry instanceof THREE.SphereGeometry) this.nodePositions.push(element.position);
            if (element.geometry instanceof THREE.CylinderGeometry) this.connectionsListForCollision.push(element);
        });
        // Create camera's sphere to intersect with node's sphere
        this.cameraSphereObjectNode = new THREE.Sphere(this.firstPersonCamera.position, 1.03);

        // Create connection boxes to intersect with camera's sphere
        this.connectionsListForCollision.forEach(element => {
            this.connectionBoxObject = new THREE.Box3();
            this.connectionBoxObject.setFromObject(element);
            this.connectionBoxes.push(this.connectionBoxObject);
        });
        // Create camera's sphere to intersect with connection's box
        this.cameraSphereObjectConnection = new THREE.Sphere(this.firstPersonCamera.position, 1.03);


        // Tooltip positions
        for (let k = 0; k < this.nodePositions.length; k++) {
            let element = this.nodePositions[k];
            this.tooltipModels[k].object.position.set(element.x - 0.6, element.y + 0.35,
                element.z);
        }

        this.tooltipModels.forEach(tooltipModel => {
            tooltipModel.object.visible = false;
        });

        // Tooltip text
        this.tooltipTexts = new Array();
        this.scene3D.children[0].children[1].children.forEach(element => {
            if (element.geometry instanceof TextGeometry) {
                this.tooltipTexts.push(element);
                element.visible = false;
            }
        });

        this.nodeTextures();

        this.gameRunning = true;
    }

    updateAllObjects() {
        ///Update model animations
        const deltaT = this.clock.getDelta();

        ///Update Controls
        this.controls.update(deltaT);
        this.firstPersonControls.update(deltaT);

        this.checkCollision();

        // Update statistics
        this.statistics.update();

        this.renderViewPorts();

        this.renderMainScene();

        this.renderMiniMapScene();

        const time = Date.now() * 0.0005;

        if (this.meshes) {
            for (let i = 0; i < this.meshes.length; i++) {
                const mesh = this.meshes[i];

                if (mesh.geometry instanceof THREE.TorusGeometry) {
                    mesh.rotation.x = time;
                    mesh.rotation.y = time;
                    mesh.rotation.z = time;
                } else {
                    mesh.rotation.x = time;
                    mesh.rotation.y = time;
                }
            }

            this.scene3D.children[0].children[1].children.forEach(element => {
                if (element.geometry instanceof THREE.SphereGeometry) {
                    element.rotation.y = time;
                }
            });
        }
    }

    // Surrounding volumes technique
    checkCollision() {
        this.nodeCollision = false;
        this.connectionCollision = false;

        // Node sphere vs. Camera sphere
        this.nodeObjectFound = this.nodePositions.find(element =>
            this.cameraSphereObjectNode.distanceToPoint(element) < 0.36);

        if (this.nodeObjectFound) {
            this.nodeSphereObject = new THREE.Sphere(this.nodeObjectFound, 0.35);
            this.nodeCollision = this.cameraSphereObjectNode.intersectsSphere(this.nodeSphereObject);
        }

        // Connection box vs. Camera sphere
        this.connectionBoxes.forEach(connectionBox => {
            if (connectionBox.intersectsSphere(this.cameraSphereObjectConnection)) {
                this.connectionCollision = true;
            }
        });

        // Check if there's a collision and revert translate camera
        if (this.nodeCollision || this.connectionCollision) {
            if (this.firstPersonControls.moveForward) {
                this.firstPersonCamera.translateZ(this.firstPersonControls.actualMoveSpeed);
            }
            if (this.firstPersonControls.moveBackward) {
                this.firstPersonCamera.translateZ(-this.firstPersonControls.actualMoveSpeed);
            }
            if (this.firstPersonControls.moveLeft) {
                this.firstPersonCamera.translateX(this.firstPersonControls.actualMoveSpeed);
            }
            if (this.firstPersonControls.moveRight) {
                this.firstPersonCamera.translateX(-this.firstPersonControls.actualMoveSpeed);
            }
            if (this.firstPersonControls.moveUp) {
                this.firstPersonCamera.translateY(-this.firstPersonControls.actualMoveSpeed);
            }
            if (this.firstPersonControls.moveDown) {
                this.firstPersonCamera.translateY(this.firstPersonControls.actualMoveSpeed);
            }
        }
    }

    renderViewPorts() {
        // Render primary viewport(s)
        this.renderer.autoClear = false;
        this.renderer.clear();

        if (this.fog.enabled) {
            this.scene3D.fog = this.fog.object;
        }
        else {
            this.scene3D.fog = null;
        }
        let cameras;
        cameras = [this.activeViewCamera];

        for (const camera of cameras) {
            this.player.object.visible = false;

            this.renderer.render(this.scene2D, this.camera2D);
            this.renderer.clearDepth();
        }
    }

    renderMainScene() {
        // Main scene render
        this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        this.renderer.render(this.scene3D, this.activeViewCamera);
        this.renderer.clearDepth();
    }

    renderMiniMapScene() {
        // Minimap scene render
        if (this.miniMapCheckBox.checked) {
            this.scene3D.fog = null;
            this.player.object.visible = false;

            // Get the element that is a place holder for where we want to
            // Draw the scene
            const element = this.scene2D.userData.element;

            // Get its position relative to the page's viewport
            const rect = element.getBoundingClientRect();

            // check if it's offscreen. If so skip it
            if (rect.bottom < 0 || rect.top > this.renderer.domElement.clientHeight ||
                rect.right < 0 || rect.left > this.renderer.domElement.clientWidth) {

                return; // it's off screen
            }

            // Set the viewport
            const width = rect.right - rect.left;
            const height = rect.bottom - rect.top;
            const left = rect.left;
            const bottom = this.renderer.domElement.clientHeight - rect.bottom;

            // this.renderer.setScissor(left, bottom, width, height);
            this.renderer.setViewport(left, bottom, width, height);
            // this.renderer.setScissorTest(true);

            this.scene3D.background = null;
            // Disable main scene lights and emojis on minimap
            this.lights.object.cameraSpotLight.visible = false;
            this.lights.object.directionalLight.visible = true;

            this.emojis.forEach(emoji => {
                emoji.object.visible = false;
            });

            this.renderer.render(this.scene3D, this.scene2D.userData.camera);
            this.renderer.render(this.scene2D, this.camera2D);

            // Turn main scene lights and emojis again
            this.lights.object.cameraSpotLight.visible = true;
            this.lights.object.directionalLight.visible = false;

            this.emojis.forEach(emoji => {
                emoji.object.visible = true;
            });
        }
    }

    connectionHighlighter() {
        // scene3D.children[0] -> Group
        // scene3D.children[1] -> Camera
        // scene3D.children[0].children[0] -> lights | children[1] -> network

        // Update the picking ray with the camera and mouse position (cast a ray through the frustum)
        this.raycasterHighlight.setFromCamera(this.pointer, this.camera);
        this.intersected;

        // Connection uniforms
        this.connection;
        this.secondConnection;
        this.connectionsList = new Array();
        this.connectionMaterial;
        this.secondConnectionMaterial;

        let currentUniforms = {
            "color1": { value: new THREE.Color(0xf4f8ff) },
            "color2": { value: new THREE.Color("blue") }
        };
        let newUniforms = {
            "color1": { value: new THREE.Color(0xf4fff5) },
            "color2": { value: new THREE.Color("green") }
        };

        // Get the list of objects the ray intersected
        const intersectedObjects = this.raycasterHighlight.intersectObjects(this.scene3D.children[0].children[1].children);

        if (intersectedObjects.length > 0 && intersectedObjects[0].object.geometry instanceof THREE.SphereGeometry) {
            // Check if the newest selected object it's different from previous
            if (this.intersected != intersectedObjects[0].object) {

                if (this.intersected) {
                    this.intersected.material.emissive.setHex(this.intersected.currentHex);
                }

                this.intersected = intersectedObjects[0].object;

                let materialClone = this.intersected.material.clone();

                this.intersected.currentHex = this.intersected.material.emissive.getHex();

                let objectColorHex = this.intersected.material.color.getHex();

                materialClone.emissive.setHex(objectColorHex);
                this.intersected.material = materialClone;

                // Highlight player connection
                if (this.connection) {
                    this.connectionMaterial = this.connection.material.clone();
                    this.connectionMaterial.uniforms = currentUniforms;
                    this.connection.material = this.connectionMaterial;
                }
                // Highlight player's end connection
                if (this.secondConnection) {
                    this.secondConnectionMaterial = this.secondConnection.material.clone();
                    this.secondConnectionMaterial.uniforms = currentUniforms;
                    this.secondConnection.material = this.secondConnectionMaterial;
                }

                this.connectionsList = this.scene3D.children[0].children[1].children.filter(Object => Object.geometry
                    instanceof THREE.CylinderGeometry && Object.name == this.intersected.name);

                // Check if node has a different shortest path
                if (this.intersected.name > 100) {
                    // Rightmost number -> closest connection
                    this.secondClosestConnection = this.intersected.name % 10;
                    this.firstClosestConnection = this.secondClosestConnection * 10 + 1;

                    this.connectionsList = this.scene3D.children[0].children[1].children.filter(Object => Object.geometry
                        instanceof THREE.CylinderGeometry && (Object.name == this.firstClosestConnection ||
                            Object.name == this.secondClosestConnection));

                } else if (this.connectionsList[0].name > 10 && this.connectionsList[0].name < 100) {
                    // Leftmost number -> closest connection
                    this.closestConnection = Math.floor(this.connectionsList[0].name / 10);

                    this.connectionsList = this.scene3D.children[0].children[1].children.filter(Object => Object.geometry
                        instanceof THREE.CylinderGeometry && (Object.name == this.connectionsList[0].name ||
                            Object.name == this.closestConnection));
                }

                if (this.connectionsList.length == 1) {
                    this.connection = this.connectionsList[0];

                    if (this.secondConnection) {
                        this.secondConnection.material = this.secondConnectionMaterial;

                        this.secondConnection = null;
                    }
                } else if (this.connectionsList.length == 2) {
                    this.connection = this.connectionsList[1];
                    this.secondConnection = this.connectionsList[0];
                }

                if (this.connection) {
                    this.connectionMaterial = this.connection.material.clone();
                    this.connectionMaterial.uniforms = newUniforms;

                    this.connection.material = this.connectionMaterial;
                }
                if (this.secondConnection) {
                    this.secondConnectionMaterial = this.secondConnection.material.clone();
                    this.secondConnectionMaterial.uniforms = newUniforms;

                    this.secondConnection.material = this.secondConnectionMaterial;
                }
            }
        } else {
            if (this.intersected) {
                this.intersected.material.emissive.setHex(this.intersected.currentHex);

                this.intersected = null;
            }
            if (this.connection) {
                this.connectionMaterial = this.connection.material.clone();
                this.connectionMaterial.uniforms = currentUniforms;
                this.connection.material = this.connectionMaterial;

                this.connection = null;
            }
            if (this.secondConnection) {
                this.secondConnectionMaterial = this.secondConnection.material.clone();
                this.secondConnectionMaterial.uniforms = currentUniforms;
                this.secondConnection.material = this.secondConnectionMaterial;

                this.secondConnection = null;
            }
        }
    }

    connectionTooltipHighlighter() {
        // scene3D.children[0] -> Group
        // scene3D.children[1] -> Camera
        // scene3D.children[0].children[0] -> lights | children[1] -> network

        // Update the picking ray with the camera and mouse position (cast a ray through the frustum)
        this.raycasterTooltipHighlight.setFromCamera(this.pointer, this.camera);
        this.intersected2;

        // Get the list of objects the ray intersected
        const intersectedObjects = this.raycasterTooltipHighlight.intersectObjects(this.scene3D.children[0].children[1].children);

        if (intersectedObjects.length > 0 && intersectedObjects[0].object.geometry instanceof THREE.SphereGeometry) {
            // Check if the newest selected object it's different from previous
            if (this.intersected2 != intersectedObjects[0].object) {

                this.intersected2 = intersectedObjects[0].object;

                this.avatar = this.tooltipModels.find(element =>
                    element.object.position.x == this.intersected2.position.x - 0.6 &&
                    element.object.position.y == this.intersected2.position.y + 0.35 &&
                    element.object.position.z == this.intersected2.position.z);

                this.toolText = this.tooltipTexts.find(text =>
                    text.position.x == this.intersected2.position.x - 0.1 &&
                    text.position.y == this.intersected2.position.y + 0.55 &&
                    text.position.z == this.intersected2.position.z);
                if (this.toolText) this.toolText.visible = true;

                if (this.avatar) {
                    this.avatar.object.visible = true;

                    this.intersected2 = this.avatar;
                }
            }
        } else {
            if (this.intersected2) {

                this.intersected2.object.visible = false;
                this.toolText.visible = false;

                this.intersected2 = null;
            }
        }
    }

    // Load nodes' textures
    nodeTextures() {
        const loader = new DDSLoader();

        this.meshes = new Array();
        this.newMaterials = new Array();

        const map1 = loader.load('../three/examples/textures/compressed/disturb_dxt1_nomip.dds');
        map1.minFilter = map1.magFilter = THREE.LinearFilter;
        map1.anisotropy = 4;
        this.newMaterials.push(map1);

        const map2 = loader.load('../three/examples/textures/compressed/disturb_dxt1_mip.dds');
        map2.anisotropy = 4;
        this.newMaterials.push(map2);

        const map3 = loader.load('../three/examples/textures/compressed/hepatica_dxt3_mip.dds');
        map3.anisotropy = 4;
        this.newMaterials.push(map3);

        const map4 = loader.load('../three/examples/textures/compressed/explosion_dxt5_mip.dds');
        map4.anisotropy = 4;
        this.newMaterials.push(map4);

        const map5 = loader.load('../three/examples/textures/compressed/disturb_argb_nomip.dds');
        map5.minFilter = map5.magFilter = THREE.LinearFilter;
        map5.anisotropy = 4;
        this.newMaterials.push(map5);

        const map6 = loader.load('../three/examples/textures/compressed/disturb_argb_mip.dds');
        map6.anisotropy = 4;
        this.newMaterials.push(map6);

        this.cubemap2 = loader.load('../three/examples/textures/compressed/Mountains.dds', function (texture) {

            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;
            texture.mapping = THREE.CubeReflectionMapping;
            material1.needsUpdate = true;

        });
        this.newMaterials.push(this.cubemap2);

        this.cubemap2 = loader.load('../three/examples/textures/compressed/Mountains_argb_mip.dds', function (texture) {

            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;
            texture.mapping = THREE.CubeReflectionMapping;
            material5.needsUpdate = true;

        });
        this.newMaterials.push(this.cubemap2);

        this.cubemap3 = loader.load('../three/examples/textures/compressed/Mountains_argb_nomip.dds', function (texture) {

            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;
            texture.mapping = THREE.CubeReflectionMapping;
            material6.needsUpdate = true;

        });
        this.newMaterials.push(this.cubemap3);

        const material1 = new THREE.MeshPhongMaterial({ map: map1, envMap: this.cubemap2 });
        const material2 = new THREE.MeshPhongMaterial({ map: map2 });
        const material3 = new THREE.MeshPhongMaterial({ map: map3, alphaTest: 0.5, side: THREE.DoubleSide });
        const material4 = new THREE.MeshPhongMaterial({ map: map4, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthTest: false, transparent: true });
        const material5 = new THREE.MeshPhongMaterial({ envMap: this.cubemap2 });
        const material6 = new THREE.MeshPhongMaterial({ envMap: this.cubemap3 });
        this.newMaterials = [material1, material2, material3, material4, material5, material6];


        this.scene3D.children[0].children[1].children.forEach(element => {
            if (element.geometry instanceof THREE.SphereGeometry) {
                let randomNumber = Math.floor(Math.random() * (5 - 0)) + 0;
                let newMaterial = this.newMaterials[randomNumber];
                element.material = newMaterial;
            }
        });
        this.scene3D.children[0].children[1].children[0].material = material4;

        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

        // let mesh = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.25, 32, 16), material1);
        let mesh = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.05, 32, 16), material4);
        // mesh.position.x = 0;
        // mesh.position.y = 3;
        // mesh.rotateX(Math.PI / 2);
        // this.scene3D.add(mesh);
        // this.meshes.push(mesh);

        for (let k = 0; k < this.emojis.length; k++) {
            if (k % 2 != 0) {
                let randomNumber = Math.floor(Math.random() * (5 - 1)) + 0;
                let newMaterial = this.newMaterials[randomNumber];

                mesh = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.05, 32, 16), newMaterial);

                mesh.position.set(this.emojis[k].object.position.x, this.emojis[k].object.position.y,
                    this.emojis[k].object.position.z);

                this.scene3D.add(mesh);
                this.meshes.push(mesh);
            }
        };
    }

}