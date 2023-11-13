/* 
    Imports
*/

// THREEJS
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'


// COLORIS
import "@melloware/coloris/dist/coloris.css";
import Coloris from "@melloware/coloris";







/**
    Base
*/

/// CONSTANTS


/// Texture Arrays
const scene_meshes = [];   /// Main Array
const Loaded_Matcaps = [];
const Loaded_Normals = [];
const Loaded_Bumps = [];
const Loaded_Hdris = [];



// canvas 
const canvas_wrapper = document.querySelector('div.panel-canvas')
const canvas = document.querySelector('canvas.webgl')


// Panel: Textures
const matcaps_panel = document.getElementById("matcaps-panel");
const normals_panel = document.getElementById("normals-panel");
const bumps_panel = document.getElementById("bumps-panel");
const hdris_panel = document.getElementById("hdris-panel")


// Panel: Geometry
const Shapes_Selector = document.getElementById("shapes");
const Materials_Selector = document.getElementById("materials");
const Create_Mesh = document.getElementById("generator");
const Shapes_Panel = document.getElementById("shapes_panel");



// Saving Buttons
const save = document.getElementById("save");
const load = document.getElementById("load");


/// VARIABLES
let scene = new THREE.Scene();
let Selected_Meshes = [];       /// keep like this so that you can modify it with the select_shape function
let geometry;
let material;
let light;
let shape;



/// LOADERS
const textureLoader = new THREE.TextureLoader();
const hdriLoader = new RGBELoader();
const ObjectLoader = new THREE.ObjectLoader()






/// Loading screen:

document.addEventListener("DOMContentLoaded", function () {
    // Show the loading screen

    document.getElementById("loading-screen").style.display = "grid";

    // Wait for all scripts and assets to load
    window.addEventListener("load", function () {
        // Hide the loading screen
        document.getElementById("loading-screen").style.display = "none";
    });
});

/// Theme

const Theme_Toggle = document.getElementById("theme-toggle")

Theme_Toggle.addEventListener("click", () => {
    // Set the default theme
    let defaultTheme = document.documentElement.classList.contains("light-theme");

    // Toggle the theme
    if (defaultTheme) {
        document.documentElement.classList.remove("light-theme");
        document.documentElement.classList.add("dark-theme");
    } else {
        document.documentElement.classList.remove("dark-theme");
        document.documentElement.classList.add("light-theme");
    }

    // Set the CSS variables
    document.documentElement.style.setProperty("--primary", defaultTheme ? "#25202d" : "#D6DaD1");
    document.documentElement.style.setProperty("--secondary", defaultTheme ? "#D6DAD1" : "#25202d");
});




/**
 *  CORE
 */



/// Utils

function Iterate_Over(array, callback) {
    for (let element of array) {
        if (element !== null) {
            callback(element)
        }
    }
}



const Coordinate = (index, property) => {

    const Slider = (index, property, axis) => {
        return `<div class="panel-geometry_shapes-panel-sliders-slider">
                                    <label>${axis}: </label>
                                    <div class="slider">
                                        <input id="slider-${index}-${property}-${axis}"
                                            class="input_slider"
                                            min="-10" 
                                            max="10" 
                                            step="0.01" 
                                            type="range">
                                        <input type="text" value="0" id="slider-${index}-${property}-${axis}-value">
                                    </div>
                                </div>`
    }

    return `<button class="panel-geometry_shapes-panel-dropdown" onclick="toggleSliders(${index}, '${property}')">${property}</button>
                        <div id="panel-${index}-${property}" class="panel-geometry_shapes-panel-sliders">
                            <div class="panel-geometry_shapes-panel-sliders-container">
                                ${Slider(index, property, 'x')}
                                ${Slider(index, property, 'y')}
                                ${Slider(index, property, 'z')}
                            </div>
                        </div>`
}






/**
 * Save Function
 */


save.addEventListener("click", () => {
    let JsonSavedScene = JSON.stringify(scene)
    localStorage.setItem("three-scene", JsonSavedScene);
})


// won't work for heavy scenes that exceed a certain quota (think of other solution)
load.addEventListener("click", () => {
    const StringifiedScene = localStorage.getItem("three-scene");
    const loadedScene = ObjectLoader.parse(JSON.parse(StringifiedScene))
    scene = loadedScene;
})



