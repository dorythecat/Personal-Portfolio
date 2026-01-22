const projects = document.getElementById("projects").children;

// Cookie utilities
function getCookie(name) {
    const parts = `; ${document.cookie}`.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return "";
}

function setCookie(name, value, expiry = null) {
    let expires = "";
    if (expiry) {
        let date = new Date();
        date.setTime(date.getTime() + expiry);
        expires = "; expires=" + date.toUTCString();
    } document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function delCookie(name) { document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'; }

// GitHub API
const API_URL = "https://api.github.com/user/45130233"

// Get basic user info
const request = new XMLHttpRequest();
request.onreadystatechange = function() {
    if (request.readyState !== 4 || request.status !== 200) return;
    const response = JSON.parse(request.responseText);
    setCookie("name", response["login"], 3600);
    setCookie("html_url", response["html_url"], 3600);
    setCookie("avatar_url", response["avatar_url"], 3600);

    // Select repositories to showcase
    const repoRequest = new XMLHttpRequest();
    repoRequest.onreadystatechange = function() {
        if (repoRequest.readyState !== 4 || repoRequest.status !== 200) return;
        const response = JSON.parse(repoRequest.responseText);
        let j = 0;
        for (let i = 0; i < response.length; i++) {
            const repo = response[i];
            const score = Number(repo["stargazers_count"]) + Number(repo["watchers_count"]);
            if (score < 1 || repo["fork"]) continue;
            document.getElementById("projects").innerHTML += `
                 <div class="${j++ > 2 ? "hidden" : ""}">
                     <h3><a href="${repo["html_url"]}">${repo["name"]}</a></h3>
                     <p>${repo["description"] || ""}</p>
                 </div>
            `;
        }
    }
    repoRequest.open("GET", response["repos_url"], true);
    repoRequest.send(null);
}
request.open("GET", API_URL, true);
request.send(null);

let projectIndex = 0;
function nextProjects() {
    if (projects.length < 4) return;
    projectIndex++;
    const lengthMod = Math.floor(projects.length / 3);
    if (projectIndex > lengthMod) projectIndex = 0;
    if (projectIndex > 0) {
        const j = 3 * projectIndex;
        for (let i = 0; i < 3; i++) {
            projects[j - i - 1].classList.add("hidden");
            projects[j + i]?.classList.remove("hidden");
        }
    } else {
        const j = 3 * lengthMod + 2;
        for (let i = 0; i < 3; i++) {
            projects[j - i]?.classList.add("hidden");
            projects[i].classList.remove("hidden");
        }
    } setTimeout(nextProjects, 10000);
} setTimeout(nextProjects, 10000);