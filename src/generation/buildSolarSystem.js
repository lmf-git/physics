import { 
    Mesh, SphereGeometry, MeshBasicMaterial, 
    Geometry, LineBasicMaterial, LineLoop,
    MeshPhongMaterial, Group, PointLight, Vector3,
    RingGeometry, DoubleSide
} from 'three';

function buildBody(item) {
    const mat = item.emissive ?
        new MeshPhongMaterial({ emissive: item.color, wireframe: false, color: item.color })
        :
        new MeshBasicMaterial({ wireframe: true, color: item.color });

    const body = new Mesh(new SphereGeometry(item.surface, 20, 20), mat);

    if (item.emissive) {
        pointLight = new PointLight(0xffffff);
        pointLight.position.set(0, 0, 0);
        body.add(pointLight);
    }

    return body;
}

export default function buildSolarSystem(item, parent) {
    const body = buildBody(item, parent);
    body.position.set(...item.position);

    // Add orbit path line.
    const orbitPath = new Mesh(
        new RingGeometry(25, 25.05, 96),
        new MeshBasicMaterial({ color: 0xffff00, side: DoubleSide })
    );
    if (parent) body.add(orbitPath);

    item.pivot = new Group();
    item.body = body;
    item.pivot.add(item.body);
    item.parent = parent;
    WORLD.planets.push(item);

    // Recursively build children (multi-galactic support).
    item.children.map(e => {
        item.pivot.add(buildSolarSystem(e, item));
    });

    return item.pivot;
}