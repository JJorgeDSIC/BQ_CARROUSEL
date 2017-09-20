var renderer, scene, camera, cameraControls, cubeCamera;
var container;
var clock;

var luzPuntual;
var luzDireccional;
var luzFocal;

var disk,cube;
var objects;
var planes;

var num_items;
var radius, planeRadius, radiusX, radiusY;

var keyboard = new KeyboardState();
var textObject;
var stats;
var posx, posz;
var positions;
var indexes;
var middle;

var raycaster;
var projector;
var directionVector;
var mouseVector;
var vector;

init();
loadScene();
render();

var toRotate;
var objectPicked;
var angleToAdd;
var currentObject;

var rotation = angleToAdd * Math.PI/180;
var onViewEvent = false;
var selectedItem = false;
var inspectionMode = false;
var running = false;

var lastItem = 0;
var lastSelectedItem;
var lastItemRotation;
var mouseX = 0;
var mouseY = 0;
var landing = true;

function init(){

    indexes = [];

    num_items = 5;

    middle = num_items/2;

    angleToAdd = 360.0/num_items

    radius = num_items * 1.0/3;

    planeRadius = radius + 35;

    radiusX = radius * 2.5;

    radiusY = radiusX * 0.1;

    objects = [];


    clock = new THREE.Clock();
    raycaster = new THREE.Raycaster();
    projector = new THREE.Projector();
    directionVector = new THREE.Vector3();
    mouseVector = new THREE.Vector3();
    vector = new THREE.Vector3();

    for(t=0;t < num_items; t++){
        indexes.push(t);
    }

    //console.log(indexes);

    renderer = new THREE.WebGLRenderer({ antialiasing: true });
    //renderer.shadowMapEnabled = true;
    //renderer.shadowMapType = THREE.PCFSoftShadowMap;
    //Toda la pantalla para dibujar
    renderer.setSize( window.innerWidth, window.innerHeight );
    //Establecer color de borrado
    renderer.setClearColor( new THREE.Color( 0xFFFFFF) );

    container = document.getElementById( 'container' );

    document.body.appendChild( container );

    container.appendChild( renderer.domElement );

    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = "absolute";
    stats.domElement.style.bottom = "0px";
    stats.domElement.style.left = "0px";
    document.body.appendChild( stats.domElement);

    //Escena
    scene = new THREE.Scene();
    scene.add(stats);

    //Camera
    var aspectRatio = window.innerWidth / window.innerHeight;
    var fov = 75;
    var near = 0.1; //10 cm
    var far = 10000; //10000 m

    camera = new THREE.PerspectiveCamera( fov, aspectRatio, near, far);
    camera.position.set(radiusX, radiusY, 0);
    camera.lookAt(new THREE.Vector3(0,100,0));
    //camera.lookAt(new THREE.Vector3(0,0,0));

    loadLogo();
    
    //var axisHelper = new THREE.AxisHelper(10);

    //scene.add(axisHelper);

    loadMirror();

    loadLights();


    //Callbacks
    window.addEventListener( 'resize', updateAspectRatio );
    //window.addEventListener( 'click', onMouseClick, false );
    window.addEventListener( 'mousedown', onDocumentMouseDown, false );
    //window.addEventListener( 'touchstart', onDocumentTouchDown, false );
    //window.addEventListener( 'touchmove', onMouseMove, false );
    window.addEventListener( 'mousemove', onMouseMove, false );

}

function loadScene(){

    loadModels();
    //loadDemo();

}

