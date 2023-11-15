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


// CONSTANTS

import {
    scene,
    canvas,
    canvas_wrapper,
    scene_meshes,

    /// Textures
    Loaded_Matcaps,
    Loaded_Normals,
    Loaded_Bumps,
    Loaded_Hdris,
    matcaps_panel,
    normals_panel,
    bumps_panel,
    hdris_panel,
    matcap_count,
    normal_count,
    bump_count,
    hdri_count,
    textureLoader,
    hdriLoader,

    /// Meshes
    Shapes_Selector,
    Materials_Selector,
    Create_Mesh,

    /// Panels
    Shapes_Panel,
    save,
    load,
    ObjectLoader,
    array_axis,
    array_properties,
    sizes,
    info_fps,
    info_geometry,
    info_texture,
    info_call,
    info_triangle,
    info_points,
} from './core/Constants';


/// UTILS

import { Iterate_Over } from './core/Utils';

/// HTML

import { HTML_Checkbox, HTML_Checkbox_Checked } from './core/Html';

/// VARIABLES
let Selected_Meshes = [];
let geometry;
let material;
let light;
let shape;




/**
 * BASE: The Building Blocks of THREEJS, Includes Renderer, Camera, Controls, Sizing 
 */


/// Renderer

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true


/// Camera

let camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100) 
camera.position.set(2, 1, 2)

scene.add(camera)


/// Controls

// Controls
let controls = new OrbitControls(camera, canvas)
controls.enableDamping = true



/// Sizing


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
 *  CORE
 */



/// Create New Mesh


Shapes_Selector.value = 1;
Materials_Selector.value = 1;

function Shape_and_Geometry(){
    switch (true) {
        case Shapes_Selector.value == 1:
            geometry = new THREE.BoxGeometry(1, 1, 1)
            break;
        case Shapes_Selector.value == 2:
            geometry = new THREE.PlaneGeometry(1, 1)
            break;
        case Shapes_Selector.value == 3:
            geometry = new THREE.CircleGeometry(1)
            break;
        case Shapes_Selector.value == 4:
            geometry = new THREE.SphereGeometry(1, 32, 16)
            break;
        case Shapes_Selector.value == 5:
            geometry = new THREE.CylinderGeometry(1, 1, 2, 32)
            break;
        case Shapes_Selector.value == 6:
            geometry = new THREE.CapsuleGeometry(1, 1, 16, 32)
            break;
        case Shapes_Selector.value == 7:
            geometry = new THREE.RingGeometry(1, 2, 32, 16)
            break;
        case Shapes_Selector.value == 8:
            geometry = new THREE.TorusGeometry(1, 0.5, 32, 100)
            break;
        case Shapes_Selector.value == 9:
            geometry = new THREE.OctahedronGeometry(1, 1)
            break;
        case Shapes_Selector.value == 10:
            geometry = new THREE.ConeGeometry(1, 1, 8)
            break;
        case Shapes_Selector.value == 11:
            geometry = new THREE.OctahedronGeometry(1, 2)
            break;
        case Shapes_Selector.value == 12:
            light = new THREE.AmbientLight(0x4D4D4D);
            break;
        case Shapes_Selector.value == 13:
            light = new THREE.DirectionalLight(0xffffff);
            break;
        case Shapes_Selector.value == 14:
            light = new THREE.HemisphereLight(0xffffff, 0xffffff);
            break;
        case Shapes_Selector.value == 15:
            light = new THREE.PointLight(0xffffff);
            break;
        case Shapes_Selector.value == 16:
            light = new THREE.RectAreaLight(0xffffff);
            break;
        case Shapes_Selector.value == 17:
            light = new THREE.SpotLight(0xffffff);
            break;
        default:
            geometry = new THREE.BoxGeometry(1, 1, 1)
            break;
    }

    switch (true) {
        case Materials_Selector.value == 1:
            material = new THREE.MeshBasicMaterial()
            break;
        case Materials_Selector.value == 2:
            material = new THREE.MeshStandardMaterial()
            break;
        case Materials_Selector.value == 3:
            material = new THREE.MeshPhysicalMaterial()
            break;
        case Materials_Selector.value == 4:
            material = new THREE.MeshDepthMaterial()
            break;
        case Materials_Selector.value == 5:
            material = new THREE.MeshLambertMaterial()
            break;
        case Materials_Selector.value == 6:
            material = new THREE.MeshMatcapMaterial()
            break;
        case Materials_Selector.value == 7:
            material = new THREE.MeshNormalMaterial()
            break;
        case Materials_Selector.value == 8:
            material = new THREE.MeshPhongMaterial()
            break;
        case Materials_Selector.value == 9:
            material = new THREE.MeshToonMaterial()
            break;
        default:
            material = new THREE.MeshBasicMaterial({ color: '#ffaaaa' })
            break;
    }
}

