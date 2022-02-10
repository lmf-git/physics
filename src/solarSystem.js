export default SOLAR_SYSTEM = {
    name: "sun",
    surface: 5,
    spin: 0.1,
    SOISize: 1000,
    surfaceGravity: 300,
    color: 0x00ff00,
    position: [0, 5, 0],
    children: [
        {
            name: "lilOne",
            spin: 0.1,
            velocity: 0.02,
            surface: 1,
            SOISize: 15,
            surfaceGravity: 300,
            children: [],
            color: 0xffff00,
            position: [15, 5, 10],
        },
        {
            name: "lilOneTwo",
            velocity: 0.01,
            spin: 0.1,
            surface: 1,
            SOISize: 15,
            surfaceGravity: 300,
            children: [],
            color: 0xffff00,
            position: [5, 10, 20],
        }
    ]
};