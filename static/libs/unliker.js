// Set up Facebook SDK

window.fbAsyncInit = function() {
    FB.init({
        appId       :   "346014018805390",
        channelUrl  :   "//unliker.prealfa.com/fb/channel.html",
        status      :   true,
        cookie      :   true,
        xfbml       :   true
    });
};

// Load SDK Async

// Load the SDK Asynchronously
(function(d){
  var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement('script'); js.id = id; js.async = true;
  js.src = "//connect.facebook.net/en_US/all.js";
  ref.parentNode.insertBefore(js, ref);
}(document));

// Global logged-in variable
window.LoggedIn = false;

// Global config
window.LikesPerPage = 5000;


// Stuff about actually unliking shit

window.id_list = Array();

function SetSubscriptions() {
    FB.Event.subscribe('auth.statusChange',
        function(response) {
            console.log("[i] Login status: " + response.status);
            if (response.status === 'connected') {
            // Logged in and authorized
                window.LoggedIn = true;
                window.uid = response.authResponse.userID;
                window.accessToken = response.authResponse.accessToken;
            } else {
                window.LoggedIn = false;
            }
            ShowContent();
        }
    );
    FB.Event.subscribe('edge.remove', function(response) {
        //console.log("[--] #" + response);
        $("#"+response).fadeOut();
    });
}

function like_button(link) {
    var element = $(document.createElement("fb:like"));
    element.attr("href", link);
    element.attr("send", "false");
    element.attr("layout", "button_count");
    element.attr("show_faces", "false");
    return element;
}


// UI and FB stuff

function LogOut() {
    FB.logout(function(response) {
        location.reload();
    });
    return false;
}

function LogIn() {
    FB.login(function(response) {
        if (response.authoResponse) {
            console.log('[+] Logged in');
        } else {
            // User cancelled or didn't authorize
        }
    }, {scope: 'user_likes,user_interests,user_activities'});
}

function TryLogin()
{
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            // Logged on and authorized
            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;
        } else if (response.status == 'not_authorized') {
            // Logged in but not authorized
            LogIn();
        } else {
            // Not logged in
            LogIn();
        }
    });
    return false;
}

var likeslist = Array();
function BuildLikesList(page, parent_selector)
{
    FB.api('/me/likes?limit=' + window.LikesPerPage + "&offset=" + window.LikesPerPage * page, 
    function(response) {
        for (var i = 0; i < response.data.length; i++) {
            likeslist.push({
                name : response.data[i].name,
                category : response.data[i].category,
                id : response.data[i].id,
                created_time : response.data[i].created
            });
        }
        PopulateLikesList(likeslist, parent_selector);
    });
}

function PopulateLikesList(likeslist, parent_selector) {
    // Asynchronously populate the list with all the data
    for (var i = 0; i < likeslist.length; i++) {
        // Retrieve relevant data for the given page and process async
        FB.api('/' + likeslist[i].id, function(response) {
            AppendToList(parent_selector, response.id, response.name, response.picture, response.link);
            //if (LastAdded(likeslist)) {
            //    FB.XFBML.parse($(parent_selector).get(0));
            //}

        });
    }
}

window.added = 0;
function LastAdded(likeslist) {
    window.added++;
    if (window.added >= window.likeslist.length) {
        return true;
    } else {
        return false;
    }
}

function AppendToList(parent_selector, id, name, picture, link) {
    // Append to the HTML list
    var cnt = $(document.createElement("div")).addClass("container");
    var li = $(document.createElement("li")).attr("id", link);
    cnt.attr("id", id);
    cnt.append($(document.createElement("img")).attr("src", picture));
    cnt.append($(document.createElement("a")).attr("href", link).html(name));
    cnt.append(like_button(link));
    $(li).append(cnt);
    $(parent_selector).append(li);
    FB.XFBML.parse(li.get(0));
    
}


function LoadApplication() {
    BuildLikesList(0, "#MainList");
}

function SetEventHandlers()
{
    $("#LoginButton").click(TryLogin);
    $("#LogoutButton").click(LogOut);

}

function SetListEventHandlers() {
    $("li.Page").click(function() {
        $(this).toggleClass("forDeletion");
        AddToDelete($(this).attr("id"));
    });
}

function ShowContent() {
    if (window.LoggedIn == true)
    {
        // User has logged in so we can go ahead and show the app
        $("section#content").css("display", "block");
        $("#LogoutButton").css("display", "block");
        $("section#login").css("display", "none");
        LoadApplication();
    } else {
        // Nothing to see here
    }
}

// Ready event

$(window).load(function() {
    SetSubscriptions();
    SetEventHandlers();
});
