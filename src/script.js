import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import "@melloware/coloris/dist/coloris.css";
import Coloris from "@melloware/coloris";


/**
 * Base
 */


// Canvas
const canvas_wrapper = document.querySelector('div.panel-canvas')
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const matcaps_panel = document.getElementById("matcaps-panel");

// Create a MatCap material array outside of the loop
const Loaded_Matcaps = [];

for (let i = 0; i <= 642; i++) {
    // Create a MatCap element
    const matcap = document.createElement("div");
    matcap.id = `matcap-${i}`;
    matcap.classList.add("panel-texture_matcaps-matcap");
    matcap.style.background = `url("textures/matcaps/${i}.png")`;
    matcap.style.backgroundSize = "cover";
    matcaps_panel.appendChild(matcap);

    // Load the MatCap texture and add it to the array
    const Loaded_Matcap = textureLoader.load(`./textures/matcaps/${i}.png`);
    Loaded_Matcaps.push(Loaded_Matcap);

    // Add an event listener to the MatCap element to apply the material to selected meshes
    matcap.addEventListener("click", () => {
        for (const mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.material.matcap = Loaded_Matcap;
                mesh.material.needsUpdate = true
                console.log("applied")
            }
        }
    });
}





/**
 *  CORE
 */


/// Create New Mesh

const Shapes_Selector = document.getElementById("shapes");
const Materials_Selector = document.getElementById("materials");
const Create_Mesh = document.getElementById("generator");

const Shapes_Panel = document.getElementById("shapes_panel");

const scene_meshes = [];
let Selected_Meshes = [];       /// keep like this so that you can modify it with the select_shape function

let geometry, material, light;

Shapes_Selector.value = 1;
Materials_Selector.value = 1;

function addMesh() {
    switch (true) {
        case Shapes_Selector.value == "1":
            geometry = new THREE.BoxGeometry(1, 1, 1)
            break;
        case Shapes_Selector.value == "2":
            geometry = new THREE.PlaneGeometry(1, 1)
            break;
        case Shapes_Selector.value == "3":
            geometry = new THREE.CircleGeometry(1)
            break;
        case Shapes_Selector.value == "4":
            geometry = new THREE.SphereGeometry(1, 32, 16)
            break;
        case Shapes_Selector.value == "5":
            geometry = new THREE.CylinderGeometry(1, 1, 2, 32)
            break;
        case Shapes_Selector.value == "6":
            geometry = new THREE.CapsuleGeometry(1, 1, 16, 32)
            break;
        case Shapes_Selector.value == "7":
            geometry = new THREE.RingGeometry(1, 2, 32, 16)
            break;
        case Shapes_Selector.value == "8":
            geometry = new THREE.TorusGeometry(1, 0.5, 32, 100)
            break;
        case Shapes_Selector.value == "9":
            geometry = new THREE.OctahedronGeometry(1, 1)
            break;
        case Shapes_Selector.value == "10":
            geometry = new THREE.ConeGeometry(1, 1, 8)
            break;
        case Shapes_Selector.value == "11":
            geometry = new THREE.OctahedronGeometry(1, 2)
            break;
        case Shapes_Selector.value == "12":
            light = new THREE.AmbientLight(0x404040);
            break;
        case Shapes_Selector.value == "13":
            light = new THREE.DirectionalLight(0xffffff);
            break;
        case Shapes_Selector.value == "14":
            light = new THREE.HemisphereLight(0xffffff, 0xffffff);
            break;
        case Shapes_Selector.value == "15":
            light = new THREE.PointLight(0xffffff);
            break;
        case Shapes_Selector.value == "16":
            light = new THREE.RectAreaLight(0xffffff);
            break;
        case Shapes_Selector.value == "17":
            light = new THREE.SpotLight(0xffffff);
            break;
        default:
            geometry = new THREE.BoxGeometry(1, 1, 1)
    }

    switch (true) {
        case Materials_Selector.value == "1":
            material = new THREE.MeshBasicMaterial()
            break;
        case Materials_Selector.value == "2":
            material = new THREE.MeshStandardMaterial()
            break;
        case Materials_Selector.value == "3":
            material = new THREE.MeshPhysicalMaterial()
            break;
        case Materials_Selector.value == "4":
            material = new THREE.MeshDepthMaterial()
            break;
        case Materials_Selector.value == "5":
            material = new THREE.MeshLambertMaterial()
            break;
        case Materials_Selector.value == "6":
            material = new THREE.MeshMatcapMaterial()
            break;
        case Materials_Selector.value == "7":
            material = new THREE.MeshNormalMaterial()
            break;
        case Materials_Selector.value == "8":
            material = new THREE.MeshPhongMaterial()
            break;
        case Materials_Selector.value == "9":
            material = new THREE.MeshToonMaterial()
            break;
        default:
            material = new THREE.MeshBasicMaterial({ color: '#ffaaaa' })
    }

    if (+Shapes_Selector.value <= 11) {
        const Mesh = new THREE.Mesh(geometry, material)
        scene_meshes.push(Mesh)
        Selected_Meshes.push(Mesh)
        Add_Gui(scene_meshes.indexOf(Mesh));
        Connect_Gui()
        Select_Mesh()
        checkbox_the_meshes()
        slider_the_meshes()
    } else {
        scene_meshes.push(light)
        Selected_Meshes.push(light)
        Add_Gui(scene_meshes.indexOf(light))
        Connect_Gui()
        Select_Mesh()
    }

    for (let mesh of scene_meshes) {
        if (mesh !== null) {
            scene.add(mesh)
        }
    }

    console.log(scene_meshes)
}






