var scene;
var scene_object = [];

var BoidRule0 = function(boids, move_index)
{

}

var BoidRule1 = function(boids, move_index)
{

}

var BoidRule2 = function(boids, move_index)
{

}

var InitializeBoids = function(kScreenWidth, kScreenHeight)
{
  const kNbBoids = 10;
  var boids = [];
  for(var i = 0; i != kNbBoids; i++)
  {
    boids[i] ={
      x: Math.random() * kScreenWidth,
      y: Math.random() * kScreenHeight,
      vx: 0,
      vy: 0
    }
  }
  return boids;
}

var MoveObjects = function(boids, kScreenWidth, kScreenHeight)
{
  for(var i = 0; i != boids.length; i++)
  {
    BoidRule0(boids, i);
    BoidRule1(boids, i);
    BoidRule2(boids, i);

    // Inverse velocity when out of screen.
    if( (boids[i].x < 0 && boids[i].vx < 0) || (boids[i].x > kScreenWidth && boids[i].vx > 0))
      boids[i].vx *= -1;
    if( (boids[i].y < 0 && boids[i].vy < 0) || (boids[i].y > kScreenHeight && boids[i].vy > 0))
      boids[i].vy *= -1;

    boids[i].x += boids[i].vx;
    boids[i].y += boids[i].vy;
  }
}

var CreateSphere = function(radius, color = {color: 0xffff00})
{
  var geometry = new THREE.SphereGeometry(radius);
  var material = new THREE.MeshPhongMaterial(color);
  var sphere = new THREE.Mesh(geometry, material);
  sphere.position.z = -5;
  return sphere;
}

var CreateBox = function(x, y, z, color = {color: 0xffff00})
{
  var geometry = new THREE.BoxGeometry(x, y, z);
  var material = new THREE.MeshPhongMaterial(color);
  var box = new THREE.Mesh(geometry, material);
  box.position.z = -5;
  return box;
}

var UpdateObjectPosition = function()
{
  for(var i=0; i != scene_object.length; i++)
  {
    scene_object[i].position.x += 0.01;
    scene_object[i].rotation.x += 0.01;
  }
}

var init = function()
{
  renderer = new THREE.WebGLRenderer();

  var size = getWindowSize();
  container.style.cssText = "width: " + size.width +"px; height: " + size.height + "px;";
  renderer.setSize(size.width, size.height);
  container = document.getElementById("container");
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, 1.0, 1, 1000);

  scene_object.push(CreateBox(1, 1, 2, {color: 0x00ffff}));
  scene_object.push(CreateSphere(0.1, {color: 0x00ffff}));

for(var i = 0; i != scene_object.length;  i++)
{
  scene.add(scene_object[i]);
}

  var light = new THREE.DirectionalLight(0xffffff);
  scene.add(light);
  light.position.set(1,1,1);
  onWindowResize();

  var cnt = 0;
  var update = function(){
    requestAnimationFrame(update);

    UpdateObjectPosition();
    cnt++;
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
  console.log("click");
  var sphere = CreateSphere(0.1);
  scene_object.push(sphere);
  scene.add(sphere);
}

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', onWindowResize);
window.addEventListener('click', onWindowClick);
