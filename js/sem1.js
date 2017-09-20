// seminario 1

var VSHADER_SOURCE = 
    'attribute vec4 position;' +
    'void main() { ' +
        'gl_Position = position; ' +
        'gl_PointSize = 10.0; ' +
    '}';

var FSHADER_SOURCE = 
    'void main() { ' +
        'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); ' +
    '}';

function main() {
    
    // lienzo
    var canvas = document.getElementById('canvas');
    
    if (!canvas) {
        console.log('Failed to recover the canvas');
        return;
    }

    // step 1 
    // rectangle();

    // step 2
    var gl = getWebGLContext(canvas);

    if (!gl) {
        console.log('Failed to recover the WebGL');
        return;
    }

    // load, compile and mount the shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to load the shaders');
        return;
    }

    // set background color
    gl.clearColor(0.0, 0.0, 0.3, 1.0);

    // erase the raster
    gl.clear(gl.COLOR_BUFFER_BIT);

    // locate the position attribute of the shader
    var coordinates = gl.getAttribLocation(gl.program, 'position');

    // register the mouse event
    canvas.onmousedown = function(event) {
        click(event, gl, canvas, coordinates);
    }

}

var points = [];

function click(event, gl, canvas, coordinates) {

    var x = event.clientX,
        y = event.clientY;

    var rect = event.target.getBoundingClientRect();

    // conversion document-webgl
    x = ((x - rect.left) - canvas.width/2) * 2/canvas.width;
    y = (canvas.height/2 - (y - rect.top)) * 2/canvas.height; 

    points.push(x);
    points.push(y);

    gl.clear(gl.COLOR_BUFFER_BIT);

    for (var i = 0; i < points.length; i += 2) {
        gl.vertexAttrib3f(coordinates, points[i], points[i+1], 0.0);

        gl.drawArrays(gl.POINTS, 0, 1);
    }

}

function rectangle() {

    var brush = canvas.getContext('2d');

    brush.fillStyle = 'rgba(0, 0, 255, 1.0)';
    brush.fillRect(0, 0, 150, 150);

}