function loadModels(){

    var diskGeometry = new THREE.CylinderGeometry( 1, radius, 1, 40, 1 );
    disk = new THREE.Mesh(diskGeometry, material);

    disk = new THREE.Object3D();

    planes = [];

    //var textMaterial = createTextMaterial("bq Aquaris E4.5", "4.5''", "CPU:QC Cortex A7 1.3 GHz", "RAM:1GB", "M.Interna:8GB");
    textMaterial = createTextMaterial("bq Aquaris E4.5", "4.5''", "QC Cortex A7 1.3 GHz", "1GB", "M.Interna:8GB");
    var geometry = new THREE.PlaneBufferGeometry( 2,2,10,10);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );

    var plane = new THREE.Mesh( geometry, textMaterial );

    plane.rotation.y = 90 * Math.PI/180;

    cube = createModelBQ45(name, 0);

    cube.position.x = radius;
    cube.position.y += 0.5;
    cube.rotation.y = 90 * Math.PI/180;
    cube.rotation.z = 5 * Math.PI/180;

    plane.position.x = planeRadius;

    cube.name = "0";
    cube.index = 0;
    cube.model = "E45";

    plane.name = "p";

    var radAngleToAdd = (360.0/num_items) * Math.PI/180.0;

    posx = cube.position.x;
    posz = cube.position.z;

    positions = [];
    positions[0] = [posx,posz];

    posxPlane = plane.position.x;
    poszPlane = plane.position.z;

    positionsPlane = [];
    positionsPlane[0] = [posxPlane,poszPlane];

    disk.add(cube);

    disk.add(plane);

    planes.push(plane);

    var cubeInner;

    //BQ E5
    cubeInner = createModelBQ5(name, 1);

    cubeInner.rotation.y = 90 * Math.PI/180;
    cubeInner.rotation.z = 5 * Math.PI/180;
    
    cubeInner.position.y += 0.5;

    var prevx = positions[0][0];
    var prevz = positions[0][1];

    xp = prevx * Math.cos(radAngleToAdd) - prevz * Math.sin(radAngleToAdd);
    zp = prevx * Math.sin(radAngleToAdd) + prevz * Math.cos(radAngleToAdd);

    cubeInner.position.x = xp;
    cubeInner.position.z = zp;

    positions[1]= [xp,zp];

    disk.add(cubeInner);

    prevxPlane = positionsPlane[0][0];
    prevzPlane = positionsPlane[0][1];

    xpPlane = prevxPlane * Math.cos(radAngleToAdd) - prevzPlane * Math.sin(radAngleToAdd);
    zpPlane = prevxPlane * Math.sin(radAngleToAdd) + prevzPlane * Math.cos(radAngleToAdd);

    var rot = plane.rotation.y;

    //textMaterial = createTextMaterial("bq Aquaris E5" , "5''", "CPU:MT6592 2.0GHz True8Core", "RAM:2GB", "M.Interna:16GB");
    textMaterial = createTextMaterial("bq Aquaris E5" , "5''", "MT6592 2.0GHz True8Core", "2GB", "M.Interna:16GB");
    geometry = new THREE.PlaneBufferGeometry( 2, 2 ,10, 10);
    plane = new THREE.Mesh( geometry, textMaterial );

    plane.rotation.y = rot - radAngleToAdd;

    plane.position.x = xpPlane;
    plane.position.z = zpPlane;

    disk.add(plane);
    planes.push(plane);

    positionsPlane[1] = [xpPlane,zpPlane];

    cubeInner.index = 1;
    cubeInner.name = "0";
    cubeInner.model = "E5";

    //BQ Cervantes
    cubeInner = createModelBQCervantes(name, 2);

    cubeInner.rotation.y = 90 * Math.PI/180;
    cubeInner.rotation.z = 5 * Math.PI/180;
    
    cubeInner.position.y += 0.5;

    prevx = positions[1][0]
    prevz = positions[1][1]

    xp = prevx * Math.cos(radAngleToAdd) - prevz * Math.sin(radAngleToAdd);
    zp = prevx * Math.sin(radAngleToAdd) + prevz * Math.cos(radAngleToAdd);

    cubeInner.position.x = xp;
    cubeInner.position.z = zp;

    disk.add(cubeInner);

    positions[2]= [xp,zp];

    cubeInner.index = 2;
    cubeInner.name = "0";
    cubeInner.model = "C";

    prevxPlane = positionsPlane[1][0];
    prevzPlane = positionsPlane[1][1];

    xpPlane = prevxPlane * Math.cos(radAngleToAdd) - prevzPlane * Math.sin(radAngleToAdd);
    zpPlane = prevxPlane * Math.sin(radAngleToAdd) + prevzPlane * Math.cos(radAngleToAdd);

    rot = plane.rotation.y;

    //textMaterial = createTextMaterial("bq Cervantes","6''", "CPU:SoloLite 1 GHz", "RAM:512MB", "M.Interna:4GB");
    textMaterial = createTextMaterial("bq Cervantes","6''", "SoloLite 1 GHz", "512MB", "M.Interna:4GB");
    geometry = new THREE.PlaneBufferGeometry( 2,2 ,10,10);

    plane = new THREE.Mesh( geometry, textMaterial );

    plane.rotation.y = rot - radAngleToAdd;

    plane.position.x = xpPlane;
    plane.position.z = zpPlane;

    disk.add(plane);
    planes.push(plane);

    positionsPlane[2]= [xpPlane,zpPlane];

    //BQ E10
    cubeInner = createModelBQ10(name, 3);

    cubeInner.rotation.y = 90 * Math.PI/180;
    cubeInner.rotation.z = 5 * Math.PI/180;
    
    cubeInner.position.y += 0.5;

    prevx = positions[2][0]
    prevz = positions[2][1]

    xp = prevx * Math.cos(radAngleToAdd) - prevz * Math.sin(radAngleToAdd);
    zp = prevx * Math.sin(radAngleToAdd) + prevz * Math.cos(radAngleToAdd);

    cubeInner.position.x = xp;
    cubeInner.position.z = zp;

    disk.add(cubeInner);

    positions[3]= [xp,zp];
    
    cubeInner.index = 3;
    cubeInner.name = "0";
    cubeInner.model = "T";

    prevxPlane = positionsPlane[2][0];
    prevzPlane = positionsPlane[2][1];

    xpPlane = prevxPlane * Math.cos(radAngleToAdd) - prevzPlane * Math.sin(radAngleToAdd);
    zpPlane = prevxPlane * Math.sin(radAngleToAdd) + prevzPlane * Math.cos(radAngleToAdd);

    rot = plane.rotation.y;

    //textMaterial = createTextMaterial("bq Aquaris E10","10.1''", "CPU:MT 1.7GHz True8Core", "RAM:2GB", "M.Interna:16GB");
    textMaterial = createTextMaterial("bq Aquaris E10","10.1''", "MT 1.7GHz True8Core", "2GB", "M.Interna:16GB");

    geometry = new THREE.PlaneBufferGeometry( 2,2 ,10,10);
    plane = new THREE.Mesh( geometry, textMaterial );

    plane.rotation.y = rot - radAngleToAdd;

    plane.position.x = xpPlane;
    plane.position.z = zpPlane;

    disk.add(plane);
    planes.push(plane);

    positionsPlane[3]= [xpPlane,zpPlane];

    //BQ E4
    cubeInner = createModelBQ4(name, 4);

    cubeInner.rotation.y = 90 * Math.PI/180;
    cubeInner.rotation.z = 5 * Math.PI/180;
    
    cubeInner.position.y += 0.5;

    prevx = positions[3][0]
    prevz = positions[3][1]

    xp = prevx * Math.cos(radAngleToAdd) - prevz * Math.sin(radAngleToAdd);
    zp = prevx * Math.sin(radAngleToAdd) + prevz * Math.cos(radAngleToAdd);

    cubeInner.position.x = xp;
    cubeInner.position.z = zp;

    disk.add(cubeInner);

    positions[4]= [xp,zp];

    cubeInner.index = 4;
    cubeInner.name = "0";
    cubeInner.model = "E4";

    prevxPlane = positionsPlane[3][0];
    prevzPlane = positionsPlane[3][1];

    xpPlane = prevxPlane * Math.cos(radAngleToAdd) - prevzPlane * Math.sin(radAngleToAdd);
    zpPlane = prevxPlane * Math.sin(radAngleToAdd) + prevzPlane * Math.cos(radAngleToAdd);

    rot = plane.rotation.y;

    //textMaterial = createTextMaterial("bq Aquaris E4","4''", "CPU:QC Cortex A7 1.4 GHz", "RAM:1GB", "M.Interna:8GB");
    textMaterial = createTextMaterial("bq Aquaris E4","4''", "QC Cortex A7 1.4 GHz", "1GB", "M.Interna:8GB");

    geometry = new THREE.PlaneBufferGeometry( 2,2 ,10,10);
    plane = new THREE.Mesh( geometry, textMaterial );

    plane.rotation.y = rot - radAngleToAdd;

    plane.position.x = xpPlane;
    plane.position.z = zpPlane;

    disk.add(plane);
    planes.push(plane);

    positionsPlane[4]= [xpPlane,zpPlane];

    currentObject = cube;

    scene.add(disk);
}

