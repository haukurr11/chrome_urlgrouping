function refreshLinks() {
    chrome.storage.sync.get('link_db', function(result){
        //TODO
    });
}

function openGroup(groupname) {
    var urls = undefined; 
    var linklist = {'url':[]} 
    chrome.storage.sync.get('link_db', function(result){
        urls = result.link_db[groupname];
        if(!urls) {
           console.log("Error: No group by name:" + groupname);
           return;
        }
        else {
           for(var item in urls) {
              linklist.url.push(urls[item].address);
           }
           chrome.windows.create(linklist);
        }
    });
}

function createGroup(groupname) {
    chrome.storage.sync.get('link_db', function(result){
       if(result.link_db[groupname]) {
           alert("GROUP '" + groupname + "' ALREADY EXISTS");
           return;
       }
       else {
            result.link_db[groupname] = [];
            chrome.storage.sync.set({'link_db': result.link_db},function() {
                refreshLinks(); }
            );
        }
       }
    );
}

function removeGroup(groupname) {
    chrome.storage.sync.get('link_db', function(result){
            delete result.link_db[groupname];
            chrome.storage.sync.set({'link_db': result.link_db},function() {
                refreshLinks(); 
                }
            );
        });
}

function addLinkToGroup(groupname,title,url) {
    var link = { "title" : title, "url": url }
    chrome.storage.sync.get('link_db', function(result){
       if(!result.link_db[groupname]) {
           alert("GROUP '" + groupname + "' DOES NOT EXISTS");
           return;
           }
       else {
           console.log(result.link_db[groupname]);
           for(var l in result.link_db[groupname]) {
               console.log(result.link_db[groupname][l].url);
               if (result.link_db[groupname][l].url === url) {
                   alert("LINK '" + url + "' ALREADY EXISTS IN GROUP " + groupname);
                   return;
               }
           }
           result.link_db[groupname].push(link);
           chrome.storage.sync.set({'link_db': result.link_db},function() {
                refreshLinks(); 
                console.log("hello");
           });
        }
    });
}

function removeLinkFromGroup(groupname,url) {
    chrome.storage.sync.get('link_db', function(result){
       if(!result.link_db[groupname]) {
           alert("GROUP '" + groupname + "' DOES NOT EXISTS");
           return;
           }
       else {
           for(var l in result.link_db[groupname]) {
               if (result.link_db[groupname][l].url === url) {
                  delete result.link_db[groupname][l];
                  break;
               }
           }
           chrome.storage.sync.set({'link_db': result.link_db},function() {
                refreshLinks(); 
           });
        }
    });
}

function editLinkFromGroup(groupname,prevurl,title,url) {
    chrome.storage.sync.get('link_db', function(result){
       if(!result.link_db[groupname]) {
           alert("GROUP '" + groupname + "' DOES NOT EXISTS");
           return;
           }
       else {
           for(var l in result.link_db[groupname]) {
               if (result.link_db[groupname][l].url === prevurl) {
                   result.link_db[groupname][l].url = url;
                   result.link_db[groupname][l].title = title;
               }
           }
           chrome.storage.sync.set({'link_db': result.link_db},function() {
                refreshLinks(); 
           });
        }
    });
}

$(document).ready(function() {
    refreshLinks();
});
