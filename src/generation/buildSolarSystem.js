import { Mesh, SphereGeometry, MeshBasicMaterial, Group } from 'three';

export default function buildSolarSystem(item) {
    const body = new Mesh(
        new SphereGeometry(item.surface, 20, 20),
        new MeshBasicMaterial({ wireframe: true, color: item.color })
    );
    body.position.set(...item.position);

    item.pivot = new Group();
    item.body = body;
    item.pivot.add(item.body);

    WORLD.planets.push(item);

    // Recursively build children (multi-galactic support).
    if (item.children)
        item.children.forEach(
            e => item.pivot.add(buildSolarSystem(e))
        );

    return item.pivot;
}