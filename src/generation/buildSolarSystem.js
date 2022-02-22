import { Mesh, SphereGeometry, MeshBasicMaterial, MeshPhongMaterial, Group, PointLight } from 'three';

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
    const body = buildBody(item, parent)
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