/// Create New Mesh


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
            light = new THREE.AmbientLight(0x4D4D4D);
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

    /// If it's not a light, else if it is.
    if (+Shapes_Selector.value <= 11) {
        const Mesh = new THREE.Mesh(geometry, material)                 /// Create the Mesh
        scene_meshes.push(Mesh)                                         /// Add it to the Array of Meshes to be Compiled
        Selected_Meshes.push(Mesh)                                      /// Select it
        Add_Gui(scene_meshes.indexOf(Mesh));                            /// Create a GUI for it
        Connect_Gui()                                                   /// Connect the GUI to the Mesh
        Select_Mesh()                                                   /// You can now Select it and UnSelect it 
        Checkbox_Meshes()                                               /// Connect the new Mesh to the Checkboxes
        Slider_Meshes()                                                 /// Connect the new Mesh to the Sliders

        shape_info_geometry.innerHTML = Mesh.geometry.type
        shape_info_material.innerHTML = Mesh.material.type
    }
    else {
        scene_meshes.push(light)
        Selected_Meshes.push(light)
        Add_Gui(scene_meshes.indexOf(light))
        Connect_Gui()
        Select_Mesh()
    }


    /// Add all scene meshes to the scene
    Iterate_Over(scene_meshes, mesh => scene.add(mesh))

}


function Add_Gui(index) {
    shape = document.createElement("div");
    shape.classList.add('panel-geometry_shapes-container');
    shape.id = `mesh-${index}`;
    shape.innerHTML = `<button id="shape-${index}" style="background-color: var(--selected);" class="panel-geometry_shapes-button" onclick="toggleShape(${index})">Shape #${index} </button>
                        <div id="panel-${index}" class="panel-geometry_shapes-panel">

                        <!-- Position Coordinates -->
                        ${Coordinate(index, 'position')}
                        
                        <!-- Scale Coordinates -->
                        ${Coordinate(index, 'scale')}
                        
                        <!-- Rotation Coordinates -->
                        ${Coordinate(index, 'rotation')}
                    
                        </div>`

    Shapes_Panel.appendChild(shape)
}





function Connect_Gui() {

    for (let i = 0; i < scene_meshes.length; i++) {

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
                    shape_info_geometry.innerHTML = mesh.geometry.type
                    shape_info_material.innerHTML = mesh.material.type
                }

                // Update the original array
                Selected_Meshes = selectedMeshes;
            });
        }
    });
}

Create_Mesh.addEventListener("click", addMesh)

/**
 * Shape Specific Options
 */

const rename_shapes = document.getElementById("rename-shapes")
const delete_shapes = document.getElementById("delete-shapes")
const shape_info_geometry = document.getElementById("shape-info-geometry")
const shape_info_material = document.getElementById("shape-info-material")




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

                mesh.material.dispose()
                mesh.geometry.dispose()
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

