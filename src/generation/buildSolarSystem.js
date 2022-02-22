import { Mesh, SphereGeometry, MeshBasicMaterial, Group } from 'three';

function BuildBody(item, parent) {
    const body = new Mesh(
        new SphereGeometry(item.surface, 20, 20),
        new MeshBasicMaterial({ wireframe: true, color: item.color })
    );
    return body;
}


export default function buildSolarSystem(item,parent) {
    const body = BuildBody(item, parent)
    body.position.set(...item.position);

    item.pivot = new Group();
    item.body = body;
    item.pivot.add(item.body);
    item.parent = parent;
    WORLD.planets.push(item);

    // Recursively build children (multi-galactic support).
    if (item.children)
        item.children.forEach(
            e => item.pivot.add(buildSolarSystem(e, item))
        );

    return item.pivot;
}