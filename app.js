// Variable global
let scene,
    camera,
    renderer,
    controls,
    clock = new THREE.Clock(),
    loader,
    animation,
    light,
    neck3,
    neck4,
    neck5,
    head,
    idle

// Fonction contenant les initialisations
let init = () => {
    const canvas = document.querySelector('#dragon');

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 15000);
    camera.position.set(1800, -900, 1000);

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
    controls.maxDistance = 2800;

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

        let model = object.scene;
        model.traverse(o => {
            if (o.isBone) {
                console.log(o.name);
            }
            // Reference the neck and waist bones
            if (o.isBone && o.name === 'Bip01_Neck3_0140') {
                neck3 = o;
            }
            if (o.isBone && o.name === 'Bip01_Neck4_0141') {
                neck4 = o;
            }
            if (o.isBone && o.name === 'Bip01_Neck5_0142') {
                neck5 = o;
            }
            if (o.isBone && o.name === 'Bip01_Head_0143') {
                head = o;
            }
        });
        model.position.set(0, -1000, 0)
        scene.add(model);

        animation = new THREE.AnimationMixer(model);

        let action = THREE.AnimationClip.findByName(object.animations, "CINEMA_4D_Main");
        console.log(action);
        // Add these:
        action.tracks.splice(181, 10);
        idle = animation.clipAction(action);
        idle.play();
    });

    // Config light
    light = new THREE.AmbientLight(0xffffff, 2);
    scene.add(light);
}

let animate = () => {

    let delta = clock.getDelta()
    if (animation) animation.update(delta);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

document.addEventListener('mousemove', function (e) {
    var mousecoords = getMousePos(e);
    if (neck3 && neck4 && head && neck5) {
        moveJoint(mousecoords, neck3, 10);
        moveJoint(mousecoords, neck4, 10);
        moveJoint(mousecoords, neck5, -10);
        moveJoint(mousecoords, head, -20);
    }
});

function getMousePos(e) {
    return {
        x: e.clientX,
        y: e.clientY
    };
}

function moveJoint(mouse, joint, degreeLimit) {
    let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
    joint.rotation.y = THREE.Math.degToRad(degrees.x);
    joint.rotation.x = THREE.Math.degToRad(degrees.y);
}

function getMouseDegrees(x, y, degreeLimit) {
    let dx = 0,
        dy = 0,
        xdiff,
        xPercentage,
        ydiff,
        yPercentage;

    let w = {
        x: window.innerWidth,
        y: window.innerHeight
    };

    // Left (Rotates neck left between 0 and -degreeLimit)

    // 1. If cursor is in the left half of screen
    if (x <= w.x / 2) {
        // 2. Get the difference between middle of screen and cursor position
        xdiff = w.x / 2 - x;
        // 3. Find the percentage of that difference (percentage toward edge of screen)
        xPercentage = (xdiff / (w.x / 2)) * 100;
        // 4. Convert that to a percentage of the maximum rotation we allow for the neck
        dx = ((degreeLimit * xPercentage) / 100) * -1;
    }
    // Right (Rotates neck right between 0 and degreeLimit)
    if (x >= w.x / 2) {
        xdiff = x - w.x / 2;
        xPercentage = (xdiff / (w.x / 2)) * 100;
        dx = (degreeLimit * xPercentage) / 100;
    }
    // Up (Rotates neck up between 0 and -degreeLimit)
    if (y <= w.y / 2) {
        ydiff = w.y / 2 - y;
        yPercentage = (ydiff / (w.y / 2)) * 100;
        // Note that I cut degreeLimit in half when she looks up
        dy = (((degreeLimit * 0.5) * yPercentage) / 100) * -1;
    }

    // Down (Rotates neck down between 0 and degreeLimit)
    if (y >= w.y / 2) {
        ydiff = y - w.y / 2;
        yPercentage = (ydiff / (w.y / 2)) * 100;
        dy = (degreeLimit * yPercentage) / 100;
    }
    return {
        x: dx,
        y: dy
    };
}

init();
animate();