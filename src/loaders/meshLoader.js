import Mesh from '../entities/Mesh';
import ShaderMesh from '../entities/ShaderMesh';
import ImagesEngine from '../images/ImagesEngine'
import Loader from './Loader';
import ScriptManager from '../scripts/ScriptManager';
import {
    RepeatWrapping
} from 'three';

export class MeshLoader extends Loader {

    constructor() {
        super();
    }

    load(meshes = [], options = {}) {
        this.options = options;
        try {
            meshes
                .map(({mesh, scripts, texture, ...opts }) => (
                    this.loadMesh(this.parseMesh(mesh), scripts, texture, opts)
                )).map(MeshLoader.executeStartScript);
        } catch(e) {
            console.log(e);
        }
    }

    parseMesh(mesh) {
        return this.loader.parse(mesh);
    }

    loadMesh(parsedMesh, scripts, texture, meshOptions) {

        const { scriptEnabled = true } = this.options;
        const mesh = new Mesh(parsedMesh.geometry, parsedMesh.material, meshOptions);

        mesh.position({ ...parsedMesh.position });
        mesh.rotation({ ...parsedMesh.rotation });
        mesh.scale({ ...parsedMesh.scale });

        if (scripts && scripts.length) {
            mesh.setScripts(scripts, scriptEnabled);
        }

        return mesh;
    }

    static executeStartScript(element) {
        element.start();
        return element;
    }
}

export default new MeshLoader();
