function createModel(name, index){

     // texture

     var manager = new THREE.LoadingManager();
     manager.onProgress = function ( item, loaded, total ) {

        //console.log( item, loaded, total );

    };

    var texture = new THREE.Texture();

    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            //console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };

    var onError = function ( xhr ) {
    };

   
    var pivot;

    var model = new THREE.Object3D();
    // model
    var loader = new THREE.OBJLoader( manager );
    loader.load( 'models/bq/iPhone6_v3.obj', function ( object ) {
  
        object.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {

                ////console.log(child);
                child.name = name;
                child.index = index;

                child.geometry.computeBoundingBox();
                child.geometry.computeVertexNormals();
                 ////console.log(lastSelectedItem);
                var bb = child.geometry.boundingBox;

                var xsize = bb.max.x - bb.min.x;
                var ysize = bb.max.y - bb.min.y;
                var zsize = bb.max.z - bb.min.z;

                
                //child.position.set( xsize, ysize, zsize );
                //child.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( -xsize, -ysize, -zsize ) );
                
                //console.log("Index");
                //console.log(index);
                //console.log(child.position.x);
                //console.log(child.position.y);
                //console.log(child.position.z);

                child.scale.x = child.scale.y = child.scale.z = 0.1;

                /*
                child.scale.x = child.scale.x * 2 * Math.random();
                child.scale.y = child.scale.y * 2 * Math.random(); 
                child.scale.z = child.scale.z * 2 * Math.random();
                */
                /*
                var bb = child.geometry.boundingBox;

                var xsize = bb.max.x - bb.min.x;
                var ysize = bb.max.y - bb.min.y;
                var zsize = bb.max.z - bb.min.z;

                
                child.position.set( xsize, ysize, zsize );
                child.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( -xsize, -ysize, -zsize ) );
                */

               
                //pivot.add(child);

                objects.push( child );
                //child.position.y += 2;

                var materialEsfera = new THREE.MeshPhongMaterial({
                    ambient: 0x999999,
                    color: 0xFFFFFF,
                    specular: 0x999999,
                    shininess: 250
                });

                //child.material.map = texture;
                child.material = materialEsfera;

            }

        } );

        model.add( object );

    }, onProgress, onError );


    return model;

}

function createModelBQCervantes(name, index){

     // texture

     var manager = new THREE.LoadingManager();
     manager.onProgress = function ( item, loaded, total ) {

        //console.log( item, loaded, total );

    };

    var texture = new THREE.Texture();

    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            //console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };

    var onError = function ( xhr ) {
    };


    var loader = new THREE.ImageLoader( manager );
    loader.load(  'models/bq/textures/bq_cercvantes.jpg', function ( image ) {
    //loader.load(  'models/bq/textures/bq.png', function ( image ) {

        texture.image = image;
        texture.needsUpdate = true;

    } );

    var pivot;

    var model = new THREE.Object3D();
    // model
    var loader = new THREE.OBJLoader( manager );
    loader.load( 'models/bq/bqCervantes_v2.obj', function ( object ) {
    //loader.load( 'models/bq/bq_v3.obj', function ( object ) {
  
        object.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {

                ////console.log(child);
                child.name = name;
                child.index = index;

                child.geometry.computeBoundingBox();
                child.geometry.computeVertexNormals();
                 ////console.log(lastSelectedItem);
                var bb = child.geometry.boundingBox;

                var xsize = bb.max.x - bb.min.x;
                var ysize = bb.max.y - bb.min.y;
                var zsize = bb.max.z - bb.min.z;

                
                //child.position.set( xsize, ysize, zsize );
                //child.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( -xsize, -ysize, -zsize ) );
                
                //console.log("Index");
                //console.log(index);
                //console.log(child.position.x);
                //console.log(child.position.y);
                //console.log(child.position.z);

                child.scale.x = child.scale.y = child.scale.z = 0.2;

                child.position.y += 0.2;

                /*
                child.scale.y *= 0.4;
                child.scale.x *= 1.4;
                child.scale.z *= 0.2;
                */
                /*
                child.scale.x = child.scale.x * 2 * Math.random();
                child.scale.y = child.scale.y * 2 * Math.random(); 
                child.scale.z = child.scale.z * 2 * Math.random();
                */
                /*
                var bb = child.geometry.boundingBox;

                var xsize = bb.max.x - bb.min.x;
                var ysize = bb.max.y - bb.min.y;
                var zsize = bb.max.z - bb.min.z;

                
                child.position.set( xsize, ysize, zsize );
                child.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( -xsize, -ysize, -zsize ) );
                */

               
                //pivot.add(child);

                objects.push( child );
                //child.position.y += 2;

                var materialEsfera = new THREE.MeshPhongMaterial({
                    ambient: 0x999999,
                    color: 0xFFFFFF,
                    specular: 0x999999,
                    shininess: 250,
                    map: texture
                });

                //child.material.map = texture;
                child.material = materialEsfera;

            }

        } );

        model.add( object );

    }, onProgress, onError );


    return model;

}


