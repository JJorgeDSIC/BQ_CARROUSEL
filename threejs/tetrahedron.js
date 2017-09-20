var renderer, scene, camera;

init();

function init() {

    // configure the canvas and the render engine
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x0000AA))

    document.getElementById('container').appendChild(renderer.domElement);

    // create the scene
    scene = new THREE.Scene();

    // create the camera
    var aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
    camera.position.set(0, 0, 3);

    // resize event listener
    window.addEventListener('resize', updateAspectRatio, false);

    loadScene();

}

function loadScene() {

    var geometry = new THREE.TetrahedronGeometry();
    var material = new THREE.MeshBasicMaterial(
        {color: 0xFFFF00,
        wireframe: true});
    var tetrahedron = new THREE.Mesh(geometry, material);

    scene.add(tetrahedron);

    animate();

}

function updateAspectRatio() {

    renderer.setSize(window.innerWidth, window.innerHeight);
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

    renderer.render(scene, camera);

}
