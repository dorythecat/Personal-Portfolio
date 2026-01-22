const projects = document.getElementById("projects").children;

let projectIndex = 0;
function nextProjects() {
    projectIndex++;
    if (projectIndex > Math.floor(projects.length / 3)) projectIndex = 0;
    if (projectIndex > 0) {
        for (let i = 0; i < 3; i++) {
            projects[3 * projectIndex - i - 1].classList.add("hidden");
            projects[3 * projectIndex + i]?.classList.remove("hidden");
        }
    } else {
        const j = 3 * Math.ceil(projects.length / 3) - 1;
        for (let i = 0; i < 3; i++) {
            projects[j - i]?.classList.add("hidden");
            projects[i].classList.remove("hidden");
        }
    } setTimeout(nextProjects, 10000);
}
setTimeout(nextProjects, 10000);