function loadLights(){

    //Luces

    //Ambiental - identificada por el color y la intensidad
    var luzAmbiente = new THREE.AmbientLight('white');
    scene.add( luzAmbiente );

    //Direccional: color, intensidad, dirección
    luzDireccional = new THREE.DirectionalLight(0x999999, 0.3); //1.0 la máxima intensidad
    luzDireccional.position.set(5,5,4); //Dirección en la que tiene que alumbrar
    //vector unitario con la dirección de este vector
    scene.add( luzDireccional );

    //Puntual - color, intensidad, posicion
    luzPuntual = new THREE.PointLight(0x999999, 0.3);
    //Vector L?
    luzPuntual.position.set(-5,5,4);
    scene.add( luzPuntual );

    // lights
    var mainLight = new THREE.PointLight( 0xcccccc, 1.5, 250 );
    mainLight.position.y = 60;
    scene.add( mainLight );
}

function loadMirror(){

    var planeGeo = new THREE.PlaneBufferGeometry( 100, 100, 10, 10 );

    // MIRORR planes
    groundMirror = new THREE.Mirror( renderer, camera, { clipBias: 0.003, textureWidth: window.innerWidth, textureHeight:  window.innerHeight, color: 0x777777 } );

    var mirrorMesh = new THREE.Mesh( planeGeo, groundMirror.material );

    mirrorMesh.add( groundMirror );
    mirrorMesh.rotateX( - Math.PI / 2 );
    mirrorMesh.position.y -= 0.4;
    scene.add( mirrorMesh );
}