function createModelBQ10(name, index){

     // texture

     var manager = new THREE.LoadingManager();
     manager.onProgress = function ( item, loaded, total ) {

        //console.log( item, loaded, total );

    };

    var texture = new THREE.Texture();

    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            //console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };

    var onError = function ( xhr ) {
    };


    var loader = new THREE.ImageLoader( manager );
    loader.load(  'models/bq/textures/bq_aquaris_e10.jpg', function ( image ) {
    //loader.load(  'models/bq/textures/bq.png', function ( image ) {


        texture.image = image;
        texture.needsUpdate = true;

    } );

    var pivot;

    var model = new THREE.Object3D();
    // model
    var loader = new THREE.OBJLoader( manager );
    loader.load( 'models/bq/bq10.obj', function ( object ) {
    //loader.load( 'models/bq/bq_v3.obj', function ( object ) {
  
        object.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {

                //console.log(child);
                child.name = name;
                child.index = index;

                child.geometry.computeBoundingBox();
                child.geometry.computeVertexNormals();
                 //console.log(lastSelectedItem);
                var bb = child.geometry.boundingBox;

                var xsize = bb.max.x - bb.min.x;
                var ysize = bb.max.y - bb.min.y;
                var zsize = bb.max.z - bb.min.z;

                
                //child.position.set( xsize, ysize, zsize );
                //child.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( -xsize, -ysize, -zsize ) );
                
                //console.log("Index");
                //console.log(index);
                //console.log(child.position.x);
                //console.log(child.position.y);
                //console.log(child.position.z);

                child.scale.x = child.scale.y = child.scale.z = 0.4;

                child.scale.y *= 0.4;
                child.scale.x *= 1.4;
                child.scale.z *= 0.2;
                /*
                child.scale.x = child.scale.x * 2 * Math.random();
                child.scale.y = child.scale.y * 2 * Math.random(); 
                child.scale.z = child.scale.z * 2 * Math.random();
                */
                /*
                var bb = child.geometry.boundingBox;

                var xsize = bb.max.x - bb.min.x;
                var ysize = bb.max.y - bb.min.y;
                var zsize = bb.max.z - bb.min.z;

                
                child.position.set( xsize, ysize, zsize );
                child.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( -xsize, -ysize, -zsize ) );
                */

               
                //pivot.add(child);

                objects.push( child );
                //child.position.y += 2;

                var materialEsfera = new THREE.MeshPhongMaterial({
                    ambient: 0x999999,
                    color: 0xFFFFFF,
                    specular: 0x999999,
                    shininess: 250,
                    map: texture
                });

                //child.material.map = texture;
                child.material = materialEsfera;

            }

        } );

        model.add( object );

    }, onProgress, onError );


    return model;

}



