var renderer, scene, camera, controls;

//To perform animation
var nerv1,nerv2,nerv3,nerv4;
var nerv1,nerv2,nerv3,nerv4;
var disk, hand, sphere;
var arm_pre, arm;
var base;
init();

function init() {

    // configure the canvas and the render engine
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( new THREE.Color( 0xFFFFFF ) );

    document.getElementById( 'container' ).appendChild(renderer.domElement);

    // create the scene
    scene = new THREE.Scene();

    // create the camera
    var aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera( 40, aspectRatio, 1, 2000 );
    camera.position.set( 100, 100, 300 );
    camera.lookAt(new THREE.Vector3( 0, 50, 0 ));

    // resize event listener
    window.addEventListener( 'resize', updateAspectRatio, false );

    loadScene();

}

function loadMesh()
{
    // Material de alambres rojos
    var material = new THREE.MeshBasicMaterial( { color: "red", wireframe: true });
    // Objeto tela con modelmatrix explicita
    var ms = new THREE.Matrix4();
    var mt = new THREE.Matrix4();
    var tela = new THREE.Mesh( new THREE.CylinderGeometry ( 0.0, 1.0, 1.0 ), material );
    tela.matrixAutoUpdate = false;
    mt.makeTranslation( 0, 1.5, 0 );
    ms.makeScale( 2, 0.5, 2);
    // modelmatrix = mt * ms
    tela.matrix = mt.multiply( ms );
    // Objeto baston con modelmatrix implicita
    var baston = new THREE.Mesh( new THREE.CylinderGeometry(1, 1, 1), material );
    baston.position.y = 0.5;
    baston.scale.set( 0.05, 3, 0.05 );
    // Objeto mango con modelmatrix implicita
    var mango = new THREE.Mesh( new THREE.CubeGeometry( 1, 1, 1 ), material );
    mango.scale.set( 0.2, 0.4, 0.2 );
    mango.position.set( 0, -1, 0 );
    // Objeto contenedor paraguas con modelmatrix implicita
    paraguas = new THREE.Object3D();
    paraguas.add( tela );
    paraguas.add( baston );
    paraguas.add( mango );
    paraguas.position.set ( 1.6, 0, 0 );
    paraguas.rotation.x = Math.PI/6;

    scene.add( paraguas );
}


