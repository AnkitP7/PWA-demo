const main = document.querySelector("main");

window.addEventListener("load", e => {
    loadUsers();
});

async function loadUsers(){
    const response = await fetch("https://randomuser.me/api/?results=50")
    const json = await response.json();

    main.innerHTML = json.results.map(createUser);
}

if("serviceWorker" in navigator){
    try{
        navigator.serviceWorker.register("sw.js");
        navigator.serviceWorker.onmessage = function(e){
            var message = JSON.parse(e.data);
            var isRefreshed = message.type === "refresh";
            var isAsset = message.url.includes("asset");
            var lastEtag = localStorage.currentETag;

            var isNew = lastEtag !== message.eTag;

            if(isRefreshed && isAsset){
                if(lastEtag)
                    notice.hidden = false;
            }

            localStorage.currentETag = message.eTag;
        }

        var notice = document.querySelector("notice");

    }catch(e){
        console.log(e);
    }
}

function createUser(user){
    return `
        <div class="users">
            <div class="user-header">
                <img class="user-image" src=${user.picture.large} height="50px" width="50px">
            <div>
            <b>${user.name.first} ${user.name.last}</b>
            <h5>${user.email}</h5>
            <div class="address">
                <p>${user.location.street}</p>
                <p>${user.location.city}</p>
                <p>${user.location.state}</p>
                <p>${user.location.postcode}</p>
            </div>
        </div>  
    `;
}