/*
Seminario luces y materiales
*/

var renderer, scene, camera, cameraControls;
var luzPuntual;
var luzDireccional;
var luzFocal;

//To perform animation
var nerv1,nerv2,nerv3,nerv4;
var nerv1,nerv2,nerv3,nerv4;
var disk, hand, sphere;
var arm_pre, arm;
var base;
var robot;

var path =  "../images/";
//Mapa de entorno
var urls = [ 
	path+"posx.jpg", 
	path+"negx.jpg", 
	path+"posy.jpg", 
	path+"negy.jpg", 
	path+"posz.jpg", 
	path+"negz.jpg" ];


init();
loadScene();
render();

function init(){

    renderer = new THREE.WebGLRenderer();
    renderer.shadowMapEnabled = true;
    //renderer.shadowMapType = THREE.PCFSoftShadowMap;
    //Toda la pantalla para dibujar
    renderer.setSize( window.innerWidth, window.innerHeight );
    //Establecer color de borrado
    renderer.setClearColor( new THREE.Color( 0x0) );

    //Agregamos al html
    document.getElementById( 'container' ).appendChild(renderer.domElement);

    //Escena
    scene = new THREE.Scene();

    //Camera
    var aspectRatio = window.innerWidth / window.innerHeight;
    var fov = 45;
    var near = 0.1; //10 cm
    var far = 10000; //10000 m

    camera = new THREE.PerspectiveCamera( fov, aspectRatio, near, far);
    camera.position.set(0, 250, 500);
    camera.lookAt( new THREE.Vector3( 0, 0, 0));

    //Instanciamos los controles (camera y de donde son los eventos que coge)
    cameraControls = new THREE.OrbitControls( camera, renderer.domElement );

    //Luces

    //Ambiental - identificada por el color y la intensidad
    var luzAmbiente = new THREE.AmbientLight(0x999999);
    scene.add( luzAmbiente );

    //Direccional: color, intensidad, dirección
    luzDireccional = new THREE.DirectionalLight(0x999999, 0.4); //1.0 la máxima intensidad
    luzDireccional.position.set(5,5,4); //Dirección en la que tiene que alumbrar
    //vector unitario con la dirección de este vector
    scene.add( luzDireccional );


    //Puntual - color, intensidad, posicion
    luzPuntual = new THREE.PointLight(0x999999, 0.3);
    //Vector L?
    luzPuntual.position.set(-5,5,4);
    scene.add( luzPuntual );

	//Focal - color, posicion, intensidad y semiangulo
    luzFocal = new THREE.SpotLight(0x999999, 0.8);
    luzFocal.position.set(250, 350, 100); //En el plano XY
    luzFocal.target.position.set(0,0,0);
    luzFocal.angle = Math.PI/7;

     //Para producir sombras
    luzFocal.castShadow = true;
   
    scene.add( luzFocal );

    //Volumen de la vista para la luz focal
    //Distancia desde la que va a producir sombras
    luzFocal.shadowCameraNear = 1;
    //A partir de ahi ya no produce sombras
    luzFocal.shadowCameraFar = 750;
    //En grados
    luzFocal.shadowCameraFov = 70;
    //Helper para ver el frustrum
    //luzFocal.shadowCameraVisible = true;


    //Cargar y configurar las texturas
    var texturaSuelo = new THREE.ImageUtils.loadTexture("../images/pisometalico_1024.jpg");

    texturaSuelo.wrapS = texturaSuelo.wrapT = THREE.MirroredRepeatWrapping;
    texturaSuelo.repeat.set( 10, 10);
    texturaSuelo.magFilter = THREE.LinearFilter;
    texturaSuelo.minFilter = THREE.LinearFilter;

    var materialSuelo = new THREE.MeshPhongMaterial({
    	//componente ambiental, por la que se multiplicara la ilum ambiente
			color: 0x999999,
			//Color que le va a afectar a la luz...
			map: texturaSuelo,
			side: THREE.DoubleSide

    });

    var suelo = new THREE.Mesh( new THREE.PlaneGeometry(1000,1000,10,10),
    	materialSuelo);

    suelo.receiveShadow = true;

    suelo.rotation.x = -Math.PI/2;
    
    scene.add(suelo);

   


    //Callbacks
    window.addEventListener( 'resize', updateAspectRatio );

}

function loadScene(){

	

	var mapaEntorno = new THREE.ImageUtils.loadTextureCube( urls );
	mapaEntorno.format = THREE.RGBFormat;



	var shader = THREE.ShaderLib.cube;
	shader.uniforms.tCube.value = mapaEntorno;

	var wallsMaterial = new THREE.ShaderMaterial({
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		depthWrite: false,
		side: THREE.BackSide
	});


	var room = new THREE.Mesh( new THREE.CubeGeometry(1000,1000,1000), wallsMaterial);
	scene.add(room);


	


	loadRobot(scene,mapaEntorno);


}


