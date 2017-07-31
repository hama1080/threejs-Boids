class Boids{
  constructor(){
    this.boids = [];

    const MaxPosition = new THREE.Vector3(10.0, 10.0, 5.0);
    const kNbBoids = 30;
    for(var i = 0; i != kNbBoids; i++)
    {
      this.boids[i] ={
        pos: new THREE.Vector3(Math.random() * MaxPosition.x, Math.random() * MaxPosition.y, Math.random() * MaxPosition.z),
        vel: new THREE.Vector3(0, 0, 0)
      }
    }
  }

  // rule0: a boid move to center of boids.
  BoidRule0(move_index)
  {
    var center = new THREE.Vector3(0);
    for(var i=0; i != this.boids.length; i++)
    {
      if(i != move_index)
        center.add(this.boids[i].pos);
    }
    center.divideScalar(this.boids.length - 1)

    // calculate offset using center position.
    const kDivisionNum = 100.0;
    center.sub(this.boids[move_index].pos);
    center.divideScalar(kDivisionNum);

    this.boids[move_index].vel.add(center);
  }

  // rule1: a boid keep the constant distance between the other boid.
  BoidRule1(move_index)
  {
    const kDistanceMin = 0.1;
    for(var i=0; i != this.boids.length; i++)
    {
      if(i != move_index)
      {
        var distance = this.boids[i].pos.distanceTo(this.boids[move_index].pos);
        if(distance < kDistanceMin)
        {
          var diff = new THREE.Vector3();
          diff.subVectors(this.boids[i].pos, this.boids[move_index].pos)
          this.boids[move_index].vel.sub(diff);
        }
      }
    }

  }

  // rule2: a boid keep his velocity to mean velocity of boids
  BoidRule2(move_index)
  {
    var mean_velocity = new THREE.Vector3(0);
    for(var i = 0; i != this.boids.length; i++)
    {
      if(i != move_index)
      {
        mean_velocity.add(this.boids[i].vel);
      }
    }
    const kDivisionNum = 10.0;
    mean_velocity.divideScalar(this.boids.length - 1);
    var diff = new THREE.Vector3();
    diff.subVectors(mean_velocity, this.boids[move_index].vel);
    diff.divideScalar(kDivisionNum);
    this.boids[move_index].vel.add(diff);
  }
}

var scene;
var scene_object = [];
var boids;

// rule0: a boid move to center of boids.
var BoidRule0 = function(boids, move_index)
{
  var center = new THREE.Vector3(0);
  for(var i=0; i != boids.length; i++)
  {
    if(i != move_index)
      center.add(boids[i].pos);
  }
  center.divideScalar(boids.length - 1)

  // calculate offset using center position.
  const kDivisionNum = 100.0;
  center.sub(boids[move_index].pos);
  center.divideScalar(kDivisionNum);

  boids[move_index].vel.add(center);
}

// rule1: a boid keep the constant distance between the other boid.
var BoidRule1 = function(boids, move_index)
{
  const kDistanceMin = 0.1;
  for(var i=0; i != boids.length; i++)
  {
    if(i != move_index)
    {
      var distance = boids[i].pos.distanceTo(boids[move_index].pos);
      if(distance < kDistanceMin)
      {
        var diff = new THREE.Vector3();
        diff.subVectors(boids[i].pos, boids[move_index].pos)
        boids[move_index].vel.sub(diff);
      }
    }
  }
}

// rule2: a boid keep his velocity to mean velocity of boids
var BoidRule2 = function(boids, move_index)
{
  var mean_velocity = new THREE.Vector3(0);
  for(var i = 0; i != boids.length; i++)
  {
    if(i != move_index)
    {
      mean_velocity.add(boids[i].vel);
    }
  }
  const kDivisionNum = 10.0;
  mean_velocity.divideScalar(boids.length - 1);
  var diff = new THREE.Vector3();
  diff.subVectors(mean_velocity, boids[move_index].vel);
  diff.divideScalar(kDivisionNum);
  boids[move_index].vel.add(diff);
}

var InitializeBoids = function(MaxPosition)
{
  const kNbBoids = 30;
  boids = [];
  for(var i = 0; i != kNbBoids; i++)
  {
    boids[i] ={
      pos: new THREE.Vector3(Math.random() * MaxPosition.x, Math.random() * MaxPosition.y, Math.random() * MaxPosition.z),
      vel: new THREE.Vector3(0, 0, 0)
    }
  }
}

