var video; 
var videoImage; //Donde se proyecta
var videoImageContext; //reproductor del video
var videoTexture; //Pegar el video como textura al objeto


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
var pinzaIz;
var pinzaDe;
var hand;

var effectController;

var path =  "../images/";
//Mapa de entorno
var urls = [ 
    path+"posx.jpg", 
    path+"negx.jpg", 
    path+"posy.jpg", 
    path+"negy.jpg", 
    path+"posz.jpg", 
    path+"negz.jpg" ];

var keyboard = new KeyboardState();
var textObject;
var stats;

init();
loadScene();
setupGui();
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

    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = "absolute";
    stats.domElement.style.bottom = "0px";
    stats.domElement.style.left = "0px";
    document.body.appendChild( stats.domElement);

    //Escena
    scene = new THREE.Scene();

    //Camera
    var aspectRatio = window.innerWidth / window.innerHeight;
    var fov = 45;
    var near = 0.1; //10 cm
    var far = 10000; //10000 m

    camera = new THREE.PerspectiveCamera( fov, aspectRatio, near, far);
    camera.position.set(100, 400, 600);
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
    luzFocal.shadowCameraFar = 1750;
    //En grados
    luzFocal.shadowCameraFov = 120;
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


    
    /*
    Coordinates.drawGround({size: 10});
    Coordinates.drawGrid({size: 6, scale:1, orientation: "y"});
    Coordinates.drawGrid({size: 6, scale:1, orientation: "z"});
    
    Coordinates.drawAllAxes({axisLength: 5, axisRadius:0.05, axisTess: 20});//Teselacion a 20
    */
    loadRobot(scene,mapaEntorno);

}


//función de definicion de la interfaz
function setupGui(){

    //Definición de los controles

    effectController = {
        mensaje: 'Cambia el txt en la interfaz',
        //efecto que va a tener en ese control
        giroY: 0.0,
        //giroBase: 0.0,
        //giroBaseX: 0.0,
        //giroBaseY: 0.0,
        giroBaseZ: 0.0, 
        //giroRotulaX: 0.0,
        giroRotulaY: 0.0,
        giroRotulaZ: 0.0, 

        giroPinzaZ: 0.0,
        cerrarPinzas: 0.0

        //separacion: [],
        //sombras: true,
        //colorEsfera: "rgb(0, 255, 0)"

    }

    var gui = new dat.GUI({width: 350});
 

    //Insertar los controles en esa interfgaz

    var h = gui.addFolder("Controles");
    h.add(effectController, "mensaje",0, 27).name("Aplicación");//Objeto con controles
    //Slider => Limite inf, sup, incremento
    h.add(effectController, "giroY", -180.0, 180.0, 0.025).name("Giro Base");//Objeto con controles
    //h.add(effectController, "giroBaseX", -180.0, 180.0, 0.025).name("Giro de Hombro X");//Objeto con controles
    //h.add(effectController, "giroBaseY", -180.0, 180.0, 0.025).name("Giro de Hombro Y");//Objeto con controles
    h.add(effectController, "giroBaseZ", -45.0, 45.0, 0.025).name("Giro Brazo");//Objeto con controles

    //h.add(effectController, "giroRotulaX", -180.0, 180.0, 0.025).name("Giro de Codo X");//Objeto con controles
    h.add(effectController, "giroRotulaY", -180.0, 180.0, 0.025).name("Giro Antebrazo Y");//Objeto con controles
    h.add(effectController, "giroRotulaZ", -90.0, 90.0, 0.025).name("Giro Antebrazo Z");//Objeto con controles

    h.add(effectController, "giroPinzaZ", -40.0, 220.0, 0.025).name("Giro Pinza");//Objeto con controles
    h.add(effectController, "cerrarPinzas", 0, 15, 0.025).name("Separación pinzas");//Objeto con controles
    //Combo box
    //h.add(effectController, "separacion", {Ninguna: 0,Media: 2, Total:5}).name("Separacion");//Objeto con controles

    //h.add(effectController, "sombras").name("Sombras");//Es un check box por defecto

    //Widget de seleccion de coloes
    //h.addColor(effectController, "colorEsfera").name("Color Esfera");//Objeto con controles
   

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

    //var axisHelper = new THREE.AxisHelper( 100 );
    //scene.add(axisHelper);

    // pile
    var pileGeometry = new THREE.BoxGeometry( 18, 120, 12 );
    
    //console.log(pileGeometry);

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

    pinzaIz = new THREE.Object3D();

    pinzaIz.add(cubo_izq_1);

    pinzaIz.add(cubo_izq_2);

    pinzaDe = new THREE.Object3D();
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

    pinzaDe.scale.z = -1.1;


    // hand base
    var handGeometry = new THREE.CylinderGeometry( 18, 18, 40, 40, 1 );
    handBase = new THREE.Mesh(handGeometry, material);

    handBase.rotation.x = 90 * Math.PI / 180;
    
    handBase.receiveShadow = true;
    handBase.castShadow = true;


    hand = new THREE.Object3D();

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

    textObject = dancing_text("Cambia el texto en la interfaz!");

    scene.add(textObject);
   


}