function loadRobot(scene,mapaEntorno){

	var mt = new THREE.Matrix4();
    	var ms = new THREE.Matrix4();

	//Cargar y configurar las texturas
	var texturaMetal = new THREE.ImageUtils.loadTexture("../images/metal_128.jpg");

	texturaMetal.wrapS = texturaMetal.wrapT = THREE.MirroredRepeatWrapping;
	texturaMetal.repeat.set( 1, 1);
	texturaMetal.magFilter = THREE.LinearFilter;
	texturaMetal.minFilter = THREE.LinearFilter;

	var material = new THREE.MeshPhongMaterial({
	//componente ambiental, por la que se multiplicara la ilum ambiente
			color: 0x999999,
			//Color que le va a afectar a la luz...
			map: texturaMetal,
			shading: THREE.SmoothShading,
			side: THREE.DoubleSide

	});




	var materialEsfera = new THREE.MeshPhongMaterial({
		ambient: 0x999999,
		color: 0xFFFFFF,
		specular: 0x999999,
		shininess: 50,
		envMap: mapaEntorno
	});

	var axisHelper = new THREE.AxisHelper( 100 );
	scene.add(axisHelper);

	// pile
	var pileGeometry = new THREE.BoxGeometry( 18, 120, 12 );
	
	console.log(pileGeometry);

	var pile = new THREE.Mesh( pileGeometry, material );
	pile.position.y = 60;
	
	pile.receiveShadow = true;
	pile.castShadow = true;


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

	nerv1.receiveShadow = true;
	nerv1.castShadow = true;

	nerv2.receiveShadow = true;
	nerv2.castShadow = true;

	nerv3.receiveShadow = true;
	nerv3.castShadow = true;

	nerv4.receiveShadow = true;
	nerv4.castShadow = true;

	// mid base
	var diskGeometry = new THREE.CylinderGeometry( 22, 22, 6, 40, 1 );
	disk = new THREE.Mesh(diskGeometry, material);
	//disk.rotation.x = 90 * Math.PI / 180;
	//disk.position.y = 80;
	disk.receiveShadow = true;
	disk.castShadow = true;
	
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
	
	handBase.receiveShadow = true;
	handBase.castShadow = true;


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

	axis.receiveShadow = true;
	axis.castShadow = true;

	mt.makeTranslation(0,120,0);

	var geometry = new THREE.SphereGeometry( 20, 32, 32 );
	//sphere = new THREE.Mesh( geometry, material );
	sphere = new THREE.Mesh( geometry, materialEsfera );
	sphere.position.y = 120;

	sphere.receiveShadow = true;
	sphere.castShadow = true;

	// arm
	arm = new THREE.Object3D();
	arm.add(arm_pre);
	arm.add(axis);
	arm.add(pile);
	arm.add(sphere);

	// base
	var baseGeometry = new THREE.CylinderGeometry( 50, 50, 15, 40, 1 );
	base = new THREE.Mesh(baseGeometry, material);
	
	base.receiveShadow = true;
	base.castShadow = true;

	// robot
	robot = new THREE.Object3D();
	//robot.add(arm);
	base.add(arm);
	robot.add(base);

	
	scene.add(robot);

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


    var uvs = [
	
	//Revisar orden
	0,0,//0
	0,1,//3
	1,0,//7

	1,0,//7
	0,1,//3
	1,1,//4

	0,0,//0
	0,1,//1
	1,1,//2

	0,0,//0
	1,1,//2
	1,0,//3

	1,1,//4
	0,1,//3
	0,0,//2

	1,1,//4
	0,0,//2
	1,0,//5

	0,0,//1
	1,1,//5
	0,1,//2

	0,0,//1
	1,0,//6
	1,1,//5

	0,1,//7
	0,0,//6
	1,0,//1

	0,1,//7
	1,0,//1
	0,0//0
		

	

	];

    for(var i=0; i<coordenadas.length; i+=3) {
        var vertice = new THREE.Vector3( coordenadas[i], coordenadas[i+1], coordenadas[i+2] );
        malla.vertices.push( vertice );     
    }
	
    
     for(var i=0, j=0; i<indices.length; i+=3, j+=6){
        var triangulo =  new THREE.Face3( indices[i], indices[i+1], indices[i+2] );
        for(var j=0; j<3; j++){
            var color = new THREE.Color( colores[ indices[i+j] ] );
            triangulo.vertexColors.push( color );       
        }
        malla.faces.push( triangulo );
	var uvs_f = [];
	uvs_f.push(new THREE.Vector2( uvs[j], uvs[j+1]));
	uvs_f.push(new THREE.Vector2( uvs[j+2], uvs[j+3]));
	uvs_f.push(new THREE.Vector2( uvs[j+4], uvs[j+5]));

	malla.faceVertexUvs[0].push( uvs_f );
    }
	
	
	var mapaEntorno = new THREE.ImageUtils.loadTextureCube( urls );
	mapaEntorno.format = THREE.RGBFormat;

	var texturaMetal = new THREE.ImageUtils.loadTexture("../images/metal_128.jpg");

	texturaMetal.wrapS = texturaMetal.wrapT = THREE.MirroredRepeatWrapping;
	texturaMetal.repeat.set( 1, 1);
	texturaMetal.magFilter = THREE.LinearFilter;
	texturaMetal.minFilter = THREE.LinearFilter;

	var material = new THREE.MeshPhongMaterial({
	//componente ambiental, por la que se multiplicara la ilum ambiente
			color: 0x999999,
			//Color que le va a afectar a la luz...
			map: texturaMetal,
			shading: THREE.SmoothShading,
			side: THREE.DoubleSide

	});

	var materialEsfera = new THREE.MeshPhongMaterial({
		ambient: 0x999999,
		color: 0xFFFFFF,
		specular: 0x999999,
		shininess: 50,
		envMap: mapaEntorno
	});


    console.log(malla);
    cubo = new THREE.Mesh( malla, materialEsfera );

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
                    0,3,7, 7,3,4, //
                    0,1,2, 0,2,3, 
                    4,3,2, 4,2,5,
                    //6,7,4, 6,4,5, 
                    1,5,2, 1,6,5, 
                    7,6,1, 7,1,0     
                    ];
	
    var uvs = [
	//Revisar orden
	0,0,//0
	0,1,//3
	1,0,//7

	1,0,//7
	0,1,//3
	1,1,//4

	0,0,//0
	0,1,//1
	1,1,//2

	0,0,//0
	1,1,//2
	1,0,//3

	1,1,//4
	0,1,//3
	0,0,//2

	1,1,//4
	0,0,//2
	1,0,//5

	0,0,//1
	1,1,//5
	0,1,//2

	0,0,//1
	1,0,//6
	1,1,//5

	0,1,//7
	0,0,//6
	1,0,//1

	0,1,//7
	1,0,//1
	0,0//0
		

	

	];

	
	var mapaEntorno = new THREE.ImageUtils.loadTextureCube( urls );
	mapaEntorno.format = THREE.RGBFormat;

	var texturaMetal = new THREE.ImageUtils.loadTexture("../images/metal_128.jpg");

	texturaMetal.wrapS = texturaMetal.wrapT = THREE.MirroredRepeatWrapping;
	texturaMetal.repeat.set( 1, 1);
	texturaMetal.magFilter = THREE.LinearFilter;
	texturaMetal.minFilter = THREE.LinearFilter;

	var materialEsfera = new THREE.MeshPhongMaterial({
		ambient: 0x999999,
		color: 0xFFFFFF,
		specular: 0x999999,
		shininess: 150,
		map: texturaMetal,
		side: THREE.DoubleSide,
		shading: THREE.SmoothShading,
		envMap: mapaEntorno
	});
  
    for(var i=0; i<coordenadas.length; i+=3) {
        var vertice = new THREE.Vector3( coordenadas[i], coordenadas[i+1], coordenadas[i+2] );
	malla.vertices.push( vertice );     
    }

    //malla.faceVertexUvs = [];

    for(var i=0, j=0; i<indices.length; i+=3, j+=6){
        var triangulo =  new THREE.Face3( indices[i], indices[i+1], indices[i+2] );

        for(var j=0; j<3; j++){
            var color = new THREE.Color( colores[ indices[i+j] ] );
            triangulo.vertexColors.push( color );       
        }
        malla.faces.push( triangulo );

	var uvs_f = [];
	uvs_f.push(new THREE.Vector2( uvs[j], uvs[j+1]));
	uvs_f.push(new THREE.Vector2( uvs[j+2], uvs[j+3]));
	uvs_f.push(new THREE.Vector2( uvs[j+4], uvs[j+5]));

	malla.faceVertexUvs[0].push( uvs_f );

    }


    malla.computeFaceNormals();
    //var material = new THREE.MeshBasicMaterial( { color: 0xFF0000, wireframe: true } );
    cubo = new THREE.Mesh( malla, materialEsfera );

    return cubo;

}

/*
var antes = Date.now();

function update(){
	cameraControls.update();
	var ahora = Date.now();

    luzFocal.rotation.x += (Math.PI/180 * (ahora- antes)/100) % 360;
    console.log(luzFocal.rotation.x);

}
*/
var antes = 0;
var angulo = 0;
var counter = 0;

function update() {


    var ahora = Date.now();
    cameraControls.update();
 
    var delta = ahora - antes;

    angulo += (Math.PI/180 * (delta)/100) % 360;

    counter += .1;

    luzFocal.position.x = Math.sin(counter) * 100;
    luzFocal.position.z = Math.sin(counter) * 100;

    robot.rotation.y = angulo;
     
	
	
    antes = ahora;

}


function render(){

	requestAnimationFrame( render);
	renderer.render( scene, camera );
	update();
 	
}


function updateAspectRatio() {
   
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    //Renovar la matriz de proyección, ha cambiado el frustrum
    camera.updateProjectionMatrix();

}