function Instantiate_Mesh() {
    
    Shape_and_Geometry()

    /// Normal Geometries
    if (Shapes_Selector.value <= 11) {
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
    Iterate_Over(scene_meshes, (index, mesh) => scene.add(mesh))

}



function Add_Gui(index) {

    const Coordinates = (index, property, min, max, step, initial) => {

        const Slider = (index, property, axis, min, max, step, initial) => {
            return `<div class="panel-geometry_shapes-panel-sliders-slider">
                                    <label>${axis}: </label>
                                    <div class="slider">
                                        <input id="slider-${index}-${property}-${axis}"
                                            class="input_slider"
                                            value="${initial}"
                                            min="${min}" 
                                            max="${max}" 
                                            step="${step}" 
                                            type="range">
                                        <input type="text" value="${initial}" id="slider-${index}-${property}-${axis}-value">
                                    </div>
                                </div>`
        }

        return `<button class="panel-geometry_shapes-panel-dropdown" onclick="toggleSliders(${index}, '${property}')">${property}</button>
                        <div id="panel-${index}-${property}" class="panel-geometry_shapes-panel-sliders">
                            <div class="panel-geometry_shapes-panel-sliders-container">
                                ${Slider(index, property, 'x', min, max, step, initial)}
                                ${Slider(index, property, 'y', min, max, step, initial)}
                                ${Slider(index, property, 'z', min, max, step, initial)}
                            </div>
                        </div>`
    }


    shape = document.createElement("div");
    shape.classList.add('panel-geometry_shapes-container');
    shape.id = `mesh-${index}`;
    shape.innerHTML = `<button id="shape-${index}" style="background-color: var(--selected);" class="panel-geometry_shapes-button" onclick="toggleShape(${index})">Shape #${index} </button>
                        <div id="panel-${index}" class="panel-geometry_shapes-panel">

                        <!-- Position Coordinates -->
                        ${Coordinates(index, 'position', -10, 10, 0.01, 1)}
                        
                        <!-- Scale Coordinates -->
                        ${Coordinates(index, 'scale', 0, 20, 0.01, 1)}
                        
                        <!-- Rotation Coordinates -->
                        ${Coordinates(index, 'rotation', -Math.PI, Math.PI, 0.01, 0)}
                    
                        </div>`

    Shapes_Panel.appendChild(shape)
}

/// Connects the created GUI with the mesh 

function Connect_Gui() {

    const Slider_Property_Axis = (element, property, axis, index) => {
        const slider = document.getElementById(`slider-${index}-${property}-${axis}`);
        const input = document.getElementById(`slider-${index}-${property}-${axis}-value`);

        slider.oninput = () => {
            element[property][axis] = slider.value;
            input.value = slider.value
        }

        input.oninput = () => {
            element[property][axis] = input.value;
            slider.value = input.value

        }
    }

    Iterate_Over(scene_meshes, (index, element) => {
        for (let property of array_properties) {
            for (let axis of array_axis) {

                Slider_Property_Axis(element, property, axis, index)

            }
        }
    })
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

Create_Mesh.addEventListener("click", Instantiate_Mesh)




/**
 *  PANELS: Camera, Shape Options...
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

/**
 * TEXTURES: Matcaps, Normals, Bumps & HDRI 
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



for (let i = 0; i < matcap_count; i++) {
    const matcapButton = CreateTextureButtonAndEventListener("matcap", i);
    matcaps_panel.appendChild(matcapButton);

    const normalButton = CreateTextureButtonAndEventListener("normal", i);
    normals_panel.appendChild(normalButton);
}

for (let i = 0; i < bump_count; i++) {
    const bumpButton = CreateTextureButtonAndEventListener("bump", i);
    bumps_panel.appendChild(bumpButton);
}


// HDRIS: Can't add it above because it uses a different loader and different extension.
/// We're also Lazy Loading them for their big size (not really)


for (let i = 0; i < hdri_count; i++) {


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






/**
 *  MATERIALS: Coloris, Radios, Checkboxes and Sliders
 */





/// Color picker: set the color of all selected meshes

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



/// Radios: These Radios set the general constants of either the material or the renderer.

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




// Checkboxes: These Checkboxes set the Material Booleans

const Checkboxes = document.querySelectorAll(".checkbox")
for (let checkbox of Checkboxes) {
    checkbox.innerHTML = HTML_Checkbox;
    checkbox.value = false

    checkbox.addEventListener("click", () => {
        if (!checkbox.value) {
            checkbox.innerHTML = HTML_Checkbox_Checked;
            checkbox.value = true;
        } else {
            checkbox.innerHTML = HTML_Checkbox;
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




/// Sliders: These Sliders set the float values for the material's properties

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











/**
 * Animate: Here we Animate the scene and update the fps counter.
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