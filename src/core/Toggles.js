/// toggling the shapes
function toggleShape(index) {
    const panel = document.getElementById(`panel-${index}`);
    panel.classList.toggle("hide");
}
/// toggling the position, scale and rotation

function toggleSliders(index, attribute) {
    const panel = document.getElementById(`panel-${index}-${attribute}`);
    panel.classList.toggle("hide");
}