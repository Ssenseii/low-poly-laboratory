# Unused but Need

<div class="panel-geometry_shapes-container">

                        <button class="panel-geometry_shapes-button">Shape #1</button>
                        <div class="panel-geometry_shapes-panel">

                            <!-- Position Coordinates -->
                            <button class="panel-geometry_shapes-panel-dropdown">Position</button>
                            <div class="panel-geometry_shapes-panel-sliders">
                                <div class="panel-geometry_shapes-panel-sliders-container">
                                    <div class="panel-geometry_shapes-panel-sliders-slider">
                                        <label>x: </label>
                                        <div class="slider">
                                            <input type="range">
                                            <p>12</p>
                                        </div>
                                    </div>
                                    <div class="panel-geometry_shapes-panel-sliders-slider">
                                        <label>y: </label>
                                        <div class="slider">
                                            <input type="range">
                                            <p>2</p>
                                        </div>
                                    </div>
                                    <div class="panel-geometry_shapes-panel-sliders-slider">
                                        <label>z: </label>
                                        <div class="slider">
                                            <input type="range">
                                            <p>0</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Scale Coordinates -->
                            <button class="panel-geometry_shapes-panel-dropdown">Scale</button>
                            <div class="panel-geometry_shapes-panel-sliders">
                                <div class="panel-geometry_shapes-panel-sliders-container">
                                    <div class="panel-geometry_shapes-panel-sliders-slider">
                                        <label>x: </label>
                                        <div class="slider">
                                            <input type="range">
                                            <p>12</p>
                                        </div>
                                    </div>
                                    <div class="panel-geometry_shapes-panel-sliders-slider">
                                        <label>y: </label>
                                        <div class="slider">
                                            <input type="range">
                                            <p>2</p>
                                        </div>
                                    </div>
                                    <div class="panel-geometry_shapes-panel-sliders-slider">
                                        <label>z: </label>
                                        <div class="slider">
                                            <input type="range">
                                            <p>0</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Position Coordinates -->
                            <button class="panel-geometry_shapes-panel-dropdown">Rotation</button>
                            <div class="panel-geometry_shapes-panel-sliders">
                                <div class="panel-geometry_shapes-panel-sliders-container">
                                    <div class="panel-geometry_shapes-panel-sliders-slider">
                                        <label>x: </label>
                                        <div class="slider">
                                            <input type="range">
                                            <p>12</p>
                                        </div>
                                    </div>
                                    <div class="panel-geometry_shapes-panel-sliders-slider">
                                        <label>y: </label>
                                        <div class="slider">
                                            <input type="range">
                                            <p>2</p>
                                        </div>
                                    </div>
                                    <div class="panel-geometry_shapes-panel-sliders-slider">
                                        <label>z: </label>
                                        <div class="slider">
                                            <input type="range">
                                            <p>0</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



<!-- First Stupid Attempt -->


// const sliderx = document.getElementById("slider-0-position-x")
// const slidery = document.getElementById("slider-0-position-y")
// const sliderz = document.getElementById("slider-0-position-z")
// const slider_value_x = document.getElementById("slider-0-position-x-value")
// const slider_value_y = document.getElementById("slider-0-position-y-value")
// const slider_value_z = document.getElementById("slider-0-position-z-value")

//     if (sliderx) {
//         sliderx.oninput = () => {
//             scene_meshes[0].position.x = sliderx.value
//             slider_value_x.innerText = sliderx.value
//         }
//     }
//     if (slidery) {
//         slidery.oninput = () => {
//             scene_meshes[0].position.y = slidery.value
//             slider_value_y.innerText = slidery.value
//         }
//     }
//     if (sliderz) {
//         sliderz.oninput = () => {
//             scene_meshes[0].position.z = sliderz.value
//             slider_value_z.innerText = sliderz.value
//         }
//     }