let shape = null;
function Add_Gui(index) {
    shape = document.createElement("div") /// might have to get this outside the function scope
    shape.classList.add('panel-geometry_shapes-container')
    shape.id = `mesh-${index}`
    shape.innerHTML = `<button id="shape-${index}" style="background-color: var(--selected);" class="panel-geometry_shapes-button" onclick="toggleShape(${index})">Shape #${index} </button>
                        <div id="panel-${index}" class="panel-geometry_shapes-panel">

                        <!-- Position Coordinates -->
                        <button class="panel-geometry_shapes-panel-dropdown" onclick="toggleSliders(${index}, 'position')">Position</button>
                        <div id="panel-${index}-position" class="panel-geometry_shapes-panel-sliders">
                            <div class="panel-geometry_shapes-panel-sliders-container">
                                <div class="panel-geometry_shapes-panel-sliders-slider">
                                    <label>x: </label>
                                    <div class="slider">
                                        <input id="slider-${index}-position-x"
                                            class="input_slider"
                                            min="-10" 
                                            max="10" 
                                            step="0.01" 
                                            type="range">
                                        <input type="text" value="0" id="slider-${index}-position-x-value">
                                    </div>
                                </div>
                                <div class="panel-geometry_shapes-panel-sliders-slider">
                                    <label>y: </label>
                                    <div class="slider">
                                            <input id="slider-${index}-position-y"
                                                class="input_slider"
                                            min="-10" 
                                            max="10" 
                                            step="0.01" 
                                            type="range">
                                        <input type="text" value="0" id="slider-${index}-position-y-value">
                                    </div>
                                </div>
                                <div class="panel-geometry_shapes-panel-sliders-slider">
                                    <label>z: </label>
                                    <div class="slider">
                                            <input id="slider-${index}-position-z"
                                                class="input_slider"
                                            min="-10" 
                                            max="10" 
                                            step="0.01" 
                                            type="range">
                                        <input type="text" value="0" id="slider-${index}-position-z-value">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Scale Coordinates -->
                        <button class="panel-geometry_shapes-panel-dropdown" onclick="toggleSliders(${index}, 'scale')">Scale</button>
                        <div id="panel-${index}-scale" class="panel-geometry_shapes-panel-sliders">
                            <div class="panel-geometry_shapes-panel-sliders-container">
                                <div class="panel-geometry_shapes-panel-sliders-slider">
                                    <label>x: </label>
                                    <div class="slider">
                                        <input id="slider-${index}-scale-x"
                                            class="input_slider"
                                            min="0" 
                                            max="20" 
                                            step="0.1"
                                            value="1" 
                                            type="range">
                                        <input type="text" value="1" id="slider-${index}-scale-x-value">
                                    </div>
                                </div>
                                <div class="panel-geometry_shapes-panel-sliders-slider">
                                    <label>y: </label>
                                    <div class="slider">
                                            <input id="slider-${index}-scale-y"
                                                class="input_slider"
                                            min="0" 
                                            max="20" 
                                            step="0.1"
                                            value="1" 
                                            type="range">
                                        <input type="text" value="1" id="slider-${index}-scale-y-value">
                                    </div>
                                </div>
                                <div class="panel-geometry_shapes-panel-sliders-slider">
                                    <label>z: </label>
                                    <div class="slider">
                                            <input id="slider-${index}-scale-z"
                                                class="input_slider"
                                            min="0" 
                                            max="20" 
                                            step="0.1"
                                            value="1" 
                                            type="range">
                                        <input type="text" value="1" id="slider-${index}-scale-z-value" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Rotation Coordinates -->
                        <button  class="panel-geometry_shapes-panel-dropdown" onclick="toggleSliders(${index}, 'rotation')">Rotation</button>
                        <div id="panel-${index}-rotation" class="panel-geometry_shapes-panel-sliders">
                            <div class="panel-geometry_shapes-panel-sliders-container">
                                <div class="panel-geometry_shapes-panel-sliders-slider">
                                    <label>x: </label>
                                    <div class="slider">
                                        <input id="slider-${index}-rotation-x"
                                            class="input_slider"
                                            min="-3.14159265359" 
                                            max="3.14159265359" 
                                            step="0.19634954084"
                                            value="0" 
                                            type="range">
                                        <input type="text" value="0" id="slider-${index}-rotation-x-value">
                                    </div>
                                </div>
                                <div class="panel-geometry_shapes-panel-sliders-slider">
                                    <label>y: </label>
                                    <div class="slider">
                                            <input id="slider-${index}-rotation-y"
                                                class="input_slider"
                                            min="-3.14159265359" 
                                            max="3.14159265359" 
                                            step="0.19634954084"
                                            value="0" 
                                            type="range">
                                        <input type="text" value="0" id="slider-${index}-rotation-y-value">
                                    </div>
                                </div>
                                <div class="panel-geometry_shapes-panel-sliders-slider">
                                    <label>z: </label>
                                    <div class="slider">
                                            <input id="slider-${index}-rotation-z"
                                                class="input_slider"
                                            min="-3.14159265359" 
                                            max="3.14159265359" 
                                            step="0.19634954084"
                                            value="0" 
                                            type="range">
                                        <input type="text" value="0" id="slider-${index}-rotation-z-value">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
    Shapes_Panel.appendChild(shape)

}

function Connect_Gui() {

    for (let i = 0; i < scene_meshes.length; i++) {

        /// I'd be lying if I told you I know why this works with more than one shape;
        /// I now believe in miracles

        if (scene_meshes[i] !== null) {


            /// position
            const slider_position_x = document.getElementById(`slider-${i}-position-x`);
            const slider_position_y = document.getElementById(`slider-${i}-position-y`);
            const slider_position_z = document.getElementById(`slider-${i}-position-z`);

            const slider_position_value_x = document.getElementById(`slider-${i}-position-x-value`);
            const slider_position_value_y = document.getElementById(`slider-${i}-position-y-value`);
            const slider_position_value_z = document.getElementById(`slider-${i}-position-z-value`);

            slider_position_x.oninput = () => {
                scene_meshes[i].position.x = slider_position_x.value
                slider_position_value_x.value = slider_position_x.value
            }
            slider_position_y.oninput = () => {
                scene_meshes[i].position.y = slider_position_y.value
                slider_position_value_y.value = slider_position_y.value
            }
            slider_position_z.oninput = () => {
                scene_meshes[i].position.z = slider_position_z.value
                slider_position_value_z.value = slider_position_z.value
            }

            slider_position_value_x.oninput = () => {
                scene_meshes[i].position.x = slider_position_value_x.value
                slider_position_x.value = slider_position_value_x.value
            }
            slider_position_value_y.oninput = () => {
                scene_meshes[i].position.y = slider_position_value_y.value
                slider_position_y.value = slider_position_value_y.value
            }
            slider_position_value_z.oninput = () => {
                scene_meshes[i].position.z = slider_position_value_z.value
                slider_position_z.value = slider_position_value_z.value
            }



            /// scale
            const slider_scale_x = document.getElementById(`slider-${i}-scale-x`);
            const slider_scale_y = document.getElementById(`slider-${i}-scale-y`);
            const slider_scale_z = document.getElementById(`slider-${i}-scale-z`);

            const slider_scale_value_x = document.getElementById(`slider-${i}-scale-x-value`);
            const slider_scale_value_y = document.getElementById(`slider-${i}-scale-y-value`);
            const slider_scale_value_z = document.getElementById(`slider-${i}-scale-z-value`);

            slider_scale_x.oninput = () => {
                scene_meshes[i].scale.x = slider_scale_x.value
                slider_scale_value_x.value = slider_scale_x.value
            }
            slider_scale_y.oninput = () => {
                scene_meshes[i].scale.y = slider_scale_y.value
                slider_scale_value_y.value = slider_scale_y.value
            }
            slider_scale_z.oninput = () => {
                scene_meshes[i].scale.z = slider_scale_z.value
                slider_scale_value_z.value = slider_scale_z.value
            }

            slider_scale_value_x.oninput = () => {
                scene_meshes[i].scale.x = slider_scale_value_x.value
                slider_scale_x.value = slider_scale_value_z.value
            }
            slider_scale_value_y.oninput = () => {
                scene_meshes[i].scale.y = slider_scale_value_y.value
                slider_scale_y.value = slider_scale_value_z.value
            }
            slider_scale_value_z.oninput = () => {
                scene_meshes[i].scale.z = slider_scale_value_z.value
                slider_scale_z.value = slider_scale_value_z.value
            }

            /// rotation
            const slider_rotation_x = document.getElementById(`slider-${i}-rotation-x`);
            const slider_rotation_y = document.getElementById(`slider-${i}-rotation-y`);
            const slider_rotation_z = document.getElementById(`slider-${i}-rotation-z`);

            const slider_rotation_value_x = document.getElementById(`slider-${i}-rotation-x-value`);
            const slider_rotation_value_y = document.getElementById(`slider-${i}-rotation-y-value`);
            const slider_rotation_value_z = document.getElementById(`slider-${i}-rotation-z-value`);

            slider_rotation_x.oninput = () => {
                scene_meshes[i].rotation.x = slider_rotation_x.value
                slider_rotation_value_x.value = slider_rotation_x.value
            }
            slider_rotation_y.oninput = () => {
                scene_meshes[i].rotation.y = slider_rotation_y.value
                slider_rotation_value_y.value = slider_rotation_y.value
            }
            slider_rotation_z.oninput = () => {
                scene_meshes[i].rotation.z = slider_rotation_z.value
                slider_rotation_value_z.value = slider_rotation_z.value
            }

            slider_rotation_value_x.oninput = () => {
                scene_meshes[i].rotation.x = slider_rotation_value_x.value
                slider_rotation_x.value = slider_rotation_value_z.value
            }
            slider_rotation_value_y.oninput = () => {
                scene_meshes[i].rotation.y = slider_rotation_value_y.value
                slider_rotation_y.value = slider_rotation_value_z.value
            }
            slider_rotation_value_z.oninput = () => {
                scene_meshes[i].rotation.z = slider_rotation_value_z.value
                slider_rotation_z.value = slider_rotation_value_z.value
            }

        }

    }
}

function Select_Mesh() {
    const selectedMeshes = Array.from(Selected_Meshes); // Create a copy of the array

    scene_meshes.forEach((mesh, index) => {
        if (scene_meshes[index] !== null) {


            const shape = document.getElementById(`shape-${index}`);

            shape.addEventListener("click", () => {
                if (selectedMeshes.includes(mesh)) {
                    // selectedMeshes.splice(selectedMeshes.indexOf(mesh), 1);
                    selectedMeshes[index] = null;
                    shape.style.backgroundColor = "var(--selectable)";
                } else {
                    // selectedMeshes.push(mesh);
                    selectedMeshes[index] = mesh;
                    shape.style.backgroundColor = "var(--selected)";
                }

                // Update the original array
                Selected_Meshes = selectedMeshes;
            });
        }
    });
}

// Shape Specific Options

const rename_shapes = document.getElementById("rename-shapes")
const delete_shapes = document.getElementById("delete-shapes")

function Delete_Shapes() {
    let Selected_Meshes_copy = Selected_Meshes.slice();

    if (confirm("Are you sure you want to delete all those selected Shapes?")) {

        for (let [index, mesh] of Selected_Meshes_copy.entries()) {
            if (mesh) {
                const shape_gui = document.getElementById(`mesh-${index}`); // remove gui first
                shape_gui.remove();
                Selected_Meshes[index] = null
                Selected_Meshes_copy[index] = null
                // Selected_Meshes_copy.splice(index, 1)
                // Selected_Meshes.splice(index, 1)
                scene_meshes[index] = null
                scene.remove(mesh)
            }
        }
    }
}

function Rename_Shapes() {

    let Selected_Meshes_copy = Selected_Meshes.slice();

    for (let [index, mesh] of Selected_Meshes_copy.entries()) {
        if (mesh) {
            const shape_gui_button = document.getElementById(`shape-${index}`);
            shape_gui_button.innerHTML = rename_shapes.value;
        }
    }

}




Create_Mesh.addEventListener("click", addMesh)

delete_shapes.addEventListener("click", () => Delete_Shapes())

rename_shapes.addEventListener("input", () => Rename_Shapes())


/**
 * Sizes
 */
const sizes = {
    width: canvas_wrapper.clientWidth,
    height: canvas_wrapper.clientHeight,
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = canvas_wrapper.clientWidth;
    sizes.height = canvas_wrapper.clientHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.render(scene, camera)
})

/**
 * Camera
 */
// Base camera

let camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
const cameraOrtho = new THREE.OrthographicCamera(sizes.width / - 2, sizes.width / 2, sizes.height / 2, sizes.height / - 2, 1, 1000)
camera.position.set(2, 1, 2)
cameraOrtho.position.set(-3.32, 1.93, -4.88)

if(scene){
    scene.add(camera)
}


const radio_camera = document.getElementById("radio-camera");
radio_camera.addEventListener("input", () => {
    const data = new FormData(radio_camera);

    for (const entry of data) {
        switch (true) {
            case entry[1] == '0':
                scene.remove(camera)
                camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
                scene.add(camera)
                camera.position.set(2, 1, 2)
                controls = new OrbitControls(camera, canvas)
                controls.enableDamping = true
                break;
            case entry[1] == '1':
                scene.remove(camera)
                camera = new THREE.OrthographicCamera(sizes.width / - 2, sizes.width / 2, sizes.height / 2, sizes.height / - 2, -1000, 1000);
                scene.add(camera)
                camera.position.set(-3.32, 1.93, -4.88)
                camera.zoom = 24;
                camera.updateProjectionMatrix();
                controls = new OrbitControls(camera, canvas)
                controls.enableDamping = true
                break;
            default:
                console.log("default")
                break;
        }
    }
})


const x_view = document.getElementById("x-view")
const y_view = document.getElementById("y-view")
const z_view = document.getElementById("z-view")

x_view.addEventListener("click", () => {
    camera.position.set(5, 0, 0)
})

y_view.addEventListener("click", () => {
    camera.position.set(0, 5, 0)
})

z_view.addEventListener("click", () => {
    camera.position.set(0, 0, 5)
})


// Controls
let controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/// Core #2

/// Materials

/// color picker
Coloris.init();
Coloris({ el: "#coloris", alpha: false });

const color_picker = document.getElementById("coloris")
color_picker.value = "#ffffff"


Coloris({
    onChange: (color) => {
        document.documentElement.style.setProperty("--color-picked", color)
        if (Selected_Meshes) {
            for (let mesh of Selected_Meshes) {
                if (mesh !== null) {
                    if (mesh.isLight) {
                        mesh.color.set(new THREE.Color(color))
                    } else {
                        mesh.material.color.set(new THREE.Color(color))
                    }
                }
            }
        }
    }
})


/// radios

// Side

const radio_side = document.getElementById("radio-side");
radio_side.addEventListener("input", (e) => {
    const data = new FormData(radio_side);

    for (const entry of data) {
        if (Selected_Meshes) {
            for (let mesh of Selected_Meshes) {
                if (mesh !== null) {
                    switch (true) {
                        case entry[1] == 'frontside':
                            mesh.material.side = THREE.FrontSide
                            break;
                        case entry[1] == 'backside':
                            mesh.material.side = THREE.BackSide
                            break;
                        case entry[1] == 'doubleside':
                            mesh.material.side = THREE.DoubleSide
                            break;
                        default:
                            console.log("default")
                            break;
                    }
                }
            }
        }
    }
})


// blending

const radio_blending = document.getElementById("radio-blending");
radio_blending.addEventListener("input", () => {
    const data = new FormData(radio_blending);

    for (const entry of data) {
        if (Selected_Meshes) {
            for (let mesh of Selected_Meshes) {
                if (mesh !== null) {
                    switch (true) {
                        case entry[1] == '1':
                            mesh.material.blending = THREE.NormalBlending
                            break;
                        case entry[1] == '2':
                            mesh.material.blending = THREE.AdditiveBlending
                            break;
                        case entry[1] == '3':
                            mesh.material.blending = THREE.SubtractiveBlending
                            break;
                        case entry[1] == '4':
                            mesh.material.blending = THREE.MultiplyBlending
                            break;
                        default:
                            console.log("default")
                            break;
                    }
                }
            }
        }
    }
})

// precision

const radio_percision = document.getElementById("radio-percision");
radio_percision.addEventListener("input", () => {
    const data = new FormData(radio_percision);

    for (const entry of data) {
        if (Selected_Meshes) {
            for (let mesh of Selected_Meshes) {
                if (mesh !== null) {
                    switch (true) {
                        case entry[1] == '1':
                            mesh.material.precision = null
                            break;
                        case entry[1] == '2':
                            mesh.material.precision = 'lowp'
                            break;
                        case entry[1] == '3':
                            mesh.material.precision = 'mediump'
                            break;
                        case entry[1] == '4':
                            mesh.material.precision = 'highp'
                            break;
                        default:
                            console.log("default")
                            break;
                    }
                }
            }
        }
    }
})




// checkboxes

const Checkboxes = document.querySelectorAll(".checkbox")
for (let checkbox of Checkboxes) {
    checkbox.innerHTML = `<svg width="0.8vw" height="0.8vw" viewBox="0 0 16 16" fill="var(--primary)" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.5" y="0.5" width="16" height="16" rx="3.5" stroke="black" />
                            </svg>`
    checkbox.value = false

    checkbox.addEventListener("click", () => {
        if (!checkbox.value) {
            checkbox.innerHTML = `<svg width="0.8vw" height="0.8vw" viewBox="0 0 16 16" fill="var(--primary)" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.5" y="0.5" width="16" height="16" rx="3.5" stroke="black" />
                                <path class="checkmark"
                                d="M3.69669 12.0104C3.11091 11.4246 3.11091 10.4748 3.69669 9.88905L12.8891 0.696664C13.4749 0.110878 14.4246 0.110878 15.0104 0.696664C15.5962 1.28245 15.5962 2.2322 15.0104 2.81798L5.81802 12.0104C5.23223 12.5962 4.28248 12.5962 3.69669 12.0104Z"
                                fill="white" />
                                <path class="checkmark"
                                d="M1.01024 7.11108C1.62387 6.49745 2.61876 6.49745 3.23239 7.11108L5.64253 9.52121C6.25616 10.1348 6.25616 11.1297 5.64253 11.7434C5.0289 12.357 4.034 12.357 3.42037 11.7434L1.01024 9.33323C0.396611 8.7196 0.396611 7.72471 1.01024 7.11108Z"
                                fill="white" />
                                </svg>`;
            checkbox.value = true;
        } else {
            checkbox.innerHTML = `<svg width="0.8vw" height="0.8vw" viewBox="0 0 16 16" fill="var(--primary)" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.5" y="0.5" width="16" height="16" rx="3.5" stroke="black" />
                            </svg>`;
            checkbox.value = false;
        }
    })
}


const cb_wireframe = document.getElementById("cb-wireframe")
const cb_transparent = document.getElementById("cb-transparent")
const cb_visible = document.getElementById("cb-visible")
const cb_fog = document.getElementById("cb-fog")
const cb_alphahash = document.getElementById("cb-alphahash")
const cb_clipshadows = document.getElementById("cb-clipshadows")
const cb_depthtest = document.getElementById("cb-depthtest")
const cb_depthwrite = document.getElementById("cb-depthwrite")
const cb_permultialpha = document.getElementById("cb-premultialpha")
const cb_dithering = document.getElementById("cb-dithering")
const cb_shadowcast = document.getElementById("cb-shadowcast")
const cb_shadowreceive = document.getElementById("cb-shadowreceive")

function checkbox_the_meshes() {
    cb_wireframe.onclick = () => {
        for (const mesh of Selected_Meshes) {
            mesh.material.wireframe = cb_wireframe.value;
        }
    };
    cb_visible.onclick = () => {
        for (const mesh of Selected_Meshes) {
            mesh.material.visible = !cb_visible.value;
        }
    };
    cb_transparent.onclick = () => {
        for (const mesh of Selected_Meshes) {
            mesh.material.transparent = cb_transparent.value;
        }
    };
    cb_fog.onclick = () => {
        for (const mesh of Selected_Meshes) {
            mesh.material.fog = cb_fog.value;
        }
    };
    cb_alphahash.onclick = () => {
        for (const mesh of Selected_Meshes) {
            mesh.material.alphahash = cb_alphahash.value;
        }
    };
    cb_clipshadows.onclick = () => {
        for (const mesh of Selected_Meshes) {
            mesh.material.clipShadows = cb_clipshadows.value;
        }
    };
    cb_depthtest.onclick = () => {
        for (const mesh of Selected_Meshes) {
            mesh.material.depthTest = !cb_depthtest.value;
        }
    };
    cb_depthwrite.onclick = () => {
        for (const mesh of Selected_Meshes) {
            mesh.material.depthWrite = !cb_depthwrite.value;
        }
    };
    cb_permultialpha.onclick = () => {
        for (const mesh of Selected_Meshes) {
            mesh.material.premultipliedAlpha = cb_permultialpha.value;
        }
    };
    cb_dithering.onclick = () => {
        for (const mesh of Selected_Meshes) {
            mesh.material.dithering = cb_dithering.value;
        }
    };
    cb_shadowcast.onclick = () => {
        for (const mesh of Selected_Meshes) {
            mesh.castShadow = cb_shadowcast.value;
        }
    };
    cb_shadowreceive.onclick = () => {
        for (const mesh of Selected_Meshes) {
            mesh.receiveShadow = cb_shadowreceive.value;
        }
    };
}


/// sliders

const sldr_opacity = document.getElementById(`sldr_opacity`);
const sldr_alphatest = document.getElementById(`sldr_alphatest`);
const sldr_clrcoat = document.getElementById(`sldr_clrcoat`);
const sldr_ior = document.getElementById(`sldr_ior`);
const sldr_reflectivity = document.getElementById(`sldr_reflectivity`);
const sldr_metalness = document.getElementById(`sldr_metalness`);
const sldr_roughness = document.getElementById(`sldr_roughness`);
const sldr_irds = document.getElementById(`sldr_irds`);
const sldr_sheen = document.getElementById(`sldr_sheen`);
const sldr_transmission = document.getElementById(`sldr_transmission`);
const sldr_thickness = document.getElementById(`sldr_thickness`);


const sldr_opacity_value = document.getElementById(`sldr_opacity_value`);
const sldr_alphatest_value = document.getElementById(`sldr_alphatest_value`);
const sldr_clrcoat_value = document.getElementById(`sldr_clrcoat_value`);
const sldr_ior_value = document.getElementById(`sldr_ior_value`);
const sldr_reflectivity_value = document.getElementById(`sldr_reflectivity_value`);
const sldr_metalness_value = document.getElementById(`sldr_metalness_value`);
const sldr_roughness_value = document.getElementById(`sldr_roughness_value`);
const sldr_irds_value = document.getElementById(`sldr_irds_value`);
const sldr_sheen_value = document.getElementById(`sldr_sheen_value`);
const sldr_transmission_value = document.getElementById(`sldr_transmission_value`);
const sldr_thickness_value = document.getElementById(`sldr_thickness_value`);



function slider_the_meshes() {

    sldr_opacity.oninput = () => {
        for (let mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.material.opacity = sldr_opacity.value
                sldr_opacity_value.value = sldr_opacity.value
                mesh.material.needsUpdate = true
            }
        }
    }

    sldr_alphatest.oninput = () => {
        for (let mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.material.alphaTest = sldr_alphatest.value
                sldr_alphatest_value.value = sldr_alphatest.value
                mesh.material.needsUpdate = true
            }
        }
    }

    sldr_clrcoat.oninput = () => {
        for (let mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.material.clearcoat = sldr_clrcoat.value
                sldr_clrcoat_value.value = sldr_clrcoat.value
                mesh.material.needsUpdate = true
            }
        }
    }

    sldr_ior.oninput = () => {
        for (let mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.material.ior = sldr_ior.value
                sldr_ior_value.value = sldr_ior.value
                mesh.material.needsUpdate = true
            }
        }
    }

    sldr_reflectivity.oninput = () => {
        for (let mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.material.reflectivity = sldr_reflectivity.value
                sldr_reflectivity_value.value = sldr_reflectivity.value
                mesh.material.needsUpdate = true
            }
        }
    }

    sldr_metalness.oninput = () => {
        for (let mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.material.metalness = sldr_metalness.value
                sldr_metalness_value.value = sldr_metalness.value
                mesh.material.needsUpdate = true
            }
        }
    }

    sldr_roughness.oninput = () => {
        for (let mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.material.roughness = sldr_roughness.value
                sldr_roughness_value.value = sldr_roughness.value
                mesh.material.needsUpdate = true
            }
        }
    }

    sldr_irds.oninput = () => {
        for (let mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.material.iridescence = sldr_irds.value
                sldr_irds_value.value = sldr_irds.value
                mesh.material.needsUpdate = true
            }
        }
    }

    sldr_sheen.oninput = () => {
        for (let mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.material.sheen = sldr_sheen.value
                sldr_sheen_value.value = sldr_sheen.value
                mesh.material.needsUpdate = true
            }
        }
    }

    sldr_transmission.oninput = () => {
        for (let mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.material.transmission = sldr_transmission.value
                sldr_transmission_value.value = sldr_transmission.value
                mesh.material.needsUpdate = true
            }
        }
    }

    sldr_thickness.oninput = () => {
        for (let mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.material.thickness = sldr_thickness.value
                sldr_thickness_value.value = sldr_thickness.value
                mesh.material.needsUpdate = true
            }
        }
    }
}


/// info panel

const info_fps = document.getElementById("info-fps")
const info_geometry = document.getElementById("info-geometry")
const info_texture = document.getElementById("info-texture")
const info_call = document.getElementById("info-call")
const info_triangle = document.getElementById("info-triangle")
const info_points = document.getElementById("info-points")

/**
 * Animate
 */
const clock = new THREE.Clock()
let frames = 0, prevTime = performance.now();

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    if(scene){
        renderer.render(scene, camera)
    }

    /// Render info
    info_geometry.innerHTML = renderer.info.memory.geometries
    info_texture.innerHTML = renderer.info.memory.textures
    info_call.innerHTML = renderer.info.render.calls
    info_triangle.innerHTML = renderer.info.render.triangles
    info_points.innerHTML = renderer.info.render.points


    frames++;
    const time = performance.now();

    if (time >= prevTime + 1000) {

        info_fps.innerHTML = (Math.round((frames * 1000) / (time - prevTime))).toString();

        frames = 0;
        prevTime = time;

    }

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick();





// // Geometry
// const geometry = new THREE.BoxGeometry()

// // Material
// const material1 = new THREE.MeshBasicMaterial({ color: '#aaffaa' });
// const material2 = new THREE.MeshBasicMaterial({ color: '#ffaaaa' });
// const material3 = new THREE.MeshBasicMaterial({ color: '#aaaaff' });

// // Mesh

// const built_meshes = [new THREE.Mesh(geometry, material1), new THREE.Mesh(geometry, material2), new THREE.Mesh(geometry, material3)]


// const debugObject = {}
// debugObject.color = '#aaaaff'
// debugObject.MeshCreated = []

// debugObject.setToOrigin = () => {
//     debugObject.MeshCreated.position.x = 0
//     debugObject.MeshCreated.position.y = 2.5
//     debugObject.MeshCreated.position.z = 0
// }

// debugObject.setToOriginalShape = () => {
//     debugObject.MeshCreated.scale.x = 1
//     debugObject.MeshCreated.scale.y = 1
//     debugObject.MeshCreated.scale.z = 1
// }

// debugObject.setToOriginalRotation = () => {
//     debugObject.MeshCreated.rotation.x = 0
//     debugObject.MeshCreated.rotation.y = 0
//     debugObject.MeshCreated.rotation.z = 0
// }


// debugObject.createFigure = () => {

//     debugObject.MeshCreated.push(new THREE.Mesh(
//         new THREE.BoxGeometry(1, 1, 1),
//         new THREE.MeshBasicMaterial({ color: debugObject.color })
//     ))

//     for(let Meshes of debugObject.MeshCreated){
//         scene.add(Meshes)
//         Meshes.position.y += 1
//     }

// }




// const normal = textureLoader.load("./textures/rustic/nor.png")
// const ao = textureLoader.load("./textures/rustic/ao.png")
// const arm = textureLoader.load("./textures/rustic/arm.png")
// const diff = textureLoader.load("./textures/rustic/diff.png")
// const dis = textureLoader.load("./textures/rustic/dis.png")
// const rough = textureLoader.load("./textures/rustic/rough.png")

// const matcap = textureLoader.load('./textures/matcaps/14.png')
// const normal = textureLoader.load('./textures/normals/1.png')
// const bump = textureLoader.load('./textures/bumps/0.png')

// const Mesh = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshMatcapMaterial());
// scene.add(Mesh);


// Mesh.material.matcap = matcap
// Mesh.material.normalMap = normal
// Mesh.material.bumpMap = bump

// const normal = textureLoader.load("./textures/rock/nor.png")
// const ao = textureLoader.load("./textures/rock/ao.png")
// const arm = textureLoader.load("./textures/rock/arm.png")
// const diff = textureLoader.load("./textures/rock/diff.png")
// const dis = textureLoader.load("./textures/rock/dis.png")
// const rough = textureLoader.load("./textures/rock/rough.png")


// Mesh.material.displacementScale = 0.02;

// Mesh.material.map = diff
// Mesh.material.normalMap = normal
// Mesh.material.aoMap = ao
// Mesh.material.metalnessMap = arm
// Mesh.material.displacementMap = dis
// Mesh.material.roughnessMap = rough

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
// scene.add(directionalLight);

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// directionalLight.position.set(2, 2, 2)

// const Platform = new THREE.Mesh(
//     new THREE.BoxGeometry(5, 0.5, 5),
//     new THREE.MeshPhysicalMaterial({ color: '#aaffaa' })
// )


// const Plane = new THREE.Mesh(
//     new THREE.PlaneGeometry(10, 10),
//     new THREE.MeshBasicMaterial({ color: '#ddddff' })
// )

// Plane.rotation.x = - Math.PI / 2
// Plane.position.y = -1
// Platform.position.y = -0.75


// const xLine = new THREE.Mesh(
//     new THREE.PlaneGeometry(100, 0.01),
//     new THREE.MeshBasicMaterial({ color: '#ff0000', side: THREE.DoubleSide, transparent: true, opacity: 0.2 })
// )

// const yLine = new THREE.Mesh(
//     new THREE.PlaneGeometry(0.01, 100),
//     new THREE.MeshBasicMaterial({ color: '#00ff00', side: THREE.DoubleSide, transparent: true, opacity: 0.2 })
// )

// const zLine = new THREE.Mesh(
//     new THREE.BoxGeometry(0.01, 0.01, 100),
//     new THREE.MeshBasicMaterial({ color: '#0000ff', side: THREE.DoubleSide, transparent: true, opacity: 0.2 })
// )

// scene.add(xLine, yLine, zLine)

// Platform.material.color.set(new THREE.Color('#aaccff'))


// scene.add(Plane, Platform)



// // Remove the corresponding GUI element.
// console.log("removing the gui element: ", scene_meshes.indexOf(mesh))
// const shape_gui = document.getElementById(`mesh-${scene_meshes.indexOf(mesh)}`);
// shape_gui.remove();

// // Delete the mesh from the original scene_meshes array.
// console.log("deleting the original mesh: ", scene_meshes.indexOf(mesh))
// scene_meshes.splice(scene_meshes.indexOf(mesh), 1);

// // Remove the mesh from the scene.
// console.log("removing the mesh from the scene: ")
// scene.remove(mesh);