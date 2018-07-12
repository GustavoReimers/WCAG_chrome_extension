
$(document).ready(function () {
  let cite = document.getElementsByClassName('s');
  let link = document.getElementsByClassName('r');
  let rc = document.getElementsByClassName('rc');
  let tags = [];
  var rate = 55;
  // var spanActive = "<span class='checked'><img ref='star' src='http://pngimg.com/uploads/red_star/red_star_PNG35.png'></span>";
  // var spanInActive = "<span class=''></span>";
  var spanActive = "<span class='checked'><img ref='star' src='http://pngimg.com/uploads/star/star_PNG41450.png'></span>";
  var spanInActive = "<span class='unchecked'><img ref='star' src='http://pngimg.com/uploads/star/star_PNG41451.png'></span>";
   var loading = "<span class='unchecked'><img ref='loading' src='https://www.dabur.com/daburhonitus/images/preloader.gif'></span>";

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

if (rc.length < 0) {
    return;
  }


let checkloading = ( index) => {
    // var rating = score * 5;
    

    var tag1 = "<div class='wcag-rating'><span><b style='color:gray;'>Accessibility rating: &nbsp;</b></span>";
   // for (var i = 1; i <= Math.floor(rating); i++) {
    tag1 += loading;
    tag1 += "</div>";

    let elt = rc[index];
    tags.push($(tag1).insertAfter(elt))
  }
  
   



  let checkAXS = (score, index) => {
    // var rating = score * 5;
    var rating=0;
    if(score>=0.95) rating=5;
    if(score>=0.8 && score<0.95) rating=4;
    if(score>=0.6 && score<0.8) rating=3;
    if(score>=0.4 && score<0.6) rating=2;
    if(score>=0.2 && score<0.4) rating=1;

    var tag = "<div class='wcag-rating'><span><b style='color:gray;'>Accessibility rating: &nbsp;</b></span>";
   // for (var i = 1; i <= Math.floor(rating); i++) {
    for (var i = 1; i <= rating; i++) {
      tag += spanActive;
    }
    for (var j = 0; j < (5 - rating); j++) {
      tag += spanInActive;
    }
      tag += "</div>";

    let elt = rc[index];
    tags[index].replaceWith(tag);

   // $(tag).insertAfter(elt);
  }

   var k = 0;

   for (var i = 0; i <= rc.length; i++) {
     checkloading(i)
   }
  getScore(k);

  function getScore(index) {
    console.log(rc.length);
    if (k >= rc.length) {
      return;
    }
    var el = rc[index];
    console.log("rc+++++",rc[k])
    var url = $(el).find(".r a").attr('href');
    console.log("url+++++",url)
    url = `https://stackfull.me/?site=${url}`
    // checkloading(k)
    console.log(url, index)

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