function createModelBQ4(name, index){

     // texture

     var manager = new THREE.LoadingManager();
     manager.onProgress = function ( item, loaded, total ) {

        //console.log( item, loaded, total );

    };

    var texture = new THREE.Texture();

    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            //console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };

    var onError = function ( xhr ) {
    };


    var loader = new THREE.ImageLoader( manager );
    
    loader.load(  'models/bq/textures/bqE4.png', function ( image ) {


        texture.image = image;
        texture.needsUpdate = true;

    } );

    var pivot;

    var model = new THREE.Object3D();
    // model
    var loader = new THREE.OBJLoader( manager );
   
    loader.load( 'models/bq/bq_v3.obj', function ( object ) {
  
        object.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {

                //console.log(child);
                child.name = name;
                child.index = index;

                child.geometry.computeBoundingBox();
                child.geometry.computeVertexNormals();
                 //console.log(lastSelectedItem);
                var bb = child.geometry.boundingBox;

                var xsize = bb.max.x - bb.min.x;
                var ysize = bb.max.y - bb.min.y;
                var zsize = bb.max.z - bb.min.z;

                
                //child.position.set( xsize, ysize, zsize );
                //child.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( -xsize, -ysize, -zsize ) );
                
                //console.log("Index");
                //console.log(index);
                //console.log(child.position.x);
                //console.log(child.position.y);
                //console.log(child.position.z);

                child.scale.x = child.scale.y = child.scale.z = 0.08;

                /*
                child.scale.y *= 0.4;
                child.scale.x *= 1.4;
                child.scale.z *= 0.2;
                */
                /*
                child.scale.x = child.scale.x * 2 * Math.random();
                child.scale.y = child.scale.y * 2 * Math.random(); 
                child.scale.z = child.scale.z * 2 * Math.random();
                */
                /*
                var bb = child.geometry.boundingBox;

                var xsize = bb.max.x - bb.min.x;
                var ysize = bb.max.y - bb.min.y;
                var zsize = bb.max.z - bb.min.z;

                
                child.position.set( xsize, ysize, zsize );
                child.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( -xsize, -ysize, -zsize ) );
                */

               
                //pivot.add(child);

                objects.push( child );
                //child.position.y += 2;

                var materialEsfera = new THREE.MeshPhongMaterial({
                    ambient: 0x999999,
                    color: 0xFFFFFF,
                    specular: 0x999999,
                    shininess: 250,
                    map: texture
                });

                //child.material.map = texture;
                child.material = materialEsfera;

            }

        } );

        model.add( object );

    }, onProgress, onError );


    return model;

}