function loadLogo(){

    var materialFront = new THREE.MeshBasicMaterial( { color: 'white' } );
    var materialSide = new THREE.MeshBasicMaterial( { color: 'darkblue' } );
    var materialArray = [ materialFront, materialSide ];

    var textGeom = new THREE.TextGeometry( "bq", 
    {
        size: 1, height: 1, curveSegments: 3,
        font: "helvetiker", weight: "bold", style: "normal",
        bevelThickness: 0.1, bevelSize: 0.05, bevelEnabled: true,
        material: 0, extrudeMaterial: 1
    });

    // font: helvetiker, gentilis, droid sans, droid serif, optimer
    // weight: normal, bold

    var textMaterial = new THREE.MeshFaceMaterial(materialArray);
    textMesh = new THREE.Mesh(textGeom, textMaterial );


    textMesh.position.x = 3.5;
    textMesh.position.y = 3.5;
    textMesh.position.z = 0.9;

    var textprevx = textMesh.position.x;
    var textprevy = textMesh.position.y;
    var textprevz = textMesh.position.z;

    textMesh.position.y -= textMesh.position.y;
    textMesh.position.x -= textMesh.position.x;
    textMesh.position.z -= textMesh.position.z;

    textMesh.lookAt(camera.position);

    textMesh.position.x += textprevx;
    textMesh.position.y += textprevy;
    textMesh.position.z += textprevz;

    textMesh.rotation.y += 80 * Math.PI/180;

    scene.add(textMesh);
}