function loadScene() {

    controls = new THREE.OrbitControls( camera );
    controls.addEventListener( 'change', render );


    var mt = new THREE.Matrix4();
    var ms = new THREE.Matrix4();
    
    //modelMatrix = mt * ms
    //ms.multiply(mt)
    var material = new THREE.MeshBasicMaterial(
        {color: 0xFF0000,
        wireframe: true});

     //Plane
    var geometry = new THREE.PlaneGeometry( 1000, 1000, 32, 32 );
    //var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    var plane = new THREE.Mesh( geometry, material );
    plane.rotation.x = 90 * Math.PI / 180;
    plane.position.y = 0;
    scene.add( plane );

    // axis helper
    var axisHelper = new THREE.AxisHelper( 100 );
    scene.add(axisHelper);

    // pile
    var pileGeometry = new THREE.BoxGeometry( 18, 120, 12 );
    var pile = new THREE.Mesh( pileGeometry, material );
    pile.position.y = 60;

    var offset = 10;

     // nerv 1
    var nerv1Geometry = new THREE.BoxGeometry( 4, 80, 4 );
    nerv1 = new THREE.Mesh( nerv1Geometry, material );
    nerv1.position.x = offset;
    nerv1.position.y = 40;
    nerv1.position.z = offset;


     // nerv 2
    var nerv2Geometry = new THREE.BoxGeometry( 4, 80, 4 );
    nerv2 = new THREE.Mesh( nerv2Geometry, material );
    nerv2.position.x = offset;
    nerv2.position.y = 40;
    nerv2.position.z = -offset;

     // nerv 3
    var nerv3Geometry = new THREE.BoxGeometry( 4, 80, 4 );
    nerv3 = new THREE.Mesh( nerv3Geometry, material );
    nerv3.position.x = -offset;
    nerv3.position.y = 40;
    nerv3.position.z = offset;

     // nerv 4
    var nerv4Geometry = new THREE.BoxGeometry( 4, 80, 4 );
    nerv4 = new THREE.Mesh( nerv4Geometry, material );
    nerv4.position.x = -offset;
    nerv4.position.y = 40;
    nerv4.position.z = -offset;
  

    // mid base
    var diskGeometry = new THREE.CylinderGeometry( 22, 22, 6, 40, 1 );
    disk = new THREE.Mesh(diskGeometry, material);
    //disk.rotation.x = 90 * Math.PI / 180;
    //disk.position.y = 80;

   
    var cubo_izq_1 = loadCubo_Regular();

    //cubo_izq_1.position.y = 100;

    var cubo_izq_2 = loadCubo_Irregular();

    //cubo_izq_2.position.y = 100;

    cubo_izq_2.position.x = 9.5 * 2;

    var pinzaIz = new THREE.Object3D();

    pinzaIz.add(cubo_izq_1);

    pinzaIz.add(cubo_izq_2);

    var pinzaDe = new THREE.Object3D();
    //cubo_izq_2.scale.x = cubo_izq_2.scale.y = cubo_izq_2.scale.z =  2;

   

    var cubo_der_1 = loadCubo_Regular();

    //cubo_der_1.position.y = 100;

    var cubo_der_2 = loadCubo_Irregular();

    //cubo_der_2.position.y = 100;

    cubo_der_2.position.x = 9.5 * 2;
    //cubo_der_2.scale.x = cubo_der_2.scale.y = cubo_der_2.scale.z =  2;

    pinzaDe.add(cubo_der_1);

    pinzaDe.add(cubo_der_2);

    pinzaIz.position.z += 10;

    pinzaDe.position.z -= 10;

    pinzaDe.scale.z = -1;


    // hand base
    var handGeometry = new THREE.CylinderGeometry( 15, 15, 40, 40, 1 );
    handBase = new THREE.Mesh(handGeometry, material);

    handBase.rotation.x = 90 * Math.PI / 180;
    

    var hand = new THREE.Object3D();
    
    hand.add(handBase);
    hand.add(pinzaIz);
    hand.add(pinzaDe);

    hand.position.y = 80;

    
  

    arm_pre = new THREE.Object3D();
    arm_pre.add( nerv1 );
    arm_pre.add( nerv2 );
    arm_pre.add( nerv3 );
    arm_pre.add( nerv4 );
    //arm_pre.add( mano );
    arm_pre.add( hand );
    arm_pre.add( disk );

    arm_pre.position.y = 120;
   
    scene.add(arm_pre);
    // axis
    var axisGeometry = new THREE.CylinderGeometry( 20, 20, 18, 40, 1 );
    axis = new THREE.Mesh(axisGeometry, material);
    axis.rotation.x = 90 * Math.PI / 180;

    mt.makeTranslation(0,120,0);

    var geometry = new THREE.SphereGeometry( 20, 32, 32 );
    sphere = new THREE.Mesh( geometry, material );
    /*
    sphere.matrixAutoUpdate = false;
    sphere.matrix = mt;
    */
    sphere.position.y = 120;
    // arm
    arm = new THREE.Object3D();
    arm.add(arm_pre);
    arm.add(axis);
    arm.add(pile);
    arm.add(sphere);

    // base
    var baseGeometry = new THREE.CylinderGeometry( 50, 50, 15, 40, 1 );
    base = new THREE.Mesh(baseGeometry, material);

    // robot
    var robot = new THREE.Object3D();
    //robot.add(arm);
    base.add(arm);
    robot.add(base)

    scene.add(robot);

    

    animate();

}

