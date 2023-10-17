// import "./style.css";
// Update the import path to reflect the new location
import { Ammo } from "https://cdn.jsdelivr.net/gh/kripken/ammo.js@HEAD/builds/ammo.js";
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "https://unpkg.com/three@0.127.0/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js';
//import { CannonJSWrapper } from 'https://cdn.jsdelivr.net/npm/cannon-es@0.6.2/dist/CannonWrapper.js';
//import { PlainAnimator } from 'https://cdn.jsdelivr.net/npm/three-plain-animator/lib/plain-animator';
//import { PlainAnimator } from 'https://cdn.jsdelivr.net/npm/three-plain-animator/lib/plain-animator.js';
//<script src="https://cdn.jsdelivr.net/npm/three-plain-animator@1.1.2/lib/plain-animator.min.js"></script>

const DEFAULT_MASS = 10;
class RigidBody{
  constructor(){
  }
    createBox(mass, pos, quat, size){
      this.transform_ = new Ammo.btTransform();
      this.transform_.setIdentity();
      this.transform_.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
      this.transform_.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
      
      const btSize = new Ammo.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5);
      this.shape_ = new Ammo.btBoxShape(btSize);
      this.shape_.setMargin(0.05);
      this.ineritia_ = new Ammo.btVector3(0, 0, 0);
      if(mass >0){
        this.shape_.calculateLocalInertia(mass, this.ineritia_);
      }
      this.info_ = new Ammo.btRigidBodyConstructionInfo(
        mass, this.motionState_, this.shape_, this.ineritia_);
      this.body_ = new Ammo.btRigidBody(this.info_);  
      Ammo.destroy(btSize);
    
    
  }
}
class BasicWorldDemo {
  constructor() {
  }

  initialize(){
    this.collisionConfiguration_ = new Ammo.btDefaultCollisionConfiguration();
    this.dispatcher_ = new Ammo.btCollisionDispatcher(this.collisionConfiguration_);    
    this.broadphase_ = new Ammo.btDbvtBroadphase();
    this.solver_ = new Ammo.btSequentialImpulseConstraintSolver();

    this.physicsWorld_ = new Ammo.btDiscreteDynamicsWorld( 
      this.dispatcher_, this.broadphase_, this.solver_, this.collisionConfiguration_);
      this.physicsWorld_.setGravity(new Ammo.btVector3(0, -10, 0));
    
// Create a Three.js scene
const scene = new THREE.Scene();

// Create a Three.js renderer

this._threejs = new THREE.WebGLRenderer({
  antialias: true,
  });
this._threejs.shadowMap.enabled = true;
this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
this._threejs.setPixelRatio(window.devicePixelRatio);
this._threejs.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(this._threejs.domElement);

    window.addEventListener('resize', () => {
      this._OnWindowResize();
    }, false);

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(75, 20, 0);

    this._scene = new THREE.Scene();

    let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(20, 100, 10);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    this._scene.add(light);

    light = new THREE.AmbientLight(0x101010);
    this._scene.add(light);

    const controls = new OrbitControls(this._camera, this._threejs.domElement);
    controls.target.set(0, 20, 0);
    controls.update();

    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        './resources/posx.jpg',
        './resources/negx.jpg',
        './resources/posy.jpg',
        './resources/negy.jpg',
        './resources/posz.jpg',
        './resources/negz.jpg',
    ]);
    this._scene.background = texture;

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100, 10, 10),
        new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
          }));
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    this._scene.add(plane);

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshStandardMaterial({
          color: 0xFFFFFF,
      }));
    box.position.set(0, 1, 0);
    box.castShadow = true;
    box.receiveShadow = true;
    this._scene.add(box);

    for (let x = -8; x < 8; x++) {
      for (let y = -8; y < 8; y++) {
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(2, 2, 2),
          new THREE.MeshStandardMaterial({
              color: 0x808080,
          }));
        box.position.set(Math.random() + x * 5, Math.random() * 4.0 + 2.0, Math.random() + y * 5);
        box.castShadow = true;
        box.receiveShadow = true;
        this._scene.add(box);
      }
    }

    // const box = new THREE.Mesh(
    //   new THREE.SphereGeometry(2, 32, 32),
    //   new THREE.MeshStandardMaterial({
    //       color: 0xFFFFFF,
    //       wireframe: true,
    //       wireframeLinewidth: 4,
    //   }));
    // box.position.set(0, 0, 0);
    // box.castShadow = true;
    // box.receiveShadow = true;
    // this._scene.add(box);

    this._RAF();
  }

  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  _RAF() {
    requestAnimationFrame(() => {
      this._threejs.render(this._scene, this._camera);
      this._RAF();
    });
  }

  
  step_(timeElapsed){
    const timeElapsedS = timeElapsed * 0.001;
    this.physicsWorld_.stepSimulation(timeElapsedS, 10);
  }
}


let APP_ = null;

window.addEventListener('DOMContentLoaded', async () => {
  Ammo().then((lib) => {
    Ammo2 = lib;
    APP_ = new BasicWorldDemo();
    APP_.initialize();
  }
  )
  }

)