function createTextMaterial(modelName, spec1, spec2, spec3, spec4){

    var x = document.createElement("canvas");
    var xc = x.getContext("2d");
    x.width = 500;
    x.height = 500;
    
    xc.strokeStyle = "blue 10px";

    xc.fillStyle = "white";

    xc.font = "normal 25px Arial";
    xc.textBaseline = "top";
    
    xc.scale(window.devicePixelRatio, window.devicePixelRatio);       
 
    xc.strokeText(modelName, 0, 0);
    xc.strokeText(spec1, 0, 50);
    xc.strokeText(spec2, 0, 100);
    xc.strokeText(spec3, 0, 150);
    xc.strokeText(spec4, 0, 200);
    
    xc.fillText(modelName, 0, 0);
  
    xc.fillText(spec1, 0, 50);
    xc.fillText(spec2, 0, 100);
    xc.fillText(spec3, 0, 150);
    xc.fillText(spec4, 0, 200);

    var xm = new THREE.MeshBasicMaterial({
        //overdraw: true,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        map: new THREE.Texture(x)
    });
    xm.map.needsUpdate = true;

    return xm;
}

function checkIntersections(event){

    var valueX;
    var valueY;
    
    if(event.type != "mousedown"){
        valueX =  event.touches[ 0 ].clientX;

        valueY =  event.touches[ 0 ].clientY;  

        console.log(valueX);
        console.log(valueY);

         mouseVector.x = ( valueX / renderer.domElement.width ) * 2 - 1;
         mouseVector.y = - (  valueY  / renderer.domElement.height ) * 2 + 1;
    }else{
        valueX =  event.clientX;
        valueY =  event.clientY;  

        console.log(valueX);
        console.log(valueY);

         mouseVector.x = ( ( valueX - renderer.domElement.offsetLeft ) / renderer.domElement.width ) * 2 - 1;
         mouseVector.y = - ( ( valueY - renderer.domElement.offsetTop ) / renderer.domElement.height ) * 2 + 1;
    }

   

    mouseX = mouseVector.x;
    mouseY = mouseVector.y;

    vector.set( mouseVector.x, mouseVector.y, 0.5 );
    vector.unproject( camera );

    raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

    intersects = raycaster.intersectObjects( objects );

    if ( intersects.length > 0 ) {

        return intersects[0];

    }else{

        return null;
    }
}

