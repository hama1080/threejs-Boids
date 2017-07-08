var init = function()
{
  renderer = new THREE.WebGLRenderer();
  const kInitialLength = 600;
  renderer.setSize(kInitialLength, kInitialLength);
  container = document.getElementById("container");
  container.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, 1.0, 1, 1000);

  var geometry = new THREE.BoxGeometry(1,1,1);
  var material = new THREE.MeshPhongMaterial({color: 0x00ffff});
  var box = new THREE.Mesh(geometry, material);
  box.position.z = -5;
  scene.add(box);

  var sphere_geometry = new THREE.SphereGeometry(0.1,32,32);
  var sphere = new THREE.Mesh(sphere_geometry, material);
  sphere.position.z = -5;
  scene.add(sphere);

  var light = new THREE.DirectionalLight(0xffffff);
  scene.add(light);
  light.position.set(1,1,1);

  var cnt = 0;
  var update = function(){
    requestAnimationFrame(update);
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;

    sphere.position.x = 1.0 * Math.cos(cnt / 180 * Math.PI);
    sphere.position.y = 1.0 * Math.sin(cnt / 180 * Math.PI);

    light.position.x = 1.0 * Math.cos(cnt*2 / 180 * Math.PI);
    light.position.y = 1.0 * Math.sin(cnt*2 / 180 * Math.PI);

    cnt++;
    renderer.render(scene,camera);
  }

  update();

}

window.addEventListener('DOMContentLoaded', init);
