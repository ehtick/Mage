import Element from "../Element";
import { ENTITY_TYPES } from "../constants";
import {
    LineSegments,
    LineBasicMaterial,
    Float32BufferAttribute,
    Color,
    BufferGeometry,
} from "three";
import { generateRandomName } from "../../lib/uuid";

class AxesHelper extends LineSegments {
    constructor(size = 1, thickness = 1) {
        const vertices = [0, 0, 0, size, 0, 0, 0, 0, 0, 0, size, 0, 0, 0, 0, 0, 0, size];

        const colors = [1, 0, 0, 1, 0.6, 0, 0, 1, 0, 0.6, 1, 0, 0, 0, 1, 0, 0.6, 1];

        const geometry = new BufferGeometry();
        geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
        geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));

        const material = new LineBasicMaterial({
            vertexColors: true,
            toneMapped: false,
            linewidth: thickness,
        });

        super(geometry, material);

        this.type = "AxesHelper";
    }

    setColors(xAxisColor, yAxisColor, zAxisColor) {
        const color = new Color();
        const array = this.geometry.attributes.color.array;

        color.set(xAxisColor);
        color.toArray(array, 0);
        color.toArray(array, 3);

        color.set(yAxisColor);
        color.toArray(array, 6);
        color.toArray(array, 9);

        color.set(zAxisColor);
        color.toArray(array, 12);
        color.toArray(array, 15);

        this.geometry.attributes.color.needsUpdate = true;

        return this;
    }

    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}

export default class Axes extends Element {
    constructor(size, thickness) {
        const options = {
            size,
            thickness,
            name: generateRandomName("AxesHelper"),
        };

        super(options);
        const body = new AxesHelper(size, thickness);

        this.setBody({ body });
        this.setEntityType(ENTITY_TYPES.HELPER.TYPE);
        this.setEntitySubtype(ENTITY_TYPES.HELPER.SUBTYPES.AXES);
    }

    update() {}
}
