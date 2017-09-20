/*
Seminario luces y materiales
*/

var renderer, scene, camera, cameraControls;
var luzPuntual;
var luzDireccional;
var luzFocal;

init();
loadScene();
render();

function init(){

	/*
	// MOTOR: configure the canvas and the render engine
    renderer = new THREE.WebGLRenderer();
    //Toda la pantalla para dibujar
    renderer.setSize( window.innerWidth, window.innerHeight );
    //Establecer color de borrado
    renderer.setClearColor( new THREE.Color( 0x0) );
	*/
    // MOTOR CON SOMBRAS: configure the canvas and the render engine
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
    var far = 100; //100 m

    camera = new THREE.PerspectiveCamera( fov, aspectRatio, near, far);
    camera.position.set(0, 5, 10);
    camera.lookAt( new THREE.Vector3( 0, 0, 0));

    //Instanciamos los controles (camera y de donde son los eventos que coge)
    cameraControls = new THREE.OrbitControls( camera, renderer.domElement );

    //Luces

    //Ambiental - identificada por el color y la intensidad
    var luzAmbiente = new THREE.AmbientLight(0x000AAA);
    scene.add( luzAmbiente );

    //Direccional: color, intensidad, dirección
    luzDireccional = new THREE.DirectionalLight(0xFFFFFF, 1.0); //1.0 la máxima intensidad
    luzDireccional.position.set(5,5,4); //Dirección en la que tiene que alumbrar
    //vector unitario con la dirección de este vector
    scene.add( luzDireccional );


    //Puntual - color, intensidad, posicion
    luzPuntual = new THREE.PointLight(0xFFFFFF, 0.6);
    //Vector L?
    luzPuntual.position.set(-5,5,4);
    scene.add( luzPuntual );

	//Focal - color, posicion, intensidad y semiangulo
    luzFocal = new THREE.SpotLight(0xFFFFFF, 0.6);
    luzFocal.position.set(4, 6, 0); //En el plano XY
    luzFocal.target.position.set(0,0,0);
    luzFocal.angle = Math.PI/5;

     //Para producir sombras
    luzFocal.castShadow = true;
   
    scene.add( luzFocal );

    //Volumen de la vista para la luz focal
    //Distancia desde la que va a producir sombras
    luzFocal.shadowCameraNear = 1;
    //A partir de ahi ya no produce sombras
    luzFocal.shadowCameraFar = 20;
    //En grados
    luzFocal.shadowCameraFov = 70;
    //Helper para ver el frustrum
    luzFocal.shadowCameraVisible = true;


    //Cargar y configurar las texturas
    var texturaSuelo = new THREE.ImageUtils.loadTexture("../images/PrimeraImagenHerschel.jpg");

    texturaSuelo.wrapS = texturaSuelo.wrapT = THREE.MirroredRepeatWrapping;
    texturaSuelo.repeat.set( 1, 1);
    texturaSuelo.magFilter = THREE.LinearFilter;
    texturaSuelo.minFilter = THREE.LinearFilter;

    var materialSuelo = new THREE.MeshPhongMaterial({
    	//componente ambiental, por la que se multiplicara la ilum ambiente
			color: 0x999999,
			//Color que le va a afectar a la luz...
			map: texturaSuelo,

			specular: 0x444444,
			side: THREE.DoubleSide

    });

    var suelo = new THREE.Mesh( new THREE.PlaneGeometry(10,10,10,10),
    	materialSuelo);

    suelo.receiveShadow = true;

    suelo.rotation.x = -Math.PI/2;
    
    scene.add(suelo);

   


    //Callbacks
    window.addEventListener( 'resize', updateAspectRatio );

}
/*
function loadIlum(scene){add
    var luzAmbiente = new THREE.AmbientLight(0xAAAAAA);
    scene.add( luzAmbiente );

    var luzPuntual = new THREE.PointLight(0xFFFFFF, 1.0);
    //Vector L?
    luzPuntual.position.set(5,5,4);
    scene.add( luzPuntual );

    var luzDireccional = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    luzDireccional.position.set(5,5,4);
    scene.add( luzDireccional );

    var luzFocal = new THREE.SpotLight(0xFFFFFF, 1.0);
    luzFocal.position.set(5,5,4);
    luzFocal.target.position.set(0,0,0);
    luzFocal.angle = Math.PI/5;
    scene.add( luzFocal );
}
*/
function loadScene(){

	//Materiales
	var basico = new THREE.MeshBasicMaterial(
		{
			color: 0xFF0000,
			wireframe: true
		}
		);

	//Material pulido - Phong
	var pulido = new THREE.MeshPhongMaterial(
		{
			//componente ambiental, por la que se multiplicara la ilum ambiente
			ambient: 0xFF0000,
			//Color que le va a afectar a la luz...
			color: 0xFF0000
			
		}
	);

	//Material pulido - Phong
	var pulido = new THREE.MeshPhongMaterial(
		{
			//componente ambiental, por la que se multiplicara la ilum ambiente
			ambient: 0xFF0000,
			//Color que le va a afectar a la luz...
			color: 0xFF0000,
			//Darle color especular, color al brillo
			specular: 0x444444,
			//Concentración de brillo, shininess
			shininess: 50
			
		}
	);

	//Material mate
	var mate = new THREE.MeshLambertMaterial(
		{
			
			color: 0xFFAF00,
			//Manera del modelo de sombreado
			shading: THREE.SmoothShading
			
		}
	);

	//Material facetado - Phong
	var facetado = new THREE.MeshLambertMaterial(
		{
			
			color: 0xFFAF00,
			//Manera del modelo de sombreado
			shading: THREE.FlatShading
			
		}
	);


    var urls = ["../images/glasses.jpg",
    "../images/glasses.jpg",
    "../images/glasses.jpg",
    "../images/glasses.jpg",
    "../images/glasses.jpg",
    "../images/glasses.jpg"
    ];

      var urls2 = ["../images/environment.jpg",
    "../images/environment.jpg",
    "../images/environment.jpg",
    "../images/environment.jpg",
    "../images/environment.jpg",
    "../images/environment.jpg"
    ];

    var mapaEntorno = THREE.ImageUtils.loadTextureCube( urls );
    mapaEntorno.format = THREE.RGBFormat;

    var materialEsfera = new THREE.MeshPhongMaterial({
    	ambient: 0xFF0000,
    	color: 0xFFFFFF,
    	specular: 0x222222,
    	shininess: 50,
    	envMap: mapaEntorno
    });

     var mapaEntorno2 = THREE.ImageUtils.loadTextureCube( urls2 );
    mapaEntorno2.format = THREE.RGBFormat;

    var materialCubo = new THREE.MeshPhongMaterial({
    	ambient: 0xFF0000,
    	color: 0xFFFFFF,
    	specular: 0x222222,
    	shininess: 50,
    	envMap: mapaEntorno2
    });


	//Objetos
	//Geometría
	var geometriaCubo = new THREE.CubeGeometry( 2, 2, 2);
	//Malla => se define mezclando geom + material
	var cubo = new THREE.Mesh( geometriaCubo, pulido);
    cubo.position.set(-1, 0, 0);

    cubo.castShadow = true;
    cubo.receiveShadow  = true;

	var geometriaEsfera = new THREE.SphereGeometry( 1, 50, 50);

	var esfera = new THREE.Mesh(geometriaEsfera, pulido);
	//var esfera = new THREE.Mesh(geometriaEsfera, mate);
	var esfera = new THREE.Mesh(geometriaEsfera, materialEsfera);
	esfera.position.set(1, 0, 0);


    esfera.castShadow = true;
    esfera.receiveShadow  = true;

 	var esferaCubo = new THREE.Object3D();

 	esferaCubo.add(esfera);
 	esferaCubo.add(cubo);
 	esferaCubo.position.set( 0, 1, 0);

 	scene.add(esferaCubo);
 	/*
 	Coordinates.drawGround( {
 		size: 10,
 		color: "darkkhaki"
 		 }); //suelo de 10 x 10 m
	*/
 	var ejes = new THREE.AxisHelper( 10 );
 	scene.add(ejes);

      var urls = ["../images/glasses.jpg",
    "../images/glasses.jpg",
    "../images/glasses.jpg",
    "../images/glasses.jpg",
    "../images/glasses.jpg",
    "../images/glasses.jpg"
    ];

      var urls2 = ["../images/environment.jpg",
    "../images/environment.jpg",
    "../images/environment.jpg",
    "../images/environment.jpg",
    "../images/environment.jpg",
    "../images/environment.jpg"
    ];

    var mapaEntorno = THREE.ImageUtils.loadTextureCube( urls );
    mapaEntorno.format = THREE.RGBFormat;

    var materialEsfera = new THREE.MeshPhongMaterial({
        ambient: 0xFF0000,
        color: 0xFFFFFF,
        specular: 0x222222,
        shininess: 50,
        envMap: mapaEntorno
    });

     var mapaEntorno2 = THREE.ImageUtils.loadTextureCube( urls2 );
    mapaEntorno2.format = THREE.RGBFormat;

    var materialCubo = new THREE.MeshPhongMaterial({
        ambient: 0xFF0000,
        color: 0xFFFFFF,
        specular: 0x222222,
        shininess: 50,
        envMap: mapaEntorno2
    });



    var shader = THREE.ShaderLib.cube;
    shader.uniforms.tCube.value = mapaEntorno;

    var wallsMaterial = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.Backside
    });

  
    var room = new THREE.Mesh( new THREE.CubeGeometry(25,25,25), wallsMaterial);
    scene.add(room);




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

function update() {


    var ahora = Date.now();
   	
    angulo += (Math.PI/180 * (ahora- antes)) % 360;

    luzFocal.rotation.y = angulo;
    console.log(luzDireccional.rotation.y);
    //angulo = angulo *  > 0? angulo * -1 : angulo;

    antes = ahora;
    
    cameraControls.update();

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