/// Loading screen:

const loading_item = document.getElementById("loading-item")

document.addEventListener("DOMContentLoaded", function () {
        // Hide the loading screen
        document.getElementById("loading-screen").style.display = "none";
        // document.getElementById("loading-screen").style.display = "grid";
});


/// Consider Lazy Loading the HDRIs, if you do the previus method window.onLoad => it takes almost 3 minutes for everything to load.