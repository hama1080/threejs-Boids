var scene;
var scene_object = [];
var boids;

// rule0: a boid move to center of boids.
var BoidRule0 = function(boids, move_index)
{
  var center = {x: 0, y: 0};
  for(var i=0; i != boids.length; i++)
  {
    if(i != move_index)
    {
      center.x += boids[i].pos.x;
      center.y += boids[i].pos.y;
    }
  }
  center.x /= boids.length - 1;
  center.y /= boids.length - 1;

  const kDivisionNum = 100.0;
  boids[move_index].vel.x += (center.x - boids[move_index].pos.x) / kDivisionNum;
  boids[move_index].vel.y += (center.y - boids[move_index].pos.y) / kDivisionNum;
}

var BoidRule1 = function(boids, move_index)
{
  for(var i=0; i != boids.length; i++)
  {
    if(i != move_index)
    {
    }
  }
}

var BoidRule2 = function(boids, move_index)
{

}

var InitializeBoids = function(kMaxPositionX, kMaxPositionY)
{
  const kNbBoids = 10;
  var boids = [];
  for(var i = 0; i != kNbBoids; i++)
  {
    boids[i] ={
      pos: new THREE.Vector3(Math.random() * kMaxPositionX, Math.random() * kMaxPositionY, 0),
      vel: new THREE.Vector3(0, 0, 0)
    }
  }
  return boids;
}

var MoveObjects = function(boids, kMaxPositionX, kMaxPositionY)
{
  for(var i = 0; i != boids.length; i++)
  {
    BoidRule0(boids, i);
    BoidRule1(boids, i);
    BoidRule2(boids, i);

    // Inverse velocity when out of screen.
    if( (boids[i].pos.x < 0 && boids[i].vel.x < 0) || (boids[i].pos.x > kMaxPositionX && boids[i].vel.x > 0))
      boids[i].vel.x *= -1;
    if( (boids[i].pos.y < 0 && boids[i].vel.y < 0) || (boids[i].pos.y > kMaxPositionY && boids[i].vel.y > 0))
      boids[i].vel.y *= -1;

    boids[i].pos.x += boids[i].vel.x;
    boids[i].pos.y += boids[i].vel.y;
  }
}

var CreateSphere = function(radius, position_x = 0, position_y = 0, color = {color: 0xffff00})
{
  var geometry = new THREE.SphereGeometry(radius);
  var material = new THREE.MeshPhongMaterial(color);
  var sphere = new THREE.Mesh(geometry, material);
  sphere.position.x = position_x;
  sphere.position.y = position_y;
  sphere.position.z = -5;
  return sphere;
}

var CreateBox = function(x, y, z, position_x = 0, position_y = 0, color = {color: 0xffff00})
{
  var geometry = new THREE.BoxGeometry(x, y, z);
  var material = new THREE.MeshPhongMaterial(color);
  var box = new THREE.Mesh(geometry, material);
  sphere.position.x = position_x;
  sphere.position.y = position_y;
  box.position.z = -5;
  return box;
}

var init = function()
{
  const kMaxPositionX = 10.0;
  const kMaxPositionY = 10.0;

  renderer = new THREE.WebGLRenderer();

  var size = getWindowSize();
  container.style.cssText = "width: " + size.width +"px; height: " + size.height + "px;";
  renderer.setSize(size.width, size.height);
  container = document.getElementById("container");
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, 1.0, 1, 1000);
  camera.position.set(kMaxPositionX / 2.0, kMaxPositionY / 2.0, 10);

  var light = new THREE.DirectionalLight(0xffffff);
  scene.add(light);
  light.position.set(1,1,1);

  boids = InitializeBoids(kMaxPositionX, kMaxPositionY);
  for(var i = 0; i != boids.length; i++)
  {
    var sphere = CreateSphere(0.1, boids[i].pos.x, boids[i].pos.y, {color: 0x00ffff});
    scene_object.push(sphere);
    scene.add(sphere);
  }
  onWindowResize();

  var update = function(){
    requestAnimationFrame(update);

    MoveObjects(boids, kMaxPositionX, kMaxPositionY);
    for(var i = 0; i != boids.length; i++)
    {
      scene_object[i].position.x = boids[i].pos.x;
      scene_object[i].position.y = boids[i].pos.y;
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