if (scene) {
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
renderer.shadowMap.enabled = true

/**
 * Textures
 */



function Create_Texture_Button(type, index) {
    const texture = document.createElement("div");
    texture.id = `${type}-${index}`;
    texture.classList.add(`panel-texture_${type}s-${type}`);
    texture.style.background = `url("textures/${type}s/${index}.png")`;
    texture.style.backgroundSize = "cover";
    return texture;
}

function Load_Texture(type, index) {
    return textureLoader.load(`textures/${type}s/${index}.png`);
}


function CreateTextureButtonAndEventListener(textureType, i) {
    // Create the texture button
    const button = Create_Texture_Button(textureType, i);

    // Load the texture
    const loadedTexture = Load_Texture(textureType, i);

    // Add the texture to the array
    let loadedTextures;


    switch (true) {
        case textureType == "matcap":
            loadedTextures = Loaded_Matcaps;
            break;
        case textureType == "normal":
            loadedTextures = Loaded_Normals;
            break;
        case textureType == "bump":
            loadedTextures = Loaded_Bumps;
            break;
        // Add more cases here for other texture types
        default:
            console.log("No array for the texture type")
            break;
    };



    loadedTextures.push(loadedTexture);

    // Add an event listener to the button
    button.addEventListener("click", () => {
        // Dispose of all loaded textures
        loadedTextures.forEach((texture) => texture.dispose());

        // Apply the new texture to all selected meshes
        Selected_Meshes.forEach((mesh) => {
            if (mesh !== null) {
                switch (true) {
                    case textureType == "matcap":
                        mesh.material.matcap = loadedTexture;
                        mesh.material.needsUpdate = true;
                        break;
                    case textureType == "normal":
                        mesh.material.normalMap = loadedTexture;
                        mesh.material.needsUpdate = true;
                        break;
                    case textureType == "bump":
                        mesh.material.bumpMap = loadedTexture;
                        mesh.material.needsUpdate = true;
                        break;
                    // Add more cases here for other texture types
                    default:
                        console.log("no case for this texture type to be applied")
                        break;
                }
            }
        });
    });

    return button;
}

// const mesh = new THREE.Mesh(new THREE.SphereGeometry, new THREE.MeshPhysicalMaterial({ color: 'white' }))
// mesh.material.bumpMap = textureLoader.load('textures/bumps/0.png')
// scene.add(mesh)


for (let i = 0; i < 8; i++) {
    const matcapButton = CreateTextureButtonAndEventListener("matcap", i);
    matcaps_panel.appendChild(matcapButton);

    const normalButton = CreateTextureButtonAndEventListener("normal", i);
    normals_panel.appendChild(normalButton);
}

for (let i = 0; i < 2; i++) {
    const bumpButton = CreateTextureButtonAndEventListener("bump", i);
    bumps_panel.appendChild(bumpButton);
}


// HDRIS: Can't add it above because it uses a different loader and different extension.
for (let i = 0; i < 4; i++) {
    const hdri = document.createElement("div");
    hdri.id = `hdri-${i}`;
    hdri.classList.add("panel-texture_hdris-hdri");

    hdris_panel.appendChild(hdri);

    const Loaded_Hdri = hdriLoader.load(
        `./textures/hdris/${i}.hdr`,
        () => {
            Loaded_Hdri.mapping = THREE.EquirectangularReflectionMapping;
        }
    );

    Loaded_Hdris.push(Loaded_Hdri);

    hdri.addEventListener("click", () => {
        for (let i = 0; i < Loaded_Hdris.length; i++) {
            Loaded_Hdris[i].dispose()
        }

        for (const mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.material.envMap = Loaded_Hdri;
                mesh.material.needsUpdate = true;
            }
        }
    })
}


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



/**
 *  Radios, Checkboxes and Sliders
 */


/// Radios

const radioSide = document.getElementById("radio-side");
const radioBlending = document.getElementById("radio-blending");
const radioPrecision = document.getElementById("radio-precision");
const radioShadowTypes = document.getElementById("radio-shadowTypes");
const radioToneMapping = document.getElementById("radio-toneMapping");

const radios = [radioSide, radioBlending, radioPrecision, radioShadowTypes, radioToneMapping];

const properties = {
    side: {
        1: THREE.FrontSide,
        2: THREE.BackSide,
        3: THREE.DoubleSide,
    },
    blending: {
        1: THREE.NormalBlending,
        2: THREE.AdditiveBlending,
        3: THREE.SubtractiveBlending,
        4: THREE.MultiplyBlending,
    },
    precision: {
        1: null,
        2: "lowp",
        3: "mediump",
        4: "highp",
    },
    shadowTypes: {
        1: THREE.BasicShadowMap,
        2: THREE.PCFShadowMap,
        3: THREE.PCFSoftShadowMap,
        4: THREE.VSMShadowMap,
    },
    toneMapping: {
        1: THREE.NoToneMapping,
        2: THREE.LinearToneMapping,
        3: THREE.ReinhardToneMapping,
        4: THREE.CineonToneMapping,
        5: THREE.ACESFilmicToneMapping,
    },
};

radios.forEach((radio) => {
    radio.addEventListener("input", () => {
        const data = new FormData(radio);
        const property = radio.id.split("-")[1];

        for (const entry of data) {
            if (Selected_Meshes) {
                for (const mesh of Selected_Meshes) {
                    if (mesh !== null) {
                        if (properties[property] === properties.toneMapping || properties[property] === properties.shadowTypes) {
                            if (properties[property] === properties.toneMapping) {
                                renderer.toneMapping = properties[property][entry[1]];
                            } else {
                                renderer.shadowMap = properties[property][entry[1]];
                            }
                        } else {
                            mesh.material[property] = properties[property][entry[1]];
                            mesh.material.needsUpdate = true;
                        }
                    }
                }
            }
        }
    });
});




