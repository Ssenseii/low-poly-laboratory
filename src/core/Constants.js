import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

/// CONSTANTS


/// Texture Arrays
export const scene_meshes = [];   /// Main Array
export const Loaded_Matcaps = [];
export const Loaded_Normals = [];
export const Loaded_Bumps = [];
export const Loaded_Hdris = [];



// canvas 
export const canvas_wrapper = document.querySelector('div.panel-canvas')
export const canvas = document.querySelector('canvas.webgl')


// scene

export const scene = new THREE.Scene();
 

// Panel: Textures
export const matcaps_panel = document.getElementById("matcaps-panel");
export const normals_panel = document.getElementById("normals-panel");
export const bumps_panel = document.getElementById("bumps-panel");
export const hdris_panel = document.getElementById("hdris-panel")


// Panel: Geometry
export const Shapes_Selector = document.getElementById("shapes");
export const Materials_Selector = document.getElementById("materials");
export const Create_Mesh = document.getElementById("generator");
export const Shapes_Panel = document.getElementById("shapes_panel");


// Panel: Info

export const info_fps = document.getElementById("info-fps")
export const info_geometry = document.getElementById("info-geometry")
export const info_texture = document.getElementById("info-texture")
export const info_call = document.getElementById("info-call")
export const info_triangle = document.getElementById("info-triangle")
export const info_points = document.getElementById("info-points")



// Saving Buttons
export const save = document.getElementById("save");
export const load = document.getElementById("load");


// Loaders
export const textureLoader = new THREE.TextureLoader();
export const hdriLoader = new RGBELoader();
export const ObjectLoader = new THREE.ObjectLoader()

// Theme
export const Theme_Toggle = document.getElementById("theme-toggle")


/// Arrays of Values

export const array_properties = ['position', 'scale', 'rotation'];
export const array_axis = ['x', 'y', 'z'];

/// Values

export const matcap_count = 8
export const normal_count = 8
export const bump_count = 4
export const hdri_count = 4

/// Sizes

export const sizes = {
    width: canvas_wrapper.clientWidth,
    height: canvas_wrapper.clientHeight,
}

