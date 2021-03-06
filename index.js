//PROVIDE INPUT TO THIS FILE
var Algebrite = require('algebrite');

function gcd(a, b) {
    return (b) ? gcd(b, a % b) : a;
}

function convert(_decimal) {
    //console.log(_decimal);
    if (_decimal == parseInt(_decimal)) {
        return _decimal;
    } else {
        var top = _decimal.toString().includes(".") ? _decimal.toString().replace(/\d+[.]/, '') : 0;
        var bottom = Math.pow(10, top.toString().replace('-', '').length);
        if (_decimal >= 1) {
            top = +top + (Math.floor(_decimal) * bottom);
        } else if (_decimal <= -1) {
            top = +top + (Math.ceil(_decimal) * bottom);
        }

        var x = Math.abs(gcd(top, bottom));
        return top + "/" + bottom;
    }
};




function solve(fN, varMap, key) {
    while (fN.indexOf(key) >= 0) {
        fN = fN.replace(key, "x");
    }
    var splitString = fN.split(" ");
    var substitutedStr = "";
    for (var i = 0; i < splitString.length; i++) {
        if (varMap.has(splitString[i])) {
            //console.log(knowns.get(splitString[i]));
            splitString[i] = convert(varMap.get(splitString[i]));
        }
        substitutedStr += splitString[i];
        //console.log(substitutedStr);

    }
    console.log(substitutedStr);
    //THIS IS WHERE YOU OUTPUT THJE SOLUTION TO THE UI
    var sol = Algebrite.nroots(substitutedStr);
    //console.log(sol);
    if (sol.tensor == null) {
        return sol.d;
    } else {
        tempA = "";
        for (bruh = 0; bruh < sol.tensor.elem.length; bruh++) {
            //for when x has more than 1 answer
            tempA = tempA + ", " + sol.tensor.elem[bruh].d;
        }
        return tempA;
    }
}

var letter_size = 6;
var input;
var output;
// var varList = new Map();

var ctrl_key_down = false;
var data;

/*An array containing all the country names in the world:*/
var autoCompleteList, functionsList, variablesList;

$.getJSON("PhysicsQuestions.json", function (jsonData) {
    data = jsonData;
    functionsList = autoCompleteList = getNames(jsonData);
});

function findWord(word, str) {
    return RegExp('\\b' + word + '\\b').test(str)
}

var iBackup;

function parseInput() {
    input = $('.mainInput');
    scope = {};
    $(".overlay").html("");
    functionName = "#";
    varMap.clear();
    nextLine = "";
    for (ij = 0; ij < input.length; ij++) {
        if (nextLine.length > 0) {
            input[ij].value = "";
            console.log("runned")
        }
        output = stringInput($(input[ij]).val(), $(input[ij]).is(":focus"));
        if (!findWord("function", output)) {
            $(".overlay").html($(".overlay").html() + output + "</br>");
        }
    }
}

var focused;

function updateFocused() {
    if ($(':focus').hasClass("mainInput")) {
        focused = $(':focus');
    }
}

$(document).on('keydown, keyup, mousedown, mouseup', function () {
    updateFocused();
    $('#box').css({ 'left': (letter_size * focused[0].selectionStart) + 'px', 'top': $(focused).offset().top + $(focused).height() });
})

$(document).ready(function () {
    $(".mainInput")[0].focus();
    updateFocused();
})

function addNewLine() {
    // console.log(focused[0].selectionStart);
    $('<input class="mainInput" type="text">').insertAfter(focused);
    // parseInput();
    $(focused).next()[0].defaultValue = focused.val().substring(focused[0].selectionStart, focused.val().length);
    $(focused)[0].value = focused.val().substring(0, focused[0].selectionStart);
    $(focused).next().focus();
}

function removeLine() {
    if ($(focused).prev().length > 0) {
        $(focused).prev().attr("id", "ToBeFocused");
        temp = $("#ToBeFocused")[0].value.length;
        $("#ToBeFocused")[0].value = $("#ToBeFocused")[0].value + focused.val().substring(focused[0].selectionStart, focused.val().length);
        $(focused).remove();
        $("#ToBeFocused").focus();
        $("#ToBeFocused")[0].setSelectionRange(temp, temp);
        $("#ToBeFocused").attr("id", "");
    }
}
// $(".mainInput").on('input', function () {
//   parseInput();
// });