// checkboxes

const Checkboxes = document.querySelectorAll(".checkbox")
for (let checkbox of Checkboxes) {
    checkbox.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="path-1-inside-1_83_27" fill="white">
<rect width="13" height="13" rx="4"/>
</mask>
<rect width="13" height="13" rx="4" fill="var(--primary)" stroke="var(--primary)" stroke-width="13" mask="url(#path-1-inside-1_83_27)"/>
</svg>
`
    checkbox.value = false

    checkbox.addEventListener("click", () => {
        if (!checkbox.value) {
            checkbox.innerHTML = `<svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="path-1-inside-1_83_28" fill="white">
<rect y="0.73172" width="13.0653" height="13.0653" rx="4"/>
</mask>
<rect y="0.73172" width="13.0653" height="13.0653" rx="4" fill="#25202C" stroke="#25202C" stroke-width="13.0653" mask="url(#path-1-inside-1_83_28)"/>
<path d="M6.10451 11.2842C5.37885 10.5585 5.37885 9.38198 6.10451 8.65632L13.0437 1.71716C13.5879 1.17292 14.4703 1.17291 15.0146 1.71716V1.71716C15.5588 2.26141 15.5588 3.1438 15.0146 3.68805L7.41844 11.2842C7.05561 11.647 6.46734 11.647 6.10451 11.2842V11.2842Z" fill="#22A497"/>
<path d="M3.4678 6.65425C4.01205 6.11001 4.89445 6.11001 5.43869 6.65425L7.4343 8.64987C8.15996 9.37553 8.15997 10.5521 7.4343 11.2777V11.2777C7.07147 11.6405 6.48321 11.6405 6.12038 11.2777L3.4678 8.62514C2.92356 8.08089 2.92356 7.1985 3.4678 6.65425V6.65425Z" fill="#22A497"/>
</svg>`;
            checkbox.value = true;
        } else {
            checkbox.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="path-1-inside-1_83_27" fill="white">
<rect width="13" height="13" rx="4"/>
</mask>
<rect width="13" height="13" rx="4" fill="var(--primary)" stroke="var(--primary) stroke-width="13" mask="url(#path-1-inside-1_83_27)"/>
</svg>
`;
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

function Checkbox_Meshes() {
    cb_wireframe.onclick = () => {
        for (const mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.material.wireframe = cb_wireframe.value;
            }
        }
    };
    cb_visible.onclick = () => {
        for (const mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.material.visible = !cb_visible.value;
            }
        }
    };
    cb_transparent.onclick = () => {
        for (const mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.material.transparent = cb_transparent.value;
            }
        }
    };
    cb_fog.onclick = () => {
        for (const mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.material.fog = cb_fog.value;
            }
        }
    };
    cb_alphahash.onclick = () => {
        for (const mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.material.alphahash = cb_alphahash.value;
            }
        }
    };
    cb_clipshadows.onclick = () => {
        for (const mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.material.clipShadows = cb_clipshadows.value;
            }
        }
    };
    cb_depthtest.onclick = () => {
        for (const mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.material.depthTest = !cb_depthtest.value;
            }
        }
    };
    cb_depthwrite.onclick = () => {
        for (const mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.material.depthWrite = !cb_depthwrite.value;
            }
        }
    };
    cb_permultialpha.onclick = () => {
        for (const mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.material.premultipliedAlpha = cb_permultialpha.value;
            }
        }
    };
    cb_dithering.onclick = () => {
        for (const mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.material.dithering = cb_dithering.value;
            }
        }
    };
    cb_shadowcast.onclick = () => {
        for (const mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.castShadow = cb_shadowcast.value;
            }
        }
    };
    cb_shadowreceive.onclick = () => {
        for (const mesh of Selected_Meshes) {
            if (mesh !== null) {
                mesh.receiveShadow = cb_shadowreceive.value;
            }
        }
    };
}


