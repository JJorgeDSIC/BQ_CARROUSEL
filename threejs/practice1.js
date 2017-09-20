var renderer, scene, camera;

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

function loadScene() {

    var material = new THREE.MeshBasicMaterial(
        {color: 0xFF0000,
        wireframe: true});

    // axis helper
    var axisHelper = new THREE.AxisHelper( 100 );
    scene.add(axisHelper);

    // pile
    var pileGeometry = new THREE.BoxGeometry( 18, 120, 12 );
    var pile = new THREE.Mesh( pileGeometry, material );
    pile.position.y = 60;

    // axis
    var axisGeometry = new THREE.CylinderGeometry( 20, 20, 18, 40, 1 );
    var axis = new THREE.Mesh(axisGeometry, material);
    axis.rotation.x = 90 * Math.PI / 180;

    // arm
    var arm = new THREE.Object3D();
    arm.add(axis);
    arm.add(pile);

    // base
    var baseGeometry = new THREE.CylinderGeometry( 50, 50, 15, 40, 1 );
    var base = new THREE.Mesh(baseGeometry, material);

    // robot
    var robot = new THREE.Object3D();
    base.add(arm);
    robot.add(base)

    scene.add(robot);

    animate();

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

function update() {

}

function render() {

    renderer.render( scene, camera );

}