function loadDemo(){

    var material = new THREE.MeshLambertMaterial({
        wireframe: true

    });

    var diskGeometry = new THREE.CylinderGeometry( 1, radius, 1, 40, 1 );
    disk = new THREE.Mesh(diskGeometry,material);

    disk = new THREE.Object3D();

    planes = [];

    cube = createModel(name, 0);

    //var cubeGeometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
    //cube = new THREE.Mesh( cubeGeometry, materialCube );
    cube.position.x = radius;
    cube.position.y += 0.5;
    
    cube.rotation.y = 90 * Math.PI/180;
    cube.rotation.z = 5 * Math.PI/180;
    
    cube.name = "0";
    cube.index = 0;

   
    //objects.push( cube );

    var radAngleToAdd = (360.0/num_items) * Math.PI/180.0;


    posx = cube.position.x;
    posz = cube.position.z;

    positions = [];
    positions[0] = [posx,posz];
    console.log(positions[0]);

    for (i = 1; i < num_items; i++) { 
        /*
        var materialCubeInner = new THREE.MeshLambertMaterial({
            wireframe: true,
            color: 0x0

        });
        
        var cubeGeometryInner = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
        cubeInner = new THREE.Mesh( cubeGeometryInner, materialCubeInner );
        */

         var cubeInner = createModel(name, i);
       
        
        //var cubeInner = createModelOBJMTL(name, i);

        cubeInner.rotation.y = 90 * Math.PI/180;
        cubeInner.rotation.z = 5 * Math.PI/180;
        
        cubeInner.position.y += 0.5;


        var prevx = positions[i-1][0]
        var prevz = positions[i-1][1]

        xp = prevx * Math.cos(radAngleToAdd) - prevz * Math.sin(radAngleToAdd);
        zp = prevx * Math.sin(radAngleToAdd) + prevz * Math.cos(radAngleToAdd);

        cubeInner.position.x = xp;
        cubeInner.position.z = zp;

        disk.add(cubeInner);

        positions[i]= [xp,zp];
        console.log(positions[i]);

        cubeInner.index = i;
        cubeInner.name = "0";

        //objects.push( cubeInner );
        //cubeInner.material.color.setRGB( 10, 0, 0 );
    }


    disk.add(cube);

   

    currentObject = cube;

    scene.add(disk);

    console.log(objects);
}
function onDocumentMouseDown( event ) {

    if(!landing){


        if(!running){

            running = true;

            objectIntersected = checkIntersections(event);

            if(objectIntersected != null){
                selectedItem = true;
            }else{
                selectedItem = false;
            }

            event.preventDefault();

            if(!selectedItem && !inspectionMode){

                var posx = ( ( event.clientX - renderer.domElement.offsetLeft ) / renderer.domElement.width ) * 2 - 1;

                var direction;

                if(posx > 0){

                //console.log("counterclockwise");
                indexes.push(indexes.shift());
                direction = 1;

            }else{

                //console.log("clockwise");
                indexes.unshift(indexes.pop());
                direction = -1;

            }

            rotateToDirection(direction);
            

        }else if(selectedItem && !inspectionMode){

            //Compute displacement
            var arrIndex = indexes.indexOf(objectIntersected.object.index);

            if(arrIndex != 0){

                rotateToSelection(objectIntersected);

            }else{

                inspect(objectIntersected);

                lastItemRotation = lastSelectedItem.rotation;
                console.log(lastItemRotation)
                //Rotate with mouse movement
                //lastSelectedItem.rotation.y += 45 * Math.PI/180;

            }       

        }else if(selectedItem && inspectionMode){

            undoInspection(objectIntersected);

        }else{

            undoInspection(null);

        }


       //console.log("click");
        }

}else{

          //console.log(camera);
          landing = false;

          new TWEEN.Tween( camera.rotation )
          .to({

            y: 90 * Math.PI/180

            }, 3000)
          .easing( TWEEN.Easing.Elastic.InOut )
            //.easing( TWEEN.Easing.Linear.None )
            .onComplete( function () {

                running = false;
                scene.remove(textMesh);


            } )
            .start();

            cameraControls = new THREE.OrbitControls( camera, renderer.domElement );

        }

        
}


function rotateToDirection(direction){

    tween = new TWEEN.Tween( disk.rotation )
        .to( {  
            y:  disk.rotation.y + direction * rotation

        }, 1000 )
    //.easing( TWEEN.Easing.Elastic.InOut )
    .easing( TWEEN.Easing.Linear.None )
    .onComplete( function () {

        running = false;

    } )
    .start();



    disk.traverse( function ( child ) {

            //console.log(child);
            
            if ( child.name == "0" ) {

               new TWEEN.Tween( child.rotation )
               .to( {  
                y:  child.rotation.y - (direction * rotation)

            }, 1000 )
               .easing( TWEEN.Easing.Elastic.InOut )
               .onComplete( function () {

                running = false;

            } )
               .start();


           }

       } );

}

