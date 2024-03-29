
var SEARCH_QUERY = 'snooker';

var TwitterSearch = {

   seaarchUrl_: "https://search.twitter.com/search.json?q=" + encodeURIComponent(SEARCH_QUERY) + "&" +
                "rpp=15&include_entities=true&with_twitter_user_id=true&result_type=mixed",

  /**
   * Sends an XHR GET request to grab tweets. The
   * XHR's 'onload' event is hooks up to the 'showTweets_' method.
   *
   * @public
   */
  searchTwitter: function() {
    this._createLoadingOverlay();

    var req = new XMLHttpRequest();
    req.open("GET", this.seaarchUrl_, true);
    req.onload = this._showTweets.bind(this);
    req.send(null);
  },

  /**
   * Handle the 'onload' event our XHR request, generated in
   * 'searchTwitter'
   *
   * @param {ProgressEvent} e The XHR ProgressEvent.
   * @private
   */
  _showTweets: function (e) {

    var hashtag, tweets, myDiv, myImg, myH3, myText,
        usernameUrl, statusUrl, myImgAnchor, username,
        display_name, spacer;

    this._removeLoadingOverlay();

    hashtag = document.createElement("h1");
    hashtag.id = 'hashtag';
    hashtag.innerHTML = '#' + SEARCH_QUERY;
    document.body.appendChild(hashtag);

    tweets = JSON.parse(e.target.response).results;

    for (var i = 0; i < tweets.length; i++) {

      usernameUrl = 'https://twitter.com/' + tweets[i].from_user;
      statusUrl = usernameUrl + '/status/' + tweets[i].id;

      myDiv = document.createElement("div");
      myDiv.className = 'tweet clearfix';

      myImgAnchor = document.createElement('a');
      myImgAnchor.className = 'profile_image';
      myImgAnchor.href = usernameUrl;
      myImgAnchor.display = 'block';

      myImg = document.createElement('img');
      myImg.src = tweets[i].profile_image_url;

      myImgAnchor.appendChild(myImg);

      myH3 = document.createElement("h3");

      username = document.createElement('a');
      username.className = 'username';
      username.href = usernameUrl;
      username.innerHTML = tweets[i].from_user_name;

      display_name = document.createElement('a');
      display_name.className = 'display_name';
      display_name.href = usernameUrl;
      display_name.innerHTML = "@" + tweets[i].from_user;

      spacer = document.createElement('span');
      spacer.innerHTML = ' ';

      myH3.appendChild(username);
      myH3.appendChild(spacer);
      myH3.appendChild(display_name);

      assignClick.call(username, usernameUrl);
      assignClick.call(display_name, usernameUrl);
      assignClick.call(myImgAnchor, usernameUrl);

      myText = document.createElement("div");
      myText.className = 'text';
      myText.innerHTML = tweets[i].text;
      myText.innerHTML += "<div class='timeago'>" + prettyDate(tweets[i].created_at) + "</div>";

      myDiv.appendChild(myH3);
      myDiv.appendChild(myImgAnchor);
      myDiv.appendChild(myText);

      document.body.appendChild(myDiv);
    }
  },
  /**
   * Create the overlay for showing loading text.
   * @private
   * @return {[type]} [description]
   */
  _createLoadingOverlay: function() {
    var loading;
    loading = document.createElement("div");
    loading.id = 'loading';
    loading.innerHTML = 'Loading ...';
    document.body.appendChild(loading);
  },
  /**
   * Remove the loading overlay text.
   * @private
   * @return void
   */
  _removeLoadingOverlay: function() {
    document.body.removeChild(document.getElementById("loading"));
  }
};

// Run script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  TwitterSearch.searchTwitter();
});

// Helpers

function assignClick(url) {
  this.addEventListener("click", function() {
    chrome.tabs.create({'url': url});
  });
}

// Takes an ISO time and returns a string representing how
// long ago the date represents.
function prettyDate(time){
  var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
    diff = (((new Date()).getTime() - date.getTime()) / 1000),
    day_diff = Math.floor(diff / 86400);

  if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
    return;

  return day_diff == 0 && (
      diff < 60 && "just now" ||
      diff < 120 && "1 minute ago" ||
      diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
      diff < 7200 && "1 hour ago" ||
      diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
    day_diff == 1 && "Yesterday" ||
    day_diff < 7 && day_diff + " days ago" ||
    day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
}
