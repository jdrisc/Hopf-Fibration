import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";

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

//the materials for points on the sphere:
let myMaterials = [];
myMaterials.push( new THREE.MeshBasicMaterial( {color: "rgb(255,0,0)", opacity:0.8, transparent: true }));
myMaterials.push( new THREE.MeshBasicMaterial( {color: "rgb(204,204,0)", opacity:0.8, transparent: true }));
myMaterials.push( new THREE.MeshBasicMaterial( {color: "rgb(0,204,0)", opacity:0.8, transparent: true }));
myMaterials.push( new THREE.MeshBasicMaterial( {color: "rgb(0,102,204)", opacity:0.8, transparent: true }));
myMaterials.push( new THREE.MeshBasicMaterial( {color: "rgb(0,153,0)", opacity:0.8, transparent: true }));
myMaterials.push( new THREE.MeshBasicMaterial( {color: "rgb(204,0,204)", opacity:0.8, transparent: true }));
myMaterials.push( new THREE.MeshBasicMaterial( {color: "rgb(178,102,255)", opacity:0.8, transparent: true }));
myMaterials.push( new THREE.MeshBasicMaterial( {color: "rgb(153,255,204)", opacity:0.8, transparent: true }));
myMaterials.push( new THREE.MeshBasicMaterial( {color: "rgb(153,255,153)", opacity:0.8, transparent: true }));
myMaterials.push( new THREE.MeshBasicMaterial( {color: "rgb(255,176,102)", opacity:0.8, transparent: true }));



let i;
for (i = 0; i < 10; i++){
    addPoint(i);
}

function addPoint(j){
    var sphere2add = new THREE.Mesh(pointGeometry, myMaterials[j]);
    sphere2add.position.x = Math.cos( 2 * Math.PI*j/10 );
    sphere2add.position.y = Math.sin( 2 *Math.PI*j/10 );
    sphere2add.rotation.set(0,0,0);
    // sphere2add.material.color.set(myColors[0]) ;
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
plot.position.set(2,2,2);
//for each array in fibers, project each of its point into an array, form a line, add to group
fibers.forEach(element => stereoProjFiber(element));

let lineColors = [];
lineColors.push( new THREE.Color( "rgb(255,0,0)" ));
lineColors.push( new THREE.Color( "rgb(204,204,0)" ));
lineColors.push( new THREE.Color( "rgb(0,204,0)"));
lineColors.push( new THREE.Color( "rgb(0,102,204)"));
lineColors.push( new THREE.Color( "rgb(0,153,0)" ));
lineColors.push(  new THREE.Color("rgb(204,0,204)"));
lineColors.push( new THREE.Color( "rgb(178,102,255)"));
lineColors.push( new THREE.Color(  "rgb(153,255,204)"));
lineColors.push( new THREE.Color("rgb(153,255,153)"));
lineColors.push( new THREE.Color("rgb(255,176,102)"));





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

function updateColors(element,index,array) {
    element.material.color.set(lineColors[index])
}

plot.children.forEach(updateColors);
plot.children.forEach( child => child.geometry.attributes.position.needsUpdate = true);


scene.add(plot);

// // test how to update vertices of a line:

// let testPoints = [];

// testPoints.push( new THREE.Vector3(1,1,1));
// testPoints.push(new THREE.Vector3(-1,-1,-1));
// const material2 = new THREE.LineBasicMaterial( {color: 0xffffff, linewidth: 10,} );
// const geometry3 = new THREE.BufferGeometry().setFromPoints( testPoints );
// let testLine = new THREE.Line( geometry3, material2 );
// // can update the position as follows:
// geometry3.attributes.position.needsUpdate = true;
// testLine.geometry.attributes.position.array[0] = 2;
// testLine.geometry.attributes.position.array[1] = 3;
// console.log(testLine.geometry.attributes.position.array[1]);

// scene.add(testLine);


function maxScale(x){
    if (x == Infinity){
        return Math.pow(10,10);
    } else {
        return x;
    }
}




camera.position.z = 7;
// camera.position.x = 6;
// camera.position.y = 6;

const controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.update();



function updatePoints(obj) {
    let temp = obj.position.x;
    obj.position.x = Math.cos(0.01)*obj.position.x - Math.sin(0.01)*obj.position.y;
    obj.position.y = Math.sin(0.01)*temp + Math.cos(0.01)*obj.position.y;
    let temp2 = obj.position.z;
    obj.position.z = Math.cos(0.005)*obj.position.z - Math.sin(0.005)*obj.position.y;
    obj.position.y = Math.sin(0.005)*temp2 + Math.cos(0.005)*obj.position.y;

}

function updateFiberPlot() {
    let updatedFibers = [];
    rotations.children.forEach(function(point) {
        let singleFiber = [];
        let j;
        for (j=0; j<101 ; j++){
            let quat = new THREE.Quaternion(0, point.position.x , point.position.y, 1 + point.position.z);
            quat.multiply(  new THREE.Quaternion(1/Math.sqrt(2*(1+point.position.z)),0,0,0)  );
            let mult = new THREE.Quaternion(Math.cos( 2*Math.PI*j/100),0,0,Math.sin(2*Math.PI*j/100));
            let fiberPoint = quat.multiply(mult);
            singleFiber.push(fiberPoint);
        }
        updatedFibers.push(singleFiber);
    } );
    updatedFibers.forEach(function(fib, i , fibersarray){
        fib.forEach(function(quat, j, fibarray){
            let unnormalised = new THREE.Vector3(maxScale(1/(1-quat.w))*quat.x, maxScale(1/(1-quat.w))*quat.y , maxScale(1/(1-quat.w))*quat.z);
            let norm = maxScale(unnormalised.length());
            let scaled = unnormalised.multiplyScalar(Math.atan(norm)/norm);
            plot.children[i].geometry.attributes.position.array[3*j ] = scaled.x;
            plot.children[i].geometry.attributes.position.array[3*j + 1] = scaled.y;
            plot.children[i].geometry.attributes.position.array[3*j +2 ] = scaled.z;
            
        });
    });
}

//move things around using animate
const animate = function () {
    requestAnimationFrame( animate );
    controls.update();



    rotations.children.forEach((child) => updatePoints(child));
    // UPDATE points in fibers three.line   (children of group 'plot')
    // for curve in plot.children, for point in curve, testLine.geometry.attributes.position.array[3*curve index + point index ] = stereoProj;

    // testLine.geometry.attributes.position.array[0] +=0.01;
    // testLine.geometry.attributes.position.needsUpdate = true;

    plot.children.forEach((child) =>  child.geometry.attributes.position.needsUpdate = true);
    updateFiberPlot();
   
    plot.children.forEach((child) =>  child.geometry.attributes.position.needsUpdate = true);

    renderer.render( scene, camera );
};

animate();