function rotateToSelection(objectIntersected){

    var displacement;

    var item = objectIntersected.object;

    //Compute displacement
    var arrIndex = indexes.indexOf(item.index);


    ///Rotate to selection
    console.log("Selected:")
    //console.log(arrIndex);
    console.log(item.index);

    var turn;

    if( arrIndex > middle ){
        //Mejor ir hacia atras
        console.log("clockwise");
        displacement = -(num_items - arrIndex);
        turn = 1;
    }else{
        //Mejor ir hacia adelante
        console.log("counterclockwise");
        displacement = arrIndex;
        turn = -1;
    }

    //Update indexes
    for(k=0;k<arrIndex;k++){
        indexes.push(indexes.shift());
    }

    console.log(indexes);

    lastItem = item.index;

    tween = new TWEEN.Tween( disk.rotation )
    .to( {  y:  disk.rotation.y + (displacement * rotation) }, 1000 )
    //.easing( TWEEN.Easing.Elastic.InOut )
    .easing( TWEEN.Easing.Linear.None )
    .onComplete( function () {

        running = false;

    } )
    .start();

    
    for(j=0; j < Math.abs(displacement); j++){


        disk.traverse( function ( child ) {

                //console.log(child);
                
                if ( child.name == "0" ) {

                   new TWEEN.Tween( child.rotation )
                   .to( {  y:  child.rotation.y - (displacement * rotation)}, 1000 )
                   .easing( TWEEN.Easing.Elastic.InOut )
                   .onComplete( function () {

                    running = false;

                } )
                   .start();


               }

           } );
    }
}

function inspect(objectIntersected){

    var item = objectIntersected.object;

    //Seleccionado para inspeccionar
    inspectionMode = true;
    //Inspection mode
    /*
    new TWEEN.Tween( item.scale )
    .to( {  
    x:  item.scale.x * 2,
    y:  item.scale.y * 2,
    z:  item.scale.z * 2}, 1000 )

    .easing( TWEEN.Easing.Elastic.InOut )
    .onComplete( function () {

    running = false;

    } )
    .start();
    */

    //O

    var offset;

    var model = item.parent.parent.model;

    if(model == "T" || model == "C"){
        offset = 0.1;
    }else{
        offset = 0.6;
    }

    new TWEEN.Tween( item.position )
    .to( {  
        y:  item.position.y - (radiusY * 0.6),
        z:  item.position.z + (radiusX * 0.2) + offset
    //,
    //y:  item.scale.y * 2,
    //z:  item.scale.z * 2
    }, 1000 )
    .easing( TWEEN.Easing.Elastic.InOut )
    .onComplete( function () {

        running = false;

    } )
    .start();

    //console.log("Item selected: ");
    //console.log(item.index);

    planeSelected = planes[item.index];

    var director = new THREE.Vector3();
    director.sub(planeSelected.position,new THREE.Vector3(0,0,0));
    director.normalize();
    console.log(director);

    new TWEEN.Tween( planeSelected.position )
    .to( {  
    //y:  item.position.y + (radiusY * 0.6),
    x:  planeSelected.position.x - (planeRadius - 3.15) * director.x,
    z:  planeSelected.position.z - (planeRadius - 3.15) * director.z
    }, 1000 )
    .easing( TWEEN.Easing.Elastic.InOut )
    .onComplete( function () {

        running = false;

    } )
    .start();

    lastSelectedItem = item;

}

