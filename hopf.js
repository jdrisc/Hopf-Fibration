// import { OrbitControls } from '@/node_modules/three/examples/jsm/controls/OrbitControls'
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// const controls = new OrbitControls( camera, renderer.domElement );

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );

//setup the geometry

const geometry = new THREE.SphereGeometry(  2,32,32 );
const material = new THREE.MeshBasicMaterial( {color: 0x49ef4, opacity:0.64, transparent: true} );
const sphere = new THREE.Mesh( geometry, material );


scene.add( sphere);

//material for a line
// const material2 = new THREE.LineBasicMaterial( {
// 	color: 0xffffff,
// 	linewidth: 3,
// } );


//to make a line start with an empty array and add the lines endpoints 
//const points = [];
//points.push( new THREE.Vector3( - 1, 0, 0 ) );
//points.push( new THREE.Vector3( 0, 1, 1 ) );
//const geometry2 = new THREE.BufferGeometry().setFromPoints( points );
//const line = new THREE.Line( geometry2, material2);

const planeGeometry = new THREE.PlaneGeometry( 6, 6, 32 ); //plane to intersect sphere
const planeMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.rotation.set(0,0,0);

//points on intersection of line and sphere
const pointGeometry = new THREE.SphereGeometry(0.1,32,32);
const pointMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000, opacity:0.84, transparent: true} );

//create a parent object to rotate all points and plane simulatenously
const rotations = new THREE.Object3D();
scene.add( rotations );

// rotations.add( plane );

for (i = 0; i < 10; i++){
    addPoint(i);
}
function addPoint(j){
    var sphere2add = new THREE.Mesh(pointGeometry, pointMaterial);
    sphere2add.position.x = 0.02 + 2*Math.cos( 2 * Math.PI*j/10 );
    sphere2add.position.y = 0.02 + 2*Math.sin( 2 *Math.PI*j/10 );
    sphere2add.rotation.set(0,0,0);
    rotations.add(sphere2add);
}

// var fiberBasePoints = [];
// for (i=0; 1<10 ; i++){
//     var fiberBasePoint = new THREE.Quaternion(0, Math.sqrt(2)*Math.cos( 2 * Math.PI*i/10 ), Math.sqrt(2)*Math.sin( 2 *Math.PI*i/10 ),0);
//     fiberBasePoints.push(fiberBasePoint);
// }


//pivot groups together for rotation
var pivot = new THREE.Group();
scene.add(pivot);



pivot.add( rotations );
//scene.add(sphere);
camera.position.z = 12;
camera.position.x = 6;
camera.position.y = 5;



//move things around using animate
const animate = function () {
    requestAnimationFrame( animate );
    // controls.update();


    pivot.rotation.z += 0.01;
    pivot.rotation.y += 0.01;

   
    //rotations.rotation.y += 0.01;


    renderer.render( scene, camera );
};

animate();


