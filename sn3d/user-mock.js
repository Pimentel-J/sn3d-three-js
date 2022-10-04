export const userNetworkData =
{
    id: '1',
    connectionId: 1,
    name: 'Filipe',
    tags: ['porto'],
    position: [0.0, 0.0, 0.0],
    totalPlayers: 14,
    connections: [
        {
            id: '2',
            connectionId: 1,
            name: 'Tiago',
            tags: ['arte'],
            position: [-2.2, 0.75, 1.5],
            firstConnections: []
        },
        {
            id: '3',
            name: 'Ana',
            connectionId: 2,
            tags: 'Porto',
            position: [1.9, 1.5, 1.2],
            firstConnections: [
                {
                    id: '31',
                    connectionId: 215, // 21 (node id) + 5 (closest path id)
                    name: 'Sergio',
                    tags: ['linguas'],
                    position: [3.5, 0.0, -2.5],
                    secondConnections: 5 // Pedro = closest path to central player
                },
                {
                    id: '32',
                    connectionId: 22,
                    name: 'Maria',
                    tags: ['Faro'],
                    position: [3.5, -0.3, 2.2],
                    secondConnections: []
                },
            ]
        },
        {
            id: '4',
            connectionId: 3,
            name: 'Joana',
            tags: ['design'],
            position: [0.75, -1.5, 1.7],
            firstConnections: [
                {
                    id: '41',
                    connectionId: 31,
                    name: 'Joao',
                    tags: 'IT',
                    position: [1.5, -0.25, 3.75],
                    secondConnections: []
                },
                {
                    id: '42',
                    connectionId: 32,
                    name: 'Luis',
                    tags: ['musica'],
                    position: [-2.95, -0.75, 2.7],
                    secondConnections: []
                }
            ]
        },
        {
            id: '5',
            connectionId: 4,
            name: 'Sara',
            tags: ['Aveiro'],
            position: [0.0, 0.5, -3.5],
            firstConnections: [
                {
                    id: '51',
                    connectionId: 41,
                    name: 'Juliana',
                    tags: ['jazz'],
                    position: [-3.0, -0.5, -3.2],
                    secondConnections: 6 // Nuno
                }
            ]
        },
        {
            id: '6',
            connectionId: 5,
            name: 'Pedro',
            tags: ['jogador'],
            position: [1.5, -1.0, -2.0],
            firstConnections: [
                {
                    id: '61',
                    connectionId: 52, // Connection 51 already in use
                    name: 'Manuel',
                    tags: ['Beja'],
                    position: [2.0, -0.5, -5.7],
                    secondConnections: []
                }
            ]
        },
        {
            id: '7',
            connectionId: 6,
            name: 'Nuno',
            tags: ['design'],
            position: [-5.0, 0.3, -2.0],
            firstConnections: [
                {
                    id: '71',
                    connectionId: 62, // Connection 61 already in use
                    name: 'Carla',
                    tags: ['Faro'],
                    position: [-6.0, -0.5, 0.3],
                    secondConnections: []
                }
            ]
        }
    ]
}