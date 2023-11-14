import { Theme_Toggle } from "./Constants";


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