function createModelBQ45(name, index){

     // texture

     var manager = new THREE.LoadingManager();
     manager.onProgress = function ( item, loaded, total ) {

        //console.log( item, loaded, total );

    };

    var texture = new THREE.Texture();

    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            //console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };

    var onError = function ( xhr ) {
    };


    var loader = new THREE.ImageLoader( manager );
    
    loader.load(  'models/bq/textures/bqE45.png', function ( image ) {


        texture.image = image;
        texture.needsUpdate = true;

    } );

    var pivot;

    var model = new THREE.Object3D();
    // model
    var loader = new THREE.OBJLoader( manager );
   
    loader.load( 'models/bq/bq_v3.obj', function ( object ) {
  
        object.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {

                //console.log(child);
                child.name = name;
                child.index = index;

                child.geometry.computeBoundingBox();
                child.geometry.computeVertexNormals();
                 //console.log(lastSelectedItem);
                var bb = child.geometry.boundingBox;

                var xsize = bb.max.x - bb.min.x;
                var ysize = bb.max.y - bb.min.y;
                var zsize = bb.max.z - bb.min.z;

                
                //child.position.set( xsize, ysize, zsize );
                //child.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( -xsize, -ysize, -zsize ) );
                
                //console.log("Index");
                //console.log(index);
                //console.log(child.position.x);
                //console.log(child.position.y);
                //console.log(child.position.z);

                child.scale.x = child.scale.y = child.scale.z = 0.1;

                /*
                child.scale.y *= 0.4;
                child.scale.x *= 1.4;
                child.scale.z *= 0.2;
                */
                /*
                child.scale.x = child.scale.x * 2 * Math.random();
                child.scale.y = child.scale.y * 2 * Math.random(); 
                child.scale.z = child.scale.z * 2 * Math.random();
                */
                /*
                var bb = child.geometry.boundingBox;

                var xsize = bb.max.x - bb.min.x;
                var ysize = bb.max.y - bb.min.y;
                var zsize = bb.max.z - bb.min.z;

                
                child.position.set( xsize, ysize, zsize );
                child.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( -xsize, -ysize, -zsize ) );
                */

               
                //pivot.add(child);

                objects.push( child );
                //child.position.y += 2;

                var materialEsfera = new THREE.MeshPhongMaterial({
                    ambient: 0x999999,
                    color: 0xFFFFFF,
                    specular: 0x999999,
                    shininess: 250,
                    map: texture
                });

                //child.material.map = texture;
                child.material = materialEsfera;

            }

        } );

        model.add( object );

    }, onProgress, onError );


    return model;

}



function createModelBQ5(name, index){

     // texture

     var manager = new THREE.LoadingManager();
     manager.onProgress = function ( item, loaded, total ) {

        //console.log( item, loaded, total );

    };

    var texture = new THREE.Texture();

    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            //console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };

    var onError = function ( xhr ) {
    };


    var loader = new THREE.ImageLoader( manager );
    
    loader.load(  'models/bq/textures/bqE5.png', function ( image ) {


        texture.image = image;
        texture.needsUpdate = true;

    } );

    var pivot;

    var model = new THREE.Object3D();
    // model
    var loader = new THREE.OBJLoader( manager );
   
    loader.load( 'models/bq/bq_v3.obj', function ( object ) {
  
        object.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {

                //console.log(child);
                child.name = name;
                child.index = index;

                child.geometry.computeBoundingBox();
                child.geometry.computeVertexNormals();
                 //console.log(lastSelectedItem);
                var bb = child.geometry.boundingBox;

                var xsize = bb.max.x - bb.min.x;
                var ysize = bb.max.y - bb.min.y;
                var zsize = bb.max.z - bb.min.z;

                
                //child.position.set( xsize, ysize, zsize );
                //child.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( -xsize, -ysize, -zsize ) );
                
                //console.log("Index");
                //console.log(index);
                //console.log(child.position.x);
                //console.log(child.position.y);
                //console.log(child.position.z);

                child.scale.x = child.scale.y = child.scale.z = 0.15;

                /*
                child.scale.y *= 0.4;
                child.scale.x *= 1.4;
                child.scale.z *= 0.2;
                */
                /*
                child.scale.x = child.scale.x * 2 * Math.random();
                child.scale.y = child.scale.y * 2 * Math.random(); 
                child.scale.z = child.scale.z * 2 * Math.random();
                */
                /*
                var bb = child.geometry.boundingBox;

                var xsize = bb.max.x - bb.min.x;
                var ysize = bb.max.y - bb.min.y;
                var zsize = bb.max.z - bb.min.z;

                
                child.position.set( xsize, ysize, zsize );
                child.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( -xsize, -ysize, -zsize ) );
                */

               
                //pivot.add(child);

                objects.push( child );
                //child.position.y += 2;

                var materialEsfera = new THREE.MeshPhongMaterial({
                    ambient: 0x999999,
                    color: 0xFFFFFF,
                    specular: 0x999999,
                    shininess: 250,
                    map: texture
                });

                //child.material.map = texture;
                child.material = materialEsfera;

            }

        } );

        model.add( object );

    }, onProgress, onError );


    return model;

}
