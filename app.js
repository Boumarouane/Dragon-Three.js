// Variable global
let scene,
    camera,
    renderer,
    controls,
    clock = new THREE.Clock(),
    loader,
    animation,
    light

// Fonction contenant les initialisations
let init = () => {
    const canvas = document.querySelector('#dragon');

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 30000);
    camera.position.set(2500, -400, -1000);

    renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', renderer);
    controls.minDistance = 2000;
    controls.maxDistance = 2500;

    let materialArray = [];
    let texture_ft = new THREE.TextureLoader().load('paze_ft.jpg');
    let texture_bk = new THREE.TextureLoader().load('paze_bk.jpg');
    let texture_up = new THREE.TextureLoader().load('paze_up.jpg');
    let texture_dn = new THREE.TextureLoader().load('paze_dn.jpg');
    let texture_rt = new THREE.TextureLoader().load('paze_rt.jpg');
    let texture_lf = new THREE.TextureLoader().load('paze_lf.jpg');

    materialArray.push(new THREE.MeshBasicMaterial({
        map: texture_ft
    }));
    materialArray.push(new THREE.MeshBasicMaterial({
        map: texture_bk
    }));
    materialArray.push(new THREE.MeshBasicMaterial({
        map: texture_up
    }));
    materialArray.push(new THREE.MeshBasicMaterial({
        map: texture_dn
    }));
    materialArray.push(new THREE.MeshBasicMaterial({
        map: texture_rt
    }));
    materialArray.push(new THREE.MeshBasicMaterial({
        map: texture_lf
    }));

    for (let i = 0; i < 6; i++)
        materialArray[i].side = THREE.BackSide;
    let skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
    let skybox = new THREE.Mesh(skyboxGeo, materialArray);
    scene.add(skybox);

    // Config loader
    loader = new THREE.GLTFLoader();
    loader.load('./bless_wb/scene.gltf', function (object) {

        animation = new THREE.AnimationMixer(object.scene);

        let action = animation.clipAction(object.animations[0]);
        action.play();
        object.scene.position.set(0, -1000, 0)
        scene.add(object.scene);
    });

    // Config light
    light = new THREE.AmbientLight(0xffffff, 3);
    scene.add(light);

}

let animate = () => {

    let delta = clock.getDelta()
    if (animation) animation.update(delta);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

init();
animate();