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
this.sphere = sphere;
this.sphere.position.x=-10;
this.sphere.position.y=-6;
this.sphere.position.z=-6;

const material2 = new THREE.LineBasicMaterial( {
	color: 0xffffff,
	linewidth: 3,
} );


//to make a line start with an empty array and add the lines endpoints 
//const points = [];
//points.push( new THREE.Vector3( - 1, 0, 0 ) );
//points.push( new THREE.Vector3( 0, 1, 1 ) );
//const geometry2 = new THREE.BufferGeometry().setFromPoints( points );
//const line = new THREE.Line( geometry2, material2);

const planeGeometry = new THREE.PlaneGeometry( 6, 6, 32 );
const planeMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
this.plane = plane;
this.plane.position.x = -10;
this.plane.position.y = -6;
this.plane.position.z = -6;



scene.add( sphere, plane);
//scene.add(sphere);
camera.position.z = 10;


//move things around using animate
const animate = function () {
    requestAnimationFrame( animate );
    // controls.update();


    plane.rotation.x += 0.01;
    plane.rotation.y += 0.01;

    renderer.render( scene, camera );
};

animate();


