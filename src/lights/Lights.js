export const POINTLIGHT = 'pointlight';
export const AMBIENTLIGHT = 'ambientlight';
export const SUNLIGHT = 'sunlight';

const TIME_TO_UPDATE = 100;

export class Lights {

    constructor() {
        this.delayFactor = 0.1;
        this.delayStep = 30;
        this.holderRadius = 0.01;
        this.holderSegments = 1;
        this.numLights = 0;

        this.map = {};
        this.lights = [];
    }

    add(light) {
        this.lights.push(light);
    }

    update(dt) {
        return new Promise(resolve => {
            const start = new Date();
            for (let index in this.lights) {
                const light = this.lights[index];
                light.update(dt);
                if ((+new Date() - start) > TIME_TO_UPDATE) break;
            }
            resolve();
        });
    }

    toJSON() {
        return {
            lights: this.lights.map(l => l.toJSON())
        };
    }
}

export default new Lights();