/// sliders
const sliderHandlers = {
    "sldr_opacity": (mesh, value) => {
        if (mesh !== null) {
            mesh.material.opacity = value;
            sldr_opacity_value.value = value;
            mesh.material.needsUpdate = true;
        }
    },
    "sldr_alphatest": (mesh, value) => {
        if (mesh !== null) {
            mesh.material.alphaTest = value;
            sldr_alphatest_value.value = value;
            mesh.material.needsUpdate = true;
        }
    },
    "sldr_clrcoat": (mesh, value) => {
        if (mesh !== null) {
            mesh.material.clearcoat = value;
            sldr_clrcoat_value.value = value;
            mesh.material.needsUpdate = true;
        }
    },
    "sldr_ior": (mesh, value) => {
        if (mesh !== null) {
            mesh.material.ior = value;
            sldr_ior_value.value = value;
            mesh.material.needsUpdate = true;
        }
    },
    "sldr_reflectivity": (mesh, value) => {
        if (mesh !== null) {
            mesh.material.reflectivity = value;
            sldr_reflectivity_value.value = value;
            mesh.material.needsUpdate = true;
        }
    },
    "sldr_metalness": (mesh, value) => {
        if (mesh !== null) {
            mesh.material.metalness = value;
            sldr_metalness_value.value = value;
            mesh.material.needsUpdate = true;
        }
    },
    "sldr_roughness": (mesh, value) => {
        if (mesh !== null) {
            mesh.material.roughness = value;
            sldr_roughness_value.value = value;
            mesh.material.needsUpdate = true;
        }
    },
    "sldr_irds": (mesh, value) => {
        if (mesh !== null) {
            mesh.material.iridescence = value;
            sldr_irds_value.value = value;
            mesh.material.needsUpdate = true;
        }
    },
    "sldr_sheen": (mesh, value) => {
        if (mesh !== null) {
            mesh.material.sheen = value;
            sldr_sheen_value.value = value;
            mesh.material.needsUpdate = true;
        }
    },
    "sldr_transmission": (mesh, value) => {
        if (mesh !== null) {
            mesh.material.transmission = value;
            sldr_transmission_value.value = value;
            mesh.material.needsUpdate = true;
        }
    },
    "sldr_thickness": (mesh, value) => {
        if (mesh !== null) {
            mesh.material.thickness = value;
            sldr_thickness_value.value = value;
            mesh.material.needsUpdate = true;
        }
    },

    // Geometry Transformations do Not Work
    "sldr_radius": (mesh, value) => {
        if (mesh !== null) {
            const newGeometry = mesh.geometry.clone();
            newGeometry.parameters.radius = +value;
            mesh.geometry = newGeometry;
            sldr_radius_value.value = value;
            mesh.geometry.needsUpdate = true;
            mesh.updateMatrix();
        }
    },
    "sldr_length": (mesh, value) => {
        if (mesh !== null) {
            const newGeometry = mesh.geometry.clone();
            newGeometry.parameters.length = +value;
            mesh.geometry = newGeometry;
            sldr_length_value.value = value;
            mesh.geometry.needsUpdate = true;
        }
    },
    "sldr_segments": (mesh, value) => {
        if (mesh !== null) {
            console.log(mesh.geometry)
            mesh.geometry.parameters.radialSegments = +value;
            sldr_segments_value.value = value;
            mesh.geometry.needsUpdate = true;
        }
    },
};

function Slider_Meshes() {
    const sliderInputs = Array.from(document.querySelectorAll("input.panel-material_slider-input"));
    for (const sliderInput of sliderInputs) {
        sliderInput.oninput = () => {
            const value = sliderInput.value;
            for (const mesh of Selected_Meshes) {
                sliderHandlers[sliderInput.id](mesh, value);
            }
        };
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
    if (scene) {
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



// load.addEventListener("click", () => {
//     const StringifiedScene = localStorage.getItem("three-scene");
//     // try {
//     //     // Parse the stringified scene back into an object
//     //     scene = JSON.parse(StringifiedScene);
//     // } catch (error) {
//     //     // The stringified scene object is invalid
//     //     console.error("Invalid scene object: " + error);
//     //     return;
//     // // }
//     // console.log("scene loaded")

//     const loadedScene = ObjectLoader.parse(JSON.parse(StringifiedScene))

//     // console.log("JSON scene: ")
//     // console.log(loadedScene)
//     // console.log("Normal Scene: " )
//     // console.log(scene)

//     scene = loadedScene;

// })