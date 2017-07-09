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

  var geometry = new THREE.BoxGeometry(1,1,1);
  var material = new THREE.MeshPhongMaterial({color: 0x00ffff});
  var box = new THREE.Mesh(geometry, material);
  box.position.z = -5;
  scene.add(box);

  var light = new THREE.DirectionalLight(0xffffff);
  scene.add(light);
  light.position.set(1,1,1);
  onWindowResize();

  var cnt = 0;
  var update = function(){
    requestAnimationFrame(update);
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;
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
