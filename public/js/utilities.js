
//Object.prototype.MakeAllKeyLowerCase = function () {
//    return MakeAllKeyLowerCase(this);
//}
function MakeAllKeyLowerCase(obj) {
    if (typeof (obj) !== "object" || obj==null) {
        return obj;
    }else{
        var key, keys = Object.keys(obj).reverse();
        var n = keys.length;
        var newobj = {}
        while (n--) {
            key = keys[n];
            // console.log(typeof (obj[key]));
            if (typeof (obj[key]) === "object") {
                try {
                    newobj[key.toLowerCase()] = MakeAllKeyLowerCase(obj[key]);
                } catch (e) {

                }
            } else {
                newobj[key.toLowerCase()] = obj[key];
                //console.log(obj[key]);
            }
        }
        // console.log(newobj);
        return newobj;
    }
}

function keysToLower(obj) {
    return MakeAllKeyLowerCase(obj);
}
function MakeObjectGeneric(obj) {
    if (typeof (obj) !== "object") {
        return obj;
    } else {
        var key, keys = Object.keys(obj);
        var n = keys.length;
        var newobj = {}
        while (n--) {
            key = keys[n];
            // console.log(typeof (obj[key]));
            if (typeof (obj[key]) === "object") {
                try {
                    newobj[key.toLowerCase()] = MakeAllKeyLowerCase(obj[key]);
                } catch (e) {

                }
            } else {
                newobj[key.toLowerCase()] = obj[key];
                //console.log(obj[key]);
            }
        }
        // console.log(newobj);
        return newobj;
    }
}

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
              : match
            ;
        });
    };
}

if (!String.prototype.toSentence) {
    String.prototype.toSentence = function () {
        return this
    // insert a space before all caps
    .replace(/([A-Z])/g, ' $1')
    // uppercase the first character
    .replace(/^./, function (str) { return str.toUpperCase(); });
    };
};

function initSlide() {
    $('.slider').slider({ full_width: true });
  //  alert('hey');
};

var ToastSuccess = function (Message, Title) {
    if (typeof (Message) == "undefined") {
        Message = "Great! All done."
    }
    if (typeof (Title) == "undefined") {
        Title = "Great!"
    }
    var html = '<div class="teal-text text-lighten-2" ><div class="flow-text">{0}</div></div>'.format(
         Message
        );
    // Materialize.toast(message, displayLength, className, completeCallback);
    Materialize.toast(html, 4000); // 4000 is the duration of the toast
}
var ToastError = function (Message, Title) {
    if (typeof (Message) == "undefined") {
        Message = "Oh no! There was a problem."
    }
    if (typeof (Title) == "undefined") {
        Title = "Great!"
    }
    var html = '<div class="red-text text-lighten-2" ><div class="flow-text">{0}</div></div>'.format(
         Message
        );
    // Materialize.toast(message, displayLength, className, completeCallback);
    Materialize.toast(html, 4000); // 4000 is the duration of the toast
}

var ToastInfo = function (Message, Title) {
    if (typeof (Message) == "undefined") {
        Message = "Something  like this."
    }
    if (typeof (Title) == "undefined") {
        Title = "Great!"
    }
    var html = '<div class="blue-text text-lighten-2" ><div class="flow-text">{0}</div></div>'.format(
         Message
        );
    // Materialize.toast(message, displayLength, className, completeCallback);
    Materialize.toast(html, 4000); // 4000 is the duration of the toast
}

var ToastPrimary = function (Message, Title) {
    if (typeof (Message) == "undefined") {
        Message = "Something  like this."
    }
    if (typeof (Title) == "undefined") {
        Title = "Great!"
    }
    var html = '<div class="white-text text-lighten-2" ><div class="flow-text">{0}</div></div>'.format(
         Message
        );
    // Materialize.toast(message, displayLength, className, completeCallback);
    Materialize.toast(html, 4000); // 4000 is the duration of the toast
}
$(document).ready( function () {
    $('.modal-trigger').leanModal();
    $("body").on("click", ".collapsible-menu .handle", function () {
        //alert("nadine");
        $(".collapsible-menu-item").not($(this).parents(".collapsible-menu-item")).removeClass("active");
        $(this).parents(".collapsible-menu-item").toggleClass("active");
    })

    $('.tooltipped').tooltip({ delay: 50 });
});