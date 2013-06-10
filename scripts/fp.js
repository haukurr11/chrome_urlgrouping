function refreshLinks() {
    function open(i) {
         return function () {
         openGroup(i);
        }
    }
    function remove(i) {
         return function () {
            if (window.confirm("Are you sure you want to remove " + i) ) {
             removeGroup(i);
            }
        }
    }
    function addlink(i) {
         return function () {
              var title = prompt("Title of link","");
              var url = prompt("URL of link","http://");
              if(title && url) {
                  addLinkToGroup(i,title,url);
              }
        }
    }

    $('.btn-toolbar').empty();
    chrome.storage.sync.get('link_db', function(result){
      var link_db = result.link_db;
     for(var name in link_db) {
         var div = $('<div class="btn-group"></div>');
         var grp_btn = $('<button class="btn-large btn-inverse">' + name + '</button>');
         grp_btn.click( open(name));
         var toggle = $('<button class="btn-large btn-inverse dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>');
         var list = $('<ul class="dropdown-menu"></ul>');
         for(var it in link_db[name]) {
             var title = link_db[name][it].title;
             var url = link_db[name][it].url;
             var ahref = $('<a group="' + name + '" url="' + url + '" class="remove">' + title + '</a>');
             var link = $('<li></li>');
             var img =  $('<i class="icon-remove"></i>');
             ahref.append(img);
             link.append(ahref);
             list.append(link);
         };
         list.append('<li class="divider"></li>');
         var add_li = $('<li><a class="opna" href="#">Add Link</a></li>');
         add_li.click(addlink(name));
         list.append(add_li);
         var remove_li =  $('<li><a class="opna" href="#">Remove</a></li>');
         remove_li.click(remove(name));
         list.append(remove_li);
         div.append(grp_btn);
         div.append(toggle);
         div.append(list);
         $('.btn-toolbar').append(div);

     }

        $("a.remove").click( function() {
                        var address = $(this).attr("url");
                        var group = $(this).attr("group");
                        if(window.confirm("Are you sure you want to remove " + address))
                           {
                              removeLinkFromGroup(group,address);
                           }
             });
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
              linklist.url.push(urls[item].url);
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
    $("#new-workspace").click( function() {
        var name  = prompt("Name of Workspace","");
        if(name) {
        createGroup(name);
        }
    });
});
