M.fx.shadersEngine.create("Skybox", {
    instance: function(options) {
        var cubeMap = new THREE.CubeTexture( [] );
        cubeMap.format = THREE.RGBFormat;
        
        var _buildCube = function(image) {
            var getSide = function ( x, y ) {
                var size = 1024;
                var canvas = document.createElement( 'canvas' );
                canvas.width = size;
                canvas.height = size;
                var context = canvas.getContext( '2d' );
                context.drawImage( image, - x * size, - y * size );
                return canvas;
            };

            cubeMap.images[ 0 ] = getSide( 2, 1 ); // px
            cubeMap.images[ 1 ] = getSide( 0, 1 ); // nx
            cubeMap.images[ 2 ] = getSide( 1, 0 ); // py
            cubeMap.images[ 3 ] = getSide( 1, 2 ); // ny
            cubeMap.images[ 4 ] = getSide( 1, 1 ); // pz
            cubeMap.images[ 5 ] = getSide( 3, 1 ); // nz
            cubeMap.needsUpdate = true;
        }

        if (options.texture) {
            _buildCube(options.texture);
        } else {
            var textureName = options.textureName || 'skybox';
            _buildCube(M.imagesEngine.get(textureName));
        }
        

        var cubeShader = THREE.ShaderLib[ 'cube' ];
        cubeShader.uniforms[ 'tCube' ].value = cubeMap;


        var skyBoxMaterial = new THREE.ShaderMaterial( {
            fragmentShader: cubeShader.fragmentShader,
            vertexShader: cubeShader.vertexShader,
            uniforms: cubeShader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        } );

        var skyBox = new THREE.Mesh(
            new THREE.BoxGeometry( 1000000, 1000000, 1000000 ),
            skyBoxMaterial
        );
    
        return skyBox;
    },

    options: {
        textureName: {
            name: 'texture',
            type: 'string',
            default: 'skybox',
            mandatory: true
        }
    }
});