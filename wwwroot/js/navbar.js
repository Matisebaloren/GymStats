const toggleButton = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");

toggleButton.addEventListener("click", () => {
    sidebar.classList.toggle("closed");
    $("#hearthIcon").toggleClass("bi-heart-pulse-fill");
    $("#hearthIcon").toggleClass("bi-heart-pulse");
    document.body.style.gridTemplateColumns = sidebar.classList.contains("closed") ? "0 1fr" : "250px 1fr";
});