$(".mainInputContainer").on('keydown', function (e) {
    autocomplete = false;
    if (e.which == 17) {
        ctrl_key_down = true;
    }
    if ($("#autocomplete-list").children().length > 0) {
        var x = document.getElementById("autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            e.preventDefault();
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            e.preventDefault();

            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        } else if (e.keyCode == 27) {
            closeAllLists();
        } else {
            autocomplete = true;
        }
    } else {
        if (e.which == 8 && focused[0].selectionStart == 0) {
            e.preventDefault();
            removeLine();
        } else if (e.which == 40) {
            if ($(focused).next().length <= 0) return;
            e.preventDefault();
            $(focused).next().attr("id", "ToBeFocused");
            // console.log(focused[0].selectionStart);
            $("#ToBeFocused").focus();
            $("#ToBeFocused")[0].setSelectionRange(focused[0].selectionStart, focused[0].selectionStart);
            $("#ToBeFocused").attr("id", "");
        } else if (e.which == 38) {
            if ($(focused).prev().length <= 0) return;
            e.preventDefault();
            $(focused).prev().attr("id", "ToBeFocused");
            // console.log(focused[0].selectionStart);
            $("#ToBeFocused").focus();
            $("#ToBeFocused")[0].setSelectionRange(focused[0].selectionStart, focused[0].selectionStart);
            $("#ToBeFocused").attr("id", "");
        } else if (e.which == 13) {
            //enter key
            addNewLine();
        } else {
            autocomplete = true;
        }
    }

})

$(".mainInputContainer").on('keyup', function (e) {

    if (e.which == 17) {
        ctrl_key_down = false;
    }
    if (autocomplete) autocomplete_input_change(autoCompleteList, e.which);
    parseInput();
    $('#box').css({ 'left': (letter_size * focused[0].selectionStart) + 'px', 'top': $(focused).offset().top + $(focused).height() });
    // console.log(e.which)
    updateFocused();
});

var scope = {};
var oldScope = {};

var oldFunctionName = "#";
var functionName = "#";
var varMap = new Map();
var nextLine, tempC;
function stringInput(line, focus) {

    if (line.length <= 0 && !focus && nextLine.length <= 0) return "";
    console.log("tempC", nextLine);
    if (nextLine.length > 0) {
        tempC = nextLine;
        nextLine = "";
        return tempC;
    }
    if (line[0] == '#' && line.length > 1) {
        functionName = line.substring(1, line.length);
        if (functionName == "#") return "";
        else {
            return getVariablesOfFunction(functionName, data).join(", ");
        }
    }

    if (functionName == "#") {
        varMap.clear();
        if (focus) {
            if (oldFunctionName != functionName) {
                console.log("changed auto complete to functions")
                autoCompleteList = functionsList;
                oldFunctionName = functionName;
            }
        }
        try {
            return math.eval(line, scope);
        } catch (e) {
            return "❗️error"
        }
    } else {
        if (focus) {
            if (oldFunctionName != functionName) {
                console.log("changed auto complete to variables")
                // console.log(getVariablesOfFunction(functionName, data));
                variablesList = getVariablesOfFunction(functionName, data);
                autoCompleteList = variablesList;
                oldFunctionName = functionName;

                //console.log(formula);
            }
        }
    }
    if (functionName != "#") {
        if (variablesList.length > varMap.size + 1) {
            var splitStr;

            splitStr = line.split("=");
            if (splitStr.length > 1 && splitStr[1] != "") {
                console.log(splitStr[1].trim().length);
                if(splitStr[1].trim().length>0){
                    varMap.set(splitStr[0].trim(), splitStr[1].trim());
                }
            }
            if (variablesList.length == varMap.size + 1) {
                var uk;
                formula = getFormula(functionName, data);
                for (var j = 0; j < variablesList.length; j++) {
                    if (!varMap.has(variablesList[j])) {
                        uk = variablesList[j];
                    }
                }
                tempB = solve(formula, varMap, uk);
                nextLine = uk + " is " + tempB.toString();
                console.log(nextLine);
                //TODO: clear varmap when function task is ended
            }
            if (splitStr.length > 1 && splitStr[1] != "") {
                if(splitStr[1].trim().length>0){
                    return splitStr[1].trim();
                }
            }
            return "";
        } else {
            return ""
        }
    }
}


var currentFocus;
var autocomplete = false;

function autocomplete_input_change(arr, keycode) {
    var a, b, i, val = focused.val();
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    document.getElementById("box").appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        // console.log(arr[i].substr(0, val.length).toUpperCase())
        // console.log(val.length)

        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase() && (val.length != arr[i].length || val.length <= 1)) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function (e) {
                /*insert the value for the autocomplete text field:*/
                $(focused)[0].value = this.children[1].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
        }
    }
    autocomplete = true;
}

function addActive(x) {
    // console.log(x);
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
}

function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
    }
}

function closeAllLists(elmnt) {
    // console.log(focused[0])
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i]) {
            x[i].parentNode.removeChild(x[i]);
        }
    }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});