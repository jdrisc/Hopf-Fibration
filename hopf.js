// import { OrbitControls } from '@/node_modules/three/examples/jsm/controls/OrbitControls'
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// const controls = new OrbitControls( camera, renderer.domElement );

//setup the sphere:
const geometry = new THREE.SphereGeometry(  1,32,32 );
const material = new THREE.MeshBasicMaterial( {color: 0x49ef4, opacity:0.64, transparent: true} );
const sphere = new THREE.Mesh( geometry, material );

scene.add( sphere);

//base points on sphere
const pointGeometry = new THREE.SphereGeometry(0.1,32,32);
const pointMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000, opacity:0.84, transparent: true} );

//create a parent object to rotate all points and plane simulatenously
const rotations = new THREE.Object3D();
scene.add( rotations );


let i;
for (i = 0; i < 10; i++){
    addPoint(i);
}
function addPoint(j){
    var sphere2add = new THREE.Mesh(pointGeometry, pointMaterial);
    sphere2add.position.x = Math.cos( 2 * Math.PI*j/10 );
    sphere2add.position.y = Math.sin( 2 *Math.PI*j/10 );
    sphere2add.rotation.set(0,0,0);
    rotations.add(sphere2add);
}
//pivot groups together for rotation
var pivot = new THREE.Group();
scene.add(pivot);


var fibers = []; //an array to contain 10 arrays- each containing points tracing out a fiber
rotations.children.forEach(element => addFiber(element));

function addFiber(point){
    //takes a point on S2 and adds an array of 100 points in fiber over that point to the fibers array 
    let singleFiber = [];
    let j;
    for (j=0; j<101 ; j++){
        let quat = new THREE.Quaternion(0, point.position.x , point.position.y, 1 + point.position.z);
        quat.multiply(  new THREE.Quaternion(1/Math.sqrt(2*(1+point.position.z)),0,0,0)  );
        let mult = new THREE.Quaternion(Math.cos( 2*Math.PI*j/100),0,0,Math.sin(2*Math.PI*j/100));
        let fiberPoint = quat.multiply(mult);
        singleFiber.push(fiberPoint);
    }
    fibers.push(singleFiber);
}



var plot = new THREE.Group();
plot.position.set(6,6,6);
//for each array in fibers, project each of its point into an array, form a line, add to group
fibers.forEach(element => stereoProjFiber(element));



function stereoProjFiber(fib){
    let projFib = []
    fib.forEach(function(quat){
        let unnormalised = new THREE.Vector3(maxScale(1/(1-quat.w))*quat.x, maxScale(1/(1-quat.w))*quat.y , maxScale(1/(1-quat.w))*quat.z);
        let norm = maxScale(unnormalised.length());
        let scaled = unnormalised.multiplyScalar(Math.atan(norm)/norm);
        projFib.push(scaled);
    });
    const material2 = new THREE.LineBasicMaterial( {
        color: 0xffffff,
        linewidth: 10,
    } );
    const geometry2 = new THREE.BufferGeometry().setFromPoints( projFib );
    let fibPlot = new THREE.Line(geometry2, material2);
    plot.add(fibPlot)
}


function maxScale(x){
    if (x == Infinity){
        return Math.pow(10,10);
    } else {
        return x;
    }
}

scene.add(plot);



camera.position.z = 12;
camera.position.x = 6;
camera.position.y = 5;


//move things around using animate
const animate = function () {
    requestAnimationFrame( animate );
    // controls.update();


    rotations.rotation.z += 0.01;
    rotations.rotation.y += 0.01;



    renderer.render( scene, camera );
};

animate();