var MoveObjects = function(boids, kMaxPosition)
{
  for(var i = 0; i != boids.length; i++)
  {
    BoidRule0(boids, i);
    BoidRule1(boids, i);
    BoidRule2(boids, i);

    //Limit speed
    var boid = boids[i];
    var speed = boid.vel.length();
    const kMaxSpeed = 0.5;
    if(speed > kMaxSpeed)
    {
        var r = kMaxSpeed / speed;
        boid.vel.multiplyScalar(r);
    }
    // Inverse velocity when out of screen.
    if( (boids[i].pos.x < 0 && boids[i].vel.x < 0) || (boids[i].pos.x > kMaxPosition.x && boids[i].vel.x > 0))
      boids[i].vel.x *= -1;
    if( (boids[i].pos.y < 0 && boids[i].vel.y < 0) || (boids[i].pos.y > kMaxPosition.y && boids[i].vel.y > 0))
      boids[i].vel.y *= -1;
    if( (boids[i].pos.z < 0 && boids[i].vel.z < 0) || (boids[i].pos.z > kMaxPosition.z && boids[i].vel.z > 0))
      boids[i].vel.z *= -1;

    boids[i].pos.add(boids[i].vel);
  }
}

var CreateSphere = function(radius, position, color = {color: 0xffff00})
{
  var geometry = new THREE.SphereGeometry(radius);
  var material = new THREE.MeshPhongMaterial(color);
  var sphere = new THREE.Mesh(geometry, material);
  sphere.position = position;
  return sphere;
}

var CreateBox = function(x, y, z, position, color = {color: 0xffff00})
{
  var geometry = new THREE.BoxGeometry(x, y, z);
  var material = new THREE.MeshPhongMaterial(color);
  var box = new THREE.Mesh(geometry, material);
  box.position = position;
  return box;
}

var init = function()
{
  var boids_inst = new Boids();
  const kMaxPosition = new THREE.Vector3(10.0, 10.0, 5.0);

  renderer = new THREE.WebGLRenderer();

  var size = getWindowSize();
  container.style.cssText = "width: " + size.width +"px; height: " + size.height + "px;";
  renderer.setSize(size.width, size.height);
  container = document.getElementById("container");
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, 1.0, 1, 1000);
  camera.position.set(kMaxPosition.x / 2.0, kMaxPosition.y / 2.0, 15);

  var light = new THREE.DirectionalLight(0xffffff);
  scene.add(light);
  light.position.set(1,1,1);

  InitializeBoids(kMaxPosition);
  for(var i = 0; i != boids.length; i++)
  {
    var r = Math.floor(Math.random()*255);
    var g = Math.floor(Math.random()*255);
    var b = Math.floor(Math.random()*255);
    var rgb = "rgb(" + r + ", " + g + ", " + b + ")";
    var sphere = CreateSphere(0.1, boids[i].pos, {color: rgb});
    //var sphere = CreateSphere(0.1, boids[i].pos, {color: 0x00ffff});
    scene_object.push(sphere);
    scene.add(sphere);
  }
  onWindowResize();

  //simulation loop
  var update = function(){
    requestAnimationFrame(update);
    MoveObjects(boids, kMaxPosition);
    for(var i = 0; i != boids.length; i++)
    {
      scene_object[i].position.x = boids[i].pos.x;
      scene_object[i].position.y = boids[i].pos.y;
      scene_object[i].position.z = boids[i].pos.z;
    }
    renderer.render(scene,camera);
  }
  update();
}

// full screen: reference: http://www.inazumatv.com/contents/archives/8484
getWindowSize = function () {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    };
};

onWindowResize = function()
{
  var size = getWindowSize();
  container.style.cssText = "width: " + size.width +"px; height: " + size.height + "px;";
  renderer.setSize(size.width, size.height);

  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
}

onWindowClick = function()
{
  var sphere = CreateSphere(0.1);
  scene_object.push(sphere);
  scene.add(sphere);
  boids.push({pos: new THREE.Vector3(0, 0, 0), vel: new THREE.Vector3(0, 0, 0)});
}

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', onWindowResize);
window.addEventListener('click', onWindowClick);
