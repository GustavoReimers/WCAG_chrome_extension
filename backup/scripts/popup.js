/////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-109917224-1']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

$(document).ready(function () {
////////////////////////////////////


///////////////////////////////////

    var buttons = $("button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', trackButtonClick);
    }

    var toolBtns = $(".toolbarBtn");
    for (var ii = 0; ii < toolBtns.length; ii++) {
        toolBtns[ii].addEventListener('click', trackButtonClick);
    }

    function trackButtonClick(e) {
        var id = e.currentTarget.innerText;
        if (!id || id === "") id = e.currentTarget.title;
        _gaq.push(['_trackEvent', id, 'clicked']);
    }

    getSelectedTab = function () {
        var dfd = $.Deferred();

        chrome.tabs.query({
            "active": true,
            "currentWindow": true
        }, function (tabs) {
           // alert(tabs[0]);            
            dfd.resolve(tabs[0]);
        });

    //     chrome.tabs.query({
    //         currentWindow: false, 
    //         active: true
    //     }, function (tabs) {
    //         var tab=tabs[0];
    //         chrome.tabs.update(tab.id, {url: "https://www.w3schools.com/html"});
    //         dfd.resolve(tab);

    //   });

        return dfd.promise();
    };

    validateTab = function (tab) {
        var dfd = $.Deferred();
        var url = tab.url;
        if (url.indexOf("chrome://") === 0 || url.indexOf("chrome-extension://") === 0) {
         //   dfd.reject("Warning: Does not work on internal browser pages.");
        } else if (url.indexOf("https://chrome.google.com/extensions/") === 0 || url.indexOf("https://chrome.google.com/webstore/") === 0) {
         //   dfd.reject("Warning: Does not work on the Chrome Extension Gallery.");
        } else {
            dfd.resolve();
        }

        return dfd.promise();
    };

    showStat = function ($cb) {
        var cls = $cb.attr('id').substr(2).toLowerCase();
        var $rows = $('#resultsList .' + cls);
        var show = $cb.is(':checked');
        
        if (show) {
            $rows.removeClass('hide');
             chrome.browserAction.setIcon({path: '/images/on.png'});  

             chrome.tabs.getSelected(null, function(tab) {
              // Send a request to the content script.
              chrome.tabs.sendRequest(tab.id, {action: "show"}, function(response) {
                console.log(response);
              });
            });

        } else {
            $(".rc").hide();
            $(".rc").addClass('hide');
            $rows.addClass('hide');
            $(".checked").addClass('hide');
            chrome.browserAction.setIcon({path: '/images/off.png'});

            chrome.tabs.getSelected(null, function(tab) {
              // Send a request to the content script.
              chrome.tabs.sendRequest(tab.id, {action: "hide"}, function(response) {
                console.log(response);
              });
            });
        }
        saveOption(cls.toUpperCase(), show);
    };

    saveOption = function (key, value) {
        var obj = {};
        obj[key] = value;
        chrome.storage.sync.set(obj);
        //chrome.storage.sync.get(null, function (data) { console.info(data) })
        options[key] = value;
    };

    $.each($('img'), function (index, value) {
        $value = $(value);
        $value.attr('src', chrome.extension.getURL($value.attr('src'))).attr('alt', '');
    });

    var options = null;
    // var Background = null;
    var dfr = $.Deferred();
    getOptionOrDefault = function(data, option, value) {
        if(data[option] === undefined) {
            data[option] = value;
        }
        return data[option];
    };
    
    chrome.storage.sync.get(null,
        function(data) {
            options = {
                type:'defaults',
                PASS : getOptionOrDefault(data, 'PASS', true),
                NA : getOptionOrDefault(data, 'NA', false),
                version: chrome.runtime.getManifest().version,
            };
            dfr.resolve(options);
        });
    getSelectedTab().done(
        function (tab) {
            validateTab(tab).always(
                function (err) {
                    if (err) {
                        alert(err);
                    } else {
                        if (options.PASS) {
                            $('#cbPass').attr('checked', '');

                            chrome.browserAction.setIcon({
                                path: '/images/on.png'
                            });
                                // document.location.reload();
                                // window.location.reload();
                            chrome.tabs.getSelected(null, function(tab) {
                                chrome.tabs.sendRequest(tab.id, {action: "show"}, function(response) {
                                    console.log(response);
                                });
                            });
                        } else {
                            $('#cbPass').removeAttr('checked');
                            chrome.browserAction.setIcon({
                                path: '/images/off.png'
                            });   
                            chrome.tabs.getSelected(null, function(tab) {
                                chrome.tabs.sendRequest(tab.id, {action: "hide"}, function(response) {
                                    console.log(response);
                                });
                            });
                        }
                        if (options.NA) $('#cbNA').attr('checked', '');
                        else $('#cbNA').removeAttr('checked');
                        $('#filterResults input[type=checkbox]').change(function () {
                            showStat($(this));
                        });
                    }
                }
            );
        }
    );
});