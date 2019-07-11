const staticAssets = [
    "/",
    "./index.html",
    "./index.css",
    "./app.js",
];

self.addEventListener("install",async e => {
    const cache = await caches.open("demo");
    cache.addAll(staticAssets);
});

self.addEventListener("fetch", e => {
    const request = e.request;
    const url = new URL(request.url);
    if(url.origin === location.origin){
        console.log("Serving cached request");
        e.respondWith(cacheFirst(request))
    }
    else{
        console.log("Serving from network");
        e.respondWith(networkFirst(request));
        e.waitUntil(update(request));
    }
    // console.log("Cached");
})


function refresh(response){
    return self.clients.matchAll().then(function(clients){
        clients.forEach(element => {
            var message = {
                type:"refresh",
                url: response.url,
                eTag: response.headers.get('Etag'),
            };
            client.postMessage(JSON.stringify(message));
        });
    })
}


// async function cacheFirst(request) {
//     const cacheResponse = await caches.match(request);
//     return cacheResponse ||  fetch(request);
    
// }

function cacheFirst(request){
    return caches.open("demo").then(function(cache){
        return cache.match(request).then(function(matching){
            return matching || Promise.reject("Unable to find cache match");
        })
    })
}

async function networkFirst(request){
    const cache = await caches.open("demo");
    try{
        const res = await fetch(request);
        cache.put(request,res.clone());
        return res;
    }catch(e){
        return await cache.match(request);
    }
}

function update(request){
    return caches.open("demo").then((function(cache){
        return fetch(request).then(function(response){
            return cache.put(request,response);
        });
    }));
}

