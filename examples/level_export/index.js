import {
    Router,
    store,
    Level,
    Box,
    Scene,
    Cube,
    Controls,
    Models,
    AmbientLight,
    PHYSICS_EVENTS,
    constants,
    Scripts,
    PALETTES,
    SunLight,
    HemisphereLight,
    Sky,
    Exporter,
    BaseScript,
} from "../../dist/mage.js";

class SimpleScript extends BaseScript {
    constructor() {
        super("SimpleScript");
    }

    start(element, { offset = 0 }) {
        this.element = element;
        this.angle = offset;
    }

    update(dt) {
        this.angle += dt;

        // this.element.setPosition({ x: Math.sin(this.angle) * 10 });
        this.element.setRotation({
            x: 2 * Math.cos(this.angle),
            y: 2 * Math.sin(this.angle),
        });
    }
}

export default class Intro extends Level {
    addAmbientLight() {
        const ambientLight = new AmbientLight({
            color: PALETTES.FRENCH_PALETTE.SPRAY,
            intensity: 0.5,
        });

        const hemisphereLight = new HemisphereLight({
            color: {
                sky: PALETTES.FRENCH_PALETTE.SQUASH_BLOSSOM,
                ground: PALETTES.FRENCH_PALETTE.REEF_ENCOUNTER,
            },
            intensity: 1,
        });

        const sunLight = new SunLight({
            color: PALETTES.FRENCH_PALETTE.MELON_MELODY,
            intensity: 1,
            far: 20,
            mapSize: 2048,
        });
        sunLight.setPosition({ y: 4, z: -3, x: -3 });
        // sunLight.addHelpers();
    }

    createSky() {
        Sky.create({
            sunInclination: 0.1,
            sunAzimuth: 0.1,
            sunDistance: 100,
        });
    }

    addBox() {
        const box = new Cube(5, 0xffffff);

        box.setMaterialFromName(constants.MATERIALS.STANDARD, { roughness: 0.5, metalness: 0 });
        box.setTexture("woodMap", constants.TEXTURES.MAP);
        box.setTexture("woodAO", constants.TEXTURES.AO);
        box.setTexture("woodBump", constants.TEXTURES.BUMP);
        box.setTexture("woodNormal", constants.TEXTURES.NORMAL);
        box.setTexture("woodRoughness", constants.TEXTURES.ROUGHNESS);

        box.addScript("SimpleScript");
        window.box = box;
    }

    onCreate() {
        Scripts.register("SimpleScript", SimpleScript);
        Scene.getCamera().setPosition({ y: 10 });
        Controls.setOrbitControl();
        this.addAmbientLight();
        this.createSky();

        this.addBox();

        document.querySelector(".save-button").addEventListener("click", () => {
            this.save();
        });
    }

    save() {
        Exporter.export({
            config: true,
            assets: true,
        });
    }
}

const assets = {
    "/": {
        textures: {
            woodMap: "assets/Wood_025_basecolor.jpg",
            woodAO: "assets/Wood_025_ambientOcclusion.jpg",
            woodBump: "assets/Wood_025_height.png",
            woodNormal: "assets/Wood_025_normal.jpg",
            woodRoughness: "assets/Wood_025_roughness.jpg",
        },
    },
};

const { SHADOW_TYPES } = constants;

const config = {
    screen: {
        h: window ? window.innerHeight : 800,
        w: window ? window.innerWidth : 600,
        ratio: window ? window.innerWidth / window.innerHeight : 600 / 800,
        frameRate: 60,
        alpha: true,
    },

    lights: {
        shadows: true,
        shadowType: SHADOW_TYPES.HARD,
        textureAnisotropy: 32,
    },

    physics: {
        enabled: true,
        path: "dist/ammo.js",
        gravity: { x: 0, y: -9.8, z: 0 },
    },

    tween: {
        enabled: false,
    },

    camera: {
        fov: 75,
        near: 0.1,
        far: 3000000,
    },
};

window.addEventListener("load", () => {
    store.createStore({}, {}, true);

    Router.on("/", Intro);

    Router.start(config, assets);
});