function undoInspection(objectIntersected){

    inspectionMode = false;

    var model = lastSelectedItem.parent.parent.model;

    if(model == "T" || model == "C"){
        offset = -0.1;
    }else{
        offset = -0.6;
    }

    new TWEEN.Tween( lastSelectedItem.position )
    .to( {  
        y:  lastSelectedItem.position.y + (radiusY * 0.6),
        z:  lastSelectedItem.position.z - (radiusX * 0.2) + offset
                //,
                //y:  item.scale.y * 2,
                //z:  item.scale.z * 2
            }, 1000 )
    .easing( TWEEN.Easing.Elastic.InOut )
    .onComplete( function () {

        running = false;

    } )
    .start();

    planeSelected = planes[lastSelectedItem.index];

    var director = new THREE.Vector3();
    director.sub(planeSelected.position,new THREE.Vector3(0,0,0));
    director.normalize();
    console.log(director);

    new TWEEN.Tween( planeSelected.position )
    .to( {  
    //y:  item.position.y + (radiusY * 0.6),
    x:  planeSelected.position.x + (planeRadius - 3.15) * director.x,
    z:  planeSelected.position.z + (planeRadius - 3.15) * director.z
    }, 1000 )
    .easing( TWEEN.Easing.Elastic.InOut )
    .onComplete( function () {

        running = false;

    } )
    .start();


    new TWEEN.Tween( lastSelectedItem.rotation )
    .to( {
        x:  lastSelectedItem.rotation.x - lastItemRotation.x, 
        y:  lastSelectedItem.rotation.y - lastItemRotation.y,
        z:  lastSelectedItem.rotation.z - lastItemRotation.z

    }, 1000 )
    .easing( TWEEN.Easing.Elastic.InOut )
    .onComplete( function () {

        if(objectIntersected != null){
            console.log("Exit from inspection mode with selection");
            rotateToSelection(objectIntersected);
        }else{
            console.log("Exit from inspection mode without selection");

        }
        running = false;

    } )
    .start();

}


function onMouseMove(evt) {

    if(inspectionMode){

        if(evt.type != "mousemove"){
            valueX =  evt.touches[ 0 ].clientX;

            valueY =  evt.touches[ 0 ].clientY;  

            var deltaX = ((( valueX - container.offsetLeft ) / container.clientWidth) * 2 - 1) - mouseX;
            var deltaY = ((( valueY - container.offsetLeft ) / container.clientHeight) * 2 + 0.7) - mouseY;
            
            mouseX = (( valueX - container.offsetLeft ) / container.clientWidth) * 2 - 1;
            mouseY = ((( valueY - container.offsetLeft ) / container.clientHeight) * 2 + 0.7);


            //lastSelectedItem.rotation.y += (deltaX / 500);
            lastSelectedItem.rotation.x += (deltaY * Math.PI);
            lastSelectedItem.rotation.y += (deltaX * Math.PI);
        }else{
          
            var deltaX = ((( evt.clientX - container.offsetLeft ) / container.clientWidth) * 2 - 1) - mouseX;
            var deltaY = ((( evt.clientY - container.offsetLeft ) / container.clientHeight) * 2 + 0.7) - mouseY;
            
            mouseX = (( evt.clientX - container.offsetLeft ) / container.clientWidth) * 2 - 1;
            mouseY = ((( evt.clientY - container.offsetLeft ) / container.clientHeight) * 2 + 0.7);


            //lastSelectedItem.rotation.y += (deltaX / 500);
            lastSelectedItem.rotation.x += (deltaY * Math.PI);
            lastSelectedItem.rotation.y += (deltaX * Math.PI);
        }
        //console.log("ROTATE");

        //console.log(delta);
        //lastSelectedItem.rotation.y += 1000000 * delta * Math.PI/180;
        evt.preventDefault();

        //mouseVector.x = ( ( event.clientX - container.offsetLeft ) / container.clientWidth ) * 2 - 1;


    }
}


function update() {

    stats.update();

    var time = clock.getElapsedTime();
    var delta = clock.getDelta();

    //cameraControls.update();
     keyboard.update();
    if ( keyboard.down("down")) {
        console.log("Toggle");
        cameraControls.noRotate = !cameraControls.noRotate;
        cameraControls.noPan = !cameraControls.noPan;
   
    }
   

}


function render(){

    requestAnimationFrame( render);
    TWEEN.update();

    groundMirror.render();

    renderer.render( scene, camera );
    update();
    
}

function updateAspectRatio() {

    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
   
    camera.updateProjectionMatrix();

}
