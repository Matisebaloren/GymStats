const toggleButton = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");

toggleButton.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    const icon = document.getElementById("hearthIcon");
    icon.classList.toggle("bi-heart-pulse-fill");
    icon.classList.toggle("bi-heart-pulse");
});

sidebar.addEventListener("mouseover", () => {
    sidebar.classList.add("hover-open");
});

// Quitar la clase cuando el mouse salga del sidebar
sidebar.addEventListener("mouseout", () => {
    sidebar.classList.remove("hover-open");
});

