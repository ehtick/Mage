import { toPng } from "html-to-image";
import { SpriteMaterial, Texture, Sprite } from "three";
import Images from "../../images/Images";
import Element from "../Element";
import { render } from "inferno";
import { createElement } from "inferno-create-element";
import { getUIContainer, unmount } from "../../ui";
import { ENTITY_TYPES } from "../constants";
import { LABEL_DOMELEMENT_MISSING } from "../../lib/messages";
import { generateRandomName } from "../../lib/uuid";

export default class Label extends Element {
    constructor({ Component, format = "png", width, height, ...options }) {
        super({ format, width, height, options });
        const { name = generateRandomName("label") } = this.options;

        this.Component = Component;
        this.format = format;
        this.width = width;
        this.height = height;

        this.setName(name);
        this.render(Component);
    }

    buildContainerId = () => `#${this.getName()}`;

    createSprite = element => map => {
        const material = new SpriteMaterial({ map });
        const { offsetWidth, offsetHeight } = element;

        const body = new Sprite(material);
        body.scale.x = this.width || offsetHeight;
        body.scale.y = this.height || offsetWidth;

        this.setBody({ body });
        this.setEntityType(ENTITY_TYPES.LABEL.TYPE);
        this.setEntitySubType(ENTITY_TYPES.LABEL.SUBTYPES.DEFAULT);
    };

    onLabelUpdate = domElement =>
        this.convertToPng(domElement)
            .then(this.updateTexture(this.getName(), domElement))
            .catch(console.log);

    onLabelMount = domElement =>
        this.convertToPng(domElement)
            .then(this.updateTexture(this.getName(), domElement))
            .then(this.createSprite(domElement))
            .catch(console.log);

    onLabelUnmount = () => Images.disposeTexture(this.getName());

    updateTexture = (id, element) => dataUrl => {
        let texture = Images.get(id);
        const { offsetWidth: width, offsetHeight: height } = element;

        if (!texture) {
            const image = new Image();
            texture = new Texture(image);

            Images.add(id, texture);
        }

        if (texture.image.src !== dataUrl) {
            texture.image.src = dataUrl;
            texture.image.height = height;
            texture.image.width = width;
            texture.needsUpdate = true;
        }

        return Promise.resolve(texture);
    };

    render(Component) {
        render(
            createElement(Component, {
                onUpdate: this.onLabelUpdate,
                onMount: this.onLabelMount,
                onUnmount: this.onLabelUnmount,
                ...this.options,
            }),
            getUIContainer(this.buildContainerId()),
        );
    }

    convertToPng = domElement =>
        domElement
            ? toPng(domElement, { cacheBust: false })
            : Promise.reject(LABEL_DOMELEMENT_MISSING);

    dispose() {
        super.dispose();
        unmount(this.buildContainerId());
    }
}
