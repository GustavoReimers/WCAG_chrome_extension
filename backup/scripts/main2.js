
$(document).ready(function () {
  let cite = document.getElementsByClassName('s');
  let link = document.getElementsByClassName('r');
  let rc = document.getElementsByClassName('rc');

  var spanActive = "<span class='checked'><img ref='star' src='http://pngimg.com/uploads/star/star_PNG41450.png'></span>";
  var spanInActive = "<span class='unchecked'><img ref='star' src='http://pngimg.com/uploads/star/star_PNG41451.png'></span>";
  var loading = "<span class='unchecked'><img ref='star' src='http://blog.teamtreehouse.com/wp-content/uploads/2015/05/InternetSlowdown_Day.gif'></span>";


  chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    console.log(request.action);
    if (request.action == "show") {
      sendResponse({ action: "show" });
      console.log(request.action);
      $('.wcag-rating').show();
    } else if (request.action == "hide") {
      sendResponse({ action: "hide" });
      console.log("HIDE");
      $('.wcag-rating').hide();
    }
  });

  if (cite.length < 0) {
    return;
  }

  let checkAXS = (score, index) => {
    var rating = score * 5;
    var tag = "<div class='wcag-rating'><span><b style='color:gray;'>Accessibility rating: &nbsp;</b></span>";
    for (var i = 1; i <= Math.floor(rating); i++) {
      tag += spanActive;
    }
    for (var j = 0; j < Math.ceil(5 - rating); j++) {
      tag += spanInActive;
    }
    tag += "</div>";

    let elt = cite[index];
    $(tag).insertAfter(elt);
  }

  var k = 0;

  getScore(k);

  function getScore(index) {
    if (k >= cite.length) {
      return;
    }
    var el = rc[index];
    var url = $(el).find(".r a").attr('href');
    url = `https://stackfull.me/?site=${url}`
    $.get(url, function (data) {
      checkAXS(data.score, k)
      k++;
      getScore(k);
    }).fail(function (e) {
      checkAXS(0, k)
      k++;
      getScore(k);
    })
  }

});
