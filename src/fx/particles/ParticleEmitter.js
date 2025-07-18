import { ParticlesSystem } from "mage-engine.particles";
import { Object3D } from "three";
import { PARTICLE_EMITTER_TYPES } from "./constants";
import Entity from "../../entities/Entity";
import { ENTITY_TYPES } from "../../entities/constants";
import Scene from "../../core/Scene";
import { generateRandomName } from "../../lib/uuid";

export default class ParticleEmitter extends Entity {
    constructor(options = {}) {
        super({ tag: "particle " });

        const { name = generateRandomName("Emitter") } = options;

        this.options = {
            ...options,
            name,
        };

        this.setSystem();
        this.setName(name);
        this.setBody({ body: new Object3D() });
        this.setEntityType(ENTITY_TYPES.PARTICLE.TYPE);
        this.setEntitySubtype(ENTITY_TYPES.PARTICLE.SUBTYPES.EMITTER);
    }

    setBody({ body }) {
        this.body = body;

        if (this.hasBody()) {
            this.addToScene();
        }
    }

    addToScene() {
        const { addUniverse = true } = this.options;

        if (this.hasBody()) {
            Scene.add(this.getBody(), this, addUniverse);
        } else {
            console.warn(ELEMENT_NOT_SET);
        }
    }

    isProtonEmitter() {
        return false;
    }

    getType() {
        return PARTICLE_EMITTER_TYPES.SINGLE;
    }

    hasSystem() {
        return !!this.system;
    }

    isSystemDead() {
        return this.system.finished;
    }

    setSystem() {
        const {
            container = this.getBody(),
            autostart = false,
            particles = {},
            system = {},
        } = this.options;

        this.system = new ParticlesSystem({
            container,
            autostart,
            particles,
            system,
        });
    }

    getSystem() {
        return this.system;
    }

    emit(...options) {
        if (this.hasSystem()) {
            this.system.start(...options);
        }

        return this;
    }

    stop() {
        if (this.hasSystem()) {
            this.system.stop();
        }
    }

    syncParticleEmitter() {
        if (this.hasSystem()) {
            const { position, rotation } = this.getWorldTransform();

            this.system.particleSystem.position.set(position.x, position.y, position.z);
            this.system.particleSystem.rotation.set(rotation.x, rotation.y, rotation.z);
        }
    }

    dispose() {
        super.dispose();
    }

    update(dt) {
        super.update(dt);

        if (this.hasSystem() && !this.isSystemDead()) {
            this.system.update(dt);
        }

        this.syncParticleEmitter();
    }
}