function dancing_text(text)
{

    // add 3D text
    var materialFront = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    var materialSide = new THREE.MeshBasicMaterial( { color: 0x000088 } );
    var materialArray = [ materialFront, materialSide ];
   
    var desp = 30;
    var j = 0;

    var innerTextObject = new THREE.Object3D();

    for(j = 0; j < text.length; j++)
    {
        var car = text.charAt(j);

        if(car != ' '){
            //console.log(car);
            var textGeom = new THREE.TextGeometry( car, 
            {
                size: 30, height: 4, curveSegments: 3,
                font: "helvetiker", weight: "bold", style: "normal",
                bevelThickness: 1, bevelSize: 2, bevelEnabled: true,
                material: 0, extrudeMaterial: 1
            });
            // font: helvetiker, gentilis, droid sans, droid serif, optimer
            // weight: normal, bold
            
            var textMaterial = new THREE.MeshFaceMaterial(materialArray);
            var textMesh = new THREE.Mesh(textGeom, textMaterial );

            textMesh.castShadow = true;
            
            textGeom.computeBoundingBox();
            var textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;
            
            textMesh.position.set( -0.5 * textWidth + (desp * j) - (desp * text.length/2), 60, -100 );
            
            textMesh.rotation.x = -Math.PI / 4;

            innerTextObject.add(textMesh);
        }
    }
    //console.log(innerTextObject);
    return innerTextObject;

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
    
    cubo = new THREE.Mesh( malla, materialEsfera );

    cubo.receiveShadow = true;
    cubo.castShadow = true;
    
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
    
    cubo.receiveShadow = true;
    cubo.castShadow = true;
    
    return cubo;

}


var antes = 0;
var angulo = 0;
var counter = 0;
var v = true;
function update() {

    stats.update();
    var ahora = Date.now();
    cameraControls.update();

    var delta = ahora - antes;

    scene.remove(textObject);

    effectController.mensaje = effectController.mensaje.substring(0,31);
    textObject = dancing_text(  effectController.mensaje);
 
    scene.add(textObject);
    
    var i = 0;

    textObject.traverse(function (object){
        if( object instanceof THREE.Mesh)
            {
                //console.log(object);
                object.position.y +=  5 * Math.cos((ahora * Math.PI/180) + i) ; 
                i++;
            }
    });
    /*
    scene.traverse(function (object){
        if( object instanceof THREE.Mesh)
            {
                object.castShadow = effectController.sombras;   
                object.receiveShadow = effectController.sombras;
            }
    });
    */
    pinzaIz.position.set(0,0, -effectController.cerrarPinzas/2 - 4);
    pinzaDe.position.set(0,0, +effectController.cerrarPinzas/2 + 4);

    robot.rotation.y = effectController.giroY * Math.PI/180; //Pasar a radianes

    //arm.rotation.x = effectController.giroBaseX * Math.PI/180; //Pasar a radianes
    //arm.rotation.y = effectController.giroBaseY * Math.PI/180; //Pasar a radianes
    arm.rotation.z = effectController.giroBaseZ * Math.PI/180; //Pasar a radianes

    //arm_pre.rotation.x = effectController.giroRotulaX * Math.PI/180; //Pasar a radianes
    arm_pre.rotation.y = effectController.giroRotulaY * Math.PI/180; //Pasar a radianes
    arm_pre.rotation.z = effectController.giroRotulaZ * Math.PI/180; //Pasar a radianes


    hand.rotation.z = effectController.giroPinzaZ * Math.PI/180;

    angulo += (Math.PI/180 * (delta)/100) % 360;

    counter += .1;

    luzFocal.position.x = Math.sin(counter) * 100;
    luzFocal.position.z = Math.sin(counter) * 100;

    keyboard.update();

    var moveDistance = 0.5 * delta; 

    if ( keyboard.down("left") || keyboard.pressed("left") ) 
        if(robot.position.x > -440) 
            robot.position.x += ( -moveDistance );
        
    if ( keyboard.down("right") || keyboard.pressed("right") ) 
        if(robot.position.x < 440)
            robot.position.x += (  moveDistance );

    if ( keyboard.down("up") || keyboard.pressed("up") ) 
        if(robot.position.z > -440)
            robot.position.z += ( -moveDistance );
        
    if ( keyboard.down("down") || keyboard.pressed("down") ) 
        if(robot.position.z < 440)
            robot.position.z += (  moveDistance );

    
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
