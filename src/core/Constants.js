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



// Saving Buttons
export const save = document.getElementById("save");
export const load = document.getElementById("load");


// Loaders
export const textureLoader = new THREE.TextureLoader();
export const hdriLoader = new RGBELoader();
export const ObjectLoader = new THREE.ObjectLoader()

// theme
export const Theme_Toggle = document.getElementById("theme-toggle")
