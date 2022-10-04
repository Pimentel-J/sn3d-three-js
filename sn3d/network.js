import * as THREE from '../three/build/three.module.js';
import Connection from './connection.js';
import Node from './node.js';
import { userNetworkData } from './user-mock.js';
import { FontLoader } from '../three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from '../three/examples/jsm/geometries/TextGeometry.js';

/**
 * Network
 * 
 * @parameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3
 * }
 */
export default class Network {
    constructor(parameters) {
        function onLoad(network, initialConfigs) {

            // Store the network's map and size
            network.map = initialConfigs.map;
            network.size = initialConfigs.size;

            // Store the player's initial position and direction
            network.initialPosition = network.cellToCartesian(initialConfigs.initialPosition);
            network.initialDirection = initialConfigs.initialDirection;

            // Store the network's exit location
            network.exitLocation = network.cellToCartesian(initialConfigs.exitLocation);

            // Create a group of objects
            network.object = new THREE.Group();

            // Create a connection
            network.connection = new Connection({ textureUrl: initialConfigs.connectionTextureUrl });

            // Create a node
            network.node = new Node({ textureUrl: initialConfigs.nodeTextureUrl });

            let nodeObject, nodeObjectConnection;
            const nodesMap = new Map();
            const secondConnections = new Map();

            // Create player node
            const playerNodeObject = network.node.object.clone();
            playerNodeObject.position.set(0.0, 0.0, 0.0);
            playerNodeObject.name = userNetworkData.connectionId;

            // Create label
            var loader = new FontLoader();
            loader.load('../three/examples/fonts/helvetiker_bold.typeface.json', function (font) {
                var label = userNetworkData.name + "\n[" + userNetworkData.tags + "]";
                var geometry = new TextGeometry(label, { font: font, size: 0.125, height: 0.005 });
                geometry.center();
                var textM = new THREE.MeshPhongMaterial({ color: 0xffffff });
                var text = new THREE.Mesh(geometry, textM);
                text.position.set(playerNodeObject.position.x - 0.1, playerNodeObject.position.y + 0.55,
                    playerNodeObject.position.z);
                text.rotateX(Math.PI);
                text.rotateY(Math.PI);
                text.rotateZ(Math.PI);
                network.object.add(text);
            });

            // TODO - change color
            network.object.add(playerNodeObject);

            //Create player's network nodes
            for (let i = 0; i < userNetworkData.connections.length; i++) {
                let nodePosition = userNetworkData.connections[i].position;
                let nodeX = nodePosition[0];
                let nodeY = nodePosition[1];
                let nodeZ = nodePosition[2];

                nodeObject = network.node.object.clone();
                nodeObject.position.set(nodeX, nodeY, nodeZ);
                nodeObject.name = userNetworkData.connections[i].connectionId;

                // Create label
                loader = new FontLoader();
                loader.load('../three/examples/fonts/helvetiker_bold.typeface.json', function (font) {
                    var label = userNetworkData.connections[i].name + "\n[" + userNetworkData.connections[i].tags + "]";
                    var geometry = new TextGeometry(label, { font: font, size: 0.1, height: 0.005 });
                    geometry.center();
                    var textM = new THREE.MeshPhongMaterial({ color: 0xffffff });
                    var text = new THREE.Mesh(geometry, textM);
                    text.position.set(nodeX - 0.1, nodeY + 0.55, nodeZ);
                    text.rotateX(Math.PI);
                    text.rotateY(Math.PI);
                    text.rotateZ(Math.PI);
                    network.object.add(text);
                });

                network.object.add(nodeObject);

                // Add node (key)
                nodesMap.set(nodeObject, new Set());

                if (userNetworkData.connections[i].firstConnections.length != 0) {
                    for (let h = 0; h < userNetworkData.connections[i].firstConnections.length; h++) {
                        let nodePosition = userNetworkData.connections[i].firstConnections[h].position;
                        let nodeX = nodePosition[0];
                        let nodeY = nodePosition[1];
                        let nodeZ = nodePosition[2];

                        nodeObjectConnection = network.node.object.clone();
                        nodeObjectConnection.position.set(nodeX, nodeY, nodeZ);
                        nodeObjectConnection.name = userNetworkData.connections[i].firstConnections[h].connectionId;

                        // Create label
                        loader = new FontLoader();
                        loader.load('../three/examples/fonts/helvetiker_bold.typeface.json', function (font) {
                            var label = userNetworkData.connections[i].firstConnections[h].name + "\n[" +
                                userNetworkData.connections[i].firstConnections[h].tags + "]";
                            var geometry = new TextGeometry(label, { font: font, size: 0.1, height: 0.005 });
                            geometry.center();
                            var textM = new THREE.MeshPhongMaterial({ color: 0xffffff });
                            var text = new THREE.Mesh(geometry, textM);
                            text.position.set(nodeX - 0.1, nodeY + 0.55, nodeZ);
                            text.rotateX(Math.PI);
                            text.rotateY(Math.PI);
                            text.rotateZ(Math.PI);
                            network.object.add(text);
                        });

                        network.object.add(nodeObjectConnection);

                        // Get nodeObject (key) Set (value) and add node
                        nodesMap.get(nodeObject).add(nodeObjectConnection);

                        // Check if node has second connections and save it
                        if (userNetworkData.connections[i].firstConnections[h].secondConnections.length != 0) {
                            let firstConnectionId = userNetworkData.connections[i].firstConnections[h].connectionId;
                            let secondConnectionId = userNetworkData.connections[i].firstConnections[h].secondConnections;

                            secondConnections.set(firstConnectionId, secondConnectionId);
                        }

                    }
                }

            }

            // Create connections
            let nodePosition = new THREE.Vector3();
            let nextNodePosition = new THREE.Vector3();
            let connectionObject;

            nodesMap.forEach((value, key, map) => {
                playerNodeObject.getWorldPosition(nodePosition);
                key.getWorldPosition(nextNodePosition);

                connectionObject = network.connection.object.clone();
                // Sets this vector to be the vector linearly interpolated between v1 and v2
                // where alpha is the percent distance along the line connecting the two vectors
                connectionObject.position.lerpVectors(nodePosition, nextNodePosition, 0.5);
                connectionObject.lookAt(nodePosition); // Front/strong side = blue
                connectionObject.rotateX(Math.PI / 2.0);

                let distance = nodePosition.distanceTo(nextNodePosition);
                connectionObject.scale.set(1, distance, 1);

                connectionObject.name = key.name;

                network.object.add(connectionObject);

                // Check if key's (node) values (nodes) have 1st connections
                if (value.size != 0) {
                    value.forEach((setValue, set) => {
                        key.getWorldPosition(nodePosition);
                        setValue.getWorldPosition(nextNodePosition);

                        connectionObject = network.connection.object.clone();
                        connectionObject.position.lerpVectors(nodePosition, nextNodePosition, 0.5);
                        connectionObject.lookAt(nodePosition); // Front/strong side = blue
                        connectionObject.rotateX(Math.PI / 2.0);

                        let distance = nodePosition.distanceTo(nextNodePosition);
                        connectionObject.scale.set(1, distance, 1);

                        if (setValue.name > 100) {
                            var connectionId = Math.floor(setValue.name / 10);
                            connectionObject.name = connectionId;
                        } else {
                            connectionId = setValue.name;
                            connectionObject.name = setValue.name;
                        }

                        network.object.add(connectionObject);

                        // Check if there's a 2nd connection to this value and create it
                        if (secondConnections.has(setValue.name)) {
                            let secondConnectionId = secondConnections.get(setValue.name);
                            let firstConnection = userNetworkData.connections.find(Object =>
                                Object.connectionId == secondConnectionId);

                            let firstConnectionPosition = new THREE.Vector3(firstConnection.position[0],
                                firstConnection.position[1], firstConnection.position[2]);

                            connectionObject = network.connection.object.clone();
                            connectionObject.position.lerpVectors(nextNodePosition, firstConnectionPosition, 0.5);
                            connectionObject.lookAt(nextNodePosition); // Front/strong side = blue
                            connectionObject.rotateX(Math.PI / 2.0);

                            let distance = nextNodePosition.distanceTo(firstConnectionPosition);
                            connectionObject.scale.set(1, distance, 1);

                            secondConnectionId *= 10;
                            connectionObject.name = secondConnectionId + 1;

                            network.object.add(connectionObject);
                        }

                    });
                }

            });

            network.object.scale.set(network.scale.x, network.scale.y, network.scale.z);
            network.loaded = true;
        }

        function onProgress(url, xhr) {
            console.log('Resource "' + url + '" ' + (100.0 * xhr.loaded / xhr.total).toFixed(0) + '% loaded.');
        }

        function onError(url, error) {
            console.error('Error loading resource ' + url + ' (' + error + ').');
        }

        for (const [key, value] of Object.entries(parameters)) {
            Object.defineProperty(this, key, { value: value, writable: true, configurable: true, enumerable: true });
        }
        this.loaded = false;

        // The cache must be enabled; additional information available at https://threejs.org/docs/api/en/loaders/FileLoader.html
        THREE.Cache.enabled = true;

        // Create a resource file loader
        const loader = new THREE.FileLoader();

        // Set the response type: the resource file will be parsed with JSON.parse()
        loader.setResponseType('json');

        // Load a network initialConfigs resource file
        loader.load(
            //Resource URL
            this.url,

            // onLoad callback
            initialConfigs => onLoad(this, initialConfigs),

            // onProgress callback
            xhr => onProgress(this.url, xhr),

            // onError callback
            error => onError(this.url, error)
        );
    }

    // Convert cell [line, column] coordinates to cartesian (x, y, z) coordinates
    cellToCartesian(position) {
        return new THREE.Vector3((position[1] - this.size.height / 2.0 + 0.5) * this.scale.x, 0.0, (position[0] - this.size.width / 2.0 + 0.5) * this.scale.z)
    }

    // Convert cartesian (x, y, z) coordinates to cell [line, column] coordinates
    cartesianToCell(position) {
        return [Math.floor(position.z / this.scale.z + this.size.width / 2.0), Math.floor(position.x / this.scale.x + this.size.height / 2.0)];
    }

    foundExit(position) {
        return Math.abs(position.x - this.exitLocation.x) < 0.5 * this.scale.x && Math.abs(position.z - this.exitLocation.z) < 0.5 * this.scale.z
    };
}