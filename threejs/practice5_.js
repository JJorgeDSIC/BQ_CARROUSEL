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
    /*
    camera = new THREE.PerspectiveCamera( fov, aspectRatio, near, far);
    camera.position.set(0, 5, 10);
    camera.lookAt( new THREE.Vector3( 0, 0, 0));
    */

    camera = new THREE.PerspectiveCamera( 40, aspectRatio, 1, 2000 );
    camera.position.set( 100, 100, 300 );
    camera.lookAt(new THREE.Vector3( 0, 50, 0 ));

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

    var suelo = new THREE.Mesh( new THREE.PlaneGeometry(1000, 1000, 10, 10),
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


    var mt = new THREE.Matrix4();
    var ms = new THREE.Matrix4();

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
	var pulido2 = new THREE.MeshPhongMaterial(
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

    /*
    //La caja!!
    //Habitación
    //Material "Environment Box": usa el mapa de entorno
    //cubico como uniforme en el shader
    var shader = THREE.ShaderLib.cube;
    shader.uniforms.tCube.value = mapaEntorno2;

    var wallsMaterial = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: true,
        side: THREE.Backside
    });

    */
    var room = new THREE.Mesh( new THREE.CubeGeometry(50,50,50), wallsMaterial);
    scene.add(room);
    
    var room = new THREE.Mesh( new THREE.CubeGeometry(50,50,50), wallsMaterial);
    scene.add(room);
    

 	/*
 	Coordinates.drawGround( {
 		size: 10,
 		color: "darkkhaki"
 		 }); //suelo de 10 x 10 m
	*/
 	var ejes = new THREE.AxisHelper( 10 );
 	scene.add(ejes);







      var material = new THREE.MeshBasicMaterial(
        {color: 0xFF0000
        //wireframe: true
    });

    /*
    //Plane
    var geometry = new THREE.PlaneGeometry( 1000, 1000, 32, 32 );
    //var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    var plane = new THREE.Mesh( geometry, material );
    plane.rotation.x = 90 * Math.PI / 180;
    plane.position.y = 0;
    scene.add( plane );
    */
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
    //sphere = new THREE.Mesh( geometry, material );
    sphere = new THREE.Mesh( geometry, materialEsfera );
    
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