function loadCubo_Regular()
{
    var malla = new THREE.Geometry();
    
    var coordenadas =   [
                    9.5, -10, 4, 
                    9.5, -10, -4, 
                    9.5, 10, -4,
                    9.5, 10, 4,
                    -9.5, 10, 4, 
                    -9.5, 10, -4, 
                    -9.5, -10, -4, 
                    -9.5, -10, 4  ];
    var colores =       [
                    0xFF0000,
                    0xFF00FF,
                    0xFFFFFF,
                    0xFFFF00,
                    0x00FF00,
                    0x00FFFF,
                    0x0000FF,
                    0x000000    ];
    var indices =       [
                    0,3,7, 7,3,4, 
                    //0,1,2, 0,2,3, 
                    4,3,2, 4,2,5,
                    6,7,4, 6,4,5, 
                    1,5,2, 1,6,5, 
                    7,6,1, 7,1,0     ];

    for(var i=0; i<coordenadas.length; i+=3) {
        var vertice = new THREE.Vector3( coordenadas[i], coordenadas[i+1], coordenadas[i+2] );
        malla.vertices.push( vertice );     
    }

    for(var i=0; i<indices.length; i+=3){
        var triangulo =  new THREE.Face3( indices[i], indices[i+1], indices[i+2] );
        for(var j=0; j<3; j++){
            var color = new THREE.Color( colores[ indices[i+j] ] );
            triangulo.vertexColors.push( color );       
        }
        malla.faces.push( triangulo );
    }

    var material = new THREE.MeshBasicMaterial( { color: 0xFF0000, wireframe: true } );
    cubo = new THREE.Mesh( malla, material );

    return cubo;

}

function loadCubo_Irregular()
{
    var malla = new THREE.Geometry();
   
    var coordenadas =   [
                    9.5, -10, 4, // 0
                    9.5, -10, 2, // 1
                    9.5, 10, 2,// 2
                    9.5, 10, 4,// 3

                    -9.5, 10, 4, // 4
                    -9.5, 10, -4, // 5
                    -9.5, -10, -4, // 6
                    -9.5, -10, 4  ];// 7
    var colores =       [
                    0xFF0000,
                    0xFF00FF,
                    0xFFFFFF,
                    0xFFFF00,
                    0x00FF00,
                    0x00FFFF,
                    0x0000FF,
                    0x000000    ];
    var indices =       [
                    0,3,7, 7,3,4, 
                    0,1,2, 0,2,3, 
                    4,3,2, 4,2,5,
                    //6,7,4, 6,4,5, 
                    1,5,2, 1,6,5, 
                    7,6,1, 7,1,0     
                    ];

    for(var i=0; i<coordenadas.length; i+=3) {
        var vertice = new THREE.Vector3( coordenadas[i], coordenadas[i+1], coordenadas[i+2] );
        malla.vertices.push( vertice );     
    }

    for(var i=0; i<indices.length; i+=3){
        var triangulo =  new THREE.Face3( indices[i], indices[i+1], indices[i+2] );
        for(var j=0; j<3; j++){
            var color = new THREE.Color( colores[ indices[i+j] ] );
            triangulo.vertexColors.push( color );       
        }
        malla.faces.push( triangulo );
    }

    var material = new THREE.MeshBasicMaterial( { color: 0xFF0000, wireframe: true } );
    cubo = new THREE.Mesh( malla, material );

    return cubo;

}

function updateAspectRatio() {
   
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

}

function animate() {

    requestAnimationFrame( animate );
   
    update();
    render();

}

var antes = 0;
var angulo = 0;

function update() {

    var ahora = Date.now();
    /*
    angulo += (Math.PI/180 * (ahora- antes)/100) % 360;

    disk.rotation.y = sphere.rotation.y =  arm_pre.rotation.y = angulo;//nerv1.rotation.y = nerv2.rotation.y = nerv3.rotation.y = nerv4.rotation.y = hand .rotation.y = disk.rotation.y = angulo;

    //angulo = angulo *  > 0? angulo * -1 : angulo;

    arm.rotation.z = angulo;

    base.rotation.y = -angulo;

    console.log(angulo * Math.PI/180);

    antes = ahora;
    */
    controls.update();

}

function render() {

    renderer.render( scene, camera );

}

