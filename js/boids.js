var scene_object = [];

var CreateSphere = function(radius)
{
  var geometry = new THREE.SphereGeometry(radius);
  var material = new THREE.MeshPhongMaterial({color: 0x00ffff});
  var sphere = new THREE.Mesh(geometry, material);
  sphere.position.z = -5;
  return sphere;
}

var CreateBox = function(x, y, z)
{
  var geometry = new THREE.BoxGeometry(x, y, z);
  var material = new THREE.MeshPhongMaterial({color: 0x00ffff});
  var box = new THREE.Mesh(geometry, material);
  box.position.z = -5;
  return box;
}

var UpdateObjectPosition = function()
{
  for(var i=0; i != scene_object.length; i++)
  {
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

  var scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, 1.0, 1, 1000);

  scene_object.push(CreateBox(1, 1, 2));
  scene_object.push(CreateSphere(0.1));

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
}

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', onWindowResize);
window.addEventListener('click', onWindowClick);
