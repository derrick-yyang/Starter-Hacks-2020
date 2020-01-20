(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
        for (var i = 0; i < sol.tensor.elem.length; i++) {
            //for when x has more than 1 answer
            tempA = tempA + ", " + sol.tensor.elem[i].d;
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
},{"algebrite":2}],2:[function(require,module,exports){
// Generated by CoffeeScript 1.12.7
(function() {
  var $, ABS, ADD, ADJ, AND, APPROXRATIO, ARCCOS, ARCCOSH, ARCSIN, ARCSINH, ARCTAN, ARCTANH, ARG, ASSUME_REAL_VARIABLES, ATOMIZE, AUTOEXPAND, BAKE, BESSELJ, BESSELY, BINDING, BINOMIAL, BINOM_check_args, BUF, C1, C2, C3, C4, C5, C6, CEILING, CHECK, CHOOSE, CIRCEXP, CLEAR, CLEARALL, CLEARPATTERNS, CLOCK, COEFF, COFACTOR, CONDENSE, CONJ, CONS, CONTRACT, COS, COSH, Condense, DEBUG, DEBUG_ABS, DEBUG_ARG, DEBUG_CLOCKFORM, DEBUG_IMAG, DEBUG_IS, DEBUG_POWER, DEBUG_RECT, DECOMP, DEFINT, DEGREE, DENOMINATOR, DERIVATIVE, DET, DET_check_arg, DIM, DIRAC, DIVISORS, DO, DOT, DOUBLE, DRAW, DRAWX, DSOLVE, E, EIGEN, EIGENVAL, EIGENVEC, EIG_N, EIG_check_arg, EIG_yydd, EIG_yyqq, ERF, ERFC, EVAL, EXP, EXPAND, EXPCOS, EXPSIN, Eval, Eval_Eval, Eval_abs, Eval_add, Eval_adj, Eval_and, Eval_approxratio, Eval_arccos, Eval_arccosh, Eval_arcsin, Eval_arcsinh, Eval_arctan, Eval_arctanh, Eval_arg, Eval_besselj, Eval_bessely, Eval_binding, Eval_binomial, Eval_ceiling, Eval_check, Eval_choose, Eval_circexp, Eval_clear, Eval_clearall, Eval_clearpatterns, Eval_clock, Eval_coeff, Eval_cofactor, Eval_condense, Eval_conj, Eval_cons, Eval_contract, Eval_cos, Eval_cosh, Eval_decomp, Eval_defint, Eval_degree, Eval_denominator, Eval_derivative, Eval_det, Eval_dim, Eval_dirac, Eval_divisors, Eval_do, Eval_dsolve, Eval_eigen, Eval_eigenval, Eval_eigenvec, Eval_erf, Eval_erfc, Eval_exp, Eval_expand, Eval_expcos, Eval_expsin, Eval_factor, Eval_factorial, Eval_factorpoly, Eval_filter, Eval_float, Eval_floor, Eval_for, Eval_function_reference, Eval_gamma, Eval_gcd, Eval_hermite, Eval_hilbert, Eval_imag, Eval_index, Eval_inner, Eval_integral, Eval_inv, Eval_invg, Eval_isinteger, Eval_isprime, Eval_laguerre, Eval_lcm, Eval_leading, Eval_legendre, Eval_log, Eval_lookup, Eval_mod, Eval_multiply, Eval_noexpand, Eval_not, Eval_nroots, Eval_number, Eval_numerator, Eval_operator, Eval_or, Eval_outer, Eval_pattern, Eval_patternsinfo, Eval_polar, Eval_power, Eval_predicate, Eval_prime, Eval_print, Eval_print2dascii, Eval_printcomputer, Eval_printhuman, Eval_printlatex, Eval_printlist, Eval_product, Eval_quote, Eval_quotient, Eval_rank, Eval_rationalize, Eval_real, Eval_rect, Eval_roots, Eval_round, Eval_setq, Eval_sgn, Eval_shape, Eval_silentpattern, Eval_simfac, Eval_simplify, Eval_sin, Eval_sinh, Eval_sqrt, Eval_stop, Eval_subst, Eval_sum, Eval_sym, Eval_symbolsinfo, Eval_tan, Eval_tanh, Eval_taylor, Eval_tensor, Eval_test, Eval_testeq, Eval_testge, Eval_testgt, Eval_testle, Eval_testlt, Eval_transpose, Eval_unit, Eval_user_function, Eval_zero, Evalpoly, FACTOR, FACTORIAL, FACTORPOLY, FILTER, FLOATF, FLOOR, FOR, FORCE_FIXED_PRINTOUT, FUNCTION, Find, GAMMA, GCD, HERMITE, HILBERT, IMAG, INDEX, INNER, INTEGRAL, INV, INVG, INV_check_arg, INV_decomp, ISINTEGER, ISPRIME, LAGUERRE, LAST, LAST_2DASCII_PRINT, LAST_FULL_PRINT, LAST_LATEX_PRINT, LAST_LIST_PRINT, LAST_PLAIN_PRINT, LAST_PRINT, LCM, LEADING, LEGENDRE, LOG, LOOKUP, M, MAXDIM, MAXPRIMETAB, MAX_CONSECUTIVE_APPLICATIONS_OF_ALL_RULES, MAX_CONSECUTIVE_APPLICATIONS_OF_SINGLE_RULE, MAX_FIXED_PRINTOUT_DIGITS, MAX_PROGRAM_SIZE, MEQUAL, METAA, METAB, METAX, MLENGTH, MOD, MSIGN, MULTIPLY, MZERO, N, NIL, NOT, NROOTS, NROOTS_ABS, NROOTS_DELTA, NROOTS_EPSILON, NROOTS_RANDOM, NROOTS_YMAX, NROOTS_divpoly, NSYM, NUM, NUMBER, NUMERATOR, OPERATOR, OR, OUTER, PATTERN, PATTERNSINFO, PI, POLAR, POWER, PRIME, PRINT, PRINT2DASCII, PRINTFULL, PRINTLATEX, PRINTLIST, PRINTMODE_2DASCII, PRINTMODE_COMPUTER, PRINTMODE_HUMAN, PRINTMODE_LATEX, PRINTMODE_LIST, PRINTOUTRESULT, PRINTPLAIN, PRINT_LEAVE_E_ALONE, PRINT_LEAVE_X_ALONE, PRODUCT, QUOTE, QUOTIENT, RANK, RATIONALIZE, REAL, ROOTS, ROUND, SECRETX, SELFTEST, SETQ, SGN, SHAPE, SILENTPATTERN, SIMPLIFY, SIN, SINH, SPACE_BETWEEN_COLUMNS, SPACE_BETWEEN_ROWS, SQRT, STOP, STR, SUBST, SUM, SYM, SYMBOLSINFO, SYMBOL_A, SYMBOL_A_UNDERSCORE, SYMBOL_B, SYMBOL_B_UNDERSCORE, SYMBOL_C, SYMBOL_D, SYMBOL_I, SYMBOL_IDENTITY_MATRIX, SYMBOL_J, SYMBOL_N, SYMBOL_R, SYMBOL_S, SYMBOL_T, SYMBOL_X, SYMBOL_X_UNDERSCORE, SYMBOL_Y, SYMBOL_Z, TAN, TANH, TAYLOR, TENSOR, TEST, TESTEQ, TESTGE, TESTGT, TESTLE, TESTLT, TIMING_DEBUGS, TOS, TRACE, TRANSPOSE, T_DOUBLE, T_EQ, T_FUNCTION, T_GTEQ, T_INTEGER, T_LTEQ, T_NEQ, T_NEWLINE, T_QUOTASSIGN, T_STRING, T_SYMBOL, U, UNIT, USR_SYMBOLS, VERSION, YMAX, YYE, YYRECT, ZERO, __emit_char, __emit_str, __factor_add, __factorial, __is_negative, __is_radical_number, __lcm, __legendre, __legendre2, __legendre3, __normalize_radical_factors, __rationalize_tensor, _print, abs, absValFloat, absval, absval_tensor, add, addSymbolLeftOfAssignment, addSymbolRightOfAssignment, add_all, add_factor_to_accumulator, add_numbers, add_terms, addf, adj, alloc_tensor, allocatedId, any_denominators, approxAll, approxLogs, approxLogsOfRationals, approxOneRatioOnly, approxRadicals, approxRadicalsOfRationals, approxRationalsOfLogs, approxRationalsOfPowersOfE, approxRationalsOfPowersOfPI, approxRationalsOfRadicals, approxSineOfRationalMultiplesOfPI, approxSineOfRationals, approxTrigonometric, approx_just_an_integer, approx_logarithmsOfRationals, approx_nothingUseful, approx_radicalOfRatio, approx_ratioOfRadical, approx_rationalOfE, approx_rationalOfPi, approx_rationalsOfLogarithms, approx_sine_of_pi_times_rational, approx_sine_of_rational, approxratioRecursive, arccos, arccosh, arcsin, arcsinh, arctan, arctanh, areunivarpolysfactoredorexpandedform, arg, arglist, assignmentFound, avoidCalculatingPowersIntoArctans, bake, bake_poly, bake_poly_term, besselj, bessely, bigInt, bignum_factorial, bignum_float, bignum_power_number, bignum_scan_float, bignum_scan_integer, bignum_truncate, binding, binomial, buffer, build_tensor, caaddr, caadr, caar, cadaddr, cadadr, cadar, caddaddr, caddadr, caddar, caddddr, cadddr, caddr, cadr, called_from_Algebra_block, car, cdaddr, cdadr, cdar, cddaddr, cddar, cdddaddr, cddddr, cdddr, cddr, cdr, ceiling, chainOfUserSymbolsNotFunctionsBeingEvaluated, charTabIndex, chartab, checkFloatHasWorkedOutCompletely, check_esc_flag, check_stack, check_tensor_dimensions, choose, choose_check_args, circexp, clearAlgebraEnvironment, clearRenamedVariablesToAvoidBindingToExternalScope, clear_symbols, clear_term, clearall, clockform, cmpGlyphs, cmp_args, cmp_expr, cmp_terms, cmp_terms_count, codeGen, coeff, cofactor, collectLatexStringFromReturnValue, collectUserSymbols, combine_factors, combine_gammas, combine_terms, compareState, compare_numbers, compare_rationals, compare_tensors, compatible, computeDependenciesFromAlgebra, computeResultsAndJavaScriptFromAlgebra, compute_fa, conjugate, cons, consCount, contract, convert_bignum_to_double, convert_rational_to_double, copy_tensor, cosine, cosine_of_angle, cosine_of_angle_sum, count, countOccurrencesOfSymbol, count_denominators, counter, countsize, d_scalar_scalar, d_scalar_scalar_1, d_scalar_tensor, d_tensor_scalar, d_tensor_tensor, dabs, darccos, darccosh, darcsin, darcsinh, darctan, darctanh, dbesselj0, dbesseljn, dbessely0, dbesselyn, dcos, dcosh, dd, decomp, decomp_product, decomp_sum, defineSomeHandyConstants, define_user_function, defn, defn_str, degree, denominator, derf, derfc, derivative, derivative_of_integral, det, determinant, detg, dfunction, dhermite, dirac, display, display_flag, displaychar, divide, divide_numbers, divisors, divisors_onstack, divpoly, dlog, do_clearPatterns, do_clearall, do_simplify_nested_radicals, dontCreateNewRadicalsInDenominatorWhenEvalingMultiplication, dotprod_unicode, doubleToReasonableString, dpow, dpower, dproduct, draw_flag, draw_stop_return, dsgn, dsin, dsinh, dsum, dtan, dtanh, dupl, eigen, elelmIndex, elem, emit_denominator, emit_denominators, emit_expr, emit_factor, emit_factorial_function, emit_flat_tensor, emit_fraction, emit_function, emit_index_function, emit_multiply, emit_number, emit_numerators, emit_numerical_fraction, emit_power, emit_string, emit_subexpr, emit_symbol, emit_tensor, emit_tensor_inner, emit_term, emit_top_expr, emit_unsigned_expr, emit_x, equal, equaln, equalq, erfc, errorMessage, esc_flag, evaluatingAsFloats, evaluatingPolar, exec, expand, expand_get_A, expand_get_AF, expand_get_B, expand_get_C, expand_get_CF, expand_tensor, expanding, expcos, exponential, expr_level, expsin, f1, f10, f2, f3, f4, f5, f9, f_equals_a, factor, factor_a, factor_again, factor_b, factor_number, factor_small_number, factor_term, factorial, factorpoly, factors, factpoly_expo, fill_buf, filter, filter_main, filter_sum, filter_tensor, findDependenciesInScript, findPossibleClockForm, findPossibleExponentialForm, findroot, fixup_fraction, fixup_power, flag, floatToRatioRoutine, fmt_index, fmt_level, fmt_x, frame, freeze, functionInvokationsScanningStack, gamma, gamma_of_sum, gammaf, gcd, gcd_main, gcd_numbers, gcd_polys, gcd_powers_with_same_base, gcd_product_product, gcd_product_sum, gcd_sum, gcd_sum_product, gcd_sum_sum, gen, getSimpleRoots, getStateHash, get_binding, get_factor_from_complex_root, get_factor_from_real_root, get_innerprod_factors, get_next_token, get_printname, get_size, get_token, getdisplaystr, glyph, gp, guess, hasImaginaryCoeff, hasNegativeRationalExponent, hash_addition, hash_function, hash_multiplication, hash_power, hashcode_values, hashed_itab, hermite, hilbert, i1, imag, imaginaryunit, index_function, init, initNRoots, inited, inner, inner_f, input_str, integral, integral_of_form, integral_of_product, integral_of_sum, inv, inverse, invert_number, invg, isNumberOneOverSomething, isNumericAtom, isNumericAtomOrTensor, isSimpleRoot, isSmall, isSymbolLeftOfAssignment, isSymbolReclaimable, isZeroAtom, isZeroAtomOrTensor, isZeroLikeOrNonZeroLikeOrUndetermined, isZeroTensor, is_denominator, is_factor, is_small_integer, is_square_matrix, is_usr_symbol, isadd, isalnumorunderscore, isalpha, isalphaOrUnderscore, iscomplexnumber, iscomplexnumberdouble, iscons, isdenominator, isdigit, isdouble, iseveninteger, isfactor, isfactorial, isfloating, isfraction, isidentitymatrix, isimaginarynumber, isimaginarynumberdouble, isimaginaryunit, isinnerordot, isinteger, isintegerfactor, isintegerorintegerfloat, isinv, iskeyword, isminusone, isminusoneoversqrttwo, isminusoneovertwo, ismultiply, isnegative, isnegativenumber, isnegativeterm, isnonnegativeinteger, isnpi, isone, isoneover, isoneoversqrttwo, isoneovertwo, isplusone, isplustwo, ispolyexpandedform, ispolyexpandedform_expr, ispolyexpandedform_factor, ispolyexpandedform_term, ispolyfactoredorexpandedform, ispolyfactoredorexpandedform_factor, ispolyfactoredorexpandedform_power, isposint, ispositivenumber, ispower, isquarterturn, isrational, isspace, isstr, issymbol, issymbolic, istensor, istranspose, isunderscore, isunivarpolyfactoredorexpandedform, itab, italu_hashcode, j1, laguerre, laguerre2, lastFoundSymbol, latexErrorSign, lcm, leading, legendre, length, lessp, level, list, listLength, logarithm, logbuf, lookupsTotal, lu_decomp, madd, makePositive, makeSignSameAs, make_hashed_itab, mask, mcmp, mcmpint, mdiv, mdivrem, meta_mode, mgcd, mini_solve, mint, mmod, mmul, mod, monic, move, moveTos, mp_clr_bit, mp_denominator, mp_numerator, mp_set_bit, mpow, mprime, mroot, mshiftright, msub, mtotal, multinomial_sum, multiply, multiply_all, multiply_all_noexpand, multiply_consecutive_constants, multiply_denominators, multiply_denominators_factor, multiply_denominators_term, multiply_noexpand, multiply_numbers, n_factor_number, negate, negate_expand, negate_noexpand, negate_number, new_string, newline_flag, nil_symbols, normaliseDots, normalisedCoeff, normalize_angle, nroots_a, nroots_b, nroots_c, nroots_df, nroots_dx, nroots_fa, nroots_fb, nroots_x, nroots_y, nterms, nthCadr, numerator, numericRootOfPolynomial, o, one, oneElement, one_as_double, out_buf, out_count, out_of_memory, outer, p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, parse, parse_internal, parse_p1, parse_p2, parse_time_simplifications, partition, patternHasBeenFound, patternsinfo, peek, performing_roots, polar, polarRectAMinusOneBase, polycoeff, polyform, pop, pop_double, pop_frame, pop_integer, power, power_str, power_sum, power_tensor, predefinedSymbolsInGlobalScope_doNotTrackInDependencies, prime, primetab, print2dascii, printMode, print_ABS_latex, print_ARCCOS_codegen, print_ARCSIN_codegen, print_ARCTAN_codegen, print_BINOMIAL_latex, print_COS_codegen, print_DEFINT_latex, print_DOT_codegen, print_DOT_latex, print_DO_codegen, print_FOR_codegen, print_INV_codegen, print_INV_latex, print_PRODUCT_codegen, print_PRODUCT_latex, print_SETQ_codegen, print_SIN_codegen, print_SQRT_latex, print_SUM_codegen, print_SUM_latex, print_TAN_codegen, print_TESTEQ_latex, print_TESTGE_latex, print_TESTGT_latex, print_TESTLE_latex, print_TESTLT_latex, print_TEST_codegen, print_TEST_latex, print_TRANSPOSE_codegen, print_TRANSPOSE_latex, print_UNIT_codegen, print_a_over_b, print_base, print_base_of_denom, print_char, print_denom, print_double, print_expo_of_denom, print_exponent, print_expr, print_factor, print_factorial_function, print_glyphs, print_index_function, print_list, print_multiply_sign, print_number, print_power, print_str, print_subexpr, print_tensor, print_tensor_inner, print_tensor_inner_latex, print_tensor_latex, print_term, printchar, printchar_nowrap, printline, program_buf, promote_tensor, push, pushTryNotToDuplicate, push_cars, push_double, push_factor, push_frame, push_identity_matrix, push_integer, push_rational, push_symbol, push_term_factors, push_terms, push_zero_matrix, qadd, qdiv, qmul, qpow, qpowf, quickfactor, quickpower, rational, rationalize, rationalize_coefficients, real, reciprocate, rect, recursionLevelNestedRadicalsRemoval, recursiveDependencies, ref, ref1, rememberPrint, remove_negative_exponents, reset_after_error, restore, restoreMetaBindings, rewrite_args, rewrite_args_tensor, roots, roots2, roots3, run, runUserDefinedSimplifications, save, saveMetaBindings, scalar_times_tensor, scan, scan_error, scan_expression, scan_factor, scan_function_call_with_function_name, scan_function_call_without_function_name, scan_index, scan_meta, scan_power, scan_relation, scan_stmt, scan_str, scan_string, scan_subexpr, scan_symbol, scan_tensor, scan_term, scanned, scanningParameters, setM, setSignTo, set_binding, set_component, setq_indexed, sfac_product, sfac_product_f, sgn, shape, show_power_debug, sign, sign_of_term, simfac, simfac_term, simpleComplexityMeasure, simplify, simplifyForCodeGeneration, simplify_1_in_products, simplify_main, simplify_nested_radicals, simplify_polar, simplify_polarRect, simplify_rational_expressions, simplify_rectToClock, simplify_tensor, simplify_trig, simplifyfactorials, sine, sine_of_angle, sine_of_angle_sum, skipRootVariableToBeSolved, sort_stack, square, ssqrt, stack, stackAddsCount, std_symbol, step, step2, stop, strcmp, stringsEmittedByUserPrintouts, subf, subst, subtract, subtract_numbers, swap, symbol, symbolsDependencies, symbolsHavingReassignments, symbolsInExpressionsWithoutAssignments, symbolsLeftOfAssignment, symbolsRightOfAssignment, symbolsinfo, symnum, symtab, take_care_of_nested_radicals, tangent, taylor, tensor, tensor_plus_tensor, tensor_times_scalar, testApprox, test_flag, text_metric, theRandom, token, token_buf, token_str, top, top_level_eval, tos, transform, transpose, transpose_unicode, trigmode, trivial_divide, try_kth_prime, turnErrorMessageToLatex, ucmp, unfreeze, unique, unique_f, update_token_buf, userSimplificationsInListForm, userSimplificationsInStringForm, usr_symbol, verbosing, version, will_be_displayed_as_fraction, ybinomial, ycosh, ydirac, yerf, yerfc, yfloor, yindex, yround, ysinh, yyarg, yybesselj, yybessely, yyceiling, yycondense, yycontract, yycosh, yydegree, yydetg, yydivpoly, yyerf, yyerfc, yyexpand, yyfactorpoly, yyfloat, yyfloor, yyhermite, yyhermite2, yyinvg, yylcm, yylog, yymultiply, yyouter, yypower, yyrationalize, yyround, yysgn, yysimfac, yysinh, yytangent, zero, zzfloat,
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  bigInt = require('big-integer');

  version = "1.3.1";

  SELFTEST = 1;

  NSYM = 1000;

  DEBUG = false;

  PRINTOUTRESULT = false;

  PRINTMODE_LATEX = "PRINTMODE_LATEX";

  PRINTMODE_2DASCII = "PRINTMODE_2DASCII";

  PRINTMODE_COMPUTER = "PRINTMODE_COMPUTER";

  PRINTMODE_HUMAN = "PRINTMODE_HUMAN";

  PRINTMODE_LIST = "PRINTMODE_LIST";

  printMode = PRINTMODE_COMPUTER;

  dontCreateNewRadicalsInDenominatorWhenEvalingMultiplication = true;

  recursionLevelNestedRadicalsRemoval = 0;

  do_simplify_nested_radicals = true;

  avoidCalculatingPowersIntoArctans = true;

  rational = (function() {
    function rational() {}

    rational.prototype.a = null;

    rational.prototype.b = null;

    return rational;

  })();

  U = (function() {
    U.prototype.cons = null;

    U.prototype.printname = "";

    U.prototype.str = "";

    U.prototype.tensor = null;

    U.prototype.q = null;

    U.prototype.d = 0.0;

    U.prototype.k = 0;

    U.prototype.tag = 0;

    U.prototype.toString = function() {
      return print_expr(this);
    };

    U.prototype.toLatexString = function() {
      return collectLatexStringFromReturnValue(this);
    };

    function U() {
      this.cons = {};
      this.cons.car = null;
      this.cons.cdr = null;
      this.q = new rational();
    }

    return U;

  })();

  errorMessage = "";

  CONS = 0;

  NUM = 1;

  DOUBLE = 2;

  STR = 3;

  TENSOR = 4;

  SYM = 5;

  counter = 0;

  ABS = counter++;

  ADD = counter++;

  ADJ = counter++;

  AND = counter++;

  APPROXRATIO = counter++;

  ARCCOS = counter++;

  ARCCOSH = counter++;

  ARCSIN = counter++;

  ARCSINH = counter++;

  ARCTAN = counter++;

  ARCTANH = counter++;

  ARG = counter++;

  ATOMIZE = counter++;

  BESSELJ = counter++;

  BESSELY = counter++;

  BINDING = counter++;

  BINOMIAL = counter++;

  CEILING = counter++;

  CHECK = counter++;

  CHOOSE = counter++;

  CIRCEXP = counter++;

  CLEAR = counter++;

  CLEARALL = counter++;

  CLEARPATTERNS = counter++;

  CLOCK = counter++;

  COEFF = counter++;

  COFACTOR = counter++;

  CONDENSE = counter++;

  CONJ = counter++;

  CONTRACT = counter++;

  COS = counter++;

  COSH = counter++;

  DECOMP = counter++;

  DEFINT = counter++;

  DEGREE = counter++;

  DENOMINATOR = counter++;

  DERIVATIVE = counter++;

  DET = counter++;

  DIM = counter++;

  DIRAC = counter++;

  DIVISORS = counter++;

  DO = counter++;

  DOT = counter++;

  DRAW = counter++;

  DSOLVE = counter++;

  EIGEN = counter++;

  EIGENVAL = counter++;

  EIGENVEC = counter++;

  ERF = counter++;

  ERFC = counter++;

  EVAL = counter++;

  EXP = counter++;

  EXPAND = counter++;

  EXPCOS = counter++;

  EXPSIN = counter++;

  FACTOR = counter++;

  FACTORIAL = counter++;

  FACTORPOLY = counter++;

  FILTER = counter++;

  FLOATF = counter++;

  FLOOR = counter++;

  FOR = counter++;

  FUNCTION = counter++;

  GAMMA = counter++;

  GCD = counter++;

  HERMITE = counter++;

  HILBERT = counter++;

  IMAG = counter++;

  INDEX = counter++;

  INNER = counter++;

  INTEGRAL = counter++;

  INV = counter++;

  INVG = counter++;

  ISINTEGER = counter++;

  ISPRIME = counter++;

  LAGUERRE = counter++;

  LCM = counter++;

  LEADING = counter++;

  LEGENDRE = counter++;

  LOG = counter++;

  LOOKUP = counter++;

  MOD = counter++;

  MULTIPLY = counter++;

  NOT = counter++;

  NROOTS = counter++;

  NUMBER = counter++;

  NUMERATOR = counter++;

  OPERATOR = counter++;

  OR = counter++;

  OUTER = counter++;

  PATTERN = counter++;

  PATTERNSINFO = counter++;

  POLAR = counter++;

  POWER = counter++;

  PRIME = counter++;

  PRINT_LEAVE_E_ALONE = counter++;

  PRINT_LEAVE_X_ALONE = counter++;

  PRINT = counter++;

  PRINT2DASCII = counter++;

  PRINTFULL = counter++;

  PRINTLATEX = counter++;

  PRINTLIST = counter++;

  PRINTPLAIN = counter++;

  PRODUCT = counter++;

  QUOTE = counter++;

  QUOTIENT = counter++;

  RANK = counter++;

  RATIONALIZE = counter++;

  REAL = counter++;

  ROUND = counter++;

  YYRECT = counter++;

  ROOTS = counter++;

  SETQ = counter++;

  SGN = counter++;

  SILENTPATTERN = counter++;

  SIMPLIFY = counter++;

  SIN = counter++;

  SINH = counter++;

  SHAPE = counter++;

  SQRT = counter++;

  STOP = counter++;

  SUBST = counter++;

  SUM = counter++;

  SYMBOLSINFO = counter++;

  TAN = counter++;

  TANH = counter++;

  TAYLOR = counter++;

  TEST = counter++;

  TESTEQ = counter++;

  TESTGE = counter++;

  TESTGT = counter++;

  TESTLE = counter++;

  TESTLT = counter++;

  TRANSPOSE = counter++;

  UNIT = counter++;

  ZERO = counter++;

  NIL = counter++;

  LAST = counter++;

  LAST_PRINT = counter++;

  LAST_2DASCII_PRINT = counter++;

  LAST_FULL_PRINT = counter++;

  LAST_LATEX_PRINT = counter++;

  LAST_LIST_PRINT = counter++;

  LAST_PLAIN_PRINT = counter++;

  AUTOEXPAND = counter++;

  BAKE = counter++;

  ASSUME_REAL_VARIABLES = counter++;

  TRACE = counter++;

  FORCE_FIXED_PRINTOUT = counter++;

  MAX_FIXED_PRINTOUT_DIGITS = counter++;

  YYE = counter++;

  DRAWX = counter++;

  METAA = counter++;

  METAB = counter++;

  METAX = counter++;

  SECRETX = counter++;

  VERSION = counter++;

  PI = counter++;

  SYMBOL_A = counter++;

  SYMBOL_B = counter++;

  SYMBOL_C = counter++;

  SYMBOL_D = counter++;

  SYMBOL_I = counter++;

  SYMBOL_J = counter++;

  SYMBOL_N = counter++;

  SYMBOL_R = counter++;

  SYMBOL_S = counter++;

  SYMBOL_T = counter++;

  SYMBOL_X = counter++;

  SYMBOL_Y = counter++;

  SYMBOL_Z = counter++;

  SYMBOL_IDENTITY_MATRIX = counter++;

  SYMBOL_A_UNDERSCORE = counter++;

  SYMBOL_B_UNDERSCORE = counter++;

  SYMBOL_X_UNDERSCORE = counter++;

  C1 = counter++;

  C2 = counter++;

  C3 = counter++;

  C4 = counter++;

  C5 = counter++;

  C6 = counter++;

  USR_SYMBOLS = counter++;

  E = YYE;

  TOS = 100000;

  BUF = 10000;

  MAX_PROGRAM_SIZE = 100001;

  MAXPRIMETAB = 10000;

  MAX_CONSECUTIVE_APPLICATIONS_OF_ALL_RULES = 5;

  MAX_CONSECUTIVE_APPLICATIONS_OF_SINGLE_RULE = 10;

  MAXDIM = 24;

  symbolsDependencies = {};

  symbolsHavingReassignments = [];

  symbolsInExpressionsWithoutAssignments = [];

  patternHasBeenFound = false;

  predefinedSymbolsInGlobalScope_doNotTrackInDependencies = ["rationalize", "abs", "e", "i", "pi", "sin", "ceiling", "cos", "roots", "integral", "derivative", "defint", "sqrt", "eig", "cov", "deig", "dcov", "float", "floor", "product", "root", "round", "sum", "test", "unit"];

  parse_time_simplifications = true;

  chainOfUserSymbolsNotFunctionsBeingEvaluated = [];

  stringsEmittedByUserPrintouts = "";

  called_from_Algebra_block = false;

  tensor = (function() {
    tensor.prototype.ndim = 0;

    tensor.prototype.dim = null;

    tensor.prototype.nelem = 0;

    tensor.prototype.elem = null;

    function tensor() {
      this.dim = (function() {
        var o, ref, results;
        results = [];
        for (o = 0, ref = MAXDIM; 0 <= ref ? o <= ref : o >= ref; 0 <= ref ? o++ : o--) {
          results.push(0);
        }
        return results;
      })();
      this.elem = [];
    }

    return tensor;

  })();

  display = (function() {
    function display() {}

    display.prototype.h = 0;

    display.prototype.w = 0;

    display.prototype.n = 0;

    display.prototype.a = [];

    return display;

  })();

  text_metric = (function() {
    function text_metric() {}

    text_metric.prototype.ascent = 0;

    text_metric.prototype.descent = 0;

    text_metric.prototype.width = 0;

    return text_metric;

  })();

  tos = 0;

  expanding = 0;

  evaluatingAsFloats = 0;

  evaluatingPolar = 0;

  fmt_x = 0;

  fmt_index = 0;

  fmt_level = 0;

  verbosing = 0;

  primetab = (function() {
    var ceil, i, j, primes;
    primes = [2];
    i = 3;
    while (primes.length < MAXPRIMETAB) {
      j = 0;
      ceil = Math.sqrt(i);
      while (j < primes.length && primes[j] <= ceil) {
        if (i % primes[j] === 0) {
          j = -1;
          break;
        }
        j++;
      }
      if (j !== -1) {
        primes.push(i);
      }
      i += 2;
    }
    primes[MAXPRIMETAB] = 0;
    return primes;
  })();

  esc_flag = 0;

  draw_flag = 0;

  mtotal = 0;

  trigmode = 0;

  logbuf = "";

  program_buf = "";

  symtab = [];

  binding = [];

  isSymbolReclaimable = [];

  arglist = [];

  stack = [];

  frame = 0;

  p0 = null;

  p1 = null;

  p2 = null;

  p3 = null;

  p4 = null;

  p5 = null;

  p6 = null;

  p7 = null;

  p8 = null;

  p9 = null;

  zero = null;

  one = null;

  one_as_double = null;

  imaginaryunit = null;

  out_buf = "";

  out_count = 0;

  test_flag = 0;

  codeGen = false;

  draw_stop_return = null;

  userSimplificationsInListForm = [];

  userSimplificationsInStringForm = [];

  transpose_unicode = 7488;

  dotprod_unicode = 183;

  symbol = function(x) {
    return symtab[x];
  };

  iscons = function(p) {
    return p.k === CONS;
  };

  isrational = function(p) {
    return p.k === NUM;
  };

  isdouble = function(p) {
    return p.k === DOUBLE;
  };

  isNumericAtom = function(p) {
    return isrational(p) || isdouble(p);
  };

  isstr = function(p) {
    return p.k === STR;
  };

  istensor = function(p) {
    if (p == null) {
      debugger;
    } else {
      return p.k === TENSOR;
    }
  };

  isNumericAtomOrTensor = function(p) {
    var a, i, n, o, ref;
    if (isNumericAtom(p) || p === symbol(SYMBOL_IDENTITY_MATRIX)) {
      return 1;
    }
    if (!istensor(p) && !isNumericAtom(p)) {
      return 0;
    }
    n = p.tensor.nelem;
    a = p.tensor.elem;
    for (i = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      if (!isNumericAtomOrTensor(a[i])) {
        return 0;
      }
    }
    return 1;
  };

  issymbol = function(p) {
    return p.k === SYM;
  };

  iskeyword = function(p) {
    return issymbol(p) && symnum(p) < NIL;
  };

  car = function(p) {
    if (iscons(p)) {
      return p.cons.car;
    } else {
      return symbol(NIL);
    }
  };

  cdr = function(p) {
    if (iscons(p)) {
      return p.cons.cdr;
    } else {
      return symbol(NIL);
    }
  };

  caar = function(p) {
    return car(car(p));
  };

  cadr = function(p) {
    return car(cdr(p));
  };

  cdar = function(p) {
    return cdr(car(p));
  };

  cddr = function(p) {
    return cdr(cdr(p));
  };

  caadr = function(p) {
    return car(car(cdr(p)));
  };

  caddr = function(p) {
    return car(cdr(cdr(p)));
  };

  cadar = function(p) {
    return car(cdr(car(p)));
  };

  cdadr = function(p) {
    return cdr(car(cdr(p)));
  };

  cddar = function(p) {
    return cdr(cdr(car(p)));
  };

  cdddr = function(p) {
    return cdr(cdr(cdr(p)));
  };

  caaddr = function(p) {
    return car(car(cdr(cdr(p))));
  };

  cadadr = function(p) {
    return car(cdr(car(cdr(p))));
  };

  caddar = function(p) {
    return car(cdr(cdr(car(p))));
  };

  cdaddr = function(p) {
    return cdr(car(cdr(cdr(p))));
  };

  cadddr = function(p) {
    return car(cdr(cdr(cdr(p))));
  };

  cddddr = function(p) {
    return cdr(cdr(cdr(cdr(p))));
  };

  caddddr = function(p) {
    return car(cdr(cdr(cdr(cdr(p)))));
  };

  cadaddr = function(p) {
    return car(cdr(car(cdr(cdr(p)))));
  };

  cddaddr = function(p) {
    return cdr(cdr(car(cdr(cdr(p)))));
  };

  caddadr = function(p) {
    return car(cdr(cdr(car(cdr(p)))));
  };

  cdddaddr = function(p) {
    return cdr(cdr(cdr(car(cdr(cdr(p))))));
  };

  caddaddr = function(p) {
    return car(cdr(cdr(car(cdr(cdr(p))))));
  };

  listLength = function(p) {
    var startCount;
    startCount = -1;
    while (iscons(p)) {
      p = cdr(p);
      startCount++;
    }
    return startCount;
  };

  nthCadr = function(p, n) {
    var startCount;
    startCount = 0;
    while (startCount <= n) {
      p = cdr(p);
      startCount++;
    }
    return car(p);
  };

  isadd = function(p) {
    return car(p) === symbol(ADD);
  };

  ismultiply = function(p) {
    return car(p) === symbol(MULTIPLY);
  };

  ispower = function(p) {
    return car(p) === symbol(POWER);
  };

  isfactorial = function(p) {
    return car(p) === symbol(FACTORIAL);
  };

  isinnerordot = function(p) {
    return (car(p) === symbol(INNER)) || (car(p) === symbol(DOT));
  };

  istranspose = function(p) {
    return car(p) === symbol(TRANSPOSE);
  };

  isinv = function(p) {
    return car(p) === symbol(INV);
  };

  isidentitymatrix = function(p) {
    return p === symbol(SYMBOL_IDENTITY_MATRIX);
  };

  MSIGN = function(p) {
    if (p.isPositive()) {
      return 1;
    } else if (p.isZero()) {
      return 0;
    } else {
      return -1;
    }
  };

  MLENGTH = function(p) {
    return p.toString().length;
  };

  MZERO = function(p) {
    return p.isZero();
  };

  MEQUAL = function(p, n) {
    if (p == null) {
      debugger;
    }
    return p.equals(n);
  };

  reset_after_error = function() {
    moveTos(0);
    esc_flag = 0;
    draw_flag = 0;
    frame = TOS;
    evaluatingAsFloats = 0;
    return evaluatingPolar = 0;
  };

  $ = typeof exports !== "undefined" && exports !== null ? exports : this;

  $.version = version;

  $.isadd = isadd;

  $.ismultiply = ismultiply;

  $.ispower = ispower;

  $.isfactorial = isfactorial;

  $.car = car;

  $.cdr = cdr;

  $.caar = caar;

  $.cadr = cadr;

  $.cdar = cdar;

  $.cddr = cddr;

  $.caadr = caadr;

  $.caddr = caddr;

  $.cadar = cadar;

  $.cdadr = cdadr;

  $.cddar = cddar;

  $.cdddr = cdddr;

  $.caaddr = caaddr;

  $.cadadr = cadadr;

  $.caddar = caddar;

  $.cdaddr = cdaddr;

  $.cadddr = cadddr;

  $.cddddr = cddddr;

  $.caddddr = caddddr;

  $.cadaddr = cadaddr;

  $.cddaddr = cddaddr;

  $.caddadr = caddadr;

  $.cdddaddr = cdddaddr;

  $.caddaddr = caddaddr;

  $.symbol = symbol;

  $.iscons = iscons;

  $.isrational = isrational;

  $.isdouble = isdouble;

  $.isNumericAtom = isNumericAtom;

  $.isstr = isstr;

  $.istensor = istensor;

  $.issymbol = issymbol;

  $.iskeyword = iskeyword;

  $.CONS = CONS;

  $.NUM = NUM;

  $.DOUBLE = DOUBLE;

  $.STR = STR;

  $.TENSOR = TENSOR;

  $.SYM = SYM;


  /* abs =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  x
  
  General description
  -------------------
  Returns the absolute value of a real number, the magnitude of a complex number, or the vector length.
   */


  /*
   Absolute value of a number,or magnitude of complex z, or norm of a vector
  
    z    abs(z)
    -    ------
  
    a    a
  
    -a    a
  
    (-1)^a    1
  
    exp(a + i b)  exp(a)
  
    a b    abs(a) abs(b)
  
    a + i b    sqrt(a^2 + b^2)
  
  Notes
  
    1. Handles mixed polar and rectangular forms, e.g. 1 + exp(i pi/3)
  
    2. jean-francois.debroux reports that when z=(a+i*b)/(c+i*d) then
  
      abs(numerator(z)) / abs(denominator(z))
  
       must be used to get the correct answer. Now the operation is
       automatic.
   */

  DEBUG_ABS = false;

  Eval_abs = function() {
    push(cadr(p1));
    Eval();
    return abs();
  };

  absValFloat = function() {
    Eval();
    absval();
    Eval();
    return zzfloat();
  };

  abs = function() {
    var theArgument;
    theArgument = top();
    if (DEBUG_ABS) {
      console.trace(">>>>  ABS of " + theArgument);
    }
    numerator();
    if (DEBUG_ABS) {
      console.log("ABS numerator " + stack[tos - 1]);
    }
    absval();
    if (DEBUG_ABS) {
      console.log("ABSVAL numerator: " + stack[tos - 1]);
    }
    push(theArgument);
    denominator();
    if (DEBUG_ABS) {
      console.log("ABS denominator: " + stack[tos - 1]);
    }
    absval();
    if (DEBUG_ABS) {
      console.log("ABSVAL denominator: " + stack[tos - 1]);
    }
    divide();
    if (DEBUG_ABS) {
      console.log("ABSVAL divided: " + stack[tos - 1]);
    }
    if (DEBUG_ABS) {
      return console.log("<<<<<<<  ABS");
    }
  };

  absval = function() {
    var anyFactorsYet, input;
    save();
    p1 = pop();
    input = p1;
    if (DEBUG_ABS) {
      console.log("ABS of " + p1);
    }
    if (isZeroAtomOrTensor(p1)) {
      if (DEBUG_ABS) {
        console.log(" abs: " + p1 + " just zero");
      }
      push(zero);
      if (DEBUG_ABS) {
        console.log(" --> ABS of " + input + " : " + stack[tos - 1]);
      }
      restore();
      return;
    }
    if (isnegativenumber(p1)) {
      if (DEBUG_ABS) {
        console.log(" abs: " + p1 + " just a negative");
      }
      push(p1);
      negate();
      restore();
      return;
    }
    if (ispositivenumber(p1)) {
      if (DEBUG_ABS) {
        console.log(" abs: " + p1 + " just a positive");
      }
      push(p1);
      if (DEBUG_ABS) {
        console.log(" --> ABS of " + input + " : " + stack[tos - 1]);
      }
      restore();
      return;
    }
    if (p1 === symbol(PI)) {
      if (DEBUG_ABS) {
        console.log(" abs: " + p1 + " of PI");
      }
      push(p1);
      if (DEBUG_ABS) {
        console.log(" --> ABS of " + input + " : " + stack[tos - 1]);
      }
      restore();
      return;
    }
    if (car(p1) === symbol(ADD) && (findPossibleClockForm(p1) || findPossibleExponentialForm(p1) || Find(p1, imaginaryunit))) {
      if (DEBUG_ABS) {
        console.log(" abs: " + p1 + " is a sum");
      }
      if (DEBUG_ABS) {
        console.log("abs of a sum");
      }
      push(p1);
      rect();
      p1 = pop();
      push(p1);
      real();
      push_integer(2);
      power();
      push(p1);
      imag();
      push_integer(2);
      power();
      add();
      push_rational(1, 2);
      power();
      simplify_trig();
      if (DEBUG_ABS) {
        console.log(" --> ABS of " + input + " : " + stack[tos - 1]);
      }
      restore();
      return;
    }
    if (car(p1) === symbol(POWER) && equaln(cadr(p1), -1)) {
      if (DEBUG_ABS) {
        console.log(" abs: " + p1 + " is -1 to any power");
      }
      if (evaluatingAsFloats) {
        if (DEBUG_ABS) {
          console.log(" abs: numeric, so result is 1.0");
        }
        push_double(1.0);
      } else {
        if (DEBUG_ABS) {
          console.log(" abs: symbolic, so result is 1");
        }
        push_integer(1);
      }
      if (DEBUG_ABS) {
        console.log(" --> ABS of " + input + " : " + stack[tos - 1]);
      }
      restore();
      return;
    }
    if (car(p1) === symbol(POWER) && ispositivenumber(caddr(p1))) {
      if (DEBUG_ABS) {
        console.log(" abs: " + p1 + " is something to the power of a positive number");
      }
      push(cadr(p1));
      abs();
      push(caddr(p1));
      power();
      if (DEBUG_ABS) {
        console.log(" --> ABS of " + input + " : " + stack[tos - 1]);
      }
      restore();
      return;
    }
    if (car(p1) === symbol(POWER) && cadr(p1) === symbol(E)) {
      if (DEBUG_ABS) {
        console.log(" abs: " + p1 + " is an exponential");
      }
      push(caddr(p1));
      real();
      exponential();
      if (DEBUG_ABS) {
        console.log(" --> ABS of " + input + " : " + stack[tos - 1]);
      }
      restore();
      return;
    }
    if (car(p1) === symbol(MULTIPLY)) {
      if (DEBUG_ABS) {
        console.log(" abs: " + p1 + " is a product");
      }
      anyFactorsYet = false;
      p1 = cdr(p1);
      while (iscons(p1)) {
        push(car(p1));
        absval();
        if (anyFactorsYet) {
          multiply();
        }
        anyFactorsYet = true;
        p1 = cdr(p1);
      }
      if (DEBUG_ABS) {
        console.log(" --> ABS of " + input + " : " + stack[tos - 1]);
      }
      restore();
      return;
    }
    if (car(p1) === symbol(ABS)) {
      if (DEBUG_ABS) {
        console.log(" abs: " + p1 + " is abs of a abs");
      }
      push_symbol(ABS);
      push(cadr(p1));
      list(2);
      if (DEBUG_ABS) {
        console.log(" --> ABS of " + input + " : " + stack[tos - 1]);
      }
      restore();
      return;
    }

    /*
     * Evaluation via zzfloat()
     * ...while this is in theory a powerful mechanism, I've commented it
     * out because I've refined this method enough to not need this.
     * Evaling via zzfloat() is in principle more problematic because it could
     * require further evaluations which could end up in further "abs" which
     * would end up in infinite loops. Better not use it if not necessary.
    
     * we look directly at the float evaluation of the argument
     * to see if we end up with a number, which would mean that there
     * is no imaginary component and we can just return the input
     * (or its negation) as the result.
    push p1
    zzfloat()
    floatEvaluation = pop()
    
    if (isnegativenumber(floatEvaluation))
      if DEBUG_ABS then console.log " abs: " + p1 + " just a negative"
      push(p1)
      negate()
      restore()
      return
    
    if (ispositivenumber(floatEvaluation))
      if DEBUG_ABS then console.log " abs: " + p1 + " just a positive"
      push(p1)
      if DEBUG_ABS then console.log " --> ABS of " + input + " : " + stack[tos-1]
      restore()
      return
     */
    if (istensor(p1)) {
      absval_tensor();
      restore();
      return;
    }
    if (isnegativeterm(p1) || (car(p1) === symbol(ADD) && isnegativeterm(cadr(p1)))) {
      push(p1);
      negate();
      p1 = pop();
    }
    if (DEBUG_ABS) {
      console.log(" abs: " + p1 + " is nothing decomposable");
    }
    push_symbol(ABS);
    push(p1);
    list(2);
    if (DEBUG_ABS) {
      console.log(" --> ABS of " + input + " : " + stack[tos - 1]);
    }
    return restore();
  };

  absval_tensor = function() {
    if (p1.tensor.ndim !== 1) {
      stop("abs(tensor) with tensor rank > 1");
    }
    push(p1);
    push(p1);
    conjugate();
    inner();
    push_rational(1, 2);
    power();
    simplify();
    return Eval();
  };


  /*
   Symbolic addition
  
    Terms in a sum are combined if they are identical modulo rational
    coefficients.
  
    For example, A + 2A becomes 3A.
  
    However, the sum A + sqrt(2) A is not modified.
  
    Combining terms can lead to second-order effects.
  
    For example, consider the case of
  
      1/sqrt(2) A + 3/sqrt(2) A + sqrt(2) A
  
    The first two terms are combined to yield 2 sqrt(2) A.
  
    This result can now be combined with the third term to yield
  
      3 sqrt(2) A
   */

  flag = 0;

  Eval_add = function() {
    var h;
    h = tos;
    p1 = cdr(p1);
    while (iscons(p1)) {
      push(car(p1));
      Eval();
      p2 = pop();
      push_terms(p2);
      p1 = cdr(p1);
    }
    return add_terms(tos - h);
  };

  stackAddsCount = 0;

  add_terms = function(n) {
    var h, i, i1, j1, o, ref, ref1, results, s, subsetOfStack;
    stackAddsCount++;
    i = 0;
    h = tos - n;
    s = h;
    if (DEBUG) {
      console.log("stack before adding terms #" + stackAddsCount);
    }
    if (DEBUG) {
      for (i = o = 0, ref = tos; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
        console.log(print_list(stack[i]));
      }
    }
    for (i = i1 = 0; i1 < 10; i = ++i1) {
      if (n < 2) {
        break;
      }
      flag = 0;
      subsetOfStack = stack.slice(h, h + n);
      subsetOfStack.sort(cmp_terms);
      stack = stack.slice(0, h).concat(subsetOfStack).concat(stack.slice(h + n));
      if (flag === 0) {
        break;
      }
      n = combine_terms(h, n);
    }
    moveTos(h + n);
    switch (n) {
      case 0:
        if (evaluatingAsFloats) {
          push_double(0.0);
        } else {
          push(zero);
        }
        break;
      case 1:
        break;
      default:
        list(n);
        p1 = pop();
        push_symbol(ADD);
        push(p1);
        cons();
    }
    if (DEBUG) {
      console.log("stack after adding terms #" + stackAddsCount);
    }
    if (DEBUG) {
      results = [];
      for (i = j1 = 0, ref1 = tos; 0 <= ref1 ? j1 < ref1 : j1 > ref1; i = 0 <= ref1 ? ++j1 : --j1) {
        results.push(console.log(print_list(stack[i])));
      }
      return results;
    }
  };

  cmp_terms_count = 0;

  cmp_terms = function(p1, p2) {
    var i, o, ref, t;
    cmp_terms_count++;
    i = 0;
    if (isNumericAtom(p1) && isNumericAtom(p2)) {
      flag = 1;
      return 0;
    }
    if (istensor(p1) && istensor(p2)) {
      if (p1.tensor.ndim < p2.tensor.ndim) {
        return -1;
      }
      if (p1.tensor.ndim > p2.tensor.ndim) {
        return 1;
      }
      for (i = o = 0, ref = p1.tensor.ndim; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
        if (p1.tensor.dim[i] < p2.tensor.dim[i]) {
          return -1;
        }
        if (p1.tensor.dim[i] > p2.tensor.dim[i]) {
          return 1;
        }
      }
      flag = 1;
      return 0;
    }
    if (car(p1) === symbol(MULTIPLY)) {
      p1 = cdr(p1);
      if (isNumericAtom(car(p1))) {
        p1 = cdr(p1);
        if (cdr(p1) === symbol(NIL)) {
          p1 = car(p1);
        }
      }
    }
    if (car(p2) === symbol(MULTIPLY)) {
      p2 = cdr(p2);
      if (isNumericAtom(car(p2))) {
        p2 = cdr(p2);
        if (cdr(p2) === symbol(NIL)) {
          p2 = car(p2);
        }
      }
    }
    t = cmp_expr(p1, p2);
    if (t === 0) {
      flag = 1;
    }
    return t;
  };


  /*
   Compare adjacent terms in s[] and combine if possible.
  
    Returns the number of terms remaining in s[].
  
    n  number of terms in s[] initially
   */

  combine_terms = function(s, n) {
    var i, i1, j, j1, l1, m1, o, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, t;
    i = 0;
    while (i < (n - 1)) {
      check_esc_flag();
      p3 = stack[s + i];
      p4 = stack[s + i + 1];
      if (istensor(p3) && istensor(p4)) {
        push(p3);
        push(p4);
        tensor_plus_tensor();
        p1 = pop();
        if (p1 !== symbol(NIL)) {
          stack[s + i] = p1;
          for (j = o = ref = i + 1, ref1 = n - 1; ref <= ref1 ? o < ref1 : o > ref1; j = ref <= ref1 ? ++o : --o) {
            stack[s + j] = stack[s + j + 1];
          }
          n--;
          i--;
        }
        i++;
        continue;
      }
      if (istensor(p3) || istensor(p4)) {
        i++;
        continue;
      }
      if (isNumericAtom(p3) && isNumericAtom(p4)) {
        push(p3);
        push(p4);
        add_numbers();
        p1 = pop();
        if (isZeroAtomOrTensor(p1)) {
          for (j = i1 = ref2 = i, ref3 = n - 2; ref2 <= ref3 ? i1 < ref3 : i1 > ref3; j = ref2 <= ref3 ? ++i1 : --i1) {
            stack[s + j] = stack[s + j + 2];
          }
          n -= 2;
        } else {
          stack[s + i] = p1;
          for (j = j1 = ref4 = i + 1, ref5 = n - 1; ref4 <= ref5 ? j1 < ref5 : j1 > ref5; j = ref4 <= ref5 ? ++j1 : --j1) {
            stack[s + j] = stack[s + j + 1];
          }
          n--;
        }
        i--;
        i++;
        continue;
      }
      if (isNumericAtom(p3) || isNumericAtom(p4)) {
        i++;
        continue;
      }
      if (evaluatingAsFloats) {
        p1 = one_as_double;
        p2 = one_as_double;
      } else {
        p1 = one;
        p2 = one;
      }
      t = 0;
      if (car(p3) === symbol(MULTIPLY)) {
        p3 = cdr(p3);
        t = 1;
        if (isNumericAtom(car(p3))) {
          p1 = car(p3);
          p3 = cdr(p3);
          if (cdr(p3) === symbol(NIL)) {
            p3 = car(p3);
            t = 0;
          }
        }
      }
      if (car(p4) === symbol(MULTIPLY)) {
        p4 = cdr(p4);
        if (isNumericAtom(car(p4))) {
          p2 = car(p4);
          p4 = cdr(p4);
          if (cdr(p4) === symbol(NIL)) {
            p4 = car(p4);
          }
        }
      }
      if (!equal(p3, p4)) {
        i++;
        continue;
      }
      push(p1);
      push(p2);
      add_numbers();
      p1 = pop();
      if (isZeroAtomOrTensor(p1)) {
        for (j = l1 = ref6 = i, ref7 = n - 2; ref6 <= ref7 ? l1 < ref7 : l1 > ref7; j = ref6 <= ref7 ? ++l1 : --l1) {
          stack[s + j] = stack[s + j + 2];
        }
        n -= 2;
        i--;
        i++;
        continue;
      }
      push(p1);
      if (t) {
        push(symbol(MULTIPLY));
        push(p3);
        cons();
      } else {
        push(p3);
      }
      multiply();
      stack[s + i] = pop();
      for (j = m1 = ref8 = i + 1, ref9 = n - 1; ref8 <= ref9 ? m1 < ref9 : m1 > ref9; j = ref8 <= ref9 ? ++m1 : --m1) {
        stack[s + j] = stack[s + j + 1];
      }
      n--;
      i--;
      i++;
    }
    return n;
  };

  push_terms = function(p) {
    var results;
    if (car(p) === symbol(ADD)) {
      p = cdr(p);
      results = [];
      while (iscons(p)) {
        push(car(p));
        results.push(p = cdr(p));
      }
      return results;
    } else if (!isZeroAtom(p)) {
      return push(p);
    }
  };

  add = function() {
    var h;
    save();
    p2 = pop();
    p1 = pop();
    h = tos;
    push_terms(p1);
    push_terms(p2);
    add_terms(tos - h);
    return restore();
  };

  add_all = function(k) {
    var h, i, o, ref, s;
    i = 0;
    save();
    s = tos - k;
    h = tos;
    for (i = o = 0, ref = k; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      push_terms(stack[s + i]);
    }
    add_terms(tos - h);
    p1 = pop();
    moveTos(tos - k);
    push(p1);
    return restore();
  };

  subtract = function() {
    negate();
    return add();
  };


  /* adj =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  m
  
  General description
  -------------------
  Returns the adjunct of matrix m. The inverse of m is equal to adj(m) divided by det(m).
   */

  Eval_adj = function() {
    push(cadr(p1));
    Eval();
    return adj();
  };

  adj = function() {
    var doNothing, i, i1, j, n, o, ref, ref1;
    i = 0;
    j = 0;
    n = 0;
    save();
    p1 = pop();
    if (istensor(p1) && p1.tensor.ndim === 2 && p1.tensor.dim[0] === p1.tensor.dim[1]) {
      doNothing = 1;
    } else {
      stop("adj: square matrix expected");
    }
    n = p1.tensor.dim[0];
    p2 = alloc_tensor(n * n);
    p2.tensor.ndim = 2;
    p2.tensor.dim[0] = n;
    p2.tensor.dim[1] = n;
    for (i = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      for (j = i1 = 0, ref1 = n; 0 <= ref1 ? i1 < ref1 : i1 > ref1; j = 0 <= ref1 ? ++i1 : --i1) {
        cofactor(p1, n, i, j);
        p2.tensor.elem[n * j + i] = pop();
      }
    }
    push(p2);
    return restore();
  };


  /*
   Guesses a rational for each float in the passed expression
   */

  Eval_approxratio = function() {
    var theArgument;
    theArgument = cadr(p1);
    push(theArgument);
    return approxratioRecursive();
  };

  approxratioRecursive = function() {
    var i, i1, o, ref, ref1;
    i = 0;
    save();
    p1 = pop();
    if (istensor(p1)) {
      p4 = alloc_tensor(p1.tensor.nelem);
      p4.tensor.ndim = p1.tensor.ndim;
      for (i = o = 0, ref = p1.tensor.ndim; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
        p4.tensor.dim[i] = p1.tensor.dim[i];
      }
      for (i = i1 = 0, ref1 = p1.tensor.nelem; 0 <= ref1 ? i1 < ref1 : i1 > ref1; i = 0 <= ref1 ? ++i1 : --i1) {
        push(p1.tensor.elem[i]);
        approxratioRecursive();
        p4.tensor.elem[i] = pop();
        check_tensor_dimensions(p4);
      }
      push(p4);
    } else if (p1.k === DOUBLE) {
      push(p1);
      approxOneRatioOnly();
    } else if (iscons(p1)) {
      push(car(p1));
      approxratioRecursive();
      push(cdr(p1));
      approxratioRecursive();
      cons();
    } else {
      push(p1);
    }
    return restore();
  };

  approxOneRatioOnly = function() {
    var numberOfDigitsAfterTheDot, precision, splitBeforeAndAfterDot, supposedlyTheFloat, theFloat, theRatio;
    zzfloat();
    supposedlyTheFloat = pop();
    if (supposedlyTheFloat.k === DOUBLE) {
      theFloat = supposedlyTheFloat.d;
      splitBeforeAndAfterDot = theFloat.toString().split(".");
      if (splitBeforeAndAfterDot.length === 2) {
        numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
        precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
        theRatio = floatToRatioRoutine(theFloat, precision);
        push_rational(theRatio[0], theRatio[1]);
      } else {
        push_integer(theFloat);
      }
      return;
    }
    push_symbol(APPROXRATIO);
    push(theArgument);
    return list(2);
  };

  floatToRatioRoutine = function(decimal, AccuracyFactor) {
    var DecimalSign, FractionDenominator, FractionNumerator, PreviousDenominator, ScratchValue, Z, ret;
    FractionNumerator = void 0;
    FractionDenominator = void 0;
    DecimalSign = void 0;
    Z = void 0;
    PreviousDenominator = void 0;
    ScratchValue = void 0;
    ret = [0, 0];
    if (isNaN(decimal)) {
      return ret;
    }
    if (decimal === 2e308) {
      ret[0] = 1;
      ret[1] = 0;
      return ret;
    }
    if (decimal === -2e308) {
      ret[0] = -1;
      ret[1] = 0;
      return ret;
    }
    if (decimal < 0.0) {
      DecimalSign = -1.0;
    } else {
      DecimalSign = 1.0;
    }
    decimal = Math.abs(decimal);
    if (Math.abs(decimal - Math.floor(decimal)) < AccuracyFactor) {
      FractionNumerator = decimal * DecimalSign;
      FractionDenominator = 1.0;
      ret[0] = FractionNumerator;
      ret[1] = FractionDenominator;
      return ret;
    }
    if (decimal < 1.0e-19) {
      FractionNumerator = DecimalSign;
      FractionDenominator = 9999999999999999999.0;
      ret[0] = FractionNumerator;
      ret[1] = FractionDenominator;
      return ret;
    }
    if (decimal > 1.0e19) {
      FractionNumerator = 9999999999999999999.0 * DecimalSign;
      FractionDenominator = 1.0;
      ret[0] = FractionNumerator;
      ret[1] = FractionDenominator;
      return ret;
    }
    Z = decimal;
    PreviousDenominator = 0.0;
    FractionDenominator = 1.0;
    while (true) {
      Z = 1.0 / (Z - Math.floor(Z));
      ScratchValue = FractionDenominator;
      FractionDenominator = FractionDenominator * Math.floor(Z) + PreviousDenominator;
      PreviousDenominator = ScratchValue;
      FractionNumerator = Math.floor(decimal * FractionDenominator + 0.5);
      if (!(Math.abs(decimal - (FractionNumerator / FractionDenominator)) > AccuracyFactor && Z !== Math.floor(Z))) {
        break;
      }
    }
    FractionNumerator = DecimalSign * FractionNumerator;
    ret[0] = FractionNumerator;
    ret[1] = FractionDenominator;
    return ret;
  };

  approx_just_an_integer = 0;

  approx_sine_of_rational = 1;

  approx_sine_of_pi_times_rational = 2;

  approx_rationalOfPi = 3;

  approx_radicalOfRatio = 4;

  approx_nothingUseful = 5;

  approx_ratioOfRadical = 6;

  approx_rationalOfE = 7;

  approx_logarithmsOfRationals = 8;

  approx_rationalsOfLogarithms = 9;

  approxRationalsOfRadicals = function(theFloat) {
    var bestResultSoFar, complexity, error, hypothesis, i, i1, j, len, likelyMultiplier, minimumComplexity, numberOfDigitsAfterTheDot, o, precision, ratio, ref, result, splitBeforeAndAfterDot;
    splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return ["" + Math.floor(theFloat), approx_just_an_integer, Math.floor(theFloat), 1, 2];
    }
    console.log("precision: " + precision);
    bestResultSoFar = null;
    minimumComplexity = Number.MAX_VALUE;
    ref = [2, 3, 5, 6, 7, 8, 10];
    for (o = 0, len = ref.length; o < len; o++) {
      i = ref[o];
      for (j = i1 = 1; i1 <= 10; j = ++i1) {
        hypothesis = Math.sqrt(i) / j;
        if (Math.abs(hypothesis) > 1e-10) {
          ratio = theFloat / hypothesis;
          likelyMultiplier = Math.round(ratio);
          error = Math.abs(1 - ratio / likelyMultiplier);
        } else {
          ratio = 1;
          likelyMultiplier = 1;
          error = Math.abs(theFloat - hypothesis);
        }
        if (error < 2 * precision) {
          complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
          if (complexity < minimumComplexity) {
            minimumComplexity = complexity;
            result = likelyMultiplier + " * sqrt( " + i + " ) / " + j;
            bestResultSoFar = [result, approx_ratioOfRadical, likelyMultiplier, i, j];
          }
        }
      }
    }
    return bestResultSoFar;
  };

  approxRadicalsOfRationals = function(theFloat) {
    var bestResultSoFar, complexity, error, hypothesis, i, i1, j, len, len1, likelyMultiplier, minimumComplexity, numberOfDigitsAfterTheDot, o, precision, ratio, ref, ref1, result, splitBeforeAndAfterDot;
    splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return ["" + Math.floor(theFloat), approx_just_an_integer, Math.floor(theFloat), 1, 2];
    }
    console.log("precision: " + precision);
    bestResultSoFar = null;
    minimumComplexity = Number.MAX_VALUE;
    ref = [1, 2, 3, 5, 6, 7, 8, 10];
    for (o = 0, len = ref.length; o < len; o++) {
      i = ref[o];
      ref1 = [1, 2, 3, 5, 6, 7, 8, 10];
      for (i1 = 0, len1 = ref1.length; i1 < len1; i1++) {
        j = ref1[i1];
        hypothesis = Math.sqrt(i / j);
        if (Math.abs(hypothesis) > 1e-10) {
          ratio = theFloat / hypothesis;
          likelyMultiplier = Math.round(ratio);
          error = Math.abs(1 - ratio / likelyMultiplier);
        } else {
          ratio = 1;
          likelyMultiplier = 1;
          error = Math.abs(theFloat - hypothesis);
        }
        if (error < 2 * precision) {
          complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
          if (complexity < minimumComplexity) {
            minimumComplexity = complexity;
            result = likelyMultiplier + " * (sqrt( " + i + " / " + j + " )";
            bestResultSoFar = [result, approx_radicalOfRatio, likelyMultiplier, i, j];
          }
        }
      }
    }
    return bestResultSoFar;
  };

  approxRadicals = function(theFloat) {
    var approxRadicalsOfRationalsResult, approxRationalsOfRadicalsResult, numberOfDigitsAfterTheDot, precision, splitBeforeAndAfterDot;
    splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return ["" + Math.floor(theFloat), approx_just_an_integer, Math.floor(theFloat), 1, 2];
    }
    console.log("precision: " + precision);
    approxRationalsOfRadicalsResult = approxRationalsOfRadicals(theFloat);
    if (approxRationalsOfRadicalsResult != null) {
      return approxRationalsOfRadicalsResult;
    }
    approxRadicalsOfRationalsResult = approxRadicalsOfRationals(theFloat);
    if (approxRadicalsOfRationalsResult != null) {
      return approxRadicalsOfRationalsResult;
    }
    return null;
  };

  approxLogs = function(theFloat) {
    var approxLogsOfRationalsResult, approxRationalsOfLogsResult, numberOfDigitsAfterTheDot, precision, splitBeforeAndAfterDot;
    splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return ["" + Math.floor(theFloat), approx_just_an_integer, Math.floor(theFloat), 1, 2];
    }
    console.log("precision: " + precision);
    approxRationalsOfLogsResult = approxRationalsOfLogs(theFloat);
    if (approxRationalsOfLogsResult != null) {
      return approxRationalsOfLogsResult;
    }
    approxLogsOfRationalsResult = approxLogsOfRationals(theFloat);
    if (approxLogsOfRationalsResult != null) {
      return approxLogsOfRationalsResult;
    }
    return null;
  };

  approxRationalsOfLogs = function(theFloat) {
    var bestResultSoFar, complexity, error, hypothesis, i, i1, j, likelyMultiplier, minimumComplexity, numberOfDigitsAfterTheDot, o, precision, ratio, result, splitBeforeAndAfterDot;
    splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return ["" + Math.floor(theFloat), approx_just_an_integer, Math.floor(theFloat), 1, 2];
    }
    console.log("precision: " + precision);
    bestResultSoFar = null;
    minimumComplexity = Number.MAX_VALUE;
    for (i = o = 2; o <= 5; i = ++o) {
      for (j = i1 = 1; i1 <= 5; j = ++i1) {
        hypothesis = Math.log(i) / j;
        if (Math.abs(hypothesis) > 1e-10) {
          ratio = theFloat / hypothesis;
          likelyMultiplier = Math.round(ratio);
          error = Math.abs(1 - ratio / likelyMultiplier);
        } else {
          ratio = 1;
          likelyMultiplier = 1;
          error = Math.abs(theFloat - hypothesis);
        }
        if (likelyMultiplier !== 1 && Math.abs(Math.floor(likelyMultiplier / j)) === Math.abs(likelyMultiplier / j)) {
          continue;
        }
        if (error < 2.2 * precision) {
          complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
          if (complexity < minimumComplexity) {
            minimumComplexity = complexity;
            result = likelyMultiplier + " * log( " + i + " ) / " + j;
            bestResultSoFar = [result, approx_rationalsOfLogarithms, likelyMultiplier, i, j];
          }
        }
      }
    }
    return bestResultSoFar;
  };

  approxLogsOfRationals = function(theFloat) {
    var bestResultSoFar, complexity, error, hypothesis, i, i1, j, likelyMultiplier, minimumComplexity, numberOfDigitsAfterTheDot, o, precision, ratio, result, splitBeforeAndAfterDot;
    splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return ["" + Math.floor(theFloat), approx_just_an_integer, Math.floor(theFloat), 1, 2];
    }
    console.log("precision: " + precision);
    bestResultSoFar = null;
    minimumComplexity = Number.MAX_VALUE;
    for (i = o = 1; o <= 5; i = ++o) {
      for (j = i1 = 1; i1 <= 5; j = ++i1) {
        hypothesis = Math.log(i / j);
        if (Math.abs(hypothesis) > 1e-10) {
          ratio = theFloat / hypothesis;
          likelyMultiplier = Math.round(ratio);
          error = Math.abs(1 - ratio / likelyMultiplier);
        } else {
          ratio = 1;
          likelyMultiplier = 1;
          error = Math.abs(theFloat - hypothesis);
        }
        if (error < 1.96 * precision) {
          complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
          if (complexity < minimumComplexity) {
            minimumComplexity = complexity;
            result = likelyMultiplier + " * log( " + i + " / " + j + " )";
            bestResultSoFar = [result, approx_logarithmsOfRationals, likelyMultiplier, i, j];
          }
        }
      }
    }
    return bestResultSoFar;
  };

  approxRationalsOfPowersOfE = function(theFloat) {
    var bestResultSoFar, complexity, error, hypothesis, i, i1, j, likelyMultiplier, minimumComplexity, numberOfDigitsAfterTheDot, o, precision, ratio, result, splitBeforeAndAfterDot;
    splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return ["" + Math.floor(theFloat), approx_just_an_integer, Math.floor(theFloat), 1, 2];
    }
    console.log("precision: " + precision);
    bestResultSoFar = null;
    minimumComplexity = Number.MAX_VALUE;
    for (i = o = 1; o <= 2; i = ++o) {
      for (j = i1 = 1; i1 <= 12; j = ++i1) {
        hypothesis = Math.pow(Math.E, i) / j;
        if (Math.abs(hypothesis) > 1e-10) {
          ratio = theFloat / hypothesis;
          likelyMultiplier = Math.round(ratio);
          error = Math.abs(1 - ratio / likelyMultiplier);
        } else {
          ratio = 1;
          likelyMultiplier = 1;
          error = Math.abs(theFloat - hypothesis);
        }
        if (error < 2 * precision) {
          complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
          if (complexity < minimumComplexity) {
            minimumComplexity = complexity;
            result = likelyMultiplier + " * (e ^ " + i + " ) / " + j;
            bestResultSoFar = [result, approx_rationalOfE, likelyMultiplier, i, j];
          }
        }
      }
    }
    return bestResultSoFar;
  };

  approxRationalsOfPowersOfPI = function(theFloat) {
    var bestResultSoFar, complexity, error, hypothesis, i, i1, j, likelyMultiplier, minimumComplexity, numberOfDigitsAfterTheDot, o, precision, ratio, result, splitBeforeAndAfterDot;
    splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return ["" + Math.floor(theFloat), approx_just_an_integer, Math.floor(theFloat), 1, 2];
    }
    console.log("precision: " + precision);
    bestResultSoFar = null;
    minimumComplexity = Number.MAX_VALUE;
    for (i = o = 1; o <= 5; i = ++o) {
      for (j = i1 = 1; i1 <= 12; j = ++i1) {
        hypothesis = Math.pow(Math.PI, i) / j;
        if (Math.abs(hypothesis) > 1e-10) {
          ratio = theFloat / hypothesis;
          likelyMultiplier = Math.round(ratio);
          error = Math.abs(1 - ratio / likelyMultiplier);
        } else {
          ratio = 1;
          likelyMultiplier = 1;
          error = Math.abs(theFloat - hypothesis);
        }
        if (error < 2 * precision) {
          complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
          if (complexity < minimumComplexity) {
            minimumComplexity = complexity;
            result = likelyMultiplier + " * (pi ^ " + i + " ) / " + j + " )";
            bestResultSoFar = [result, approx_rationalOfPi, likelyMultiplier, i, j];
          }
        }
      }
    }
    return bestResultSoFar;
  };

  approxTrigonometric = function(theFloat) {
    var approxSineOfRationalMultiplesOfPIResult, approxSineOfRationalsResult, numberOfDigitsAfterTheDot, precision, splitBeforeAndAfterDot;
    splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return ["" + Math.floor(theFloat), approx_just_an_integer, Math.floor(theFloat), 1, 2];
    }
    console.log("precision: " + precision);
    approxSineOfRationalsResult = approxSineOfRationals(theFloat);
    if (approxSineOfRationalsResult != null) {
      return approxSineOfRationalsResult;
    }
    approxSineOfRationalMultiplesOfPIResult = approxSineOfRationalMultiplesOfPI(theFloat);
    if (approxSineOfRationalMultiplesOfPIResult != null) {
      return approxSineOfRationalMultiplesOfPIResult;
    }
    return null;
  };

  approxSineOfRationals = function(theFloat) {
    var bestResultSoFar, complexity, error, fraction, hypothesis, i, i1, j, likelyMultiplier, minimumComplexity, numberOfDigitsAfterTheDot, o, precision, ratio, result, splitBeforeAndAfterDot;
    splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return ["" + Math.floor(theFloat), approx_just_an_integer, Math.floor(theFloat), 1, 2];
    }
    console.log("precision: " + precision);
    bestResultSoFar = null;
    minimumComplexity = Number.MAX_VALUE;
    for (i = o = 1; o <= 4; i = ++o) {
      for (j = i1 = 1; i1 <= 4; j = ++i1) {
        fraction = i / j;
        hypothesis = Math.sin(fraction);
        if (Math.abs(hypothesis) > 1e-10) {
          ratio = theFloat / hypothesis;
          likelyMultiplier = Math.round(ratio);
          error = Math.abs(1 - ratio / likelyMultiplier);
        } else {
          ratio = 1;
          likelyMultiplier = 1;
          error = Math.abs(theFloat - hypothesis);
        }
        if (error < 2 * precision) {
          complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
          if (complexity < minimumComplexity) {
            minimumComplexity = complexity;
            result = likelyMultiplier + " * sin( " + i + "/" + j + " )";
            bestResultSoFar = [result, approx_sine_of_rational, likelyMultiplier, i, j];
          }
        }
      }
    }
    return bestResultSoFar;
  };

  approxSineOfRationalMultiplesOfPI = function(theFloat) {
    var bestResultSoFar, complexity, error, fraction, hypothesis, i, i1, j, likelyMultiplier, minimumComplexity, numberOfDigitsAfterTheDot, o, precision, ratio, result, splitBeforeAndAfterDot;
    splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return ["" + Math.floor(theFloat), approx_just_an_integer, Math.floor(theFloat), 1, 2];
    }
    console.log("precision: " + precision);
    bestResultSoFar = null;
    minimumComplexity = Number.MAX_VALUE;
    for (i = o = 1; o <= 13; i = ++o) {
      for (j = i1 = 1; i1 <= 13; j = ++i1) {
        fraction = i / j;
        hypothesis = Math.sin(Math.PI * fraction);
        if (Math.abs(hypothesis) > 1e-10) {
          ratio = theFloat / hypothesis;
          likelyMultiplier = Math.round(ratio);
          error = Math.abs(1 - ratio / likelyMultiplier);
        } else {
          ratio = 1;
          likelyMultiplier = 1;
          error = Math.abs(theFloat - hypothesis);
        }
        if (error < 23 * precision) {
          complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
          if (complexity < minimumComplexity) {
            minimumComplexity = complexity;
            result = likelyMultiplier + " * sin( " + i + "/" + j + " * pi )";
            bestResultSoFar = [result, approx_sine_of_pi_times_rational, likelyMultiplier, i, j];
          }
        }
      }
    }
    return bestResultSoFar;
  };

  approxAll = function(theFloat) {
    var LOG_EXPLANATIONS, approxLogsResult, approxRadicalsResult, approxRationalsOfPowersOfEResult, approxRationalsOfPowersOfPIResult, approxTrigonometricResult, bestApproxSoFar, constantsSum, constantsSumMin, numberOfDigitsAfterTheDot, precision, splitBeforeAndAfterDot;
    splitBeforeAndAfterDot = theFloat.toString().split(".");
    if (splitBeforeAndAfterDot.length === 2) {
      numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
      precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    } else {
      return ["" + Math.floor(theFloat), approx_just_an_integer, Math.floor(theFloat), 1, 2];
    }
    console.log("precision: " + precision);
    constantsSumMin = Number.MAX_VALUE;
    constantsSum = 0;
    bestApproxSoFar = null;
    LOG_EXPLANATIONS = true;
    approxRadicalsResult = approxRadicals(theFloat);
    if (approxRadicalsResult != null) {
      constantsSum = simpleComplexityMeasure(approxRadicalsResult);
      if (constantsSum < constantsSumMin) {
        if (LOG_EXPLANATIONS) {
          console.log("better explanation by approxRadicals: " + approxRadicalsResult + " complexity: " + constantsSum);
        }
        constantsSumMin = constantsSum;
        bestApproxSoFar = approxRadicalsResult;
      } else {
        if (LOG_EXPLANATIONS) {
          console.log("subpar explanation by approxRadicals: " + approxRadicalsResult + " complexity: " + constantsSum);
        }
      }
    }
    approxLogsResult = approxLogs(theFloat);
    if (approxLogsResult != null) {
      constantsSum = simpleComplexityMeasure(approxLogsResult);
      if (constantsSum < constantsSumMin) {
        if (LOG_EXPLANATIONS) {
          console.log("better explanation by approxLogs: " + approxLogsResult + " complexity: " + constantsSum);
        }
        constantsSumMin = constantsSum;
        bestApproxSoFar = approxLogsResult;
      } else {
        if (LOG_EXPLANATIONS) {
          console.log("subpar explanation by approxLogs: " + approxLogsResult + " complexity: " + constantsSum);
        }
      }
    }
    approxRationalsOfPowersOfEResult = approxRationalsOfPowersOfE(theFloat);
    if (approxRationalsOfPowersOfEResult != null) {
      constantsSum = simpleComplexityMeasure(approxRationalsOfPowersOfEResult);
      if (constantsSum < constantsSumMin) {
        if (LOG_EXPLANATIONS) {
          console.log("better explanation by approxRationalsOfPowersOfE: " + approxRationalsOfPowersOfEResult + " complexity: " + constantsSum);
        }
        constantsSumMin = constantsSum;
        bestApproxSoFar = approxRationalsOfPowersOfEResult;
      } else {
        if (LOG_EXPLANATIONS) {
          console.log("subpar explanation by approxRationalsOfPowersOfE: " + approxRationalsOfPowersOfEResult + " complexity: " + constantsSum);
        }
      }
    }
    approxRationalsOfPowersOfPIResult = approxRationalsOfPowersOfPI(theFloat);
    if (approxRationalsOfPowersOfPIResult != null) {
      constantsSum = simpleComplexityMeasure(approxRationalsOfPowersOfPIResult);
      if (constantsSum < constantsSumMin) {
        if (LOG_EXPLANATIONS) {
          console.log("better explanation by approxRationalsOfPowersOfPI: " + approxRationalsOfPowersOfPIResult + " complexity: " + constantsSum);
        }
        constantsSumMin = constantsSum;
        bestApproxSoFar = approxRationalsOfPowersOfPIResult;
      } else {
        if (LOG_EXPLANATIONS) {
          console.log("subpar explanation by approxRationalsOfPowersOfPI: " + approxRationalsOfPowersOfPIResult + " complexity: " + constantsSum);
        }
      }
    }
    approxTrigonometricResult = approxTrigonometric(theFloat);
    if (approxTrigonometricResult != null) {
      constantsSum = simpleComplexityMeasure(approxTrigonometricResult);
      if (constantsSum < constantsSumMin) {
        if (LOG_EXPLANATIONS) {
          console.log("better explanation by approxTrigonometric: " + approxTrigonometricResult + " complexity: " + constantsSum);
        }
        constantsSumMin = constantsSum;
        bestApproxSoFar = approxTrigonometricResult;
      } else {
        if (LOG_EXPLANATIONS) {
          console.log("subpar explanation by approxTrigonometric: " + approxTrigonometricResult + " complexity: " + constantsSum);
        }
      }
    }
    return bestApproxSoFar;
  };

  simpleComplexityMeasure = function(aResult, b, c) {
    var theSum;
    theSum = null;
    if (aResult instanceof Array) {
      switch (aResult[1]) {
        case approx_sine_of_pi_times_rational:
          theSum = 4;
          break;
        case approx_rationalOfPi:
          theSum = Math.pow(4, Math.abs(aResult[3])) * Math.abs(aResult[2]);
          break;
        case approx_rationalOfE:
          theSum = Math.pow(3, Math.abs(aResult[3])) * Math.abs(aResult[2]);
          break;
        default:
          theSum = 0;
      }
      theSum += Math.abs(aResult[2]) * (Math.abs(aResult[3]) + Math.abs(aResult[4]));
    } else {
      theSum += Math.abs(aResult) * (Math.abs(b) + Math.abs(c));
    }
    if (aResult[2] === 1) {
      theSum -= 1;
    } else {
      theSum += 1;
    }
    if (aResult[3] === 1) {
      theSum -= 1;
    } else {
      theSum += 1;
    }
    if (aResult[4] === 1) {
      theSum -= 1;
    } else {
      theSum += 1;
    }
    if (theSum < 0) {
      theSum = 0;
    }
    return theSum;
  };

  testApprox = function() {
    var error, fraction, i, i1, i2, i3, j, j1, j2, j3, k3, l1, l2, l3, len, len1, len2, len3, len4, len5, len6, len7, m1, m2, m3, n1, n2, o, o1, o2, originalValue, q1, q2, r1, r2, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, returned, returnedFraction, returnedValue, s1, s2, t1, t2, u1, u2, v1, v2, value, x1, x2, z1, z2;
    ref = [2, 3, 5, 6, 7, 8, 10];
    for (o = 0, len = ref.length; o < len; o++) {
      i = ref[o];
      ref1 = [2, 3, 5, 6, 7, 8, 10];
      for (i1 = 0, len1 = ref1.length; i1 < len1; i1++) {
        j = ref1[i1];
        if (i === j) {
          continue;
        }
        console.log("testapproxRadicals testing: " + "1 * sqrt( " + i + " ) / " + j);
        fraction = i / j;
        value = Math.sqrt(i) / j;
        returned = approxRadicals(value);
        returnedValue = returned[2] * Math.sqrt(returned[3]) / returned[4];
        if (Math.abs(value - returnedValue) > 1e-15) {
          console.log("fail testapproxRadicals: " + "1 * sqrt( " + i + " ) / " + j + " . obtained: " + returned);
        }
      }
    }
    ref2 = [2, 3, 5, 6, 7, 8, 10];
    for (j1 = 0, len2 = ref2.length; j1 < len2; j1++) {
      i = ref2[j1];
      ref3 = [2, 3, 5, 6, 7, 8, 10];
      for (l1 = 0, len3 = ref3.length; l1 < len3; l1++) {
        j = ref3[l1];
        if (i === j) {
          continue;
        }
        console.log("testapproxRadicals testing with 4 digits: " + "1 * sqrt( " + i + " ) / " + j);
        fraction = i / j;
        originalValue = Math.sqrt(i) / j;
        value = originalValue.toFixed(4);
        returned = approxRadicals(value);
        returnedValue = returned[2] * Math.sqrt(returned[3]) / returned[4];
        if (Math.abs(originalValue - returnedValue) > 1e-15) {
          console.log("fail testapproxRadicals with 4 digits: " + "1 * sqrt( " + i + " ) / " + j + " . obtained: " + returned);
        }
      }
    }
    ref4 = [2, 3, 5, 6, 7, 8, 10];
    for (m1 = 0, len4 = ref4.length; m1 < len4; m1++) {
      i = ref4[m1];
      ref5 = [2, 3, 5, 6, 7, 8, 10];
      for (n1 = 0, len5 = ref5.length; n1 < len5; n1++) {
        j = ref5[n1];
        if (i === j) {
          continue;
        }
        console.log("testapproxRadicals testing: " + "1 * sqrt( " + i + " / " + j + " )");
        fraction = i / j;
        value = Math.sqrt(i / j);
        returned = approxRadicals(value);
        if (returned != null) {
          returnedValue = returned[2] * Math.sqrt(returned[3] / returned[4]);
          if (returned[1] === approx_radicalOfRatio && Math.abs(value - returnedValue) > 1e-15) {
            console.log("fail testapproxRadicals: " + "1 * sqrt( " + i + " / " + j + " ) . obtained: " + returned);
          }
        }
      }
    }
    ref6 = [1, 2, 3, 5, 6, 7, 8, 10];
    for (o1 = 0, len6 = ref6.length; o1 < len6; o1++) {
      i = ref6[o1];
      ref7 = [1, 2, 3, 5, 6, 7, 8, 10];
      for (q1 = 0, len7 = ref7.length; q1 < len7; q1++) {
        j = ref7[q1];
        if (i === 1 && j === 1) {
          continue;
        }
        console.log("testapproxRadicals testing with 4 digits:: " + "1 * sqrt( " + i + " / " + j + " )");
        fraction = i / j;
        originalValue = Math.sqrt(i / j);
        value = originalValue.toFixed(4);
        returned = approxRadicals(value);
        returnedValue = returned[2] * Math.sqrt(returned[3] / returned[4]);
        if (returned[1] === approx_radicalOfRatio && Math.abs(originalValue - returnedValue) > 1e-15) {
          console.log("fail testapproxRadicals with 4 digits:: " + "1 * sqrt( " + i + " / " + j + " ) . obtained: " + returned);
        }
      }
    }
    for (i = r1 = 1; r1 <= 5; i = ++r1) {
      for (j = s1 = 1; s1 <= 5; j = ++s1) {
        console.log("testApproxAll testing: " + "1 * log(" + i + " ) / " + j);
        fraction = i / j;
        value = Math.log(i) / j;
        returned = approxAll(value);
        returnedValue = returned[2] * Math.log(returned[3]) / returned[4];
        if (Math.abs(value - returnedValue) > 1e-15) {
          console.log("fail testApproxAll: " + "1 * log(" + i + " ) / " + j + " . obtained: " + returned);
        }
      }
    }
    for (i = t1 = 1; t1 <= 5; i = ++t1) {
      for (j = u1 = 1; u1 <= 5; j = ++u1) {
        console.log("testApproxAll testing with 4 digits: " + "1 * log(" + i + " ) / " + j);
        fraction = i / j;
        originalValue = Math.log(i) / j;
        value = originalValue.toFixed(4);
        returned = approxAll(value);
        returnedValue = returned[2] * Math.log(returned[3]) / returned[4];
        if (Math.abs(originalValue - returnedValue) > 1e-15) {
          console.log("fail testApproxAll with 4 digits: " + "1 * log(" + i + " ) / " + j + " . obtained: " + returned);
        }
      }
    }
    for (i = v1 = 1; v1 <= 5; i = ++v1) {
      for (j = x1 = 1; x1 <= 5; j = ++x1) {
        console.log("testApproxAll testing: " + "1 * log(" + i + " / " + j + " )");
        fraction = i / j;
        value = Math.log(i / j);
        returned = approxAll(value);
        returnedValue = returned[2] * Math.log(returned[3] / returned[4]);
        if (Math.abs(value - returnedValue) > 1e-15) {
          console.log("fail testApproxAll: " + "1 * log(" + i + " / " + j + " )" + " . obtained: " + returned);
        }
      }
    }
    for (i = z1 = 1; z1 <= 5; i = ++z1) {
      for (j = i2 = 1; i2 <= 5; j = ++i2) {
        console.log("testApproxAll testing with 4 digits: " + "1 * log(" + i + " / " + j + " )");
        fraction = i / j;
        originalValue = Math.log(i / j);
        value = originalValue.toFixed(4);
        returned = approxAll(value);
        returnedValue = returned[2] * Math.log(returned[3] / returned[4]);
        if (Math.abs(originalValue - returnedValue) > 1e-15) {
          console.log("fail testApproxAll with 4 digits: " + "1 * log(" + i + " / " + j + " )" + " . obtained: " + returned);
        }
      }
    }
    for (i = j2 = 1; j2 <= 2; i = ++j2) {
      for (j = l2 = 1; l2 <= 12; j = ++l2) {
        console.log("testApproxAll testing: " + "1 * (e ^ " + i + " ) / " + j);
        fraction = i / j;
        value = Math.pow(Math.E, i) / j;
        returned = approxAll(value);
        returnedValue = returned[2] * Math.pow(Math.E, returned[3]) / returned[4];
        if (Math.abs(value - returnedValue) > 1e-15) {
          console.log("fail testApproxAll: " + "1 * (e ^ " + i + " ) / " + j + " . obtained: " + returned);
        }
      }
    }
    for (i = m2 = 1; m2 <= 2; i = ++m2) {
      for (j = n2 = 1; n2 <= 12; j = ++n2) {
        console.log("approxRationalsOfPowersOfE testing with 4 digits: " + "1 * (e ^ " + i + " ) / " + j);
        fraction = i / j;
        originalValue = Math.pow(Math.E, i) / j;
        value = originalValue.toFixed(4);
        returned = approxRationalsOfPowersOfE(value);
        returnedValue = returned[2] * Math.pow(Math.E, returned[3]) / returned[4];
        if (Math.abs(originalValue - returnedValue) > 1e-15) {
          console.log("fail approxRationalsOfPowersOfE with 4 digits: " + "1 * (e ^ " + i + " ) / " + j + " . obtained: " + returned);
        }
      }
    }
    for (i = o2 = 1; o2 <= 2; i = ++o2) {
      for (j = q2 = 1; q2 <= 12; j = ++q2) {
        console.log("testApproxAll testing: " + "1 * pi ^ " + i + " / " + j);
        fraction = i / j;
        value = Math.pow(Math.PI, i) / j;
        returned = approxAll(value);
        returnedValue = returned[2] * Math.pow(Math.PI, returned[3]) / returned[4];
        if (Math.abs(value - returnedValue) > 1e-15) {
          console.log("fail testApproxAll: " + "1 * pi ^ " + i + " / " + j + " ) . obtained: " + returned);
        }
      }
    }
    for (i = r2 = 1; r2 <= 2; i = ++r2) {
      for (j = s2 = 1; s2 <= 12; j = ++s2) {
        console.log("approxRationalsOfPowersOfPI testing with 4 digits: " + "1 * pi ^ " + i + " / " + j);
        fraction = i / j;
        originalValue = Math.pow(Math.PI, i) / j;
        value = originalValue.toFixed(4);
        returned = approxRationalsOfPowersOfPI(value);
        returnedValue = returned[2] * Math.pow(Math.PI, returned[3]) / returned[4];
        if (Math.abs(originalValue - returnedValue) > 1e-15) {
          console.log("fail approxRationalsOfPowersOfPI with 4 digits: " + "1 * pi ^ " + i + " / " + j + " ) . obtained: " + returned);
        }
      }
    }
    for (i = t2 = 1; t2 <= 4; i = ++t2) {
      for (j = u2 = 1; u2 <= 4; j = ++u2) {
        console.log("testApproxAll testing: " + "1 * sin( " + i + "/" + j + " )");
        fraction = i / j;
        value = Math.sin(fraction);
        returned = approxAll(value);
        returnedFraction = returned[3] / returned[4];
        returnedValue = returned[2] * Math.sin(returnedFraction);
        if (Math.abs(value - returnedValue) > 1e-15) {
          console.log("fail testApproxAll: " + "1 * sin( " + i + "/" + j + " ) . obtained: " + returned);
        }
      }
    }
    for (i = v2 = 1; v2 <= 4; i = ++v2) {
      for (j = x2 = 1; x2 <= 4; j = ++x2) {
        console.log("testApproxAll testing with 5 digits: " + "1 * sin( " + i + "/" + j + " )");
        fraction = i / j;
        originalValue = Math.sin(fraction);
        value = originalValue.toFixed(5);
        returned = approxAll(value);
        if (returned == null) {
          console.log("fail testApproxAll with 5 digits: " + "1 * sin( " + i + "/" + j + " ) . obtained:  undefined ");
        }
        returnedFraction = returned[3] / returned[4];
        returnedValue = returned[2] * Math.sin(returnedFraction);
        error = Math.abs(originalValue - returnedValue);
        if (error > 1e-14) {
          console.log("fail testApproxAll with 5 digits: " + "1 * sin( " + i + "/" + j + " ) . obtained: " + returned + " error: " + error);
        }
      }
    }
    for (i = z2 = 1; z2 <= 4; i = ++z2) {
      for (j = i3 = 1; i3 <= 4; j = ++i3) {
        console.log("testApproxAll testing with 4 digits: " + "1 * sin( " + i + "/" + j + " )");
        fraction = i / j;
        originalValue = Math.sin(fraction);
        value = originalValue.toFixed(4);
        returned = approxAll(value);
        if (returned == null) {
          console.log("fail testApproxAll with 4 digits: " + "1 * sin( " + i + "/" + j + " ) . obtained:  undefined ");
        }
        returnedFraction = returned[3] / returned[4];
        returnedValue = returned[2] * Math.sin(returnedFraction);
        error = Math.abs(originalValue - returnedValue);
        if (error > 1e-14) {
          console.log("fail testApproxAll with 4 digits: " + "1 * sin( " + i + "/" + j + " ) . obtained: " + returned + " error: " + error);
        }
      }
    }
    value = 0;
    if (approxAll(value)[0] !== "0") {
      console.log("fail testApproxAll: 0");
    }
    value = 0.0;
    if (approxAll(value)[0] !== "0") {
      console.log("fail testApproxAll: 0.0");
    }
    value = 0.00;
    if (approxAll(value)[0] !== "0") {
      console.log("fail testApproxAll: 0.00");
    }
    value = 0.000;
    if (approxAll(value)[0] !== "0") {
      console.log("fail testApproxAll: 0.000");
    }
    value = 0.0000;
    if (approxAll(value)[0] !== "0") {
      console.log("fail testApproxAll: 0.0000");
    }
    value = 1;
    if (approxAll(value)[0] !== "1") {
      console.log("fail testApproxAll: 1");
    }
    value = 1.0;
    if (approxAll(value)[0] !== "1") {
      console.log("fail testApproxAll: 1.0");
    }
    value = 1.00;
    if (approxAll(value)[0] !== "1") {
      console.log("fail testApproxAll: 1.00");
    }
    value = 1.000;
    if (approxAll(value)[0] !== "1") {
      console.log("fail testApproxAll: 1.000");
    }
    value = 1.0000;
    if (approxAll(value)[0] !== "1") {
      console.log("fail testApproxAll: 1.0000");
    }
    value = 1.00000;
    if (approxAll(value)[0] !== "1") {
      console.log("fail testApproxAll: 1.00000");
    }
    value = Math.sqrt(2);
    if (approxAll(value)[0] !== "1 * sqrt( 2 ) / 1") {
      console.log("fail testApproxAll: Math.sqrt(2)");
    }
    value = 1.41;
    if (approxAll(value)[0] !== "1 * sqrt( 2 ) / 1") {
      console.log("fail testApproxAll: 1.41");
    }
    value = 1.4;
    if (approxRadicals(value)[0] !== "1 * sqrt( 2 ) / 1") {
      console.log("fail approxRadicals: 1.4");
    }
    value = 0.6;
    if (approxLogs(value)[0] !== "1 * log( 2 ) / 1") {
      console.log("fail approxLogs: 0.6");
    }
    value = 0.69;
    if (approxLogs(value)[0] !== "1 * log( 2 ) / 1") {
      console.log("fail approxLogs: 0.69");
    }
    value = 0.7;
    if (approxLogs(value)[0] !== "1 * log( 2 ) / 1") {
      console.log("fail approxLogs: 0.7");
    }
    value = 1.09;
    if (approxLogs(value)[0] !== "1 * log( 3 ) / 1") {
      console.log("fail approxLogs: 1.09");
    }
    value = 1.09;
    if (approxAll(value)[0] !== "1 * log( 3 ) / 1") {
      console.log("fail approxAll: 1.09");
    }
    value = 1.098;
    if (approxAll(value)[0] !== "1 * log( 3 ) / 1") {
      console.log("fail approxAll: 1.098");
    }
    value = 1.1;
    if (approxAll(value)[0] !== "1 * log( 3 ) / 1") {
      console.log("fail approxAll: 1.1");
    }
    value = 1.11;
    if (approxAll(value)[0] !== "1 * log( 3 ) / 1") {
      console.log("fail approxAll: 1.11");
    }
    value = Math.sqrt(3);
    if (approxAll(value)[0] !== "1 * sqrt( 3 ) / 1") {
      console.log("fail testApproxAll: Math.sqrt(3)");
    }
    value = 1.0000;
    if (approxAll(value)[0] !== "1") {
      console.log("fail testApproxAll: 1.0000");
    }
    value = 3.141592;
    if (approxAll(value)[0] !== "1 * (pi ^ 1 ) / 1 )") {
      console.log("fail testApproxAll: 3.141592");
    }
    value = 31.41592;
    if (approxAll(value)[0] !== "10 * (pi ^ 1 ) / 1 )") {
      console.log("fail testApproxAll: 31.41592");
    }
    value = 314.1592;
    if (approxAll(value)[0] !== "100 * (pi ^ 1 ) / 1 )") {
      console.log("fail testApproxAll: 314.1592");
    }
    value = 31415926.53589793;
    if (approxAll(value)[0] !== "10000000 * (pi ^ 1 ) / 1 )") {
      console.log("fail testApproxAll: 31415926.53589793");
    }
    value = Math.sqrt(2);
    if (approxTrigonometric(value)[0] !== "2 * sin( 1/4 * pi )") {
      console.log("fail approxTrigonometric: Math.sqrt(2)");
    }
    value = Math.sqrt(3);
    if (approxTrigonometric(value)[0] !== "2 * sin( 1/3 * pi )") {
      console.log("fail approxTrigonometric: Math.sqrt(3)");
    }
    value = (Math.sqrt(6) - Math.sqrt(2)) / 4;
    if (approxAll(value)[0] !== "1 * sin( 1/12 * pi )") {
      console.log("fail testApproxAll: (Math.sqrt(6) - Math.sqrt(2))/4");
    }
    value = Math.sqrt(2 - Math.sqrt(2)) / 2;
    if (approxAll(value)[0] !== "1 * sin( 1/8 * pi )") {
      console.log("fail testApproxAll: Math.sqrt(2 - Math.sqrt(2))/2");
    }
    value = (Math.sqrt(6) + Math.sqrt(2)) / 4;
    if (approxAll(value)[0] !== "1 * sin( 5/12 * pi )") {
      console.log("fail testApproxAll: (Math.sqrt(6) + Math.sqrt(2))/4");
    }
    value = Math.sqrt(2 + Math.sqrt(3)) / 2;
    if (approxAll(value)[0] !== "1 * sin( 5/12 * pi )") {
      console.log("fail testApproxAll: Math.sqrt(2 + Math.sqrt(3))/2");
    }
    value = (Math.sqrt(5) - 1) / 4;
    if (approxAll(value)[0] !== "1 * sin( 1/10 * pi )") {
      console.log("fail testApproxAll: (Math.sqrt(5) - 1)/4");
    }
    value = Math.sqrt(10 - 2 * Math.sqrt(5)) / 4;
    if (approxAll(value)[0] !== "1 * sin( 1/5 * pi )") {
      console.log("fail testApproxAll: Math.sqrt(10 - 2*Math.sqrt(5))/4");
    }
    value = Math.sin(Math.PI / 7);
    if (approxAll(value)[0] !== "1 * sin( 1/7 * pi )") {
      console.log("fail testApproxAll: Math.sin(Math.PI/7)");
    }
    value = Math.sin(Math.PI / 9);
    if (approxAll(value)[0] !== "1 * sin( 1/9 * pi )") {
      console.log("fail testApproxAll: Math.sin(Math.PI/9)");
    }
    value = 1836.15267;
    if (approxRationalsOfPowersOfPI(value)[0] !== "6 * (pi ^ 5 ) / 1 )") {
      console.log("fail approxRationalsOfPowersOfPI: 1836.15267");
    }
    for (i = j3 = 1; j3 <= 13; i = ++j3) {
      for (j = k3 = 1; k3 <= 13; j = ++k3) {
        console.log("approxTrigonometric testing: " + "1 * sin( " + i + "/" + j + " * pi )");
        fraction = i / j;
        value = Math.sin(Math.PI * fraction);
        returned = approxTrigonometric(value);
        returnedFraction = returned[3] / returned[4];
        returnedValue = returned[2] * Math.sin(Math.PI * returnedFraction);
        if (Math.abs(value - returnedValue) > 1e-15) {
          console.log("fail approxTrigonometric: " + "1 * sin( " + i + "/" + j + " * pi ) . obtained: " + returned);
        }
      }
    }
    for (i = l3 = 1; l3 <= 13; i = ++l3) {
      for (j = m3 = 1; m3 <= 13; j = ++m3) {
        if (i === 5 && j === 11 || i === 6 && j === 11) {
          continue;
        }
        console.log("approxTrigonometric testing with 4 digits: " + "1 * sin( " + i + "/" + j + " * pi )");
        fraction = i / j;
        originalValue = Math.sin(Math.PI * fraction);
        value = originalValue.toFixed(4);
        returned = approxTrigonometric(value);
        returnedFraction = returned[3] / returned[4];
        returnedValue = returned[2] * Math.sin(Math.PI * returnedFraction);
        error = Math.abs(originalValue - returnedValue);
        if (error > 1e-14) {
          console.log("fail approxTrigonometric with 4 digits: " + "1 * sin( " + i + "/" + j + " * pi ) . obtained: " + returned + " error: " + error);
        }
      }
    }
    return console.log("testApprox done");
  };

  $.approxRadicals = approxRadicals;

  $.approxRationalsOfLogs = approxRationalsOfLogs;

  $.approxAll = approxAll;

  $.testApprox = testApprox;


  /* arccos =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  x
  
  General description
  -------------------
  Returns the inverse cosine of x.
   */

  Eval_arccos = function() {
    push(cadr(p1));
    Eval();
    return arccos();
  };

  arccos = function() {
    var d, errno, n;
    n = 0;
    d = 0.0;
    save();
    p1 = pop();
    if (car(p1) === symbol(COS)) {
      push(cadr(p1));
      restore();
      return;
    }
    if (isdouble(p1)) {
      errno = 0;
      d = Math.acos(p1.d);
      if (errno) {
        stop("arccos function argument is not in the interval [-1,1]");
      }
      push_double(d);
      restore();
      return;
    }
    if ((isoneoversqrttwo(p1)) || (car(p1) === symbol(MULTIPLY) && equalq(car(cdr(p1)), 1, 2) && car(car(cdr(cdr(p1)))) === symbol(POWER) && equaln(car(cdr(car(cdr(cdr(p1))))), 2) && equalq(car(cdr(cdr(car(cdr(cdr(p1)))))), 1, 2))) {
      if (evaluatingAsFloats) {
        push_double(Math.PI / 4.0);
      } else {
        push_rational(1, 4);
        push_symbol(PI);
        multiply();
      }
      restore();
      return;
    }
    if ((isminusoneoversqrttwo(p1)) || (car(p1) === symbol(MULTIPLY) && equalq(car(cdr(p1)), -1, 2) && car(car(cdr(cdr(p1)))) === symbol(POWER) && equaln(car(cdr(car(cdr(cdr(p1))))), 2) && equalq(car(cdr(cdr(car(cdr(cdr(p1)))))), 1, 2))) {
      if (evaluatingAsFloats) {
        push_double(Math.PI * 3.0 / 4.0);
      } else {
        push_rational(3, 4);
        push_symbol(PI);
        multiply();
      }
      restore();
      return;
    }
    if (!isrational(p1)) {
      push_symbol(ARCCOS);
      push(p1);
      list(2);
      restore();
      return;
    }
    push(p1);
    push_integer(2);
    multiply();
    n = pop_integer();
    switch (n) {
      case -2:
        if (evaluatingAsFloats) {
          push_double(Math.PI);
        } else {
          push_symbol(PI);
        }
        break;
      case -1:
        if (evaluatingAsFloats) {
          push_double(Math.PI * 2.0 / 3.0);
        } else {
          push_rational(2, 3);
          push_symbol(PI);
          multiply();
        }
        break;
      case 0:
        if (evaluatingAsFloats) {
          push_double(Math.PI / 2.0);
        } else {
          push_rational(1, 2);
          push_symbol(PI);
          multiply();
        }
        break;
      case 1:
        if (evaluatingAsFloats) {
          push_double(Math.PI / 3.0);
        } else {
          push_rational(1, 3);
          push_symbol(PI);
          multiply();
        }
        break;
      case 2:
        if (evaluatingAsFloats) {
          push_double(0.0);
        } else {
          push(zero);
        }
        break;
      default:
        push_symbol(ARCCOS);
        push(p1);
        list(2);
    }
    return restore();
  };


  /* arccosh =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  x
  
  General description
  -------------------
  Returns the inverse hyperbolic cosine of x.
   */

  Eval_arccosh = function() {
    push(cadr(p1));
    Eval();
    return arccosh();
  };

  arccosh = function() {
    var d;
    d = 0.0;
    save();
    p1 = pop();
    if (car(p1) === symbol(COSH)) {
      push(cadr(p1));
      restore();
      return;
    }
    if (isdouble(p1)) {
      d = p1.d;
      if (d < 1.0) {
        stop("arccosh function argument is less than 1.0");
      }
      d = Math.log(d + Math.sqrt(d * d - 1.0));
      push_double(d);
      restore();
      return;
    }
    if (isplusone(p1)) {
      push(zero);
      restore();
      return;
    }
    push_symbol(ARCCOSH);
    push(p1);
    list(2);
    return restore();
  };


  /* arcsin =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  x
  
  General description
  -------------------
  Returns the inverse sine of x.
   */

  Eval_arcsin = function() {
    push(cadr(p1));
    Eval();
    return arcsin();
  };

  arcsin = function() {
    var d, errno, n;
    n = 0;
    d = 0;
    save();
    p1 = pop();
    if (car(p1) === symbol(SIN)) {
      push(cadr(p1));
      restore();
      return;
    }
    if (isdouble(p1)) {
      errno = 0;
      d = Math.asin(p1.d);
      if (errno) {
        stop("arcsin function argument is not in the interval [-1,1]");
      }
      push_double(d);
      restore();
      return;
    }
    if ((isoneoversqrttwo(p1)) || (car(p1) === symbol(MULTIPLY) && equalq(car(cdr(p1)), 1, 2) && car(car(cdr(cdr(p1)))) === symbol(POWER) && equaln(car(cdr(car(cdr(cdr(p1))))), 2) && equalq(car(cdr(cdr(car(cdr(cdr(p1)))))), 1, 2))) {
      push_rational(1, 4);
      push_symbol(PI);
      multiply();
      restore();
      return;
    }
    if ((isminusoneoversqrttwo(p1)) || (car(p1) === symbol(MULTIPLY) && equalq(car(cdr(p1)), -1, 2) && car(car(cdr(cdr(p1)))) === symbol(POWER) && equaln(car(cdr(car(cdr(cdr(p1))))), 2) && equalq(car(cdr(cdr(car(cdr(cdr(p1)))))), 1, 2))) {
      if (evaluatingAsFloats) {
        push_double(-Math.PI / 4.0);
      } else {
        push_rational(-1, 4);
        push_symbol(PI);
        multiply();
      }
      restore();
      return;
    }
    if (!isrational(p1)) {
      push_symbol(ARCSIN);
      push(p1);
      list(2);
      restore();
      return;
    }
    push(p1);
    push_integer(2);
    multiply();
    n = pop_integer();
    switch (n) {
      case -2:
        if (evaluatingAsFloats) {
          push_double(-Math.PI / 2.0);
        } else {
          push_rational(-1, 2);
          push_symbol(PI);
          multiply();
        }
        break;
      case -1:
        if (evaluatingAsFloats) {
          push_double(-Math.PI / 6.0);
        } else {
          push_rational(-1, 6);
          push_symbol(PI);
          multiply();
        }
        break;
      case 0:
        if (evaluatingAsFloats) {
          push_double(0.0);
        } else {
          push(zero);
        }
        break;
      case 1:
        if (evaluatingAsFloats) {
          push_double(Math.PI / 6.0);
        } else {
          push_rational(1, 6);
          push_symbol(PI);
          multiply();
        }
        break;
      case 2:
        if (evaluatingAsFloats) {
          push_double(Math.PI / 2.0);
        } else {
          push_rational(1, 2);
          push_symbol(PI);
          multiply();
        }
        break;
      default:
        push_symbol(ARCSIN);
        push(p1);
        list(2);
    }
    return restore();
  };


  /* arcsinh =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  x
  
  General description
  -------------------
  Returns the inverse hyperbolic sine of x.
   */

  Eval_arcsinh = function() {
    push(cadr(p1));
    Eval();
    return arcsinh();
  };

  arcsinh = function() {
    var d;
    d = 0.0;
    save();
    p1 = pop();
    if (car(p1) === symbol(SINH)) {
      push(cadr(p1));
      restore();
      return;
    }
    if (isdouble(p1)) {
      d = p1.d;
      d = Math.log(d + Math.sqrt(d * d + 1.0));
      push_double(d);
      restore();
      return;
    }
    if (isZeroAtomOrTensor(p1)) {
      push(zero);
      restore();
      return;
    }
    push_symbol(ARCSINH);
    push(p1);
    list(2);
    return restore();
  };


  /* arctan =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  x
  
  General description
  -------------------
  Returns the inverse tangent of x.
   */

  Eval_arctan = function() {
    push(cadr(p1));
    Eval();
    return arctan();
  };

  arctan = function() {
    var d, errno;
    d = 0;
    save();
    p1 = pop();
    if (car(p1) === symbol(TAN)) {
      push(cadr(p1));
      restore();
      return;
    }
    if (isdouble(p1)) {
      errno = 0;
      d = Math.atan(p1.d);
      if (errno) {
        stop("arctan function error");
      }
      push_double(d);
      restore();
      return;
    }
    if (isZeroAtomOrTensor(p1)) {
      push(zero);
      restore();
      return;
    }
    if (isnegative(p1)) {
      push(p1);
      negate();
      arctan();
      negate();
      restore();
      return;
    }
    if (Find(p1, symbol(SIN)) && Find(p1, symbol(COS))) {
      push(p1);
      numerator();
      p2 = pop();
      push(p1);
      denominator();
      p3 = pop();
      if (car(p2) === symbol(SIN) && car(p3) === symbol(COS) && equal(cadr(p2), cadr(p3))) {
        push(cadr(p2));
        restore();
        return;
      }
    }
    if ((car(p1) === symbol(POWER) && equaln(cadr(p1), 3) && equalq(caddr(p1), -1, 2)) || (car(p1) === symbol(MULTIPLY) && equalq(car(cdr(p1)), 1, 3) && car(car(cdr(cdr(p1)))) === symbol(POWER) && equaln(car(cdr(car(cdr(cdr(p1))))), 3) && equalq(car(cdr(cdr(car(cdr(cdr(p1)))))), 1, 2))) {
      push_rational(1, 6);
      if (evaluatingAsFloats) {
        push_double(Math.PI);
      } else {
        push(symbol(PI));
      }
      multiply();
      restore();
      return;
    }
    if (equaln(p1, 1)) {
      push_rational(1, 4);
      if (evaluatingAsFloats) {
        push_double(Math.PI);
      } else {
        push(symbol(PI));
      }
      multiply();
      restore();
      return;
    }
    if (car(p1) === symbol(POWER) && equaln(cadr(p1), 3) && equalq(caddr(p1), 1, 2)) {
      push_rational(1, 3);
      if (evaluatingAsFloats) {
        push_double(Math.PI);
      } else {
        push(symbol(PI));
      }
      multiply();
      restore();
      return;
    }
    push_symbol(ARCTAN);
    push(p1);
    list(2);
    return restore();
  };


  /* arctanh =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  x
  
  General description
  -------------------
  Returns the inverse hyperbolic tangent of x.
   */

  Eval_arctanh = function() {
    push(cadr(p1));
    Eval();
    return arctanh();
  };

  arctanh = function() {
    var d;
    d = 0.0;
    save();
    p1 = pop();
    if (car(p1) === symbol(TANH)) {
      push(cadr(p1));
      restore();
      return;
    }
    if (isdouble(p1)) {
      d = p1.d;
      if (d < -1.0 || d > 1.0) {
        stop("arctanh function argument is not in the interval [-1,1]");
      }
      d = Math.log((1.0 + d) / (1.0 - d)) / 2.0;
      push_double(d);
      restore();
      return;
    }
    if (isZeroAtomOrTensor(p1)) {
      push(zero);
      restore();
      return;
    }
    push_symbol(ARCTANH);
    push(p1);
    list(2);
    return restore();
  };


  /* arg =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  z
  
  General description
  -------------------
  Returns the angle of complex z.
   */


  /*
   Argument (angle) of complex z
  
    z    arg(z)
    -    ------
  
    a    0
  
    -a    -pi      See note 3 below
  
    (-1)^a    a pi
  
    exp(a + i b)  b
  
    a b    arg(a) + arg(b)
  
    a + i b    arctan(b/a)
  
  Result by quadrant
  
    z    arg(z)
    -    ------
  
    1 + i    1/4 pi
  
    1 - i    -1/4 pi
  
    -1 + i    3/4 pi
  
    -1 - i    -3/4 pi
  
  Notes
  
    1. Handles mixed polar and rectangular forms, e.g. 1 + exp(i pi/3)
  
    2. Symbols in z are assumed to be positive and real.
  
    3. Negative direction adds -pi to angle.
  
       Example: z = (-1)^(1/3), abs(z) = 1/3 pi, abs(-z) = -2/3 pi
  
    4. jean-francois.debroux reports that when z=(a+i*b)/(c+i*d) then
  
      arg(numerator(z)) - arg(denominator(z))
  
       must be used to get the correct answer. Now the operation is
       automatic.
   */

  DEBUG_ARG = false;

  Eval_arg = function() {
    push(cadr(p1));
    Eval();
    return arg();
  };

  arg = function() {
    save();
    p1 = pop();
    push(p1);
    numerator();
    yyarg();
    push(p1);
    denominator();
    yyarg();
    subtract();
    return restore();
  };

  yyarg = function() {
    save();
    p1 = pop();
    if (ispositivenumber(p1) || p1 === symbol(PI)) {
      if (isdouble(p1) || evaluatingAsFloats) {
        push_double(0);
      } else {
        push_integer(0);
      }
    } else if (isnegativenumber(p1)) {
      if (isdouble(p1) || evaluatingAsFloats) {
        push_double(Math.PI);
      } else {
        push(symbol(PI));
      }
      negate();
    } else if (issymbol(p1)) {
      push_symbol(ARG);
      push(p1);
      list(2);
    } else if (car(p1) === symbol(POWER) && equaln(cadr(p1), -1)) {
      if (evaluatingAsFloats) {
        push_double(Math.PI);
      } else {
        push(symbol(PI));
      }
      push(caddr(p1));
      multiply();
    } else if (car(p1) === symbol(POWER) && cadr(p1) === symbol(E)) {
      push(caddr(p1));
      imag();
    } else if (car(p1) === symbol(POWER) && isoneovertwo(caddr(p1))) {
      if (DEBUG_ARG) {
        console.log("arg of a sqrt: " + p1);
      }
      if (DEBUG_ARG) {
        debugger;
      }
      push(cadr(p1));
      arg();
      if (DEBUG_ARG) {
        console.log(" = 1/2 * " + stack[tos - 1]);
      }
      push(caddr(p1));
      multiply();
    } else if (car(p1) === symbol(MULTIPLY)) {
      push_integer(0);
      p1 = cdr(p1);
      while (iscons(p1)) {
        push(car(p1));
        arg();
        add();
        p1 = cdr(p1);
      }
    } else if (car(p1) === symbol(ADD)) {
      push(p1);
      rect();
      p1 = pop();
      push(p1);
      real();
      p2 = pop();
      push(p1);
      imag();
      p3 = pop();
      if (isZeroAtomOrTensor(p2)) {
        if (evaluatingAsFloats) {
          push_double(Math.PI);
        } else {
          push(symbol(PI));
        }
        if (isnegative(p3)) {
          negate();
        }
      } else {
        push(p3);
        push(p2);
        divide();
        arctan();
        if (isnegative(p2)) {
          if (evaluatingAsFloats) {
            push_double(Math.PI);
          } else {
            push_symbol(PI);
          }
          if (isnegative(p3)) {
            subtract();
          } else {
            add();
          }
        }
      }
    } else {
      if (!isZeroAtomOrTensor(get_binding(symbol(ASSUME_REAL_VARIABLES)))) {
        push_integer(0);
      } else {
        push_symbol(ARG);
        push(p1);
        list(2);
      }
    }
    return restore();
  };

  bake = function() {
    var h, s, t, x, y, z;
    h = 0;
    s = 0;
    t = 0;
    x = 0;
    y = 0;
    z = 0;
    expanding++;
    save();
    p1 = pop();
    s = ispolyexpandedform(p1, symbol(SYMBOL_S));
    t = ispolyexpandedform(p1, symbol(SYMBOL_T));
    x = ispolyexpandedform(p1, symbol(SYMBOL_X));
    y = ispolyexpandedform(p1, symbol(SYMBOL_Y));
    z = ispolyexpandedform(p1, symbol(SYMBOL_Z));
    if (s === 1 && t === 0 && x === 0 && y === 0 && z === 0) {
      p2 = symbol(SYMBOL_S);
      bake_poly();
    } else if (s === 0 && t === 1 && x === 0 && y === 0 && z === 0) {
      p2 = symbol(SYMBOL_T);
      bake_poly();
    } else if (s === 0 && t === 0 && x === 1 && y === 0 && z === 0) {
      p2 = symbol(SYMBOL_X);
      bake_poly();
    } else if (s === 0 && t === 0 && x === 0 && y === 1 && z === 0) {
      p2 = symbol(SYMBOL_Y);
      bake_poly();
    } else if (s === 0 && t === 0 && x === 0 && y === 0 && z === 1) {
      p2 = symbol(SYMBOL_Z);
      bake_poly();
    } else if ((iscons(p1)) && car(p1) !== symbol(FOR)) {
      h = tos;
      push(car(p1));
      p1 = cdr(p1);
      while (iscons(p1)) {
        push(car(p1));
        bake();
        p1 = cdr(p1);
      }
      list(tos - h);
    } else {
      push(p1);
    }
    restore();
    return expanding--;
  };

  polyform = function() {
    var h;
    h = 0;
    save();
    p2 = pop();
    p1 = pop();
    if (ispolyexpandedform(p1, p2)) {
      bake_poly();
    } else if (iscons(p1)) {
      h = tos;
      push(car(p1));
      p1 = cdr(p1);
      while (iscons(p1)) {
        push(car(p1));
        push(p2);
        polyform();
        p1 = cdr(p1);
      }
      list(tos - h);
    } else {
      push(p1);
    }
    return restore();
  };

  bake_poly = function() {
    var a, h, i, k, n, o, ref;
    h = 0;
    i = 0;
    k = 0;
    n = 0;
    a = tos;
    push(p1);
    push(p2);
    k = coeff();
    h = tos;
    for (i = o = ref = k - 1; o >= 0; i = o += -1) {
      p1 = stack[a + i];
      bake_poly_term(i);
    }
    n = tos - h;
    if (n > 1) {
      list(n);
      push(symbol(ADD));
      swap();
      cons();
    }
    p1 = pop();
    moveTos(tos - k);
    return push(p1);
  };

  bake_poly_term = function(k) {
    var h, n;
    h = 0;
    n = 0;
    if (isZeroAtomOrTensor(p1)) {
      return;
    }
    if (k === 0) {
      if (car(p1) === symbol(ADD)) {
        p1 = cdr(p1);
        while (iscons(p1)) {
          push(car(p1));
          p1 = cdr(p1);
        }
      } else {
        push(p1);
      }
      return;
    }
    h = tos;
    if (car(p1) === symbol(MULTIPLY)) {
      p1 = cdr(p1);
      while (iscons(p1)) {
        push(car(p1));
        p1 = cdr(p1);
      }
    } else if (!equaln(p1, 1)) {
      push(p1);
    }
    if (k === 1) {
      push(p2);
    } else {
      push(symbol(POWER));
      push(p2);
      push_integer(k);
      list(3);
    }
    n = tos - h;
    if (n > 1) {
      list(n);
      push(symbol(MULTIPLY));
      swap();
      return cons();
    }
  };


  /* besselj =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  x,n
  
  General description
  -------------------
  
  Returns a solution to the Bessel differential equation (Bessel function of first kind).
  
  Recurrence relation:
  
    besselj(x,n) = (2/x) (n-1) besselj(x,n-1) - besselj(x,n-2)
  
    besselj(x,1/2) = sqrt(2/pi/x) sin(x)
  
    besselj(x,-1/2) = sqrt(2/pi/x) cos(x)
  
  For negative n, reorder the recurrence relation as:
  
    besselj(x,n-2) = (2/x) (n-1) besselj(x,n-1) - besselj(x,n)
  
  Substitute n+2 for n to obtain
  
    besselj(x,n) = (2/x) (n+1) besselj(x,n+1) - besselj(x,n+2)
  
  Examples:
  
    besselj(x,3/2) = (1/x) besselj(x,1/2) - besselj(x,-1/2)
  
    besselj(x,-3/2) = -(1/x) besselj(x,-1/2) - besselj(x,1/2)
   */

  Eval_besselj = function() {
    push(cadr(p1));
    Eval();
    push(caddr(p1));
    Eval();
    return besselj();
  };

  besselj = function() {
    save();
    yybesselj();
    return restore();
  };

  yybesselj = function() {
    var d, n;
    d = 0.0;
    n = 0;
    p2 = pop();
    p1 = pop();
    push(p2);
    n = pop_integer();
    if (isdouble(p1) && !isNaN(n)) {
      d = jn(n, p1.d);
      push_double(d);
      return;
    }
    if (isZeroAtomOrTensor(p1) && isZeroAtomOrTensor(p2)) {
      push_integer(1);
      return;
    }
    if (isZeroAtomOrTensor(p1) && !isNaN(n)) {
      push_integer(0);
      return;
    }
    if (p2.k === NUM && MEQUAL(p2.q.b, 2)) {
      if (MEQUAL(p2.q.a, 1)) {
        if (evaluatingAsFloats) {
          push_double(2.0 / Math.PI);
        } else {
          push_integer(2);
          push_symbol(PI);
          divide();
        }
        push(p1);
        divide();
        push_rational(1, 2);
        power();
        push(p1);
        sine();
        multiply();
        return;
      }
      if (MEQUAL(p2.q.a, -1)) {
        if (evaluatingAsFloats) {
          push_double(2.0 / Math.PI);
        } else {
          push_integer(2);
          push_symbol(PI);
          divide();
        }
        push(p1);
        divide();
        push_rational(1, 2);
        power();
        push(p1);
        cosine();
        multiply();
        return;
      }
      push_integer(MSIGN(p2.q.a));
      p3 = pop();
      push_integer(2);
      push(p1);
      divide();
      push(p2);
      push(p3);
      subtract();
      multiply();
      push(p1);
      push(p2);
      push(p3);
      subtract();
      besselj();
      multiply();
      push(p1);
      push(p2);
      push_integer(2);
      push(p3);
      multiply();
      subtract();
      besselj();
      subtract();
      return;
    }
    if (isnegativeterm(p1)) {
      push(p1);
      negate();
      push(p2);
      power();
      push(p1);
      push(p2);
      negate();
      power();
      multiply();
      push_symbol(BESSELJ);
      push(p1);
      negate();
      push(p2);
      list(3);
      multiply();
      return;
    }
    if (isnegativeterm(p2)) {
      push_integer(-1);
      push(p2);
      power();
      push_symbol(BESSELJ);
      push(p1);
      push(p2);
      negate();
      list(3);
      multiply();
      return;
    }
    push(symbol(BESSELJ));
    push(p1);
    push(p2);
    return list(3);
  };


  /* bessely =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  x,n
  
  General description
  -------------------
  
  Bessel function of second kind.
   */

  Eval_bessely = function() {
    push(cadr(p1));
    Eval();
    push(caddr(p1));
    Eval();
    return bessely();
  };

  bessely = function() {
    save();
    yybessely();
    return restore();
  };

  yybessely = function() {
    var d, n;
    d = 0.0;
    n = 0;
    p2 = pop();
    p1 = pop();
    push(p2);
    n = pop_integer();
    if (isdouble(p1) && !isNaN(n)) {
      d = yn(n, p1.d);
      push_double(d);
      return;
    }
    if (isnegativeterm(p2)) {
      push_integer(-1);
      push(p2);
      power();
      push_symbol(BESSELY);
      push(p1);
      push(p2);
      negate();
      list(3);
      multiply();
      return;
    }
    push_symbol(BESSELY);
    push(p1);
    push(p2);
    list(3);
  };

  mint = function(a) {
    return bigInt(a);
  };

  isSmall = function(a) {
    return a.geq(Number.MIN_SAFE_INTEGER) && a.leq(Number.MAX_SAFE_INTEGER);
  };

  setSignTo = function(a, b) {
    if (a.isPositive()) {
      if (b < 0) {
        return a.multiply(bigInt(-1));
      }
    } else {
      if (b > 0) {
        return a.multiply(bigInt(-1));
      }
    }
    return a;
  };

  makeSignSameAs = function(a, b) {
    if (a.isPositive()) {
      if (b.isNegative()) {
        return a.multiply(bigInt(-1));
      }
    } else {
      if (b.isPositive()) {
        return a.multiply(bigInt(-1));
      }
    }
    return a;
  };

  makePositive = function(a) {
    if (a.isNegative()) {
      return a.multiply(bigInt(-1));
    }
    return a;
  };


  /*
  mtotal = 0
  MP_MIN_SIZE = 2
  MP_MAX_FREE  = 1000
  
  mnew = (n) ->
    if (n < MP_MIN_SIZE)
      n = MP_MIN_SIZE
    if (n == MP_MIN_SIZE && mfreecount)
      p = free_stack[--mfreecount]
    else
      p = [] #(unsigned int *) malloc((n + 3) * sizeof (int))
      #if (p == 0)
       *  stop("malloc failure")
    p[0] = n
    mtotal += n
    return p[3]
   */


  /*
  free_stack = []
  
  mfree = (array, p) ->
    p -= 3
    mtotal -= array[p]
    if (array[p] == MP_MIN_SIZE && mfreecount < MP_MAX_FREE)
      free_stack[mfreecount++] = p
    else
      free(p)
   */


  /*
  mint = (n) ->
    p = mnew(1)
    if (n < 0)
       * !!! this is FU
       * MSIGN(p) = -1
      fu = true
    else
       * !!! this is FU
      #MSIGN(p) = 1
      fu = true
     * !!! this is FU
    #MLENGTH(p) = 1
    p[0] = Math.abs(n)
    return p
   */


  /*
  mcopy = (a) ->
    #unsigned int *b
  
    b = mnew(MLENGTH(a))
  
     * !!! fu
    #MSIGN(b) = MSIGN(a)
    #MLENGTH(b) = MLENGTH(a)
  
    for i in [0...MLENGTH(a)]
      b[i] = a[i]
  
    return b
   */


  /*
   * 
   * ge not invoked from anywhere - is you need ge
   * just use the bigNum's ge implementation
   * leaving it here just in case I decide to backport to C
   *
   * a >= b ?
   * and and b arrays of ints, len is an int
  ge = (a, b, len) ->
    i = 0
    for i in [0...len]
      if (a[i] == b[i])
        continue
      else
        break
    if (a[i] >= b[i])
      return 1
    else
      return 0
   */

  add_numbers = function() {
    var a, b, theResult;
    a = 1.0;
    b = 1.0;
    if (isrational(stack[tos - 1]) && isrational(stack[tos - 2])) {
      qadd();
      return;
    }
    save();
    p2 = pop();
    p1 = pop();
    if (isdouble(p1)) {
      a = p1.d;
    } else {
      a = convert_rational_to_double(p1);
    }
    if (isdouble(p2)) {
      b = p2.d;
    } else {
      b = convert_rational_to_double(p2);
    }
    theResult = a + b;
    push_double(theResult);
    return restore();
  };

  subtract_numbers = function() {
    var a, b;
    a = 0.0;
    b = 0.0;
    if (isrational(stack[tos - 1]) && isrational(stack[tos - 2])) {
      qsub();
      return;
    }
    save();
    p2 = pop();
    p1 = pop();
    if (isdouble(p1)) {
      a = p1.d;
    } else {
      a = convert_rational_to_double(p1);
    }
    if (isdouble(p2)) {
      b = p2.d;
    } else {
      b = convert_rational_to_double(p2);
    }
    push_double(a - b);
    return restore();
  };

  multiply_numbers = function() {
    var a, b;
    a = 0.0;
    b = 0.0;
    if (isrational(stack[tos - 1]) && isrational(stack[tos - 2])) {
      qmul();
      return;
    }
    save();
    p2 = pop();
    p1 = pop();
    if (isdouble(p1)) {
      a = p1.d;
    } else {
      a = convert_rational_to_double(p1);
    }
    if (isdouble(p2)) {
      b = p2.d;
    } else {
      b = convert_rational_to_double(p2);
    }
    push_double(a * b);
    return restore();
  };

  divide_numbers = function() {
    var a, b;
    a = 0.0;
    b = 0.0;
    if (isrational(stack[tos - 1]) && isrational(stack[tos - 2])) {
      qdiv();
      return;
    }
    save();
    p2 = pop();
    p1 = pop();
    if (isZeroAtomOrTensor(p2)) {
      stop("divide by zero");
    }
    if (isdouble(p1)) {
      a = p1.d;
    } else {
      a = convert_rational_to_double(p1);
    }
    if (isdouble(p2)) {
      b = p2.d;
    } else {
      b = convert_rational_to_double(p2);
    }
    push_double(a / b);
    return restore();
  };

  invert_number = function() {
    var a, b;
    save();
    p1 = pop();
    if (isZeroAtomOrTensor(p1)) {
      stop("divide by zero");
    }
    if (isdouble(p1)) {
      push_double(1 / p1.d);
      restore();
      return;
    }
    a = bigInt(p1.q.a);
    b = bigInt(p1.q.b);
    b = makeSignSameAs(b, a);
    a = setSignTo(a, 1);
    p1 = new U();
    p1.k = NUM;
    p1.q.a = b;
    p1.q.b = a;
    push(p1);
    return restore();
  };

  compare_rationals = function(a, b) {
    var ab, ba, t;
    t = 0;
    ab = mmul(a.q.a, b.q.b);
    ba = mmul(a.q.b, b.q.a);
    t = mcmp(ab, ba);
    return t;
  };

  compare_numbers = function(a, b) {
    var x, y;
    x = 0.0;
    y = 0.0;
    if (isrational(a) && isrational(b)) {
      return compare_rationals(a, b);
    }
    if (isdouble(a)) {
      x = a.d;
    } else {
      x = convert_rational_to_double(a);
    }
    if (isdouble(b)) {
      y = b.d;
    } else {
      y = convert_rational_to_double(b);
    }
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  };

  negate_number = function() {
    save();
    p1 = pop();
    if (isZeroAtomOrTensor(p1)) {
      push(p1);
      restore();
      return;
    }
    switch (p1.k) {
      case NUM:
        p2 = new U();
        p2.k = NUM;
        p2.q.a = bigInt(p1.q.a.multiply(bigInt.minusOne));
        p2.q.b = bigInt(p1.q.b);
        push(p2);
        break;
      case DOUBLE:
        push_double(-p1.d);
        break;
      default:
        stop("bug caught in mp_negate_number");
    }
    return restore();
  };

  bignum_truncate = function() {
    var a;
    save();
    p1 = pop();
    a = mdiv(p1.q.a, p1.q.b);
    p1 = new U();
    p1.k = NUM;
    p1.q.a = a;
    p1.q.b = bigInt(1);
    push(p1);
    return restore();
  };

  mp_numerator = function() {
    save();
    p1 = pop();
    if (p1.k !== NUM) {
      push(one);
      restore();
      return;
    }
    p2 = new U();
    p2.k = NUM;
    p2.q.a = bigInt(p1.q.a);
    p2.q.b = bigInt(1);
    push(p2);
    return restore();
  };

  mp_denominator = function() {
    save();
    p1 = pop();
    if (p1.k !== NUM) {
      push(one);
      restore();
      return;
    }
    p2 = new U();
    p2.k = NUM;
    p2.q.a = bigInt(p1.q.b);
    p2.q.b = bigInt(1);
    push(p2);
    return restore();
  };

  bignum_power_number = function(expo) {
    var a, b, t;
    save();
    p1 = pop();
    a = mpow(p1.q.a, Math.abs(expo));
    b = mpow(p1.q.b, Math.abs(expo));
    if (expo < 0) {
      t = a;
      a = b;
      b = t;
      a = makeSignSameAs(a, b);
      b = setSignTo(b, 1);
    }
    p1 = new U();
    p1.k = NUM;
    p1.q.a = a;
    p1.q.b = b;
    push(p1);
    return restore();
  };

  convert_bignum_to_double = function(p) {
    return p.toJSNumber();
  };

  convert_rational_to_double = function(p) {
    var quotientAndRemainder, result;
    if (p.q == null) {
      debugger;
    }
    quotientAndRemainder = p.q.a.divmod(p.q.b);
    result = quotientAndRemainder.quotient + quotientAndRemainder.remainder / p.q.b.toJSNumber();
    return result;
  };

  push_integer = function(n) {
    if (DEBUG) {
      console.log("pushing integer " + n);
    }
    save();
    p1 = new U();
    p1.k = NUM;
    p1.q.a = bigInt(n);
    p1.q.b = bigInt(1);
    push(p1);
    return restore();
  };

  push_double = function(d) {
    save();
    p1 = new U();
    p1.k = DOUBLE;
    p1.d = d;
    push(p1);
    return restore();
  };

  push_rational = function(a, b) {

    /*
    save()
    p1 = new U()
    p1.k = NUM
    p1.q.a = bigInt(a)
    p1.q.b = bigInt(b)
    ## FIXME -- normalize ##
    push(p1)
    restore()
     */
    var p;
    p = new U();
    p.k = NUM;
    p.q.a = bigInt(a);
    p.q.b = bigInt(b);
    return push(p);
  };

  pop_integer = function() {
    var n;
    n = 0/0;
    save();
    p1 = pop();
    switch (p1.k) {
      case NUM:
        if (isinteger(p1) && isSmall(p1.q.a)) {
          n = p1.q.a.toJSNumber();
        }
        break;
      case DOUBLE:
        if (DEBUG) {
          console.log("popping integer but double is found");
        }
        if (Math.floor(p1.d) === p1.d) {
          if (DEBUG) {
            console.log("...altough it's an integer");
          }
          n = p1.d;
        }
    }
    restore();
    return n;
  };

  print_double = function(p, flag) {
    var accumulator, buf;
    accumulator = "";
    buf = doubleToReasonableString(p.d);
    if (flag === 1 && buf === '-') {
      accumulator += print_str(buf + 1);
    } else {
      accumulator += print_str(buf);
    }
    return accumulator;
  };

  bignum_scan_integer = function(s) {
    var a, scounter, sign_;
    save();
    scounter = 0;
    sign_ = s[scounter];
    if (sign_ === '+' || sign_ === '-') {
      scounter++;
    }
    a = bigInt(s.substring(scounter));
    p1 = new U();
    p1.k = NUM;
    p1.q.a = a;
    p1.q.b = bigInt(1);
    push(p1);
    if (sign_ === '-') {
      negate();
    }
    return restore();
  };

  bignum_scan_float = function(s) {
    return push_double(parseFloat(s));
  };

  print_number = function(p, signed) {
    var aAsString, accumulator, buf, denominatorString;
    accumulator = "";
    denominatorString = "";
    buf = "";
    switch (p.k) {
      case NUM:
        aAsString = p.q.a.toString();
        if (!signed) {
          if (aAsString[0] === "-") {
            aAsString = aAsString.substring(1);
          }
        }
        if (printMode === PRINTMODE_LATEX && isfraction(p)) {
          aAsString = "\\frac{" + aAsString + "}{";
        }
        accumulator += aAsString;
        if (isfraction(p)) {
          if (printMode !== PRINTMODE_LATEX) {
            accumulator += "/";
          }
          denominatorString = p.q.b.toString();
          if (printMode === PRINTMODE_LATEX) {
            denominatorString += "}";
          }
          accumulator += denominatorString;
        }
        break;
      case DOUBLE:
        aAsString = doubleToReasonableString(p.d);
        if (!signed) {
          if (aAsString[0] === "-") {
            aAsString = aAsString.substring(1);
          }
        }
        accumulator += aAsString;
    }
    return accumulator;
  };

  gcd_numbers = function() {
    save();
    p2 = pop();
    p1 = pop();
    p3 = new U();
    p3.k = NUM;
    p3.q.a = mgcd(p1.q.a, p2.q.a);
    p3.q.b = mgcd(p1.q.b, p2.q.b);
    p3.q.a = setSignTo(p3.q.a, 1);
    push(p3);
    return restore();
  };

  pop_double = function() {
    var d;
    d = 0.0;
    save();
    p1 = pop();
    switch (p1.k) {
      case NUM:
        d = convert_rational_to_double(p1);
        break;
      case DOUBLE:
        d = p1.d;
        break;
      default:
        d = 0.0;
    }
    restore();
    return d;
  };

  bignum_float = function() {
    var d;
    d = 0.0;
    d = convert_rational_to_double(pop());
    return push_double(d);
  };

  bignum_factorial = function(n) {
    save();
    p1 = new U();
    p1.k = NUM;
    p1.q.a = __factorial(n);
    p1.q.b = bigInt(1);
    push(p1);
    return restore();
  };

  __factorial = function(n) {
    var a, b, i, o, ref, t;
    i = 0;
    if (n === 0 || n === 1) {
      a = bigInt(1);
      return a;
    }
    a = bigInt(2);
    b = bigInt(0);
    if (3 <= n) {
      for (i = o = 3, ref = n; 3 <= ref ? o <= ref : o >= ref; i = 3 <= ref ? ++o : --o) {
        b = bigInt(i);
        t = mmul(a, b);
        a = t;
      }
    }
    return a;
  };

  mask = [0x00000001, 0x00000002, 0x00000004, 0x00000008, 0x00000010, 0x00000020, 0x00000040, 0x00000080, 0x00000100, 0x00000200, 0x00000400, 0x00000800, 0x00001000, 0x00002000, 0x00004000, 0x00008000, 0x00010000, 0x00020000, 0x00040000, 0x00080000, 0x00100000, 0x00200000, 0x00400000, 0x00800000, 0x01000000, 0x02000000, 0x04000000, 0x08000000, 0x10000000, 0x20000000, 0x40000000, 0x80000000];

  mp_set_bit = function(x, k) {
    console.log("not implemented yet");
    debugger;
    return x[k / 32] |= mask[k % 32];
  };

  mp_clr_bit = function(x, k) {
    console.log("not implemented yet");
    debugger;
    return x[k / 32] &= ~mask[k % 32];
  };

  mshiftright = function(a) {
    return a = a.shiftRight();
  };

  Eval_binomial = function() {
    push(cadr(p1));
    Eval();
    push(caddr(p1));
    Eval();
    return binomial();
  };

  binomial = function() {
    save();
    ybinomial();
    return restore();
  };

  ybinomial = function() {
    p2 = pop();
    p1 = pop();
    if (BINOM_check_args() === 0) {
      push(zero);
      return;
    }
    push(p1);
    factorial();
    push(p2);
    factorial();
    divide();
    push(p1);
    push(p2);
    subtract();
    factorial();
    return divide();
  };

  BINOM_check_args = function() {
    if (isNumericAtom(p1) && lessp(p1, zero)) {
      return 0;
    } else if (isNumericAtom(p2) && lessp(p2, zero)) {
      return 0;
    } else if (isNumericAtom(p1) && isNumericAtom(p2) && lessp(p1, p2)) {
      return 0;
    } else {
      return 1;
    }
  };


  /* ceiling =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  x
  
  General description
  -------------------
  
  Returns the smallest integer not less than x.
   */

  Eval_ceiling = function() {
    push(cadr(p1));
    Eval();
    return ceiling();
  };

  ceiling = function() {
    save();
    yyceiling();
    return restore();
  };

  yyceiling = function() {
    var d, doNothing;
    d = 0.0;
    p1 = pop();
    if (!isNumericAtom(p1)) {
      push_symbol(CEILING);
      push(p1);
      list(2);
      return;
    }
    if (isdouble(p1)) {
      d = Math.ceil(p1.d);
      push_double(d);
      return;
    }
    if (isinteger(p1)) {
      push(p1);
      return;
    }
    p3 = new U();
    p3.k = NUM;
    p3.q.a = mdiv(p1.q.a, p1.q.b);
    p3.q.b = mint(1);
    push(p3);
    if (isnegativenumber(p1)) {
      return doNothing = 1;
    } else {
      push_integer(1);
      return add();
    }
  };


  /* choose =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  n,k
  
  General description
  -------------------
  
  Returns the number of combinations of n items taken k at a time.
  
  For example, the number of five card hands is choose(52,5)
  
  ```
                            n!
        choose(n,k) = -------------
                       k! (n - k)!
  ```
   */

  Eval_choose = function() {
    push(cadr(p1));
    Eval();
    push(caddr(p1));
    Eval();
    return choose();
  };

  choose = function() {
    save();
    p2 = pop();
    p1 = pop();
    if (choose_check_args() === 0) {
      push_integer(0);
      restore();
      return;
    }
    push(p1);
    factorial();
    push(p2);
    factorial();
    divide();
    push(p1);
    push(p2);
    subtract();
    factorial();
    divide();
    return restore();
  };

  choose_check_args = function() {
    if (isNumericAtom(p1) && lessp(p1, zero)) {
      return 0;
    } else if (isNumericAtom(p2) && lessp(p2, zero)) {
      return 0;
    } else if (isNumericAtom(p1) && isNumericAtom(p2) && lessp(p1, p2)) {
      return 0;
    } else {
      return 1;
    }
  };


  /* circexp =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  x
  
  General description
  -------------------
  
  Returns expression x with circular and hyperbolic functions converted to exponential forms. Sometimes this will simplify an expression.
   */

  Eval_circexp = function() {
    push(cadr(p1));
    Eval();
    circexp();
    return Eval();
  };

  circexp = function() {
    var h, i, o, ref;
    i = 0;
    h = 0;
    save();
    p1 = pop();
    if (car(p1) === symbol(COS)) {
      push(cadr(p1));
      expcos();
      restore();
      return;
    }
    if (car(p1) === symbol(SIN)) {
      push(cadr(p1));
      expsin();
      restore();
      return;
    }
    if (car(p1) === symbol(TAN)) {
      p1 = cadr(p1);
      push(imaginaryunit);
      push(p1);
      multiply();
      exponential();
      p2 = pop();
      push(imaginaryunit);
      push(p1);
      multiply();
      negate();
      exponential();
      p3 = pop();
      push(p3);
      push(p2);
      subtract();
      push(imaginaryunit);
      multiply();
      push(p2);
      push(p3);
      add();
      divide();
      restore();
      return;
    }
    if (car(p1) === symbol(COSH)) {
      p1 = cadr(p1);
      push(p1);
      exponential();
      push(p1);
      negate();
      exponential();
      add();
      push_rational(1, 2);
      multiply();
      restore();
      return;
    }
    if (car(p1) === symbol(SINH)) {
      p1 = cadr(p1);
      push(p1);
      exponential();
      push(p1);
      negate();
      exponential();
      subtract();
      push_rational(1, 2);
      multiply();
      restore();
      return;
    }
    if (car(p1) === symbol(TANH)) {
      p1 = cadr(p1);
      push(p1);
      push_integer(2);
      multiply();
      exponential();
      p1 = pop();
      push(p1);
      push_integer(1);
      subtract();
      push(p1);
      push_integer(1);
      add();
      divide();
      restore();
      return;
    }
    if (iscons(p1)) {
      h = tos;
      while (iscons(p1)) {
        push(car(p1));
        circexp();
        p1 = cdr(p1);
      }
      list(tos - h);
      restore();
      return;
    }
    if (p1.k === TENSOR) {
      push(p1);
      copy_tensor();
      p1 = pop();
      for (i = o = 0, ref = p1.tensor.nelem; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
        push(p1.tensor.elem[i]);
        circexp();
        p1.tensor.elem[i] = pop();
      }
      push(p1);
      restore();
      return;
    }
    push(p1);
    return restore();
  };


  /* clearall =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  
  General description
  -------------------
  
  Completely wipes all variables from the environment.
   */

  Eval_clearall = function() {
    do_clearall();
    return push(symbol(NIL));
  };

  do_clearall = function() {
    if (test_flag === 0) {
      clear_term();
    }
    do_clearPatterns();
    clear_symbols();
    defn();
    return codeGen = false;
  };

  clearall = function() {
    return run("clearall");
  };

  clearRenamedVariablesToAvoidBindingToExternalScope = function() {
    var i, o, ref, results;
    results = [];
    for (i = o = 0, ref = symtab.length; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      if (symtab[i].printname.indexOf("AVOID_BINDING_TO_EXTERNAL_SCOPE_VALUE") !== -1) {
        symtab[i].k = SYM;
        symtab[i].printname = "";
        binding[i] = symtab[i];
        results.push(isSymbolReclaimable[i] = true);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /* clear =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  x
  
  General description
  -------------------
  
  Completely wipes a variable from the environment (while doing x = quote(x) just unassigns it).
   */

  Eval_clear = function() {
    var indexFound, variableToBeCleared;
    p2 = cdr(p1);
    while (iscons(p2)) {
      variableToBeCleared = car(p2);
      if (variableToBeCleared.k !== SYM) {
        stop("symbol error");
      }
      indexFound = symtab.indexOf(variableToBeCleared);
      symtab[indexFound].k = SYM;
      symtab[indexFound].printname = "";
      binding[indexFound] = symtab[indexFound];
      isSymbolReclaimable[indexFound] = true;
      p2 = cdr(p2);
    }
    return push(symbol(NIL));
  };


  /*
   Convert complex z to clock form
  
    Input:    push  z
  
    Output:    Result on stack
  
    clock(z) = abs(z) * (-1) ^ (arg(z) / pi)
  
    For example, clock(exp(i pi/3)) gives the result (-1)^(1/3)
   */

  DEBUG_CLOCKFORM = false;

  Eval_clock = function() {
    push(cadr(p1));
    Eval();
    return clockform();
  };

  clockform = function() {
    save();
    p1 = pop();
    push(p1);
    abs();
    if (DEBUG_CLOCKFORM) {
      console.log("clockform: abs of " + p1 + " : " + stack[tos - 1]);
    }
    push_symbol(POWER);
    push_integer(-1);
    push(p1);
    arg();
    if (DEBUG_CLOCKFORM) {
      console.log("clockform: arg of " + p1 + " : " + stack[tos - 1]);
    }
    if (evaluatingAsFloats) {
      push_double(Math.PI);
    } else {
      push(symbol(PI));
    }
    divide();
    if (DEBUG_CLOCKFORM) {
      console.log("clockform: divide : " + stack[tos - 1]);
    }
    list(3);
    if (DEBUG_CLOCKFORM) {
      console.log("clockform: power : " + stack[tos - 1]);
    }
    multiply();
    if (DEBUG_CLOCKFORM) {
      console.log("clockform: multiply : " + stack[tos - 1]);
    }

    /*
    p1 = pop()
    push(p1)
    abs()
    push(symbol(E))
    push(p1)
    arg()
    push(imaginaryunit)
    multiply()
    power()
    multiply()
     */
    return restore();
  };


  /* coeff =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  p,x,n
  
  General description
  -------------------
  Returns the coefficient of x^n in polynomial p. The x argument can be omitted for polynomials in x.
   */

  Eval_coeff = function() {
    push(cadr(p1));
    Eval();
    push(caddr(p1));
    Eval();
    push(cadddr(p1));
    Eval();
    p3 = pop();
    p2 = pop();
    p1 = pop();
    if (p3 === symbol(NIL)) {
      p3 = p2;
      p2 = symbol(SYMBOL_X);
    }
    push(p1);
    push(p2);
    push(p3);
    power();
    divide();
    push(p2);
    return filter();
  };

  coeff = function() {
    var h, n, prev_expanding;
    save();
    p2 = pop();
    p1 = pop();
    h = tos;
    while (1) {
      push(p1);
      push(p2);
      push(zero);
      subst();
      Eval();
      p3 = pop();
      push(p3);
      push(p1);
      push(p3);
      subtract();
      p1 = pop();
      if (equal(p1, zero)) {
        n = tos - h;
        restore();
        return n;
      }
      push(p1);
      push(p2);
      prev_expanding = expanding;
      expanding = 1;
      divide();
      expanding = prev_expanding;
      p1 = pop();
    }
  };


  /* cofactor =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  m,i,j
  
  General description
  -------------------
  Cofactor of a matrix component.
  Let c be the cofactor matrix of matrix m, i.e. tranpose(c) = adj(m).
  This function returns c[i,j].
   */

  Eval_cofactor = function() {
    var doNothing, i, j, n;
    i = 0;
    j = 0;
    n = 0;
    push(cadr(p1));
    Eval();
    p2 = pop();
    if (istensor(p2) && p2.tensor.ndim === 2 && p2.tensor.dim[0] === p2.tensor.dim[1]) {
      doNothing = 1;
    } else {
      stop("cofactor: 1st arg: square matrix expected");
    }
    n = p2.tensor.dim[0];
    push(caddr(p1));
    Eval();
    i = pop_integer();
    if (i < 1 || i > n) {
      stop("cofactor: 2nd arg: row index expected");
    }
    push(cadddr(p1));
    Eval();
    j = pop_integer();
    if (j < 1 || j > n) {
      stop("cofactor: 3rd arg: column index expected");
    }
    return cofactor(p2, n, i - 1, j - 1);
  };

  cofactor = function(p, n, row, col) {
    var i, i1, j, o, ref, ref1;
    i = 0;
    j = 0;
    for (i = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      for (j = i1 = 0, ref1 = n; 0 <= ref1 ? i1 < ref1 : i1 > ref1; j = 0 <= ref1 ? ++i1 : --i1) {
        if (i !== row && j !== col) {
          push(p.tensor.elem[n * i + j]);
        }
      }
    }
    determinant(n - 1);
    if ((row + col) % 2) {
      return negate();
    }
  };

  Eval_condense = function() {
    push(cadr(p1));
    Eval();
    return Condense();
  };

  Condense = function() {
    var prev_expanding;
    prev_expanding = expanding;
    expanding = 0;
    save();
    yycondense();
    restore();
    return expanding = prev_expanding;
  };

  yycondense = function() {
    p1 = pop();
    if (car(p1) !== symbol(ADD)) {
      push(p1);
      return;
    }
    p3 = cdr(p1);
    push(car(p3));
    p3 = cdr(p3);
    while (iscons(p3)) {
      push(car(p3));
      gcd();
      p3 = cdr(p3);
    }
    inverse();
    p2 = pop();
    push(zero);
    p3 = cdr(p1);
    while (iscons(p3)) {
      push(p2);
      push(car(p3));
      multiply_noexpand();
      add();
      p3 = cdr(p3);
    }
    yyexpand();
    push(p2);
    return divide();
  };


  /* conj =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  z
  
  General description
  -------------------
  Returns the complex conjugate of z.
   */

  Eval_conj = function() {
    push(cadr(p1));
    Eval();
    p1 = pop();
    push(p1);
    if (!Find(p1, imaginaryunit)) {
      polar();
      conjugate();
      return clockform();
    } else {
      return conjugate();
    }
  };

  conjugate = function() {
    push(imaginaryunit);
    push(imaginaryunit);
    negate();
    subst();
    return Eval();
  };

  consCount = 0;

  cons = function() {
    var p;
    consCount++;
    if (DEBUG) {
      console.log("cons tos: " + tos + " # " + consCount);
    }
    p = new U();
    p.k = CONS;
    p.cons.cdr = pop();
    if (p === p.cons.cdr) {
      debugger;
      console.log("something wrong p == its cdr");
    }
    p.cons.car = pop();

    /*
    console.log "cons new cdr.k = " + p.cons.cdr.k + "\nor more in detail:"
    console.log print_list p.cons.cdr
    console.log "cons new car.k = " + p.cons.car.k + "\nor more in detail:"
    console.log print_list p.cons.car
     */
    return push(p);
  };


  /* contract =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  a,i,j
  
  General description
  -------------------
  Contract across tensor indices i.e. returns "a" summed over indices i and j.
  If i and j are omitted then 1 and 2 are used.
  contract(m) is equivalent to the trace of matrix m.
   */

  Eval_contract = function() {
    push(cadr(p1));
    Eval();
    if (cddr(p1) === symbol(NIL)) {
      push_integer(1);
      push_integer(2);
    } else {
      push(caddr(p1));
      Eval();
      push(cadddr(p1));
      Eval();
    }
    return contract();
  };

  contract = function() {
    save();
    yycontract();
    return restore();
  };

  yycontract = function() {
    var a, ai, an, b, h, i, i1, j, j1, k, l, l1, m, m1, n, n1, ndim, nelem, o, o1, ref, ref1, ref2, ref3, ref4, ref5, ref6;
    h = 0;
    i = 0;
    j = 0;
    k = 0;
    l = 0;
    m = 0;
    n = 0;
    ndim = 0;
    nelem = 0;
    ai = [];
    an = [];
    p3 = pop();
    p2 = pop();
    p1 = pop();
    if (!istensor(p1)) {
      if (!isZeroAtomOrTensor(p1)) {
        stop("contract: tensor expected, 1st arg is not a tensor");
      }
      push(zero);
      return;
    }
    push(p2);
    l = pop_integer();
    push(p3);
    m = pop_integer();
    ndim = p1.tensor.ndim;
    if (l < 1 || l > ndim || m < 1 || m > ndim || l === m || p1.tensor.dim[l - 1] !== p1.tensor.dim[m - 1]) {
      stop("contract: index out of range");
    }
    l--;
    m--;
    n = p1.tensor.dim[l];
    nelem = 1;
    for (i = o = 0, ref = ndim; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      if (i !== l && i !== m) {
        nelem *= p1.tensor.dim[i];
      }
    }
    p2 = alloc_tensor(nelem);
    p2.tensor.ndim = ndim - 2;
    j = 0;
    for (i = i1 = 0, ref1 = ndim; 0 <= ref1 ? i1 < ref1 : i1 > ref1; i = 0 <= ref1 ? ++i1 : --i1) {
      if (i !== l && i !== m) {
        p2.tensor.dim[j++] = p1.tensor.dim[i];
      }
    }
    a = p1.tensor.elem;
    b = p2.tensor.elem;
    for (i = j1 = 0, ref2 = ndim; 0 <= ref2 ? j1 < ref2 : j1 > ref2; i = 0 <= ref2 ? ++j1 : --j1) {
      ai[i] = 0;
      an[i] = p1.tensor.dim[i];
    }
    for (i = l1 = 0, ref3 = nelem; 0 <= ref3 ? l1 < ref3 : l1 > ref3; i = 0 <= ref3 ? ++l1 : --l1) {
      push(zero);
      for (j = m1 = 0, ref4 = n; 0 <= ref4 ? m1 < ref4 : m1 > ref4; j = 0 <= ref4 ? ++m1 : --m1) {
        ai[l] = j;
        ai[m] = j;
        h = 0;
        for (k = n1 = 0, ref5 = ndim; 0 <= ref5 ? n1 < ref5 : n1 > ref5; k = 0 <= ref5 ? ++n1 : --n1) {
          h = (h * an[k]) + ai[k];
        }
        push(a[h]);
        add();
      }
      b[i] = pop();
      for (j = o1 = ref6 = ndim - 1; ref6 <= 0 ? o1 <= 0 : o1 >= 0; j = ref6 <= 0 ? ++o1 : --o1) {
        if (j === l || j === m) {
          continue;
        }
        if (++ai[j] < an[j]) {
          break;
        }
        ai[j] = 0;
      }
    }
    if (nelem === 1) {
      return push(b[0]);
    } else {
      return push(p2);
    }
  };


  /* cos =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  x
  
  General description
  -------------------
  Returns the cosine of x.
   */

  Eval_cos = function() {
    push(cadr(p1));
    Eval();
    return cosine();
  };

  cosine = function() {
    save();
    p1 = pop();
    if (car(p1) === symbol(ADD)) {
      cosine_of_angle_sum();
    } else {
      cosine_of_angle();
    }
    return restore();
  };

  cosine_of_angle_sum = function() {
    p2 = cdr(p1);
    while (iscons(p2)) {
      p4 = car(p2);
      if (isnpi(p4)) {
        push(p1);
        push(p4);
        subtract();
        p3 = pop();
        push(p3);
        cosine();
        push(p4);
        cosine();
        multiply();
        push(p3);
        sine();
        push(p4);
        sine();
        multiply();
        subtract();
        return;
      }
      p2 = cdr(p2);
    }
    return cosine_of_angle();
  };

  cosine_of_angle = function() {
    var d, n;
    if (car(p1) === symbol(ARCCOS)) {
      push(cadr(p1));
      return;
    }
    if (isdouble(p1)) {
      d = Math.cos(p1.d);
      if (Math.abs(d) < 1e-10) {
        d = 0.0;
      }
      push_double(d);
      return;
    }
    if (isnegative(p1)) {
      push(p1);
      negate();
      p1 = pop();
    }
    if (car(p1) === symbol(ARCTAN)) {
      push_integer(1);
      push(cadr(p1));
      push_integer(2);
      power();
      add();
      push_rational(-1, 2);
      power();
      return;
    }
    push(p1);
    push_integer(180);
    multiply();
    if (evaluatingAsFloats) {
      push_double(Math.PI);
    } else {
      push_symbol(PI);
    }
    divide();
    n = pop_integer();
    if (n < 0 || isNaN(n)) {
      push(symbol(COS));
      push(p1);
      list(2);
      return;
    }
    switch (n % 360) {
      case 90:
      case 270:
        return push_integer(0);
      case 60:
      case 300:
        return push_rational(1, 2);
      case 120:
      case 240:
        return push_rational(-1, 2);
      case 45:
      case 315:
        push_rational(1, 2);
        push_integer(2);
        push_rational(1, 2);
        power();
        return multiply();
      case 135:
      case 225:
        push_rational(-1, 2);
        push_integer(2);
        push_rational(1, 2);
        power();
        return multiply();
      case 30:
      case 330:
        push_rational(1, 2);
        push_integer(3);
        push_rational(1, 2);
        power();
        return multiply();
      case 150:
      case 210:
        push_rational(-1, 2);
        push_integer(3);
        push_rational(1, 2);
        power();
        return multiply();
      case 0:
        return push_integer(1);
      case 180:
        return push_integer(-1);
      default:
        push(symbol(COS));
        push(p1);
        return list(2);
    }
  };


  /* cosh =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  x
  
  General description
  -------------------
  Returns the hyperbolic cosine of x
  
  ```
              exp(x) + exp(-x)
    cosh(x) = ----------------
                     2
  ```
   */

  Eval_cosh = function() {
    push(cadr(p1));
    Eval();
    return ycosh();
  };

  ycosh = function() {
    save();
    yycosh();
    return restore();
  };

  yycosh = function() {
    var d;
    d = 0.0;
    p1 = pop();
    if (car(p1) === symbol(ARCCOSH)) {
      push(cadr(p1));
      return;
    }
    if (isdouble(p1)) {
      d = Math.cosh(p1.d);
      if (Math.abs(d) < 1e-10) {
        d = 0.0;
      }
      push_double(d);
      return;
    }
    if (isZeroAtomOrTensor(p1)) {
      push(one);
      return;
    }
    push_symbol(COSH);
    push(p1);
    return list(2);
  };

  Eval_decomp = function() {
    var h;
    save();
    console.log("Eval_decomp is being called!!!!!!!!!!!!!!!!!!!!");
    h = tos;
    push(symbol(NIL));
    push(cadr(p1));
    Eval();
    push(caddr(p1));
    Eval();
    p1 = pop();
    if (p1 === symbol(NIL)) {
      guess();
    } else {
      push(p1);
    }
    decomp(false);
    list(tos - h);
    return restore();
  };

  pushTryNotToDuplicate = function(toBePushed) {
    if (tos > 0) {
      if (DEBUG) {
        console.log("comparing " + toBePushed + " to: " + stack[tos - 1]);
      }
      if (equal(toBePushed, stack[tos - 1])) {
        if (DEBUG) {
          console.log("skipping " + toBePushed + " because it's already on stack ");
        }
        return;
      }
    }
    return push(toBePushed);
  };

  decomp = function(generalTransform) {
    save();
    p2 = pop();
    p1 = pop();
    if (DEBUG) {
      console.log("DECOMPOSING " + p1);
    }
    if (generalTransform) {
      if (!iscons(p1)) {
        if (DEBUG) {
          console.log(" ground thing: " + p1);
        }
        pushTryNotToDuplicate(p1);
        restore();
        return;
      }
    } else {
      if (Find(p1, p2) === 0) {
        if (DEBUG) {
          console.log(" entire expression is constant");
        }
        pushTryNotToDuplicate(p1);
        restore();
        return;
      }
    }
    if (isadd(p1)) {
      decomp_sum(generalTransform);
      restore();
      return;
    }
    if (ismultiply(p1)) {
      decomp_product(generalTransform);
      restore();
      return;
    }
    if (DEBUG) {
      console.log(" naive decomp");
    }
    p3 = cdr(p1);
    if (DEBUG) {
      console.log("startig p3: " + p3);
    }
    while (iscons(p3)) {
      if (generalTransform) {
        push(car(p3));
      }
      if (DEBUG) {
        console.log("recursive decomposition");
      }
      push(car(p3));
      if (DEBUG) {
        console.log("car(p3): " + car(p3));
      }
      push(p2);
      if (DEBUG) {
        console.log("p2: " + p2);
      }
      decomp(generalTransform);
      p3 = cdr(p3);
    }
    return restore();
  };

  decomp_sum = function(generalTransform) {
    var h;
    if (DEBUG) {
      console.log(" decomposing the sum ");
    }
    h = 0;
    p3 = cdr(p1);
    while (iscons(p3)) {
      if (Find(car(p3), p2) || generalTransform) {
        push(car(p3));
        push(p2);
        decomp(generalTransform);
      }
      p3 = cdr(p3);
    }
    h = tos;
    p3 = cdr(p1);
    while (iscons(p3)) {
      if (Find(car(p3), p2) === 0) {
        pushTryNotToDuplicate(car(p3));
      }
      p3 = cdr(p3);
    }
    if (tos - h) {
      add_all(tos - h);
      p3 = pop();
      pushTryNotToDuplicate(p3);
      push(p3);
      return negate();
    }
  };

  decomp_product = function(generalTransform) {
    var h;
    if (DEBUG) {
      console.log(" decomposing the product ");
    }
    h = 0;
    p3 = cdr(p1);
    while (iscons(p3)) {
      if (Find(car(p3), p2) || generalTransform) {
        push(car(p3));
        push(p2);
        decomp(generalTransform);
      }
      p3 = cdr(p3);
    }
    h = tos;
    p3 = cdr(p1);
    while (iscons(p3)) {
      if (Find(car(p3), p2) === 0) {
        pushTryNotToDuplicate(car(p3));
      }
      p3 = cdr(p3);
    }
    if (tos - h) {
      return multiply_all(tos - h);
    }
  };

  define_user_function = function() {
    p3 = caadr(p1);
    p4 = cdadr(p1);
    p5 = caddr(p1);
    if (!issymbol(p3)) {
      stop("function name?");
    }
    if (car(p5) === symbol(EVAL)) {
      push(cadr(p5));
      Eval();
      p5 = pop();
    }
    push_symbol(FUNCTION);
    push(p5);
    push(p4);
    list(3);
    p5 = pop();
    set_binding(p3, p5);
    return push_symbol(NIL);
  };

  Eval_function_reference = function() {
    return push(p1);
  };


  /* defint =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  f,x,a,b[,y,c,d...]
  
  General description
  -------------------
  Returns the definite integral of f with respect to x evaluated from "a" to b.
  The argument list can be extended for multiple integrals (or "iterated
  integrals"), for example a double integral (which can represent for
  example a volume under a surface), or a triple integral, etc. For
  example, defint(f,x,a,b,y,c,d).
   */

  Eval_defint = function() {
    push(cadr(p1));
    Eval();
    p2 = pop();
    p1 = cddr(p1);
    while (iscons(p1)) {
      push(car(p1));
      p1 = cdr(p1);
      Eval();
      p3 = pop();
      push(car(p1));
      p1 = cdr(p1);
      Eval();
      p4 = pop();
      push(car(p1));
      p1 = cdr(p1);
      Eval();
      p5 = pop();
      push(p2);
      push(p3);
      integral();
      p2 = pop();
      push(p2);
      push(p3);
      push(p5);
      subst();
      Eval();
      push(p2);
      push(p3);
      push(p4);
      subst();
      Eval();
      subtract();
      p2 = pop();
    }
    return push(p2);
  };


  /* deg =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  p,x
  
  General description
  -------------------
  Returns the degree of polynomial p(x).
   */

  Eval_degree = function() {
    push(cadr(p1));
    Eval();
    push(caddr(p1));
    Eval();
    p1 = pop();
    if (p1 === symbol(NIL)) {
      guess();
    } else {
      push(p1);
    }
    return degree();
  };

  degree = function() {
    save();
    p2 = pop();
    p1 = pop();
    p3 = zero;
    yydegree(p1);
    push(p3);
    return restore();
  };

  yydegree = function(p) {
    var results;
    if (equal(p, p2)) {
      if (isZeroAtomOrTensor(p3)) {
        return p3 = one;
      }
    } else if (car(p) === symbol(POWER)) {
      if (equal(cadr(p), p2) && isNumericAtom(caddr(p)) && lessp(p3, caddr(p))) {
        return p3 = caddr(p);
      }
    } else if (iscons(p)) {
      p = cdr(p);
      results = [];
      while (iscons(p)) {
        yydegree(car(p));
        results.push(p = cdr(p));
      }
      return results;
    }
  };


  /* denominator =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  x
  
  General description
  -------------------
  Returns the denominator of expression x.
   */

  Eval_denominator = function() {
    push(cadr(p1));
    Eval();
    return denominator();
  };

  denominator = function() {
    var h, theArgument;
    h = 0;
    theArgument = pop();
    if (car(theArgument) === symbol(ADD)) {
      push(theArgument);
      rationalize();
      theArgument = pop();
    }
    if (car(theArgument) === symbol(MULTIPLY) && !isplusone(car(cdr(theArgument)))) {
      h = tos;
      theArgument = cdr(theArgument);
      while (iscons(theArgument)) {
        push(car(theArgument));
        denominator();
        theArgument = cdr(theArgument);
      }
      return multiply_all(tos - h);
    } else if (isrational(theArgument)) {
      push(theArgument);
      return mp_denominator();
    } else if (car(theArgument) === symbol(POWER) && isnegativeterm(caddr(theArgument))) {
      push(theArgument);
      return reciprocate();
    } else {
      return push(one);
    }
  };

  Eval_derivative = function() {
    var doNothing, i, i1, n, o, ref, ref1;
    i = 0;
    p1 = cdr(p1);
    push(car(p1));
    Eval();
    p1 = cdr(p1);
    push(car(p1));
    Eval();
    p2 = pop();
    if (p2 === symbol(NIL)) {
      guess();
      push(symbol(NIL));
    } else if (isNumericAtom(p2)) {
      guess();
      push(p2);
    } else {
      push(p2);
      p1 = cdr(p1);
      push(car(p1));
      Eval();
    }
    p5 = pop();
    p4 = pop();
    p3 = pop();
    while (1) {
      if (isNumericAtom(p5)) {
        push(p5);
        n = pop_integer();
        if (isNaN(n)) {
          stop("nth derivative: check n");
        }
      } else {
        n = 1;
      }
      push(p3);
      if (n >= 0) {
        for (i = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
          push(p4);
          derivative();
        }
      } else {
        n = -n;
        for (i = i1 = 0, ref1 = n; 0 <= ref1 ? i1 < ref1 : i1 > ref1; i = 0 <= ref1 ? ++i1 : --i1) {
          push(p4);
          integral();
        }
      }
      p3 = pop();
      if (p5 === symbol(NIL)) {
        break;
      }
      if (isNumericAtom(p5)) {
        p1 = cdr(p1);
        push(car(p1));
        Eval();
        p5 = pop();
        if (p5 === symbol(NIL)) {
          break;
        }
        if (isNumericAtom(p5)) {
          doNothing = 1;
        } else {
          p4 = p5;
          p1 = cdr(p1);
          push(car(p1));
          Eval();
          p5 = pop();
        }
      } else {
        p4 = p5;
        p1 = cdr(p1);
        push(car(p1));
        Eval();
        p5 = pop();
      }
    }
    return push(p3);
  };

  derivative = function() {
    save();
    p2 = pop();
    p1 = pop();
    if (isNumericAtom(p2)) {
      stop("undefined function");
    }
    if (istensor(p1)) {
      if (istensor(p2)) {
        d_tensor_tensor();
      } else {
        d_tensor_scalar();
      }
    } else {
      if (istensor(p2)) {
        d_scalar_tensor();
      } else {
        d_scalar_scalar();
      }
    }
    return restore();
  };

  d_scalar_scalar = function() {
    if (issymbol(p2)) {
      return d_scalar_scalar_1();
    } else {
      push(p1);
      push(p2);
      push(symbol(SECRETX));
      subst();
      push(symbol(SECRETX));
      derivative();
      push(symbol(SECRETX));
      push(p2);
      return subst();
    }
  };

  d_scalar_scalar_1 = function() {
    if (equal(p1, p2)) {
      push(one);
      return;
    }
    if (!iscons(p1)) {
      push(zero);
      return;
    }
    if (isadd(p1)) {
      dsum();
      return;
    }
    if (car(p1) === symbol(MULTIPLY)) {
      dproduct();
      return;
    }
    if (car(p1) === symbol(POWER)) {
      dpower();
      return;
    }
    if (car(p1) === symbol(DERIVATIVE)) {
      dd();
      return;
    }
    if (car(p1) === symbol(LOG)) {
      dlog();
      return;
    }
    if (car(p1) === symbol(SIN)) {
      dsin();
      return;
    }
    if (car(p1) === symbol(COS)) {
      dcos();
      return;
    }
    if (car(p1) === symbol(TAN)) {
      dtan();
      return;
    }
    if (car(p1) === symbol(ARCSIN)) {
      darcsin();
      return;
    }
    if (car(p1) === symbol(ARCCOS)) {
      darccos();
      return;
    }
    if (car(p1) === symbol(ARCTAN)) {
      darctan();
      return;
    }
    if (car(p1) === symbol(SINH)) {
      dsinh();
      return;
    }
    if (car(p1) === symbol(COSH)) {
      dcosh();
      return;
    }
    if (car(p1) === symbol(TANH)) {
      dtanh();
      return;
    }
    if (car(p1) === symbol(ARCSINH)) {
      darcsinh();
      return;
    }
    if (car(p1) === symbol(ARCCOSH)) {
      darccosh();
      return;
    }
    if (car(p1) === symbol(ARCTANH)) {
      darctanh();
      return;
    }
    if (car(p1) === symbol(ABS)) {
      dabs();
      return;
    }
    if (car(p1) === symbol(SGN)) {
      dsgn();
      return;
    }
    if (car(p1) === symbol(HERMITE)) {
      dhermite();
      return;
    }
    if (car(p1) === symbol(ERF)) {
      derf();
      return;
    }
    if (car(p1) === symbol(ERFC)) {
      derfc();
      return;
    }
    if (car(p1) === symbol(BESSELJ)) {
      if (isZeroAtomOrTensor(caddr(p1))) {
        dbesselj0();
      } else {
        dbesseljn();
      }
      return;
    }
    if (car(p1) === symbol(BESSELY)) {
      if (isZeroAtomOrTensor(caddr(p1))) {
        dbessely0();
      } else {
        dbesselyn();
      }
      return;
    }
    if (car(p1) === symbol(INTEGRAL) && caddr(p1) === p2) {
      derivative_of_integral();
      return;
    }
    return dfunction();
  };

  dsum = function() {
    var h;
    h = tos;
    p1 = cdr(p1);
    while (iscons(p1)) {
      push(car(p1));
      push(p2);
      derivative();
      p1 = cdr(p1);
    }
    return add_all(tos - h);
  };

  dproduct = function() {
    var i, i1, j, n, o, ref, ref1;
    i = 0;
    j = 0;
    n = 0;
    n = length(p1) - 1;
    for (i = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      p3 = cdr(p1);
      for (j = i1 = 0, ref1 = n; 0 <= ref1 ? i1 < ref1 : i1 > ref1; j = 0 <= ref1 ? ++i1 : --i1) {
        push(car(p3));
        if (i === j) {
          push(p2);
          derivative();
        }
        p3 = cdr(p3);
      }
      multiply_all(n);
    }
    return add_all(n);
  };

  dpower = function() {
    push(caddr(p1));
    push(cadr(p1));
    divide();
    push(cadr(p1));
    push(p2);
    derivative();
    multiply();
    push(cadr(p1));
    logarithm();
    push(caddr(p1));
    push(p2);
    derivative();
    multiply();
    add();
    push(p1);
    return multiply();
  };

  dlog = function() {
    push(cadr(p1));
    push(p2);
    derivative();
    push(cadr(p1));
    return divide();
  };

  dd = function() {
    push(cadr(p1));
    push(p2);
    derivative();
    p3 = pop();
    if (car(p3) === symbol(DERIVATIVE)) {
      push_symbol(DERIVATIVE);
      push_symbol(DERIVATIVE);
      push(cadr(p3));
      if (lessp(caddr(p3), caddr(p1))) {
        push(caddr(p3));
        list(3);
        push(caddr(p1));
      } else {
        push(caddr(p1));
        list(3);
        push(caddr(p3));
      }
      return list(3);
    } else {
      push(p3);
      push(caddr(p1));
      return derivative();
    }
  };

  dfunction = function() {
    p3 = cdr(p1);
    if (p3 === symbol(NIL) || Find(p3, p2)) {
      push_symbol(DERIVATIVE);
      push(p1);
      push(p2);
      return list(3);
    } else {
      return push(zero);
    }
  };

  dsin = function() {
    push(cadr(p1));
    push(p2);
    derivative();
    push(cadr(p1));
    cosine();
    return multiply();
  };

  dcos = function() {
    push(cadr(p1));
    push(p2);
    derivative();
    push(cadr(p1));
    sine();
    multiply();
    return negate();
  };

  dtan = function() {
    push(cadr(p1));
    push(p2);
    derivative();
    push(cadr(p1));
    cosine();
    push_integer(-2);
    power();
    return multiply();
  };

  darcsin = function() {
    push(cadr(p1));
    push(p2);
    derivative();
    push_integer(1);
    push(cadr(p1));
    push_integer(2);
    power();
    subtract();
    push_rational(-1, 2);
    power();
    return multiply();
  };

  darccos = function() {
    push(cadr(p1));
    push(p2);
    derivative();
    push_integer(1);
    push(cadr(p1));
    push_integer(2);
    power();
    subtract();
    push_rational(-1, 2);
    power();
    multiply();
    return negate();
  };

  darctan = function() {
    push(cadr(p1));
    push(p2);
    derivative();
    push_integer(1);
    push(cadr(p1));
    push_integer(2);
    power();
    add();
    inverse();
    multiply();
    return simplify();
  };

  dsinh = function() {
    push(cadr(p1));
    push(p2);
    derivative();
    push(cadr(p1));
    ycosh();
    return multiply();
  };

  dcosh = function() {
    push(cadr(p1));
    push(p2);
    derivative();
    push(cadr(p1));
    ysinh();
    return multiply();
  };

  dtanh = function() {
    push(cadr(p1));
    push(p2);
    derivative();
    push(cadr(p1));
    ycosh();
    push_integer(-2);
    power();
    return multiply();
  };

  darcsinh = function() {
    push(cadr(p1));
    push(p2);
    derivative();
    push(cadr(p1));
    push_integer(2);
    power();
    push_integer(1);
    add();
    push_rational(-1, 2);
    power();
    return multiply();
  };

  darccosh = function() {
    push(cadr(p1));
    push(p2);
    derivative();
    push(cadr(p1));
    push_integer(2);
    power();
    push_integer(-1);
    add();
    push_rational(-1, 2);
    power();
    return multiply();
  };

  darctanh = function() {
    push(cadr(p1));
    push(p2);
    derivative();
    push_integer(1);
    push(cadr(p1));
    push_integer(2);
    power();
    subtract();
    inverse();
    return multiply();
  };

  dabs = function() {
    push(cadr(p1));
    push(p2);
    derivative();
    push(cadr(p1));
    sgn();
    return multiply();
  };

  dsgn = function() {
    push(cadr(p1));
    push(p2);
    derivative();
    push(cadr(p1));
    dirac();
    multiply();
    push_integer(2);
    return multiply();
  };

  dhermite = function() {
    push(cadr(p1));
    push(p2);
    derivative();
    push_integer(2);
    push(caddr(p1));
    multiply();
    multiply();
    push(cadr(p1));
    push(caddr(p1));
    push_integer(-1);
    add();
    hermite();
    return multiply();
  };

  derf = function() {
    push(cadr(p1));
    push_integer(2);
    power();
    push_integer(-1);
    multiply();
    exponential();
    if (evaluatingAsFloats) {
      push_double(Math.PI);
    } else {
      push_symbol(PI);
    }
    push_rational(-1, 2);
    power();
    multiply();
    push_integer(2);
    multiply();
    push(cadr(p1));
    push(p2);
    derivative();
    return multiply();
  };

  derfc = function() {
    push(cadr(p1));
    push_integer(2);
    power();
    push_integer(-1);
    multiply();
    exponential();
    if (evaluatingAsFloats) {
      push_double(Math.PI);
    } else {
      push_symbol(PI);
    }
    push_rational(-1, 2);
    power();
    multiply();
    push_integer(-2);
    multiply();
    push(cadr(p1));
    push(p2);
    derivative();
    return multiply();
  };

  dbesselj0 = function() {
    push(cadr(p1));
    push(p2);
    derivative();
    push(cadr(p1));
    push_integer(1);
    besselj();
    multiply();
    push_integer(-1);
    return multiply();
  };

  dbesseljn = function() {
    push(cadr(p1));
    push(p2);
    derivative();
    push(cadr(p1));
    push(caddr(p1));
    push_integer(-1);
    add();
    besselj();
    push(caddr(p1));
    push_integer(-1);
    multiply();
    push(cadr(p1));
    divide();
    push(cadr(p1));
    push(caddr(p1));
    besselj();
    multiply();
    add();
    return multiply();
  };

  dbessely0 = function() {
    push(cadr(p1));
    push(p2);
    derivative();
    push(cadr(p1));
    push_integer(1);
    besselj();
    multiply();
    push_integer(-1);
    return multiply();
  };

  dbesselyn = function() {
    push(cadr(p1));
    push(p2);
    derivative();
    push(cadr(p1));
    push(caddr(p1));
    push_integer(-1);
    add();
    bessely();
    push(caddr(p1));
    push_integer(-1);
    multiply();
    push(cadr(p1));
    divide();
    push(cadr(p1));
    push(caddr(p1));
    bessely();
    multiply();
    add();
    return multiply();
  };

  derivative_of_integral = function() {
    return push(cadr(p1));
  };


  /* det =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  m
  
  General description
  -------------------
  Returns the determinant of matrix m.
  Uses Gaussian elimination for numerical matrices.
  
  Example:
  
    det(((1,2),(3,4)))
    > -2
   */

  DET_check_arg = function() {
    if (!istensor(p1)) {
      return 0;
    } else if (p1.tensor.ndim !== 2) {
      return 0;
    } else if (p1.tensor.dim[0] !== p1.tensor.dim[1]) {
      return 0;
    } else {
      return 1;
    }
  };

  det = function() {
    var a, i, i1, n, o, ref, ref1;
    i = 0;
    n = 0;
    save();
    p1 = pop();
    if (DET_check_arg() === 0) {
      push_symbol(DET);
      push(p1);
      list(2);
      restore();
      return;
    }
    n = p1.tensor.nelem;
    a = p1.tensor.elem;
    for (i = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      if (!isNumericAtom(a[i])) {
        break;
      }
    }
    if (i === n) {
      yydetg();
    } else {
      for (i = i1 = 0, ref1 = p1.tensor.nelem; 0 <= ref1 ? i1 < ref1 : i1 > ref1; i = 0 <= ref1 ? ++i1 : --i1) {
        push(p1.tensor.elem[i]);
      }
      determinant(p1.tensor.dim[0]);
    }
    return restore();
  };

  determinant = function(n) {
    var a, breakFromOutherWhile, h, i, i1, j, k, o, q, ref, ref1, s, sign_, t;
    h = 0;
    i = 0;
    j = 0;
    k = 0;
    q = 0;
    s = 0;
    sign_ = 0;
    t = 0;
    a = [];
    h = tos - n * n;
    for (i = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      a[i] = i;
      a[i + n] = 0;
      a[i + n + n] = 1;
    }
    sign_ = 1;
    push(zero);
    while (1) {
      if (sign_ === 1) {
        push_integer(1);
      } else {
        push_integer(-1);
      }
      for (i = i1 = 0, ref1 = n; 0 <= ref1 ? i1 < ref1 : i1 > ref1; i = 0 <= ref1 ? ++i1 : --i1) {
        k = n * a[i] + i;
        push(stack[h + k]);
        multiply();
      }
      add();
      j = n - 1;
      s = 0;
      breakFromOutherWhile = false;
      while (1) {
        q = a[n + j] + a[n + n + j];
        if (q < 0) {
          a[n + n + j] = -a[n + n + j];
          j--;
          continue;
        }
        if (q === j + 1) {
          if (j === 0) {
            breakFromOutherWhile = true;
            break;
          }
          s++;
          a[n + n + j] = -a[n + n + j];
          j--;
          continue;
        }
        break;
      }
      if (breakFromOutherWhile) {
        break;
      }
      t = a[j - a[n + j] + s];
      a[j - a[n + j] + s] = a[j - q + s];
      a[j - q + s] = t;
      a[n + j] = q;
      sign_ = -sign_;
    }
    stack[h] = stack[tos - 1];
    return moveTos(h + 1);
  };

  detg = function() {
    save();
    p1 = pop();
    if (DET_check_arg() === 0) {
      push_symbol(DET);
      push(p1);
      list(2);
      restore();
      return;
    }
    yydetg();
    return restore();
  };

  yydetg = function() {
    var i, n, o, ref;
    i = 0;
    n = 0;
    n = p1.tensor.dim[0];
    for (i = o = 0, ref = n * n; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      push(p1.tensor.elem[i]);
    }
    lu_decomp(n);
    moveTos(tos - n * n);
    return push(p1);
  };

  M = function(h, n, i, j) {
    return stack[h + n * i + j];
  };

  setM = function(h, n, i, j, value) {
    return stack[h + n * i + j] = value;
  };

  lu_decomp = function(n) {
    var d, h, i, i1, j, j1, l1, m1, o, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8;
    d = 0;
    h = 0;
    i = 0;
    j = 0;
    h = tos - n * n;
    p1 = one;
    for (d = o = 0, ref = n - 1; 0 <= ref ? o < ref : o > ref; d = 0 <= ref ? ++o : --o) {
      if (equal(M(h, n, d, d), zero)) {
        for (i = i1 = ref1 = d + 1, ref2 = n; ref1 <= ref2 ? i1 < ref2 : i1 > ref2; i = ref1 <= ref2 ? ++i1 : --i1) {
          if (!equal(M(h, n, i, d), zero)) {
            break;
          }
        }
        if (i === n) {
          p1 = zero;
          break;
        }
        for (j = j1 = ref3 = d, ref4 = n; ref3 <= ref4 ? j1 < ref4 : j1 > ref4; j = ref3 <= ref4 ? ++j1 : --j1) {
          p2 = M(h, n, d, j);
          setM(h, n, d, j, M(h, n, i, j));
          setM(h, n, i, j, p2);
        }
        push(p1);
        negate();
        p1 = pop();
      }
      push(p1);
      push(M(h, n, d, d));
      multiply();
      p1 = pop();
      for (i = l1 = ref5 = d + 1, ref6 = n; ref5 <= ref6 ? l1 < ref6 : l1 > ref6; i = ref5 <= ref6 ? ++l1 : --l1) {
        push(M(h, n, i, d));
        push(M(h, n, d, d));
        divide();
        negate();
        p2 = pop();
        setM(h, n, i, d, zero);
        for (j = m1 = ref7 = d + 1, ref8 = n; ref7 <= ref8 ? m1 < ref8 : m1 > ref8; j = ref7 <= ref8 ? ++m1 : --m1) {
          push(M(h, n, d, j));
          push(p2);
          multiply();
          push(M(h, n, i, j));
          add();
          setM(h, n, i, j, pop());
        }
      }
    }
    push(p1);
    push(M(h, n, n - 1, n - 1));
    multiply();
    return p1 = pop();
  };

  Eval_dirac = function() {
    push(cadr(p1));
    Eval();
    return dirac();
  };

  dirac = function() {
    save();
    ydirac();
    return restore();
  };

  ydirac = function() {
    p1 = pop();
    if (isdouble(p1)) {
      if (p1.d === 0) {
        push_integer(1);
        return;
      } else {
        push_integer(0);
        return;
      }
    }
    if (isrational(p1)) {
      if (MZERO(mmul(p1.q.a, p1.q.b))) {
        push_integer(1);
        return;
      } else {
        push_integer(0);
        return;
      }
    }
    if (car(p1) === symbol(POWER)) {
      push_symbol(DIRAC);
      push(cadr(p1));
      list(2);
      return;
    }
    if (isnegativeterm(p1)) {
      push_symbol(DIRAC);
      push(p1);
      negate();
      list(2);
      return;
    }
    if (isnegativeterm(p1) || (car(p1) === symbol(ADD) && isnegativeterm(cadr(p1)))) {
      push(p1);
      negate();
      p1 = pop();
    }
    push_symbol(DIRAC);
    push(p1);
    return list(2);
  };

  divisors = function() {
    var h, i, n, o, ref, subsetOfStack;
    i = 0;
    h = 0;
    n = 0;
    save();
    h = tos - 1;
    divisors_onstack();
    n = tos - h;
    subsetOfStack = stack.slice(h, h + n);
    subsetOfStack.sort(cmp_expr);
    stack = stack.slice(0, h).concat(subsetOfStack).concat(stack.slice(h + n));
    p1 = alloc_tensor(n);
    p1.tensor.ndim = 1;
    p1.tensor.dim[0] = n;
    for (i = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      p1.tensor.elem[i] = stack[h + i];
    }
    moveTos(h);
    push(p1);
    return restore();
  };

  divisors_onstack = function() {
    var h, i, k, n, o, ref;
    h = 0;
    i = 0;
    k = 0;
    n = 0;
    save();
    p1 = pop();
    h = tos;
    if (isNumericAtom(p1)) {
      push(p1);
      factor_small_number();
    } else if (car(p1) === symbol(ADD)) {
      push(p1);
      __factor_add();
    } else if (car(p1) === symbol(MULTIPLY)) {
      p1 = cdr(p1);
      if (isNumericAtom(car(p1))) {
        push(car(p1));
        factor_small_number();
        p1 = cdr(p1);
      }
      while (iscons(p1)) {
        p2 = car(p1);
        if (car(p2) === symbol(POWER)) {
          push(cadr(p2));
          push(caddr(p2));
        } else {
          push(p2);
          push(one);
        }
        p1 = cdr(p1);
      }
    } else if (car(p1) === symbol(POWER)) {
      push(cadr(p1));
      push(caddr(p1));
    } else {
      push(p1);
      push(one);
    }
    k = tos;
    push(one);
    gen(h, k);
    n = tos - k;
    for (i = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      stack[h + i] = stack[k + i];
    }
    moveTos(h + n);
    return restore();
  };

  gen = function(h, k) {
    var expo, i, o, ref;
    expo = 0;
    i = 0;
    save();
    p1 = pop();
    if (h === k) {
      push(p1);
      restore();
      return;
    }
    p2 = stack[h + 0];
    p3 = stack[h + 1];
    push(p3);
    expo = pop_integer();
    if (!isNaN(expo)) {
      for (i = o = 0, ref = Math.abs(expo); 0 <= ref ? o <= ref : o >= ref; i = 0 <= ref ? ++o : --o) {
        push(p1);
        push(p2);
        push_integer(sign(expo) * i);
        power();
        multiply();
        gen(h + 2, k);
      }
    }
    return restore();
  };

  __factor_add = function() {
    save();
    p1 = pop();
    p3 = cdr(p1);
    push(car(p3));
    p3 = cdr(p3);
    while (iscons(p3)) {
      push(car(p3));
      gcd();
      p3 = cdr(p3);
    }
    p2 = pop();
    if (isplusone(p2)) {
      push(p1);
      push(one);
      restore();
      return;
    }
    if (isNumericAtom(p2)) {
      push(p2);
      factor_small_number();
    } else if (car(p2) === symbol(MULTIPLY)) {
      p3 = cdr(p2);
      if (isNumericAtom(car(p3))) {
        push(car(p3));
        factor_small_number();
      } else {
        push(car(p3));
        push(one);
      }
      p3 = cdr(p3);
      while (iscons(p3)) {
        push(car(p3));
        push(one);
        p3 = cdr(p3);
      }
    } else {
      push(p2);
      push(one);
    }
    push(p2);
    inverse();
    p2 = pop();
    push(zero);
    p3 = cdr(p1);
    while (iscons(p3)) {
      push(p2);
      push(car(p3));
      multiply();
      add();
      p3 = cdr(p3);
    }
    push(one);
    return restore();
  };

  dpow = function() {
    var a, b, base, expo, result, theta;
    a = 0.0;
    b = 0.0;
    base = 0.0;
    expo = 0.0;
    result = 0.0;
    theta = 0.0;
    expo = pop_double();
    base = pop_double();
    if (base === 0.0 && expo < 0.0) {
      stop("divide by zero");
    }
    if (base >= 0.0 || (expo % 1.0) === 0.0) {
      result = Math.pow(base, expo);
      push_double(result);
      return;
    }
    result = Math.pow(Math.abs(base), expo);
    theta = Math.PI * expo;
    if ((expo % 0.5) === 0.0) {
      a = 0.0;
      b = Math.sin(theta);
    } else {
      a = Math.cos(theta);
      b = Math.sin(theta);
    }
    push_double(a * result);
    push_double(b * result);
    push(imaginaryunit);
    multiply();
    return add();
  };


  /* eigen =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  m
  
  General description
  -------------------
  Compute eigenvalues and eigenvectors. Matrix m must be both numerical and symmetric.
  The eigenval function returns a matrix with the eigenvalues along the diagonal.
  The eigenvec function returns a matrix with the eigenvectors arranged as row vectors.
  The eigen function does not return anything but stores the eigenvalue matrix in D
  and the eigenvector matrix in Q.
  
  Input:    stack[tos - 1]    symmetric matrix
  
  Output:    D      diagnonal matrix
        Q      eigenvector matrix
  
  D and Q have the property that
  
    A == dot(transpose(Q),D,Q)
  
  where A is the original matrix.
  
  The eigenvalues are on the diagonal of D.
  The eigenvectors are row vectors in Q.
  
  The eigenvalue relation:
  
    A X = lambda X
  
  can be checked as follows:
  
    lambda = D[1,1]
    X = Q[1]
    dot(A,X) - lambda X
  
  Example 1. Check the relation AX = lambda X where lambda is an eigenvalue and X is the associated eigenvector.
  
  Enter:
  
       A = hilbert(3)
  
       eigen(A)
  
       lambda = D[1,1]
  
       X = Q[1]
  
       dot(A,X) - lambda X
  
  Result:
  
       -1.16435e-14
   
       -6.46705e-15
   
       -4.55191e-15
  
  Example 2: Check the relation A = QTDQ.
  
  Enter:
  
    A - dot(transpose(Q),D,Q)
  
  Result: 
  
    6.27365e-12    -1.58236e-11   1.81902e-11
   
    -1.58236e-11   -1.95365e-11   2.56514e-12
   
    1.81902e-11    2.56514e-12    1.32627e-11
   */

  EIG_N = 0;

  EIG_yydd = [];

  EIG_yyqq = [];

  Eval_eigen = function() {
    if (EIG_check_arg() === 0) {
      stop("eigen: argument is not a square matrix");
    }
    eigen(EIGEN);
    p1 = usr_symbol("D");
    set_binding(p1, p2);
    p1 = usr_symbol("Q");
    set_binding(p1, p3);
    return push(symbol(NIL));
  };


  /* eigenval =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  m
  
  General description
  -------------------
  Compute eigenvalues of m. See "eigen" for more info.
   */

  Eval_eigenval = function() {
    if (EIG_check_arg() === 0) {
      push_symbol(EIGENVAL);
      push(p1);
      list(2);
      return;
    }
    eigen(EIGENVAL);
    return push(p2);
  };


  /* eigenvec =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  m
  
  General description
  -------------------
  Compute eigenvectors of m. See "eigen" for more info.
   */

  Eval_eigenvec = function() {
    if (EIG_check_arg() === 0) {
      push_symbol(EIGENVEC);
      push(p1);
      list(2);
      return;
    }
    eigen(EIGENVEC);
    return push(p3);
  };

  EIG_check_arg = function() {
    var i, i1, j, j1, l1, o, ref, ref1, ref2, ref3, ref4;
    i = 0;
    j = 0;
    push(cadr(p1));
    Eval();
    yyfloat();
    Eval();
    p1 = pop();
    if (!istensor(p1)) {
      return 0;
    }
    if (p1.tensor.ndim !== 2 || p1.tensor.dim[0] !== p1.tensor.dim[1]) {
      stop("eigen: argument is not a square matrix");
    }
    EIG_N = p1.tensor.dim[0];
    for (i = o = 0, ref = EIG_N; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      for (j = i1 = 0, ref1 = EIG_N; 0 <= ref1 ? i1 < ref1 : i1 > ref1; j = 0 <= ref1 ? ++i1 : --i1) {
        if (!isdouble(p1.tensor.elem[EIG_N * i + j])) {
          stop("eigen: matrix is not numerical");
        }
      }
    }
    for (i = j1 = 0, ref2 = EIG_N - 1; 0 <= ref2 ? j1 < ref2 : j1 > ref2; i = 0 <= ref2 ? ++j1 : --j1) {
      for (j = l1 = ref3 = i + 1, ref4 = EIG_N; ref3 <= ref4 ? l1 < ref4 : l1 > ref4; j = ref3 <= ref4 ? ++l1 : --l1) {
        if (Math.abs(p1.tensor.elem[EIG_N * i + j].d - p1.tensor.elem[EIG_N * j + i].d) > 1e-10) {
          stop("eigen: matrix is not symmetrical");
        }
      }
    }
    return 1;
  };

  eigen = function(op) {
    var i, i1, j, j1, l1, m1, n1, o, o1, q1, r1, ref, ref1, ref10, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, results, s1;
    i = 0;
    j = 0;
    for (i = o = 0, ref = EIG_N * EIG_N; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      EIG_yydd[i] = 0.0;
    }
    for (i = i1 = 0, ref1 = EIG_N * EIG_N; 0 <= ref1 ? i1 < ref1 : i1 > ref1; i = 0 <= ref1 ? ++i1 : --i1) {
      EIG_yyqq[i] = 0.0;
    }
    for (i = j1 = 0, ref2 = EIG_N; 0 <= ref2 ? j1 < ref2 : j1 > ref2; i = 0 <= ref2 ? ++j1 : --j1) {
      EIG_yydd[EIG_N * i + i] = p1.tensor.elem[EIG_N * i + i].d;
      for (j = l1 = ref3 = i + 1, ref4 = EIG_N; ref3 <= ref4 ? l1 < ref4 : l1 > ref4; j = ref3 <= ref4 ? ++l1 : --l1) {
        EIG_yydd[EIG_N * i + j] = p1.tensor.elem[EIG_N * i + j].d;
        EIG_yydd[EIG_N * j + i] = p1.tensor.elem[EIG_N * i + j].d;
      }
    }
    for (i = m1 = 0, ref5 = EIG_N; 0 <= ref5 ? m1 < ref5 : m1 > ref5; i = 0 <= ref5 ? ++m1 : --m1) {
      EIG_yyqq[EIG_N * i + i] = 1.0;
      for (j = n1 = ref6 = i + 1, ref7 = EIG_N; ref6 <= ref7 ? n1 < ref7 : n1 > ref7; j = ref6 <= ref7 ? ++n1 : --n1) {
        EIG_yyqq[EIG_N * i + j] = 0.0;
        EIG_yyqq[EIG_N * j + i] = 0.0;
      }
    }
    for (i = o1 = 0; o1 < 100; i = ++o1) {
      if (step() === 0) {
        break;
      }
    }
    if (i === 100) {
      printstr("\nnote: eigen did not converge\n");
    }
    if (op === EIGEN || op === EIGENVAL) {
      push(p1);
      copy_tensor();
      p2 = pop();
      for (i = q1 = 0, ref8 = EIG_N; 0 <= ref8 ? q1 < ref8 : q1 > ref8; i = 0 <= ref8 ? ++q1 : --q1) {
        for (j = r1 = 0, ref9 = EIG_N; 0 <= ref9 ? r1 < ref9 : r1 > ref9; j = 0 <= ref9 ? ++r1 : --r1) {
          push_double(EIG_yydd[EIG_N * i + j]);
          p2.tensor.elem[EIG_N * i + j] = pop();
        }
      }
    }
    if (op === EIGEN || op === EIGENVEC) {
      push(p1);
      copy_tensor();
      p3 = pop();
      results = [];
      for (i = s1 = 0, ref10 = EIG_N; 0 <= ref10 ? s1 < ref10 : s1 > ref10; i = 0 <= ref10 ? ++s1 : --s1) {
        results.push((function() {
          var ref11, results1, t1;
          results1 = [];
          for (j = t1 = 0, ref11 = EIG_N; 0 <= ref11 ? t1 < ref11 : t1 > ref11; j = 0 <= ref11 ? ++t1 : --t1) {
            push_double(EIG_yyqq[EIG_N * i + j]);
            results1.push(p3.tensor.elem[EIG_N * i + j] = pop());
          }
          return results1;
        })());
      }
      return results;
    }
  };

  step = function() {
    var count, i, i1, j, o, ref, ref1, ref2;
    i = 0;
    j = 0;
    count = 0;
    for (i = o = 0, ref = EIG_N - 1; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      for (j = i1 = ref1 = i + 1, ref2 = EIG_N; ref1 <= ref2 ? i1 < ref2 : i1 > ref2; j = ref1 <= ref2 ? ++i1 : --i1) {
        if (EIG_yydd[EIG_N * i + j] !== 0.0) {
          step2(i, j);
          count++;
        }
      }
    }
    return count;
  };

  step2 = function(p, q) {
    var c, cc, i1, j1, k, o, ref, ref1, ref2, s, ss, t, theta;
    k = 0;
    t = 0.0;
    theta = 0.0;
    c = 0.0;
    cc = 0.0;
    s = 0.0;
    ss = 0.0;
    theta = 0.5 * (EIG_yydd[EIG_N * p + p] - EIG_yydd[EIG_N * q + q]) / EIG_yydd[EIG_N * p + q];
    t = 1.0 / (Math.abs(theta) + Math.sqrt(theta * theta + 1.0));
    if (theta < 0.0) {
      t = -t;
    }
    c = 1.0 / Math.sqrt(t * t + 1.0);
    s = t * c;
    for (k = o = 0, ref = EIG_N; 0 <= ref ? o < ref : o > ref; k = 0 <= ref ? ++o : --o) {
      cc = EIG_yydd[EIG_N * p + k];
      ss = EIG_yydd[EIG_N * q + k];
      EIG_yydd[EIG_N * p + k] = c * cc + s * ss;
      EIG_yydd[EIG_N * q + k] = c * ss - s * cc;
    }
    for (k = i1 = 0, ref1 = EIG_N; 0 <= ref1 ? i1 < ref1 : i1 > ref1; k = 0 <= ref1 ? ++i1 : --i1) {
      cc = EIG_yydd[EIG_N * k + p];
      ss = EIG_yydd[EIG_N * k + q];
      EIG_yydd[EIG_N * k + p] = c * cc + s * ss;
      EIG_yydd[EIG_N * k + q] = c * ss - s * cc;
    }
    for (k = j1 = 0, ref2 = EIG_N; 0 <= ref2 ? j1 < ref2 : j1 > ref2; k = 0 <= ref2 ? ++j1 : --j1) {
      cc = EIG_yyqq[EIG_N * p + k];
      ss = EIG_yyqq[EIG_N * q + k];
      EIG_yyqq[EIG_N * p + k] = c * cc + s * ss;
      EIG_yyqq[EIG_N * q + k] = c * ss - s * cc;
    }
    EIG_yydd[EIG_N * p + q] = 0.0;
    return EIG_yydd[EIG_N * q + p] = 0.0;
  };


  /* erf =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Authors
  -------
  philippe.billet@noos.fr
  
  Parameters
  ----------
  x
  
  General description
  -------------------
  Error function erf(x).
  erf(-x)=erf(x)
   */

  Eval_erf = function() {
    push(cadr(p1));
    Eval();
    return yerf();
  };

  yerf = function() {
    save();
    yyerf();
    return restore();
  };

  yyerf = function() {
    var d;
    d = 0.0;
    p1 = pop();
    if (isdouble(p1)) {
      d = 1.0 - erfc(p1.d);
      push_double(d);
      return;
    }
    if (isZeroAtomOrTensor(p1)) {
      push(zero);
      return;
    }
    if (isnegativeterm(p1)) {
      push_symbol(ERF);
      push(p1);
      negate();
      list(2);
      negate();
      return;
    }
    push_symbol(ERF);
    push(p1);
    list(2);
  };

  Eval_erfc = function() {
    push(cadr(p1));
    Eval();
    return yerfc();
  };

  yerfc = function() {
    save();
    yyerfc();
    return restore();
  };

  yyerfc = function() {
    var d;
    d = 0.0;
    p1 = pop();
    if (isdouble(p1)) {
      d = erfc(p1.d);
      push_double(d);
      return;
    }
    if (isZeroAtomOrTensor(p1)) {
      push(one);
      return;
    }
    push_symbol(ERFC);
    push(p1);
    list(2);
  };

  erfc = function(x) {
    var ans, t, z;
    if (x === 0) {
      return 1.0;
    }
    t = 0.0;
    z = 0.0;
    ans = 0.0;
    z = Math.abs(x);
    t = 1.0 / (1.0 + 0.5 * z);
    ans = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    if (x >= 0.0) {
      return ans;
    } else {
      return 2.0 - ans;
    }
  };

  Eval = function() {
    var willEvaluateAsFloats;
    check_esc_flag();
    save();
    p1 = pop();
    if (p1 == null) {
      debugger;
    }
    if (!evaluatingAsFloats && isfloating(p1)) {
      willEvaluateAsFloats = true;
      evaluatingAsFloats++;
    }
    switch (p1.k) {
      case CONS:
        Eval_cons();
        break;
      case NUM:
        if (evaluatingAsFloats) {
          push_double(convert_rational_to_double(p1));
        } else {
          push(p1);
        }
        break;
      case DOUBLE:
      case STR:
        push(p1);
        break;
      case TENSOR:
        Eval_tensor();
        break;
      case SYM:
        Eval_sym();
        break;
      default:
        stop("atom?");
    }
    if (willEvaluateAsFloats) {
      evaluatingAsFloats--;
    }
    return restore();
  };

  Eval_sym = function() {
    var cycleString, i, o, positionIfSymbolAlreadyBeingEvaluated, ref, ref1;
    if (iskeyword(p1)) {
      push(p1);
      push(symbol(LAST));
      list(2);
      Eval();
      return;
    } else if (p1 === symbol(PI) && evaluatingAsFloats) {
      push_double(Math.PI);
      return;
    }
    p2 = get_binding(p1);
    if (DEBUG) {
      console.log("looked up: " + p1 + " which contains: " + p2);
    }
    push(p2);
    if (p1 !== p2) {
      positionIfSymbolAlreadyBeingEvaluated = chainOfUserSymbolsNotFunctionsBeingEvaluated.indexOf(p1);
      if (positionIfSymbolAlreadyBeingEvaluated !== -1) {
        cycleString = "";
        for (i = o = ref = positionIfSymbolAlreadyBeingEvaluated, ref1 = chainOfUserSymbolsNotFunctionsBeingEvaluated.length; ref <= ref1 ? o < ref1 : o > ref1; i = ref <= ref1 ? ++o : --o) {
          cycleString += chainOfUserSymbolsNotFunctionsBeingEvaluated[i].printname + " -> ";
        }
        cycleString += p1.printname;
        stop("recursive evaluation of symbols: " + cycleString);
        return;
      }
      chainOfUserSymbolsNotFunctionsBeingEvaluated.push(p1);
      Eval();
      return chainOfUserSymbolsNotFunctionsBeingEvaluated.pop();
    }
  };

  Eval_cons = function() {
    var cons_head;
    cons_head = car(p1);
    if (car(cons_head) === symbol(EVAL)) {
      Eval_user_function();
      return;
    }
    if (!issymbol(cons_head)) {
      stop("cons?");
    }
    switch (symnum(cons_head)) {
      case ABS:
        return Eval_abs();
      case ADD:
        return Eval_add();
      case ADJ:
        return Eval_adj();
      case AND:
        return Eval_and();
      case ARCCOS:
        return Eval_arccos();
      case ARCCOSH:
        return Eval_arccosh();
      case ARCSIN:
        return Eval_arcsin();
      case ARCSINH:
        return Eval_arcsinh();
      case ARCTAN:
        return Eval_arctan();
      case ARCTANH:
        return Eval_arctanh();
      case ARG:
        return Eval_arg();
      case ATOMIZE:
        return Eval_atomize();
      case BESSELJ:
        return Eval_besselj();
      case BESSELY:
        return Eval_bessely();
      case BINDING:
        return Eval_binding();
      case BINOMIAL:
        return Eval_binomial();
      case CEILING:
        return Eval_ceiling();
      case CHECK:
        return Eval_check();
      case CHOOSE:
        return Eval_choose();
      case CIRCEXP:
        return Eval_circexp();
      case CLEAR:
        return Eval_clear();
      case CLEARALL:
        return Eval_clearall();
      case CLEARPATTERNS:
        return Eval_clearpatterns();
      case CLOCK:
        return Eval_clock();
      case COEFF:
        return Eval_coeff();
      case COFACTOR:
        return Eval_cofactor();
      case CONDENSE:
        return Eval_condense();
      case CONJ:
        return Eval_conj();
      case CONTRACT:
        return Eval_contract();
      case COS:
        return Eval_cos();
      case COSH:
        return Eval_cosh();
      case DECOMP:
        return Eval_decomp();
      case DEGREE:
        return Eval_degree();
      case DEFINT:
        return Eval_defint();
      case DENOMINATOR:
        return Eval_denominator();
      case DERIVATIVE:
        return Eval_derivative();
      case DET:
        return Eval_det();
      case DIM:
        return Eval_dim();
      case DIRAC:
        return Eval_dirac();
      case DIVISORS:
        return Eval_divisors();
      case DO:
        return Eval_do();
      case DOT:
        return Eval_inner();
      case DRAW:
        return Eval_draw();
      case DSOLVE:
        return Eval_dsolve();
      case EIGEN:
        return Eval_eigen();
      case EIGENVAL:
        return Eval_eigenval();
      case EIGENVEC:
        return Eval_eigenvec();
      case ERF:
        return Eval_erf();
      case ERFC:
        return Eval_erfc();
      case EVAL:
        return Eval_Eval();
      case EXP:
        return Eval_exp();
      case EXPAND:
        return Eval_expand();
      case EXPCOS:
        return Eval_expcos();
      case EXPSIN:
        return Eval_expsin();
      case FACTOR:
        return Eval_factor();
      case FACTORIAL:
        return Eval_factorial();
      case FACTORPOLY:
        return Eval_factorpoly();
      case FILTER:
        return Eval_filter();
      case FLOATF:
        return Eval_float();
      case APPROXRATIO:
        return Eval_approxratio();
      case FLOOR:
        return Eval_floor();
      case FOR:
        return Eval_for();
      case FUNCTION:
        return Eval_function_reference();
      case GAMMA:
        return Eval_gamma();
      case GCD:
        return Eval_gcd();
      case HERMITE:
        return Eval_hermite();
      case HILBERT:
        return Eval_hilbert();
      case IMAG:
        return Eval_imag();
      case INDEX:
        return Eval_index();
      case INNER:
        return Eval_inner();
      case INTEGRAL:
        return Eval_integral();
      case INV:
        return Eval_inv();
      case INVG:
        return Eval_invg();
      case ISINTEGER:
        return Eval_isinteger();
      case ISPRIME:
        return Eval_isprime();
      case LAGUERRE:
        return Eval_laguerre();
      case LCM:
        return Eval_lcm();
      case LEADING:
        return Eval_leading();
      case LEGENDRE:
        return Eval_legendre();
      case LOG:
        return Eval_log();
      case LOOKUP:
        return Eval_lookup();
      case MOD:
        return Eval_mod();
      case MULTIPLY:
        return Eval_multiply();
      case NOT:
        return Eval_not();
      case NROOTS:
        return Eval_nroots();
      case NUMBER:
        return Eval_number();
      case NUMERATOR:
        return Eval_numerator();
      case OPERATOR:
        return Eval_operator();
      case OR:
        return Eval_or();
      case OUTER:
        return Eval_outer();
      case PATTERN:
        return Eval_pattern();
      case PATTERNSINFO:
        return Eval_patternsinfo();
      case POLAR:
        return Eval_polar();
      case POWER:
        return Eval_power();
      case PRIME:
        return Eval_prime();
      case PRINT:
        return Eval_print();
      case PRINT2DASCII:
        return Eval_print2dascii();
      case PRINTFULL:
        return Eval_printcomputer();
      case PRINTLATEX:
        return Eval_printlatex();
      case PRINTLIST:
        return Eval_printlist();
      case PRINTPLAIN:
        return Eval_printhuman();
      case PRODUCT:
        return Eval_product();
      case QUOTE:
        return Eval_quote();
      case QUOTIENT:
        return Eval_quotient();
      case RANK:
        return Eval_rank();
      case RATIONALIZE:
        return Eval_rationalize();
      case REAL:
        return Eval_real();
      case ROUND:
        return Eval_round();
      case YYRECT:
        return Eval_rect();
      case ROOTS:
        return Eval_roots();
      case SETQ:
        return Eval_setq();
      case SGN:
        return Eval_sgn();
      case SILENTPATTERN:
        return Eval_silentpattern();
      case SIMPLIFY:
        return Eval_simplify();
      case SIN:
        return Eval_sin();
      case SINH:
        return Eval_sinh();
      case SHAPE:
        return Eval_shape();
      case SQRT:
        return Eval_sqrt();
      case STOP:
        return Eval_stop();
      case SUBST:
        return Eval_subst();
      case SUM:
        return Eval_sum();
      case SYMBOLSINFO:
        return Eval_symbolsinfo();
      case TAN:
        return Eval_tan();
      case TANH:
        return Eval_tanh();
      case TAYLOR:
        return Eval_taylor();
      case TEST:
        return Eval_test();
      case TESTEQ:
        return Eval_testeq();
      case TESTGE:
        return Eval_testge();
      case TESTGT:
        return Eval_testgt();
      case TESTLE:
        return Eval_testle();
      case TESTLT:
        return Eval_testlt();
      case TRANSPOSE:
        return Eval_transpose();
      case UNIT:
        return Eval_unit();
      case ZERO:
        return Eval_zero();
      default:
        return Eval_user_function();
    }
  };

  Eval_binding = function() {
    return push(get_binding(cadr(p1)));
  };


  /* check =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  p
  
  General description
  -------------------
  Returns whether the predicate p is true/false or unknown:
  0 if false, 1 if true or remains unevaluated if unknown.
  Note that if "check" is passed an assignment, it turns it into a test,
  i.e. check(a = b) is turned into check(a==b) 
  so "a" is not assigned anything.
  Like in many programming languages, "check" also gives truthyness/falsyness
  for numeric values. In which case, "true" is returned for non-zero values.
  Potential improvements: "check" can't evaluate strings yet.
   */

  Eval_check = function() {
    var checkResult;
    checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(cadr(p1));
    if (checkResult == null) {
      return push(p1);
    } else {
      return push_integer(checkResult);
    }
  };

  Eval_det = function() {
    push(cadr(p1));
    Eval();
    return det();
  };


  /* dim =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  m,n
  
  General description
  -------------------
  Returns the cardinality of the nth index of tensor "m".
   */

  Eval_dim = function() {
    var n;
    push(cadr(p1));
    Eval();
    p2 = pop();
    if (iscons(cddr(p1))) {
      push(caddr(p1));
      Eval();
      n = pop_integer();
    } else {
      n = 1;
    }
    if (!istensor(p2)) {
      return push_integer(1);
    } else if (n < 1 || n > p2.tensor.ndim) {
      return push(p1);
    } else {
      return push_integer(p2.tensor.dim[n - 1]);
    }
  };

  Eval_divisors = function() {
    push(cadr(p1));
    Eval();
    return divisors();
  };


  /* do =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  a,b,...
  
  General description
  -------------------
  Evaluates each argument from left to right. Returns the result of the last argument.
   */

  Eval_do = function() {
    var results;
    push(car(p1));
    p1 = cdr(p1);
    results = [];
    while (iscons(p1)) {
      pop();
      push(car(p1));
      Eval();
      results.push(p1 = cdr(p1));
    }
    return results;
  };

  Eval_dsolve = function() {
    push(cadr(p1));
    Eval();
    push(caddr(p1));
    Eval();
    push(cadddr(p1));
    Eval();
    return dsolve();
  };

  Eval_Eval = function() {
    push(cadr(p1));
    Eval();
    p1 = cddr(p1);
    while (iscons(p1)) {
      push(car(p1));
      Eval();
      push(cadr(p1));
      Eval();
      subst();
      p1 = cddr(p1);
    }
    return Eval();
  };

  Eval_exp = function() {
    push(cadr(p1));
    Eval();
    return exponential();
  };

  Eval_factorial = function() {
    push(cadr(p1));
    Eval();
    return factorial();
  };

  Eval_factorpoly = function() {
    var results;
    p1 = cdr(p1);
    push(car(p1));
    Eval();
    p1 = cdr(p1);
    push(car(p1));
    Eval();
    factorpoly();
    p1 = cdr(p1);
    results = [];
    while (iscons(p1)) {
      push(car(p1));
      Eval();
      factorpoly();
      results.push(p1 = cdr(p1));
    }
    return results;
  };

  Eval_hermite = function() {
    push(cadr(p1));
    Eval();
    push(caddr(p1));
    Eval();
    return hermite();
  };

  Eval_hilbert = function() {
    push(cadr(p1));
    Eval();
    return hilbert();
  };

  Eval_index = function() {
    var h, orig, theTensor;
    h = tos;
    orig = p1;
    p1 = cdr(p1);
    push(car(p1));
    Eval();
    theTensor = stack[tos - 1];
    if (isNumericAtom(theTensor)) {
      stop("trying to access a scalar as a tensor");
    }
    if (!istensor(theTensor)) {
      moveTos(h);
      push(orig);
      return;
    }
    p1 = cdr(p1);
    while (iscons(p1)) {
      push(car(p1));
      Eval();
      if (!isintegerorintegerfloat(stack[tos - 1])) {
        moveTos(h);
        push(orig);
        return;
      }
      p1 = cdr(p1);
    }
    return index_function(tos - h);
  };

  Eval_inv = function() {
    push(cadr(p1));
    Eval();
    return inv();
  };

  Eval_invg = function() {
    push(cadr(p1));
    Eval();
    return invg();
  };

  Eval_isinteger = function() {
    var n;
    push(cadr(p1));
    Eval();
    p1 = pop();
    if (isrational(p1)) {
      if (isinteger(p1)) {
        push(one);
      } else {
        push(zero);
      }
      return;
    }
    if (isdouble(p1)) {
      n = Math.floor(p1.d);
      if (n === p1.d) {
        push(one);
      } else {
        push(zero);
      }
      return;
    }
    push_symbol(ISINTEGER);
    push(p1);
    return list(2);
  };

  Eval_number = function() {
    push(cadr(p1));
    Eval();
    p1 = pop();
    if (p1.k === NUM || p1.k === DOUBLE) {
      return push_integer(1);
    } else {
      return push_integer(0);
    }
  };

  Eval_operator = function() {
    var h;
    h = tos;
    push_symbol(OPERATOR);
    p1 = cdr(p1);
    while (iscons(p1)) {
      push(car(p1));
      Eval();
      p1 = cdr(p1);
    }
    return list(tos - h);
  };

  Eval_quote = function() {
    return push(cadr(p1));
  };

  Eval_rank = function() {
    push(cadr(p1));
    Eval();
    p1 = pop();
    if (istensor(p1)) {
      return push_integer(p1.tensor.ndim);
    } else {
      return push(zero);
    }
  };

  Eval_setq = function() {
    if (caadr(p1) === symbol(INDEX)) {
      setq_indexed();
      return;
    }
    if (iscons(cadr(p1))) {
      define_user_function();
      return;
    }
    if (!issymbol(cadr(p1))) {
      stop("symbol assignment: error in symbol");
    }
    push(caddr(p1));
    Eval();
    p2 = pop();
    set_binding(cadr(p1), p2);
    return push(symbol(NIL));
  };

  setq_indexed = function() {
    var h;
    p4 = cadadr(p1);
    console.log("p4: " + p4);
    if (!issymbol(p4)) {
      stop("indexed assignment: expected a symbol name");
    }
    h = tos;
    push(caddr(p1));
    Eval();
    p2 = cdadr(p1);
    while (iscons(p2)) {
      push(car(p2));
      Eval();
      p2 = cdr(p2);
    }
    set_component(tos - h);
    p3 = pop();
    set_binding(p4, p3);
    return push(symbol(NIL));
  };

  Eval_sqrt = function() {
    push(cadr(p1));
    Eval();
    push_rational(1, 2);
    return power();
  };

  Eval_stop = function() {
    return stop("user stop");
  };

  Eval_subst = function() {
    push(cadddr(p1));
    Eval();
    push(caddr(p1));
    Eval();
    push(cadr(p1));
    Eval();
    subst();
    return Eval();
  };

  Eval_unit = function() {
    var i, n, o, ref;
    i = 0;
    n = 0;
    push(cadr(p1));
    Eval();
    n = pop_integer();
    if (isNaN(n)) {
      push(p1);
      return;
    }
    if (n < 1) {
      push(p1);
      return;
    }
    p1 = alloc_tensor(n * n);
    p1.tensor.ndim = 2;
    p1.tensor.dim[0] = n;
    p1.tensor.dim[1] = n;
    for (i = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      p1.tensor.elem[n * i + i] = one;
    }
    check_tensor_dimensions(p1);
    return push(p1);
  };

  Eval_noexpand = function() {
    var prev_expanding;
    prev_expanding = expanding;
    expanding = 0;
    Eval();
    return expanding = prev_expanding;
  };

  Eval_predicate = function() {
    save();
    p1 = top();
    if (car(p1) === symbol(SETQ)) {
      pop();
      push_symbol(TESTEQ);
      push(cadr(p1));
      push(caddr(p1));
      list(3);
    }
    Eval();
    return restore();
  };

  Eval_expand = function() {
    push(cadr(p1));
    Eval();
    push(caddr(p1));
    Eval();
    p2 = pop();
    if (p2 === symbol(NIL)) {
      guess();
    } else {
      push(p2);
    }
    return expand();
  };

  expand = function() {
    var prev_expanding;
    save();
    p9 = pop();
    p5 = pop();
    if (istensor(p5)) {
      expand_tensor();
      restore();
      return;
    }
    if (car(p5) === symbol(ADD)) {
      push_integer(0);
      p1 = cdr(p5);
      while (iscons(p1)) {
        push(car(p1));
        push(p9);
        expand();
        add();
        p1 = cdr(p1);
      }
      restore();
      return;
    }
    push(p5);
    numerator();
    p3 = pop();
    push(p5);
    denominator();
    p2 = pop();
    remove_negative_exponents();
    push(p3);
    push(p2);
    push(p9);
    if (isone(p3) || isone(p2)) {
      if (!ispolyexpandedform(p2, p9) || isone(p2)) {
        pop();
        pop();
        pop();
        push(p5);
        restore();
        return;
      }
    }
    divpoly();
    p7 = pop();
    push(p3);
    push(p2);
    push(p7);
    multiply();
    subtract();
    p3 = pop();
    if (isZeroAtomOrTensor(p3)) {
      push(p7);
      restore();
      return;
    }
    push(p2);
    push(p9);
    factorpoly();
    p2 = pop();
    expand_get_C();
    expand_get_B();
    expand_get_A();
    if (istensor(p4)) {
      push(p4);
      prev_expanding = expanding;
      expanding = 1;
      inv();
      expanding = prev_expanding;
      push(p3);
      inner();
      push(p2);
      inner();
    } else {
      push(p3);
      push(p4);
      prev_expanding = expanding;
      expanding = 1;
      divide();
      expanding = prev_expanding;
      push(p2);
      multiply();
    }
    push(p7);
    add();
    return restore();
  };

  expand_tensor = function() {
    var i, o, ref;
    i = 0;
    push(p5);
    copy_tensor();
    p5 = pop();
    for (i = o = 0, ref = p5.tensor.nelem; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      push(p5.tensor.elem[i]);
      push(p9);
      expand();
      p5.tensor.elem[i] = pop();
    }
    return push(p5);
  };

  remove_negative_exponents = function() {
    var h, i, j, k, n, o, ref;
    h = 0;
    i = 0;
    j = 0;
    k = 0;
    n = 0;
    h = tos;
    factors(p2);
    factors(p3);
    n = tos - h;
    j = 0;
    for (i = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      p1 = stack[h + i];
      if (car(p1) !== symbol(POWER)) {
        continue;
      }
      if (cadr(p1) !== p9) {
        continue;
      }
      push(caddr(p1));
      k = pop_integer();
      if (isNaN(k)) {
        continue;
      }
      if (k < j) {
        j = k;
      }
    }
    moveTos(h);
    if (j === 0) {
      return;
    }
    push(p2);
    push(p9);
    push_integer(-j);
    power();
    multiply();
    p2 = pop();
    push(p3);
    push(p9);
    push_integer(-j);
    power();
    multiply();
    return p3 = pop();
  };

  expand_get_C = function() {
    var a, h, i, i1, j, n, o, prev_expanding, ref, ref1;
    h = 0;
    i = 0;
    j = 0;
    n = 0;
    h = tos;
    if (car(p2) === symbol(MULTIPLY)) {
      p1 = cdr(p2);
      while (iscons(p1)) {
        p5 = car(p1);
        expand_get_CF();
        p1 = cdr(p1);
      }
    } else {
      p5 = p2;
      expand_get_CF();
    }
    n = tos - h;
    if (n === 1) {
      p4 = pop();
      return;
    }
    p4 = alloc_tensor(n * n);
    p4.tensor.ndim = 2;
    p4.tensor.dim[0] = n;
    p4.tensor.dim[1] = n;
    a = h;
    for (i = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      for (j = i1 = 0, ref1 = n; 0 <= ref1 ? i1 < ref1 : i1 > ref1; j = 0 <= ref1 ? ++i1 : --i1) {
        push(stack[a + j]);
        push(p9);
        push_integer(i);
        power();
        prev_expanding = expanding;
        expanding = 1;
        divide();
        expanding = prev_expanding;
        push(p9);
        filter();
        p4.tensor.elem[n * i + j] = pop();
      }
    }
    return moveTos(tos - n);
  };

  expand_get_CF = function() {
    var d, i, j, n, o, prev_expanding, ref, results;
    d = 0;
    i = 0;
    j = 0;
    n = 0;
    if (!Find(p5, p9)) {
      return;
    }
    prev_expanding = expanding;
    expanding = 1;
    trivial_divide();
    expanding = prev_expanding;
    if (car(p5) === symbol(POWER)) {
      push(caddr(p5));
      n = pop_integer();
      p6 = cadr(p5);
    } else {
      n = 1;
      p6 = p5;
    }
    push(p6);
    push(p9);
    degree();
    d = pop_integer();
    results = [];
    for (i = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      results.push((function() {
        var i1, ref1, results1;
        results1 = [];
        for (j = i1 = 0, ref1 = d; 0 <= ref1 ? i1 < ref1 : i1 > ref1; j = 0 <= ref1 ? ++i1 : --i1) {
          push(p8);
          push(p6);
          push_integer(i);
          power();
          prev_expanding = expanding;
          expanding = 1;
          multiply();
          expanding = prev_expanding;
          push(p9);
          push_integer(j);
          power();
          prev_expanding = expanding;
          expanding = 1;
          multiply();
          results1.push(expanding = prev_expanding);
        }
        return results1;
      })());
    }
    return results;
  };

  trivial_divide = function() {
    var h;
    h = 0;
    if (car(p2) === symbol(MULTIPLY)) {
      h = tos;
      p0 = cdr(p2);
      while (iscons(p0)) {
        if (!equal(car(p0), p5)) {
          push(car(p0));
          Eval();
        }
        p0 = cdr(p0);
      }
      multiply_all(tos - h);
    } else {
      push_integer(1);
    }
    return p8 = pop();
  };

  expand_get_B = function() {
    var i, n, o, prev_expanding, ref;
    i = 0;
    n = 0;
    if (!istensor(p4)) {
      return;
    }
    n = p4.tensor.dim[0];
    p8 = alloc_tensor(n);
    p8.tensor.ndim = 1;
    p8.tensor.dim[0] = n;
    for (i = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      push(p3);
      push(p9);
      push_integer(i);
      power();
      prev_expanding = expanding;
      expanding = 1;
      divide();
      expanding = prev_expanding;
      push(p9);
      filter();
      p8.tensor.elem[i] = pop();
    }
    return p3 = p8;
  };

  expand_get_A = function() {
    var h, i, n, o, ref;
    h = 0;
    i = 0;
    n = 0;
    if (!istensor(p4)) {
      push(p2);
      reciprocate();
      p2 = pop();
      return;
    }
    h = tos;
    if (car(p2) === symbol(MULTIPLY)) {
      p8 = cdr(p2);
      while (iscons(p8)) {
        p5 = car(p8);
        expand_get_AF();
        p8 = cdr(p8);
      }
    } else {
      p5 = p2;
      expand_get_AF();
    }
    n = tos - h;
    p8 = alloc_tensor(n);
    p8.tensor.ndim = 1;
    p8.tensor.dim[0] = n;
    for (i = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      p8.tensor.elem[i] = stack[h + i];
    }
    moveTos(h);
    return p2 = p8;
  };

  expand_get_AF = function() {
    var d, i, j, n, o, ref, results;
    d = 0;
    i = 0;
    j = 0;
    n = 1;
    if (!Find(p5, p9)) {
      return;
    }
    if (car(p5) === symbol(POWER)) {
      push(caddr(p5));
      n = pop_integer();
      p5 = cadr(p5);
    }
    push(p5);
    push(p9);
    degree();
    d = pop_integer();
    results = [];
    for (i = o = ref = n; ref <= 0 ? o < 0 : o > 0; i = ref <= 0 ? ++o : --o) {
      results.push((function() {
        var i1, ref1, results1;
        results1 = [];
        for (j = i1 = 0, ref1 = d; 0 <= ref1 ? i1 < ref1 : i1 > ref1; j = 0 <= ref1 ? ++i1 : --i1) {
          push(p5);
          push_integer(i);
          power();
          reciprocate();
          push(p9);
          push_integer(j);
          power();
          results1.push(multiply());
        }
        return results1;
      })());
    }
    return results;
  };

  Eval_expcos = function() {
    push(cadr(p1));
    Eval();
    return expcos();
  };

  expcos = function() {
    save();
    p1 = pop();
    push(imaginaryunit);
    push(p1);
    multiply();
    exponential();
    push_rational(1, 2);
    multiply();
    push(imaginaryunit);
    negate();
    push(p1);
    multiply();
    exponential();
    push_rational(1, 2);
    multiply();
    add();
    return restore();
  };

  Eval_expsin = function() {
    push(cadr(p1));
    Eval();
    return expsin();
  };

  expsin = function() {
    save();
    p1 = pop();
    push(imaginaryunit);
    push(p1);
    multiply();
    exponential();
    push(imaginaryunit);
    divide();
    push_rational(1, 2);
    multiply();
    push(imaginaryunit);
    negate();
    push(p1);
    multiply();
    exponential();
    push(imaginaryunit);
    divide();
    push_rational(1, 2);
    multiply();
    subtract();
    return restore();
  };

  Eval_factor = function() {
    var results;
    push(cadr(p1));
    Eval();
    push(caddr(p1));
    Eval();
    p2 = pop();
    if (p2 === symbol(NIL)) {
      guess();
    } else {
      push(p2);
    }
    factor();
    p1 = cdddr(p1);
    results = [];
    while (iscons(p1)) {
      push(car(p1));
      Eval();
      factor_again();
      results.push(p1 = cdr(p1));
    }
    return results;
  };

  factor_again = function() {
    var h, n;
    save();
    p2 = pop();
    p1 = pop();
    h = tos;
    if (car(p1) === symbol(MULTIPLY)) {
      p1 = cdr(p1);
      while (iscons(p1)) {
        push(car(p1));
        push(p2);
        factor_term();
        p1 = cdr(p1);
      }
    } else {
      push(p1);
      push(p2);
      factor_term();
    }
    n = tos - h;
    if (n > 1) {
      multiply_all_noexpand(n);
    }
    return restore();
  };

  factor_term = function() {
    save();
    factorpoly();
    p1 = pop();
    if (car(p1) === symbol(MULTIPLY)) {
      p1 = cdr(p1);
      while (iscons(p1)) {
        push(car(p1));
        p1 = cdr(p1);
      }
    } else {
      push(p1);
    }
    return restore();
  };

  factor = function() {
    save();
    p2 = pop();
    p1 = pop();
    if (isinteger(p1)) {
      push(p1);
      factor_number();
    } else {
      push(p1);
      push(p2);
      factorpoly();
    }
    return restore();
  };

  factor_small_number = function() {
    var d, expo, i, n, o, ref;
    i = 0;
    save();
    n = pop_integer();
    if (isNaN(n)) {
      stop("number too big to factor");
    }
    if (n < 0) {
      n = -n;
    }
    for (i = o = 0, ref = MAXPRIMETAB; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      d = primetab[i];
      if (d > n / d) {
        break;
      }
      expo = 0;
      while (n % d === 0) {
        n /= d;
        expo++;
      }
      if (expo) {
        push_integer(d);
        push_integer(expo);
      }
    }
    if (n > 1) {
      push_integer(n);
      push_integer(1);
    }
    return restore();
  };

  factorial = function() {
    var n;
    n = 0;
    save();
    p1 = pop();
    push(p1);
    n = pop_integer();
    if (n < 0 || isNaN(n)) {
      push_symbol(FACTORIAL);
      push(p1);
      list(2);
      restore();
      return;
    }
    bignum_factorial(n);
    return restore();
  };

  simplifyfactorials = function() {
    var x;
    x = 0;
    save();
    x = expanding;
    expanding = 0;
    p1 = pop();
    if (car(p1) === symbol(ADD)) {
      push(zero);
      p1 = cdr(p1);
      while (iscons(p1)) {
        push(car(p1));
        simplifyfactorials();
        add();
        p1 = cdr(p1);
      }
      expanding = x;
      restore();
      return;
    }
    if (car(p1) === symbol(MULTIPLY)) {
      sfac_product();
      expanding = x;
      restore();
      return;
    }
    push(p1);
    expanding = x;
    return restore();
  };

  sfac_product = function() {
    var i, i1, j, j1, n, o, ref, ref1, ref2, ref3, s;
    i = 0;
    j = 0;
    n = 0;
    s = tos;
    p1 = cdr(p1);
    n = 0;
    while (iscons(p1)) {
      push(car(p1));
      p1 = cdr(p1);
      n++;
    }
    for (i = o = 0, ref = n - 1; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      if (stack[s + i] === symbol(NIL)) {
        continue;
      }
      for (j = i1 = ref1 = i + 1, ref2 = n; ref1 <= ref2 ? i1 < ref2 : i1 > ref2; j = ref1 <= ref2 ? ++i1 : --i1) {
        if (stack[s + j] === symbol(NIL)) {
          continue;
        }
        sfac_product_f(s, i, j);
      }
    }
    push(one);
    for (i = j1 = 0, ref3 = n; 0 <= ref3 ? j1 < ref3 : j1 > ref3; i = 0 <= ref3 ? ++j1 : --j1) {
      if (stack[s + i] === symbol(NIL)) {
        continue;
      }
      push(stack[s + i]);
      multiply();
    }
    p1 = pop();
    moveTos(tos - n);
    return push(p1);
  };

  sfac_product_f = function(s, a, b) {
    var i, n, o, ref;
    i = 0;
    n = 0;
    p1 = stack[s + a];
    p2 = stack[s + b];
    if (ispower(p1)) {
      p3 = caddr(p1);
      p1 = cadr(p1);
    } else {
      p3 = one;
    }
    if (ispower(p2)) {
      p4 = caddr(p2);
      p2 = cadr(p2);
    } else {
      p4 = one;
    }
    if (isfactorial(p1) && isfactorial(p2)) {
      push(p3);
      push(p4);
      add();
      yyexpand();
      n = pop_integer();
      if (n !== 0) {
        return;
      }
      push(cadr(p1));
      push(cadr(p2));
      subtract();
      yyexpand();
      n = pop_integer();
      if (n === 0 || isNaN(n)) {
        return;
      }
      if (n < 0) {
        n = -n;
        p5 = p1;
        p1 = p2;
        p2 = p5;
        p5 = p3;
        p3 = p4;
        p4 = p5;
      }
      push(one);
      for (i = o = 1, ref = n; 1 <= ref ? o <= ref : o >= ref; i = 1 <= ref ? ++o : --o) {
        push(cadr(p2));
        push_integer(i);
        add();
        push(p3);
        power();
        multiply();
      }
      stack[s + a] = pop();
      return stack[s + b] = symbol(NIL);
    }
  };

  polycoeff = 0;

  factpoly_expo = 0;

  factorpoly = function() {
    save();
    p2 = pop();
    p1 = pop();
    if (!Find(p1, p2)) {
      push(p1);
      restore();
      return;
    }
    if (!ispolyexpandedform(p1, p2)) {
      push(p1);
      restore();
      return;
    }
    if (!issymbol(p2)) {
      push(p1);
      restore();
      return;
    }
    push(p1);
    push(p2);
    yyfactorpoly();
    return restore();
  };

  yyfactorpoly = function() {
    var checkingTheDivision, dividend, foundComplexRoot, foundRealRoot, h, i, i1, j1, l1, o, prev_expanding, previousFactorisation, ref, ref1, ref2, ref3, remainingPoly, whichRootsAreWeFinding;
    h = 0;
    i = 0;
    save();
    p2 = pop();
    p1 = pop();
    h = tos;
    if (isfloating(p1)) {
      stop("floating point numbers in polynomial");
    }
    polycoeff = tos;
    push(p1);
    push(p2);
    factpoly_expo = coeff() - 1;
    rationalize_coefficients(h);
    whichRootsAreWeFinding = "real";
    remainingPoly = null;
    while (factpoly_expo > 0) {
      if (isZeroAtomOrTensor(stack[polycoeff + 0])) {
        push_integer(1);
        p4 = pop();
        push_integer(0);
        p5 = pop();
      } else {
        if (whichRootsAreWeFinding === "real") {
          foundRealRoot = get_factor_from_real_root();
        } else if (whichRootsAreWeFinding === "complex") {
          foundComplexRoot = get_factor_from_complex_root(remainingPoly);
        }
      }
      if (whichRootsAreWeFinding === "real") {
        if (foundRealRoot === 0) {
          whichRootsAreWeFinding = "complex";
          continue;
        } else {
          push(p4);
          push(p2);
          multiply();
          push(p5);
          add();
          p8 = pop();
          if (DEBUG) {
            console.log("success\nFACTOR=" + p8);
          }

          /*
          if (isnegativeterm(p4))
            push(p8)
            negate()
            p8 = pop()
            push(p7)
            negate_noexpand()
            p7 = pop()
           */
          push(p7);
          push(p8);
          multiply_noexpand();
          p7 = pop();
          yydivpoly();
          while (factpoly_expo && isZeroAtomOrTensor(stack[polycoeff + factpoly_expo])) {
            factpoly_expo--;
          }
          push(zero);
          for (i = o = 0, ref = factpoly_expo; 0 <= ref ? o <= ref : o >= ref; i = 0 <= ref ? ++o : --o) {
            push(stack[polycoeff + i]);
            push(p2);
            push_integer(i);
            power();
            multiply();
            add();
          }
          remainingPoly = pop();
        }
      } else if (whichRootsAreWeFinding === "complex") {
        if (foundComplexRoot === 0) {
          break;
        } else {
          push(p4);
          push(p2);
          subtract();
          push(p4);
          conjugate();
          push(p2);
          subtract();
          multiply();
          p8 = pop();
          if (DEBUG) {
            console.log("success\nFACTOR=" + p8);
          }

          /*
          if (isnegativeterm(p4))
            push(p8)
            negate()
            p8 = pop()
            push(p7)
            negate_noexpand()
            p7 = pop()
           */
          push(p7);
          previousFactorisation = pop();
          push(p7);
          push(p8);
          multiply_noexpand();
          p7 = pop();
          if (remainingPoly == null) {
            push(zero);
            for (i = i1 = 0, ref1 = factpoly_expo; 0 <= ref1 ? i1 <= ref1 : i1 >= ref1; i = 0 <= ref1 ? ++i1 : --i1) {
              push(stack[polycoeff + i]);
              push(p2);
              push_integer(i);
              power();
              multiply();
              add();
            }
            remainingPoly = pop();
          }
          dividend = remainingPoly;
          push(dividend);
          push(p8);
          push(p2);
          divpoly();
          remainingPoly = pop();
          push(remainingPoly);
          push(p8);
          multiply();
          checkingTheDivision = pop();
          if (!equal(checkingTheDivision, dividend)) {
            if (DEBUG) {
              console.log("we found a polynomial based on complex root and its conj but it doesn't divide the poly, quitting");
            }
            if (DEBUG) {
              console.log("so just returning previousFactorisation times dividend: " + previousFactorisation + " * " + dividend);
            }
            push(previousFactorisation);
            push(dividend);
            prev_expanding = expanding;
            expanding = 0;
            yycondense();
            expanding = prev_expanding;
            multiply_noexpand();
            p7 = pop();
            stack[h] = p7;
            moveTos(h + 1);
            restore();
            return;
          }

          /*
          if compare_numbers(startingDegree, remainingDegree)
             * ok even if we found a complex root that
             * together with the conjugate generates a poly in Z,
             * that doesn't mean that the division would end up in Z.
             * Example: 1+x^2+x^4+x^6 has +i and -i as one of its roots
             * so a factor is 1+x^2 ( = (x+i)*(x-i))
             * BUT
           */
          for (i = j1 = 0, ref2 = factpoly_expo; 0 <= ref2 ? j1 <= ref2 : j1 >= ref2; i = 0 <= ref2 ? ++j1 : --j1) {
            pop();
          }
          push(remainingPoly);
          push(p2);
          coeff();
          factpoly_expo -= 2;
        }
      }
    }
    push(zero);
    for (i = l1 = 0, ref3 = factpoly_expo; 0 <= ref3 ? l1 <= ref3 : l1 >= ref3; i = 0 <= ref3 ? ++l1 : --l1) {
      push(stack[polycoeff + i]);
      push(p2);
      push_integer(i);
      power();
      multiply();
      add();
    }
    p1 = pop();
    if (DEBUG) {
      console.log("POLY=" + p1);
    }
    push(p1);
    prev_expanding = expanding;
    expanding = 0;
    yycondense();
    expanding = prev_expanding;
    p1 = pop();
    if (factpoly_expo > 0 && isnegativeterm(stack[polycoeff + factpoly_expo])) {
      push(p1);
      negate();
      p1 = pop();
      push(p7);
      negate_noexpand();
      p7 = pop();
    }
    push(p7);
    push(p1);
    multiply_noexpand();
    p7 = pop();
    if (DEBUG) {
      console.log("RESULT=" + p7);
    }
    stack[h] = p7;
    moveTos(h + 1);
    return restore();
  };

  rationalize_coefficients = function(h) {
    var i, i1, o, ref, ref1, ref2, ref3;
    i = 0;
    p7 = one;
    for (i = o = ref = h, ref1 = tos; ref <= ref1 ? o < ref1 : o > ref1; i = ref <= ref1 ? ++o : --o) {
      push(stack[i]);
      denominator();
      push(p7);
      lcm();
      p7 = pop();
    }
    for (i = i1 = ref2 = h, ref3 = tos; ref2 <= ref3 ? i1 < ref3 : i1 > ref3; i = ref2 <= ref3 ? ++i1 : --i1) {
      push(p7);
      push(stack[i]);
      multiply();
      stack[i] = pop();
    }
    push(p7);
    reciprocate();
    p7 = pop();
    if (DEBUG) {
      return console.log("rationalize_coefficients result");
    }
  };

  get_factor_from_real_root = function() {
    var a0, an, h, i, i1, j, j1, l1, m1, na0, nan, o, ref, ref1, ref2, ref3, ref4, rootsTries_i, rootsTries_j;
    i = 0;
    j = 0;
    h = 0;
    a0 = 0;
    an = 0;
    na0 = 0;
    nan = 0;
    if (DEBUG) {
      push(zero);
      for (i = o = 0, ref = factpoly_expo; 0 <= ref ? o <= ref : o >= ref; i = 0 <= ref ? ++o : --o) {
        push(stack[polycoeff + i]);
        push(p2);
        push_integer(i);
        power();
        multiply();
        add();
      }
      p1 = pop();
      console.log("POLY=" + p1);
    }
    h = tos;
    an = tos;
    push(stack[polycoeff + factpoly_expo]);
    divisors_onstack();
    nan = tos - an;
    a0 = tos;
    push(stack[polycoeff + 0]);
    divisors_onstack();
    na0 = tos - a0;
    if (DEBUG) {
      console.log("divisors of base term");
      for (i = i1 = 0, ref1 = na0; 0 <= ref1 ? i1 < ref1 : i1 > ref1; i = 0 <= ref1 ? ++i1 : --i1) {
        console.log(", " + stack[a0 + i]);
      }
      console.log("divisors of leading term");
      for (i = j1 = 0, ref2 = nan; 0 <= ref2 ? j1 < ref2 : j1 > ref2; i = 0 <= ref2 ? ++j1 : --j1) {
        console.log(", " + stack[an + i]);
      }
    }
    for (rootsTries_i = l1 = 0, ref3 = nan; 0 <= ref3 ? l1 < ref3 : l1 > ref3; rootsTries_i = 0 <= ref3 ? ++l1 : --l1) {
      for (rootsTries_j = m1 = 0, ref4 = na0; 0 <= ref4 ? m1 < ref4 : m1 > ref4; rootsTries_j = 0 <= ref4 ? ++m1 : --m1) {
        p4 = stack[an + rootsTries_i];
        p5 = stack[a0 + rootsTries_j];
        push(p5);
        push(p4);
        divide();
        negate();
        p3 = pop();
        Evalpoly();
        if (DEBUG) {
          console.log("try A=" + p4);
          console.log(", B=" + p5);
          console.log(", root " + p2);
          console.log("=-B/A=" + p3);
          console.log(", POLY(" + p3);
          console.log(")=" + p6);
        }
        if (isZeroAtomOrTensor(p6)) {
          moveTos(h);
          if (DEBUG) {
            console.log("get_factor_from_real_root returning 1");
          }
          return 1;
        }
        push(p5);
        negate();
        p5 = pop();
        push(p3);
        negate();
        p3 = pop();
        Evalpoly();
        if (DEBUG) {
          console.log("try A=" + p4);
          console.log(", B=" + p5);
          console.log(", root " + p2);
          console.log("=-B/A=" + p3);
          console.log(", POLY(" + p3);
          console.log(")=" + p6);
        }
        if (isZeroAtomOrTensor(p6)) {
          moveTos(h);
          if (DEBUG) {
            console.log("get_factor_from_real_root returning 1");
          }
          return 1;
        }
      }
    }
    moveTos(h);
    if (DEBUG) {
      console.log("get_factor_from_real_root returning 0");
    }
    return 0;
  };

  get_factor_from_complex_root = function(remainingPoly) {
    var a0, an, h, i, i1, j, na0, nan, o, rootsTries_i, rootsTries_j;
    i = 0;
    j = 0;
    h = 0;
    a0 = 0;
    an = 0;
    na0 = 0;
    nan = 0;
    if (factpoly_expo <= 2) {
      if (DEBUG) {
        console.log("no more factoring via complex roots to be found in polynomial of degree <= 2");
      }
      return 0;
    }
    p1 = remainingPoly;
    if (DEBUG) {
      console.log("complex root finding for POLY=" + p1);
    }
    h = tos;
    an = tos;
    push_integer(-1);
    push_rational(2, 3);
    power();
    rect();
    p4 = pop();
    if (DEBUG) {
      console.log("complex root finding: trying with " + p4);
    }
    push(p4);
    p3 = pop();
    push(p3);
    Evalpoly();
    if (DEBUG) {
      console.log("complex root finding result: " + p6);
    }
    if (isZeroAtomOrTensor(p6)) {
      moveTos(h);
      if (DEBUG) {
        console.log("get_factor_from_complex_root returning 1");
      }
      return 1;
    }
    push_integer(1);
    push_rational(2, 3);
    power();
    rect();
    p4 = pop();
    if (DEBUG) {
      console.log("complex root finding: trying with " + p4);
    }
    push(p4);
    p3 = pop();
    push(p3);
    Evalpoly();
    if (DEBUG) {
      console.log("complex root finding result: " + p6);
    }
    if (isZeroAtomOrTensor(p6)) {
      moveTos(h);
      if (DEBUG) {
        console.log("get_factor_from_complex_root returning 1");
      }
      return 1;
    }
    for (rootsTries_i = o = -10; o <= 10; rootsTries_i = ++o) {
      for (rootsTries_j = i1 = 1; i1 <= 5; rootsTries_j = ++i1) {
        push_integer(rootsTries_i);
        push_integer(rootsTries_j);
        push(imaginaryunit);
        multiply();
        add();
        rect();
        p4 = pop();
        push(p4);
        p3 = pop();
        push(p3);
        Evalpoly();
        if (isZeroAtomOrTensor(p6)) {
          moveTos(h);
          if (DEBUG) {
            console.log("found complex root: " + p6);
          }
          return 1;
        }
      }
    }
    moveTos(h);
    if (DEBUG) {
      console.log("get_factor_from_complex_root returning 0");
    }
    return 0;
  };

  yydivpoly = function() {
    var i, o, ref;
    i = 0;
    p6 = zero;
    for (i = o = ref = factpoly_expo; ref <= 0 ? o < 0 : o > 0; i = ref <= 0 ? ++o : --o) {
      push(stack[polycoeff + i]);
      stack[polycoeff + i] = p6;
      push(p4);
      divide();
      p6 = pop();
      push(stack[polycoeff + i - 1]);
      push(p6);
      push(p5);
      multiply();
      subtract();
      stack[polycoeff + i - 1] = pop();
    }
    stack[polycoeff + 0] = p6;
    if (DEBUG) {
      return console.log("yydivpoly Q:");
    }
  };

  Evalpoly = function() {
    var i, o, ref;
    i = 0;
    push(zero);
    for (i = o = ref = factpoly_expo; ref <= 0 ? o <= 0 : o >= 0; i = ref <= 0 ? ++o : --o) {
      push(p3);
      multiply();
      push(stack[polycoeff + i]);
      if (DEBUG) {
        console.log("Evalpoly top of stack:");
        console.log(print_list(stack[tos - i]));
      }
      add();
    }
    return p6 = pop();
  };

  factors = function(p) {
    var h;
    h = tos;
    if (car(p) === symbol(ADD)) {
      p = cdr(p);
      while (iscons(p)) {
        push_term_factors(car(p));
        p = cdr(p);
      }
    } else {
      push_term_factors(p);
    }
    return tos - h;
  };

  push_term_factors = function(p) {
    var results;
    if (car(p) === symbol(MULTIPLY)) {
      p = cdr(p);
      results = [];
      while (iscons(p)) {
        push(car(p));
        results.push(p = cdr(p));
      }
      return results;
    } else {
      return push(p);
    }
  };


  /*
  Remove terms that involve a given symbol or expression. For example...
  
    filter(x^2 + x + 1, x)    =>  1
  
    filter(x^2 + x + 1, x^2)  =>  x + 1
   */

  Eval_filter = function() {
    var results;
    p1 = cdr(p1);
    push(car(p1));
    Eval();
    p1 = cdr(p1);
    results = [];
    while (iscons(p1)) {
      push(car(p1));
      Eval();
      filter();
      results.push(p1 = cdr(p1));
    }
    return results;
  };


  /*
   For example...
  
    push(F)
    push(X)
    filter()
    F = pop()
   */

  filter = function() {
    save();
    p2 = pop();
    p1 = pop();
    filter_main();
    return restore();
  };

  filter_main = function() {
    if (car(p1) === symbol(ADD)) {
      return filter_sum();
    } else if (istensor(p1)) {
      return filter_tensor();
    } else if (Find(p1, p2)) {
      return push_integer(0);
    } else {
      return push(p1);
    }
  };

  filter_sum = function() {
    var results;
    push_integer(0);
    p1 = cdr(p1);
    results = [];
    while (iscons(p1)) {
      push(car(p1));
      push(p2);
      filter();
      add();
      results.push(p1 = cdr(p1));
    }
    return results;
  };

  filter_tensor = function() {
    var i, i1, n, o, ref, ref1;
    i = 0;
    n = 0;
    n = p1.tensor.nelem;
    p3 = alloc_tensor(n);
    p3.tensor.ndim = p1.tensor.ndim;
    for (i = o = 0, ref = p1.tensor.ndim; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      p3.tensor.dim[i] = p1.tensor.dim[i];
    }
    for (i = i1 = 0, ref1 = n; 0 <= ref1 ? i1 < ref1 : i1 > ref1; i = 0 <= ref1 ? ++i1 : --i1) {
      push(p1.tensor.elem[i]);
      push(p2);
      filter();
      p3.tensor.elem[i] = pop();
    }
    return push(p3);
  };

  Eval_float = function() {
    evaluatingAsFloats++;
    push(cadr(p1));
    Eval();
    yyfloat();
    Eval();
    return evaluatingAsFloats--;
  };

  checkFloatHasWorkedOutCompletely = function(nodeToCheck) {
    var numberOfEs, numberOfMults, numberOfPIs, numberOfPowers, numberOfSums;
    numberOfPowers = countOccurrencesOfSymbol(symbol(POWER), nodeToCheck);
    numberOfPIs = countOccurrencesOfSymbol(symbol(PI), nodeToCheck);
    numberOfEs = countOccurrencesOfSymbol(symbol(E), nodeToCheck);
    numberOfMults = countOccurrencesOfSymbol(symbol(MULTIPLY), nodeToCheck);
    numberOfSums = countOccurrencesOfSymbol(symbol(ADD), nodeToCheck);
    if (DEBUG) {
      console.log("     ... numberOfPowers: " + numberOfPowers);
      console.log("     ... numberOfPIs: " + numberOfPIs);
      console.log("     ... numberOfEs: " + numberOfEs);
      console.log("     ... numberOfMults: " + numberOfMults);
      console.log("     ... numberOfSums: " + numberOfSums);
    }
    if (numberOfPowers > 1 || numberOfPIs > 0 || numberOfEs > 0 || numberOfMults > 1 || numberOfSums > 1) {
      return stop("float: some unevalued parts in " + nodeToCheck);
    }
  };

  zzfloat = function() {
    save();
    evaluatingAsFloats++;
    Eval();
    yyfloat();
    Eval();
    evaluatingAsFloats--;
    return restore();
  };

  yyfloat = function() {
    var h, i, o, ref;
    i = 0;
    h = 0;
    evaluatingAsFloats++;
    save();
    p1 = pop();
    if (iscons(p1)) {
      h = tos;
      while (iscons(p1)) {
        push(car(p1));
        yyfloat();
        p1 = cdr(p1);
      }
      list(tos - h);
    } else if (p1.k === TENSOR) {
      push(p1);
      copy_tensor();
      p1 = pop();
      for (i = o = 0, ref = p1.tensor.nelem; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
        push(p1.tensor.elem[i]);
        yyfloat();
        p1.tensor.elem[i] = pop();
      }
      push(p1);
    } else if (p1.k === NUM) {
      push(p1);
      bignum_float();
    } else if (p1 === symbol(PI)) {
      push_double(Math.PI);
    } else if (p1 === symbol(E)) {
      push_double(Math.E);
    } else {
      push(p1);
    }
    restore();
    return evaluatingAsFloats--;
  };

  Eval_floor = function() {
    push(cadr(p1));
    Eval();
    return yfloor();
  };

  yfloor = function() {
    save();
    yyfloor();
    return restore();
  };

  yyfloor = function() {
    var d;
    d = 0.0;
    p1 = pop();
    if (!isNumericAtom(p1)) {
      push_symbol(FLOOR);
      push(p1);
      list(2);
      return;
    }
    if (isdouble(p1)) {
      d = Math.floor(p1.d);
      push_double(d);
      return;
    }
    if (isinteger(p1)) {
      push(p1);
      return;
    }
    p3 = new U();
    p3.k = NUM;
    p3.q.a = mdiv(p1.q.a, p1.q.b);
    p3.q.b = mint(1);
    push(p3);
    if (isnegativenumber(p1)) {
      push_integer(-1);
      return add();
    }
  };


  /*
  x=0
  y=2
  for(do(x=sqrt(2+x),y=2*y/x),k,1,9)
  float(y)
  
  X: k
  B: 1...9
  
  1st parameter is the body
  2nd parameter is the variable to loop with
  3rd and 4th are the limits
   */

  Eval_for = function() {
    var i, j, k, loopingVariable, o, ref, ref1;
    i = 0;
    j = 0;
    k = 0;
    loopingVariable = caddr(p1);
    if (!issymbol(loopingVariable)) {
      stop("for: 2nd arg should be the variable to loop over");
    }
    push(cadddr(p1));
    Eval();
    j = pop_integer();
    if (isNaN(j)) {
      push(p1);
      return;
    }
    push(caddddr(p1));
    Eval();
    k = pop_integer();
    if (isNaN(k)) {
      push(p1);
      return;
    }
    p4 = get_binding(loopingVariable);
    for (i = o = ref = j, ref1 = k; ref <= ref1 ? o <= ref1 : o >= ref1; i = ref <= ref1 ? ++o : --o) {
      push_integer(i);
      p5 = pop();
      set_binding(loopingVariable, p5);
      push(cadr(p1));
      Eval();
      pop();
    }
    set_binding(loopingVariable, p4);
    return push_symbol(NIL);
  };

  Eval_gamma = function() {
    push(cadr(p1));
    Eval();
    return gamma();
  };

  gamma = function() {
    save();
    gammaf();
    return restore();
  };

  gammaf = function() {
    p1 = pop();
    if (isrational(p1) && MEQUAL(p1.q.a, 1) && MEQUAL(p1.q.b, 2)) {
      if (evaluatingAsFloats) {
        push_double(Math.PI);
      } else {
        push_symbol(PI);
      }
      push_rational(1, 2);
      power();
      return;
    }
    if (isrational(p1) && MEQUAL(p1.q.a, 3) && MEQUAL(p1.q.b, 2)) {
      if (evaluatingAsFloats) {
        push_double(Math.PI);
      } else {
        push_symbol(PI);
      }
      push_rational(1, 2);
      power();
      push_rational(1, 2);
      multiply();
      return;
    }
    if (isnegativeterm(p1)) {
      if (evaluatingAsFloats) {
        push_double(Math.PI);
      } else {
        push_symbol(PI);
      }
      push_integer(-1);
      multiply();
      if (evaluatingAsFloats) {
        push_double(Math.PI);
      } else {
        push_symbol(PI);
      }
      push(p1);
      multiply();
      sine();
      push(p1);
      multiply();
      push(p1);
      negate();
      gamma();
      multiply();
      divide();
      return;
    }
    if (car(p1) === symbol(ADD)) {
      gamma_of_sum();
      return;
    }
    push_symbol(GAMMA);
    push(p1);
    list(2);
  };

  gamma_of_sum = function() {
    p3 = cdr(p1);
    if (isrational(car(p3)) && MEQUAL(car(p3).q.a, 1) && MEQUAL(car(p3).q.b, 1)) {
      push(cadr(p3));
      push(cadr(p3));
      gamma();
      return multiply();
    } else {
      if (isrational(car(p3)) && MEQUAL(car(p3).q.a, -1) && MEQUAL(car(p3).q.b, 1)) {
        push(cadr(p3));
        gamma();
        push(cadr(p3));
        push_integer(-1);
        add();
        return divide();
      } else {
        push_symbol(GAMMA);
        push(p1);
        list(2);
      }
    }
  };

  Eval_gcd = function() {
    var results;
    p1 = cdr(p1);
    push(car(p1));
    Eval();
    p1 = cdr(p1);
    results = [];
    while (iscons(p1)) {
      push(car(p1));
      Eval();
      gcd();
      results.push(p1 = cdr(p1));
    }
    return results;
  };

  gcd = function() {
    var prev_expanding;
    prev_expanding = expanding;
    save();
    gcd_main();
    restore();
    return expanding = prev_expanding;
  };

  gcd_main = function() {
    var polyVar;
    expanding = 1;
    p2 = pop();
    p1 = pop();
    if (equal(p1, p2)) {
      push(p1);
      return;
    }
    if (isrational(p1) && isrational(p2)) {
      push(p1);
      push(p2);
      gcd_numbers();
      return;
    }
    if ((polyVar = areunivarpolysfactoredorexpandedform(p1, p2))) {
      gcd_polys(polyVar);
      return;
    }
    if (car(p1) === symbol(ADD) && car(p2) === symbol(ADD)) {
      gcd_sum_sum();
      return;
    }
    if (car(p1) === symbol(ADD)) {
      gcd_sum(p1);
      p1 = pop();
    }
    if (car(p2) === symbol(ADD)) {
      gcd_sum(p2);
      p2 = pop();
    }
    if (car(p1) === symbol(MULTIPLY)) {
      gcd_sum_product();
      return;
    }
    if (car(p2) === symbol(MULTIPLY)) {
      gcd_product_sum();
      return;
    }
    if (car(p1) === symbol(MULTIPLY) && car(p2) === symbol(MULTIPLY)) {
      gcd_product_product();
      return;
    }
    return gcd_powers_with_same_base();
  };

  areunivarpolysfactoredorexpandedform = function(p1, p2) {
    var polyVar;
    if (polyVar = isunivarpolyfactoredorexpandedform(p1)) {
      if (isunivarpolyfactoredorexpandedform(p2, polyVar)) {
        return polyVar;
      }
    }
    return false;
  };

  gcd_polys = function(polyVar) {
    push(p1);
    push(polyVar);
    factorpoly();
    p1 = pop();
    push(p2);
    push(polyVar);
    factorpoly();
    p2 = pop();
    if (DEBUG) {
      console.log("factored polys:");
    }
    if (DEBUG) {
      console.log("p1:" + p1.toString());
    }
    if (DEBUG) {
      console.log("p2:" + p2.toString());
    }
    if (car(p1) === symbol(MULTIPLY) || car(p2) === symbol(MULTIPLY)) {
      if (car(p1) !== symbol(MULTIPLY)) {
        push_symbol(MULTIPLY);
        push(p1);
        push(one);
        list(3);
        p1 = pop();
      }
      if (car(p2) !== symbol(MULTIPLY)) {
        push_symbol(MULTIPLY);
        push(p2);
        push(one);
        list(3);
        p2 = pop();
      }
    }
    if (car(p1) === symbol(MULTIPLY) && car(p2) === symbol(MULTIPLY)) {
      gcd_product_product();
      return;
    }
    gcd_powers_with_same_base();
    return true;
  };

  gcd_product_product = function() {
    var results;
    push(one);
    p3 = cdr(p1);
    results = [];
    while (iscons(p3)) {
      p4 = cdr(p2);
      while (iscons(p4)) {
        push(car(p3));
        push(car(p4));
        gcd();
        multiply();
        p4 = cdr(p4);
      }
      results.push(p3 = cdr(p3));
    }
    return results;
  };

  gcd_powers_with_same_base = function() {
    if (car(p1) === symbol(POWER)) {
      p3 = caddr(p1);
      p1 = cadr(p1);
    } else {
      p3 = one;
    }
    if (car(p2) === symbol(POWER)) {
      p4 = caddr(p2);
      p2 = cadr(p2);
    } else {
      p4 = one;
    }
    if (!equal(p1, p2)) {
      push(one);
      return;
    }
    if (isNumericAtom(p3) && isNumericAtom(p4)) {
      push(p1);
      if (lessp(p3, p4)) {
        push(p3);
      } else {
        push(p4);
      }
      power();
      return;
    }
    push(p3);
    push(p4);
    divide();
    p5 = pop();
    if (isNumericAtom(p5)) {
      push(p1);
      if (car(p3) === symbol(MULTIPLY) && isNumericAtom(cadr(p3))) {
        p5 = cadr(p3);
      } else {
        p5 = one;
      }
      if (car(p4) === symbol(MULTIPLY) && isNumericAtom(cadr(p4))) {
        p6 = cadr(p4);
      } else {
        p6 = one;
      }
      if (lessp(p5, p6)) {
        push(p3);
      } else {
        push(p4);
      }
      power();
      return;
    }
    push(p3);
    push(p4);
    subtract();
    p5 = pop();
    if (!isNumericAtom(p5)) {
      push(one);
      return;
    }
    push(p1);
    if (isnegativenumber(p5)) {
      push(p3);
    } else {
      push(p4);
    }
    return power();
  };

  gcd_sum_sum = function() {
    if (length(p1) !== length(p2)) {
      push(one);
      return;
    }
    p3 = cdr(p1);
    push(car(p3));
    p3 = cdr(p3);
    while (iscons(p3)) {
      push(car(p3));
      gcd();
      p3 = cdr(p3);
    }
    p3 = pop();
    p4 = cdr(p2);
    push(car(p4));
    p4 = cdr(p4);
    while (iscons(p4)) {
      push(car(p4));
      gcd();
      p4 = cdr(p4);
    }
    p4 = pop();
    push(p1);
    push(p3);
    divide();
    p5 = pop();
    push(p2);
    push(p4);
    divide();
    p6 = pop();
    if (equal(p5, p6)) {
      push(p5);
      push(p3);
      push(p4);
      gcd();
      return multiply();
    } else {
      return push(one);
    }
  };

  gcd_sum = function(p) {
    var results;
    p = cdr(p);
    push(car(p));
    p = cdr(p);
    results = [];
    while (iscons(p)) {
      push(car(p));
      gcd();
      results.push(p = cdr(p));
    }
    return results;
  };

  gcd_sum_product = function() {
    var results;
    push(one);
    p3 = cdr(p1);
    results = [];
    while (iscons(p3)) {
      push(car(p3));
      push(p2);
      gcd();
      multiply();
      results.push(p3 = cdr(p3));
    }
    return results;
  };

  gcd_product_sum = function() {
    var results;
    push(one);
    p4 = cdr(p2);
    results = [];
    while (iscons(p4)) {
      push(p1);
      push(car(p4));
      gcd();
      multiply();
      results.push(p4 = cdr(p4));
    }
    return results;
  };

  guess = function() {
    var p;
    p = pop();
    push(p);
    if (Find(p, symbol(SYMBOL_X))) {
      return push_symbol(SYMBOL_X);
    } else if (Find(p, symbol(SYMBOL_Y))) {
      return push_symbol(SYMBOL_Y);
    } else if (Find(p, symbol(SYMBOL_Z))) {
      return push_symbol(SYMBOL_Z);
    } else if (Find(p, symbol(SYMBOL_T))) {
      return push_symbol(SYMBOL_T);
    } else if (Find(p, symbol(SYMBOL_S))) {
      return push_symbol(SYMBOL_S);
    } else {
      return push_symbol(SYMBOL_X);
    }
  };

  hermite = function() {
    save();
    yyhermite();
    return restore();
  };

  yyhermite = function() {
    var n;
    n = 0;
    p2 = pop();
    p1 = pop();
    push(p2);
    n = pop_integer();
    if (n < 0 || isNaN(n)) {
      push_symbol(HERMITE);
      push(p1);
      push(p2);
      list(3);
      return;
    }
    if (issymbol(p1)) {
      return yyhermite2(n);
    } else {
      p3 = p1;
      p1 = symbol(SECRETX);
      yyhermite2(n);
      p1 = p3;
      push(symbol(SECRETX));
      push(p1);
      subst();
      return Eval();
    }
  };

  yyhermite2 = function(n) {
    var i, o, ref, results;
    i = 0;
    push_integer(1);
    push_integer(0);
    p4 = pop();
    results = [];
    for (i = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      p5 = p4;
      p4 = pop();
      push(p1);
      push(p4);
      multiply();
      push_integer(i);
      push(p5);
      multiply();
      subtract();
      push_integer(2);
      results.push(multiply());
    }
    return results;
  };

  hilbert = function() {
    var i, i1, j, n, o, ref, ref1;
    i = 0;
    j = 0;
    n = 0;
    save();
    p2 = pop();
    push(p2);
    n = pop_integer();
    if (n < 2) {
      push_symbol(HILBERT);
      push(p2);
      list(2);
      restore();
      return;
    }
    push_zero_matrix(n, n);
    p1 = pop();
    for (i = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      for (j = i1 = 0, ref1 = n; 0 <= ref1 ? i1 < ref1 : i1 > ref1; j = 0 <= ref1 ? ++i1 : --i1) {
        push_integer(i + j + 1);
        inverse();
        p1.tensor.elem[i * n + j] = pop();
      }
    }
    push(p1);
    return restore();
  };


  /*
   Returns the coefficient of the imaginary part of complex z
  
    z    imag(z)
    -    -------
  
    a + i b    b
  
    exp(i a)  sin(a)
   */

  DEBUG_IMAG = false;

  Eval_imag = function() {
    push(cadr(p1));
    Eval();
    return imag();
  };

  imag = function() {
    save();
    rect();
    p1 = pop();
    if (DEBUG_IMAG) {
      console.log("IMAGE of " + p1);
    }
    push(p1);
    push(p1);
    conjugate();
    if (DEBUG_IMAG) {
      console.log(" image: conjugate result: " + stack[tos - 1]);
    }
    subtract();
    push_integer(2);
    divide();
    if (DEBUG_IMAG) {
      console.log(" image: 1st divide result: " + stack[tos - 1]);
    }
    push(imaginaryunit);
    divide();
    if (DEBUG_IMAG) {
      console.log(" image: 2nd divide result: " + stack[tos - 1]);
    }
    return restore();
  };

  index_function = function(n) {
    var i, i1, j1, k, l1, m, m1, ndim, nelem, o, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, s, t;
    i = 0;
    k = 0;
    m = 0;
    ndim = 0;
    nelem = 0;
    t = 0;
    save();
    s = tos - n;
    p1 = stack[s];
    ndim = p1.tensor.ndim;
    m = n - 1;
    if (m > ndim) {
      stop("too many indices for tensor");
    }
    k = 0;
    for (i = o = 0, ref = m; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      push(stack[s + i + 1]);
      t = pop_integer();
      if (t < 1 || t > p1.tensor.dim[i]) {
        stop("index out of range");
      }
      k = k * p1.tensor.dim[i] + t - 1;
    }
    if (ndim === m) {
      moveTos(tos - n);
      push(p1.tensor.elem[k]);
      restore();
      return;
    }
    for (i = i1 = ref1 = m, ref2 = ndim; ref1 <= ref2 ? i1 < ref2 : i1 > ref2; i = ref1 <= ref2 ? ++i1 : --i1) {
      k = k * p1.tensor.dim[i] + 0;
    }
    nelem = 1;
    for (i = j1 = ref3 = m, ref4 = ndim; ref3 <= ref4 ? j1 < ref4 : j1 > ref4; i = ref3 <= ref4 ? ++j1 : --j1) {
      nelem *= p1.tensor.dim[i];
    }
    p2 = alloc_tensor(nelem);
    p2.tensor.ndim = ndim - m;
    for (i = l1 = ref5 = m, ref6 = ndim; ref5 <= ref6 ? l1 < ref6 : l1 > ref6; i = ref5 <= ref6 ? ++l1 : --l1) {
      p2.tensor.dim[i - m] = p1.tensor.dim[i];
    }
    for (i = m1 = 0, ref7 = nelem; 0 <= ref7 ? m1 < ref7 : m1 > ref7; i = 0 <= ref7 ? ++m1 : --m1) {
      p2.tensor.elem[i] = p1.tensor.elem[k + i];
    }
    check_tensor_dimensions(p1);
    check_tensor_dimensions(p2);
    moveTos(tos - n);
    push(p2);
    return restore();
  };

  set_component = function(n) {
    var i, i1, j1, k, l1, m, m1, n1, ndim, o, ref, ref1, ref2, ref3, ref4, ref5, ref6, s, t;
    i = 0;
    k = 0;
    m = 0;
    ndim = 0;
    t = 0;
    save();
    if (n < 3) {
      stop("error in indexed assign");
    }
    s = tos - n;
    p2 = stack[s];
    p1 = stack[s + 1];
    if (!istensor(p1)) {
      stop("error in indexed assign: assigning to something that is not a tensor");
    }
    ndim = p1.tensor.ndim;
    m = n - 2;
    if (m > ndim) {
      stop("error in indexed assign");
    }
    k = 0;
    for (i = o = 0, ref = m; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      push(stack[s + i + 2]);
      t = pop_integer();
      if (t < 1 || t > p1.tensor.dim[i]) {
        stop("error in indexed assign\n");
      }
      k = k * p1.tensor.dim[i] + t - 1;
    }
    for (i = i1 = ref1 = m, ref2 = ndim; ref1 <= ref2 ? i1 < ref2 : i1 > ref2; i = ref1 <= ref2 ? ++i1 : --i1) {
      k = k * p1.tensor.dim[i] + 0;
    }
    p3 = alloc_tensor(p1.tensor.nelem);
    p3.tensor.ndim = p1.tensor.ndim;
    for (i = j1 = 0, ref3 = p1.tensor.ndim; 0 <= ref3 ? j1 < ref3 : j1 > ref3; i = 0 <= ref3 ? ++j1 : --j1) {
      p3.tensor.dim[i] = p1.tensor.dim[i];
    }
    for (i = l1 = 0, ref4 = p1.tensor.nelem; 0 <= ref4 ? l1 < ref4 : l1 > ref4; i = 0 <= ref4 ? ++l1 : --l1) {
      p3.tensor.elem[i] = p1.tensor.elem[i];
    }
    check_tensor_dimensions(p1);
    check_tensor_dimensions(p3);
    p1 = p3;
    if (ndim === m) {
      if (istensor(p2)) {
        stop("error in indexed assign");
      }
      p1.tensor.elem[k] = p2;
      check_tensor_dimensions(p1);
      moveTos(tos - n);
      push(p1);
      restore();
      return;
    }
    if (!istensor(p2)) {
      stop("error in indexed assign");
    }
    if (ndim - m !== p2.tensor.ndim) {
      stop("error in indexed assign");
    }
    for (i = m1 = 0, ref5 = p2.tensor.ndim; 0 <= ref5 ? m1 < ref5 : m1 > ref5; i = 0 <= ref5 ? ++m1 : --m1) {
      if (p1.tensor.dim[m + i] !== p2.tensor.dim[i]) {
        stop("error in indexed assign");
      }
    }
    for (i = n1 = 0, ref6 = p2.tensor.nelem; 0 <= ref6 ? n1 < ref6 : n1 > ref6; i = 0 <= ref6 ? ++n1 : --n1) {
      p1.tensor.elem[k + i] = p2.tensor.elem[i];
    }
    check_tensor_dimensions(p1);
    check_tensor_dimensions(p2);
    moveTos(tos - n);
    push(p1);
    return restore();
  };


  /* dot =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  a,b,...
  
  General description
  -------------------
  
  The inner (or dot) operator gives products of vectors,
  matrices, and tensors.
  
  Note that for Algebrite, the elements of a vector/matrix
  can only be scalars. This allows for example to flesh out
  matrix multiplication using the usual multiplication.
  So for example block-representations are not allowed.
  
  There is an aweful lot of confusion between sw packages on
  what dot and inner do.
  
  First off, the "dot" operator is different from the
  mathematical notion of dot product, which can be
  slightly confusing.
  
  The mathematical notion of dot product is here:
    http://mathworld.wolfram.com/DotProduct.html
  
  However, "dot" does that and a bunch of other things,
  i.e. in Algebrite
  dot/inner does what the dot of Mathematica does, i.e.:
  
  scalar product of vectors:
  
    inner((a, b, c), (x, y, z))
    > a x + b y + c z
  
  products of matrices and vectors:
  
    inner(((a, b), (c,d)), (x, y))
    > (a x + b y,c x + d y)
  
    inner((x, y), ((a, b), (c,d)))
    > (a x + c y,b x + d y)
  
    inner((x, y), ((a, b), (c,d)), (r, s))
    > a r x + b s x + c r y + d s y
  
  matrix product:
  
    inner(((a,b),(c,d)),((r,s),(t,u)))
    > ((a r + b t,a s + b u),(c r + d t,c s + d u))
  
  the "dot/inner" operator is associative and
  distributive but not commutative.
  
  In Mathematica, Inner is a generalisation of Dot where
  the user can specify the multiplication and the addition
  operators.
  But here in Algebrite they do the same thing.
  
   https://reference.wolfram.com/language/ref/Dot.html
   https://reference.wolfram.com/language/ref/Inner.html
  
   http://uk.mathworks.com/help/matlab/ref/dot.html
   http://uk.mathworks.com/help/matlab/ref/mtimes.html
   */

  Eval_inner = function() {
    var difference, i, i1, j1, l1, moretheArguments, o, operands, ref, ref1, ref2, ref3, refinedOperands, results, secondArgument, shift, theArguments;
    theArguments = [];
    theArguments.push(car(cdr(p1)));
    secondArgument = car(cdr(cdr(p1)));
    if (secondArgument === symbol(NIL)) {
      stop("pattern needs at least a template and a transformed version");
    }
    moretheArguments = cdr(cdr(p1));
    while (moretheArguments !== symbol(NIL)) {
      theArguments.push(car(moretheArguments));
      moretheArguments = cdr(moretheArguments);
    }
    if (theArguments.length > 2) {
      push_symbol(INNER);
      push(theArguments[theArguments.length - 2]);
      push(theArguments[theArguments.length - 1]);
      list(3);
      for (i = o = 2, ref = theArguments.length; 2 <= ref ? o < ref : o > ref; i = 2 <= ref ? ++o : --o) {
        push_symbol(INNER);
        swap();
        push(theArguments[theArguments.length - i - 1]);
        swap();
        list(3);
      }
      p1 = pop();
      Eval_inner();
      return;
    }
    operands = [];
    get_innerprod_factors(p1, operands);
    refinedOperands = [];
    for (i = i1 = 0, ref1 = operands.length; 0 <= ref1 ? i1 < ref1 : i1 > ref1; i = 0 <= ref1 ? ++i1 : --i1) {
      if (operands[i] === symbol(SYMBOL_IDENTITY_MATRIX)) {
        continue;
      } else {
        refinedOperands.push(operands[i]);
      }
    }
    operands = refinedOperands;
    refinedOperands = [];
    if (operands.length > 1) {
      shift = 0;
      for (i = j1 = 0, ref2 = operands.length; 0 <= ref2 ? j1 < ref2 : j1 > ref2; i = 0 <= ref2 ? ++j1 : --j1) {
        if ((i + shift + 1) <= (operands.length - 1)) {
          if (!(isNumericAtomOrTensor(operands[i + shift]) || isNumericAtomOrTensor(operands[i + shift + 1]))) {
            push(operands[i + shift]);
            Eval();
            inv();
            push(operands[i + shift + 1]);
            Eval();
            subtract();
            difference = pop();
            if (isZeroAtomOrTensor(difference)) {
              shift += 1;
            } else {
              refinedOperands.push(operands[i + shift]);
            }
          } else {
            refinedOperands.push(operands[i + shift]);
          }
        } else {
          break;
        }
        if (i + shift === operands.length - 2) {
          refinedOperands.push(operands[operands.length - 1]);
        }
        if (i + shift >= operands.length - 1) {
          break;
        }
      }
      operands = refinedOperands;
    }
    push(symbol(INNER));
    if (operands.length > 0) {
      for (i = l1 = 0, ref3 = operands.length; 0 <= ref3 ? l1 < ref3 : l1 > ref3; i = 0 <= ref3 ? ++l1 : --l1) {
        push(operands[i]);
      }
    } else {
      pop();
      push(symbol(SYMBOL_IDENTITY_MATRIX));
      return;
    }
    list(operands.length + 1);
    p1 = pop();
    p1 = cdr(p1);
    push(car(p1));
    Eval();
    p1 = cdr(p1);
    results = [];
    while (iscons(p1)) {
      push(car(p1));
      Eval();
      inner();
      results.push(p1 = cdr(p1));
    }
    return results;
  };

  inner = function() {
    var arg1, arg2, arg3, subtractionResult;
    save();
    p2 = pop();
    p1 = pop();
    if (isnegativeterm(p2) && isnegativeterm(p1)) {
      push(p2);
      negate();
      p2 = pop();
      push(p1);
      negate();
      p1 = pop();
    }
    if (isinnerordot(p1)) {
      arg1 = car(cdr(p1));
      arg2 = car(cdr(cdr(p1)));
      arg3 = p2;
      p1 = arg1;
      push(arg2);
      push(arg3);
      inner();
      p2 = pop();
    }
    if (p1 === symbol(SYMBOL_IDENTITY_MATRIX)) {
      push(p2);
      restore();
      return;
    } else if (p2 === symbol(SYMBOL_IDENTITY_MATRIX)) {
      push(p1);
      restore();
      return;
    }
    if (istensor(p1) && istensor(p2)) {
      inner_f();
    } else {
      if (!(isNumericAtomOrTensor(p1) || isNumericAtomOrTensor(p2))) {
        push(p1);
        push(p2);
        inv();
        subtract();
        subtractionResult = pop();
        if (isZeroAtomOrTensor(subtractionResult)) {
          push_symbol(SYMBOL_IDENTITY_MATRIX);
          restore();
          return;
        }
      }
      if (expanding && isadd(p1)) {
        p1 = cdr(p1);
        push(zero);
        while (iscons(p1)) {
          push(car(p1));
          push(p2);
          inner();
          add();
          p1 = cdr(p1);
        }
        restore();
        return;
      }
      if (expanding && isadd(p2)) {
        p2 = cdr(p2);
        push(zero);
        while (iscons(p2)) {
          push(p1);
          push(car(p2));
          inner();
          add();
          p2 = cdr(p2);
        }
        restore();
        return;
      }
      push(p1);
      push(p2);
      if (istensor(p1) && isNumericAtom(p2)) {
        tensor_times_scalar();
      } else if (isNumericAtom(p1) && istensor(p2)) {
        scalar_times_tensor();
      } else {
        if (isNumericAtom(p1) || isNumericAtom(p2)) {
          multiply();
        } else {
          pop();
          pop();
          push_symbol(INNER);
          push(p1);
          push(p2);
          list(3);
          restore();
          return;
        }
      }
    }
    return restore();
  };

  inner_f = function() {
    var a, ak, b, bk, c, i, i1, j, j1, k, l1, m1, n, n1, ndim, o, o1, ref, ref1, ref2, ref3, ref4, ref5, ref6;
    i = 0;
    n = p1.tensor.dim[p1.tensor.ndim - 1];
    if (n !== p2.tensor.dim[0]) {
      debugger;
      stop("inner: tensor dimension check");
    }
    ndim = p1.tensor.ndim + p2.tensor.ndim - 2;
    if (ndim > MAXDIM) {
      stop("inner: rank of result exceeds maximum");
    }
    a = p1.tensor.elem;
    b = p2.tensor.elem;
    ak = 1;
    for (i = o = 0, ref = p1.tensor.ndim - 1; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      ak *= p1.tensor.dim[i];
    }
    bk = 1;
    for (i = i1 = 1, ref1 = p2.tensor.ndim; 1 <= ref1 ? i1 < ref1 : i1 > ref1; i = 1 <= ref1 ? ++i1 : --i1) {
      bk *= p2.tensor.dim[i];
    }
    p3 = alloc_tensor(ak * bk);
    c = p3.tensor.elem;
    for (i = j1 = 0, ref2 = ak; 0 <= ref2 ? j1 < ref2 : j1 > ref2; i = 0 <= ref2 ? ++j1 : --j1) {
      for (j = l1 = 0, ref3 = n; 0 <= ref3 ? l1 < ref3 : l1 > ref3; j = 0 <= ref3 ? ++l1 : --l1) {
        if (isZeroAtomOrTensor(a[i * n + j])) {
          continue;
        }
        for (k = m1 = 0, ref4 = bk; 0 <= ref4 ? m1 < ref4 : m1 > ref4; k = 0 <= ref4 ? ++m1 : --m1) {
          push(a[i * n + j]);
          push(b[j * bk + k]);
          multiply();
          push(c[i * bk + k]);
          add();
          c[i * bk + k] = pop();
        }
      }
    }
    if (ndim === 0) {
      return push(p3.tensor.elem[0]);
    } else {
      p3.tensor.ndim = ndim;
      j = 0;
      for (i = n1 = 0, ref5 = p1.tensor.ndim - 1; 0 <= ref5 ? n1 < ref5 : n1 > ref5; i = 0 <= ref5 ? ++n1 : --n1) {
        p3.tensor.dim[i] = p1.tensor.dim[i];
      }
      j = p1.tensor.ndim - 1;
      for (i = o1 = 0, ref6 = p2.tensor.ndim - 1; 0 <= ref6 ? o1 < ref6 : o1 > ref6; i = 0 <= ref6 ? ++o1 : --o1) {
        p3.tensor.dim[j + i] = p2.tensor.dim[i + 1];
      }
      return push(p3);
    }
  };

  get_innerprod_factors = function(tree, factors_accumulator) {
    if (!iscons(tree)) {
      add_factor_to_accumulator(tree, factors_accumulator);
      return;
    }
    if (cdr(tree) === symbol(NIL)) {
      tree = get_innerprod_factors(car(tree), factors_accumulator);
      return;
    }
    if (isinnerordot(tree)) {
      get_innerprod_factors(car(cdr(tree)), factors_accumulator);
      get_innerprod_factors(cdr(cdr(tree)), factors_accumulator);
      return;
    }
    return add_factor_to_accumulator(tree, factors_accumulator);
  };

  add_factor_to_accumulator = function(tree, factors_accumulator) {
    if (tree !== symbol(NIL)) {
      return factors_accumulator.push(tree);
    }
  };


  /*
   Table of integrals
  
  The symbol f is just a dummy symbol for creating a list f(A,B,C,C,...) where
  
    A  is the template expression
  
    B  is the result expression
  
    C  is an optional list of conditional expressions
   */

  itab = ["f(a,a*x)", "f(1/x,log(x))", "f(x^a,x^(a+1)/(a+1))", "f(x^(-2),-x^(-1))", "f(x^(-1/2),2*x^(1/2))", "f(x^(1/2),2/3*x^(3/2))", "f(x,x^2/2)", "f(x^2,x^3/3)", "f(exp(a*x),1/a*exp(a*x))", "f(exp(a*x+b),1/a*exp(a*x+b))", "f(x*exp(a*x^2),exp(a*x^2)/(2*a))", "f(x*exp(a*x^2+b),exp(a*x^2+b)/(2*a))", "f(log(a*x),x*log(a*x)-x)", "f(a^x,a^x/log(a),or(not(number(a)),a>0))", "f(1/(a+x^2),1/sqrt(a)*arctan(x/sqrt(a)),or(not(number(a)),a>0))", "f(1/(a-x^2),1/sqrt(a)*arctanh(x/sqrt(a)))", "f(1/sqrt(a-x^2),arcsin(x/(sqrt(a))))", "f(1/sqrt(a+x^2),log(x+sqrt(a+x^2)))", "f(1/(a+b*x),1/b*log(a+b*x))", "f(1/(a+b*x)^2,-1/(b*(a+b*x)))", "f(1/(a+b*x)^3,-1/(2*b)*1/(a+b*x)^2)", "f(x/(a+b*x),x/b-a*log(a+b*x)/b/b)", "f(x/(a+b*x)^2,1/b^2*(log(a+b*x)+a/(a+b*x)))", "f(x^2/(a+b*x),1/b^2*(1/2*(a+b*x)^2-2*a*(a+b*x)+a^2*log(a+b*x)))", "f(x^2/(a+b*x)^2,1/b^3*(a+b*x-2*a*log(a+b*x)-a^2/(a+b*x)))", "f(x^2/(a+b*x)^3,1/b^3*(log(a+b*x)+2*a/(a+b*x)-1/2*a^2/(a+b*x)^2))", "f(1/x*1/(a+b*x),-1/a*log((a+b*x)/x))", "f(1/x*1/(a+b*x)^2,1/a*1/(a+b*x)-1/a^2*log((a+b*x)/x))", "f(1/x*1/(a+b*x)^3,1/a^3*(1/2*((2*a+b*x)/(a+b*x))^2+log(x/(a+b*x))))", "f(1/x^2*1/(a+b*x),-1/(a*x)+b/a^2*log((a+b*x)/x))", "f(1/x^3*1/(a+b*x),(2*b*x-a)/(2*a^2*x^2)+b^2/a^3*log(x/(a+b*x)))", "f(1/x^2*1/(a+b*x)^2,-(a+2*b*x)/(a^2*x*(a+b*x))+2*b/a^3*log((a+b*x)/x))", "f(1/(a+b*x^2),1/sqrt(a*b)*arctan(x*sqrt(a*b)/a),or(not(number(a*b)),a*b>0))", "f(1/(a+b*x^2),1/(2*sqrt(-a*b))*log((a+x*sqrt(-a*b))/(a-x*sqrt(-a*b))),or(not(number(a*b)),a*b<0))", "f(x/(a+b*x^2),1/2*1/b*log(a+b*x^2))", "f(x^2/(a+b*x^2),x/b-a/b*integral(1/(a+b*x^2),x))", "f(1/(a+b*x^2)^2,x/(2*a*(a+b*x^2))+1/2*1/a*integral(1/(a+b*x^2),x))", "f(1/x*1/(a+b*x^2),1/2*1/a*log(x^2/(a+b*x^2)))", "f(1/x^2*1/(a+b*x^2),-1/(a*x)-b/a*integral(1/(a+b*x^2),x))", "f(1/(a+b*x^3),1/3*1/a*(a/b)^(1/3)*(1/2*log(((a/b)^(1/3)+x)^3/(a+b*x^3))+sqrt(3)*arctan((2*x-(a/b)^(1/3))*(a/b)^(-1/3)/sqrt(3))))", "f(x^2/(a+b*x^3),1/3*1/b*log(a+b*x^3))", "f(x/(a+b*x^4),1/2*sqrt(b/a)/b*arctan(x^2*sqrt(b/a)),or(not(number(a*b)),a*b>0))", "f(x/(a+b*x^4),1/4*sqrt(-b/a)/b*log((x^2-sqrt(-a/b))/(x^2+sqrt(-a/b))),or(not(number(a*b)),a*b<0))", "f(x^3/(a+b*x^4),1/4*1/b*log(a+b*x^4))", "f(sqrt(a+b*x),2/3*1/b*sqrt((a+b*x)^3))", "f(x*sqrt(a+b*x),-2*(2*a-3*b*x)*sqrt((a+b*x)^3)/15/b^2)", "f(x^2*sqrt(a+b*x),2*(8*a^2-12*a*b*x+15*b^2*x^2)*sqrt((a+b*x)^3)/105/b^3)", "f(sqrt(a+b*x)/x,2*sqrt(a+b*x)+a*integral(1/x*1/sqrt(a+b*x),x))", "f(sqrt(a+b*x)/x^2,-sqrt(a+b*x)/x+b/2*integral(1/x*1/sqrt(a+b*x),x))", "f(1/sqrt(a+b*x),2*sqrt(a+b*x)/b)", "f(x/sqrt(a+b*x),-2/3*(2*a-b*x)*sqrt(a+b*x)/b^2)", "f(x^2/sqrt(a+b*x),2/15*(8*a^2-4*a*b*x+3*b^2*x^2)*sqrt(a+b*x)/b^3)", "f(1/x*1/sqrt(a+b*x),1/sqrt(a)*log((sqrt(a+b*x)-sqrt(a))/(sqrt(a+b*x)+sqrt(a))),or(not(number(a)),a>0))", "f(1/x*1/sqrt(a+b*x),2/sqrt(-a)*arctan(sqrt(-(a+b*x)/a)),or(not(number(a)),a<0))", "f(1/x^2*1/sqrt(a+b*x),-sqrt(a+b*x)/a/x-1/2*b/a*integral(1/x*1/sqrt(a+b*x),x))", "f(sqrt(x^2+a),1/2*(x*sqrt(x^2+a)+a*log(x+sqrt(x^2+a))))", "f(1/sqrt(x^2+a),log(x+sqrt(x^2+a)))", "f(1/x*1/sqrt(x^2+a),arcsec(x/sqrt(-a))/sqrt(-a),or(not(number(a)),a<0))", "f(1/x*1/sqrt(x^2+a),-1/sqrt(a)*log((sqrt(a)+sqrt(x^2+a))/x),or(not(number(a)),a>0))", "f(sqrt(x^2+a)/x,sqrt(x^2+a)-sqrt(a)*log((sqrt(a)+sqrt(x^2+a))/x),or(not(number(a)),a>0))", "f(sqrt(x^2+a)/x,sqrt(x^2+a)-sqrt(-a)*arcsec(x/sqrt(-a)),or(not(number(a)),a<0))", "f(x/sqrt(x^2+a),sqrt(x^2+a))", "f(x*sqrt(x^2+a),1/3*sqrt((x^2+a)^3))", "f(sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),1/4*(x*sqrt((x^2+a^(1/3))^3)+3/2*a^(1/3)*x*sqrt(x^2+a^(1/3))+3/2*a^(2/3)*log(x+sqrt(x^2+a^(1/3)))))", "f(sqrt(-a+x^6-3*a^(1/3)*x^4+3*a^(2/3)*x^2),1/4*(x*sqrt((x^2-a^(1/3))^3)-3/2*a^(1/3)*x*sqrt(x^2-a^(1/3))+3/2*a^(2/3)*log(x+sqrt(x^2-a^(1/3)))))", "f(1/sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),x/a^(1/3)/sqrt(x^2+a^(1/3)))", "f(x/sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),-1/sqrt(x^2+a^(1/3)))", "f(x*sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),1/5*sqrt((x^2+a^(1/3))^5))", "f(x^2*sqrt(x^2+a),1/4*x*sqrt((x^2+a)^3)-1/8*a*x*sqrt(x^2+a)-1/8*a^2*log(x+sqrt(x^2+a)))", "f(x^3*sqrt(x^2+a),(1/5*x^2-2/15*a)*sqrt((x^2+a)^3),and(number(a),a>0))", "f(x^3*sqrt(x^2+a),sqrt((x^2+a)^5)/5-a*sqrt((x^2+a)^3)/3,and(number(a),a<0))", "f(x^2/sqrt(x^2+a),1/2*x*sqrt(x^2+a)-1/2*a*log(x+sqrt(x^2+a)))", "f(x^3/sqrt(x^2+a),1/3*sqrt((x^2+a)^3)-a*sqrt(x^2+a))", "f(1/x^2*1/sqrt(x^2+a),-sqrt(x^2+a)/a/x)", "f(1/x^3*1/sqrt(x^2+a),-1/2*sqrt(x^2+a)/a/x^2+1/2*log((sqrt(a)+sqrt(x^2+a))/x)/a^(3/2),or(not(number(a)),a>0))", "f(1/x^3*1/sqrt(x^2-a),1/2*sqrt(x^2-a)/a/x^2+1/2*1/(a^(3/2))*arcsec(x/(a^(1/2))),or(not(number(a)),a>0))", "f(x^2*sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),1/6*x*sqrt((x^2+a^(1/3))^5)-1/24*a^(1/3)*x*sqrt((x^2+a^(1/3))^3)-1/16*a^(2/3)*x*sqrt(x^2+a^(1/3))-1/16*a*log(x+sqrt(x^2+a^(1/3))),or(not(number(a)),a>0))", "f(x^2*sqrt(-a-3*a^(1/3)*x^4+3*a^(2/3)*x^2+x^6),1/6*x*sqrt((x^2-a^(1/3))^5)+1/24*a^(1/3)*x*sqrt((x^2-a^(1/3))^3)-1/16*a^(2/3)*x*sqrt(x^2-a^(1/3))+1/16*a*log(x+sqrt(x^2-a^(1/3))),or(not(number(a)),a>0))", "f(x^3*sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),1/7*sqrt((x^2+a^(1/3))^7)-1/5*a^(1/3)*sqrt((x^2+a^(1/3))^5),or(not(number(a)),a>0))", "f(x^3*sqrt(-a-3*a^(1/3)*x^4+3*a^(2/3)*x^2+x^6),1/7*sqrt((x^2-a^(1/3))^7)+1/5*a^(1/3)*sqrt((x^2-a^(1/3))^5),or(not(number(a)),a>0))", "f(1/(x-a)/sqrt(x^2-a^2),-sqrt(x^2-a^2)/a/(x-a))", "f(1/(x+a)/sqrt(x^2-a^2),sqrt(x^2-a^2)/a/(x+a))", "f(sqrt(a-x^2),1/2*(x*sqrt(a-x^2)+a*arcsin(x/sqrt(abs(a)))))", "f(1/x*1/sqrt(a-x^2),-1/sqrt(a)*log((sqrt(a)+sqrt(a-x^2))/x),or(not(number(a)),a>0))", "f(sqrt(a-x^2)/x,sqrt(a-x^2)-sqrt(a)*log((sqrt(a)+sqrt(a-x^2))/x),or(not(number(a)),a>0))", "f(x/sqrt(a-x^2),-sqrt(a-x^2))", "f(x*sqrt(a-x^2),-1/3*sqrt((a-x^2)^3))", "f(x^2*sqrt(a-x^2),-x/4*sqrt((a-x^2)^3)+1/8*a*(x*sqrt(a-x^2)+a*arcsin(x/sqrt(a))),or(not(number(a)),a>0))", "f(x^3*sqrt(a-x^2),(-1/5*x^2-2/15*a)*sqrt((a-x^2)^3),or(not(number(a)),a>0))", "f(x^2/sqrt(a-x^2),-x/2*sqrt(a-x^2)+a/2*arcsin(x/sqrt(a)),or(not(number(a)),a>0))", "f(1/x^2*1/sqrt(a-x^2),-sqrt(a-x^2)/a/x,or(not(number(a)),a>0))", "f(sqrt(a-x^2)/x^2,-sqrt(a-x^2)/x-arcsin(x/sqrt(a)),or(not(number(a)),a>0))", "f(sqrt(a-x^2)/x^3,-1/2*sqrt(a-x^2)/x^2+1/2*log((sqrt(a)+sqrt(a-x^2))/x)/sqrt(a),or(not(number(a)),a>0))", "f(sqrt(a-x^2)/x^4,-1/3*sqrt((a-x^2)^3)/a/x^3,or(not(number(a)),a>0))", "f(sqrt(a*x^2+b),x*sqrt(a*x^2+b)/2+b*log(x*sqrt(a)+sqrt(a*x^2+b))/2/sqrt(a),and(number(a),a>0))", "f(sqrt(a*x^2+b),x*sqrt(a*x^2+b)/2+b*arcsin(x*sqrt(-a/b))/2/sqrt(-a),and(number(a),a<0))", "f(sin(a*x),-cos(a*x)/a)", "f(cos(a*x),sin(a*x)/a)", "f(tan(a*x),-log(cos(a*x))/a)", "f(1/tan(a*x),log(sin(a*x))/a)", "f(1/cos(a*x),log(tan(pi/4+a*x/2))/a)", "f(1/sin(a*x),log(tan(a*x/2))/a)", "f(sin(a*x)^2,x/2-sin(2*a*x)/(4*a))", "f(sin(a*x)^3,-cos(a*x)*(sin(a*x)^2+2)/(3*a))", "f(sin(a*x)^4,3/8*x-sin(2*a*x)/(4*a)+sin(4*a*x)/(32*a))", "f(cos(a*x)^2,x/2+sin(2*a*x)/(4*a))", "f(cos(a*x)^3,sin(a*x)*(cos(a*x)^2+2)/(3*a))", "f(cos(a*x)^4,3/8*x+sin(2*a*x)/(4*a)+sin(4*a*x)/(32*a))", "f(1/sin(a*x)^2,-1/(a*tan(a*x)))", "f(1/cos(a*x)^2,tan(a*x)/a)", "f(sin(a*x)*cos(a*x),sin(a*x)^2/(2*a))", "f(sin(a*x)^2*cos(a*x)^2,-sin(4*a*x)/(32*a)+x/8)", "f(sin(a*x)/cos(a*x)^2,1/(a*cos(a*x)))", "f(sin(a*x)^2/cos(a*x),(log(tan(pi/4+a*x/2))-sin(a*x))/a)", "f(cos(a*x)/sin(a*x)^2,-1/(a*sin(a*x)))", "f(1/(sin(a*x)*cos(a*x)),log(tan(a*x))/a)", "f(1/(sin(a*x)*cos(a*x)^2),(1/cos(a*x)+log(tan(a*x/2)))/a)", "f(1/(sin(a*x)^2*cos(a*x)),(log(tan(pi/4+a*x/2))-1/sin(a*x))/a)", "f(1/(sin(a*x)^2*cos(a*x)^2),-2/(a*tan(2*a*x)))", "f(sin(a+b*x),-cos(a+b*x)/b)", "f(cos(a+b*x),sin(a+b*x)/b)", "f(1/(b+b*sin(a*x)),-tan(pi/4-a*x/2)/a/b)", "f(1/(b-b*sin(a*x)),tan(pi/4+a*x/2)/a/b)", "f(1/(b+b*cos(a*x)),tan(a*x/2)/a/b)", "f(1/(b-b*cos(a*x)),-1/tan(a*x/2)/a/b)", "f(1/(a+b*sin(x)),1/sqrt(b^2-a^2)*log((a*tan(x/2)+b-sqrt(b^2-a^2))/(a*tan(x/2)+b+sqrt(b^2-a^2))),b^2-a^2)", "f(1/(a+b*cos(x)),1/sqrt(b^2-a^2)*log((sqrt(b^2-a^2)*tan(x/2)+a+b)/(sqrt(b^2-a^2)*tan(x/2)-a-b)),b^2-a^2)", "f(x*sin(a*x),sin(a*x)/a^2-x*cos(a*x)/a)", "f(x^2*sin(a*x),2*x*sin(a*x)/a^2-(a^2*x^2-2)*cos(a*x)/a^3)", "f(x*cos(a*x),cos(a*x)/a^2+x*sin(a*x)/a)", "f(x^2*cos(a*x),2*x*cos(a*x)/a^2+(a^2*x^2-2)*sin(a*x)/a^3)", "f(arcsin(a*x),x*arcsin(a*x)+sqrt(1-a^2*x^2)/a)", "f(arccos(a*x),x*arccos(a*x)-sqrt(1-a^2*x^2)/a)", "f(arctan(a*x),x*arctan(a*x)-1/2*log(1+a^2*x^2)/a)", "f(x*log(a*x),x^2*log(a*x)/2-x^2/4)", "f(x^2*log(a*x),x^3*log(a*x)/3-1/9*x^3)", "f(log(x)^2,x*log(x)^2-2*x*log(x)+2*x)", "f(1/x*1/(a+log(x)),log(a+log(x)))", "f(log(a*x+b),(a*x+b)*log(a*x+b)/a-x)", "f(log(a*x+b)/x^2,a/b*log(x)-(a*x+b)*log(a*x+b)/b/x)", "f(sinh(x),cosh(x))", "f(cosh(x),sinh(x))", "f(tanh(x),log(cosh(x)))", "f(x*sinh(x),x*cosh(x)-sinh(x))", "f(x*cosh(x),x*sinh(x)-cosh(x))", "f(sinh(x)^2,sinh(2*x)/4-x/2)", "f(tanh(x)^2,x-tanh(x))", "f(cosh(x)^2,sinh(2*x)/4+x/2)", "f(x^3*exp(a*x^2),exp(a*x^2)*(x^2/a-1/(a^2))/2)", "f(x^3*exp(a*x^2+b),exp(a*x^2)*exp(b)*(x^2/a-1/(a^2))/2)", "f(exp(a*x^2),-i*sqrt(pi)*erf(i*sqrt(a)*x)/sqrt(a)/2)", "f(erf(a*x),x*erf(a*x)+exp(-a^2*x^2)/a/sqrt(pi))", "f(x^2*(1-x^2)^(3/2),(x*sqrt(1-x^2)*(-8*x^4+14*x^2-3)+3*arcsin(x))/48)", "f(x^2*(1-x^2)^(5/2),(x*sqrt(1-x^2)*(48*x^6-136*x^4+118*x^2-15)+15*arcsin(x))/384)", "f(x^4*(1-x^2)^(3/2),(-x*sqrt(1-x^2)*(16*x^6-24*x^4+2*x^2+3)+3*arcsin(x))/128)", "f(x*exp(a*x),exp(a*x)*(a*x-1)/(a^2))", "f(x*exp(a*x+b),exp(a*x+b)*(a*x-1)/(a^2))", "f(x^2*exp(a*x),exp(a*x)*(a^2*x^2-2*a*x+2)/(a^3))", "f(x^2*exp(a*x+b),exp(a*x+b)*(a^2*x^2-2*a*x+2)/(a^3))", "f(x^3*exp(a*x),exp(a*x)*x^3/a-3/a*integral(x^2*exp(a*x),x))", "f(x^3*exp(a*x+b),exp(a*x+b)*x^3/a-3/a*integral(x^2*exp(a*x+b),x))", 0];

  Eval_integral = function() {
    var doNothing, i, i1, n, o, ref, ref1;
    i = 0;
    n = 0;
    p1 = cdr(p1);
    push(car(p1));
    Eval();
    p1 = cdr(p1);
    push(car(p1));
    Eval();
    p2 = pop();
    if (p2 === symbol(NIL)) {
      guess();
      push(symbol(NIL));
    } else if (isNumericAtom(p2)) {
      guess();
      push(p2);
    } else {
      push(p2);
      p1 = cdr(p1);
      push(car(p1));
      Eval();
    }
    p5 = pop();
    p4 = pop();
    p3 = pop();
    while (1) {
      if (isNumericAtom(p5)) {
        push(p5);
        n = pop_integer();
        if (isNaN(n)) {
          stop("nth integral: check n");
        }
      } else {
        n = 1;
      }
      push(p3);
      if (n >= 0) {
        for (i = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
          push(p4);
          integral();
        }
      } else {
        n = -n;
        for (i = i1 = 0, ref1 = n; 0 <= ref1 ? i1 < ref1 : i1 > ref1; i = 0 <= ref1 ? ++i1 : --i1) {
          push(p4);
          derivative();
        }
      }
      p3 = pop();
      if (p5 === symbol(NIL)) {
        break;
      }
      if (isNumericAtom(p5)) {
        p1 = cdr(p1);
        push(car(p1));
        Eval();
        p5 = pop();
        if (p5 === symbol(NIL)) {
          break;
        }
        if (isNumericAtom(p5)) {
          doNothing = 1;
        } else {
          p4 = p5;
          p1 = cdr(p1);
          push(car(p1));
          Eval();
          p5 = pop();
        }
      } else {
        p4 = p5;
        p1 = cdr(p1);
        push(car(p1));
        Eval();
        p5 = pop();
      }
    }
    return push(p3);
  };

  integral = function() {
    save();
    p2 = pop();
    p1 = pop();
    if (car(p1) === symbol(ADD)) {
      integral_of_sum();
    } else if (car(p1) === symbol(MULTIPLY)) {
      integral_of_product();
    } else {
      integral_of_form();
    }
    p1 = pop();
    if (Find(p1, symbol(INTEGRAL))) {
      stop("integral: sorry, could not find a solution");
    }
    push(p1);
    simplify();
    Eval();
    return restore();
  };

  integral_of_sum = function() {
    var results;
    p1 = cdr(p1);
    push(car(p1));
    push(p2);
    integral();
    p1 = cdr(p1);
    results = [];
    while (iscons(p1)) {
      push(car(p1));
      push(p2);
      integral();
      add();
      results.push(p1 = cdr(p1));
    }
    return results;
  };

  integral_of_product = function() {
    push(p1);
    push(p2);
    partition();
    p1 = pop();
    integral_of_form();
    return multiply();
  };

  integral_of_form = function() {
    var hc, tab;
    hc = italu_hashcode(p1, p2).toFixed(6);
    tab = hashed_itab[hc];
    if (!tab) {
      push_symbol(INTEGRAL);
      push(p1);
      push(p2);
      list(3);
      return;
    }
    push(p1);
    push(p2);
    transform(tab, false);
    p3 = pop();
    if (p3 === symbol(NIL)) {
      push_symbol(INTEGRAL);
      push(p1);
      push(p2);
      return list(3);
    } else {
      return push(p3);
    }
  };

  hashcode_values = {
    'x': 0.95532,
    'constexp': 1.43762,
    'constant': 1.14416593629414332,
    'constbase': 1.20364122304218824,
    'sin': 1.73305482518303221,
    'arcsin': 1.6483368529465804,
    'cos': 1.058672123686340116,
    'arccos': 1.8405225918106694,
    'tan': 1.12249437762925064,
    'arctan': 1.1297397925394962,
    'sinh': 1.8176164926060078,
    'cosh': 1.9404934661708022,
    'tanh': 1.6421307715103121,
    'log': 1.47744370135492387,
    'erf': 1.0825269225702916
  };

  italu_hashcode = function(u, x) {
    var half;
    if (issymbol(u)) {
      if (equal(u, x)) {
        return hashcode_values.x;
      } else {
        return hashcode_values.constant;
      }
    } else if (iscons(u)) {
      switch (symnum(car(u))) {
        case ADD:
          return hash_addition(cdr(u), x);
        case MULTIPLY:
          return hash_multiplication(cdr(u), x);
        case POWER:
          return hash_power(cadr(u), caddr(u), x);
        case EXP:
          return hash_power(symbol(E), cadr(u), x);
        case SQRT:
          push_double(0.5);
          half = pop();
          return hash_power(cadr(u), half, x);
        default:
          return hash_function(u, x);
      }
    }
    return hashcode_values.constant;
  };

  hash_function = function(u, x) {
    var arg_hash, base, name;
    if (!Find(cadr(u), x)) {
      return hashcode_values.constant;
    }
    name = car(u);
    arg_hash = italu_hashcode(cadr(u), x);
    base = hashcode_values[name.printname];
    if (!base) {
      throw new Error('Unsupported function ' + name.printname);
    }
    return Math.pow(base, arg_hash);
  };

  hash_addition = function(terms, x) {
    var k, sum, term, term_hash, term_set, v;
    term_set = {};
    while (iscons(terms)) {
      term = car(terms);
      terms = cdr(terms);
      term_hash = 0;
      if (Find(term, x)) {
        term_hash = italu_hashcode(term, x);
      } else {
        term_hash = hashcode_values.constant;
      }
      term_set[term_hash.toFixed(6)] = true;
    }
    sum = 0;
    for (k in term_set) {
      if (!hasProp.call(term_set, k)) continue;
      v = term_set[k];
      sum = sum + parseFloat(k, 10);
    }
    return sum;
  };

  hash_multiplication = function(terms, x) {
    var product, term;
    product = 1;
    while (iscons(terms)) {
      term = car(terms);
      terms = cdr(terms);
      if (Find(term, x)) {
        product = product * italu_hashcode(term, x);
      }
    }
    return product;
  };

  hash_power = function(base, power, x) {
    var base_hash, exp_hash;
    base_hash = hashcode_values.constant;
    exp_hash = hashcode_values.constexp;
    if (Find(base, x)) {
      base_hash = italu_hashcode(base, x);
    }
    if (Find(power, x)) {
      exp_hash = italu_hashcode(power, x);
    } else {
      if (base_hash === hashcode_values.constant) {
        return hashcode_values.constant;
      }
      if (isminusone(power)) {
        exp_hash = -1;
      } else if (isoneovertwo(power)) {
        exp_hash = 0.5;
      } else if (isminusoneovertwo(power)) {
        exp_hash = -0.5;
      } else if (equalq(power, 2, 1)) {
        exp_hash = 2;
      } else if (equalq(power, -2, 1)) {
        exp_hash = -2;
      }
    }
    return Math.pow(base_hash, exp_hash);
  };

  make_hashed_itab = function() {
    var f, h, key, len, o, s, tab, u;
    tab = {};
    for (o = 0, len = itab.length; o < len; o++) {
      s = itab[o];
      if (!s) {
        break;
      }
      scan_meta(s);
      f = pop();
      u = cadr(f);
      h = italu_hashcode(u, symbol(METAX));
      key = h.toFixed(6);
      if (!tab[key]) {
        tab[key] = [];
      }
      tab[key].push(s);
    }
    console.log('hashed_itab = ' + JSON.stringify(tab, null, 2));
    return tab;
  };

  $.make_hashed_itab = make_hashed_itab;

  hashed_itab = {
    "1.144166": ["f(a,a*x)"],
    "1.046770": ["f(1/x,log(x))"],
    "0.936400": ["f(x^a,x^(a+1)/(a+1))"],
    "1.095727": ["f(x^(-2),-x^(-1))"],
    "1.023118": ["f(x^(-1/2),2*x^(1/2))"],
    "0.977405": ["f(x^(1/2),2/3*x^(3/2))"],
    "0.955320": ["f(x,x^2/2)"],
    "0.912636": ["f(x^2,x^3/3)"],
    "1.137302": ["f(exp(a*x),1/a*exp(a*x))", "f(a^x,a^x/log(a),or(not(number(a)),a>0))"],
    "1.326774": ["f(exp(a*x+b),1/a*exp(a*x+b))"],
    "1.080259": ["f(x*exp(a*x^2),exp(a*x^2)/(2*a))"],
    "1.260228": ["f(x*exp(a*x^2+b),exp(a*x^2+b)/(2*a))"],
    "1.451902": ["f(log(a*x),x*log(a*x)-x)"],
    "0.486192": ["f(1/(a+x^2),1/sqrt(a)*arctan(x/sqrt(a)),or(not(number(a)),a>0))", "f(1/(a-x^2),1/sqrt(a)*arctanh(x/sqrt(a)))", "f(1/(a+b*x^2),1/sqrt(a*b)*arctan(x*sqrt(a*b)/a),or(not(number(a*b)),a*b>0))", "f(1/(a+b*x^2),1/(2*sqrt(-a*b))*log((a+x*sqrt(-a*b))/(a-x*sqrt(-a*b))),or(not(number(a*b)),a*b<0))"],
    "0.697274": ["f(1/sqrt(a-x^2),arcsin(x/(sqrt(a))))", "f(1/sqrt(a+x^2),log(x+sqrt(a+x^2)))", "f(1/sqrt(x^2+a),log(x+sqrt(x^2+a)))"],
    "0.476307": ["f(1/(a+b*x),1/b*log(a+b*x))"],
    "0.226868": ["f(1/(a+b*x)^2,-1/(b*(a+b*x)))"],
    "2.904531": ["f(1/(a+b*x)^3,-1/(2*b)*1/(a+b*x)^2)"],
    "0.455026": ["f(x/(a+b*x),x/b-a*log(a+b*x)/b/b)"],
    "0.216732": ["f(x/(a+b*x)^2,1/b^2*(log(a+b*x)+a/(a+b*x)))"],
    "0.434695": ["f(x^2/(a+b*x),1/b^2*(1/2*(a+b*x)^2-2*a*(a+b*x)+a^2*log(a+b*x)))"],
    "0.207048": ["f(x^2/(a+b*x)^2,1/b^3*(a+b*x-2*a*log(a+b*x)-a^2/(a+b*x)))"],
    "2.650781": ["f(x^2/(a+b*x)^3,1/b^3*(log(a+b*x)+2*a/(a+b*x)-1/2*a^2/(a+b*x)^2))"],
    "0.498584": ["f(1/x*1/(a+b*x),-1/a*log((a+b*x)/x))"],
    "0.237479": ["f(1/x*1/(a+b*x)^2,1/a*1/(a+b*x)-1/a^2*log((a+b*x)/x))"],
    "3.040375": ["f(1/x*1/(a+b*x)^3,1/a^3*(1/2*((2*a+b*x)/(a+b*x))^2+log(x/(a+b*x))))"],
    "0.521902": ["f(1/x^2*1/(a+b*x),-1/(a*x)+b/a^2*log((a+b*x)/x))"],
    "0.446014": ["f(1/x^3*1/(a+b*x),(2*b*x-a)/(2*a^2*x^2)+b^2/a^3*log(x/(a+b*x)))"],
    "0.248586": ["f(1/x^2*1/(a+b*x)^2,-(a+2*b*x)/(a^2*x*(a+b*x))+2*b/a^3*log((a+b*x)/x))"],
    "0.464469": ["f(x/(a+b*x^2),1/2*1/b*log(a+b*x^2))"],
    "0.443716": ["f(x^2/(a+b*x^2),x/b-a/b*integral(1/(a+b*x^2),x))"],
    "0.236382": ["f(1/(a+b*x^2)^2,x/(2*a*(a+b*x^2))+1/2*1/a*integral(1/(a+b*x^2),x))"],
    "0.508931": ["f(1/x*1/(a+b*x^2),1/2*1/a*log(x^2/(a+b*x^2)))"],
    "0.532733": ["f(1/x^2*1/(a+b*x^2),-1/(a*x)-b/a*integral(1/(a+b*x^2),x))"],
    "0.480638": ["f(1/(a+b*x^3),1/3*1/a*(a/b)^(1/3)*(1/2*log(((a/b)^(1/3)+x)^3/(a+b*x^3))+sqrt(3)*arctan((2*x-(a/b)^(1/3))*(a/b)^(-1/3)/sqrt(3))))"],
    "0.438648": ["f(x^2/(a+b*x^3),1/3*1/b*log(a+b*x^3))"],
    "0.459164": ["f(x/(a+b*x^4),1/2*sqrt(b/a)/b*arctan(x^2*sqrt(b/a)),or(not(number(a*b)),a*b>0))", "f(x/(a+b*x^4),1/4*sqrt(-b/a)/b*log((x^2-sqrt(-a/b))/(x^2+sqrt(-a/b))),or(not(number(a*b)),a*b<0))"],
    "0.450070": ["f(x^3/(a+b*x^4),1/4*1/b*log(a+b*x^4))"],
    "1.448960": ["f(sqrt(a+b*x),2/3*1/b*sqrt((a+b*x)^3))"],
    "1.384221": ["f(x*sqrt(a+b*x),-2*(2*a-3*b*x)*sqrt((a+b*x)^3)/15/b^2)"],
    "1.322374": ["f(x^2*sqrt(a+b*x),2*(8*a^2-12*a*b*x+15*b^2*x^2)*sqrt((a+b*x)^3)/105/b^3)"],
    "1.516728": ["f(sqrt(a+b*x)/x,2*sqrt(a+b*x)+a*integral(1/x*1/sqrt(a+b*x),x))"],
    "1.587665": ["f(sqrt(a+b*x)/x^2,-sqrt(a+b*x)/x+b/2*integral(1/x*1/sqrt(a+b*x),x))"],
    "0.690150": ["f(1/sqrt(a+b*x),2*sqrt(a+b*x)/b)"],
    "0.659314": ["f(x/sqrt(a+b*x),-2/3*(2*a-b*x)*sqrt(a+b*x)/b^2)"],
    "0.629856": ["f(x^2/sqrt(a+b*x),2/15*(8*a^2-4*a*b*x+3*b^2*x^2)*sqrt(a+b*x)/b^3)"],
    "0.722428": ["f(1/x*1/sqrt(a+b*x),1/sqrt(a)*log((sqrt(a+b*x)-sqrt(a))/(sqrt(a+b*x)+sqrt(a))),or(not(number(a)),a>0))", "f(1/x*1/sqrt(a+b*x),2/sqrt(-a)*arctan(sqrt(-(a+b*x)/a)),or(not(number(a)),a<0))"],
    "0.756216": ["f(1/x^2*1/sqrt(a+b*x),-sqrt(a+b*x)/a/x-1/2*b/a*integral(1/x*1/sqrt(a+b*x),x))"],
    "1.434156": ["f(sqrt(x^2+a),1/2*(x*sqrt(x^2+a)+a*log(x+sqrt(x^2+a))))", "f(sqrt(a-x^2),1/2*(x*sqrt(a-x^2)+a*arcsin(x/sqrt(abs(a)))))", "f(sqrt(a*x^2+b),x*sqrt(a*x^2+b)/2+b*log(x*sqrt(a)+sqrt(a*x^2+b))/2/sqrt(a),and(number(a),a>0))", "f(sqrt(a*x^2+b),x*sqrt(a*x^2+b)/2+b*arcsin(x*sqrt(-a/b))/2/sqrt(-a),and(number(a),a<0))"],
    "0.729886": ["f(1/x*1/sqrt(x^2+a),arcsec(x/sqrt(-a))/sqrt(-a),or(not(number(a)),a<0))", "f(1/x*1/sqrt(x^2+a),-1/sqrt(a)*log((sqrt(a)+sqrt(x^2+a))/x),or(not(number(a)),a>0))", "f(1/x*1/sqrt(a-x^2),-1/sqrt(a)*log((sqrt(a)+sqrt(a-x^2))/x),or(not(number(a)),a>0))"],
    "1.501230": ["f(sqrt(x^2+a)/x,sqrt(x^2+a)-sqrt(a)*log((sqrt(a)+sqrt(x^2+a))/x),or(not(number(a)),a>0))", "f(sqrt(x^2+a)/x,sqrt(x^2+a)-sqrt(-a)*arcsec(x/sqrt(-a)),or(not(number(a)),a<0))", "f(sqrt(a-x^2)/x,sqrt(a-x^2)-sqrt(a)*log((sqrt(a)+sqrt(a-x^2))/x),or(not(number(a)),a>0))"],
    "0.666120": ["f(x/sqrt(x^2+a),sqrt(x^2+a))", "f(x/sqrt(a-x^2),-sqrt(a-x^2))"],
    "1.370077": ["f(x*sqrt(x^2+a),1/3*sqrt((x^2+a)^3))", "f(x*sqrt(a-x^2),-1/3*sqrt((a-x^2)^3))"],
    "1.730087": ["f(sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),1/4*(x*sqrt((x^2+a^(1/3))^3)+3/2*a^(1/3)*x*sqrt(x^2+a^(1/3))+3/2*a^(2/3)*log(x+sqrt(x^2+a^(1/3)))))", "f(sqrt(-a+x^6-3*a^(1/3)*x^4+3*a^(2/3)*x^2),1/4*(x*sqrt((x^2-a^(1/3))^3)-3/2*a^(1/3)*x*sqrt(x^2-a^(1/3))+3/2*a^(2/3)*log(x+sqrt(x^2-a^(1/3)))))"],
    "0.578006": ["f(1/sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),x/a^(1/3)/sqrt(x^2+a^(1/3)))"],
    "0.552180": ["f(x/sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),-1/sqrt(x^2+a^(1/3)))"],
    "1.652787": ["f(x*sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),1/5*sqrt((x^2+a^(1/3))^5))"],
    "1.308862": ["f(x^2*sqrt(x^2+a),1/4*x*sqrt((x^2+a)^3)-1/8*a*x*sqrt(x^2+a)-1/8*a^2*log(x+sqrt(x^2+a)))", "f(x^2*sqrt(a-x^2),-x/4*sqrt((a-x^2)^3)+1/8*a*(x*sqrt(a-x^2)+a*arcsin(x/sqrt(a))),or(not(number(a)),a>0))"],
    "1.342944": ["f(x^3*sqrt(x^2+a),(1/5*x^2-2/15*a)*sqrt((x^2+a)^3),and(number(a),a>0))", "f(x^3*sqrt(x^2+a),sqrt((x^2+a)^5)/5-a*sqrt((x^2+a)^3)/3,and(number(a),a<0))", "f(x^3*sqrt(a-x^2),(-1/5*x^2-2/15*a)*sqrt((a-x^2)^3),or(not(number(a)),a>0))", "f(sqrt(a-x^2)/x^3,-1/2*sqrt(a-x^2)/x^2+1/2*log((sqrt(a)+sqrt(a-x^2))/x)/sqrt(a),or(not(number(a)),a>0))", "f(sqrt(a-x^2)/x^4,-1/3*sqrt((a-x^2)^3)/a/x^3,or(not(number(a)),a>0))"],
    "0.636358": ["f(x^2/sqrt(x^2+a),1/2*x*sqrt(x^2+a)-1/2*a*log(x+sqrt(x^2+a)))", "f(x^2/sqrt(a-x^2),-x/2*sqrt(a-x^2)+a/2*arcsin(x/sqrt(a)),or(not(number(a)),a>0))"],
    "0.652928": ["f(x^3/sqrt(x^2+a),1/3*sqrt((x^2+a)^3)-a*sqrt(x^2+a))", "f(1/x^3*1/sqrt(x^2+a),-1/2*sqrt(x^2+a)/a/x^2+1/2*log((sqrt(a)+sqrt(x^2+a))/x)/a^(3/2),or(not(number(a)),a>0))", "f(1/x^3*1/sqrt(x^2-a),1/2*sqrt(x^2-a)/a/x^2+1/2*1/(a^(3/2))*arcsec(x/(a^(1/2))),or(not(number(a)),a>0))"],
    "0.764022": ["f(1/x^2*1/sqrt(x^2+a),-sqrt(x^2+a)/a/x)", "f(1/x^2*1/sqrt(a-x^2),-sqrt(a-x^2)/a/x,or(not(number(a)),a>0))"],
    "1.578940": ["f(x^2*sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),1/6*x*sqrt((x^2+a^(1/3))^5)-1/24*a^(1/3)*x*sqrt((x^2+a^(1/3))^3)-1/16*a^(2/3)*x*sqrt(x^2+a^(1/3))-1/16*a*log(x+sqrt(x^2+a^(1/3))),or(not(number(a)),a>0))", "f(x^2*sqrt(-a-3*a^(1/3)*x^4+3*a^(2/3)*x^2+x^6),1/6*x*sqrt((x^2-a^(1/3))^5)+1/24*a^(1/3)*x*sqrt((x^2-a^(1/3))^3)-1/16*a^(2/3)*x*sqrt(x^2-a^(1/3))+1/16*a*log(x+sqrt(x^2-a^(1/3))),or(not(number(a)),a>0))"],
    "1.620055": ["f(x^3*sqrt(a+x^6+3*a^(1/3)*x^4+3*a^(2/3)*x^2),1/7*sqrt((x^2+a^(1/3))^7)-1/5*a^(1/3)*sqrt((x^2+a^(1/3))^5),or(not(number(a)),a>0))", "f(x^3*sqrt(-a-3*a^(1/3)*x^4+3*a^(2/3)*x^2+x^6),1/7*sqrt((x^2-a^(1/3))^7)+1/5*a^(1/3)*sqrt((x^2-a^(1/3))^5),or(not(number(a)),a>0))"],
    "0.332117": ["f(1/(x-a)/sqrt(x^2-a^2),-sqrt(x^2-a^2)/a/(x-a))", "f(1/(x+a)/sqrt(x^2-a^2),sqrt(x^2-a^2)/a/(x+a))"],
    "1.571443": ["f(sqrt(a-x^2)/x^2,-sqrt(a-x^2)/x-arcsin(x/sqrt(a)),or(not(number(a)),a>0))"],
    "1.690994": ["f(sin(a*x),-cos(a*x)/a)"],
    "1.055979": ["f(cos(a*x),sin(a*x)/a)"],
    "1.116714": ["f(tan(a*x),-log(cos(a*x))/a)"],
    "0.895484": ["f(1/tan(a*x),log(sin(a*x))/a)"],
    "0.946989": ["f(1/cos(a*x),log(tan(pi/4+a*x/2))/a)"],
    "0.591368": ["f(1/sin(a*x),log(tan(a*x/2))/a)"],
    "2.859462": ["f(sin(a*x)^2,x/2-sin(2*a*x)/(4*a))"],
    "2.128050": ["f(sin(a*x)^3,-cos(a*x)*(sin(a*x)^2+2)/(3*a))", "f(sin(a*x)^4,3/8*x-sin(2*a*x)/(4*a)+sin(4*a*x)/(32*a))"],
    "1.115091": ["f(cos(a*x)^2,x/2+sin(2*a*x)/(4*a))"],
    "1.081452": ["f(cos(a*x)^3,sin(a*x)*(cos(a*x)^2+2)/(3*a))", "f(cos(a*x)^4,3/8*x+sin(2*a*x)/(4*a)+sin(4*a*x)/(32*a))"],
    "0.349716": ["f(1/sin(a*x)^2,-1/(a*tan(a*x)))"],
    "0.896788": ["f(1/cos(a*x)^2,tan(a*x)/a)"],
    "1.785654": ["f(sin(a*x)*cos(a*x),sin(a*x)^2/(2*a))"],
    "3.188560": ["f(sin(a*x)^2*cos(a*x)^2,-sin(4*a*x)/(32*a)+x/8)"],
    "1.516463": ["f(sin(a*x)/cos(a*x)^2,1/(a*cos(a*x)))"],
    "2.707879": ["f(sin(a*x)^2/cos(a*x),(log(tan(pi/4+a*x/2))-sin(a*x))/a)"],
    "0.369293": ["f(cos(a*x)/sin(a*x)^2,-1/(a*sin(a*x)))"],
    "0.560019": ["f(1/(sin(a*x)*cos(a*x)),log(tan(a*x))/a)"],
    "0.530332": ["f(1/(sin(a*x)*cos(a*x)^2),(1/cos(a*x)+log(tan(a*x/2)))/a)"],
    "0.331177": ["f(1/(sin(a*x)^2*cos(a*x)),(log(tan(pi/4+a*x/2))-1/sin(a*x))/a)"],
    "0.313621": ["f(1/(sin(a*x)^2*cos(a*x)^2),-2/(a*tan(2*a*x)))"],
    "3.172365": ["f(sin(a+b*x),-cos(a+b*x)/b)"],
    "1.127162": ["f(cos(a+b*x),sin(a+b*x)/b)"],
    "0.352714": ["f(1/(b+b*sin(a*x)),-tan(pi/4-a*x/2)/a/b)", "f(1/(b-b*sin(a*x)),tan(pi/4+a*x/2)/a/b)", "f(1/(a+b*sin(x)),1/sqrt(b^2-a^2)*log((a*tan(x/2)+b-sqrt(b^2-a^2))/(a*tan(x/2)+b+sqrt(b^2-a^2))),b^2-a^2)"],
    "0.454515": ["f(1/(b+b*cos(a*x)),tan(a*x/2)/a/b)", "f(1/(b-b*cos(a*x)),-1/tan(a*x/2)/a/b)", "f(1/(a+b*cos(x)),1/sqrt(b^2-a^2)*log((sqrt(b^2-a^2)*tan(x/2)+a+b)/(sqrt(b^2-a^2)*tan(x/2)-a-b)),b^2-a^2)"],
    "1.615441": ["f(x*sin(a*x),sin(a*x)/a^2-x*cos(a*x)/a)"],
    "1.543263": ["f(x^2*sin(a*x),2*x*sin(a*x)/a^2-(a^2*x^2-2)*cos(a*x)/a^3)"],
    "1.008798": ["f(x*cos(a*x),cos(a*x)/a^2+x*sin(a*x)/a)"],
    "0.963724": ["f(x^2*cos(a*x),2*x*cos(a*x)/a^2+(a^2*x^2-2)*sin(a*x)/a^3)"],
    "1.611938": ["f(arcsin(a*x),x*arcsin(a*x)+sqrt(1-a^2*x^2)/a)"],
    "1.791033": ["f(arccos(a*x),x*arccos(a*x)-sqrt(1-a^2*x^2)/a)"],
    "1.123599": ["f(arctan(a*x),x*arctan(a*x)-1/2*log(1+a^2*x^2)/a)"],
    "1.387031": ["f(x*log(a*x),x^2*log(a*x)/2-x^2/4)"],
    "1.325058": ["f(x^2*log(a*x),x^3*log(a*x)/3-1/9*x^3)"],
    "2.108018": ["f(log(x)^2,x*log(x)^2-2*x*log(x)+2*x)"],
    "0.403214": ["f(1/x*1/(a+log(x)),log(a+log(x)))"],
    "2.269268": ["f(log(a*x+b),(a*x+b)*log(a*x+b)/a-x)"],
    "2.486498": ["f(log(a*x+b)/x^2,a/b*log(x)-(a*x+b)*log(a*x+b)/b/x)"],
    "1.769733": ["f(sinh(x),cosh(x))"],
    "1.883858": ["f(cosh(x),sinh(x))"],
    "1.606140": ["f(tanh(x),log(cosh(x)))"],
    "1.690661": ["f(x*sinh(x),x*cosh(x)-sinh(x))"],
    "1.799688": ["f(x*cosh(x),x*sinh(x)-cosh(x))"],
    "3.131954": ["f(sinh(x)^2,sinh(2*x)/4-x/2)"],
    "2.579685": ["f(tanh(x)^2,x-tanh(x))"],
    "3.548923": ["f(cosh(x)^2,sinh(2*x)/4+x/2)"],
    "1.058866": ["f(x^3*exp(a*x^2),exp(a*x^2)*(x^2/a-1/(a^2))/2)"],
    "1.235270": ["f(x^3*exp(a*x^2+b),exp(a*x^2)*exp(b)*(x^2/a-1/(a^2))/2)"],
    "1.130783": ["f(exp(a*x^2),-i*sqrt(pi)*erf(i*sqrt(a)*x)/sqrt(a)/2)"],
    "1.078698": ["f(erf(a*x),x*erf(a*x)+exp(-a^2*x^2)/a/sqrt(pi))"],
    "2.573650": ["f(x^2*(1-x^2)^(3/2),(x*sqrt(1-x^2)*(-8*x^4+14*x^2-3)+3*arcsin(x))/48)", "f(x^2*(1-x^2)^(5/2),(x*sqrt(1-x^2)*(48*x^6-136*x^4+118*x^2-15)+15*arcsin(x))/384)"],
    "2.640666": ["f(x^4*(1-x^2)^(3/2),(-x*sqrt(1-x^2)*(16*x^6-24*x^4+2*x^2+3)+3*arcsin(x))/128)"],
    "1.086487": ["f(x*exp(a*x),exp(a*x)*(a*x-1)/(a^2))"],
    "1.267493": ["f(x*exp(a*x+b),exp(a*x+b)*(a*x-1)/(a^2))"],
    "1.037943": ["f(x^2*exp(a*x),exp(a*x)*(a^2*x^2-2*a*x+2)/(a^3))"],
    "1.210862": ["f(x^2*exp(a*x+b),exp(a*x+b)*(a^2*x^2-2*a*x+2)/(a^3))"],
    "1.064970": ["f(x^3*exp(a*x),exp(a*x)*x^3/a-3/a*integral(x^2*exp(a*x),x))"],
    "1.242392": ["f(x^3*exp(a*x+b),exp(a*x+b)*x^3/a-3/a*integral(x^2*exp(a*x+b),x))"]
  };

  INV_check_arg = function() {
    if (!istensor(p1)) {
      return 0;
    } else if (p1.tensor.ndim !== 2) {
      return 0;
    } else if (p1.tensor.dim[0] !== p1.tensor.dim[1]) {
      return 0;
    } else {
      return 1;
    }
  };

  inv = function() {
    var accumulator, eachEntry, i, n, o, ref;
    i = 0;
    n = 0;
    save();
    p1 = pop();
    if (isinv(p1)) {
      push(car(cdr(p1)));
      restore();
      return;
    }
    if (isidentitymatrix(p1)) {
      push(p1);
      restore();
      return;
    }
    if (expanding && isinnerordot(p1)) {
      p1 = cdr(p1);
      accumulator = [];
      while (iscons(p1)) {
        accumulator.push(car(p1));
        p1 = cdr(p1);
      }
      for (eachEntry = o = ref = accumulator.length - 1; ref <= 0 ? o <= 0 : o >= 0; eachEntry = ref <= 0 ? ++o : --o) {
        push(accumulator[eachEntry]);
        inv();
        if (eachEntry !== accumulator.length - 1) {
          inner();
        }
      }
      restore();
      return;
    }
    if (INV_check_arg() === 0) {
      push_symbol(INV);
      push(p1);
      list(2);
      restore();
      return;
    }
    if (isNumericAtomOrTensor(p1)) {
      yyinvg();
    } else {
      push(p1);
      adj();
      push(p1);
      det();
      p2 = pop();
      if (isZeroAtomOrTensor(p2)) {
        stop("inverse of singular matrix");
      }
      push(p2);
      divide();
    }
    return restore();
  };

  invg = function() {
    save();
    p1 = pop();
    if (INV_check_arg() === 0) {
      push_symbol(INVG);
      push(p1);
      list(2);
      restore();
      return;
    }
    yyinvg();
    return restore();
  };

  yyinvg = function() {
    var h, i, i1, j, j1, l1, n, o, ref, ref1, ref2, ref3;
    h = 0;
    i = 0;
    j = 0;
    n = 0;
    n = p1.tensor.dim[0];
    h = tos;
    for (i = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      for (j = i1 = 0, ref1 = n; 0 <= ref1 ? i1 < ref1 : i1 > ref1; j = 0 <= ref1 ? ++i1 : --i1) {
        if (i === j) {
          push(one);
        } else {
          push(zero);
        }
      }
    }
    for (i = j1 = 0, ref2 = n * n; 0 <= ref2 ? j1 < ref2 : j1 > ref2; i = 0 <= ref2 ? ++j1 : --j1) {
      push(p1.tensor.elem[i]);
    }
    INV_decomp(n);
    p1 = alloc_tensor(n * n);
    p1.tensor.ndim = 2;
    p1.tensor.dim[0] = n;
    p1.tensor.dim[1] = n;
    for (i = l1 = 0, ref3 = n * n; 0 <= ref3 ? l1 < ref3 : l1 > ref3; i = 0 <= ref3 ? ++l1 : --l1) {
      p1.tensor.elem[i] = stack[h + i];
    }
    moveTos(tos - 2 * n * n);
    return push(p1);
  };

  INV_decomp = function(n) {
    var a, d, i, i1, j, j1, l1, o, ref, ref1, ref2, ref3, ref4, results, u;
    a = 0;
    d = 0;
    i = 0;
    j = 0;
    u = 0;
    a = tos - n * n;
    u = a - n * n;
    results = [];
    for (d = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; d = 0 <= ref ? ++o : --o) {
      if (equal(stack[a + n * d + d], zero)) {
        for (i = i1 = ref1 = d + 1, ref2 = n; ref1 <= ref2 ? i1 < ref2 : i1 > ref2; i = ref1 <= ref2 ? ++i1 : --i1) {
          if (!equal(stack[a + n * i + d], zero)) {
            break;
          }
        }
        if (i === n) {
          stop("inverse of singular matrix");
        }
        for (j = j1 = 0, ref3 = n; 0 <= ref3 ? j1 < ref3 : j1 > ref3; j = 0 <= ref3 ? ++j1 : --j1) {
          p2 = stack[a + n * d + j];
          stack[a + n * d + j] = stack[a + n * i + j];
          stack[a + n * i + j] = p2;
          p2 = stack[u + n * d + j];
          stack[u + n * d + j] = stack[u + n * i + j];
          stack[u + n * i + j] = p2;
        }
      }
      p2 = stack[a + n * d + d];
      for (j = l1 = 0, ref4 = n; 0 <= ref4 ? l1 < ref4 : l1 > ref4; j = 0 <= ref4 ? ++l1 : --l1) {
        if (j > d) {
          push(stack[a + n * d + j]);
          push(p2);
          divide();
          stack[a + n * d + j] = pop();
        }
        push(stack[u + n * d + j]);
        push(p2);
        divide();
        stack[u + n * d + j] = pop();
      }
      results.push((function() {
        var m1, ref5, results1;
        results1 = [];
        for (i = m1 = 0, ref5 = n; 0 <= ref5 ? m1 < ref5 : m1 > ref5; i = 0 <= ref5 ? ++m1 : --m1) {
          if (i === d) {
            continue;
          }
          p2 = stack[a + n * i + d];
          results1.push((function() {
            var n1, ref6, results2;
            results2 = [];
            for (j = n1 = 0, ref6 = n; 0 <= ref6 ? n1 < ref6 : n1 > ref6; j = 0 <= ref6 ? ++n1 : --n1) {
              if (j > d) {
                push(stack[a + n * i + j]);
                push(stack[a + n * d + j]);
                push(p2);
                multiply();
                subtract();
                stack[a + n * i + j] = pop();
              }
              push(stack[u + n * i + j]);
              push(stack[u + n * d + j]);
              push(p2);
              multiply();
              subtract();
              results2.push(stack[u + n * i + j] = pop());
            }
            return results2;
          })());
        }
        return results1;
      })());
    }
    return results;
  };

  DEBUG_IS = false;

  isZeroAtom = function(p) {
    switch (p.k) {
      case NUM:
        if (MZERO(p.q.a)) {
          return 1;
        }
        break;
      case DOUBLE:
        if (p.d === 0.0) {
          return 1;
        }
    }
    return 0;
  };

  isZeroTensor = function(p) {
    var i, o, ref;
    if (p.k !== TENSOR) {
      return 0;
    }
    for (i = o = 0, ref = p.tensor.nelem; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      if (!isZeroAtomOrTensor(p.tensor.elem[i])) {
        return 0;
      }
    }
    return 1;
  };

  isZeroAtomOrTensor = function(p) {
    return isZeroAtom(p) || isZeroTensor(p);
  };

  isZeroLikeOrNonZeroLikeOrUndetermined = function(valueOrPredicate) {
    var evalledArgument;
    push(valueOrPredicate);
    Eval_predicate();
    evalledArgument = pop();
    if (isZeroAtomOrTensor(evalledArgument)) {
      return 0;
    }
    if (isNumericAtomOrTensor(evalledArgument)) {
      return 1;
    }
    push(evalledArgument);
    zzfloat();
    evalledArgument = pop();
    if (isZeroAtomOrTensor(evalledArgument)) {
      return 0;
    }
    if (isNumericAtomOrTensor(evalledArgument)) {
      return 1;
    }
    if (Find(evalledArgument, imaginaryunit)) {
      push(evalledArgument);
      absValFloat();
      Eval_predicate();
      evalledArgument = pop();
      if (isZeroAtomOrTensor(evalledArgument)) {
        return 0;
      }
      if (isNumericAtomOrTensor(evalledArgument)) {
        return 1;
      }
    }
    return null;
  };

  isnegativenumber = function(p) {
    switch (p.k) {
      case NUM:
        if (MSIGN(p.q.a) === -1) {
          return 1;
        }
        break;
      case DOUBLE:
        if (p.d < 0.0) {
          return 1;
        }
    }
    return 0;
  };

  ispositivenumber = function(p) {
    switch (p.k) {
      case NUM:
        if (MSIGN(p.q.a) === 1) {
          return 1;
        }
        break;
      case DOUBLE:
        if (p.d > 0.0) {
          return 1;
        }
    }
    return 0;
  };

  isplustwo = function(p) {
    switch (p.k) {
      case NUM:
        if (MEQUAL(p.q.a, 2) && MEQUAL(p.q.b, 1)) {
          return 1;
        }
        break;
      case DOUBLE:
        if (p.d === 2.0) {
          return 1;
        }
    }
    return 0;
  };

  isplusone = function(p) {
    switch (p.k) {
      case NUM:
        if (MEQUAL(p.q.a, 1) && MEQUAL(p.q.b, 1)) {
          return 1;
        }
        break;
      case DOUBLE:
        if (p.d === 1.0) {
          return 1;
        }
    }
    return 0;
  };

  isminusone = function(p) {
    switch (p.k) {
      case NUM:
        if (MEQUAL(p.q.a, -1) && MEQUAL(p.q.b, 1)) {
          return 1;
        }
        break;
      case DOUBLE:
        if (p.d === -1.0) {
          return 1;
        }
    }
    return 0;
  };

  isone = function(p) {
    return isplusone(p) || isminusone(p);
  };

  isinteger = function(p) {
    if (p.k === NUM && MEQUAL(p.q.b, 1)) {
      return 1;
    } else {
      return 0;
    }
  };

  isintegerorintegerfloat = function(p) {
    if (p.k === DOUBLE) {
      if (p.d === Math.round(p.d)) {
        return 1;
      }
      return 0;
    }
    return isinteger(p);
  };

  isnonnegativeinteger = function(p) {
    if (isrational(p) && MEQUAL(p.q.b, 1) && MSIGN(p.q.a) === 1) {
      return 1;
    } else {
      return 0;
    }
  };

  isposint = function(p) {
    if (isinteger(p) && MSIGN(p.q.a) === 1) {
      return 1;
    } else {
      return 0;
    }
  };

  isunivarpolyfactoredorexpandedform = function(p, x) {
    if (x == null) {
      push(p);
      guess();
      x = pop();
      pop();
    }
    if (ispolyfactoredorexpandedform(p, x) && (Find(p, symbol(SYMBOL_X)) + Find(p, symbol(SYMBOL_Y)) + Find(p, symbol(SYMBOL_Z)) === 1)) {
      return x;
    } else {
      return 0;
    }
  };

  ispolyfactoredorexpandedform = function(p, x) {
    return ispolyfactoredorexpandedform_factor(p, x);
  };

  ispolyfactoredorexpandedform_factor = function(p, x) {
    if (car(p) === symbol(MULTIPLY)) {
      p = cdr(p);
      while (iscons(p)) {
        if (DEBUG) {
          console.log("ispolyfactoredorexpandedform_factor testing " + car(p));
        }
        if (!ispolyfactoredorexpandedform_power(car(p), x)) {
          if (DEBUG) {
            console.log("... tested negative:" + car(p));
          }
          return 0;
        }
        p = cdr(p);
      }
      return 1;
    } else {
      return ispolyfactoredorexpandedform_power(p, x);
    }
  };

  ispolyfactoredorexpandedform_power = function(p, x) {
    if (car(p) === symbol(POWER)) {
      if (DEBUG) {
        console.log("ispolyfactoredorexpandedform_power (isposint(caddr(p)) " + (isposint(caddr(p)), DEBUG ? console.log("ispolyfactoredorexpandedform_power ispolyexpandedform_expr(cadr(p), x)) " + ispolyexpandedform_expr(cadr(p), x)) : void 0));
      }
      return isposint(caddr(p)) && ispolyexpandedform_expr(cadr(p), x);
    } else {
      if (DEBUG) {
        console.log("ispolyfactoredorexpandedform_power not a power, testing if this is exp form: " + p);
      }
      return ispolyexpandedform_expr(p, x);
    }
  };

  ispolyexpandedform = function(p, x) {
    if (Find(p, x)) {
      return ispolyexpandedform_expr(p, x);
    } else {
      return 0;
    }
  };

  ispolyexpandedform_expr = function(p, x) {
    if (car(p) === symbol(ADD)) {
      p = cdr(p);
      while (iscons(p)) {
        if (!ispolyexpandedform_term(car(p), x)) {
          return 0;
        }
        p = cdr(p);
      }
      return 1;
    } else {
      return ispolyexpandedform_term(p, x);
    }
  };

  ispolyexpandedform_term = function(p, x) {
    if (car(p) === symbol(MULTIPLY)) {
      p = cdr(p);
      while (iscons(p)) {
        if (!ispolyexpandedform_factor(car(p), x)) {
          return 0;
        }
        p = cdr(p);
      }
      return 1;
    } else {
      return ispolyexpandedform_factor(p, x);
    }
  };

  ispolyexpandedform_factor = function(p, x) {
    if (equal(p, x)) {
      return 1;
    }
    if (car(p) === symbol(POWER) && equal(cadr(p), x)) {
      if (isposint(caddr(p))) {
        return 1;
      } else {
        return 0;
      }
    }
    if (Find(p, x)) {
      return 0;
    } else {
      return 1;
    }
  };

  isnegativeterm = function(p) {
    if (isnegativenumber(p)) {
      return 1;
    } else if (car(p) === symbol(MULTIPLY) && isnegativenumber(cadr(p))) {
      return 1;
    } else {
      return 0;
    }
  };

  hasNegativeRationalExponent = function(p) {
    if (car(p) === symbol(POWER) && isrational(car(cdr(cdr(p)))) && isnegativenumber(car(cdr(p)))) {
      if (DEBUG_IS) {
        console.log("hasNegativeRationalExponent: " + p.toString() + " has imaginary component");
      }
      return 1;
    } else {
      if (DEBUG_IS) {
        console.log("hasNegativeRationalExponent: " + p.toString() + " has NO imaginary component");
      }
      return 0;
    }
  };

  isimaginarynumberdouble = function(p) {
    if ((car(p) === symbol(MULTIPLY) && length(p) === 3 && isdouble(cadr(p)) && hasNegativeRationalExponent(caddr(p))) || equal(p, imaginaryunit)) {
      return 1;
    } else {
      return 0;
    }
  };

  isimaginarynumber = function(p) {
    if ((car(p) === symbol(MULTIPLY) && length(p) === 3 && isNumericAtom(cadr(p)) && equal(caddr(p), imaginaryunit)) || equal(p, imaginaryunit) || hasNegativeRationalExponent(caddr(p))) {
      if (DEBUG_IS) {
        console.log("isimaginarynumber: " + p.toString() + " is imaginary number");
      }
      return 1;
    } else {
      if (DEBUG_IS) {
        console.log("isimaginarynumber: " + p.toString() + " isn't an imaginary number");
      }
      return 0;
    }
  };

  iscomplexnumberdouble = function(p) {
    if ((car(p) === symbol(ADD) && length(p) === 3 && isdouble(cadr(p)) && isimaginarynumberdouble(caddr(p))) || isimaginarynumberdouble(p)) {
      return 1;
    } else {
      return 0;
    }
  };

  iscomplexnumber = function(p) {
    if (DEBUG_IS) {
      debugger;
    }
    if ((car(p) === symbol(ADD) && length(p) === 3 && isNumericAtom(cadr(p)) && isimaginarynumber(caddr(p))) || isimaginarynumber(p)) {
      if (DEBUG) {
        console.log("iscomplexnumber: " + p.toString() + " is imaginary number");
      }
      return 1;
    } else {
      if (DEBUG) {
        console.log("iscomplexnumber: " + p.toString() + " is imaginary number");
      }
      return 0;
    }
  };

  iseveninteger = function(p) {
    if (isinteger(p) && p.q.a.isEven()) {
      return 1;
    } else {
      return 0;
    }
  };

  isnegative = function(p) {
    if (car(p) === symbol(ADD) && isnegativeterm(cadr(p))) {
      return 1;
    } else if (isnegativeterm(p)) {
      return 1;
    } else {
      return 0;
    }
  };

  issymbolic = function(p) {
    if (issymbol(p)) {
      return 1;
    } else {
      while (iscons(p)) {
        if (issymbolic(car(p))) {
          return 1;
        }
        p = cdr(p);
      }
      return 0;
    }
  };

  isintegerfactor = function(p) {
    if (isinteger(p) || car(p) === symbol(POWER) && isinteger(cadr(p)) && isinteger(caddr(p))) {
      return 1;
    } else {
      return 0;
    }
  };

  isNumberOneOverSomething = function(p) {
    if (isfraction(p) && MEQUAL(p.q.a.abs(), 1)) {
      return 1;
    } else {
      return 0;
    }
  };

  isoneover = function(p) {
    if (car(p) === symbol(POWER) && isminusone(caddr(p))) {
      return 1;
    } else {
      return 0;
    }
  };

  isfraction = function(p) {
    if (p.k === NUM && !MEQUAL(p.q.b, 1)) {
      return 1;
    } else {
      return 0;
    }
  };

  equaln = function(p, n) {
    switch (p.k) {
      case NUM:
        if (MEQUAL(p.q.a, n) && MEQUAL(p.q.b, 1)) {
          return 1;
        }
        break;
      case DOUBLE:
        if (p.d === n) {
          return 1;
        }
    }
    return 0;
  };

  equalq = function(p, a, b) {
    switch (p.k) {
      case NUM:
        if (MEQUAL(p.q.a, a) && MEQUAL(p.q.b, b)) {
          return 1;
        }
        break;
      case DOUBLE:
        if (p.d === a / b) {
          return 1;
        }
    }
    return 0;
  };

  isoneovertwo = function(p) {
    if (equalq(p, 1, 2)) {
      return 1;
    } else {
      return 0;
    }
  };

  isminusoneovertwo = function(p) {
    if (equalq(p, -1, 2)) {
      return 1;
    } else {
      return 0;
    }
  };

  isoneoversqrttwo = function(p) {
    if (car(p) === symbol(POWER) && equaln(cadr(p), 2) && equalq(caddr(p), -1, 2)) {
      return 1;
    } else {
      return 0;
    }
  };

  isminusoneoversqrttwo = function(p) {
    if (car(p) === symbol(MULTIPLY) && equaln(cadr(p), -1) && isoneoversqrttwo(caddr(p)) && length(p) === 3) {
      return 1;
    } else {
      return 0;
    }
  };

  isfloating = function(p) {
    if (p.k === DOUBLE || p === symbol(FLOATF)) {
      return 1;
    }
    while (iscons(p)) {
      if (isfloating(car(p))) {
        return 1;
      }
      p = cdr(p);
    }
    return 0;
  };

  isimaginaryunit = function(p) {
    if (equal(p, imaginaryunit)) {
      return 1;
    } else {
      return 0;
    }
  };

  isquarterturn = function(p) {
    var minussign, n;
    n = 0;
    minussign = 0;
    if (car(p) !== symbol(MULTIPLY)) {
      return 0;
    }
    if (equal(cadr(p), imaginaryunit)) {
      if (caddr(p) !== symbol(PI)) {
        return 0;
      }
      if (length(p) !== 3) {
        return 0;
      }
      return 2;
    }
    if (!isNumericAtom(cadr(p))) {
      return 0;
    }
    if (!equal(caddr(p), imaginaryunit)) {
      return 0;
    }
    if (cadddr(p) !== symbol(PI)) {
      return 0;
    }
    if (length(p) !== 4) {
      return 0;
    }
    push(cadr(p));
    push_integer(2);
    multiply();
    n = pop_integer();
    if (isNaN(n)) {
      return 0;
    }
    if (n < 1) {
      minussign = 1;
      n = -n;
    }
    switch (n % 4) {
      case 0:
        n = 1;
        break;
      case 1:
        if (minussign) {
          n = 4;
        } else {
          n = 3;
        }
        break;
      case 2:
        n = 2;
        break;
      case 3:
        if (minussign) {
          n = 3;
        } else {
          n = 4;
        }
    }
    return n;
  };

  isnpi = function(p) {
    var doNothing, n;
    n = 0;
    if (p === symbol(PI)) {
      return 2;
    }
    if (car(p) === symbol(MULTIPLY) && isNumericAtom(cadr(p)) && caddr(p) === symbol(PI) && length(p) === 3) {
      doNothing = 0;
    } else {
      return 0;
    }
    push(cadr(p));
    push_integer(2);
    multiply();
    n = pop_integer();
    if (isNaN(n)) {
      return 0;
    }
    if (n < 0) {
      n = 4 - (-n) % 4;
    } else {
      n = 1 + (n - 1) % 4;
    }
    return n;
  };

  $.isZeroAtomOrTensor = isZeroAtomOrTensor;

  $.isnegativenumber = isnegativenumber;

  $.isplusone = isplusone;

  $.isminusone = isminusone;

  $.isinteger = isinteger;

  $.isnonnegativeinteger = isnonnegativeinteger;

  $.isposint = isposint;

  $.isnegativeterm = isnegativeterm;

  $.isimaginarynumber = isimaginarynumber;

  $.iscomplexnumber = iscomplexnumber;

  $.iseveninteger = iseveninteger;

  $.isnegative = isnegative;

  $.issymbolic = issymbolic;

  $.isintegerfactor = isintegerfactor;

  $.isoneover = isoneover;

  $.isfraction = isfraction;

  $.isoneoversqrttwo = isoneoversqrttwo;

  $.isminusoneoversqrttwo = isminusoneoversqrttwo;

  $.isfloating = isfloating;

  $.isimaginaryunit = isimaginaryunit;

  $.isquarterturn = isquarterturn;

  $.isnpi = isnpi;

  Eval_isprime = function() {
    push(cadr(p1));
    Eval();
    p1 = pop();
    if (isnonnegativeinteger(p1) && mprime(p1.q.a)) {
      return push_integer(1);
    } else {
      return push_integer(0);
    }
  };


  /*
   Laguerre function
  
  Example
  
    laguerre(x,3)
  
  Result
  
       1   3    3   2
    - --- x  + --- x  - 3 x + 1
       6        2
  
  The computation uses the following recurrence relation.
  
    L(x,0,k) = 1
  
    L(x,1,k) = -x + k + 1
  
    n*L(x,n,k) = (2*(n-1)+1-x+k)*L(x,n-1,k) - (n-1+k)*L(x,n-2,k)
  
  In the "for" loop i = n-1 so the recurrence relation becomes
  
    (i+1)*L(x,n,k) = (2*i+1-x+k)*L(x,n-1,k) - (i+k)*L(x,n-2,k)
   */

  Eval_laguerre = function() {
    push(cadr(p1));
    Eval();
    push(caddr(p1));
    Eval();
    push(cadddr(p1));
    Eval();
    p2 = pop();
    if (p2 === symbol(NIL)) {
      push_integer(0);
    } else {
      push(p2);
    }
    return laguerre();
  };

  laguerre = function() {
    var n;
    n = 0;
    save();
    p3 = pop();
    p2 = pop();
    p1 = pop();
    push(p2);
    n = pop_integer();
    if (n < 0 || isNaN(n)) {
      push_symbol(LAGUERRE);
      push(p1);
      push(p2);
      push(p3);
      list(4);
      restore();
      return;
    }
    if (issymbol(p1)) {
      laguerre2(n);
    } else {
      p4 = p1;
      p1 = symbol(SECRETX);
      laguerre2(n);
      p1 = p4;
      push(symbol(SECRETX));
      push(p1);
      subst();
      Eval();
    }
    return restore();
  };

  laguerre2 = function(n) {
    var i, o, ref, results;
    i = 0;
    push_integer(1);
    push_integer(0);
    p6 = pop();
    results = [];
    for (i = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      p5 = p6;
      p6 = pop();
      push_integer(2 * i + 1);
      push(p1);
      subtract();
      push(p3);
      add();
      push(p6);
      multiply();
      push_integer(i);
      push(p3);
      add();
      push(p5);
      multiply();
      subtract();
      push_integer(i + 1);
      results.push(divide());
    }
    return results;
  };

  Eval_lcm = function() {
    var results;
    p1 = cdr(p1);
    push(car(p1));
    Eval();
    p1 = cdr(p1);
    results = [];
    while (iscons(p1)) {
      push(car(p1));
      Eval();
      lcm();
      results.push(p1 = cdr(p1));
    }
    return results;
  };

  lcm = function() {
    var prev_expanding;
    prev_expanding = expanding;
    save();
    yylcm();
    restore();
    return expanding = prev_expanding;
  };

  yylcm = function() {
    expanding = 1;
    p2 = pop();
    p1 = pop();
    push(p1);
    push(p2);
    gcd();
    push(p1);
    divide();
    push(p2);
    divide();
    return inverse();
  };


  /*
   Return the leading coefficient of a polynomial.
  
  Example
  
    leading(5x^2+x+1,x)
  
  Result
  
    5
  
  The result is undefined if P is not a polynomial.
   */

  Eval_leading = function() {
    push(cadr(p1));
    Eval();
    push(caddr(p1));
    Eval();
    p1 = pop();
    if (p1 === symbol(NIL)) {
      guess();
    } else {
      push(p1);
    }
    return leading();
  };

  leading = function() {
    save();
    p2 = pop();
    p1 = pop();
    push(p1);
    push(p2);
    degree();
    p3 = pop();
    push(p1);
    push(p2);
    push(p3);
    power();
    divide();
    push(p2);
    filter();
    return restore();
  };


  /*
   Legendre function
  
  Example
  
    legendre(x,3,0)
  
  Result
  
     5   3    3
    --- x  - --- x
     2        2
  
  The computation uses the following recurrence relation.
  
    P(x,0) = 1
  
    P(x,1) = x
  
    n*P(x,n) = (2*(n-1)+1)*x*P(x,n-1) - (n-1)*P(x,n-2)
  
  In the "for" loop we have i = n-1 so the recurrence relation becomes
  
    (i+1)*P(x,n) = (2*i+1)*x*P(x,n-1) - i*P(x,n-2)
  
  For m > 0
  
    P(x,n,m) = (-1)^m * (1-x^2)^(m/2) * d^m/dx^m P(x,n)
   */

  Eval_legendre = function() {
    push(cadr(p1));
    Eval();
    push(caddr(p1));
    Eval();
    push(cadddr(p1));
    Eval();
    p2 = pop();
    if (p2 === symbol(NIL)) {
      push_integer(0);
    } else {
      push(p2);
    }
    return legendre();
  };

  legendre = function() {
    save();
    __legendre();
    return restore();
  };

  __legendre = function() {
    var m, n;
    m = 0;
    n = 0;
    p3 = pop();
    p2 = pop();
    p1 = pop();
    push(p2);
    n = pop_integer();
    push(p3);
    m = pop_integer();
    if (n < 0 || isNaN(n) || m < 0 || isNaN(m)) {
      push_symbol(LEGENDRE);
      push(p1);
      push(p2);
      push(p3);
      list(4);
      return;
    }
    if (issymbol(p1)) {
      __legendre2(n, m);
    } else {
      p4 = p1;
      p1 = symbol(SECRETX);
      __legendre2(n, m);
      p1 = p4;
      push(symbol(SECRETX));
      push(p1);
      subst();
      Eval();
    }
    return __legendre3(m);
  };

  __legendre2 = function(n, m) {
    var i, i1, o, ref, ref1, results;
    i = 0;
    push_integer(1);
    push_integer(0);
    p6 = pop();
    for (i = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      p5 = p6;
      p6 = pop();
      push_integer(2 * i + 1);
      push(p1);
      multiply();
      push(p6);
      multiply();
      push_integer(i);
      push(p5);
      multiply();
      subtract();
      push_integer(i + 1);
      divide();
    }
    results = [];
    for (i = i1 = 0, ref1 = m; 0 <= ref1 ? i1 < ref1 : i1 > ref1; i = 0 <= ref1 ? ++i1 : --i1) {
      push(p1);
      results.push(derivative());
    }
    return results;
  };

  __legendre3 = function(m) {
    if (m === 0) {
      return;
    }
    if (car(p1) === symbol(COS)) {
      push(cadr(p1));
      sine();
      square();
    } else if (car(p1) === symbol(SIN)) {
      push(cadr(p1));
      cosine();
      square();
    } else {
      push_integer(1);
      push(p1);
      square();
      subtract();
    }
    push_integer(m);
    push_rational(1, 2);
    multiply();
    power();
    multiply();
    if (m % 2) {
      return negate();
    }
  };

  list = function(n) {
    var listIterator, o, ref, results;
    listIterator = 0;
    push(symbol(NIL));
    results = [];
    for (listIterator = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; listIterator = 0 <= ref ? ++o : --o) {
      results.push(cons());
    }
    return results;
  };

  Eval_log = function() {
    push(cadr(p1));
    Eval();
    return logarithm();
  };

  logarithm = function() {
    save();
    yylog();
    return restore();
  };

  yylog = function() {
    var d;
    d = 0.0;
    p1 = pop();
    if (p1 === symbol(E)) {
      push_integer(1);
      return;
    }
    if (equaln(p1, 1)) {
      push_integer(0);
      return;
    }
    if (isnegativenumber(p1)) {
      push(p1);
      negate();
      logarithm();
      push(imaginaryunit);
      if (evaluatingAsFloats) {
        push_double(Math.PI);
      } else {
        push_symbol(PI);
      }
      multiply();
      add();
      return;
    }
    if (isdouble(p1)) {
      d = Math.log(p1.d);
      push_double(d);
      return;
    }
    if (isfraction(p1)) {
      push(p1);
      numerator();
      logarithm();
      push(p1);
      denominator();
      logarithm();
      subtract();
      return;
    }
    if (car(p1) === symbol(POWER)) {
      push(caddr(p1));
      push(cadr(p1));
      logarithm();
      multiply();
      return;
    }
    if (car(p1) === symbol(MULTIPLY)) {
      push_integer(0);
      p1 = cdr(p1);
      while (iscons(p1)) {
        push(car(p1));
        logarithm();
        add();
        p1 = cdr(p1);
      }
      return;
    }
    push_symbol(LOG);
    push(p1);
    return list(2);
  };

  Eval_lookup = function() {
    p1 = cadr(p1);
    if (!iscons(p1) && cadr(p1).k === SYM) {
      p1 = get_binding(p1);
    }
    return push(p1);
  };

  madd = function(a, b) {
    return a.add(b);
  };

  msub = function(a, b) {
    return a.subtract(b);
  };

  addf = function(a, b) {
    return a.add(b);
  };

  subf = function(a, b) {
    return a.subtract(b);
  };

  ucmp = function(a, b) {
    return a.compareAbs(b);
  };

  mgcd = function(u, v) {
    return bigInt.gcd(u, v);
  };

  new_string = function(s) {
    save();
    p1 = new U();
    p1.k = STR;
    p1.str = s;
    push(p1);
    return restore();
  };

  out_of_memory = function() {
    return stop("out of memory");
  };

  push_zero_matrix = function(i, j) {
    push(alloc_tensor(i * j));
    stack[tos - 1].tensor.ndim = 2;
    stack[tos - 1].tensor.dim[0] = i;
    return stack[tos - 1].tensor.dim[1] = j;
  };

  push_identity_matrix = function(n) {
    var i, o, ref;
    push_zero_matrix(n, n);
    i = 0;
    for (i = o = 0, ref = n; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      stack[tos - 1].tensor.elem[i * n + i] = one;
    }
    return check_tensor_dimensions(stack[tos - 1]);
  };

  push_cars = function(p) {
    var results;
    results = [];
    while (iscons(p)) {
      push(car(p));
      results.push(p = cdr(p));
    }
    return results;
  };

  peek = function() {
    save();
    p1 = pop();
    push(p1);
    return restore();
  };

  equal = function(p1, p2) {
    if (cmp_expr(p1, p2) === 0) {
      return 1;
    } else {
      return 0;
    }
  };

  lessp = function(p1, p2) {
    if (cmp_expr(p1, p2) < 0) {
      return 1;
    } else {
      return 0;
    }
  };

  sign = function(n) {
    if (n < 0) {
      return -1;
    } else if (n > 0) {
      return 1;
    } else {
      return 0;
    }
  };

  cmp_expr = function(p1, p2) {
    var n;
    n = 0;
    if (p1 === p2) {
      return 0;
    }
    if (p1 === symbol(NIL)) {
      return -1;
    }
    if (p2 === symbol(NIL)) {
      return 1;
    }
    if (isNumericAtom(p1) && isNumericAtom(p2)) {
      return sign(compare_numbers(p1, p2));
    }
    if (isNumericAtom(p1)) {
      return -1;
    }
    if (isNumericAtom(p2)) {
      return 1;
    }
    if (isstr(p1) && isstr(p2)) {
      return sign(strcmp(p1.str, p2.str));
    }
    if (isstr(p1)) {
      return -1;
    }
    if (isstr(p2)) {
      return 1;
    }
    if (issymbol(p1) && issymbol(p2)) {
      return sign(strcmp(get_printname(p1), get_printname(p2)));
    }
    if (issymbol(p1)) {
      return -1;
    }
    if (issymbol(p2)) {
      return 1;
    }
    if (istensor(p1) && istensor(p2)) {
      return compare_tensors(p1, p2);
    }
    if (istensor(p1)) {
      return -1;
    }
    if (istensor(p2)) {
      return 1;
    }
    while (iscons(p1) && iscons(p2)) {
      n = cmp_expr(car(p1), car(p2));
      if (n !== 0) {
        return n;
      }
      p1 = cdr(p1);
      p2 = cdr(p2);
    }
    if (iscons(p2)) {
      return -1;
    }
    if (iscons(p1)) {
      return 1;
    }
    return 0;
  };

  length = function(p) {
    var n;
    n = 0;
    while (iscons(p)) {
      p = cdr(p);
      n++;
    }
    return n;
  };

  unique = function(p) {
    save();
    p1 = symbol(NIL);
    p2 = symbol(NIL);
    unique_f(p);
    if (p2 !== symbol(NIL)) {
      p1 = symbol(NIL);
    }
    p = p1;
    restore();
    return p;
  };

  unique_f = function(p) {
    if (isstr(p)) {
      if (p1 === symbol(NIL)) {
        p1 = p;
      } else if (p !== p1) {
        p2 = p;
      }
      return;
    }
    while (iscons(p)) {
      unique_f(car(p));
      if (p2 !== symbol(NIL)) {
        return;
      }
      p = cdr(p);
    }
  };

  ssqrt = function() {
    push_rational(1, 2);
    return power();
  };

  yyexpand = function() {
    var prev_expanding;
    prev_expanding = expanding;
    expanding = 1;
    Eval();
    return expanding = prev_expanding;
  };

  exponential = function() {
    push_symbol(E);
    swap();
    return power();
  };

  square = function() {
    push_integer(2);
    return power();
  };

  sort_stack = function(n) {
    var h, subsetOfStack;
    h = tos - n;
    subsetOfStack = stack.slice(h, h + n);
    subsetOfStack.sort(cmp_expr);
    return stack = stack.slice(0, h).concat(subsetOfStack).concat(stack.slice(h + n));
  };

  $.equal = equal;

  $.length = length;

  mmul = function(a, b) {
    return a.multiply(b);
  };

  mdiv = function(a, b) {
    return a.divide(b);
  };


  /*
  static void
  addf(unsigned int *a, unsigned int *b, int len)
  {
    int i
    long long t = 0; # can be signed or unsigned 
    for (i = 0; i < len; i++) {
      t += (long long) a[i] + b[i]
      a[i] = (unsigned int) t
      t >>= 32
    }
  }
  
  // a = a - b
  
  static void
  subf(unsigned int *a, unsigned int *b, int len)
  {
    int i
    long long t = 0; # must be signed
    for (i = 0; i < len; i++) {
      t += (long long) a[i] - b[i]
      a[i] = (unsigned int) t
      t >>= 32
    }
  }
  
  // a = b * c
  
  // 0xffffffff + 0xffffffff * 0xffffffff == 0xffffffff00000000
  
  static void
  mulf(unsigned int *a, unsigned int *b, int len, unsigned int c)
  {
    int i
    unsigned long long t = 0; # must be unsigned
    for (i = 0; i < len; i++) {
      t += (unsigned long long) b[i] * c
      a[i] = (unsigned int) t
      t >>= 32
    }
    a[i] = (unsigned int) t
  }
   */

  mmod = function(a, b) {
    return a.mod(b);
  };

  mdivrem = function(a, b) {
    var toReturn;
    toReturn = a.divmod(b);
    return [toReturn.quotient, toReturn.remainder];
  };

  Eval_mod = function() {
    push(cadr(p1));
    Eval();
    push(caddr(p1));
    Eval();
    return mod();
  };

  mod = function() {
    var n;
    n = 0;
    save();
    p2 = pop();
    p1 = pop();
    if (isZeroAtomOrTensor(p2)) {
      stop("mod function: divide by zero");
    }
    if (!isNumericAtom(p1) || !isNumericAtom(p2)) {
      push_symbol(MOD);
      push(p1);
      push(p2);
      list(3);
      restore();
      return;
    }
    if (isdouble(p1)) {
      push(p1);
      n = pop_integer();
      if (isNaN(n)) {
        stop("mod function: cannot convert float value to integer");
      }
      push_integer(n);
      p1 = pop();
    }
    if (isdouble(p2)) {
      push(p2);
      n = pop_integer();
      if (isNaN(n)) {
        stop("mod function: cannot convert float value to integer");
      }
      push_integer(n);
      p2 = pop();
    }
    if (!isinteger(p1) || !isinteger(p2)) {
      stop("mod function: integer arguments expected");
    }
    p3 = new U();
    p3.k = NUM;
    p3.q.a = mmod(p1.q.a, p2.q.a);
    p3.q.b = mint(1);
    push(p3);
    return restore();
  };

  mpow = function(a, n) {
    return a.pow(n);
  };

  mprime = function(n) {
    return n.isProbablePrime();
  };

  mroot = function(n, index) {
    var i, j, k, o, ref, x, y;
    n = n.abs();
    i = 0;
    j = 0;
    k = 0;
    if (index === 0) {
      stop("root index is zero");
    }
    k = 0;
    while (n.shiftRight(k) > 0) {
      k++;
    }
    if (k === 0) {
      return mint(0);
    }
    k = Math.floor((k - 1) / index);
    j = Math.floor(k / 32 + 1);
    x = bigInt(j);
    for (i = o = 0, ref = j; 0 <= ref ? o < ref : o > ref; i = 0 <= ref ? ++o : --o) {
      x = x.and(bigInt(1).shiftLeft(i).not());
    }
    while (k >= 0) {
      x = x.or(bigInt(1).shiftLeft(k));
      y = mpow(x, index);
      switch (mcmp(y, n)) {
        case 0:
          return x;
        case 1:
          x = x.and(bigInt(1).shiftLeft(k).not());
      }
      k--;
    }
    return 0;
  };

  Eval_multiply = function() {
    var results;
    push(cadr(p1));
    Eval();
    p1 = cddr(p1);
    results = [];
    while (iscons(p1)) {
      push(car(p1));
      Eval();
      multiply();
      results.push(p1 = cdr(p1));
    }
    return results;
  };

  multiply = function() {
    if (esc_flag) {
      stop("escape key stop");
    }
    if (isNumericAtom(stack[tos - 2]) && isNumericAtom(stack[tos - 1])) {
      return multiply_numbers();
    } else {
      save();
      yymultiply();
      return restore();
    }
  };

  yymultiply = function() {
    var h, i, n, o, ref, ref1;
    h = 0;
    i = 0;
    n = 0;
    p2 = pop();
    p1 = pop();
    h = tos;
    if (isZeroAtom(p1) || isZeroAtom(p2)) {
      if (evaluatingAsFloats) {
        push_double(0.0);
      } else {
        push(zero);
      }
      return;
    }
    if (expanding && isadd(p1)) {
      p1 = cdr(p1);
      if (evaluatingAsFloats) {
        push_double(0.0);
      } else {
        push(zero);
      }
      while (iscons(p1)) {
        push(car(p1));
        push(p2);
        multiply();
        add();
        p1 = cdr(p1);
      }
      return;
    }
    if (expanding && isadd(p2)) {
      p2 = cdr(p2);
      if (evaluatingAsFloats) {
        push_double(0.0);
      } else {
        push(zero);
      }
      while (iscons(p2)) {
        push(p1);
        push(car(p2));
        multiply();
        add();
        p2 = cdr(p2);
      }
      return;
    }
    if (!istensor(p1) && istensor(p2)) {
      push(p1);
      push(p2);
      scalar_times_tensor();
      return;
    }
    if (istensor(p1) && !istensor(p2)) {
      push(p1);
      push(p2);
      tensor_times_scalar();
      return;
    }
    if (car(p1) === symbol(MULTIPLY)) {
      p1 = cdr(p1);
    } else {
      push(p1);
      list(1);
      p1 = pop();
    }
    if (car(p2) === symbol(MULTIPLY)) {
      p2 = cdr(p2);
    } else {
      push(p2);
      list(1);
      p2 = pop();
    }
    if (isNumericAtom(car(p1)) && isNumericAtom(car(p2))) {
      push(car(p1));
      push(car(p2));
      multiply_numbers();
      p1 = cdr(p1);
      p2 = cdr(p2);
    } else if (isNumericAtom(car(p1))) {
      push(car(p1));
      p1 = cdr(p1);
    } else if (isNumericAtom(car(p2))) {
      push(car(p2));
      p2 = cdr(p2);
    } else {
      if (evaluatingAsFloats) {
        push_double(1.0);
      } else {
        push(one);
      }
    }
    parse_p1();
    parse_p2();
    while (iscons(p1) && iscons(p2)) {
      if (caar(p1) === symbol(OPERATOR) && caar(p2) === symbol(OPERATOR)) {
        push_symbol(OPERATOR);
        push(cdar(p1));
        push(cdar(p2));
        append();
        cons();
        p1 = cdr(p1);
        p2 = cdr(p2);
        parse_p1();
        parse_p2();
        continue;
      }
      switch (cmp_expr(p3, p4)) {
        case -1:
          push(car(p1));
          p1 = cdr(p1);
          parse_p1();
          break;
        case 1:
          push(car(p2));
          p2 = cdr(p2);
          parse_p2();
          break;
        case 0:
          combine_factors(h);
          p1 = cdr(p1);
          p2 = cdr(p2);
          parse_p1();
          parse_p2();
          break;
        default:
          stop("internal error 2");
      }
    }
    while (iscons(p1)) {
      push(car(p1));
      p1 = cdr(p1);
    }
    while (iscons(p2)) {
      push(car(p2));
      p2 = cdr(p2);
    }
    __normalize_radical_factors(h);
    if (expanding) {
      for (i = o = ref = h, ref1 = tos; ref <= ref1 ? o < ref1 : o > ref1; i = ref <= ref1 ? ++o : --o) {
        if (isadd(stack[i])) {
          multiply_all(tos - h);
          return;
        }
      }
    }
    n = tos - h;
    if (n === 1) {
      return;
    }
    if (isrational(stack[h]) && equaln(stack[h], 1)) {
      if (n === 2) {
        p7 = pop();
        pop();
        push(p7);
      } else {
        stack[h] = symbol(MULTIPLY);
        list(n);
      }
      return;
    }
    list(n);
    p7 = pop();
    push_symbol(MULTIPLY);
    push(p7);
    return cons();
  };

  parse_p1 = function() {
    p3 = car(p1);
    p5 = evaluatingAsFloats ? one_as_double : one;
    if (car(p3) === symbol(POWER)) {
      p5 = caddr(p3);
      return p3 = cadr(p3);
    }
  };

  parse_p2 = function() {
    p4 = car(p2);
    p6 = evaluatingAsFloats ? one_as_double : one;
    if (car(p4) === symbol(POWER)) {
      p6 = caddr(p4);
      return p4 = cadr(p4);
    }
  };

  combine_factors = function(h) {
    push(p4);
    push(p5);
    push(p6);
    add();
    power();
    p7 = pop();
    if (isNumericAtom(p7)) {
      push(stack[h]);
      push(p7);
      multiply_numbers();
      return stack[h] = pop();
    } else if (car(p7) === symbol(MULTIPLY)) {
      if (isNumericAtom(cadr(p7)) && cdddr(p7) === symbol(NIL)) {
        push(stack[h]);
        push(cadr(p7));
        multiply_numbers();
        stack[h] = pop();
        return push(caddr(p7));
      } else {
        return push(p7);
      }
    } else {
      return push(p7);
    }
  };

  gp = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, -6, -7, -8, -3, -4, -5, 13, 14, 15, -16, 9, 10, 11, -12], [0, 0, 6, -1, -11, 10, -2, -15, 14, 12, -5, 4, -9, 16, -8, 7, -13], [0, 0, 7, 11, -1, -9, 15, -2, -13, 5, 12, -3, -10, 8, 16, -6, -14], [0, 0, 8, -10, 9, -1, -14, 13, -2, -4, 3, 12, -11, -7, 6, 16, -15], [0, 0, 3, 2, 15, -14, 1, 11, -10, 16, -8, 7, 13, 12, -5, 4, 9], [0, 0, 4, -15, 2, 13, -11, 1, 9, 8, 16, -6, 14, 5, 12, -3, 10], [0, 0, 5, 14, -13, 2, 10, -9, 1, -7, 6, 16, 15, -4, 3, 12, 11], [0, 0, 13, 12, -5, 4, 16, -8, 7, -1, -11, 10, -3, -2, -15, 14, -6], [0, 0, 14, 5, 12, -3, 8, 16, -6, 11, -1, -9, -4, 15, -2, -13, -7], [0, 0, 15, -4, 3, 12, -7, 6, 16, -10, 9, -1, -5, -14, 13, -2, -8], [0, 0, 16, -9, -10, -11, -13, -14, -15, -3, -4, -5, 1, -6, -7, -8, 2], [0, 0, 9, -16, 8, -7, -12, 5, -4, -2, -15, 14, 6, -1, -11, 10, 3], [0, 0, 10, -8, -16, 6, -5, -12, 3, 15, -2, -13, 7, 11, -1, -9, 4], [0, 0, 11, 7, -6, -16, 4, -3, -12, -14, 13, -2, 8, -10, 9, -1, 5], [0, 0, 12, 13, 14, 15, 9, 10, 11, -6, -7, -8, -2, -3, -4, -5, -1]];

  combine_gammas = function(h) {
    var n;
    n = gp[Math.floor(p1.gamma)][Math.floor(p2.gamma)];
    if (n < 0) {
      n = -n;
      push(stack[h]);
      negate();
      stack[h] = pop();
    }
    if (n > 1) {
      return push(_gamma[n]);
    }
  };

  multiply_noexpand = function() {
    var prev_expanding;
    prev_expanding = expanding;
    expanding = 0;
    multiply();
    return expanding = prev_expanding;
  };

  multiply_all = function(n) {
    var h, i, o, ref;
    i = 0;
    if (n === 1) {
      return;
    }
    if (n === 0) {
      push(evaluatingAsFloats ? one_as_double : one);
      return;
    }
    h = tos - n;
    push(stack[h]);
    for (i = o = 1, ref = n; 1 <= ref ? o < ref : o > ref; i = 1 <= ref ? ++o : --o) {
      push(stack[h + i]);
      multiply();
    }
    stack[h] = pop();
    return moveTos(h + 1);
  };

  multiply_all_noexpand = function(n) {
    var prev_expanding;
    prev_expanding = expanding;
    expanding = 0;
    multiply_all(n);
    return expanding = prev_expanding;
  };

  divide = function() {
    if (isNumericAtom(stack[tos - 2]) && isNumericAtom(stack[tos - 1])) {
      return divide_numbers();
    } else {
      inverse();
      return multiply();
    }
  };

  inverse = function() {
    if (isNumericAtom(stack[tos - 1])) {
      return invert_number();
    } else {
      push_integer(-1);
      return power();
    }
  };

  reciprocate = function() {
    return inverse();
  };

  negate = function() {
    if (isNumericAtom(stack[tos - 1])) {
      return negate_number();
    } else {
      if (evaluatingAsFloats) {
        push_double(-1.0);
      } else {
        push_integer(-1);
      }
      return multiply();
    }
  };

  negate_expand = function() {
    var prev_expanding;
    prev_expanding = expanding;
    expanding = 1;
    negate();
    return expanding = prev_expanding;
  };

  negate_noexpand = function() {
    var prev_expanding;
    prev_expanding = expanding;
    expanding = 0;
    negate();
    return expanding = prev_expanding;
  };

  __normalize_radical_factors = function(h) {
    var i, i1, j1, o, ref, ref1, ref2, ref3, ref4, ref5;
    i = 0;
    if (isplusone(stack[h]) || isminusone(stack[h]) || isdouble(stack[h])) {
      return;
    }
    for (i = o = ref = h + 1, ref1 = tos; ref <= ref1 ? o < ref1 : o > ref1; i = ref <= ref1 ? ++o : --o) {
      if (__is_radical_number(stack[i])) {
        break;
      }
    }
    if (i === tos) {
      return;
    }
    save();
    push(stack[h]);
    mp_numerator();
    p1 = pop();
    for (i = i1 = ref2 = h + 1, ref3 = tos; ref2 <= ref3 ? i1 < ref3 : i1 > ref3; i = ref2 <= ref3 ? ++i1 : --i1) {
      if (isplusone(p1) || isminusone(p1)) {
        break;
      }
      if (!__is_radical_number(stack[i])) {
        continue;
      }
      p3 = cadr(stack[i]);
      p4 = caddr(stack[i]);
      if (!isnegativenumber(p4)) {
        continue;
      }
      push(p1);
      push(p3);
      divide();
      p5 = pop();
      if (!isinteger(p5)) {
        continue;
      }
      p1 = p5;
      push_symbol(POWER);
      push(p3);
      push(evaluatingAsFloats ? one_as_double : one);
      push(p4);
      add();
      list(3);
      stack[i] = pop();
    }
    push(stack[h]);
    mp_denominator();
    p2 = pop();
    for (i = j1 = ref4 = h + 1, ref5 = tos; ref4 <= ref5 ? j1 < ref5 : j1 > ref5; i = ref4 <= ref5 ? ++j1 : --j1) {
      if (isplusone(p2)) {
        break;
      }
      if (!__is_radical_number(stack[i])) {
        continue;
      }
      p3 = cadr(stack[i]);
      p4 = caddr(stack[i]);
      if (isnegativenumber(p4)) {
        continue;
      }
      push(p2);
      push(p3);
      divide();
      p5 = pop();
      if (!isinteger(p5)) {
        continue;
      }
      p2 = p5;
      push_symbol(POWER);
      push(p3);
      push(p4);
      push(one);
      subtract();
      if (dontCreateNewRadicalsInDenominatorWhenEvalingMultiplication) {
        if (isinteger(p3) && !isinteger(stack[tos - 1]) && isnegativenumber(stack[tos - 1])) {
          pop();
          pop();
          pop();
          push(p1);
          push(p3);
          divide();
          p1 = pop();
          break;
        }
      }
      list(3);
      stack[i] = pop();
    }
    push(p1);
    push(p2);
    divide();
    stack[h] = pop();
    return restore();
  };

  __is_radical_number = function(p) {
    if (car(p) === symbol(POWER) && isNumericAtom(cadr(p)) && isNumericAtom(caddr(p)) && !isminusone(cadr(p))) {
      return 1;
    } else {
      return 0;
    }
  };

  NROOTS_YMAX = 101;

  NROOTS_DELTA = 1.0e-6;

  NROOTS_EPSILON = 1.0e-9;

  NROOTS_ABS = function(z) {
    return Math.sqrt(z.r * z.r + z.i * z.i);
  };

  theRandom = 0.0;

  NROOTS_RANDOM = function() {
    return 4.0 * Math.random() - 2.0;
  };

  numericRootOfPolynomial = (function() {
    function numericRootOfPolynomial() {}

    numericRootOfPolynomial.prototype.r = 0.0;

    numericRootOfPolynomial.prototype.i = 0.0;

    return numericRootOfPolynomial;

  })();

  nroots_a = new numericRootOfPolynomial();

  nroots_b = new numericRootOfPolynomial();

  nroots_x = new numericRootOfPolynomial();

  nroots_y = new numericRootOfPolynomial();

  nroots_fa = new numericRootOfPolynomial();

  nroots_fb = new numericRootOfPolynomial();

  nroots_dx = new numericRootOfPolynomial();

  nroots_df = new numericRootOfPolynomial();

  nroots_c = [];

  for (initNRoots = o = 0, ref = NROOTS_YMAX; 0 <= ref ? o < ref : o > ref; initNRoots = 0 <= ref ? ++o : --o) {
    nroots_c[initNRoots] = new numericRootOfPolynomial();
  }

  Eval_nroots = function() {
    var h, i, i1, j1, k, l1, n, ref1, ref2, ref3;
    h = 0;
    i = 0;
    k = 0;
    n = 0;
    push(cadr(p1));
    Eval();
    push(caddr(p1));
    Eval();
    p2 = pop();
    if (p2 === symbol(NIL)) {
      guess();
    } else {
      push(p2);
    }
    p2 = pop();
    p1 = pop();
    if (!ispolyexpandedform(p1, p2)) {
      stop("nroots: polynomial?");
    }
    h = tos;
    push(p1);
    push(p2);
    n = coeff();
    if (n > NROOTS_YMAX) {
      stop("nroots: degree?");
    }
    for (i = i1 = 0, ref1 = n; 0 <= ref1 ? i1 < ref1 : i1 > ref1; i = 0 <= ref1 ? ++i1 : --i1) {
      push(stack[h + i]);
      real();
      yyfloat();
      Eval();
      p1 = pop();
      push(stack[h + i]);
      imag();
      yyfloat();
      Eval();
      p2 = pop();
      if (!isdouble(p1) || !isdouble(p2)) {
        stop("nroots: coefficients?");
      }
      nroots_c[i].r = p1.d;
      nroots_c[i].i = p2.d;
    }
    moveTos(h);
    monic(n);
    for (k = j1 = ref2 = n; j1 > 1; k = j1 += -1) {
      findroot(k);
      if (Math.abs(nroots_a.r) < NROOTS_DELTA) {
        nroots_a.r = 0.0;
      }
      if (Math.abs(nroots_a.i) < NROOTS_DELTA) {
        nroots_a.i = 0.0;
      }
      push_double(nroots_a.r);
      push_double(nroots_a.i);
      push(imaginaryunit);
      multiply();
      add();
      NROOTS_divpoly(k);
    }
    n = tos - h;
    if (n > 1) {
      sort_stack(n);
      p1 = alloc_tensor(n);
      p1.tensor.ndim = 1;
      p1.tensor.dim[0] = n;
      for (i = l1 = 0, ref3 = n; 0 <= ref3 ? l1 < ref3 : l1 > ref3; i = 0 <= ref3 ? ++l1 : --l1) {
        p1.tensor.elem[i] = stack[h + i];
      }
      moveTos(h);
      return push(p1);
    }
  };

  monic = function(n) {
    var i1, k, ref1, t;
    k = 0;
    t = 0.0;
    nroots_y.r = nroots_c[n - 1].r;
    nroots_y.i = nroots_c[n - 1].i;
    t = nroots_y.r * nroots_y.r + nroots_y.i * nroots_y.i;
    for (k = i1 = 0, ref1 = n - 1; 0 <= ref1 ? i1 < ref1 : i1 > ref1; k = 0 <= ref1 ? ++i1 : --i1) {
      nroots_c[k].r = (nroots_c[k].r * nroots_y.r + nroots_c[k].i * nroots_y.i) / t;
      nroots_c[k].i = (nroots_c[k].i * nroots_y.r - nroots_c[k].r * nroots_y.i) / t;
    }
    nroots_c[n - 1].r = 1.0;
    return nroots_c[n - 1].i = 0.0;
  };

  findroot = function(n) {
    var i1, j, j1, k, nrabs, t;
    j = 0;
    k = 0;
    t = 0.0;
    if (NROOTS_ABS(nroots_c[0]) < NROOTS_DELTA) {
      nroots_a.r = 0.0;
      nroots_a.i = 0.0;
      return;
    }
    for (j = i1 = 0; i1 < 100; j = ++i1) {
      nroots_a.r = NROOTS_RANDOM();
      nroots_a.i = NROOTS_RANDOM();
      compute_fa(n);
      nroots_b.r = nroots_a.r;
      nroots_b.i = nroots_a.i;
      nroots_fb.r = nroots_fa.r;
      nroots_fb.i = nroots_fa.i;
      nroots_a.r = NROOTS_RANDOM();
      nroots_a.i = NROOTS_RANDOM();
      for (k = j1 = 0; j1 < 1000; k = ++j1) {
        compute_fa(n);
        nrabs = NROOTS_ABS(nroots_fa);
        if (DEBUG) {
          console.log("nrabs: " + nrabs);
        }
        if (nrabs < NROOTS_EPSILON) {
          return;
        }
        if (NROOTS_ABS(nroots_fa) < NROOTS_ABS(nroots_fb)) {
          nroots_x.r = nroots_a.r;
          nroots_x.i = nroots_a.i;
          nroots_a.r = nroots_b.r;
          nroots_a.i = nroots_b.i;
          nroots_b.r = nroots_x.r;
          nroots_b.i = nroots_x.i;
          nroots_x.r = nroots_fa.r;
          nroots_x.i = nroots_fa.i;
          nroots_fa.r = nroots_fb.r;
          nroots_fa.i = nroots_fb.i;
          nroots_fb.r = nroots_x.r;
          nroots_fb.i = nroots_x.i;
        }
        nroots_dx.r = nroots_b.r - nroots_a.r;
        nroots_dx.i = nroots_b.i - nroots_a.i;
        nroots_df.r = nroots_fb.r - nroots_fa.r;
        nroots_df.i = nroots_fb.i - nroots_fa.i;
        t = nroots_df.r * nroots_df.r + nroots_df.i * nroots_df.i;
        if (t === 0.0) {
          break;
        }
        nroots_y.r = (nroots_dx.r * nroots_df.r + nroots_dx.i * nroots_df.i) / t;
        nroots_y.i = (nroots_dx.i * nroots_df.r - nroots_dx.r * nroots_df.i) / t;
        nroots_a.r = nroots_b.r - (nroots_y.r * nroots_fb.r - nroots_y.i * nroots_fb.i);
        nroots_a.i = nroots_b.i - (nroots_y.r * nroots_fb.i + nroots_y.i * nroots_fb.r);
      }
    }
    return stop("nroots: convergence error");
  };

  compute_fa = function(n) {
    var i1, k, ref1, results, t;
    k = 0;
    t = 0.0;
    nroots_x.r = nroots_a.r;
    nroots_x.i = nroots_a.i;
    nroots_fa.r = nroots_c[0].r + nroots_c[1].r * nroots_x.r - nroots_c[1].i * nroots_x.i;
    nroots_fa.i = nroots_c[0].i + nroots_c[1].r * nroots_x.i + nroots_c[1].i * nroots_x.r;
    results = [];
    for (k = i1 = 2, ref1 = n; 2 <= ref1 ? i1 < ref1 : i1 > ref1; k = 2 <= ref1 ? ++i1 : --i1) {
      t = nroots_a.r * nroots_x.r - nroots_a.i * nroots_x.i;
      nroots_x.i = nroots_a.r * nroots_x.i + nroots_a.i * nroots_x.r;
      nroots_x.r = t;
      nroots_fa.r += nroots_c[k].r * nroots_x.r - nroots_c[k].i * nroots_x.i;
      results.push(nroots_fa.i += nroots_c[k].r * nroots_x.i + nroots_c[k].i * nroots_x.r);
    }
    return results;
  };

  NROOTS_divpoly = function(n) {
    var i1, j1, k, ref1, ref2, results;
    k = 0;
    for (k = i1 = ref1 = n - 1; ref1 <= 0 ? i1 < 0 : i1 > 0; k = ref1 <= 0 ? ++i1 : --i1) {
      nroots_c[k - 1].r += nroots_c[k].r * nroots_a.r - nroots_c[k].i * nroots_a.i;
      nroots_c[k - 1].i += nroots_c[k].i * nroots_a.r + nroots_c[k].r * nroots_a.i;
    }
    if (NROOTS_ABS(nroots_c[0]) > NROOTS_DELTA) {
      stop("nroots: residual error");
    }
    results = [];
    for (k = j1 = 0, ref2 = n - 1; 0 <= ref2 ? j1 < ref2 : j1 > ref2; k = 0 <= ref2 ? ++j1 : --j1) {
      nroots_c[k].r = nroots_c[k + 1].r;
      results.push(nroots_c[k].i = nroots_c[k + 1].i);
    }
    return results;
  };

  Eval_numerator = function() {
    push(cadr(p1));
    Eval();
    return numerator();
  };

  numerator = function() {
    var h, theArgument;
    h = 0;
    theArgument = pop();
    if (car(theArgument) === symbol(ADD)) {
      push(theArgument);
      rationalize();
      theArgument = pop();
    }
    if (car(theArgument) === symbol(MULTIPLY) && !isplusone(car(cdr(theArgument)))) {
      h = tos;
      theArgument = cdr(theArgument);
      while (iscons(theArgument)) {
        push(car(theArgument));
        numerator();
        theArgument = cdr(theArgument);
      }
      return multiply_all(tos - h);
    } else if (isrational(theArgument)) {
      push(theArgument);
      return mp_numerator();
    } else if (car(theArgument) === symbol(POWER) && isnegativeterm(caddr(theArgument))) {
      return push(one);
    } else {
      return push(theArgument);
    }
  };

  Eval_outer = function() {
    var results;
    p1 = cdr(p1);
    push(car(p1));
    Eval();
    p1 = cdr(p1);
    results = [];
    while (iscons(p1)) {
      push(car(p1));
      Eval();
      outer();
      results.push(p1 = cdr(p1));
    }
    return results;
  };

  outer = function() {
    save();
    p2 = pop();
    p1 = pop();
    if (istensor(p1) && istensor(p2)) {
      yyouter();
    } else {
      push(p1);
      push(p2);
      if (istensor(p1)) {
        tensor_times_scalar();
      } else if (istensor(p2)) {
        scalar_times_tensor();
      } else {
        multiply();
      }
    }
    return restore();
  };

  yyouter = function() {
    var i, i1, j, j1, k, l1, m1, ndim, nelem, ref1, ref2, ref3, ref4;
    i = 0;
    j = 0;
    k = 0;
    ndim = 0;
    nelem = 0;
    ndim = p1.tensor.ndim + p2.tensor.ndim;
    if (ndim > MAXDIM) {
      stop("outer: rank of result exceeds maximum");
    }
    nelem = p1.tensor.nelem * p2.tensor.nelem;
    p3 = alloc_tensor(nelem);
    p3.tensor.ndim = ndim;
    for (i = i1 = 0, ref1 = p1.tensor.ndim; 0 <= ref1 ? i1 < ref1 : i1 > ref1; i = 0 <= ref1 ? ++i1 : --i1) {
      p3.tensor.dim[i] = p1.tensor.dim[i];
    }
    j = i;
    for (i = j1 = 0, ref2 = p2.tensor.ndim; 0 <= ref2 ? j1 < ref2 : j1 > ref2; i = 0 <= ref2 ? ++j1 : --j1) {
      p3.tensor.dim[j + i] = p2.tensor.dim[i];
    }
    k = 0;
    for (i = l1 = 0, ref3 = p1.tensor.nelem; 0 <= ref3 ? l1 < ref3 : l1 > ref3; i = 0 <= ref3 ? ++l1 : --l1) {
      for (j = m1 = 0, ref4 = p2.tensor.nelem; 0 <= ref4 ? m1 < ref4 : m1 > ref4; j = 0 <= ref4 ? ++m1 : --m1) {
        push(p1.tensor.elem[i]);
        push(p2.tensor.elem[j]);
        multiply();
        p3.tensor.elem[k++] = pop();
      }
    }
    return push(p3);
  };


  /*
   Partition a term
  
    Input stack:
  
      term (factor or product of factors)
  
      free variable
  
    Output stack:
  
      constant expression
  
      variable expression
   */

  partition = function() {
    save();
    p2 = pop();
    p1 = pop();
    push_integer(1);
    p3 = pop();
    p4 = p3;
    p1 = cdr(p1);
    while (iscons(p1)) {
      if (Find(car(p1), p2)) {
        push(p4);
        push(car(p1));
        multiply();
        p4 = pop();
      } else {
        push(p3);
        push(car(p1));
        multiply();
        p3 = pop();
      }
      p1 = cdr(p1);
    }
    push(p3);
    push(p4);
    return restore();
  };


  /*
    Add a pattern i.e. a substitution rule.
    Substitution rule needs a template as first argument
    and what to transform it to as second argument.
    Optional third argument is a boolean test which
    adds conditions to when the rule is applied.
   */

  Eval_silentpattern = function() {
    Eval_pattern();
    pop();
    return push_symbol(NIL);
  };

  Eval_pattern = function() {
    var firstArgument, patternPosition, secondArgument, stringKey, thirdArgument;
    if (!iscons(cdr(p1))) {
      stop("pattern needs at least a template and a transformed version");
    }
    firstArgument = car(cdr(p1));
    secondArgument = car(cdr(cdr(p1)));
    if (secondArgument === symbol(NIL)) {
      stop("pattern needs at least a template and a transformed version");
    }
    if (!iscons(cdr(cdr(p1)))) {
      thirdArgument = symbol(NIL);
    } else {
      thirdArgument = car(cdr(cdr(cdr(p1))));
    }
    if (equal(firstArgument, secondArgument)) {
      stop("recursive pattern");
    }
    stringKey = "template: " + print_list(firstArgument);
    stringKey += " tests: " + print_list(thirdArgument);
    if (DEBUG) {
      console.log("pattern stringkey: " + stringKey);
    }
    patternPosition = userSimplificationsInStringForm.indexOf(stringKey);
    if (patternPosition === -1) {
      userSimplificationsInStringForm.push(stringKey);
      userSimplificationsInListForm.push(cdr(p1));
    } else {
      if (DEBUG) {
        console.log("pattern already exists, replacing. " + cdr(p1));
      }
      userSimplificationsInStringForm[patternPosition] = stringKey;
      userSimplificationsInListForm[patternPosition] = cdr(p1);
    }
    push_symbol(PATTERN);
    push(cdr(p1));
    return list(2);
  };


  /*
    Clear all patterns
   */

  do_clearPatterns = function() {
    userSimplificationsInListForm = [];
    return userSimplificationsInStringForm = [];
  };

  Eval_clearpatterns = function() {
    do_clearPatterns();
    return push_symbol(NIL);
  };

  Eval_patternsinfo = function() {
    var patternsinfoToBePrinted;
    patternsinfoToBePrinted = patternsinfo();
    if (patternsinfoToBePrinted !== "") {
      return new_string(patternsinfoToBePrinted);
    } else {
      return push_symbol(NIL);
    }
  };

  patternsinfo = function() {
    var i, i1, len, patternsinfoToBePrinted;
    patternsinfoToBePrinted = "";
    for (i1 = 0, len = userSimplificationsInListForm.length; i1 < len; i1++) {
      i = userSimplificationsInListForm[i1];
      patternsinfoToBePrinted += userSimplificationsInListForm + "\n";
    }
    return patternsinfoToBePrinted;
  };


  /*
  Convert complex z to polar form
  
    Input:    push  z
  
    Output:    Result on stack
  
    polar(z) = abs(z) * exp(i * arg(z))
   */

  Eval_polar = function() {
    push(cadr(p1));
    Eval();
    return polar();
  };

  polar = function() {
    evaluatingPolar++;
    save();
    p1 = pop();
    push(p1);
    abs();
    push(imaginaryunit);
    push(p1);
    arg();
    multiply();
    exponential();
    multiply();
    evaluatingPolar--;
    return restore();
  };

  n_factor_number = 0;

  factor_number = function() {
    var h;
    h = 0;
    save();
    p1 = pop();
    if (equaln(p1, 0) || equaln(p1, 1) || equaln(p1, -1)) {
      push(p1);
      restore();
      return;
    }
    n_factor_number = p1.q.a;
    h = tos;
    factor_a();
    if (tos - h > 1) {
      list(tos - h);
      push_symbol(MULTIPLY);
      swap();
      cons();
    }
    return restore();
  };

  factor_a = function() {
    var i1, k;
    k = 0;
    if (n_factor_number.isNegative()) {
      n_factor_number = setSignTo(n_factor_number, 1);
      push_integer(-1);
    }
    for (k = i1 = 0; i1 < 10000; k = ++i1) {
      try_kth_prime(k);
      if (n_factor_number.compare(1) === 0) {
        return;
      }
    }
    return factor_b();
  };

  try_kth_prime = function(k) {
    var count, d, q, r, ref1;
    count = 0;
    d = mint(primetab[k]);
    count = 0;
    while (1) {
      if (n_factor_number.compare(1) === 0) {
        if (count) {
          push_factor(d, count);
        }
        return;
      }
      ref1 = mdivrem(n_factor_number, d), q = ref1[0], r = ref1[1];
      if (r.isZero()) {
        count++;
        n_factor_number = q;
      } else {
        break;
      }
    }
    if (count) {
      push_factor(d, count);
    }
    if (mcmp(q, d) === -1) {
      push_factor(n_factor_number, 1);
      return n_factor_number = mint(1);
    }
  };

  factor_b = function() {
    var bigint_one, g, k, l, t, x, xprime;
    k = 0;
    l = 0;
    bigint_one = mint(1);
    x = mint(5);
    xprime = mint(2);
    k = 1;
    l = 1;
    while (1) {
      if (mprime(n_factor_number)) {
        push_factor(n_factor_number, 1);
        return 0;
      }
      while (1) {
        if (esc_flag) {
          stop("esc");
        }
        t = msub(xprime, x);
        t = setSignTo(t, 1);
        g = mgcd(t, n_factor_number);
        if (MEQUAL(g, 1)) {
          if (--k === 0) {
            xprime = x;
            l *= 2;
            k = l;
          }
          t = mmul(x, x);
          x = madd(t, bigint_one);
          t = mmod(x, n_factor_number);
          x = t;
          continue;
        }
        push_factor(g, 1);
        if (mcmp(g, n_factor_number) === 0) {
          return -1;
        }
        t = mdiv(n_factor_number, g);
        n_factor_number = t;
        t = mmod(x, n_factor_number);
        x = t;
        t = mmod(xprime, n_factor_number);
        xprime = t;
        break;
      }
    }
  };

  push_factor = function(d, count) {
    p1 = new U();
    p1.k = NUM;
    p1.q.a = d;
    p1.q.b = mint(1);
    push(p1);
    if (count > 1) {
      push_symbol(POWER);
      swap();
      p1 = new U();
      p1.k = NUM;
      p1.q.a = mint(count);
      p1.q.b = mint(1);
      push(p1);
      return list(3);
    }
  };


  /* Power function
  
    Input:    push  Base
  
        push  Exponent
  
    Output:    Result on stack
   */

  DEBUG_POWER = false;

  Eval_power = function() {
    if (DEBUG_POWER) {
      debugger;
    }
    push(cadr(p1));
    Eval();
    push(caddr(p1));
    Eval();
    return power();
  };

  power = function() {
    save();
    yypower();
    return restore();
  };

  yypower = function() {
    var b_isEven_and_c_isItsInverse, hopefullySimplified, inputBase, inputExp, isThisOne, is_a_moreThanZero, n;
    if (DEBUG_POWER) {
      debugger;
    }
    n = 0;
    p2 = pop();
    p1 = pop();
    inputExp = p2;
    inputBase = p1;
    if (DEBUG_POWER) {
      console.log("POWER: " + p1 + " ^ " + p2);
    }
    if (equal(p1, one) || isZeroAtomOrTensor(p2)) {
      if (evaluatingAsFloats) {
        push_double(1.0);
      } else {
        push(one);
      }
      if (DEBUG_POWER) {
        console.log("   power of " + inputBase + " ^ " + inputExp + ": " + stack[tos - 1]);
      }
      return;
    }
    if (equal(p2, one)) {
      push(p1);
      if (DEBUG_POWER) {
        console.log("   power of " + inputBase + " ^ " + inputExp + ": " + stack[tos - 1]);
      }
      return;
    }
    if (isminusone(p1) && isminusone(p2)) {
      if (evaluatingAsFloats) {
        push_double(1.0);
      } else {
        push(one);
      }
      negate();
      if (DEBUG_POWER) {
        console.log("   power of " + inputBase + " ^ " + inputExp + ": " + stack[tos - 1]);
      }
      return;
    }
    if (isminusone(p1) && (isoneovertwo(p2))) {
      push(imaginaryunit);
      if (DEBUG_POWER) {
        console.log("   power of " + inputBase + " ^ " + inputExp + ": " + stack[tos - 1]);
      }
      return;
    }
    if (isminusone(p1) && isminusoneovertwo(p2)) {
      push(imaginaryunit);
      negate();
      if (DEBUG_POWER) {
        console.log("   power of " + inputBase + " ^ " + inputExp + ": " + stack[tos - 1]);
      }
      return;
    }
    if (isminusone(p1) && !isdouble(p1) && isrational(p2) && !isinteger(p2) && ispositivenumber(p2) && !evaluatingAsFloats) {
      if (DEBUG_POWER) {
        console.log("   power: -1 ^ rational");
      }
      if (DEBUG_POWER) {
        console.log(" trick: p2.q.a , p2.q.b " + p2.q.a + " , " + p2.q.b);
      }
      if (p2.q.a < p2.q.b) {
        push_symbol(POWER);
        push(p1);
        push(p2);
        list(3);
      } else {
        push_symbol(MULTIPLY);
        push(p1);
        push_symbol(POWER);
        push(p1);
        push_rational(p2.q.a.mod(p2.q.b), p2.q.b);
        list(3);
        list(3);
        if (DEBUG_POWER) {
          console.log(" trick applied : " + stack[tos - 1]);
        }
      }
      rect();
      if (DEBUG_POWER) {
        console.log("   power of " + inputBase + " ^ " + inputExp + ": " + stack[tos - 1]);
      }
      return;
    }
    if (isrational(p1) && isrational(p2)) {
      if (DEBUG_POWER) {
        console.log("   power: isrational(p1) && isrational(p2)");
      }
      push(p1);
      push(p2);
      qpow();
      if (DEBUG_POWER) {
        console.log("   power of " + inputBase + " ^ " + inputExp + ": " + stack[tos - 1]);
      }
      return;
    }
    if (isNumericAtom(p1) && isNumericAtom(p2)) {
      if (DEBUG_POWER) {
        console.log("   power: both base and exponent are either rational or double ");
      }
      if (DEBUG_POWER) {
        console.log("POWER - isNumericAtom(p1) && isNumericAtom(p2)");
      }
      push(p1);
      push(p2);
      dpow();
      if (DEBUG_POWER) {
        console.log("   power of " + inputBase + " ^ " + inputExp + ": " + stack[tos - 1]);
      }
      return;
    }
    if (istensor(p1)) {
      if (DEBUG_POWER) {
        console.log("   power: istensor(p1) ");
      }
      power_tensor();
      if (DEBUG_POWER) {
        console.log("   power of " + inputBase + " ^ " + inputExp + ": " + stack[tos - 1]);
      }
      return;
    }
    if (car(p1) === symbol(ABS) && iseveninteger(p2) && !isZeroAtomOrTensor(get_binding(symbol(ASSUME_REAL_VARIABLES)))) {
      if (DEBUG_POWER) {
        console.log("   power: even power of absolute of real value ");
      }
      push(cadr(p1));
      push(p2);
      power();
      if (DEBUG_POWER) {
        console.log("   power of " + inputBase + " ^ " + inputExp + ": " + stack[tos - 1]);
      }
      return;
    }
    if (p1 === symbol(E) && car(p2) === symbol(LOG)) {
      push(cadr(p2));
      if (DEBUG_POWER) {
        console.log("   power of " + inputBase + " ^ " + inputExp + ": " + stack[tos - 1]);
      }
      return;
    }
    if (p1 === symbol(E) && isdouble(p2)) {
      if (DEBUG_POWER) {
        console.log("   power: p1 == symbol(E) && isdouble(p2) ");
      }
      push_double(Math.exp(p2.d));
      if (DEBUG_POWER) {
        console.log("   power of " + inputBase + " ^ " + inputExp + ": " + stack[tos - 1]);
      }
      return;
    }
    if (p1 === symbol(E) && Find(p2, imaginaryunit) !== 0 && Find(p2, symbol(PI)) !== 0 && !evaluatingPolar) {
      push_symbol(POWER);
      push(p1);
      push(p2);
      list(3);
      if (DEBUG_POWER) {
        console.log("   power: turning complex exponential to rect: " + stack[tos - 1]);
      }
      rect();
      hopefullySimplified = pop();
      if (Find(hopefullySimplified, symbol(PI)) === 0) {
        if (DEBUG_POWER) {
          console.log("   power: turned complex exponential to rect: " + hopefullySimplified);
        }
        push(hopefullySimplified);
        return;
      }
    }
    if (car(p1) === symbol(MULTIPLY) && isinteger(p2)) {
      if (DEBUG_POWER) {
        console.log("   power: (a * b) ^ c  ->  (a ^ c) * (b ^ c) ");
      }
      p1 = cdr(p1);
      push(car(p1));
      push(p2);
      power();
      p1 = cdr(p1);
      while (iscons(p1)) {
        push(car(p1));
        push(p2);
        power();
        multiply();
        p1 = cdr(p1);
      }
      if (DEBUG_POWER) {
        console.log("   power of " + inputBase + " ^ " + inputExp + ": " + stack[tos - 1]);
      }
      return;
    }
    is_a_moreThanZero = false;
    if (isNumericAtom(cadr(p1))) {
      is_a_moreThanZero = sign(compare_numbers(cadr(p1), zero));
    }
    if (car(p1) === symbol(POWER) && (isinteger(p2) || is_a_moreThanZero)) {
      push(cadr(p1));
      push(caddr(p1));
      push(p2);
      multiply();
      power();
      if (DEBUG_POWER) {
        console.log("   power of " + inputBase + " ^ " + inputExp + ": " + stack[tos - 1]);
      }
      return;
    }
    b_isEven_and_c_isItsInverse = false;
    if (iseveninteger(caddr(p1))) {
      push(caddr(p1));
      push(p2);
      multiply();
      isThisOne = pop();
      if (isone(isThisOne)) {
        b_isEven_and_c_isItsInverse = true;
      }
    }
    if (car(p1) === symbol(POWER) && b_isEven_and_c_isItsInverse) {
      if (DEBUG_POWER) {
        console.log("   power: car(p1) == symbol(POWER) && b_isEven_and_c_isItsInverse ");
      }
      push(cadr(p1));
      abs();
      if (DEBUG_POWER) {
        console.log("   power of " + inputBase + " ^ " + inputExp + ": " + stack[tos - 1]);
      }
      return;
    }
    if (expanding && isadd(p1) && isNumericAtom(p2)) {
      push(p2);
      n = pop_integer();
      if (n > 1 && !isNaN(n)) {
        if (DEBUG_POWER) {
          console.log("   power: expanding && isadd(p1) && isNumericAtom(p2) ");
        }
        power_sum(n);
        if (DEBUG_POWER) {
          console.log("   power of " + inputBase + " ^ " + inputExp + ": " + stack[tos - 1]);
        }
        return;
      }
    }
    if (trigmode === 1 && car(p1) === symbol(SIN) && iseveninteger(p2)) {
      if (DEBUG_POWER) {
        console.log("   power: trigmode == 1 && car(p1) == symbol(SIN) && iseveninteger(p2) ");
      }
      push_integer(1);
      push(cadr(p1));
      cosine();
      push_integer(2);
      power();
      subtract();
      push(p2);
      push_rational(1, 2);
      multiply();
      power();
      if (DEBUG_POWER) {
        console.log("   power of " + inputBase + " ^ " + inputExp + ": " + stack[tos - 1]);
      }
      return;
    }
    if (trigmode === 2 && car(p1) === symbol(COS) && iseveninteger(p2)) {
      if (DEBUG_POWER) {
        console.log("   power: trigmode == 2 && car(p1) == symbol(COS) && iseveninteger(p2) ");
      }
      push_integer(1);
      push(cadr(p1));
      sine();
      push_integer(2);
      power();
      subtract();
      push(p2);
      push_rational(1, 2);
      multiply();
      power();
      if (DEBUG_POWER) {
        console.log("   power of " + inputBase + " ^ " + inputExp + ": " + stack[tos - 1]);
      }
      return;
    }
    if (iscomplexnumber(p1)) {
      if (DEBUG_POWER) {
        console.log(" power - handling the case (a + ib) ^ n");
      }
      if (isinteger(p2)) {
        push(p1);
        conjugate();
        p3 = pop();
        push(p3);
        push(p3);
        push(p1);
        multiply();
        divide();
        if (!isone(p2)) {
          push(p2);
          negate();
          power();
        }
        if (DEBUG_POWER) {
          console.log("   power of " + inputBase + " ^ " + inputExp + ": " + stack[tos - 1]);
        }
        return;
      }
      if (isNumericAtom(p2)) {
        push(p1);
        abs();
        push(p2);
        power();
        push_integer(-1);
        push(p1);
        arg();
        push(p2);
        multiply();
        if (evaluatingAsFloats || (iscomplexnumberdouble(p1) && isdouble(p2))) {
          push_double(Math.PI);
        } else {
          push(symbol(PI));
        }
        divide();
        power();
        multiply();
        if (avoidCalculatingPowersIntoArctans) {
          if (Find(stack[tos - 1], symbol(ARCTAN))) {
            pop();
            push_symbol(POWER);
            push(p1);
            push(p2);
            list(3);
          }
        }
        if (DEBUG_POWER) {
          console.log("   power of " + inputBase + " ^ " + inputExp + ": " + stack[tos - 1]);
        }
        return;
      }
    }
    if (simplify_polar()) {
      if (DEBUG_POWER) {
        console.log("   power: using simplify_polar");
      }
      return;
    }
    if (DEBUG_POWER) {
      console.log("   power: nothing can be done ");
    }
    push_symbol(POWER);
    push(p1);
    push(p2);
    list(3);
    if (DEBUG_POWER) {
      return console.log("   power of " + inputBase + " ^ " + inputExp + ": " + stack[tos - 1]);
    }
  };

  power_sum = function(n) {
    var a, i, i1, j, j1, k, l1, ref1, ref2, ref3;
    a = [];
    i = 0;
    j = 0;
    k = 0;
    k = length(p1) - 1;
    push_frame(k * (n + 1));
    p1 = cdr(p1);
    for (i = i1 = 0, ref1 = k; 0 <= ref1 ? i1 < ref1 : i1 > ref1; i = 0 <= ref1 ? ++i1 : --i1) {
      for (j = j1 = 0, ref2 = n; 0 <= ref2 ? j1 <= ref2 : j1 >= ref2; j = 0 <= ref2 ? ++j1 : --j1) {
        push(car(p1));
        push_integer(j);
        power();
        stack[frame + i * (n + 1) + j] = pop();
      }
      p1 = cdr(p1);
    }
    push_integer(n);
    factorial();
    p1 = pop();
    for (i = l1 = 0, ref3 = k; 0 <= ref3 ? l1 < ref3 : l1 > ref3; i = 0 <= ref3 ? ++l1 : --l1) {
      a[i] = 0;
    }
    push(zero);
    multinomial_sum(k, n, a, 0, n);
    return pop_frame(k * (n + 1));
  };

  multinomial_sum = function(k, n, a, i, m) {
    var i1, j, j1, l1, ref1, ref2, ref3;
    j = 0;
    if (i < k - 1) {
      for (j = i1 = 0, ref1 = m; 0 <= ref1 ? i1 <= ref1 : i1 >= ref1; j = 0 <= ref1 ? ++i1 : --i1) {
        a[i] = j;
        multinomial_sum(k, n, a, i + 1, m - j);
      }
      return;
    }
    a[i] = m;
    push(p1);
    for (j = j1 = 0, ref2 = k; 0 <= ref2 ? j1 < ref2 : j1 > ref2; j = 0 <= ref2 ? ++j1 : --j1) {
      push_integer(a[j]);
      factorial();
      divide();
    }
    for (j = l1 = 0, ref3 = k; 0 <= ref3 ? l1 < ref3 : l1 > ref3; j = 0 <= ref3 ? ++l1 : --l1) {
      push(stack[frame + j * (n + 1) + a[j]]);
      multiply();
    }
    return add();
  };

  simplify_polar = function() {
    var doNothing, n;
    n = 0;
    n = isquarterturn(p2);
    switch (n) {
      case 0:
        doNothing = 1;
        break;
      case 1:
        push_integer(1);
        return 1;
      case 2:
        push_integer(-1);
        return 1;
      case 3:
        push(imaginaryunit);
        return 1;
      case 4:
        push(imaginaryunit);
        negate();
        return 1;
    }
    if (car(p2) === symbol(ADD)) {
      p3 = cdr(p2);
      while (iscons(p3)) {
        n = isquarterturn(car(p3));
        if (n) {
          break;
        }
        p3 = cdr(p3);
      }
      switch (n) {
        case 0:
          return 0;
        case 1:
          push_integer(1);
          break;
        case 2:
          push_integer(-1);
          break;
        case 3:
          push(imaginaryunit);
          break;
        case 4:
          push(imaginaryunit);
          negate();
      }
      push(p2);
      push(car(p3));
      subtract();
      exponential();
      multiply();
      return 1;
    }
    return 0;
  };

  Eval_prime = function() {
    push(cadr(p1));
    Eval();
    return prime();
  };

  prime = function() {
    var n;
    n = 0;
    n = pop_integer();
    if (n < 1 || n > MAXPRIMETAB) {
      stop("prime: Argument out of range.");
    }
    n = primetab[n - 1];
    return push_integer(n);
  };

  power_str = "^";

  codeGen = false;

  Eval_print = function() {
    stringsEmittedByUserPrintouts += _print(cdr(p1), printMode);
    return push(symbol(NIL));
  };

  Eval_print2dascii = function() {
    stringsEmittedByUserPrintouts += _print(cdr(p1), PRINTMODE_2DASCII);
    return push(symbol(NIL));
  };

  Eval_printcomputer = function() {
    stringsEmittedByUserPrintouts += _print(cdr(p1), PRINTMODE_COMPUTER);
    return push(symbol(NIL));
  };

  Eval_printlatex = function() {
    stringsEmittedByUserPrintouts += _print(cdr(p1), PRINTMODE_LATEX);
    return push(symbol(NIL));
  };

  Eval_printhuman = function() {
    var original_test_flag;
    original_test_flag = test_flag;
    test_flag = 0;
    stringsEmittedByUserPrintouts += _print(cdr(p1), PRINTMODE_HUMAN);
    test_flag = original_test_flag;
    return push(symbol(NIL));
  };

  Eval_printlist = function() {
    var beenPrinted;
    beenPrinted = _print(cdr(p1), PRINTMODE_LIST);
    stringsEmittedByUserPrintouts += beenPrinted;
    return push(symbol(NIL));
  };

  _print = function(p, passedPrintMode) {
    var accumulator, origPrintMode;
    accumulator = "";
    while (iscons(p)) {
      push(car(p));
      Eval();
      p2 = pop();

      /*
      if (issymbol(car(p)) && car(p) != p2)
        push_symbol(SETQ);
        push(car(p));
        push(p2);
        list(3);
        p2 = pop();
       */
      origPrintMode = printMode;
      if (passedPrintMode === PRINTMODE_COMPUTER) {
        printMode = PRINTMODE_COMPUTER;
        accumulator = printline(p2);
        rememberPrint(accumulator, LAST_FULL_PRINT);
      } else if (passedPrintMode === PRINTMODE_HUMAN) {
        printMode = PRINTMODE_HUMAN;
        accumulator = printline(p2);
        rememberPrint(accumulator, LAST_PLAIN_PRINT);
      } else if (passedPrintMode === PRINTMODE_2DASCII) {
        printMode = PRINTMODE_2DASCII;
        accumulator = print2dascii(p2);
        rememberPrint(accumulator, LAST_2DASCII_PRINT);
      } else if (passedPrintMode === PRINTMODE_LATEX) {
        printMode = PRINTMODE_LATEX;
        accumulator = printline(p2);
        rememberPrint(accumulator, LAST_LATEX_PRINT);
      } else if (passedPrintMode === PRINTMODE_LIST) {
        printMode = PRINTMODE_LIST;
        accumulator = print_list(p2);
        rememberPrint(accumulator, LAST_LIST_PRINT);
      }
      printMode = origPrintMode;
      p = cdr(p);
    }
    if (DEBUG) {
      console.log("emttedString from display: " + stringsEmittedByUserPrintouts);
    }
    return accumulator;
  };

  rememberPrint = function(theString, theTypeOfPrint) {
    var parsedString;
    scan('"' + theString + '"');
    parsedString = pop();
    return set_binding(symbol(theTypeOfPrint), parsedString);
  };

  print_str = function(s) {
    if (DEBUG) {
      console.log("emttedString from print_str: " + stringsEmittedByUserPrintouts);
    }
    return s;
  };

  print_char = function(c) {
    return c;
  };

  collectLatexStringFromReturnValue = function(p) {
    var origPrintMode, originalCodeGen, returnedString;
    origPrintMode = printMode;
    printMode = PRINTMODE_LATEX;
    originalCodeGen = codeGen;
    codeGen = false;
    returnedString = print_expr(p);
    returnedString = returnedString.replace(/_/g, "\\_");
    printMode = origPrintMode;
    codeGen = originalCodeGen;
    if (DEBUG) {
      console.log("emttedString from collectLatexStringFromReturnValue: " + stringsEmittedByUserPrintouts);
    }
    return returnedString;
  };

  printline = function(p) {
    var accumulator;
    accumulator = "";
    accumulator += print_expr(p);
    return accumulator;
  };

  print_base_of_denom = function(p1) {
    var accumulator;
    accumulator = "";
    if (isfraction(p1) || car(p1) === symbol(ADD) || car(p1) === symbol(MULTIPLY) || car(p1) === symbol(POWER) || lessp(p1, zero)) {
      accumulator += print_char('(');
      accumulator += print_expr(p1);
      accumulator += print_char(')');
    } else {
      accumulator += print_expr(p1);
    }
    return accumulator;
  };

  print_expo_of_denom = function(p2) {
    var accumulator;
    accumulator = "";
    if (isfraction(p2) || car(p2) === symbol(ADD) || car(p2) === symbol(MULTIPLY) || car(p2) === symbol(POWER)) {
      accumulator += print_char('(');
      accumulator += print_expr(p2);
      accumulator += print_char(')');
    } else {
      accumulator += print_expr(p2);
    }
    return accumulator;
  };

  print_denom = function(p, d) {
    var accumulator;
    accumulator = "";
    save();
    p1 = cadr(p);
    p2 = caddr(p);
    if (isminusone(p2)) {
      accumulator += print_base_of_denom(p1);
      restore();
      return accumulator;
    }
    if (d === 1) {
      accumulator += print_char('(');
    }
    push(p2);
    negate();
    p2 = pop();
    accumulator += print_power(p1, p2);
    if (d === 1) {
      accumulator += print_char(')');
    }
    restore();
    return accumulator;
  };

  print_a_over_b = function(p) {
    var accumulator, d, doNothing, n;
    accumulator = "";
    flag = 0;
    n = 0;
    d = 0;
    save();
    n = 0;
    d = 0;
    p1 = cdr(p);
    p2 = car(p1);
    if (isrational(p2)) {
      push(p2);
      mp_numerator();
      absval();
      p3 = pop();
      push(p2);
      mp_denominator();
      p4 = pop();
      if (!isplusone(p3)) {
        n++;
      }
      if (!isplusone(p4)) {
        d++;
      }
      p1 = cdr(p1);
    } else {
      p3 = one;
      p4 = one;
    }
    while (iscons(p1)) {
      p2 = car(p1);
      if (is_denominator(p2)) {
        d++;
      } else {
        n++;
      }
      p1 = cdr(p1);
    }
    if (printMode === PRINTMODE_LATEX) {
      accumulator += print_str('\\frac{');
    }
    if (n === 0) {
      accumulator += print_char('1');
    } else {
      flag = 0;
      p1 = cdr(p);
      if (isrational(car(p1))) {
        p1 = cdr(p1);
      }
      if (!isplusone(p3)) {
        accumulator += print_factor(p3);
        flag = 1;
      }
      while (iscons(p1)) {
        p2 = car(p1);
        if (is_denominator(p2)) {
          doNothing = 1;
        } else {
          if (flag) {
            accumulator += print_multiply_sign();
          }
          accumulator += print_factor(p2);
          flag = 1;
        }
        p1 = cdr(p1);
      }
    }
    if (printMode === PRINTMODE_LATEX) {
      accumulator += print_str('}{');
    } else if (printMode === PRINTMODE_HUMAN && !test_flag) {
      accumulator += print_str(" / ");
    } else {
      accumulator += print_str("/");
    }
    if (d > 1 && printMode !== PRINTMODE_LATEX) {
      accumulator += print_char('(');
    }
    flag = 0;
    p1 = cdr(p);
    if (isrational(car(p1))) {
      p1 = cdr(p1);
    }
    if (!isplusone(p4)) {
      accumulator += print_factor(p4);
      flag = 1;
    }
    while (iscons(p1)) {
      p2 = car(p1);
      if (is_denominator(p2)) {
        if (flag) {
          accumulator += print_multiply_sign();
        }
        accumulator += print_denom(p2, d);
        flag = 1;
      }
      p1 = cdr(p1);
    }
    if (d > 1 && printMode !== PRINTMODE_LATEX) {
      accumulator += print_char(')');
    }
    if (printMode === PRINTMODE_LATEX) {
      accumulator += print_str('}');
    }
    restore();
    return accumulator;
  };

  print_expr = function(p) {
    var accumulator;
    accumulator = "";
    if (isadd(p)) {
      p = cdr(p);
      if (sign_of_term(car(p)) === '-') {
        accumulator += print_str("-");
      }
      accumulator += print_term(car(p));
      p = cdr(p);
      while (iscons(p)) {
        if (sign_of_term(car(p)) === '+') {
          if (printMode === PRINTMODE_HUMAN && !test_flag) {
            accumulator += print_str(" + ");
          } else {
            accumulator += print_str("+");
          }
        } else {
          if (printMode === PRINTMODE_HUMAN && !test_flag) {
            accumulator += print_str(" - ");
          } else {
            accumulator += print_str("-");
          }
        }
        accumulator += print_term(car(p));
        p = cdr(p);
      }
    } else {
      if (sign_of_term(p) === '-') {
        accumulator += print_str("-");
      }
      accumulator += print_term(p);
    }
    return accumulator;
  };

  sign_of_term = function(p) {
    var accumulator;
    accumulator = "";
    if (car(p) === symbol(MULTIPLY) && isNumericAtom(cadr(p)) && lessp(cadr(p), zero)) {
      accumulator += '-';
    } else if (isNumericAtom(p) && lessp(p, zero)) {
      accumulator += '-';
    } else {
      accumulator += '+';
    }
    return accumulator;
  };

  print_term = function(p) {
    var accumulator, denom, numberOneOverSomething, origAccumulator, previousFactorWasANumber;
    accumulator = "";
    if (car(p) === symbol(MULTIPLY) && any_denominators(p)) {
      accumulator += print_a_over_b(p);
      return accumulator;
    }
    if (car(p) === symbol(MULTIPLY)) {
      p = cdr(p);
      if (isminusone(car(p))) {
        p = cdr(p);
      }
      previousFactorWasANumber = false;
      if (isNumericAtom(car(p))) {
        previousFactorWasANumber = true;
      }
      numberOneOverSomething = false;
      if (printMode === PRINTMODE_LATEX && iscons(cdr(p)) && isNumberOneOverSomething(car(p))) {
        numberOneOverSomething = true;
        denom = car(p).q.b.toString();
      }
      if (numberOneOverSomething) {
        origAccumulator = accumulator;
        accumulator = "";
      } else {
        accumulator += print_factor(car(p));
      }
      p = cdr(p);
      while (iscons(p)) {
        if (printMode === PRINTMODE_LATEX) {
          if (previousFactorWasANumber) {
            if (caar(p) === symbol(POWER)) {
              if (isNumericAtom(car(cdr(car(p))))) {
                if (!isfraction(car(cdr(cdr(car(p)))))) {
                  accumulator += " \\cdot ";
                }
              }
            }
          }
        }
        accumulator += print_multiply_sign();
        accumulator += print_factor(car(p));
        previousFactorWasANumber = false;
        if (isNumericAtom(car(p))) {
          previousFactorWasANumber = true;
        }
        p = cdr(p);
      }
      if (numberOneOverSomething) {
        accumulator = origAccumulator + "\\frac{" + accumulator + "}{" + denom + "}";
      }
    } else {
      accumulator += print_factor(p);
    }
    return accumulator;
  };

  print_subexpr = function(p) {
    var accumulator;
    accumulator = "";
    accumulator += print_char('(');
    accumulator += print_expr(p);
    accumulator += print_char(')');
    return accumulator;
  };

  print_factorial_function = function(p) {
    var accumulator;
    accumulator = "";
    p = cadr(p);
    if (isfraction(p) || car(p) === symbol(ADD) || car(p) === symbol(MULTIPLY) || car(p) === symbol(POWER) || car(p) === symbol(FACTORIAL)) {
      accumulator += print_subexpr(p);
    } else {
      accumulator += print_expr(p);
    }
    accumulator += print_char('!');
    return accumulator;
  };

  print_ABS_latex = function(p) {
    var accumulator;
    accumulator = "";
    accumulator += print_str("\\left |");
    accumulator += print_expr(cadr(p));
    accumulator += print_str(" \\right |");
    return accumulator;
  };

  print_BINOMIAL_latex = function(p) {
    var accumulator;
    accumulator = "";
    accumulator += print_str("\\binom{");
    accumulator += print_expr(cadr(p));
    accumulator += print_str("}{");
    accumulator += print_expr(caddr(p));
    accumulator += print_str("} ");
    return accumulator;
  };

  print_DOT_latex = function(p) {
    var accumulator;
    accumulator = "";
    accumulator += print_expr(cadr(p));
    accumulator += print_str(" \\cdot ");
    accumulator += print_expr(caddr(p));
    return accumulator;
  };

  print_DOT_codegen = function(p) {
    var accumulator;
    accumulator = "dot(";
    accumulator += print_expr(cadr(p));
    accumulator += ", ";
    accumulator += print_expr(caddr(p));
    accumulator += ")";
    return accumulator;
  };

  print_SIN_codegen = function(p) {
    var accumulator;
    accumulator = "Math.sin(";
    accumulator += print_expr(cadr(p));
    accumulator += ")";
    return accumulator;
  };

  print_COS_codegen = function(p) {
    var accumulator;
    accumulator = "Math.cos(";
    accumulator += print_expr(cadr(p));
    accumulator += ")";
    return accumulator;
  };

  print_TAN_codegen = function(p) {
    var accumulator;
    accumulator = "Math.tan(";
    accumulator += print_expr(cadr(p));
    accumulator += ")";
    return accumulator;
  };

  print_ARCSIN_codegen = function(p) {
    var accumulator;
    accumulator = "Math.asin(";
    accumulator += print_expr(cadr(p));
    accumulator += ")";
    return accumulator;
  };

  print_ARCCOS_codegen = function(p) {
    var accumulator;
    accumulator = "Math.acos(";
    accumulator += print_expr(cadr(p));
    accumulator += ")";
    return accumulator;
  };

  print_ARCTAN_codegen = function(p) {
    var accumulator;
    accumulator = "Math.atan(";
    accumulator += print_expr(cadr(p));
    accumulator += ")";
    return accumulator;
  };

  print_SQRT_latex = function(p) {
    var accumulator;
    accumulator = "";
    accumulator += print_str("\\sqrt{");
    accumulator += print_expr(cadr(p));
    accumulator += print_str("} ");
    return accumulator;
  };

  print_TRANSPOSE_latex = function(p) {
    var accumulator;
    accumulator = "";
    accumulator += print_str("{");
    if (iscons(cadr(p))) {
      accumulator += print_str('(');
    }
    accumulator += print_expr(cadr(p));
    if (iscons(cadr(p))) {
      accumulator += print_str(')');
    }
    accumulator += print_str("}");
    accumulator += print_str("^T");
    return accumulator;
  };

  print_TRANSPOSE_codegen = function(p) {
    var accumulator;
    accumulator = "";
    accumulator += print_str("transpose(");
    accumulator += print_expr(cadr(p));
    accumulator += print_str(')');
    return accumulator;
  };

  print_UNIT_codegen = function(p) {
    var accumulator;
    accumulator = "";
    accumulator += print_str("identity(");
    accumulator += print_expr(cadr(p));
    accumulator += print_str(')');
    return accumulator;
  };

  print_INV_latex = function(p) {
    var accumulator;
    accumulator = "";
    accumulator += print_str("{");
    if (iscons(cadr(p))) {
      accumulator += print_str('(');
    }
    accumulator += print_expr(cadr(p));
    if (iscons(cadr(p))) {
      accumulator += print_str(')');
    }
    accumulator += print_str("}");
    accumulator += print_str("^{-1}");
    return accumulator;
  };

  print_INV_codegen = function(p) {
    var accumulator;
    accumulator = "";
    accumulator += print_str("inv(");
    accumulator += print_expr(cadr(p));
    accumulator += print_str(')');
    return accumulator;
  };

  print_DEFINT_latex = function(p) {
    var accumulator, functionBody, i, i1, numberOfIntegrals, originalIntegral, ref1, theIntegral, theVariable;
    accumulator = "";
    functionBody = car(cdr(p));
    p = cdr(p);
    originalIntegral = p;
    numberOfIntegrals = 0;
    while (iscons(cdr(cdr(p)))) {
      numberOfIntegrals++;
      theIntegral = cdr(cdr(p));
      accumulator += print_str("\\int^{");
      accumulator += print_expr(car(cdr(theIntegral)));
      accumulator += print_str("}_{");
      accumulator += print_expr(car(theIntegral));
      accumulator += print_str("} \\! ");
      p = cdr(theIntegral);
    }
    accumulator += print_expr(functionBody);
    accumulator += print_str(" \\,");
    p = originalIntegral;
    for (i = i1 = 1, ref1 = numberOfIntegrals; 1 <= ref1 ? i1 <= ref1 : i1 >= ref1; i = 1 <= ref1 ? ++i1 : --i1) {
      theVariable = cdr(p);
      accumulator += print_str(" \\mathrm{d} ");
      accumulator += print_expr(car(theVariable));
      if (i < numberOfIntegrals) {
        accumulator += print_str(" \\, ");
      }
      p = cdr(cdr(theVariable));
    }
    return accumulator;
  };

  print_tensor = function(p) {
    var accumulator;
    accumulator = "";
    accumulator += print_tensor_inner(p, 0, 0)[1];
    return accumulator;
  };

  print_tensor_inner = function(p, j, k) {
    var accumulator, i, i1, j1, ref1, ref2, ref3, retString;
    accumulator = "";
    accumulator += print_str("[");
    if (j < p.tensor.ndim - 1) {
      for (i = i1 = 0, ref1 = p.tensor.dim[j]; 0 <= ref1 ? i1 < ref1 : i1 > ref1; i = 0 <= ref1 ? ++i1 : --i1) {
        ref2 = print_tensor_inner(p, j + 1, k), k = ref2[0], retString = ref2[1];
        accumulator += retString;
        if (i !== p.tensor.dim[j] - 1) {
          accumulator += print_str(",");
        }
      }
    } else {
      for (i = j1 = 0, ref3 = p.tensor.dim[j]; 0 <= ref3 ? j1 < ref3 : j1 > ref3; i = 0 <= ref3 ? ++j1 : --j1) {
        accumulator += print_expr(p.tensor.elem[k]);
        if (i !== p.tensor.dim[j] - 1) {
          accumulator += print_str(",");
        }
        k++;
      }
    }
    accumulator += print_str("]");
    return [k, accumulator];
  };

  print_tensor_latex = function(p) {
    var accumulator;
    accumulator = "";
    if (p.tensor.ndim <= 2) {
      accumulator += print_tensor_inner_latex(true, p, 0, 0)[1];
    }
    return accumulator;
  };

  print_tensor_inner_latex = function(firstLevel, p, j, k) {
    var accumulator, i, i1, j1, ref1, ref2, ref3, retString;
    accumulator = "";
    if (firstLevel) {
      accumulator += "\\begin{bmatrix} ";
    }
    if (j < p.tensor.ndim - 1) {
      for (i = i1 = 0, ref1 = p.tensor.dim[j]; 0 <= ref1 ? i1 < ref1 : i1 > ref1; i = 0 <= ref1 ? ++i1 : --i1) {
        ref2 = print_tensor_inner_latex(0, p, j + 1, k), k = ref2[0], retString = ref2[1];
        accumulator += retString;
        if (i !== p.tensor.dim[j] - 1) {
          accumulator += print_str(" \\\\ ");
        }
      }
    } else {
      for (i = j1 = 0, ref3 = p.tensor.dim[j]; 0 <= ref3 ? j1 < ref3 : j1 > ref3; i = 0 <= ref3 ? ++j1 : --j1) {
        accumulator += print_expr(p.tensor.elem[k]);
        if (i !== p.tensor.dim[j] - 1) {
          accumulator += print_str(" & ");
        }
        k++;
      }
    }
    if (firstLevel) {
      accumulator += " \\end{bmatrix}";
    }
    return [k, accumulator];
  };

  print_SUM_latex = function(p) {
    var accumulator;
    accumulator = "\\sum_{";
    accumulator += print_expr(caddr(p));
    accumulator += "=";
    accumulator += print_expr(cadddr(p));
    accumulator += "}^{";
    accumulator += print_expr(caddddr(p));
    accumulator += "}{";
    accumulator += print_expr(cadr(p));
    accumulator += "}";
    return accumulator;
  };

  print_SUM_codegen = function(p) {
    var accumulator, body, lowerlimit, upperlimit, variable;
    body = cadr(p);
    variable = caddr(p);
    lowerlimit = cadddr(p);
    upperlimit = caddddr(p);
    accumulator = "(function(){" + " var " + variable + "; " + " var holderSum = 0; " + " var lowerlimit = " + print_expr(lowerlimit) + "; " + " var upperlimit = " + print_expr(upperlimit) + "; " + " for (" + variable + " = lowerlimit; " + variable + " < upperlimit; " + variable + "++) { " + "   holderSum += " + print_expr(body) + ";" + " } " + " return holderSum;" + "})()";
    return accumulator;
  };

  print_TEST_latex = function(p) {
    var accumulator;
    accumulator = "\\left\\{ \\begin{array}{ll}";
    p = cdr(p);
    while (iscons(p)) {
      if (cdr(p) === symbol(NIL)) {
        accumulator += "{";
        accumulator += print_expr(car(p));
        accumulator += "} & otherwise ";
        accumulator += " \\\\\\\\";
        break;
      }
      accumulator += "{";
      accumulator += print_expr(cadr(p));
      accumulator += "} & if & ";
      accumulator += print_expr(car(p));
      accumulator += " \\\\\\\\";
      p = cddr(p);
    }
    accumulator = accumulator.substring(0, accumulator.length - 4);
    return accumulator += "\\end{array} \\right.";
  };

  print_TEST_codegen = function(p) {
    var accumulator, howManyIfs;
    accumulator = "(function(){";
    p = cdr(p);
    howManyIfs = 0;
    while (iscons(p)) {
      if (cdr(p) === symbol(NIL)) {
        accumulator += "else {";
        accumulator += "return (" + print_expr(car(p)) + ");";
        accumulator += "}";
        break;
      }
      if (howManyIfs) {
        accumulator += " else ";
      }
      accumulator += "if (" + print_expr(car(p)) + "){";
      accumulator += "return (" + print_expr(cadr(p)) + ");";
      accumulator += "}";
      howManyIfs++;
      p = cddr(p);
    }
    accumulator += "})()";
    return accumulator;
  };

  print_TESTLT_latex = function(p) {
    var accumulator;
    accumulator = "{";
    accumulator += print_expr(cadr(p));
    accumulator += "}";
    accumulator += " < ";
    accumulator += "{";
    accumulator += print_expr(caddr(p));
    return accumulator += "}";
  };

  print_TESTLE_latex = function(p) {
    var accumulator;
    accumulator = "{";
    accumulator += print_expr(cadr(p));
    accumulator += "}";
    accumulator += " \\leq ";
    accumulator += "{";
    accumulator += print_expr(caddr(p));
    return accumulator += "}";
  };

  print_TESTGT_latex = function(p) {
    var accumulator;
    accumulator = "{";
    accumulator += print_expr(cadr(p));
    accumulator += "}";
    accumulator += " > ";
    accumulator += "{";
    accumulator += print_expr(caddr(p));
    return accumulator += "}";
  };

  print_TESTGE_latex = function(p) {
    var accumulator;
    accumulator = "{";
    accumulator += print_expr(cadr(p));
    accumulator += "}";
    accumulator += " \\geq ";
    accumulator += "{";
    accumulator += print_expr(caddr(p));
    return accumulator += "}";
  };

  print_TESTEQ_latex = function(p) {
    var accumulator;
    accumulator = "{";
    accumulator += print_expr(cadr(p));
    accumulator += "}";
    accumulator += " = ";
    accumulator += "{";
    accumulator += print_expr(caddr(p));
    return accumulator += "}";
  };

  print_FOR_codegen = function(p) {
    var accumulator, body, lowerlimit, upperlimit, variable;
    body = cadr(p);
    variable = caddr(p);
    lowerlimit = cadddr(p);
    upperlimit = caddddr(p);
    accumulator = "(function(){" + " var " + variable + "; " + " var lowerlimit = " + print_expr(lowerlimit) + "; " + " var upperlimit = " + print_expr(upperlimit) + "; " + " for (" + variable + " = lowerlimit; " + variable + " < upperlimit; " + variable + "++) { " + "   " + print_expr(body) + " } " + "})()";
    return accumulator;
  };

  print_DO_codegen = function(p) {
    var accumulator;
    accumulator = "";
    p = cdr(p);
    while (iscons(p)) {
      accumulator += print_expr(car(p));
      p = cdr(p);
    }
    return accumulator;
  };

  print_SETQ_codegen = function(p) {
    var accumulator;
    accumulator = "";
    accumulator += print_expr(cadr(p));
    accumulator += " = ";
    accumulator += print_expr(caddr(p));
    accumulator += "; ";
    return accumulator;
  };

  print_PRODUCT_latex = function(p) {
    var accumulator;
    accumulator = "\\prod_{";
    accumulator += print_expr(caddr(p));
    accumulator += "=";
    accumulator += print_expr(cadddr(p));
    accumulator += "}^{";
    accumulator += print_expr(caddddr(p));
    accumulator += "}{";
    accumulator += print_expr(cadr(p));
    accumulator += "}";
    return accumulator;
  };

  print_PRODUCT_codegen = function(p) {
    var accumulator, body, lowerlimit, upperlimit, variable;
    body = cadr(p);
    variable = caddr(p);
    lowerlimit = cadddr(p);
    upperlimit = caddddr(p);
    accumulator = "(function(){" + " var " + variable + "; " + " var holderProduct = 1; " + " var lowerlimit = " + print_expr(lowerlimit) + "; " + " var upperlimit = " + print_expr(upperlimit) + "; " + " for (" + variable + " = lowerlimit; " + variable + " < upperlimit; " + variable + "++) { " + "   holderProduct *= " + print_expr(body) + ";" + " } " + " return holderProduct;" + "})()";
    return accumulator;
  };

  print_base = function(p) {
    var accumulator;
    accumulator = "";
    if (isadd(cadr(p)) || caadr(p) === symbol(MULTIPLY) || caadr(p) === symbol(POWER) || isnegativenumber(cadr(p))) {
      accumulator += print_str('(');
      accumulator += print_expr(cadr(p));
      accumulator += print_str(')');
    } else if (isNumericAtom(cadr(p)) && (lessp(cadr(p), zero) || isfraction(cadr(p)))) {
      accumulator += print_str('(');
      accumulator += print_factor(cadr(p));
      accumulator += print_str(')');
    } else {
      accumulator += print_factor(cadr(p));
    }
    return accumulator;
  };

  print_exponent = function(p) {
    var accumulator;
    accumulator = "";
    if (iscons(caddr(p)) || isfraction(caddr(p)) || (isNumericAtom(caddr(p)) && lessp(caddr(p), zero))) {
      accumulator += print_str('(');
      accumulator += print_expr(caddr(p));
      accumulator += print_str(')');
    } else {
      accumulator += print_factor(caddr(p));
    }
    return accumulator;
  };

  print_power = function(base, exponent) {
    var accumulator, denomExponent, newExponent, numExponent;
    accumulator = "";
    if (DEBUG) {
      console.log("power base: " + base + " " + " exponent: " + exponent);
    }
    if (isoneovertwo(exponent)) {
      if (equaln(base, 2)) {
        if (codeGen) {
          accumulator += print_str("Math.SQRT2");
          return accumulator;
        }
      } else {
        if (printMode === PRINTMODE_LATEX) {
          accumulator += print_str("\\sqrt{");
          accumulator += print_expr(base);
          accumulator += print_str("}");
          return accumulator;
        } else if (codeGen) {
          accumulator += print_str("Math.sqrt(");
          accumulator += print_expr(base);
          accumulator += print_str(')');
          return accumulator;
        }
      }
    }
    if ((equaln(get_binding(symbol(PRINT_LEAVE_E_ALONE)), 1)) && base === symbol(E)) {
      if (codeGen) {
        accumulator += print_str("Math.exp(");
        accumulator += print_expo_of_denom(exponent);
        accumulator += print_str(')');
        return accumulator;
      }
      if (printMode === PRINTMODE_LATEX) {
        accumulator += print_str("e^{");
        accumulator += print_expr(exponent);
        accumulator += print_str("}");
      } else {
        accumulator += print_str("exp(");
        accumulator += print_expr(exponent);
        accumulator += print_str(')');
      }
      return accumulator;
    }
    if (codeGen) {
      accumulator += print_str("Math.pow(");
      accumulator += print_base_of_denom(base);
      accumulator += print_str(", ");
      accumulator += print_expo_of_denom(exponent);
      accumulator += print_str(')');
      return accumulator;
    }
    if ((equaln(get_binding(symbol(PRINT_LEAVE_X_ALONE)), 0)) || base.printname !== "x") {
      if (base !== symbol(E)) {
        if (isminusone(exponent)) {
          if (printMode === PRINTMODE_LATEX) {
            accumulator += print_str("\\frac{1}{");
          } else if (printMode === PRINTMODE_HUMAN && !test_flag) {
            accumulator += print_str("1 / ");
          } else {
            accumulator += print_str("1/");
          }
          if (iscons(base) && printMode !== PRINTMODE_LATEX) {
            accumulator += print_str('(');
            accumulator += print_expr(base);
            accumulator += print_str(')');
          } else {
            accumulator += print_expr(base);
          }
          if (printMode === PRINTMODE_LATEX) {
            accumulator += print_str("}");
          }
          return accumulator;
        }
        if (isnegativeterm(exponent)) {
          if (printMode === PRINTMODE_LATEX) {
            accumulator += print_str("\\frac{1}{");
          } else if (printMode === PRINTMODE_HUMAN && !test_flag) {
            accumulator += print_str("1 / ");
          } else {
            accumulator += print_str("1/");
          }
          push(exponent);
          push_integer(-1);
          multiply();
          newExponent = pop();
          if (iscons(base) && printMode !== PRINTMODE_LATEX) {
            accumulator += print_str('(');
            accumulator += print_power(base, newExponent);
            accumulator += print_str(')');
          } else {
            accumulator += print_power(base, newExponent);
          }
          if (printMode === PRINTMODE_LATEX) {
            accumulator += print_str("}");
          }
          return accumulator;
        }
      }
      if (isfraction(exponent) && printMode === PRINTMODE_LATEX) {
        accumulator += print_str("\\sqrt");
        push(exponent);
        denominator();
        denomExponent = pop();
        if (!isplustwo(denomExponent)) {
          accumulator += print_str("[");
          accumulator += print_expr(denomExponent);
          accumulator += print_str("]");
        }
        accumulator += print_str("{");
        push(exponent);
        numerator();
        numExponent = pop();
        exponent = numExponent;
        accumulator += print_power(base, exponent);
        accumulator += print_str("}");
        return accumulator;
      }
    }
    if (printMode === PRINTMODE_LATEX && isplusone(exponent)) {
      accumulator += print_expr(base);
    } else {
      if (isadd(base) || isnegativenumber(base)) {
        accumulator += print_str('(');
        accumulator += print_expr(base);
        accumulator += print_str(')');
      } else if (car(base) === symbol(MULTIPLY) || car(base) === symbol(POWER)) {
        if (printMode !== PRINTMODE_LATEX) {
          accumulator += print_str('(');
        }
        accumulator += print_factor(base, true);
        if (printMode !== PRINTMODE_LATEX) {
          accumulator += print_str(')');
        }
      } else if (isNumericAtom(base) && (lessp(base, zero) || isfraction(base))) {
        accumulator += print_str('(');
        accumulator += print_factor(base);
        accumulator += print_str(')');
      } else {
        accumulator += print_factor(base);
      }
      if (printMode === PRINTMODE_HUMAN && !test_flag) {
        accumulator += print_str(power_str);
      } else {
        accumulator += print_str("^");
      }
      if (printMode === PRINTMODE_LATEX) {
        if (print_expr(exponent).length > 1) {
          accumulator += print_str("{");
          accumulator += print_expr(exponent);
          accumulator += print_str("}");
        } else {
          accumulator += print_expr(exponent);
        }
      } else if (iscons(exponent) || isfraction(exponent) || (isNumericAtom(exponent) && lessp(exponent, zero))) {
        accumulator += print_str('(');
        accumulator += print_expr(exponent);
        accumulator += print_str(')');
      } else {
        accumulator += print_factor(exponent);
      }
    }
    return accumulator;
  };

  print_index_function = function(p) {
    var accumulator;
    accumulator = "";
    p = cdr(p);
    if (caar(p) === symbol(ADD) || caar(p) === symbol(MULTIPLY) || caar(p) === symbol(POWER) || caar(p) === symbol(FACTORIAL)) {
      accumulator += print_subexpr(car(p));
    } else {
      accumulator += print_expr(car(p));
    }
    accumulator += print_str('[');
    p = cdr(p);
    if (iscons(p)) {
      accumulator += print_expr(car(p));
      p = cdr(p);
      while (iscons(p)) {
        accumulator += print_str(',');
        accumulator += print_expr(car(p));
        p = cdr(p);
      }
    }
    accumulator += print_str(']');
    return accumulator;
  };

  print_factor = function(p, omitParens) {
    var accumulator, base, exponent, fbody, parameters, returned;
    accumulator = "";
    if (isNumericAtom(p)) {
      accumulator += print_number(p, false);
      return accumulator;
    }
    if (isstr(p)) {
      accumulator += print_str("\"");
      accumulator += print_str(p.str);
      accumulator += print_str("\"");
      return accumulator;
    }
    if (istensor(p)) {
      if (printMode === PRINTMODE_LATEX) {
        accumulator += print_tensor_latex(p);
      } else {
        accumulator += print_tensor(p);
      }
      return accumulator;
    }
    if (car(p) === symbol(MULTIPLY)) {
      if (!omitParens) {
        if (sign_of_term(p) === '-' || printMode !== PRINTMODE_LATEX) {
          if (printMode === PRINTMODE_LATEX) {
            accumulator += print_str(" \\left (");
          } else {
            accumulator += print_str('(');
          }
        }
      }
      accumulator += print_expr(p);
      if (!omitParens) {
        if (sign_of_term(p) === '-' || printMode !== PRINTMODE_LATEX) {
          if (printMode === PRINTMODE_LATEX) {
            accumulator += print_str(" \\right ) ");
          } else {
            accumulator += print_str(')');
          }
        }
      }
      return accumulator;
    } else if (isadd(p)) {
      if (!omitParens) {
        accumulator += print_str('(');
      }
      accumulator += print_expr(p);
      if (!omitParens) {
        accumulator += print_str(')');
      }
      return accumulator;
    }
    if (car(p) === symbol(POWER)) {
      base = cadr(p);
      exponent = caddr(p);
      accumulator += print_power(base, exponent);
      return accumulator;
    }
    if (car(p) === symbol(FUNCTION)) {
      fbody = cadr(p);
      if (!codeGen) {
        parameters = caddr(p);
        accumulator += print_str("function ");
        if (DEBUG) {
          console.log("emittedString from print_factor " + stringsEmittedByUserPrintouts);
        }
        returned = print_list(parameters);
        accumulator += returned;
        accumulator += print_str(" -> ");
      }
      accumulator += print_expr(fbody);
      return accumulator;
    }
    if (car(p) === symbol(PATTERN)) {
      accumulator += print_expr(caadr(p));
      if (printMode === PRINTMODE_LATEX) {
        accumulator += print_str(" \\rightarrow ");
      } else {
        if (printMode === PRINTMODE_HUMAN && !test_flag) {
          accumulator += print_str(" -> ");
        } else {
          accumulator += print_str("->");
        }
      }
      accumulator += print_expr(car(cdr(cadr(p))));
      return accumulator;
    }
    if (car(p) === symbol(INDEX) && issymbol(cadr(p))) {
      accumulator += print_index_function(p);
      return accumulator;
    }
    if (car(p) === symbol(FACTORIAL)) {
      accumulator += print_factorial_function(p);
      return accumulator;
    } else if (car(p) === symbol(ABS) && printMode === PRINTMODE_LATEX) {
      accumulator += print_ABS_latex(p);
      return accumulator;
    } else if (car(p) === symbol(SQRT) && printMode === PRINTMODE_LATEX) {
      accumulator += print_SQRT_latex(p);
      return accumulator;
    } else if (car(p) === symbol(TRANSPOSE)) {
      if (printMode === PRINTMODE_LATEX) {
        accumulator += print_TRANSPOSE_latex(p);
        return accumulator;
      } else if (codeGen) {
        accumulator += print_TRANSPOSE_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(UNIT)) {
      if (codeGen) {
        accumulator += print_UNIT_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(INV)) {
      if (printMode === PRINTMODE_LATEX) {
        accumulator += print_INV_latex(p);
        return accumulator;
      } else if (codeGen) {
        accumulator += print_INV_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(BINOMIAL) && printMode === PRINTMODE_LATEX) {
      accumulator += print_BINOMIAL_latex(p);
      return accumulator;
    } else if (car(p) === symbol(DEFINT) && printMode === PRINTMODE_LATEX) {
      accumulator += print_DEFINT_latex(p);
      return accumulator;
    } else if (isinnerordot(p)) {
      if (printMode === PRINTMODE_LATEX) {
        accumulator += print_DOT_latex(p);
        return accumulator;
      } else if (codeGen) {
        accumulator += print_DOT_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(SIN)) {
      if (codeGen) {
        accumulator += print_SIN_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(COS)) {
      if (codeGen) {
        accumulator += print_COS_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(TAN)) {
      if (codeGen) {
        accumulator += print_TAN_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(ARCSIN)) {
      if (codeGen) {
        accumulator += print_ARCSIN_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(ARCCOS)) {
      if (codeGen) {
        accumulator += print_ARCCOS_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(ARCTAN)) {
      if (codeGen) {
        accumulator += print_ARCTAN_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(SUM)) {
      if (printMode === PRINTMODE_LATEX) {
        accumulator += print_SUM_latex(p);
        return accumulator;
      } else if (codeGen) {
        accumulator += print_SUM_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(PRODUCT)) {
      if (printMode === PRINTMODE_LATEX) {
        accumulator += print_PRODUCT_latex(p);
        return accumulator;
      } else if (codeGen) {
        accumulator += print_PRODUCT_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(FOR)) {
      if (codeGen) {
        accumulator += print_FOR_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(DO)) {
      if (codeGen) {
        accumulator += print_DO_codegen(p);
        return accumulator;
      }
    } else if (car(p) === symbol(TEST)) {
      if (codeGen) {
        accumulator += print_TEST_codegen(p);
        return accumulator;
      }
      if (printMode === PRINTMODE_LATEX) {
        accumulator += print_TEST_latex(p);
        return accumulator;
      }
    } else if (car(p) === symbol(TESTLT)) {
      if (codeGen) {
        accumulator += "((" + print_expr(cadr(p)) + ") < (" + print_expr(caddr(p)) + "))";
        return accumulator;
      }
      if (printMode === PRINTMODE_LATEX) {
        accumulator += print_TESTLT_latex(p);
        return accumulator;
      }
    } else if (car(p) === symbol(TESTLE)) {
      if (codeGen) {
        accumulator += "((" + print_expr(cadr(p)) + ") <= (" + print_expr(caddr(p)) + "))";
        return accumulator;
      }
      if (printMode === PRINTMODE_LATEX) {
        accumulator += print_TESTLE_latex(p);
        return accumulator;
      }
    } else if (car(p) === symbol(TESTGT)) {
      if (codeGen) {
        accumulator += "((" + print_expr(cadr(p)) + ") > (" + print_expr(caddr(p)) + "))";
        return accumulator;
      }
      if (printMode === PRINTMODE_LATEX) {
        accumulator += print_TESTGT_latex(p);
        return accumulator;
      }
    } else if (car(p) === symbol(TESTGE)) {
      if (codeGen) {
        accumulator += "((" + print_expr(cadr(p)) + ") >= (" + print_expr(caddr(p)) + "))";
        return accumulator;
      }
      if (printMode === PRINTMODE_LATEX) {
        accumulator += print_TESTGE_latex(p);
        return accumulator;
      }
    } else if (car(p) === symbol(TESTEQ)) {
      if (codeGen) {
        accumulator += "((" + print_expr(cadr(p)) + ") === (" + print_expr(caddr(p)) + "))";
        return accumulator;
      }
      if (printMode === PRINTMODE_LATEX) {
        accumulator += print_TESTEQ_latex(p);
        return accumulator;
      }
    } else if (car(p) === symbol(FLOOR)) {
      if (codeGen) {
        accumulator += "Math.floor(" + print_expr(cadr(p)) + ")";
        return accumulator;
      }
      if (printMode === PRINTMODE_LATEX) {
        accumulator += " \\lfloor {" + print_expr(cadr(p)) + "} \\rfloor ";
        return accumulator;
      }
    } else if (car(p) === symbol(CEILING)) {
      if (codeGen) {
        accumulator += "Math.ceiling(" + print_expr(cadr(p)) + ")";
        return accumulator;
      }
      if (printMode === PRINTMODE_LATEX) {
        accumulator += " \\lceil {" + print_expr(cadr(p)) + "} \\rceil ";
        return accumulator;
      }
    } else if (car(p) === symbol(ROUND)) {
      if (codeGen) {
        accumulator += "Math.round(" + print_expr(cadr(p)) + ")";
        return accumulator;
      }
    } else if (car(p) === symbol(SETQ)) {
      if (codeGen) {
        accumulator += print_SETQ_codegen(p);
        return accumulator;
      } else {
        accumulator += print_expr(cadr(p));
        accumulator += print_str("=");
        accumulator += print_expr(caddr(p));
        return accumulator;
      }
    }
    if (iscons(p)) {
      accumulator += print_factor(car(p));
      p = cdr(p);
      if (!omitParens) {
        accumulator += print_str('(');
      }
      if (iscons(p)) {
        accumulator += print_expr(car(p));
        p = cdr(p);
        while (iscons(p)) {
          accumulator += print_str(",");
          accumulator += print_expr(car(p));
          p = cdr(p);
        }
      }
      if (!omitParens) {
        accumulator += print_str(')');
      }
      return accumulator;
    }
    if (p === symbol(DERIVATIVE)) {
      accumulator += print_char('d');
    } else if (p === symbol(E)) {
      if (codeGen) {
        accumulator += print_str("Math.E");
      } else {
        accumulator += print_str("e");
      }
    } else if (p === symbol(PI)) {
      if (printMode === PRINTMODE_LATEX) {
        accumulator += print_str("\\pi");
      } else {
        accumulator += print_str("pi");
      }
    } else {
      accumulator += print_str(get_printname(p));
    }
    return accumulator;
  };

  print_list = function(p) {
    var accumulator;
    accumulator = "";
    switch (p.k) {
      case CONS:
        accumulator += '(';
        accumulator += print_list(car(p));
        if (p === cdr(p) && p !== symbol(NIL)) {
          console.log("oh no recursive!");
          debugger;
        }
        p = cdr(p);
        while (iscons(p)) {
          accumulator += " ";
          accumulator += print_list(car(p));
          p = cdr(p);
          if (p === cdr(p) && p !== symbol(NIL)) {
            console.log("oh no recursive!");
            debugger;
          }
        }
        if (p !== symbol(NIL)) {
          accumulator += " . ";
          accumulator += print_list(p);
        }
        accumulator += ')';
        break;
      case STR:
        accumulator += p.str;
        break;
      case NUM:
      case DOUBLE:
        accumulator += print_number(p, true);
        break;
      case SYM:
        accumulator += get_printname(p);
        break;
      default:
        accumulator += "<tensor>";
    }
    return accumulator;
  };

  print_multiply_sign = function() {
    var accumulator;
    accumulator = "";
    if (printMode === PRINTMODE_LATEX) {
      if (printMode === PRINTMODE_HUMAN && !test_flag) {
        accumulator += print_str(" ");
      } else {
        return accumulator;
      }
    }
    if (printMode === PRINTMODE_HUMAN && !test_flag && !codeGen) {
      accumulator += print_str(" ");
    } else {
      accumulator += print_str("*");
    }
    return accumulator;
  };

  is_denominator = function(p) {
    if (car(p) === symbol(POWER) && cadr(p) !== symbol(E) && isnegativeterm(caddr(p))) {
      return 1;
    } else {
      return 0;
    }
  };

  any_denominators = function(p) {
    var q;
    p = cdr(p);
    while (iscons(p)) {
      q = car(p);
      if (is_denominator(q)) {
        return 1;
      }
      p = cdr(p);
    }
    return 0;
  };


  /*
  
  Prints in "2d", e.g. instead of 1/(x+1)^2 :
  
        1
   ----------
           2
    (1 + x)
  
   Note that although this looks more natural, a) it's not parsable and
   b) it can be occasionally be ambiguous, such as:
  
     1
   ----
     2
   x
  
  is 1/x^2 but it also looks a little like x^(1/2)
   */

  YMAX = 10000;

  glyph = (function() {
    function glyph() {}

    glyph.prototype.c = 0;

    glyph.prototype.x = 0;

    glyph.prototype.y = 0;

    return glyph;

  })();

  chartab = [];

  for (charTabIndex = i1 = 0, ref1 = YMAX; 0 <= ref1 ? i1 < ref1 : i1 > ref1; charTabIndex = 0 <= ref1 ? ++i1 : --i1) {
    chartab[charTabIndex] = new glyph();
  }

  yindex = 0;

  level = 0;

  emit_x = 0;

  expr_level = 0;

  display_flag = 0;

  printchar_nowrap = function(character) {
    var accumulator;
    accumulator = "";
    accumulator += character;
    return accumulator;
  };

  printchar = function(character) {
    return printchar_nowrap(character);
  };

  print2dascii = function(p) {
    var beenPrinted, h, ref2, w, y;
    h = 0;
    w = 0;
    y = 0;
    save();
    yindex = 0;
    level = 0;
    emit_x = 0;
    emit_top_expr(p);
    ref2 = get_size(0, yindex), h = ref2[0], w = ref2[1], y = ref2[2];
    if (w > 100) {
      printline(p);
      restore();
      return;
    }
    beenPrinted = print_glyphs();
    restore();
    return beenPrinted;
  };

  emit_top_expr = function(p) {
    if (car(p) === symbol(SETQ)) {
      emit_expr(cadr(p));
      __emit_str(" = ");
      emit_expr(caddr(p));
      return;
    }
    if (istensor(p)) {
      return emit_tensor(p);
    } else {
      return emit_expr(p);
    }
  };

  will_be_displayed_as_fraction = function(p) {
    if (level > 0) {
      return 0;
    }
    if (isfraction(p)) {
      return 1;
    }
    if (car(p) !== symbol(MULTIPLY)) {
      return 0;
    }
    if (isfraction(cadr(p))) {
      return 1;
    }
    while (iscons(p)) {
      if (isdenominator(car(p))) {
        return 1;
      }
      p = cdr(p);
    }
    return 0;
  };

  emit_expr = function(p) {
    expr_level++;
    if (car(p) === symbol(ADD)) {
      p = cdr(p);
      if (__is_negative(car(p))) {
        __emit_char('-');
        if (will_be_displayed_as_fraction(car(p))) {
          __emit_char(' ');
        }
      }
      emit_term(car(p));
      p = cdr(p);
      while (iscons(p)) {
        if (__is_negative(car(p))) {
          __emit_char(' ');
          __emit_char('-');
          __emit_char(' ');
        } else {
          __emit_char(' ');
          __emit_char('+');
          __emit_char(' ');
        }
        emit_term(car(p));
        p = cdr(p);
      }
    } else {
      if (__is_negative(p)) {
        __emit_char('-');
        if (will_be_displayed_as_fraction(p)) {
          __emit_char(' ');
        }
      }
      emit_term(p);
    }
    return expr_level--;
  };

  emit_unsigned_expr = function(p) {
    var results;
    if (car(p) === symbol(ADD)) {
      p = cdr(p);
      emit_term(car(p));
      p = cdr(p);
      results = [];
      while (iscons(p)) {
        if (__is_negative(car(p))) {
          __emit_char(' ');
          __emit_char('-');
          __emit_char(' ');
        } else {
          __emit_char(' ');
          __emit_char('+');
          __emit_char(' ');
        }
        emit_term(car(p));
        results.push(p = cdr(p));
      }
      return results;
    } else {
      return emit_term(p);
    }
  };

  __is_negative = function(p) {
    if (isnegativenumber(p)) {
      return 1;
    }
    if (car(p) === symbol(MULTIPLY) && isnegativenumber(cadr(p))) {
      return 1;
    }
    return 0;
  };

  emit_term = function(p) {
    var n;
    if (car(p) === symbol(MULTIPLY)) {
      n = count_denominators(p);
      if (n && level === 0) {
        return emit_fraction(p, n);
      } else {
        return emit_multiply(p, n);
      }
    } else {
      return emit_factor(p);
    }
  };

  isdenominator = function(p) {
    if (car(p) === symbol(POWER) && cadr(p) !== symbol(E) && __is_negative(caddr(p))) {
      return 1;
    } else {
      return 0;
    }
  };

  count_denominators = function(p) {
    var count, q;
    count = 0;
    p = cdr(p);
    while (iscons(p)) {
      q = car(p);
      if (isdenominator(q)) {
        count++;
      }
      p = cdr(p);
    }
    return count;
  };

  emit_multiply = function(p, n) {
    var results;
    if (n === 0) {
      p = cdr(p);
      if (isplusone(car(p)) || isminusone(car(p))) {
        p = cdr(p);
      }
      emit_factor(car(p));
      p = cdr(p);
      results = [];
      while (iscons(p)) {
        __emit_char(' ');
        emit_factor(car(p));
        results.push(p = cdr(p));
      }
      return results;
    } else {
      emit_numerators(p);
      __emit_char('/');
      if (n > 1 || isfraction(cadr(p))) {
        __emit_char('(');
        emit_denominators(p);
        return __emit_char(')');
      } else {
        return emit_denominators(p);
      }
    }
  };

  emit_fraction = function(p, d) {
    var count, doNothing, k1, k2, n, x;
    count = 0;
    k1 = 0;
    k2 = 0;
    n = 0;
    x = 0;
    save();
    p3 = one;
    p4 = one;
    if (isrational(cadr(p))) {
      push(cadr(p));
      mp_numerator();
      absval();
      p3 = pop();
      push(cadr(p));
      mp_denominator();
      p4 = pop();
    }
    if (isdouble(cadr(p))) {
      push(cadr(p));
      absval();
      p3 = pop();
    }
    if (isplusone(p3)) {
      n = 0;
    } else {
      n = 1;
    }
    p1 = cdr(p);
    if (isNumericAtom(car(p1))) {
      p1 = cdr(p1);
    }
    while (iscons(p1)) {
      p2 = car(p1);
      if (isdenominator(p2)) {
        doNothing = 1;
      } else {
        n++;
      }
      p1 = cdr(p1);
    }
    x = emit_x;
    k1 = yindex;
    count = 0;
    if (!isplusone(p3)) {
      emit_number(p3, 0);
      count++;
    }
    p1 = cdr(p);
    if (isNumericAtom(car(p1))) {
      p1 = cdr(p1);
    }
    while (iscons(p1)) {
      p2 = car(p1);
      if (isdenominator(p2)) {
        doNothing = 1;
      } else {
        if (count > 0) {
          __emit_char(' ');
        }
        if (n === 1) {
          emit_expr(p2);
        } else {
          emit_factor(p2);
        }
        count++;
      }
      p1 = cdr(p1);
    }
    if (count === 0) {
      __emit_char('1');
    }
    k2 = yindex;
    count = 0;
    if (!isplusone(p4)) {
      emit_number(p4, 0);
      count++;
      d++;
    }
    p1 = cdr(p);
    if (isrational(car(p1))) {
      p1 = cdr(p1);
    }
    while (iscons(p1)) {
      p2 = car(p1);
      if (isdenominator(p2)) {
        if (count > 0) {
          __emit_char(' ');
        }
        emit_denominator(p2, d);
        count++;
      }
      p1 = cdr(p1);
    }
    fixup_fraction(x, k1, k2);
    return restore();
  };

  emit_numerators = function(p) {
    var doNothing, n;
    save();
    n = 0;
    p1 = one;
    p = cdr(p);
    if (isrational(car(p))) {
      push(car(p));
      mp_numerator();
      absval();
      p1 = pop();
      p = cdr(p);
    } else if (isdouble(car(p))) {
      push(car(p));
      absval();
      p1 = pop();
      p = cdr(p);
    }
    n = 0;
    if (!isplusone(p1)) {
      emit_number(p1, 0);
      n++;
    }
    while (iscons(p)) {
      if (isdenominator(car(p))) {
        doNothing = 1;
      } else {
        if (n > 0) {
          __emit_char(' ');
        }
        emit_factor(car(p));
        n++;
      }
      p = cdr(p);
    }
    if (n === 0) {
      __emit_char('1');
    }
    return restore();
  };

  emit_denominators = function(p) {
    var n;
    save();
    n = 0;
    p = cdr(p);
    if (isfraction(car(p))) {
      push(car(p));
      mp_denominator();
      p1 = pop();
      emit_number(p1, 0);
      n++;
      p = cdr(p);
    }
    while (iscons(p)) {
      if (isdenominator(car(p))) {
        if (n > 0) {
          __emit_char(' ');
        }
        emit_denominator(car(p), 0);
        n++;
      }
      p = cdr(p);
    }
    return restore();
  };

  emit_factor = function(p) {
    if (istensor(p)) {
      if (level === 0) {
        emit_flat_tensor(p);
      } else {
        emit_flat_tensor(p);
      }
      return;
    }
    if (isdouble(p)) {
      emit_number(p, 0);
      return;
    }
    if (car(p) === symbol(ADD) || car(p) === symbol(MULTIPLY)) {
      emit_subexpr(p);
      return;
    }
    if (car(p) === symbol(POWER)) {
      emit_power(p);
      return;
    }
    if (iscons(p)) {
      emit_function(p);
      return;
    }
    if (isNumericAtom(p)) {
      if (level === 0) {
        emit_numerical_fraction(p);
      } else {
        emit_number(p, 0);
      }
      return;
    }
    if (issymbol(p)) {
      emit_symbol(p);
      return;
    }
    if (isstr(p)) {
      emit_string(p);
    }
  };

  emit_numerical_fraction = function(p) {
    var k1, k2, x;
    k1 = 0;
    k2 = 0;
    x = 0;
    save();
    push(p);
    mp_numerator();
    absval();
    p3 = pop();
    push(p);
    mp_denominator();
    p4 = pop();
    if (isplusone(p4)) {
      emit_number(p3, 0);
      restore();
      return;
    }
    x = emit_x;
    k1 = yindex;
    emit_number(p3, 0);
    k2 = yindex;
    emit_number(p4, 0);
    fixup_fraction(x, k1, k2);
    return restore();
  };

  isfactor = function(p) {
    if (iscons(p) && car(p) !== symbol(ADD) && car(p) !== symbol(MULTIPLY) && car(p) !== symbol(POWER)) {
      return 1;
    }
    if (issymbol(p)) {
      return 1;
    }
    if (isfraction(p)) {
      return 0;
    }
    if (isnegativenumber(p)) {
      return 0;
    }
    if (isNumericAtom(p)) {
      return 1;
    }
    return 0;
  };

  emit_power = function(p) {
    var k1, k2, x;
    k1 = 0;
    k2 = 0;
    x = 0;
    if (cadr(p) === symbol(E)) {
      __emit_str("exp(");
      emit_expr(caddr(p));
      __emit_char(')');
      return;
    }
    if (level > 0) {
      if (isminusone(caddr(p))) {
        __emit_char('1');
        __emit_char('/');
        if (isfactor(cadr(p))) {
          emit_factor(cadr(p));
        } else {
          emit_subexpr(cadr(p));
        }
      } else {
        if (isfactor(cadr(p))) {
          emit_factor(cadr(p));
        } else {
          emit_subexpr(cadr(p));
        }
        __emit_char('^');
        if (isfactor(caddr(p))) {
          emit_factor(caddr(p));
        } else {
          emit_subexpr(caddr(p));
        }
      }
      return;
    }
    if (__is_negative(caddr(p))) {
      x = emit_x;
      k1 = yindex;
      __emit_char('1');
      k2 = yindex;
      emit_denominator(p, 1);
      fixup_fraction(x, k1, k2);
      return;
    }
    k1 = yindex;
    if (isfactor(cadr(p))) {
      emit_factor(cadr(p));
    } else {
      emit_subexpr(cadr(p));
    }
    k2 = yindex;
    level++;
    emit_expr(caddr(p));
    level--;
    return fixup_power(k1, k2);
  };

  emit_denominator = function(p, n) {
    var k1, k2;
    k1 = 0;
    k2 = 0;
    if (isminusone(caddr(p))) {
      if (n === 1) {
        emit_expr(cadr(p));
      } else {
        emit_factor(cadr(p));
      }
      return;
    }
    k1 = yindex;
    if (isfactor(cadr(p))) {
      emit_factor(cadr(p));
    } else {
      emit_subexpr(cadr(p));
    }
    k2 = yindex;
    level++;
    emit_unsigned_expr(caddr(p));
    level--;
    return fixup_power(k1, k2);
  };

  emit_function = function(p) {
    if (car(p) === symbol(INDEX) && issymbol(cadr(p))) {
      emit_index_function(p);
      return;
    }
    if (car(p) === symbol(FACTORIAL)) {
      emit_factorial_function(p);
      return;
    }
    if (car(p) === symbol(DERIVATIVE)) {
      __emit_char('d');
    } else {
      emit_symbol(car(p));
    }
    __emit_char('(');
    p = cdr(p);
    if (iscons(p)) {
      emit_expr(car(p));
      p = cdr(p);
      while (iscons(p)) {
        __emit_char(',');
        emit_expr(car(p));
        p = cdr(p);
      }
    }
    return __emit_char(')');
  };

  emit_index_function = function(p) {
    p = cdr(p);
    if (caar(p) === symbol(ADD) || caar(p) === symbol(MULTIPLY) || caar(p) === symbol(POWER) || caar(p) === symbol(FACTORIAL)) {
      emit_subexpr(car(p));
    } else {
      emit_expr(car(p));
    }
    __emit_char('[');
    p = cdr(p);
    if (iscons(p)) {
      emit_expr(car(p));
      p = cdr(p);
      while (iscons(p)) {
        __emit_char(',');
        emit_expr(car(p));
        p = cdr(p);
      }
    }
    return __emit_char(']');
  };

  emit_factorial_function = function(p) {
    p = cadr(p);
    if (isfraction(p) || car(p) === symbol(ADD) || car(p) === symbol(MULTIPLY) || car(p) === symbol(POWER) || car(p) === symbol(FACTORIAL)) {
      emit_subexpr(p);
    } else {
      emit_expr(p);
    }
    return __emit_char('!');
  };

  emit_subexpr = function(p) {
    __emit_char('(');
    emit_expr(p);
    return __emit_char(')');
  };

  emit_symbol = function(p) {
    var i, j1, pPrintName, ref2, results;
    i = 0;
    if (p === symbol(E)) {
      __emit_str("exp(1)");
      return;
    }
    pPrintName = get_printname(p);
    results = [];
    for (i = j1 = 0, ref2 = pPrintName.length; 0 <= ref2 ? j1 < ref2 : j1 > ref2; i = 0 <= ref2 ? ++j1 : --j1) {
      results.push(__emit_char(pPrintName[i]));
    }
    return results;
  };

  emit_string = function(p) {
    var i, j1, pString, ref2;
    i = 0;
    pString = p.str;
    __emit_char('"');
    for (i = j1 = 0, ref2 = pString.length; 0 <= ref2 ? j1 < ref2 : j1 > ref2; i = 0 <= ref2 ? ++j1 : --j1) {
      __emit_char(pString[i]);
    }
    return __emit_char('"');
  };

  fixup_fraction = function(x, k1, k2) {
    var dx, dy, h1, h2, i, j1, ref2, ref3, ref4, results, w, w1, w2, y, y1, y2;
    dx = 0;
    dy = 0;
    i = 0;
    w = 0;
    y = 0;
    h1 = 0;
    w1 = 0;
    y1 = 0;
    h2 = 0;
    w2 = 0;
    y2 = 0;
    ref2 = get_size(k1, k2), h1 = ref2[0], w1 = ref2[1], y1 = ref2[2];
    ref3 = get_size(k2, yindex), h2 = ref3[0], w2 = ref3[1], y2 = ref3[2];
    if (w2 > w1) {
      dx = (w2 - w1) / 2;
    } else {
      dx = 0;
    }
    dx++;
    y = y1 + h1 - 1;
    dy = -y - 1;
    move(k1, k2, dx, dy);
    if (w2 > w1) {
      dx = -w1;
    } else {
      dx = -w1 + (w1 - w2) / 2;
    }
    dx++;
    dy = -y2 + 1;
    move(k2, yindex, dx, dy);
    if (w2 > w1) {
      w = w2;
    } else {
      w = w1;
    }
    w += 2;
    emit_x = x;
    results = [];
    for (i = j1 = 0, ref4 = w; 0 <= ref4 ? j1 < ref4 : j1 > ref4; i = 0 <= ref4 ? ++j1 : --j1) {
      results.push(__emit_char('-'));
    }
    return results;
  };

  fixup_power = function(k1, k2) {
    var dy, h1, h2, ref2, ref3, w1, w2, y1, y2;
    dy = 0;
    h1 = 0;
    w1 = 0;
    y1 = 0;
    h2 = 0;
    w2 = 0;
    y2 = 0;
    ref2 = get_size(k1, k2), h1 = ref2[0], w1 = ref2[1], y1 = ref2[2];
    ref3 = get_size(k2, yindex), h2 = ref3[0], w2 = ref3[1], y2 = ref3[2];
    dy = -y2 - h2 + 1;
    dy += y1 - 1;
    return move(k2, yindex, 0, dy);
  };

  move = function(j, k, dx, dy) {
    var i, j1, ref2, ref3, results;
    i = 0;
    results = [];
    for (i = j1 = ref2 = j, ref3 = k; ref2 <= ref3 ? j1 < ref3 : j1 > ref3; i = ref2 <= ref3 ? ++j1 : --j1) {
      chartab[i].x += dx;
      results.push(chartab[i].y += dy);
    }
    return results;
  };

  get_size = function(j, k) {
    var h, i, j1, max_x, max_y, min_x, min_y, ref2, ref3, w, y;
    i = 0;
    min_x = chartab[j].x;
    max_x = chartab[j].x;
    min_y = chartab[j].y;
    max_y = chartab[j].y;
    for (i = j1 = ref2 = j + 1, ref3 = k; ref2 <= ref3 ? j1 < ref3 : j1 > ref3; i = ref2 <= ref3 ? ++j1 : --j1) {
      if (chartab[i].x < min_x) {
        min_x = chartab[i].x;
      }
      if (chartab[i].x > max_x) {
        max_x = chartab[i].x;
      }
      if (chartab[i].y < min_y) {
        min_y = chartab[i].y;
      }
      if (chartab[i].y > max_y) {
        max_y = chartab[i].y;
      }
    }
    h = max_y - min_y + 1;
    w = max_x - min_x + 1;
    y = min_y;
    return [h, w, y];
  };

  displaychar = function(c) {
    return __emit_char(c);
  };

  __emit_char = function(c) {
    if (yindex === YMAX) {
      return;
    }
    if (chartab[yindex] == null) {
      debugger;
    }
    chartab[yindex].c = c;
    chartab[yindex].x = emit_x;
    chartab[yindex].y = 0;
    yindex++;
    return emit_x++;
  };

  __emit_str = function(s) {
    var i, j1, ref2, results;
    i = 0;
    results = [];
    for (i = j1 = 0, ref2 = s.length; 0 <= ref2 ? j1 < ref2 : j1 > ref2; i = 0 <= ref2 ? ++j1 : --j1) {
      results.push(__emit_char(s[i]));
    }
    return results;
  };

  emit_number = function(p, emit_sign) {
    var i, j1, l1, m1, ref2, ref3, ref4, results, results1, tmpString;
    tmpString = "";
    i = 0;
    switch (p.k) {
      case NUM:
        tmpString = p.q.a.toString();
        if (tmpString[0] === '-' && emit_sign === 0) {
          tmpString = tmpString.substring(1);
        }
        for (i = j1 = 0, ref2 = tmpString.length; 0 <= ref2 ? j1 < ref2 : j1 > ref2; i = 0 <= ref2 ? ++j1 : --j1) {
          __emit_char(tmpString[i]);
        }
        tmpString = p.q.b.toString();
        if (tmpString === "1") {
          break;
        }
        __emit_char('/');
        results = [];
        for (i = l1 = 0, ref3 = tmpString.length; 0 <= ref3 ? l1 < ref3 : l1 > ref3; i = 0 <= ref3 ? ++l1 : --l1) {
          results.push(__emit_char(tmpString[i]));
        }
        return results;
        break;
      case DOUBLE:
        tmpString = doubleToReasonableString(p.d);
        if (tmpString[0] === '-' && emit_sign === 0) {
          tmpString = tmpString.substring(1);
        }
        results1 = [];
        for (i = m1 = 0, ref4 = tmpString.length; 0 <= ref4 ? m1 < ref4 : m1 > ref4; i = 0 <= ref4 ? ++m1 : --m1) {
          results1.push(__emit_char(tmpString[i]));
        }
        return results1;
    }
  };

  cmpGlyphs = function(a, b) {
    if (a.y < b.y) {
      return -1;
    }
    if (a.y > b.y) {
      return 1;
    }
    if (a.x < b.x) {
      return -1;
    }
    if (a.x > b.x) {
      return 1;
    }
    return 0;
  };

  print_glyphs = function() {
    var accumulator, i, j1, ref2, subsetOfStack, x, y;
    i = 0;
    accumulator = "";
    subsetOfStack = chartab.slice(0, yindex);
    subsetOfStack.sort(cmpGlyphs);
    chartab = [].concat(subsetOfStack).concat(chartab.slice(yindex));
    x = 0;
    y = chartab[0].y;
    for (i = j1 = 0, ref2 = yindex; 0 <= ref2 ? j1 < ref2 : j1 > ref2; i = 0 <= ref2 ? ++j1 : --j1) {
      while (chartab[i].y > y) {
        accumulator += printchar('\n');
        x = 0;
        y++;
      }
      while (chartab[i].x > x) {
        accumulator += printchar_nowrap(' ');
        x++;
      }
      accumulator += printchar_nowrap(chartab[i].c);
      x++;
    }
    return accumulator;
  };

  buffer = "";

  getdisplaystr = function() {
    yindex = 0;
    level = 0;
    emit_x = 0;
    emit_expr(pop());
    fill_buf();
    return buffer;
  };

  fill_buf = function() {
    var i, j1, ref2, sIndex, subsetOfStack, tmpBuffer, x, y;
    tmpBuffer = buffer;
    sIndex = 0;
    i = 0;
    subsetOfStack = chartab.slice(0, yindex);
    subsetOfStack.sort(cmpGlyphs);
    chartab = [].concat(subsetOfStack).concat(chartab.slice(yindex));
    x = 0;
    y = chartab[0].y;
    for (i = j1 = 0, ref2 = yindex; 0 <= ref2 ? j1 < ref2 : j1 > ref2; i = 0 <= ref2 ? ++j1 : --j1) {
      while (chartab[i].y > y) {
        tmpBuffer[sIndex++] = '\n';
        x = 0;
        y++;
      }
      while (chartab[i].x > x) {
        tmpBuffer[sIndex++] = ' ';
        x++;
      }
      tmpBuffer[sIndex++] = chartab[i].c;
      x++;
    }
    return tmpBuffer[sIndex++] = '\n';
  };

  N = 100;

  oneElement = (function() {
    function oneElement() {}

    oneElement.prototype.x = 0;

    oneElement.prototype.y = 0;

    oneElement.prototype.h = 0;

    oneElement.prototype.w = 0;

    oneElement.prototype.index = 0;

    oneElement.prototype.count = 0;

    return oneElement;

  })();

  elem = [];

  for (elelmIndex = j1 = 0; j1 < 10000; elelmIndex = ++j1) {
    elem[elelmIndex] = new oneElement;
  }

  SPACE_BETWEEN_COLUMNS = 3;

  SPACE_BETWEEN_ROWS = 1;

  emit_tensor = function(p) {
    var col, dx, dy, eh, ew, h, i, l1, m1, n, n1, ncol, nrow, o1, ref2, ref3, ref4, ref5, ref6, row, w, x, y;
    i = 0;
    n = 0;
    nrow = 0;
    ncol = 0;
    x = 0;
    y = 0;
    h = 0;
    w = 0;
    dx = 0;
    dy = 0;
    eh = 0;
    ew = 0;
    row = 0;
    col = 0;
    if (p.tensor.ndim > 2) {
      emit_flat_tensor(p);
      return;
    }
    nrow = p.tensor.dim[0];
    if (p.tensor.ndim === 2) {
      ncol = p.tensor.dim[1];
    } else {
      ncol = 1;
    }
    n = nrow * ncol;
    if (n > N) {
      emit_flat_tensor(p);
      return;
    }
    x = emit_x;
    for (i = l1 = 0, ref2 = n; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      elem[i].index = yindex;
      elem[i].x = emit_x;
      emit_expr(p.tensor.elem[i]);
      elem[i].count = yindex - elem[i].index;
      ref3 = get_size(elem[i].index, yindex), elem[i].h = ref3[0], elem[i].w = ref3[1], elem[i].y = ref3[2];
    }
    eh = 0;
    ew = 0;
    for (i = m1 = 0, ref4 = n; 0 <= ref4 ? m1 < ref4 : m1 > ref4; i = 0 <= ref4 ? ++m1 : --m1) {
      if (elem[i].h > eh) {
        eh = elem[i].h;
      }
      if (elem[i].w > ew) {
        ew = elem[i].w;
      }
    }
    h = nrow * eh + (nrow - 1) * SPACE_BETWEEN_ROWS;
    w = ncol * ew + (ncol - 1) * SPACE_BETWEEN_COLUMNS;
    y = -(h / 2);
    for (row = n1 = 0, ref5 = nrow; 0 <= ref5 ? n1 < ref5 : n1 > ref5; row = 0 <= ref5 ? ++n1 : --n1) {
      for (col = o1 = 0, ref6 = ncol; 0 <= ref6 ? o1 < ref6 : o1 > ref6; col = 0 <= ref6 ? ++o1 : --o1) {
        i = row * ncol + col;
        dx = x - elem[i].x;
        dy = y - elem[i].y;
        move(elem[i].index, elem[i].index + elem[i].count, dx, dy);
        dx = 0;
        if (col > 0) {
          dx = col * (ew + SPACE_BETWEEN_COLUMNS);
        }
        dy = 0;
        if (row > 0) {
          dy = row * (eh + SPACE_BETWEEN_ROWS);
        }
        dx += (ew - elem[i].w) / 2;
        dy += (eh - elem[i].h) / 2;
        move(elem[i].index, elem[i].index + elem[i].count, dx, dy);
      }
    }
    return emit_x = x + w;

    /*
    if 0
    
       * left brace
    
      for (i = 0; i < h; i++) {
        if (yindex == YMAX)
          break
        chartab[yindex].c = '|'
        chartab[yindex].x = x - 2
        chartab[yindex].y = y + i
        yindex++
      }
    
       * right brace
    
      emit_x++
    
      for (i = 0; i < h; i++) {
        if (yindex == YMAX)
          break
        chartab[yindex].c = '|'
        chartab[yindex].x = emit_x
        chartab[yindex].y = y + i
        yindex++
      }
    
      emit_x++
    
    endif
     */
  };

  emit_flat_tensor = function(p) {
    return emit_tensor_inner(p, 0, 0);
  };

  emit_tensor_inner = function(p, j, k) {
    var i, l1, ref2;
    i = 0;
    __emit_char('(');
    for (i = l1 = 0, ref2 = p.tensor.dim[j]; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      if (j + 1 === p.tensor.ndim) {
        emit_expr(p.tensor.elem[k]);
        k = k + 1;
      } else {
        k = emit_tensor_inner(p, j + 1, k);
      }
      if (i + 1 < p.tensor.dim[j]) {
        __emit_char(',');
      }
    }
    __emit_char(')');
    return k;
  };

  Eval_product = function() {
    var body, i, indexVariable, j, k, l1, oldIndexVariableValue, ref2, ref3;
    i = 0;
    j = 0;
    k = 0;
    body = cadr(p1);
    indexVariable = caddr(p1);
    if (!issymbol(indexVariable)) {
      stop("sum: 2nd arg?");
    }
    push(cadddr(p1));
    Eval();
    j = pop_integer();
    if (isNaN(j)) {
      push(p1);
      return;
    }
    push(caddddr(p1));
    Eval();
    k = pop_integer();
    if (isNaN(k)) {
      push(p1);
      return;
    }
    oldIndexVariableValue = get_binding(indexVariable);
    push_integer(1);
    for (i = l1 = ref2 = j, ref3 = k; ref2 <= ref3 ? l1 <= ref3 : l1 >= ref3; i = ref2 <= ref3 ? ++l1 : --l1) {
      push_integer(i);
      p5 = pop();
      set_binding(indexVariable, p5);
      push(body);
      Eval();
      if (DEBUG) {
        console.log("product - factor 1: " + stack[tos - 1].toString());
        console.log("product - factor 2: " + stack[tos - 2].toString());
      }
      multiply();
      if (DEBUG) {
        console.log("product - result: " + stack[tos - 1].toString());
      }
    }
    return set_binding(indexVariable, oldIndexVariableValue);
  };

  qadd = function() {
    var gcdBetweenNumeratorAndDenominator, qadd_ab, qadd_ba, qadd_denominator, qadd_frac1, qadd_frac2, qadd_numerator, resultSum;
    qadd_frac2 = pop();
    qadd_frac1 = pop();
    qadd_ab = mmul(qadd_frac1.q.a, qadd_frac2.q.b);
    qadd_ba = mmul(qadd_frac1.q.b, qadd_frac2.q.a);
    qadd_numerator = madd(qadd_ab, qadd_ba);
    if (MZERO(qadd_numerator)) {
      push(zero);
      return;
    }
    qadd_denominator = mmul(qadd_frac1.q.b, qadd_frac2.q.b);
    gcdBetweenNumeratorAndDenominator = mgcd(qadd_numerator, qadd_denominator);
    gcdBetweenNumeratorAndDenominator = makeSignSameAs(gcdBetweenNumeratorAndDenominator, qadd_denominator);
    resultSum = new U();
    resultSum.k = NUM;
    resultSum.q.a = mdiv(qadd_numerator, gcdBetweenNumeratorAndDenominator);
    resultSum.q.b = mdiv(qadd_denominator, gcdBetweenNumeratorAndDenominator);
    return push(resultSum);
  };

  qdiv = function() {
    var aa, bb, c;
    save();
    p2 = pop();
    p1 = pop();
    if (MZERO(p2.q.a)) {
      stop("divide by zero");
    }
    if (MZERO(p1.q.a)) {
      push(zero);
      restore();
      return;
    }
    aa = mmul(p1.q.a, p2.q.b);
    bb = mmul(p1.q.b, p2.q.a);
    c = mgcd(aa, bb);
    c = makeSignSameAs(c, bb);
    p1 = new U();
    p1.k = NUM;
    p1.q.a = mdiv(aa, c);
    p1.q.b = mdiv(bb, c);
    push(p1);
    return restore();
  };

  qmul = function() {
    var aa, bb, c;
    save();
    p2 = pop();
    p1 = pop();
    if (MZERO(p1.q.a) || MZERO(p2.q.a)) {
      push(zero);
      restore();
      return;
    }
    aa = mmul(p1.q.a, p2.q.a);
    bb = mmul(p1.q.b, p2.q.b);
    c = mgcd(aa, bb);
    c = makeSignSameAs(c, bb);
    p1 = new U();
    p1.k = NUM;
    p1.q.a = mdiv(aa, c);
    p1.q.b = mdiv(bb, c);
    push(p1);
    return restore();
  };

  qpow = function() {
    save();
    qpowf();
    return restore();
  };

  qpowf = function() {
    var a, b, expo, t, x, y;
    expo = 0;
    p2 = pop();
    p1 = pop();
    if (isplusone(p1) || isZeroAtomOrTensor(p2)) {
      push_integer(1);
      return;
    }
    if (isminusone(p1) && isoneovertwo(p2)) {
      push(imaginaryunit);
      return;
    }
    if (isZeroAtomOrTensor(p1)) {
      if (isnegativenumber(p2)) {
        stop("divide by zero");
      }
      push(zero);
      return;
    }
    if (isplusone(p2)) {
      push(p1);
      return;
    }
    if (isinteger(p2)) {
      push(p2);
      expo = pop_integer();
      if (isNaN(expo)) {
        push_symbol(POWER);
        push(p1);
        push(p2);
        list(3);
        return;
      }
      x = mpow(p1.q.a, Math.abs(expo));
      y = mpow(p1.q.b, Math.abs(expo));
      if (expo < 0) {
        t = x;
        x = y;
        y = t;
        x = makeSignSameAs(x, y);
        y = makePositive(y);
      }
      p3 = new U();
      p3.k = NUM;
      p3.q.a = x;
      p3.q.b = y;
      push(p3);
      return;
    }
    if (isminusone(p1)) {
      push(p2);
      normalize_angle();
      return;
    }
    if (isnegativenumber(p1)) {
      push(p1);
      negate();
      push(p2);
      qpow();
      push_integer(-1);
      push(p2);
      qpow();
      multiply();
      return;
    }
    if (!isinteger(p1)) {
      push(p1);
      mp_numerator();
      push(p2);
      qpow();
      push(p1);
      mp_denominator();
      push(p2);
      negate();
      qpow();
      multiply();
      return;
    }
    if (is_small_integer(p1)) {
      push(p1);
      push(p2);
      quickfactor();
      return;
    }
    if (!isSmall(p2.q.a) || !isSmall(p2.q.b)) {
      push_symbol(POWER);
      push(p1);
      push(p2);
      list(3);
      return;
    }
    a = p2.q.a;
    b = p2.q.b;
    x = mroot(p1.q.a, b);
    if (x === 0) {
      push_symbol(POWER);
      push(p1);
      push(p2);
      list(3);
      return;
    }
    y = mpow(x, a);
    p3 = new U();
    p3.k = NUM;
    if (p2.q.a.isNegative()) {
      p3.q.a = bigInt(1);
      p3.q.b = y;
    } else {
      p3.q.a = y;
      p3.q.b = bigInt(1);
    }
    return push(p3);
  };

  normalize_angle = function() {
    save();
    p1 = pop();
    if (isinteger(p1)) {
      if (p1.q.a.isOdd()) {
        push_integer(-1);
      } else {
        push_integer(1);
      }
      restore();
      return;
    }
    push(p1);
    bignum_truncate();
    p2 = pop();
    if (isnegativenumber(p1)) {
      push(p2);
      push_integer(-1);
      add();
      p2 = pop();
    }
    push(p1);
    push(p2);
    subtract();
    p3 = pop();
    push_symbol(POWER);
    push_integer(-1);
    push(p3);
    list(3);
    if (p2.q.a.isOdd()) {
      negate();
    }
    return restore();
  };

  is_small_integer = function(p) {
    return isSmall(p.q.a);
  };

  quickfactor = function() {
    var h, i, l1, n, ref2, stackIndex;
    i = 0;
    save();
    p2 = pop();
    p1 = pop();
    h = tos;
    push(p1);
    factor_small_number();
    n = tos - h;
    stackIndex = h;
    for (i = l1 = 0, ref2 = n; l1 < ref2; i = l1 += 2) {
      push(stack[stackIndex + i]);
      push(stack[stackIndex + i + 1]);
      push(p2);
      multiply();
      quickpower();
    }
    multiply_all(tos - h - n);
    p1 = pop();
    moveTos(h);
    push(p1);
    return restore();
  };

  quickpower = function() {
    var expo;
    expo = 0;
    save();
    p2 = pop();
    p1 = pop();
    push(p2);
    bignum_truncate();
    p3 = pop();
    push(p2);
    push(p3);
    subtract();
    p4 = pop();
    if (!isZeroAtomOrTensor(p4)) {
      push_symbol(POWER);
      push(p1);
      push(p4);
      list(3);
    }
    push(p3);
    expo = pop_integer();
    if (isNaN(expo)) {
      push_symbol(POWER);
      push(p1);
      push(p3);
      list(3);
      restore();
      return;
    }
    if (expo === 0) {
      restore();
      return;
    }
    push(p1);
    bignum_power_number(expo);
    return restore();
  };

  Eval_quotient = function() {
    push(cadr(p1));
    Eval();
    push(caddr(p1));
    Eval();
    push(cadddr(p1));
    Eval();
    p1 = pop();
    if (p1 === symbol(NIL)) {
      p1 = symbol(SYMBOL_X);
    }
    push(p1);
    return divpoly();
  };

  divpoly = function() {
    var dividend, divisor, h, i, l1, m, n, ref2, x;
    h = 0;
    i = 0;
    m = 0;
    n = 0;
    x = 0;
    save();
    p3 = pop();
    p2 = pop();
    p1 = pop();
    h = tos;
    dividend = tos;
    push(p1);
    push(p3);
    m = coeff() - 1;
    divisor = tos;
    push(p2);
    push(p3);
    n = coeff() - 1;
    x = m - n;
    push_integer(0);
    p5 = pop();
    while (x >= 0) {
      push(stack[dividend + m]);
      push(stack[divisor + n]);
      divide();
      p4 = pop();
      for (i = l1 = 0, ref2 = n; 0 <= ref2 ? l1 <= ref2 : l1 >= ref2; i = 0 <= ref2 ? ++l1 : --l1) {
        push(stack[dividend + x + i]);
        push(stack[divisor + i]);
        push(p4);
        multiply();
        subtract();
        stack[dividend + x + i] = pop();
      }
      push(p5);
      push(p4);
      push(p3);
      push_integer(x);
      power();
      multiply();
      add();
      p5 = pop();
      m--;
      x--;
    }
    moveTos(h);
    push(p5);
    return restore();
  };

  Eval_rationalize = function() {
    push(cadr(p1));
    Eval();
    return rationalize();
  };

  rationalize = function() {
    var x;
    x = expanding;
    yyrationalize();
    return expanding = x;
  };

  yyrationalize = function() {
    var commonDenominator, eachTerm, theArgument;
    theArgument = pop();
    if (istensor(theArgument)) {
      __rationalize_tensor(theArgument);
      return;
    }
    expanding = 0;
    if (car(theArgument) !== symbol(ADD)) {
      push(theArgument);
      return;
    }
    if (DEBUG) {
      printf("rationalize: this is the input expr:\n");
      printline(theArgument);
    }
    push(one);
    multiply_denominators(theArgument);
    commonDenominator = pop();
    if (DEBUG) {
      printf("rationalize: this is the common denominator:\n");
      printline(commonDenominator);
    }
    push(zero);
    eachTerm = cdr(theArgument);
    while (iscons(eachTerm)) {
      push(commonDenominator);
      push(car(eachTerm));
      multiply();
      add();
      eachTerm = cdr(eachTerm);
    }
    if (DEBUG) {
      printf("rationalize: original expr times common denominator:\n");
      printline(stack[tos - 1]);
    }
    Condense();
    if (DEBUG) {
      printf("rationalize: after factoring:\n");
      printline(stack[tos - 1]);
    }
    push(commonDenominator);
    divide();
    if (DEBUG) {
      printf("rationalize: after dividing by common denom. (and we're done):\n");
      return printline(stack[tos - 1]);
    }
  };

  multiply_denominators = function(p) {
    var results;
    if (car(p) === symbol(ADD)) {
      p = cdr(p);
      results = [];
      while (iscons(p)) {
        multiply_denominators_term(car(p));
        results.push(p = cdr(p));
      }
      return results;
    } else {
      return multiply_denominators_term(p);
    }
  };

  multiply_denominators_term = function(p) {
    var results;
    if (car(p) === symbol(MULTIPLY)) {
      p = cdr(p);
      results = [];
      while (iscons(p)) {
        multiply_denominators_factor(car(p));
        results.push(p = cdr(p));
      }
      return results;
    } else {
      return multiply_denominators_factor(p);
    }
  };

  multiply_denominators_factor = function(p) {
    if (car(p) !== symbol(POWER)) {
      return;
    }
    push(p);
    p = caddr(p);
    if (isnegativenumber(p)) {
      inverse();
      __lcm();
      return;
    }
    if (car(p) === symbol(MULTIPLY) && isnegativenumber(cadr(p))) {
      inverse();
      __lcm();
      return;
    }
    return pop();
  };

  __rationalize_tensor = function(theTensor) {
    var i, l1, n, ref2;
    i = 0;
    push(theTensor);
    Eval();
    theTensor = pop();
    if (!istensor(theTensor)) {
      push(theTensor);
      return;
    }
    n = theTensor.tensor.nelem;
    for (i = l1 = 0, ref2 = n; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      push(theTensor.tensor.elem[i]);
      rationalize();
      theTensor.tensor.elem[i] = pop();
    }
    check_tensor_dimensions(theTensor);
    return push(theTensor);
  };

  __lcm = function() {
    save();
    p1 = pop();
    p2 = pop();
    push(p1);
    push(p2);
    multiply();
    push(p1);
    push(p2);
    gcd();
    divide();
    return restore();
  };


  /*
   Returns the real part of complex z
  
    z    real(z)
    -    -------
  
    a + i b    a
  
    exp(i a)  cos(a)
   */

  Eval_real = function() {
    push(cadr(p1));
    Eval();
    return real();
  };

  real = function() {
    save();
    rect();
    p1 = pop();
    push(p1);
    push(p1);
    conjugate();
    add();
    push_integer(2);
    divide();
    return restore();
  };


  /*
  Convert complex z to rectangular form
  
    Input:    push  z
  
    Output:    Result on stack
   */

  DEBUG_RECT = false;

  Eval_rect = function() {
    push(cadr(p1));
    Eval();
    return rect();
  };

  rect = function() {
    var input;
    save();
    p1 = pop();
    input = p1;
    if (DEBUG_RECT) {
      console.log("RECT of " + input);
    }
    if (DEBUG_RECT) {
      console.log("any clock forms in : " + input + " ? " + findPossibleClockForm(input));
    }
    if (issymbol(p1)) {
      if (DEBUG_RECT) {
        console.log(" rect: simple symbol: " + input);
      }
      if (!isZeroAtomOrTensor(get_binding(symbol(ASSUME_REAL_VARIABLES)))) {
        push(p1);
      } else {
        push_symbol(YYRECT);
        push(p1);
        list(2);
      }
    } else if (!isZeroAtomOrTensor(get_binding(symbol(ASSUME_REAL_VARIABLES))) && !findPossibleExponentialForm(p1) && !findPossibleClockForm(p1) && !(Find(p1, symbol(SIN)) && Find(p1, symbol(COS)) && Find(p1, imaginaryunit))) {
      if (DEBUG_RECT) {
        console.log(" rect: simple symbol: " + input);
      }
      push(p1);
    } else if (car(p1) === symbol(MULTIPLY) && isimaginaryunit(cadr(p1)) && !isZeroAtomOrTensor(get_binding(symbol(ASSUME_REAL_VARIABLES)))) {
      push(p1);
    } else if (car(p1) === symbol(ADD)) {
      if (DEBUG_RECT) {
        console.log(" rect - " + input + " is a sum ");
      }
      push_integer(0);
      p1 = cdr(p1);
      while (iscons(p1)) {
        push(car(p1));
        rect();
        add();
        p1 = cdr(p1);
      }
    } else {
      if (DEBUG_RECT) {
        console.log(" rect - " + input + " is NOT a sum ");
      }
      push(p1);
      abs();
      if (DEBUG_RECT) {
        console.log(" rect - " + input + " abs: " + stack[tos - 1].toString());
      }
      push(p1);
      arg();
      if (DEBUG_RECT) {
        console.log(" rect - " + input + " arg of " + p1 + " : " + stack[tos - 1].toString());
      }
      p1 = pop();
      push(p1);
      cosine();
      if (DEBUG_RECT) {
        console.log(" rect - " + input + " cosine: " + stack[tos - 1].toString());
      }
      push(imaginaryunit);
      push(p1);
      sine();
      if (DEBUG_RECT) {
        console.log(" rect - " + input + " sine: " + stack[tos - 1].toString());
      }
      multiply();
      if (DEBUG_RECT) {
        console.log(" rect - " + input + " i * sine: " + stack[tos - 1].toString());
      }
      add();
      if (DEBUG_RECT) {
        console.log(" rect - " + input + " cos + i * sine: " + stack[tos - 1].toString());
      }
      multiply();
    }
    restore();
    if (DEBUG_RECT) {
      return console.log("rect of " + input + " : " + stack[tos - 1]);
    }
  };

  show_power_debug = false;

  performing_roots = false;

  Eval_roots = function() {
    p2 = cadr(p1);
    if (car(p2) === symbol(SETQ) || car(p2) === symbol(TESTEQ)) {
      push(cadr(p2));
      Eval();
      push(caddr(p2));
      Eval();
      subtract();
    } else {
      push(p2);
      Eval();
      p2 = pop();
      if (car(p2) === symbol(SETQ) || car(p2) === symbol(TESTEQ)) {
        push(cadr(p2));
        Eval();
        push(caddr(p2));
        Eval();
        subtract();
      } else {
        push(p2);
      }
    }
    push(caddr(p1));
    Eval();
    p2 = pop();
    if (p2 === symbol(NIL)) {
      guess();
    } else {
      push(p2);
    }
    p2 = pop();
    p1 = pop();
    if (!ispolyexpandedform(p1, p2)) {
      stop("roots: 1st argument is not a polynomial");
    }
    push(p1);
    push(p2);
    return roots();
  };

  hasImaginaryCoeff = function(k) {
    var h, i, imaginaryCoefficients, l1, ref2;
    imaginaryCoefficients = false;
    h = tos;
    for (i = l1 = ref2 = k; l1 > 0; i = l1 += -1) {
      if (iscomplexnumber(stack[tos - i])) {
        imaginaryCoefficients = true;
        break;
      }
    }
    return imaginaryCoefficients;
  };

  isSimpleRoot = function(k) {
    var h, i, isSimpleRootPolynomial, l1, ref2;
    if (k > 2) {
      isSimpleRootPolynomial = true;
      h = tos;
      if (isZeroAtomOrTensor(stack[tos - k])) {
        isSimpleRootPolynomial = false;
      }
      for (i = l1 = ref2 = k - 1; l1 > 1; i = l1 += -1) {
        if (!isZeroAtomOrTensor(stack[tos - i])) {
          isSimpleRootPolynomial = false;
          break;
        }
      }
    } else {
      isSimpleRootPolynomial = false;
    }
    return isSimpleRootPolynomial;
  };

  normalisedCoeff = function() {
    var divideBy, i, k, l1, m1, miniStack, ref2, ref3;
    k = coeff();
    divideBy = stack[tos - 1];
    miniStack = [];
    for (i = l1 = 1, ref2 = k; 1 <= ref2 ? l1 <= ref2 : l1 >= ref2; i = 1 <= ref2 ? ++l1 : --l1) {
      miniStack.push(pop());
    }
    for (i = m1 = ref3 = k - 1; ref3 <= 0 ? m1 <= 0 : m1 >= 0; i = ref3 <= 0 ? ++m1 : --m1) {
      push(miniStack[i]);
      push(divideBy);
      divide();
    }
    return k;
  };

  roots = function() {
    var h, i, k, l1, lastCoeff, leadingCoeff, n, ref2;
    h = 0;
    i = 0;
    n = 0;
    save();
    if (recursionLevelNestedRadicalsRemoval > 1) {
      pop();
      pop();
      push(symbol(NIL));
      restore();
      return;
    }
    performing_roots = true;
    h = tos - 2;
    if (DEBUG) {
      console.log("checking if " + stack[tos - 1].toString() + " is a case of simple roots");
    }
    p2 = pop();
    p1 = pop();
    push(p1);
    push(p2);
    push(p1);
    push(p2);
    k = normalisedCoeff();
    if (isSimpleRoot(k)) {
      if (DEBUG) {
        console.log("yes, " + stack[tos - 1].toString() + " is a case of simple roots");
      }
      lastCoeff = stack[tos - k];
      leadingCoeff = stack[tos - 1];
      moveTos(tos - k);
      pop();
      pop();
      getSimpleRoots(k, leadingCoeff, lastCoeff);
    } else {
      moveTos(tos - k);
      roots2();
    }
    n = tos - h;
    if (n === 0) {
      stop("roots: the polynomial is not factorable, try nroots");
    }
    if (n === 1) {
      performing_roots = false;
      restore();
      return;
    }
    sort_stack(n);
    p1 = alloc_tensor(n);
    p1.tensor.ndim = 1;
    p1.tensor.dim[0] = n;
    for (i = l1 = 0, ref2 = n; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      p1.tensor.elem[i] = stack[h + i];
    }
    moveTos(h);
    push(p1);
    restore();
    return performing_roots = false;
  };

  getSimpleRoots = function(n, leadingCoeff, lastCoeff) {
    var aSol, commonPart, l1, m1, ref2, ref3, rootsOfOne;
    if (DEBUG) {
      console.log("getSimpleRoots");
    }
    save();
    n = n - 1;
    push(lastCoeff);
    push_rational(1, n);
    power();
    push(leadingCoeff);
    push_rational(1, n);
    power();
    divide();
    commonPart = pop();
    if (n % 2 === 0) {
      for (rootsOfOne = l1 = 1, ref2 = n; l1 <= ref2; rootsOfOne = l1 += 2) {
        push(commonPart);
        push_integer(-1);
        push_rational(rootsOfOne, n);
        power();
        multiply();
        aSol = pop();
        push(aSol);
        push(aSol);
        negate();
      }
    } else {
      for (rootsOfOne = m1 = 1, ref3 = n; 1 <= ref3 ? m1 <= ref3 : m1 >= ref3; rootsOfOne = 1 <= ref3 ? ++m1 : --m1) {
        push(commonPart);
        push_integer(-1);
        push_rational(rootsOfOne, n);
        power();
        multiply();
        if (rootsOfOne % 2 === 0) {
          negate();
        }
      }
    }
    return restore();
  };

  roots2 = function() {
    var k;
    save();
    p2 = pop();
    p1 = pop();
    push(p1);
    push(p2);
    push(p1);
    push(p2);
    k = normalisedCoeff();
    if (!hasImaginaryCoeff(k)) {
      moveTos(tos - k);
      factorpoly();
      p1 = pop();
    } else {
      moveTos(tos - k);
      pop();
      pop();
    }
    if (car(p1) === symbol(MULTIPLY)) {
      p1 = cdr(p1);
      while (iscons(p1)) {
        push(car(p1));
        push(p2);
        roots3();
        p1 = cdr(p1);
      }
    } else {
      push(p1);
      push(p2);
      roots3();
    }
    return restore();
  };

  roots3 = function() {
    var n;
    save();
    p2 = pop();
    p1 = pop();
    if (car(p1) === symbol(POWER) && ispolyexpandedform(cadr(p1), p2) && isposint(caddr(p1))) {
      push(cadr(p1));
      push(p2);
      n = normalisedCoeff();
      mini_solve(n);
    } else if (ispolyexpandedform(p1, p2)) {
      push(p1);
      push(p2);
      n = normalisedCoeff();
      mini_solve(n);
    }
    return restore();
  };

  mini_solve = function(n) {
    var C_CHECKED_AS_NOT_ZERO, Q_CHECKED_AS_NOT_ZERO, R_18_a_b_c_d, R_27_a2_d, R_2_b3, R_3_a, R_3_a_C, R_3_a_c, R_4_DELTA03, R_6_a, R_6_a_C, R_C, R_C_over_3a, R_C_simplified_toCheckIfZero, R_DELTA0, R_DELTA0_simplified_toCheckIfZero, R_DELTA0_toBeCheckedIfZero, R_DELTA1, R_Q, R_Q_simplified_toCheckIfZero, R_S, R_S_simplified_toCheckIfZero, R_a2, R_a2_d, R_a2_d2, R_a3, R_a_b_c, R_a_b_c_d, R_a_c, R_b2, R_b2_c2, R_b3, R_b3_d, R_c2, R_c3, R_d2, R_determinant, R_determinant_simplified_toCheckIfZero, R_e2, R_e3, R_m, R_m27_a2_d2, R_m4_a_c3, R_m4_b3_d, R_m9_a_b_c, R_m_b_over_3a, R_minus_4S2_minus_2p, R_minus_b_over_4a, R_p, R_principalCubicRoot, R_q, R_q_over_S, R_r, S_CHECKED_AS_NOT_ZERO, ThreePPlus2M, TwoQOversqrtPPlus2M, biquadraticSolutions, choiceOfRadicalInQSoSIsNotZero, coeff2, coeff3, coeff4, depressedSolutions, eachSolution, flipSignOFQSoCIsNotZero, flipSignOFRadicalSoQIsNotZero, i_sqrt3, l1, len, len1, len2, m1, n1, one_minus_i_sqrt3, one_plus_i_sqrt3, ref2, ref3, ref4, resolventCubicSolutions, root_solution, sqrtPPlus2M, toBeCheckedIFZero;
    save();
    if (n === 2) {
      p3 = pop();
      p4 = pop();
      push(p4);
      push(p3);
      divide();
      negate();
      restore();
      return;
    }
    if (n === 3) {
      p3 = pop();
      p4 = pop();
      p5 = pop();
      push(p4);
      push_integer(2);
      power();
      push_integer(4);
      push(p3);
      multiply();
      push(p5);
      multiply();
      subtract();
      push_rational(1, 2);
      power();
      p6 = pop();
      push(p6);
      push(p4);
      subtract();
      push(p3);
      push_integer(2);
      multiply();
      divide();
      push(p6);
      push(p4);
      add();
      negate();
      push(p3);
      divide();
      push_rational(1, 2);
      multiply();
      restore();
      return;
    }
    if (n === 4 || n === 5) {
      p3 = pop();
      p4 = pop();
      p5 = pop();
      p6 = pop();
      push(p5);
      push(p5);
      multiply();
      R_c2 = pop();
      push(R_c2);
      push(p5);
      multiply();
      R_c3 = pop();
      push(p4);
      push(p4);
      multiply();
      R_b2 = pop();
      push(R_b2);
      push(p4);
      multiply();
      R_b3 = pop();
      push(R_b3);
      push(p6);
      multiply();
      R_b3_d = pop();
      push(R_b3_d);
      push_integer(-4);
      multiply();
      R_m4_b3_d = pop();
      push(R_b3);
      push_integer(2);
      multiply();
      R_2_b3 = pop();
      push(p3);
      push(p3);
      multiply();
      R_a2 = pop();
      push(R_a2);
      push(p3);
      multiply();
      R_a3 = pop();
      push_integer(3);
      push(p3);
      multiply();
      R_3_a = pop();
      push(R_a2);
      push(p6);
      multiply();
      R_a2_d = pop();
      push(R_a2_d);
      push(p6);
      multiply();
      R_a2_d2 = pop();
      push(R_a2_d);
      push_integer(27);
      multiply();
      R_27_a2_d = pop();
      push(R_a2_d2);
      push_integer(-27);
      multiply();
      R_m27_a2_d2 = pop();
      push(R_3_a);
      push_integer(2);
      multiply();
      R_6_a = pop();
      push(p3);
      push(p5);
      multiply();
      R_a_c = pop();
      push(R_a_c);
      push(p4);
      multiply();
      R_a_b_c = pop();
      push(R_a_b_c);
      push(p6);
      multiply();
      R_a_b_c_d = pop();
      push(R_a_c);
      push_integer(3);
      multiply();
      R_3_a_c = pop();
      push_integer(-4);
      push(p3);
      push(R_c3);
      multiply();
      multiply();
      R_m4_a_c3 = pop();
      push(R_a_b_c);
      push_integer(9);
      multiply();
      negate();
      R_m9_a_b_c = pop();
      push(R_a_b_c_d);
      push_integer(18);
      multiply();
      R_18_a_b_c_d = pop();
      push(R_b2);
      push(R_3_a_c);
      subtract();
      R_DELTA0 = pop();
      push(R_b2);
      push(R_c2);
      multiply();
      R_b2_c2 = pop();
      push(p4);
      negate();
      push(R_3_a);
      divide();
      R_m_b_over_3a = pop();
      if (n === 4) {
        if (DEBUG) {
          console.log(">>>>>>>>>>>>>>>> actually using cubic formula <<<<<<<<<<<<<<< ");
        }
        if (DEBUG) {
          console.log("cubic: D0: " + R_DELTA0.toString());
        }
        push(R_DELTA0);
        push_integer(3);
        power();
        push_integer(4);
        multiply();
        R_4_DELTA03 = pop();
        push(R_DELTA0);
        simplify();
        absValFloat();
        R_DELTA0_toBeCheckedIfZero = pop();
        if (DEBUG) {
          console.log("cubic: D0 as float: " + R_DELTA0_toBeCheckedIfZero.toString());
        }
        push(R_18_a_b_c_d);
        push(R_m4_b3_d);
        push(R_b2_c2);
        push(R_m4_a_c3);
        push(R_m27_a2_d2);
        add();
        add();
        add();
        add();
        simplify();
        absValFloat();
        R_determinant = pop();
        if (DEBUG) {
          console.log("cubic: DETERMINANT: " + R_determinant.toString());
        }
        push(R_2_b3);
        push(R_m9_a_b_c);
        push(R_27_a2_d);
        add();
        add();
        R_DELTA1 = pop();
        if (DEBUG) {
          console.log("cubic: D1: " + R_DELTA1.toString());
        }
        push(R_DELTA1);
        push_integer(2);
        power();
        push(R_4_DELTA03);
        subtract();
        push_rational(1, 2);
        power();
        simplify();
        R_Q = pop();
        if (isZeroAtomOrTensor(R_determinant)) {
          if (isZeroAtomOrTensor(R_DELTA0_toBeCheckedIfZero)) {
            if (DEBUG) {
              console.log(" cubic: DETERMINANT IS ZERO and delta0 is zero");
            }
            push(R_m_b_over_3a);
            restore();
            return;
          } else {
            if (DEBUG) {
              console.log(" cubic: DETERMINANT IS ZERO and delta0 is not zero");
            }
            push(p3);
            push(p6);
            push_integer(9);
            multiply();
            multiply();
            push(p4);
            push(p5);
            multiply();
            subtract();
            push(R_DELTA0);
            push_integer(2);
            multiply();
            divide();
            root_solution = pop();
            push(root_solution);
            push(root_solution);
            push(R_a_b_c);
            push_integer(4);
            multiply();
            push(p3);
            push(p3);
            push(p6);
            push_integer(9);
            multiply();
            multiply();
            multiply();
            negate();
            push(R_b3);
            negate();
            add();
            add();
            push(p3);
            push(R_DELTA0);
            multiply();
            divide();
            restore();
            return;
          }
        }
        C_CHECKED_AS_NOT_ZERO = false;
        flipSignOFQSoCIsNotZero = false;
        while (!C_CHECKED_AS_NOT_ZERO) {
          push(R_Q);
          if (flipSignOFQSoCIsNotZero) {
            negate();
          }
          push(R_DELTA1);
          add();
          push_rational(1, 2);
          multiply();
          push_rational(1, 3);
          power();
          simplify();
          R_C = pop();
          if (DEBUG) {
            console.log("cubic: C: " + R_C.toString());
          }
          push(R_C);
          simplify();
          absValFloat();
          R_C_simplified_toCheckIfZero = pop();
          if (DEBUG) {
            console.log("cubic: C as absval and float: " + R_C_simplified_toCheckIfZero.toString());
          }
          if (isZeroAtomOrTensor(R_C_simplified_toCheckIfZero)) {
            if (DEBUG) {
              console.log(" cubic: C IS ZERO flipping the sign");
            }
            flipSignOFQSoCIsNotZero = true;
          } else {
            C_CHECKED_AS_NOT_ZERO = true;
          }
        }
        push(R_C);
        push(R_3_a);
        multiply();
        R_3_a_C = pop();
        push(R_3_a_C);
        push_integer(2);
        multiply();
        R_6_a_C = pop();
        push(imaginaryunit);
        push_integer(3);
        push_rational(1, 2);
        power();
        multiply();
        i_sqrt3 = pop();
        push_integer(1);
        push(i_sqrt3);
        add();
        one_plus_i_sqrt3 = pop();
        push_integer(1);
        push(i_sqrt3);
        subtract();
        one_minus_i_sqrt3 = pop();
        push(R_C);
        push(R_3_a);
        divide();
        R_C_over_3a = pop();
        push(R_m_b_over_3a);
        push(R_C_over_3a);
        negate();
        push(R_DELTA0);
        push(R_3_a_C);
        divide();
        negate();
        add();
        add();
        simplify();
        push(R_m_b_over_3a);
        push(R_C_over_3a);
        push(one_plus_i_sqrt3);
        multiply();
        push_integer(2);
        divide();
        push(one_minus_i_sqrt3);
        push(R_DELTA0);
        multiply();
        push(R_6_a_C);
        divide();
        add();
        add();
        simplify();
        push(R_m_b_over_3a);
        push(R_C_over_3a);
        push(one_minus_i_sqrt3);
        multiply();
        push_integer(2);
        divide();
        push(one_plus_i_sqrt3);
        push(R_DELTA0);
        multiply();
        push(R_6_a_C);
        divide();
        add();
        add();
        simplify();
        restore();
        return;
      }
      if (n === 5) {
        if (DEBUG) {
          console.log(">>>>>>>>>>>>>>>> actually using quartic formula <<<<<<<<<<<<<<< ");
        }
        p7 = pop();
        if (isZeroAtomOrTensor(p4) && isZeroAtomOrTensor(p6) && !isZeroAtomOrTensor(p5) && !isZeroAtomOrTensor(p7)) {
          if (DEBUG) {
            console.log("biquadratic case");
          }
          push(p3);
          push(symbol(SECRETX));
          push_integer(2);
          power();
          multiply();
          push(p5);
          push(symbol(SECRETX));
          multiply();
          push(p7);
          add();
          add();
          push(symbol(SECRETX));
          roots();
          biquadraticSolutions = pop();
          ref2 = biquadraticSolutions.tensor.elem;
          for (l1 = 0, len = ref2.length; l1 < len; l1++) {
            eachSolution = ref2[l1];
            push(eachSolution);
            push_rational(1, 2);
            power();
            simplify();
            push(eachSolution);
            push_rational(1, 2);
            power();
            negate();
            simplify();
          }
          restore();
          return;
        }
        push(p6);
        push(p6);
        multiply();
        R_d2 = pop();
        push(p7);
        push(p7);
        multiply();
        R_e2 = pop();
        push(R_e2);
        push(p7);
        multiply();
        R_e3 = pop();
        push_integer(256);
        push(R_a3);
        push(R_e3);
        multiply();
        multiply();
        push_integer(-192);
        push(R_a2_d);
        push(R_e2);
        push(p4);
        multiply();
        multiply();
        multiply();
        push_integer(-128);
        push(R_a2);
        push(R_c2);
        push(R_e2);
        multiply();
        multiply();
        multiply();
        push_integer(144);
        push(R_a2_d2);
        push(p5);
        push(p7);
        multiply();
        multiply();
        multiply();
        push(R_m27_a2_d2);
        push(R_d2);
        multiply();
        push_integer(144);
        push(R_a_b_c);
        push(p4);
        push(R_e2);
        multiply();
        multiply();
        multiply();
        push_integer(-6);
        push(p3);
        push(R_b2);
        push(R_d2);
        push(p7);
        multiply();
        multiply();
        multiply();
        multiply();
        push_integer(-80);
        push(R_a_b_c_d);
        push(p5);
        push(p7);
        multiply();
        multiply();
        multiply();
        push_integer(18);
        push(R_a_b_c_d);
        push(R_d2);
        multiply();
        multiply();
        push_integer(16);
        push(R_a_c);
        push(R_c3);
        push(p7);
        multiply();
        multiply();
        multiply();
        push_integer(-4);
        push(R_a_c);
        push(R_c2);
        push(R_d2);
        multiply();
        multiply();
        multiply();
        push_integer(-27);
        push(R_b3);
        push(p4);
        push(R_e2);
        multiply();
        multiply();
        multiply();
        push_integer(18);
        push(R_b3_d);
        push(p5);
        push(p7);
        multiply();
        multiply();
        multiply();
        push(R_m4_b3_d);
        push(R_d2);
        multiply();
        push_integer(-4);
        push(R_b2_c2);
        push(p5);
        push(p7);
        multiply();
        multiply();
        multiply();
        push(R_b2_c2);
        push(R_d2);
        multiply();
        add();
        add();
        add();
        add();
        add();
        add();
        add();
        add();
        add();
        add();
        add();
        add();
        add();
        add();
        add();
        R_determinant = pop();
        if (DEBUG) {
          console.log("R_determinant: " + R_determinant.toString());
        }
        push(R_c2);
        push_integer(-3);
        push(p4);
        push(p6);
        multiply();
        multiply();
        push_integer(12);
        push(p3);
        push(p7);
        multiply();
        multiply();
        add();
        add();
        R_DELTA0 = pop();
        if (DEBUG) {
          console.log("R_DELTA0: " + R_DELTA0.toString());
        }
        push_integer(2);
        push(R_c3);
        multiply();
        push_integer(-9);
        push(p4);
        push(p5);
        push(p6);
        multiply();
        multiply();
        multiply();
        push_integer(27);
        push(R_b2);
        push(p7);
        multiply();
        multiply();
        push_integer(27);
        push(p3);
        push(R_d2);
        multiply();
        multiply();
        push_integer(-72);
        push(R_a_c);
        push(p7);
        multiply();
        multiply();
        add();
        add();
        add();
        add();
        R_DELTA1 = pop();
        if (DEBUG) {
          console.log("R_DELTA1: " + R_DELTA1.toString());
        }
        push_integer(8);
        push(R_a_c);
        multiply();
        push_integer(-3);
        push(R_b2);
        multiply();
        add();
        push_integer(8);
        push(R_a2);
        multiply();
        divide();
        R_p = pop();
        if (DEBUG) {
          console.log("p: " + R_p.toString());
        }
        push(R_b3);
        push_integer(-4);
        push(R_a_b_c);
        multiply();
        push_integer(8);
        push(R_a2_d);
        multiply();
        add();
        add();
        push_integer(8);
        push(R_a3);
        multiply();
        divide();
        R_q = pop();
        if (DEBUG) {
          console.log("q: " + R_q.toString());
        }
        if (DEBUG) {
          console.log("tos 1 " + tos);
        }
        if (!isZeroAtomOrTensor(p4)) {
          if (DEBUG) {
            console.log("tos 2 " + tos);
          }
          push_integer(8);
          push(p5);
          push(p3);
          multiply();
          multiply();
          push_integer(-3);
          push(p4);
          push_integer(2);
          power();
          multiply();
          add();
          push_integer(8);
          push(p3);
          push_integer(2);
          power();
          multiply();
          divide();
          R_p = pop();
          if (DEBUG) {
            console.log("p for depressed quartic: " + R_p.toString());
          }
          push(p4);
          push_integer(3);
          power();
          push_integer(-4);
          push(p3);
          push(p4);
          push(p5);
          multiply();
          multiply();
          multiply();
          push_integer(8);
          push(p6);
          push(p3);
          push_integer(2);
          power();
          multiply();
          multiply();
          add();
          add();
          push_integer(8);
          push(p3);
          push_integer(3);
          power();
          multiply();
          divide();
          R_q = pop();
          if (DEBUG) {
            console.log("q for depressed quartic: " + R_q.toString());
          }
          push(p4);
          push_integer(4);
          power();
          push_integer(-3);
          multiply();
          push_integer(256);
          push(R_a3);
          push(p7);
          multiply();
          multiply();
          push_integer(-64);
          push(R_a2_d);
          push(p4);
          multiply();
          multiply();
          push_integer(16);
          push(R_b2);
          push(p3);
          push(p5);
          multiply();
          multiply();
          multiply();
          add();
          add();
          add();
          push_integer(256);
          push(p3);
          push_integer(4);
          power();
          multiply();
          divide();
          R_r = pop();
          if (DEBUG) {
            console.log("r for depressed quartic: " + R_r.toString());
          }
          if (DEBUG) {
            console.log("tos 4 " + tos);
          }
          push(symbol(SECRETX));
          push_integer(4);
          power();
          if (DEBUG) {
            console.log("4 * x^4: " + stack[tos - 1].toString());
          }
          push(R_p);
          push(symbol(SECRETX));
          push_integer(2);
          power();
          multiply();
          if (DEBUG) {
            console.log("R_p * x^2: " + stack[tos - 1].toString());
          }
          push(R_q);
          push(symbol(SECRETX));
          multiply();
          if (DEBUG) {
            console.log("R_q * x: " + stack[tos - 1].toString());
          }
          push(R_r);
          if (DEBUG) {
            console.log("R_r: " + stack[tos - 1].toString());
          }
          add();
          add();
          add();
          simplify();
          if (DEBUG) {
            console.log("solving depressed quartic: " + stack[tos - 1].toString());
          }
          push(symbol(SECRETX));
          roots();
          depressedSolutions = pop();
          if (DEBUG) {
            console.log("depressedSolutions: " + depressedSolutions);
          }
          ref3 = depressedSolutions.tensor.elem;
          for (m1 = 0, len1 = ref3.length; m1 < len1; m1++) {
            eachSolution = ref3[m1];
            push(eachSolution);
            push(p4);
            push_integer(4);
            push(p3);
            multiply();
            divide();
            subtract();
            simplify();
            if (DEBUG) {
              console.log("solution from depressed: " + stack[tos - 1].toString());
            }
          }
          restore();
          return;
        } else {
          R_p = p5;
          R_q = p6;
          R_r = p7;

          /*
           * Descartes' solution
           * https://en.wikipedia.org/wiki/Quartic_function#Descartes.27_solution
           * finding the "u" in the depressed equation
          
          push_integer(2)
          push(R_p)
          multiply()
          coeff2 = pop()
          
          push_integer(-4)
          push(R_p)
          push_integer(2)
          power()
          multiply()
          push(R_r)
          multiply()
          coeff3 = pop()
          
          push(R_q)
          push_integer(2)
          power()
          negate()
          coeff4 = pop()
          
           * now build the polynomial
          push(symbol(SECRETX))
          push_integer(3)
          power()
          
          push(coeff2)
          push(symbol(SECRETX))
          push_integer(2)
          power()
          multiply()
          
          push(coeff3)
          push(symbol(SECRETX))
          multiply()
          
          push(coeff4)
          
          add()
          add()
          add()
          
          console.log("Descarte's resolventCubic: " +  stack[tos-1].toString())
          push(symbol(SECRETX))
          
          roots()
          
          resolventCubicSolutions = pop()
          console.log("Descarte's resolventCubic solutions: " +  resolventCubicSolutions)
          console.log("tos: " +  tos)
          
          R_u = null
          #R_u = resolventCubicSolutions.tensor.elem[1]
          for eachSolution in resolventCubicSolutions.tensor.elem
            console.log("examining solution: " +  eachSolution)
            push(eachSolution)
            push_integer(2)
            multiply()
            push(R_p)
            add()
          
            absValFloat()
            toBeCheckedIFZero = pop()
            console.log("abs value is: " +  eachSolution)
            if !isZeroAtomOrTensor(toBeCheckedIFZero)
              R_u = eachSolution
              break
          
          console.log("chosen solution: " +  R_u)
          
          push(R_u)
          negate()
          R_s = pop()
          
          push(R_p)
          push(R_u)
          push_integer(2)
          power()
          push(R_q)
          push(R_u)
          divide()
          add()
          add()
          push_integer(2)
          divide()
          R_t = pop()
          
          push(R_p)
          push(R_u)
          push_integer(2)
          power()
          push(R_q)
          push(R_u)
          divide()
          subtract()
          add()
          push_integer(2)
          divide()
          R_v = pop()
          
           * factoring the quartic into two quadratics:
          
           * now build the polynomial
          push(symbol(SECRETX))
          push_integer(2)
          power()
          
          push(R_s)
          push(symbol(SECRETX))
          multiply()
          
          push(R_t)
          
          add()
          add()
          
          console.log("factored quartic 1: " + stack[tos-1].toString())
          
          push(symbol(SECRETX))
          push_integer(2)
          power()
          
          push(R_u)
          push(symbol(SECRETX))
          multiply()
          
          push(R_v)
          
          add()
          add()
          
          console.log("factored quartic 2: " + stack[tos-1].toString())
          pop()
          
          restore()
          return
           */
          push_rational(5, 2);
          push(R_p);
          multiply();
          coeff2 = pop();
          push_integer(2);
          push(R_p);
          push_integer(2);
          power();
          multiply();
          push(R_r);
          subtract();
          coeff3 = pop();
          push(R_p);
          push_integer(3);
          power();
          push_integer(2);
          divide();
          push_rational(-1, 2);
          push(R_p);
          push(R_r);
          multiply();
          multiply();
          push_rational(-1, 8);
          push(R_q);
          push_integer(2);
          power();
          multiply();
          add();
          add();
          coeff4 = pop();
          push(symbol(SECRETX));
          push_integer(3);
          power();
          push(coeff2);
          push(symbol(SECRETX));
          push_integer(2);
          power();
          multiply();
          push(coeff3);
          push(symbol(SECRETX));
          multiply();
          push(coeff4);
          add();
          add();
          add();
          if (DEBUG) {
            console.log("resolventCubic: " + stack[tos - 1].toString());
          }
          push(symbol(SECRETX));
          roots();
          resolventCubicSolutions = pop();
          if (DEBUG) {
            console.log("resolventCubicSolutions: " + resolventCubicSolutions);
          }
          R_m = null;
          ref4 = resolventCubicSolutions.tensor.elem;
          for (n1 = 0, len2 = ref4.length; n1 < len2; n1++) {
            eachSolution = ref4[n1];
            if (DEBUG) {
              console.log("examining solution: " + eachSolution);
            }
            push(eachSolution);
            push_integer(2);
            multiply();
            push(R_p);
            add();
            absValFloat();
            toBeCheckedIFZero = pop();
            if (DEBUG) {
              console.log("abs value is: " + eachSolution);
            }
            if (!isZeroAtomOrTensor(toBeCheckedIFZero)) {
              R_m = eachSolution;
              break;
            }
          }
          if (DEBUG) {
            console.log("chosen solution: " + R_m);
          }
          push(R_m);
          push_integer(2);
          multiply();
          push(R_p);
          add();
          push_rational(1, 2);
          power();
          simplify();
          sqrtPPlus2M = pop();
          push(R_q);
          push_integer(2);
          multiply();
          push(sqrtPPlus2M);
          divide();
          simplify();
          TwoQOversqrtPPlus2M = pop();
          push(R_p);
          push_integer(3);
          multiply();
          push(R_m);
          push_integer(2);
          multiply();
          add();
          ThreePPlus2M = pop();
          push(sqrtPPlus2M);
          push(ThreePPlus2M);
          push(TwoQOversqrtPPlus2M);
          add();
          negate();
          push_rational(1, 2);
          power();
          simplify();
          add();
          push_integer(2);
          divide();
          push(sqrtPPlus2M);
          push(ThreePPlus2M);
          push(TwoQOversqrtPPlus2M);
          add();
          negate();
          push_rational(1, 2);
          power();
          simplify();
          subtract();
          push_integer(2);
          divide();
          push(sqrtPPlus2M);
          negate();
          push(ThreePPlus2M);
          push(TwoQOversqrtPPlus2M);
          subtract();
          negate();
          push_rational(1, 2);
          power();
          simplify();
          add();
          push_integer(2);
          divide();
          push(sqrtPPlus2M);
          negate();
          push(ThreePPlus2M);
          push(TwoQOversqrtPPlus2M);
          subtract();
          negate();
          push_rational(1, 2);
          power();
          simplify();
          subtract();
          push_integer(2);
          divide();
          restore();
          return;
        }
        push(R_determinant);
        simplify();
        absValFloat();
        R_determinant_simplified_toCheckIfZero = pop();
        push(R_DELTA0);
        simplify();
        absValFloat();
        R_DELTA0_simplified_toCheckIfZero = pop();
        S_CHECKED_AS_NOT_ZERO = false;
        choiceOfRadicalInQSoSIsNotZero = 0;
        while (!S_CHECKED_AS_NOT_ZERO) {
          Q_CHECKED_AS_NOT_ZERO = false;
          flipSignOFRadicalSoQIsNotZero = false;
          while (!Q_CHECKED_AS_NOT_ZERO) {
            push(R_DELTA1);
            push(R_DELTA1);
            push_integer(2);
            power();
            push_integer(-4);
            push(R_DELTA0);
            push_integer(3);
            power();
            multiply();
            add();
            push_rational(1, 2);
            power();
            if (flipSignOFRadicalSoQIsNotZero) {
              negate();
            }
            add();
            push_integer(2);
            divide();
            if (DEBUG) {
              console.log("content of cubic root: " + stack[tos - 1].toString());
            }
            push_rational(1, 3);
            power();
            simplify();
            R_principalCubicRoot = pop();
            if (DEBUG) {
              console.log("principal cubic root: " + R_principalCubicRoot.toString());
            }
            if (DEBUG) {
              console.log("tos : " + tos);
            }
            if (choiceOfRadicalInQSoSIsNotZero === 0) {
              if (DEBUG) {
                console.log("chosing principal cubic root");
              }
              push(R_principalCubicRoot);
            } else if (choiceOfRadicalInQSoSIsNotZero === 1) {
              if (DEBUG) {
                console.log("chosing cubic root beyond principal");
              }
              push(R_principalCubicRoot);
              push_rational(-1, 2);
              multiply();
              push_integer(3);
              push_rational(1, 2);
              power();
              push(imaginaryunit);
              multiply();
              push_rational(-1, 2);
              multiply();
              push(R_principalCubicRoot);
              multiply();
              add();
            } else if (choiceOfRadicalInQSoSIsNotZero === 1) {
              if (DEBUG) {
                console.log("chosing cubic root beyond beyond principal");
              }
              push(R_principalCubicRoot);
              push_rational(-1, 2);
              multiply();
              push_integer(3);
              push_rational(1, 2);
              power();
              push(imaginaryunit);
              multiply();
              push_rational(1, 2);
              multiply();
              push(R_principalCubicRoot);
              multiply();
              add();
            }
            simplify();
            R_Q = pop();
            if (DEBUG) {
              console.log("Q " + R_Q.toString());
            }
            if (DEBUG) {
              console.log("tos: " + tos);
            }
            push(R_Q);
            simplify();
            absValFloat();
            R_Q_simplified_toCheckIfZero = pop();
            if (DEBUG) {
              console.log("Q simplified and abs" + R_Q_simplified_toCheckIfZero.toString());
            }
            if (isZeroAtomOrTensor(R_Q_simplified_toCheckIfZero) && (!isZeroAtomOrTensor(R_determinant_simplified_toCheckIfZero) && isZeroAtomOrTensor(R_DELTA0_simplified_toCheckIfZero))) {
              if (DEBUG) {
                console.log(" *********************************** Q IS ZERO and it matters, flipping the sign");
              }
              flipSignOFRadicalSoQIsNotZero = true;
            } else {
              Q_CHECKED_AS_NOT_ZERO = true;
            }
            if (DEBUG) {
              console.log("tos: " + tos);
            }
          }
          push_rational(-2, 3);
          push(R_p);
          multiply();
          push(R_Q);
          push(R_DELTA0);
          push(R_Q);
          divide();
          add();
          push(R_3_a);
          divide();
          add();
          push_rational(1, 2);
          power();
          push_integer(2);
          divide();
          show_power_debug = true;
          simplify();
          R_S = pop();
          if (DEBUG) {
            console.log("S " + R_S.toString());
          }
          push(R_S);
          simplify();
          absValFloat();
          R_S_simplified_toCheckIfZero = pop();
          if (DEBUG) {
            console.log("S " + R_S_simplified_toCheckIfZero.toString());
          }
          if (isZeroAtomOrTensor(R_S_simplified_toCheckIfZero)) {
            if (DEBUG) {
              console.log(" *********************************** S IS ZERO chosing another cubic root");
            }
            choiceOfRadicalInQSoSIsNotZero++;
          } else {
            S_CHECKED_AS_NOT_ZERO = true;
          }
          if (DEBUG) {
            console.log("tos: " + tos);
          }
        }
        if (DEBUG) {
          console.log("tos: " + tos);
        }
        push(p4);
        negate();
        push(p3);
        push_integer(4);
        multiply();
        divide();
        R_minus_b_over_4a = pop();
        push_integer(-4);
        push(R_S);
        push_integer(2);
        power();
        multiply();
        push_integer(2);
        push(R_p);
        multiply();
        subtract();
        R_minus_4S2_minus_2p = pop();
        push(R_q);
        push(R_S);
        divide();
        R_q_over_S = pop();
        if (DEBUG) {
          console.log("tos before putting together the 4 solutions: " + tos);
        }
        push(R_minus_b_over_4a);
        push(R_S);
        subtract();
        push(R_minus_4S2_minus_2p);
        push(R_q_over_S);
        add();
        push_rational(1, 2);
        power();
        push_integer(2);
        divide();
        add();
        simplify();
        push(R_minus_b_over_4a);
        push(R_S);
        subtract();
        push(R_minus_4S2_minus_2p);
        push(R_q_over_S);
        add();
        push_rational(1, 2);
        power();
        push_integer(2);
        divide();
        subtract();
        simplify();
        push(R_minus_b_over_4a);
        push(R_S);
        add();
        push(R_minus_4S2_minus_2p);
        push(R_q_over_S);
        subtract();
        push_rational(1, 2);
        power();
        push_integer(2);
        divide();
        add();
        simplify();
        push(R_minus_b_over_4a);
        push(R_S);
        add();
        push(R_minus_4S2_minus_2p);
        push(R_q_over_S);
        subtract();
        push_rational(1, 2);
        power();
        push_integer(2);
        divide();
        subtract();
        simplify();
        restore();
        return;
      }
    }
    moveTos(tos - n);
    return restore();
  };

  Eval_round = function() {
    push(cadr(p1));
    Eval();
    return yround();
  };

  yround = function() {
    save();
    yyround();
    return restore();
  };

  yyround = function() {
    var d;
    d = 0.0;
    p1 = pop();
    if (!isNumericAtom(p1)) {
      push_symbol(ROUND);
      push(p1);
      list(2);
      return;
    }
    if (isdouble(p1)) {
      d = Math.round(p1.d);
      push_double(d);
      return;
    }
    if (isinteger(p1)) {
      push(p1);
      return;
    }
    push(p1);
    yyfloat();
    p1 = pop();
    return push_integer(Math.round(p1.d));
  };

  T_INTEGER = 1001;

  T_DOUBLE = 1002;

  T_SYMBOL = 1003;

  T_FUNCTION = 1004;

  T_NEWLINE = 1006;

  T_STRING = 1007;

  T_GTEQ = 1008;

  T_LTEQ = 1009;

  T_EQ = 1010;

  T_NEQ = 1011;

  T_QUOTASSIGN = 1012;

  token = "";

  newline_flag = 0;

  meta_mode = 0;

  input_str = 0;

  scan_str = 0;

  token_str = 0;

  token_buf = 0;

  lastFoundSymbol = null;

  symbolsRightOfAssignment = null;

  symbolsLeftOfAssignment = null;

  isSymbolLeftOfAssignment = null;

  scanningParameters = null;

  functionInvokationsScanningStack = null;

  skipRootVariableToBeSolved = false;

  assignmentFound = null;

  scanned = "";

  scan = function(s) {
    if (DEBUG) {
      console.log("#### scanning " + s);
    }
    lastFoundSymbol = null;
    symbolsRightOfAssignment = [];
    symbolsLeftOfAssignment = [];
    isSymbolLeftOfAssignment = true;
    scanningParameters = [];
    functionInvokationsScanningStack = [""];
    assignmentFound = false;
    scanned = s;
    meta_mode = 0;
    expanding++;
    input_str = 0;
    scan_str = 0;
    get_next_token();
    if (token === "") {
      push(symbol(NIL));
      expanding--;
      return 0;
    }
    scan_stmt();
    expanding--;
    if (!assignmentFound) {
      symbolsInExpressionsWithoutAssignments = symbolsInExpressionsWithoutAssignments.concat(symbolsLeftOfAssignment);
    }
    return token_str - input_str;
  };

  scan_meta = function(s) {
    scanned = s;
    meta_mode = 1;
    expanding++;
    input_str = 0;
    scan_str = 0;
    get_next_token();
    if (token === "") {
      push(symbol(NIL));
      expanding--;
      return 0;
    }
    scan_stmt();
    expanding--;
    return token_str - input_str;
  };

  scan_stmt = function() {
    var assignmentIsOfQuotedType, existingDependencies, i, indexOfSymbolLeftOfAssignment, l1, len, len1, m1, symbolLeftOfAssignment;
    scan_relation();
    assignmentIsOfQuotedType = false;
    if (token === T_QUOTASSIGN) {
      assignmentIsOfQuotedType = true;
    }
    if (token === T_QUOTASSIGN || token === '=') {
      symbolLeftOfAssignment = lastFoundSymbol;
      if (DEBUG) {
        console.log("assignment!");
      }
      assignmentFound = true;
      isSymbolLeftOfAssignment = false;
      get_next_token();
      push_symbol(SETQ);
      swap();
      if (assignmentIsOfQuotedType) {
        push_symbol(QUOTE);
      }
      scan_relation();
      if (assignmentIsOfQuotedType) {
        list(2);
      }
      list(3);
      isSymbolLeftOfAssignment = true;
      if (codeGen) {
        indexOfSymbolLeftOfAssignment = symbolsRightOfAssignment.indexOf(symbolLeftOfAssignment);
        if (indexOfSymbolLeftOfAssignment !== -1) {
          symbolsRightOfAssignment.splice(indexOfSymbolLeftOfAssignment, 1);
          symbolsHavingReassignments.push(symbolLeftOfAssignment);
        }
        if (DEBUG) {
          console.log("locally, " + symbolLeftOfAssignment + " depends on: ");
          for (l1 = 0, len = symbolsRightOfAssignment.length; l1 < len; l1++) {
            i = symbolsRightOfAssignment[l1];
            console.log("  " + i);
          }
        }
        if (symbolsDependencies[symbolLeftOfAssignment] == null) {
          symbolsDependencies[symbolLeftOfAssignment] = [];
        }
        existingDependencies = symbolsDependencies[symbolLeftOfAssignment];
        for (m1 = 0, len1 = symbolsRightOfAssignment.length; m1 < len1; m1++) {
          i = symbolsRightOfAssignment[m1];
          if (existingDependencies.indexOf(i) === -1) {
            existingDependencies.push(i);
          }
        }
        return symbolsRightOfAssignment = [];
      }
    }
  };

  scan_relation = function() {
    scan_expression();
    switch (token) {
      case T_EQ:
        push_symbol(TESTEQ);
        swap();
        get_next_token();
        scan_expression();
        return list(3);
      case T_NEQ:
        push_symbol(NOT);
        swap();
        push_symbol(TESTEQ);
        swap();
        get_next_token();
        scan_expression();
        list(3);
        return list(2);
      case T_LTEQ:
        push_symbol(TESTLE);
        swap();
        get_next_token();
        scan_expression();
        return list(3);
      case T_GTEQ:
        push_symbol(TESTGE);
        swap();
        get_next_token();
        scan_expression();
        return list(3);
      case '<':
        push_symbol(TESTLT);
        swap();
        get_next_token();
        scan_expression();
        return list(3);
      case '>':
        push_symbol(TESTGT);
        swap();
        get_next_token();
        scan_expression();
        return list(3);
    }
  };

  scan_expression = function() {
    var h;
    h = tos;
    switch (token) {
      case '+':
        get_next_token();
        scan_term();
        break;
      case '-':
        get_next_token();
        scan_term();
        negate();
        break;
      default:
        scan_term();
    }
    while (newline_flag === 0 && (token === '+' || token === '-')) {
      if (token === '+') {
        get_next_token();
        scan_term();
      } else {
        get_next_token();
        scan_term();
        negate();
      }
    }
    if (tos - h > 1) {
      list(tos - h);
      push_symbol(ADD);
      swap();
      return cons();
    }
  };

  is_factor = function() {
    if ((typeof token.charCodeAt === "function" ? token.charCodeAt(0) : void 0) === dotprod_unicode) {
      return 1;
    }
    switch (token) {
      case '*':
      case '/':
        return 1;
      case '(':
      case T_SYMBOL:
      case T_FUNCTION:
      case T_INTEGER:
      case T_DOUBLE:
      case T_STRING:
        if (newline_flag) {
          scan_str = token_str;
          return 0;
        } else {
          return 1;
        }
    }
    return 0;
  };

  simplify_1_in_products = function(tos, h) {
    if (tos > h && isrational(stack[tos - 1]) && equaln(stack[tos - 1], 1)) {
      return pop();
    }
  };

  multiply_consecutive_constants = function(tos, h) {
    if (tos > h + 1 && isNumericAtom(stack[tos - 2]) && isNumericAtom(stack[tos - 1])) {
      return multiply();
    }
  };

  scan_term = function() {
    var h;
    h = tos;
    scan_factor();
    if (parse_time_simplifications) {
      simplify_1_in_products(tos, h);
    }
    while (is_factor()) {
      if (token === '*') {
        get_next_token();
        scan_factor();
      } else if (token === '/') {
        simplify_1_in_products(tos, h);
        get_next_token();
        scan_factor();
        inverse();
      } else if ((typeof token.charCodeAt === "function" ? token.charCodeAt(0) : void 0) === dotprod_unicode) {
        get_next_token();
        push_symbol(INNER);
        swap();
        scan_factor();
        list(3);
      } else {
        scan_factor();
      }
      if (parse_time_simplifications) {
        multiply_consecutive_constants(tos, h);
        simplify_1_in_products(tos, h);
      }
    }
    if (h === tos) {
      return push_integer(1);
    } else if (tos - h > 1) {
      list(tos - h);
      push_symbol(MULTIPLY);
      swap();
      return cons();
    }
  };

  scan_power = function() {
    if (token === '^') {
      get_next_token();
      push_symbol(POWER);
      swap();
      scan_factor();
      return list(3);
    }
  };

  scan_index = function(h) {
    get_next_token();
    push_symbol(INDEX);
    swap();
    scan_expression();
    while (token === ',') {
      get_next_token();
      scan_expression();
    }
    if (token !== ']') {
      scan_error("] expected");
    }
    get_next_token();
    return list(tos - h);
  };

  scan_factor = function() {
    var firstFactorIsNumber, h;
    h = tos;
    firstFactorIsNumber = false;
    if (token === '(') {
      scan_subexpr();
    } else if (token === T_SYMBOL) {
      scan_symbol();
    } else if (token === T_FUNCTION) {
      scan_function_call_with_function_name();
    } else if (token === '[') {
      scan_tensor();
    } else if (token === T_INTEGER) {
      firstFactorIsNumber = true;
      bignum_scan_integer(token_buf);
      get_next_token();
    } else if (token === T_DOUBLE) {
      firstFactorIsNumber = true;
      bignum_scan_float(token_buf);
      get_next_token();
    } else if (token === T_STRING) {
      scan_string();
    } else {
      scan_error("syntax error");
    }
    while (token === '[' || token === '(' && newline_flag === 0 && !firstFactorIsNumber) {
      if (token === '[') {
        scan_index(h);
      } else if (token === '(') {
        scan_function_call_without_function_name();
      }
    }
    while (token === '!') {
      get_next_token();
      push_symbol(FACTORIAL);
      swap();
      list(2);
    }
    while ((typeof token.charCodeAt === "function" ? token.charCodeAt(0) : void 0) === transpose_unicode) {
      get_next_token();
      push_symbol(TRANSPOSE);
      swap();
      list(2);
    }
    return scan_power();
  };

  addSymbolRightOfAssignment = function(theSymbol) {
    var i, l1, prefixVar, ref2;
    if (predefinedSymbolsInGlobalScope_doNotTrackInDependencies.indexOf(theSymbol) === -1 && symbolsRightOfAssignment.indexOf(theSymbol) === -1 && symbolsRightOfAssignment.indexOf("'" + theSymbol) === -1 && !skipRootVariableToBeSolved) {
      if (DEBUG) {
        console.log("... adding symbol: " + theSymbol + " to the set of the symbols right of assignment");
      }
      prefixVar = "";
      for (i = l1 = 1, ref2 = functionInvokationsScanningStack.length; 1 <= ref2 ? l1 < ref2 : l1 > ref2; i = 1 <= ref2 ? ++l1 : --l1) {
        if (functionInvokationsScanningStack[i] !== "") {
          prefixVar += functionInvokationsScanningStack[i] + "_" + i + "_";
        }
      }
      theSymbol = prefixVar + theSymbol;
      return symbolsRightOfAssignment.push(theSymbol);
    }
  };

  addSymbolLeftOfAssignment = function(theSymbol) {
    var i, l1, prefixVar, ref2;
    if (predefinedSymbolsInGlobalScope_doNotTrackInDependencies.indexOf(theSymbol) === -1 && symbolsLeftOfAssignment.indexOf(theSymbol) === -1 && symbolsLeftOfAssignment.indexOf("'" + theSymbol) === -1 && !skipRootVariableToBeSolved) {
      if (DEBUG) {
        console.log("... adding symbol: " + theSymbol + " to the set of the symbols left of assignment");
      }
      prefixVar = "";
      for (i = l1 = 1, ref2 = functionInvokationsScanningStack.length; 1 <= ref2 ? l1 < ref2 : l1 > ref2; i = 1 <= ref2 ? ++l1 : --l1) {
        if (functionInvokationsScanningStack[i] !== "") {
          prefixVar += functionInvokationsScanningStack[i] + "_" + i + "_";
        }
      }
      theSymbol = prefixVar + theSymbol;
      return symbolsLeftOfAssignment.push(theSymbol);
    }
  };

  scan_symbol = function() {
    if (token !== T_SYMBOL) {
      scan_error("symbol expected");
    }
    if (meta_mode && token_buf.length === 1) {
      switch (token_buf[0]) {
        case 'a':
          push(symbol(METAA));
          break;
        case 'b':
          push(symbol(METAB));
          break;
        case 'x':
          push(symbol(METAX));
          break;
        default:
          push(usr_symbol(token_buf));
      }
    } else {
      push(usr_symbol(token_buf));
    }
    if (scanningParameters.length === 0) {
      if (DEBUG) {
        console.log("out of scanning parameters, processing " + token_buf);
      }
      lastFoundSymbol = token_buf;
      if (isSymbolLeftOfAssignment) {
        addSymbolLeftOfAssignment(token_buf);
      }
    } else {
      if (DEBUG) {
        console.log("still scanning parameters, skipping " + token_buf);
      }
      if (isSymbolLeftOfAssignment) {
        addSymbolRightOfAssignment("'" + token_buf);
      }
    }
    if (DEBUG) {
      console.log("found symbol: " + token_buf + " left of assignment: " + isSymbolLeftOfAssignment);
    }
    if (!isSymbolLeftOfAssignment) {
      addSymbolRightOfAssignment(token_buf);
    }
    return get_next_token();
  };

  scan_string = function() {
    new_string(token_buf);
    return get_next_token();
  };

  scan_function_call_with_function_name = function() {
    var functionName, i, l1, n, p, ref2;
    if (DEBUG) {
      console.log("-- scan_function_call_with_function_name start");
    }
    n = 1;
    p = new U();
    p = usr_symbol(token_buf);
    push(p);
    functionName = token_buf;
    if (functionName === "roots" || functionName === "defint" || functionName === "sum" || functionName === "product" || functionName === "for") {
      functionInvokationsScanningStack.push(token_buf);
    }
    lastFoundSymbol = token_buf;
    if (!isSymbolLeftOfAssignment) {
      addSymbolRightOfAssignment(token_buf);
    }
    get_next_token();
    get_next_token();
    scanningParameters.push(true);
    if (token !== ')') {
      scan_stmt();
      n++;
      while (token === ',') {
        get_next_token();
        if (n === 2 && functionInvokationsScanningStack[functionInvokationsScanningStack.length - 1].indexOf("roots") !== -1) {
          symbolsRightOfAssignment = symbolsRightOfAssignment.filter(function(x) {
            return !(new RegExp("roots_" + (functionInvokationsScanningStack.length - 1) + "_" + token_buf)).test(x);
          });
          skipRootVariableToBeSolved = true;
        }
        if (n === 2 && functionInvokationsScanningStack[functionInvokationsScanningStack.length - 1].indexOf("sum") !== -1) {
          symbolsRightOfAssignment = symbolsRightOfAssignment.filter(function(x) {
            return !(new RegExp("sum_" + (functionInvokationsScanningStack.length - 1) + "_" + token_buf)).test(x);
          });
          skipRootVariableToBeSolved = true;
        }
        if (n === 2 && functionInvokationsScanningStack[functionInvokationsScanningStack.length - 1].indexOf("product") !== -1) {
          symbolsRightOfAssignment = symbolsRightOfAssignment.filter(function(x) {
            return !(new RegExp("product_" + (functionInvokationsScanningStack.length - 1) + "_" + token_buf)).test(x);
          });
          skipRootVariableToBeSolved = true;
        }
        if (n === 2 && functionInvokationsScanningStack[functionInvokationsScanningStack.length - 1].indexOf("for") !== -1) {
          symbolsRightOfAssignment = symbolsRightOfAssignment.filter(function(x) {
            return !(new RegExp("for_" + (functionInvokationsScanningStack.length - 1) + "_" + token_buf)).test(x);
          });
          skipRootVariableToBeSolved = true;
        }
        if (functionInvokationsScanningStack[functionInvokationsScanningStack.length - 1].indexOf("defint") !== -1 && (n === 2 || (n > 2 && ((n - 2) % 3 === 0)))) {
          symbolsRightOfAssignment = symbolsRightOfAssignment.filter(function(x) {
            return !(new RegExp("defint_" + (functionInvokationsScanningStack.length - 1) + "_" + token_buf)).test(x);
          });
          skipRootVariableToBeSolved = true;
        }
        scan_stmt();
        skipRootVariableToBeSolved = false;
        n++;
      }
      if (n === 2 && functionInvokationsScanningStack[functionInvokationsScanningStack.length - 1].indexOf("roots") !== -1) {
        symbolsRightOfAssignment = symbolsRightOfAssignment.filter(function(x) {
          return !(new RegExp("roots_" + (functionInvokationsScanningStack.length - 1) + "_" + "x")).test(x);
        });
      }
    }
    scanningParameters.pop();
    for (i = l1 = 0, ref2 = symbolsRightOfAssignment.length; 0 <= ref2 ? l1 <= ref2 : l1 >= ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      if (symbolsRightOfAssignment[i] != null) {
        if (functionName === "roots") {
          symbolsRightOfAssignment[i] = symbolsRightOfAssignment[i].replace(new RegExp("roots_" + (functionInvokationsScanningStack.length - 1) + "_"), "");
        }
        if (functionName === "defint") {
          symbolsRightOfAssignment[i] = symbolsRightOfAssignment[i].replace(new RegExp("defint_" + (functionInvokationsScanningStack.length - 1) + "_"), "");
        }
        if (functionName === "sum") {
          symbolsRightOfAssignment[i] = symbolsRightOfAssignment[i].replace(new RegExp("sum_" + (functionInvokationsScanningStack.length - 1) + "_"), "");
        }
        if (functionName === "product") {
          symbolsRightOfAssignment[i] = symbolsRightOfAssignment[i].replace(new RegExp("product_" + (functionInvokationsScanningStack.length - 1) + "_"), "");
        }
        if (functionName === "for") {
          symbolsRightOfAssignment[i] = symbolsRightOfAssignment[i].replace(new RegExp("for_" + (functionInvokationsScanningStack.length - 1) + "_"), "");
        }
      }
    }
    if (token !== ')') {
      scan_error(") expected");
    }
    get_next_token();
    list(n);
    if (functionName === "roots" || functionName === "defint" || functionName === "sum" || functionName === "product" || functionName === "for") {
      functionInvokationsScanningStack.pop();
    }
    if (functionName === symbol(PATTERN).printname) {
      patternHasBeenFound = true;
    }
    if (DEBUG) {
      return console.log("-- scan_function_call_with_function_name end");
    }
  };

  scan_function_call_without_function_name = function() {
    var n;
    if (DEBUG) {
      console.log("-- scan_function_call_without_function_name start");
    }
    push_symbol(EVAL);
    swap();
    list(2);
    n = 1;
    get_next_token();
    scanningParameters.push(true);
    if (token !== ')') {
      scan_stmt();
      n++;
      while (token === ',') {
        get_next_token();
        scan_stmt();
        n++;
      }
    }
    scanningParameters.pop();
    if (token !== ')') {
      scan_error(") expected");
    }
    get_next_token();
    list(n);
    if (DEBUG) {
      return console.log("-- scan_function_call_without_function_name end: " + stack[tos - 1]);
    }
  };

  scan_subexpr = function() {
    var n;
    n = 0;
    if (token !== '(') {
      scan_error("( expected");
    }
    get_next_token();
    scan_stmt();
    if (token !== ')') {
      scan_error(") expected");
    }
    return get_next_token();
  };

  scan_tensor = function() {
    var n;
    n = 0;
    if (token !== '[') {
      scan_error("[ expected");
    }
    get_next_token();
    scan_stmt();
    n = 1;
    while (token === ',') {
      get_next_token();
      scan_stmt();
      n++;
    }
    build_tensor(n);
    if (token !== ']') {
      scan_error("] expected");
    }
    return get_next_token();
  };

  scan_error = function(errmsg) {
    errorMessage = "";
    while (input_str !== scan_str) {
      if ((scanned[input_str] === '\n' || scanned[input_str] === '\r') && input_str + 1 === scan_str) {
        break;
      }
      errorMessage += scanned[input_str++];
    }
    errorMessage += " ? ";
    while (scanned[input_str] && (scanned[input_str] !== '\n' && scanned[input_str] !== '\r')) {
      errorMessage += scanned[input_str++];
    }
    errorMessage += '\n';
    return stop(errmsg);
  };

  build_tensor = function(n) {
    var i, l1, ref2;
    i = 0;
    save();
    p2 = alloc_tensor(n);
    p2.tensor.ndim = 1;
    p2.tensor.dim[0] = n;
    for (i = l1 = 0, ref2 = n; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      p2.tensor.elem[i] = stack[tos - n + i];
    }
    check_tensor_dimensions(p2);
    moveTos(tos - n);
    push(p2);
    return restore();
  };

  get_next_token = function() {
    newline_flag = 0;
    while (1) {
      get_token();
      if (token !== T_NEWLINE) {
        break;
      }
      newline_flag = 1;
    }
    if (DEBUG) {
      return console.log("get_next_token token: " + token);
    }
  };

  get_token = function() {
    while (isspace(scanned[scan_str])) {
      if (scanned[scan_str] === '\n' || scanned[scan_str] === '\r') {
        token = T_NEWLINE;
        scan_str++;
        return;
      }
      scan_str++;
    }
    token_str = scan_str;
    if (scan_str === scanned.length) {
      token = "";
      return;
    }
    if (isdigit(scanned[scan_str]) || scanned[scan_str] === '.') {
      while (isdigit(scanned[scan_str])) {
        scan_str++;
      }
      if (scanned[scan_str] === '.') {
        scan_str++;
        while (isdigit(scanned[scan_str])) {
          scan_str++;
        }
        if (scanned[scan_str] === 'e' && (scanned[scan_str + 1] === '+' || scanned[scan_str + 1] === '-' || isdigit(scanned[scan_str + 1]))) {
          scan_str += 2;
          while (isdigit(scanned[scan_str])) {
            scan_str++;
          }
        }
        token = T_DOUBLE;
      } else {
        token = T_INTEGER;
      }
      update_token_buf(token_str, scan_str);
      return;
    }
    if (isalpha(scanned[scan_str])) {
      while (isalnumorunderscore(scanned[scan_str])) {
        scan_str++;
      }
      if (scanned[scan_str] === '(') {
        token = T_FUNCTION;
      } else {
        token = T_SYMBOL;
      }
      update_token_buf(token_str, scan_str);
      return;
    }
    if (scanned[scan_str] === '"') {
      scan_str++;
      while (scanned[scan_str] !== '"') {
        if (scan_str === scanned.length - 1) {
          scan_str++;
          scan_error("runaway string");
          scan_str--;
        }
        scan_str++;
      }
      scan_str++;
      token = T_STRING;
      update_token_buf(token_str + 1, scan_str - 1);
      return;
    }
    if (scanned[scan_str] === '#' || scanned[scan_str] === '-' && scanned[scan_str + 1] === '-') {
      while (scanned[scan_str] && scanned[scan_str] !== '\n' && scanned[scan_str] !== '\r') {
        scan_str++;
      }
      if (scanned[scan_str]) {
        scan_str++;
      }
      token = T_NEWLINE;
      return;
    }
    if (scanned[scan_str] === ':' && scanned[scan_str + 1] === '=') {
      scan_str += 2;
      token = T_QUOTASSIGN;
      return;
    }
    if (scanned[scan_str] === '=' && scanned[scan_str + 1] === '=') {
      scan_str += 2;
      token = T_EQ;
      return;
    }
    if (scanned[scan_str] === '!' && scanned[scan_str + 1] === '=') {
      scan_str += 2;
      token = T_NEQ;
      return;
    }
    if (scanned[scan_str] === '<' && scanned[scan_str + 1] === '=') {
      scan_str += 2;
      token = T_LTEQ;
      return;
    }
    if (scanned[scan_str] === '>' && scanned[scan_str + 1] === '=') {
      scan_str += 2;
      token = T_GTEQ;
      return;
    }
    return token = scanned[scan_str++];
  };

  update_token_buf = function(a, b) {
    return token_buf = scanned.substring(a, b);
  };

  $.scan = scan;

  Eval_sgn = function() {
    push(cadr(p1));
    Eval();
    return sgn();
  };

  sgn = function() {
    save();
    yysgn();
    return restore();
  };

  yysgn = function() {
    p1 = pop();
    if (isdouble(p1)) {
      if (p1.d > 0) {
        push_integer(1);
        return;
      } else {
        if (p1.d === 0) {
          push_integer(1);
          return;
        } else {
          push_integer(-1);
          return;
        }
      }
    }
    if (isrational(p1)) {
      if (MSIGN(mmul(p1.q.a, p1.q.b)) === -1) {
        push_integer(-1);
        return;
      } else {
        if (MZERO(mmul(p1.q.a, p1.q.b))) {
          push_integer(0);
          return;
        } else {
          push_integer(1);
          return;
        }
      }
    }
    if (iscomplexnumber(p1)) {
      push_integer(-1);
      push(p1);
      absval();
      power();
      push(p1);
      multiply();
      return;
    }
    if (isnegativeterm(p1)) {
      push_symbol(SGN);
      push(p1);
      negate();
      list(2);
      push_integer(-1);
      multiply();
      return;
    }

    /*
    push_integer(2)
    push(p1)
    heaviside()
    multiply()
    push_integer(-1)
    add()
     */
    push_symbol(SGN);
    push(p1);
    return list(2);
  };

  Eval_shape = function() {
    push(cadr(p1));
    Eval();
    return shape();
  };

  shape = function() {
    var ai, an, i, l1, m1, ndim, ref2, ref3, t;
    i = 0;
    ndim = 0;
    t = 0;
    ai = [];
    an = [];
    for (i = l1 = 0, ref2 = MAXDIM; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      ai[i] = 0;
      an[i] = 0;
    }
    save();
    p1 = pop();
    if (!istensor(p1)) {
      if (!isZeroAtomOrTensor(p1)) {
        stop("transpose: tensor expected, 1st arg is not a tensor");
      }
      push(zero);
      restore();
      return;
    }
    ndim = p1.tensor.ndim;
    p2 = alloc_tensor(ndim);
    p2.tensor.ndim = 1;
    p2.tensor.dim[0] = ndim;
    for (i = m1 = 0, ref3 = ndim; 0 <= ref3 ? m1 < ref3 : m1 > ref3; i = 0 <= ref3 ? ++m1 : --m1) {
      push_integer(p1.tensor.dim[i]);
      p2.tensor.elem[i] = pop();
    }
    push(p2);
    return restore();
  };


  /*
   Simplify factorials
  
  The following script
  
    F(n,k) = k binomial(n,k)
    (F(n,k) + F(n,k-1)) / F(n+1,k)
  
  generates
  
         k! n!             n! (1 - k + n)!              k! n!
   -------------------- + -------------------- - ----------------------
   (-1 + k)! (1 + n)!     (1 + n)! (-k + n)!     k (-1 + k)! (1 + n)!
  
  Simplify each term to get
  
      k       1 - k + n       1
   ------- + ----------- - -------
    1 + n       1 + n       1 + n
  
  Then simplify the sum to get
  
      n
   -------
    1 + n
   */

  Eval_simfac = function() {
    push(cadr(p1));
    Eval();
    return simfac();
  };

  simfac = function() {
    var h;
    h = 0;
    save();
    p1 = pop();
    if (car(p1) === symbol(ADD)) {
      h = tos;
      p1 = cdr(p1);
      while (p1 !== symbol(NIL)) {
        push(car(p1));
        simfac_term();
        p1 = cdr(p1);
      }
      add_all(tos - h);
    } else {
      push(p1);
      simfac_term();
    }
    return restore();
  };


  /*
  void
  simfac(void)
  {
    int h
    save()
    p1 = pop()
    if (car(p1) == symbol(ADD)) {
      h = tos
      p1 = cdr(p1)
      while (p1 != symbol(NIL)) {
        push(car(p1))
        simfac_term()
        p1 = cdr(p1)
      }
      addk(tos - h)
      p1 = pop()
      if (find(p1, symbol(FACTORIAL))) {
        push(p1)
        if (car(p1) == symbol(ADD)) {
          Condense()
          simfac_term()
        }
      }
    } else {
      push(p1)
      simfac_term()
    }
    restore()
  }
  
  #endif
   */

  simfac_term = function() {
    var doNothing, h;
    h = 0;
    save();
    p1 = pop();
    if (car(p1) !== symbol(MULTIPLY)) {
      push(p1);
      restore();
      return;
    }
    h = tos;
    p1 = cdr(p1);
    while (p1 !== symbol(NIL)) {
      push(car(p1));
      p1 = cdr(p1);
    }
    while (yysimfac(h)) {
      doNothing = 1;
    }
    multiply_all_noexpand(tos - h);
    return restore();
  };

  yysimfac = function(h) {
    var i, j, l1, m1, ref2, ref3, ref4, ref5;
    i = 0;
    j = 0;
    for (i = l1 = ref2 = h, ref3 = tos; ref2 <= ref3 ? l1 < ref3 : l1 > ref3; i = ref2 <= ref3 ? ++l1 : --l1) {
      p1 = stack[i];
      for (j = m1 = ref4 = h, ref5 = tos; ref4 <= ref5 ? m1 < ref5 : m1 > ref5; j = ref4 <= ref5 ? ++m1 : --m1) {
        if (i === j) {
          continue;
        }
        p2 = stack[j];
        if (car(p1) === symbol(FACTORIAL) && car(p2) === symbol(POWER) && isminusone(caddr(p2)) && equal(cadr(p1), cadr(p2))) {
          push(cadr(p1));
          push(one);
          subtract();
          factorial();
          stack[i] = pop();
          stack[j] = one;
          return 1;
        }
        if (car(p2) === symbol(POWER) && isminusone(caddr(p2)) && caadr(p2) === symbol(FACTORIAL) && equal(p1, cadadr(p2))) {
          push(p1);
          push_integer(-1);
          add();
          factorial();
          reciprocate();
          stack[i] = pop();
          stack[j] = one;
          return 1;
        }
        if (car(p2) === symbol(FACTORIAL)) {
          push(p1);
          push(cadr(p2));
          subtract();
          p3 = pop();
          if (isplusone(p3)) {
            push(p1);
            factorial();
            stack[i] = pop();
            stack[j] = one;
            return 1;
          }
        }
        if (car(p1) === symbol(POWER) && isminusone(caddr(p1)) && car(p2) === symbol(POWER) && isminusone(caddr(p2)) && caadr(p2) === symbol(FACTORIAL)) {
          push(cadr(p1));
          push(cadr(cadr(p2)));
          subtract();
          p3 = pop();
          if (isplusone(p3)) {
            push(cadr(p1));
            factorial();
            reciprocate();
            stack[i] = pop();
            stack[j] = one;
            return 1;
          }
        }
        if (car(p1) === symbol(FACTORIAL) && car(p2) === symbol(POWER) && isminusone(caddr(p2)) && caadr(p2) === symbol(FACTORIAL)) {
          push(cadr(p1));
          push(cadr(cadr(p2)));
          subtract();
          p3 = pop();
          if (isplusone(p3)) {
            stack[i] = cadr(p1);
            stack[j] = one;
            return 1;
          }
          if (isminusone(p3)) {
            push(cadr(cadr(p2)));
            reciprocate();
            stack[i] = pop();
            stack[j] = one;
            return 1;
          }
          if (equaln(p3, 2)) {
            stack[i] = cadr(p1);
            push(cadr(p1));
            push_integer(-1);
            add();
            stack[j] = pop();
            return 1;
          }
          if (equaln(p3, -2)) {
            push(cadr(cadr(p2)));
            reciprocate();
            stack[i] = pop();
            push(cadr(cadr(p2)));
            push_integer(-1);
            add();
            reciprocate();
            stack[j] = pop();
            return 1;
          }
        }
      }
    }
    return 0;
  };

  Eval_simplify = function() {
    push(cadr(p1));
    runUserDefinedSimplifications();
    Eval();
    return simplify();
  };

  runUserDefinedSimplifications = function() {
    var atLeastOneSuccessInRouldOfRulesApplications, eachConsecutiveRuleApplication, eachSimplification, l1, len, len1, m1, numberOfRulesApplications, originalexpanding, success;
    if (userSimplificationsInListForm.length !== 0 && !Find(cadr(p1), symbol(INTEGRAL))) {
      originalexpanding = expanding;
      expanding = false;
      if (DEBUG) {
        console.log("runUserDefinedSimplifications passed: " + stack[tos - 1].toString());
      }
      Eval();
      if (DEBUG) {
        console.log("runUserDefinedSimplifications after eval no expanding: " + stack[tos - 1].toString());
      }
      expanding = originalexpanding;
      p1 = stack[tos - 1];
      if (DEBUG) {
        console.log("patterns to be checked: ");
      }
      for (l1 = 0, len = userSimplificationsInListForm.length; l1 < len; l1++) {
        eachSimplification = userSimplificationsInListForm[l1];
        if (DEBUG) {
          console.log("..." + eachSimplification);
        }
      }
      atLeastOneSuccessInRouldOfRulesApplications = true;
      numberOfRulesApplications = 0;
      while (atLeastOneSuccessInRouldOfRulesApplications && numberOfRulesApplications < MAX_CONSECUTIVE_APPLICATIONS_OF_ALL_RULES) {
        atLeastOneSuccessInRouldOfRulesApplications = false;
        numberOfRulesApplications++;
        for (m1 = 0, len1 = userSimplificationsInListForm.length; m1 < len1; m1++) {
          eachSimplification = userSimplificationsInListForm[m1];
          success = true;
          eachConsecutiveRuleApplication = 0;
          while (success && eachConsecutiveRuleApplication < MAX_CONSECUTIVE_APPLICATIONS_OF_SINGLE_RULE) {
            eachConsecutiveRuleApplication++;
            if (DEBUG) {
              console.log("simplify - tos: " + tos + " checking pattern: " + eachSimplification + " on: " + p1);
            }
            push_symbol(NIL);
            success = transform(eachSimplification, true);
            if (success) {
              atLeastOneSuccessInRouldOfRulesApplications = true;
            }
            p1 = stack[tos - 1];
            if (DEBUG) {
              console.log("p1 at this stage of simplification: " + p1);
            }
          }
          if (eachConsecutiveRuleApplication === MAX_CONSECUTIVE_APPLICATIONS_OF_SINGLE_RULE) {
            stop("maximum application of single transformation rule exceeded: " + eachSimplification);
          }
        }
      }
      if (numberOfRulesApplications === MAX_CONSECUTIVE_APPLICATIONS_OF_ALL_RULES) {
        stop("maximum application of all transformation rules exceeded ");
      }
      if (DEBUG) {
        console.log("METAX = " + get_binding(symbol(METAX)));
        console.log("METAA = " + get_binding(symbol(METAA)));
        return console.log("METAB = " + get_binding(symbol(METAB)));
      }
    }
  };

  simplifyForCodeGeneration = function() {
    save();
    runUserDefinedSimplifications();
    codeGen = true;
    simplify_main();
    codeGen = false;
    return restore();
  };

  simplify = function() {
    save();
    simplify_main();
    return restore();
  };

  simplify_main = function() {
    var args, fbody;
    p1 = pop();
    if (codeGen && car(p1) === symbol(FUNCTION)) {
      fbody = cadr(p1);
      push(fbody);
      eval();
      simplify();
      p3 = pop();
      args = caddr(p1);
      push_symbol(FUNCTION);
      push(p3);
      push(args);
      list(3);
      p1 = pop();
    }
    if (istensor(p1)) {
      simplify_tensor();
      return;
    }
    if (Find(p1, symbol(FACTORIAL))) {
      push(p1);
      simfac();
      p2 = pop();
      push(p1);
      rationalize();
      simfac();
      p3 = pop();
      if (count(p2) < count(p3)) {
        p1 = p2;
      } else {
        p1 = p3;
      }
    }
    f10();
    f1();
    f2();
    f3();
    f4();
    f5();
    f9();
    simplify_polarRect();
    if (do_simplify_nested_radicals) {
      if (simplify_nested_radicals()) {
        if (DEBUG) {
          console.log("de-nesting successful into: " + p1.toString());
        }
        push(p1);
        simplify();
        return;
      }
    }
    simplify_rectToClock();
    simplify_rational_expressions();
    return push(p1);
  };

  simplify_tensor = function() {
    var i, l1, m1, ref2, ref3;
    i = 0;
    p2 = alloc_tensor(p1.tensor.nelem);
    p2.tensor.ndim = p1.tensor.ndim;
    for (i = l1 = 0, ref2 = p1.tensor.ndim; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      p2.tensor.dim[i] = p1.tensor.dim[i];
    }
    for (i = m1 = 0, ref3 = p1.tensor.nelem; 0 <= ref3 ? m1 < ref3 : m1 > ref3; i = 0 <= ref3 ? ++m1 : --m1) {
      push(p1.tensor.elem[i]);
      simplify();
      p2.tensor.elem[i] = pop();
    }
    check_tensor_dimensions(p2);
    if (isZeroAtomOrTensor(p2)) {
      p2 = zero;
    }
    return push(p2);
  };

  f1 = function() {
    if (car(p1) !== symbol(ADD)) {
      return;
    }
    push(p1);
    rationalize();
    p2 = pop();
    if (count(p2) < count(p1)) {
      return p1 = p2;
    }
  };

  f2 = function() {
    if (car(p1) !== symbol(ADD)) {
      return;
    }
    push(p1);
    Condense();
    p2 = pop();
    if (count(p2) <= count(p1)) {
      return p1 = p2;
    }
  };

  f3 = function() {
    push(p1);
    rationalize();
    negate();
    rationalize();
    negate();
    rationalize();
    p2 = pop();
    if (count(p2) < count(p1)) {
      return p1 = p2;
    }
  };

  f10 = function() {
    var a, b, carp1, miao, originalexpanding;
    carp1 = car(p1);
    miao = cdr(p1);
    if (carp1 === symbol(MULTIPLY) || isinnerordot(p1)) {
      if ((car(car(cdr(p1))) === symbol(TRANSPOSE)) && (car(car(cdr(cdr(p1)))) === symbol(TRANSPOSE))) {
        if (DEBUG) {
          console.log("maybe collecting a transpose " + p1);
        }
        a = cadr(car(cdr(p1)));
        b = cadr(car(cdr(cdr(p1))));
        if (carp1 === symbol(MULTIPLY)) {
          push(a);
          push(b);
          multiply();
        } else if (isinnerordot(p1)) {
          push(b);
          push(a);
          inner();
        }
        push_integer(1);
        push_integer(2);
        originalexpanding = expanding;
        expanding = false;
        transpose();
        expanding = originalexpanding;
        p2 = pop();
        if (count(p2) < count(p1)) {
          p1 = p2;
        }
        if (DEBUG) {
          return console.log("collecting a transpose " + p2);
        }
      }
    }
  };

  f4 = function() {
    if (isZeroAtomOrTensor(p1)) {
      return;
    }
    push(p1);
    rationalize();
    inverse();
    rationalize();
    inverse();
    rationalize();
    p2 = pop();
    if (count(p2) < count(p1)) {
      return p1 = p2;
    }
  };

  simplify_trig = function() {
    save();
    p1 = pop();
    f5();
    push(p1);
    return restore();
  };

  f5 = function() {
    if (Find(p1, symbol(SIN)) === 0 && Find(p1, symbol(COS)) === 0) {
      return;
    }
    p2 = p1;
    trigmode = 1;
    push(p2);
    Eval();
    p3 = pop();
    trigmode = 2;
    push(p2);
    Eval();
    p4 = pop();
    trigmode = 0;
    if (count(p4) < count(p3) || nterms(p4) < nterms(p3)) {
      p3 = p4;
    }
    if (count(p3) < count(p1) || nterms(p3) < nterms(p1)) {
      return p1 = p3;
    }
  };

  f9 = function() {
    var oldp1, oldp2;
    if (car(p1) !== symbol(ADD)) {
      return;
    }
    push_integer(0);
    p2 = cdr(p1);
    while (iscons(p2)) {
      push(car(p2));
      simplify();
      add();
      oldp1 = p1;
      oldp2 = p2;
      p1 = pop();
      simplify_rational_expressions();
      push(p1);
      p1 = oldp1;
      p2 = oldp2;
      p2 = cdr(p2);
    }
    p2 = pop();
    if (count(p2) < count(p1)) {
      return p1 = p2;
    }
  };

  simplify_rational_expressions = function() {
    var denom, num, polyVar, sasa, theGCD;
    push(p1);
    denominator();
    denom = pop();
    if (isone(denom)) {
      return;
    }
    push(p1);
    numerator();
    num = pop();
    if (isone(num)) {
      return;
    }
    if (!(polyVar = areunivarpolysfactoredorexpandedform(num, denom))) {
      return;
    }
    push(num);
    push(denom);
    gcd();
    push(polyVar);
    factor();
    theGCD = pop();
    if (isone(theGCD)) {
      return;
    }
    push(num);
    push(polyVar);
    factor();
    push(theGCD);
    inverse();
    multiply_noexpand();
    simplify();
    sasa = stack[tos - 1].toString();
    push(denom);
    push(polyVar);
    factor();
    push(theGCD);
    inverse();
    multiply_noexpand();
    simplify();
    sasa = stack[tos - 1].toString();
    divide();
    Condense();
    sasa = stack[tos - 1].toString();
    p2 = pop();
    if (count(p2) < count(p1)) {
      return p1 = p2;
    }
  };

  simplify_rectToClock = function() {
    if (Find(p1, symbol(SIN)) === 0 && Find(p1, symbol(COS)) === 0) {
      return;
    }
    push(p1);
    Eval();
    clockform();
    p2 = pop();
    if (DEBUG) {
      console.log("before simplification clockform: " + p1 + " after: " + p2);
    }
    if (count(p2) < count(p1)) {
      return p1 = p2;
    }
  };

  simplify_polarRect = function() {
    push(p1);
    polarRectAMinusOneBase();
    Eval();
    p2 = pop();
    if (count(p2) < count(p1)) {
      return p1 = p2;
    }
  };

  polarRectAMinusOneBase = function() {
    var h;
    save();
    p1 = pop();
    if (isimaginaryunit(p1)) {
      push(p1);
      restore();
      return;
    }
    if (equal(car(p1), symbol(POWER)) && isminusone(cadr(p1))) {
      push(one);
      negate();
      push(caddr(p1));
      polarRectAMinusOneBase();
      power();
      polar();
      rect();
    } else if (iscons(p1)) {
      h = tos;
      while (iscons(p1)) {
        push(car(p1));
        polarRectAMinusOneBase();
        p1 = cdr(p1);
      }
      list(tos - h);
    } else {
      push(p1);
    }
    restore();
  };

  nterms = function(p) {
    if (car(p) !== symbol(ADD)) {
      return 1;
    } else {
      return length(p) - 1;
    }
  };

  simplify_nested_radicals = function() {
    var prev_expanding, simplificationWithCondense, simplificationWithoutCondense, somethingSimplified;
    if (recursionLevelNestedRadicalsRemoval > 0) {
      if (DEBUG) {
        console.log("denesting bailing out because of too much recursion");
      }
      return false;
    }
    push(p1);
    somethingSimplified = take_care_of_nested_radicals();
    simplificationWithoutCondense = stack[tos - 1];
    prev_expanding = expanding;
    expanding = 0;
    yycondense();
    expanding = prev_expanding;
    simplificationWithCondense = pop();
    if (countOccurrencesOfSymbol(symbol(POWER), simplificationWithoutCondense) < countOccurrencesOfSymbol(symbol(POWER), simplificationWithCondense)) {
      push(simplificationWithoutCondense);
    } else {
      push(simplificationWithCondense);
    }
    p1 = pop();
    return somethingSimplified;
  };

  take_care_of_nested_radicals = function() {
    var A, B, C, SOLUTION, anyRadicalSimplificationWorked, base, checkSize, commonBases, commonInnerExponent, countingTerms, eachSolution, exponent, firstTerm, h, i, innerbase, innerexponent, l1, len, len1, len2, len3, lowercase_a, lowercase_b, m1, n1, numberOfTerms, o1, possibleNewExpression, possibleNewExpressionValue, possibleRationalSolutions, possibleSolutions, potentialPower, realOfpossibleRationalSolutions, ref2, secondTerm, secondTermFactor, termsThatAreNotPowers, whichRationalSolution;
    if (recursionLevelNestedRadicalsRemoval > 0) {
      if (DEBUG) {
        console.log("denesting bailing out because of too much recursion");
      }
      return false;
    }
    save();
    p1 = pop();
    if (equal(car(p1), symbol(POWER))) {
      base = cadr(p1);
      exponent = caddr(p1);
      if (!isminusone(exponent) && equal(car(base), symbol(ADD)) && isfraction(exponent) && (equalq(exponent, 1, 3) || equalq(exponent, 1, 2))) {
        firstTerm = cadr(base);
        push(firstTerm);
        take_care_of_nested_radicals();
        pop();
        secondTerm = caddr(base);
        push(secondTerm);
        take_care_of_nested_radicals();
        pop();
        numberOfTerms = 0;
        countingTerms = base;
        while (cdr(countingTerms) !== symbol(NIL)) {
          numberOfTerms++;
          countingTerms = cdr(countingTerms);
        }
        if (numberOfTerms > 2) {
          push(p1);
          restore();
          return false;
        }
        commonInnerExponent = null;
        commonBases = [];
        termsThatAreNotPowers = [];
        if (car(secondTerm) === symbol(MULTIPLY)) {
          secondTermFactor = cdr(secondTerm);
          if (iscons(secondTermFactor)) {
            while (iscons(secondTermFactor)) {
              potentialPower = car(secondTermFactor);
              if (car(potentialPower) === symbol(POWER)) {
                innerbase = cadr(potentialPower);
                innerexponent = caddr(potentialPower);
                if (equalq(innerexponent, 1, 2)) {
                  if (commonInnerExponent == null) {
                    commonInnerExponent = innerexponent;
                    commonBases.push(innerbase);
                  } else {
                    if (equal(innerexponent, commonInnerExponent)) {
                      commonBases.push(innerbase);
                    } else {

                    }
                  }
                }
              } else {
                termsThatAreNotPowers.push(potentialPower);
              }
              secondTermFactor = cdr(secondTermFactor);
            }
          }
        } else if (car(secondTerm) === symbol(POWER)) {
          innerbase = cadr(secondTerm);
          innerexponent = caddr(secondTerm);
          if ((commonInnerExponent == null) && equalq(innerexponent, 1, 2)) {
            commonInnerExponent = innerexponent;
            commonBases.push(innerbase);
          }
        }
        if (commonBases.length === 0) {
          push(p1);
          restore();
          return false;
        }
        A = firstTerm;
        push_integer(1);
        for (l1 = 0, len = commonBases.length; l1 < len; l1++) {
          i = commonBases[l1];
          push(i);
          multiply();
        }
        C = pop();
        push_integer(1);
        for (m1 = 0, len1 = termsThatAreNotPowers.length; m1 < len1; m1++) {
          i = termsThatAreNotPowers[m1];
          push(i);
          multiply();
        }
        B = pop();
        if (equalq(exponent, 1, 3)) {
          push(A);
          negate();
          push(C);
          multiply();
          push(B);
          divide();
          checkSize = pop();
          push(checkSize);
          real();
          yyfloat();
          if (Math.abs(pop().d) > Math.pow(2, 32)) {
            push(p1);
            restore();
            return false;
          }
          push(checkSize);
          push_integer(3);
          push(C);
          multiply();
          checkSize = pop();
          push(checkSize);
          real();
          yyfloat();
          if (Math.abs(pop().d) > Math.pow(2, 32)) {
            pop();
            push(p1);
            restore();
            return false;
          }
          push(checkSize);
          push(symbol(SECRETX));
          multiply();
          push_integer(-3);
          push(A);
          multiply();
          push(B);
          divide();
          checkSize = pop();
          push(checkSize);
          real();
          yyfloat();
          if (Math.abs(pop().d) > Math.pow(2, 32)) {
            pop();
            pop();
            push(p1);
            restore();
            return false;
          }
          push(checkSize);
          push(symbol(SECRETX));
          push_integer(2);
          power();
          multiply();
          push_integer(1);
          push(symbol(SECRETX));
          push_integer(3);
          power();
          multiply();
          add();
          add();
          add();
        } else if (equalq(exponent, 1, 2)) {
          push(C);
          checkSize = pop();
          push(checkSize);
          real();
          yyfloat();
          if (Math.abs(pop().d) > Math.pow(2, 32)) {
            push(p1);
            restore();
            return false;
          }
          push(checkSize);
          push_integer(-2);
          push(A);
          multiply();
          push(B);
          divide();
          checkSize = pop();
          push(checkSize);
          real();
          yyfloat();
          if (Math.abs(pop().d) > Math.pow(2, 32)) {
            pop();
            push(p1);
            restore();
            return false;
          }
          push(checkSize);
          push(symbol(SECRETX));
          multiply();
          push_integer(1);
          push(symbol(SECRETX));
          push_integer(2);
          power();
          multiply();
          add();
          add();
        }
        push(symbol(SECRETX));
        recursionLevelNestedRadicalsRemoval++;
        roots();
        recursionLevelNestedRadicalsRemoval--;
        if (equal(stack[tos - 1], symbol(NIL))) {
          if (DEBUG) {
            console.log("roots bailed out because of too much recursion");
          }
          pop();
          push(p1);
          restore();
          return false;
        }
        possibleSolutions = [];
        ref2 = stack[tos - 1].tensor.elem;
        for (n1 = 0, len2 = ref2.length; n1 < len2; n1++) {
          eachSolution = ref2[n1];
          if (!Find(eachSolution, symbol(POWER))) {
            possibleSolutions.push(eachSolution);
          }
        }
        pop();
        if (possibleSolutions.length === 0) {
          push(p1);
          restore();
          return false;
        }
        possibleRationalSolutions = [];
        realOfpossibleRationalSolutions = [];
        for (o1 = 0, len3 = possibleSolutions.length; o1 < len3; o1++) {
          i = possibleSolutions[o1];
          push(i);
          real();
          yyfloat();
          possibleRationalSolutions.push(i);
          realOfpossibleRationalSolutions.push(pop().d);
        }
        whichRationalSolution = realOfpossibleRationalSolutions.indexOf(Math.max.apply(Math, realOfpossibleRationalSolutions));
        SOLUTION = possibleRationalSolutions[whichRationalSolution];

        /*
        #possibleNewExpressions = []
        #realOfPossibleNewExpressions = []
         * pick the solution which cubic root has no radicals
        lowercase_b = null
        for SOLUTION in possibleSolutions
          console.log("testing solution: " + SOLUTION.toString())
        
          debugger
          if equalq(exponent,1,3)
            push(A)
            push(SOLUTION)
            push_integer(3)
            power()
            push_integer(3)
            push(C)
            multiply()
            push(SOLUTION)
            multiply()
            add()
            divide()
            console.log("argument of cubic root: " + stack[tos-1].toString())
            push_rational(1,3)
            power()
          else if equalq(exponent,1,2)
            push(A)
            push(SOLUTION)
            push_integer(2)
            power()
            push(C)
            add()
            divide()
            console.log("argument of cubic root: " + stack[tos-1].toString())
            push_rational(1,2)
            power()
          console.log("b is: " + stack[tos-1].toString())
        
          lowercase_b = pop()
        
          if !Find(lowercase_b, symbol(POWER))
            break
         */
        if (equalq(exponent, 1, 3)) {
          push(A);
          push(SOLUTION);
          push_integer(3);
          power();
          push_integer(3);
          push(C);
          multiply();
          push(SOLUTION);
          multiply();
          add();
          divide();
          push_rational(1, 3);
          power();
        } else if (equalq(exponent, 1, 2)) {
          push(A);
          push(SOLUTION);
          push_integer(2);
          power();
          push(C);
          add();
          divide();
          push_rational(1, 2);
          power();
        }
        lowercase_b = pop();
        if (lowercase_b == null) {
          push(p1);
          restore();
          return false;
        }
        push(lowercase_b);
        push(SOLUTION);
        multiply();
        if (equalq(exponent, 1, 3)) {
          lowercase_a = pop();
          push(lowercase_b);
          push(C);
          push_rational(1, 2);
          power();
          multiply();
          push(lowercase_a);
          add();
          simplify();
        } else if (equalq(exponent, 1, 2)) {
          lowercase_a = pop();
          push(lowercase_b);
          push(C);
          push_rational(1, 2);
          power();
          multiply();
          push(lowercase_a);
          add();
          simplify();
          possibleNewExpression = pop();
          push(possibleNewExpression);
          real();
          yyfloat();
          possibleNewExpressionValue = pop();
          if (!isnegativenumber(possibleNewExpressionValue)) {
            push(possibleNewExpression);
          } else {
            push(lowercase_b);
            negate();
            lowercase_b = pop();
            push(lowercase_a);
            negate();
            lowercase_a = pop();
            push(lowercase_b);
            push(C);
            push_rational(1, 2);
            power();
            multiply();
            push(lowercase_a);
            add();
            simplify();
          }
        }
        p1 = pop();
        push(p1);
        restore();
        return true;
      } else {
        push(p1);
        restore();
        return false;
      }
    } else if (iscons(p1)) {
      h = tos;
      anyRadicalSimplificationWorked = false;
      while (iscons(p1)) {
        push(car(p1));
        anyRadicalSimplificationWorked = anyRadicalSimplificationWorked || take_care_of_nested_radicals();
        p1 = cdr(p1);
      }
      list(tos - h);
      restore();
      return anyRadicalSimplificationWorked;
    } else {
      push(p1);
      restore();
      return false;
    }
    throw new Error("control flow should never reach here");
  };

  Eval_sin = function() {
    push(cadr(p1));
    Eval();
    return sine();
  };

  sine = function() {
    save();
    p1 = pop();
    if (car(p1) === symbol(ADD)) {
      sine_of_angle_sum();
    } else {
      sine_of_angle();
    }
    return restore();
  };

  sine_of_angle_sum = function() {
    p2 = cdr(p1);
    while (iscons(p2)) {
      p4 = car(p2);
      if (isnpi(p4)) {
        push(p1);
        push(p4);
        subtract();
        p3 = pop();
        push(p3);
        sine();
        push(p4);
        cosine();
        multiply();
        push(p3);
        cosine();
        push(p4);
        sine();
        multiply();
        add();
        return;
      }
      p2 = cdr(p2);
    }
    return sine_of_angle();
  };

  sine_of_angle = function() {
    var d, n;
    if (car(p1) === symbol(ARCSIN)) {
      push(cadr(p1));
      return;
    }
    if (isdouble(p1)) {
      d = Math.sin(p1.d);
      if (Math.abs(d) < 1e-10) {
        d = 0.0;
      }
      push_double(d);
      return;
    }
    if (isnegative(p1)) {
      push(p1);
      negate();
      sine();
      negate();
      return;
    }
    if (car(p1) === symbol(ARCTAN)) {
      push(cadr(p1));
      push_integer(1);
      push(cadr(p1));
      push_integer(2);
      power();
      add();
      push_rational(-1, 2);
      power();
      multiply();
      return;
    }
    push(p1);
    push_integer(180);
    multiply();
    if (evaluatingAsFloats) {
      push_double(Math.PI);
    } else {
      push_symbol(PI);
    }
    divide();
    n = pop_integer();
    if (n < 0 || isNaN(n)) {
      push(symbol(SIN));
      push(p1);
      list(2);
      return;
    }
    switch (n % 360) {
      case 0:
      case 180:
        return push_integer(0);
      case 30:
      case 150:
        return push_rational(1, 2);
      case 210:
      case 330:
        return push_rational(-1, 2);
      case 45:
      case 135:
        push_rational(1, 2);
        push_integer(2);
        push_rational(1, 2);
        power();
        return multiply();
      case 225:
      case 315:
        push_rational(-1, 2);
        push_integer(2);
        push_rational(1, 2);
        power();
        return multiply();
      case 60:
      case 120:
        push_rational(1, 2);
        push_integer(3);
        push_rational(1, 2);
        power();
        return multiply();
      case 240:
      case 300:
        push_rational(-1, 2);
        push_integer(3);
        push_rational(1, 2);
        power();
        return multiply();
      case 90:
        return push_integer(1);
      case 270:
        return push_integer(-1);
      default:
        push(symbol(SIN));
        push(p1);
        return list(2);
    }
  };

  Eval_sinh = function() {
    push(cadr(p1));
    Eval();
    return ysinh();
  };

  ysinh = function() {
    save();
    yysinh();
    return restore();
  };

  yysinh = function() {
    var d;
    d = 0.0;
    p1 = pop();
    if (car(p1) === symbol(ARCSINH)) {
      push(cadr(p1));
      return;
    }
    if (isdouble(p1)) {
      d = Math.sinh(p1.d);
      if (Math.abs(d) < 1e-10) {
        d = 0.0;
      }
      push_double(d);
      return;
    }
    if (isZeroAtomOrTensor(p1)) {
      push(zero);
      return;
    }
    push_symbol(SINH);
    push(p1);
    return list(2);
  };


  /*
    Substitute new expr for old expr in expr.
  
    Input:  push  expr
  
      push  old expr
  
      push  new expr
  
    Output:  Result on stack
   */

  subst = function() {
    var i, l1, m1, ref2, ref3;
    i = 0;
    save();
    p3 = pop();
    p2 = pop();
    if (p2 === symbol(NIL) || p3 === symbol(NIL)) {
      restore();
      return;
    }
    p1 = pop();
    if (istensor(p1)) {
      p4 = alloc_tensor(p1.tensor.nelem);
      p4.tensor.ndim = p1.tensor.ndim;
      for (i = l1 = 0, ref2 = p1.tensor.ndim; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
        p4.tensor.dim[i] = p1.tensor.dim[i];
      }
      for (i = m1 = 0, ref3 = p1.tensor.nelem; 0 <= ref3 ? m1 < ref3 : m1 > ref3; i = 0 <= ref3 ? ++m1 : --m1) {
        push(p1.tensor.elem[i]);
        push(p2);
        push(p3);
        subst();
        p4.tensor.elem[i] = pop();
        check_tensor_dimensions(p4);
      }
      push(p4);
    } else if (equal(p1, p2)) {
      push(p3);
    } else if (iscons(p1)) {
      push(car(p1));
      push(p2);
      push(p3);
      subst();
      push(cdr(p1));
      push(p2);
      push(p3);
      subst();
      cons();
    } else {
      push(p1);
    }
    return restore();
  };

  Eval_sum = function() {
    var body, i, indexVariable, j, k, l1, ref2, ref3;
    i = 0;
    j = 0;
    k = 0;
    body = cadr(p1);
    indexVariable = caddr(p1);
    if (!issymbol(indexVariable)) {
      stop("sum: 2nd arg?");
    }
    push(cadddr(p1));
    Eval();
    j = pop_integer();
    if (isNaN(j)) {
      push(p1);
      return;
    }
    push(caddddr(p1));
    Eval();
    k = pop_integer();
    if (isNaN(k)) {
      push(p1);
      return;
    }
    p4 = get_binding(indexVariable);
    push_integer(0);
    for (i = l1 = ref2 = j, ref3 = k; ref2 <= ref3 ? l1 <= ref3 : l1 >= ref3; i = ref2 <= ref3 ? ++l1 : --l1) {
      push_integer(i);
      p5 = pop();
      set_binding(indexVariable, p5);
      push(body);
      Eval();
      add();
    }
    return set_binding(indexVariable, p4);
  };

  Eval_tan = function() {
    push(cadr(p1));
    Eval();
    return tangent();
  };

  tangent = function() {
    save();
    yytangent();
    return restore();
  };

  yytangent = function() {
    var d, n;
    n = 0;
    d = 0.0;
    p1 = pop();
    if (car(p1) === symbol(ARCTAN)) {
      push(cadr(p1));
      return;
    }
    if (isdouble(p1)) {
      d = Math.tan(p1.d);
      if (Math.abs(d) < 1e-10) {
        d = 0.0;
      }
      push_double(d);
      return;
    }
    if (isnegative(p1)) {
      push(p1);
      negate();
      tangent();
      negate();
      return;
    }
    push(p1);
    push_integer(180);
    multiply();
    if (evaluatingAsFloats) {
      push_double(Math.PI);
    } else {
      push_symbol(PI);
    }
    divide();
    n = pop_integer();
    if (n < 0 || isNaN(n)) {
      push(symbol(TAN));
      push(p1);
      list(2);
      return;
    }
    switch (n % 360) {
      case 0:
      case 180:
        return push_integer(0);
      case 30:
      case 210:
        push_rational(1, 3);
        push_integer(3);
        push_rational(1, 2);
        power();
        return multiply();
      case 150:
      case 330:
        push_rational(-1, 3);
        push_integer(3);
        push_rational(1, 2);
        power();
        return multiply();
      case 45:
      case 225:
        return push_integer(1);
      case 135:
      case 315:
        return push_integer(-1);
      case 60:
      case 240:
        push_integer(3);
        push_rational(1, 2);
        return power();
      case 120:
      case 300:
        push_integer(3);
        push_rational(1, 2);
        power();
        return negate();
      default:
        push(symbol(TAN));
        push(p1);
        return list(2);
    }
  };

  Eval_tanh = function() {
    var d;
    d = 0.0;
    push(cadr(p1));
    Eval();
    p1 = pop();
    if (car(p1) === symbol(ARCTANH)) {
      push(cadr(p1));
      return;
    }
    if (isdouble(p1)) {
      d = Math.tanh(p1.d);
      if (Math.abs(d) < 1e-10) {
        d = 0.0;
      }
      push_double(d);
      return;
    }
    if (isZeroAtomOrTensor(p1)) {
      push(zero);
      return;
    }
    push_symbol(TANH);
    push(p1);
    return list(2);
  };


  /*
  Taylor expansion of a function
  
    push(F)
    push(X)
    push(N)
    push(A)
    taylor()
   */

  Eval_taylor = function() {
    p1 = cdr(p1);
    push(car(p1));
    Eval();
    p1 = cdr(p1);
    push(car(p1));
    Eval();
    p2 = pop();
    if (p2 === symbol(NIL)) {
      guess();
    } else {
      push(p2);
    }
    p1 = cdr(p1);
    push(car(p1));
    Eval();
    p2 = pop();
    if (p2 === symbol(NIL)) {
      push_integer(24);
    } else {
      push(p2);
    }
    p1 = cdr(p1);
    push(car(p1));
    Eval();
    p2 = pop();
    if (p2 === symbol(NIL)) {
      push_integer(0);
    } else {
      push(p2);
    }
    return taylor();
  };

  taylor = function() {
    var i, k, l1, ref2;
    i = 0;
    k = 0;
    save();
    p4 = pop();
    p3 = pop();
    p2 = pop();
    p1 = pop();
    push(p3);
    k = pop_integer();
    if (isNaN(k)) {
      push_symbol(TAYLOR);
      push(p1);
      push(p2);
      push(p3);
      push(p4);
      list(5);
      restore();
      return;
    }
    push(p1);
    push(p2);
    push(p4);
    subst();
    Eval();
    push_integer(1);
    p5 = pop();
    for (i = l1 = 1, ref2 = k; 1 <= ref2 ? l1 <= ref2 : l1 >= ref2; i = 1 <= ref2 ? ++l1 : --l1) {
      push(p1);
      push(p2);
      derivative();
      p1 = pop();
      if (isZeroAtomOrTensor(p1)) {
        break;
      }
      push(p5);
      push(p2);
      push(p4);
      subtract();
      multiply();
      p5 = pop();
      push(p1);
      push(p2);
      push(p4);
      subst();
      Eval();
      push(p5);
      multiply();
      push_integer(i);
      factorial();
      divide();
      add();
    }
    return restore();
  };


  /* tensor =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  General description
  -------------------
  Tensors are a strange in-between of matrices and "computer"
  rectangular data structures.
  
  Tensors, unlike matrices, and like rectangular data structures,
  can have an arbitrary number of dimensions (rank), although a tensor with
  rank zero is just a scalar.
  
  Tensors, like matrices and unlike many computer rectangular data structures,
  must be "contiguous" i.e. have no empty spaces within its size, and "uniform",
  i.e. each element must have the same shape and hence the same rank.
  
  Also tensors have necessarily to make a distinction between row vectors,
  column vectors (which have a rank of 2) and uni-dimensional vectors (rank 1).
  They look very similar but they are fundamentally different.
  
  Tensors are 1-indexed, as per general math notation, and like Fortran,
  Lua, Mathematica, SASL, MATLAB, Julia, Erlang and APL.
  
  Tensors with elements that are also tensors get promoted to a higher rank
  , this is so we can represent and get the rank of a matrix correctly.
  Example:
  Start with a tensor of rank 1 with 2 elements (i.e. shape: 2)
  if you put in both its elements another 2 tensors
  of rank 1 with 2 elements (i.e. shape: 2)
  then the result is a tensor of rank 2 with shape 2,2
  i.e. the dimension of a tensor at all times must be
  the number of nested tensors in it.
  Also, all tensors must be "uniform" i.e. they must be accessed
  uniformly, which means that all existing elements of a tensor
  must be contiguous and have the same shape.
  Implication of it all is that you can't put arbitrary
  tensors inside tensors (like you would do to represent block matrices)
  Rather, all tensors inside tensors must have same shape (and hence, rank)
  
  Limitations
  -----------
  n.a.
  
  Implementation info
  -------------------
  Tensors are implemented...
   */

  Eval_tensor = function() {
    var a, b, i, l1, m1, ndim, nelem, ref2, ref3;
    i = 0;
    ndim = 0;
    nelem = 0;
    check_tensor_dimensions(p1);
    nelem = p1.tensor.nelem;
    ndim = p1.tensor.ndim;
    p2 = alloc_tensor(nelem);
    p2.tensor.ndim = ndim;
    for (i = l1 = 0, ref2 = ndim; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      p2.tensor.dim[i] = p1.tensor.dim[i];
    }
    a = p1.tensor.elem;
    b = p2.tensor.elem;
    check_tensor_dimensions(p2);
    for (i = m1 = 0, ref3 = nelem; 0 <= ref3 ? m1 < ref3 : m1 > ref3; i = 0 <= ref3 ? ++m1 : --m1) {
      push(a[i]);
      Eval();
      b[i] = pop();
    }
    check_tensor_dimensions(p1);
    check_tensor_dimensions(p2);
    push(p2);
    return promote_tensor();
  };

  tensor_plus_tensor = function() {
    var a, b, c, i, l1, m1, n1, ndim, nelem, ref2, ref3, ref4;
    i = 0;
    ndim = 0;
    nelem = 0;
    save();
    p2 = pop();
    p1 = pop();
    ndim = p1.tensor.ndim;
    if (ndim !== p2.tensor.ndim) {
      push(symbol(NIL));
      restore();
      return;
    }
    for (i = l1 = 0, ref2 = ndim; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      if (p1.tensor.dim[i] !== p2.tensor.dim[i]) {
        push(symbol(NIL));
        restore();
        return;
      }
    }
    nelem = p1.tensor.nelem;
    p3 = alloc_tensor(nelem);
    p3.tensor.ndim = ndim;
    for (i = m1 = 0, ref3 = ndim; 0 <= ref3 ? m1 < ref3 : m1 > ref3; i = 0 <= ref3 ? ++m1 : --m1) {
      p3.tensor.dim[i] = p1.tensor.dim[i];
    }
    a = p1.tensor.elem;
    b = p2.tensor.elem;
    c = p3.tensor.elem;
    for (i = n1 = 0, ref4 = nelem; 0 <= ref4 ? n1 < ref4 : n1 > ref4; i = 0 <= ref4 ? ++n1 : --n1) {
      push(a[i]);
      push(b[i]);
      add();
      c[i] = pop();
    }
    push(p3);
    return restore();
  };

  tensor_times_scalar = function() {
    var a, b, i, l1, m1, ndim, nelem, ref2, ref3;
    i = 0;
    ndim = 0;
    nelem = 0;
    save();
    p2 = pop();
    p1 = pop();
    ndim = p1.tensor.ndim;
    nelem = p1.tensor.nelem;
    p3 = alloc_tensor(nelem);
    p3.tensor.ndim = ndim;
    for (i = l1 = 0, ref2 = ndim; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      p3.tensor.dim[i] = p1.tensor.dim[i];
    }
    a = p1.tensor.elem;
    b = p3.tensor.elem;
    for (i = m1 = 0, ref3 = nelem; 0 <= ref3 ? m1 < ref3 : m1 > ref3; i = 0 <= ref3 ? ++m1 : --m1) {
      push(a[i]);
      push(p2);
      multiply();
      b[i] = pop();
    }
    push(p3);
    return restore();
  };

  scalar_times_tensor = function() {
    var a, b, i, l1, m1, ndim, nelem, ref2, ref3;
    i = 0;
    ndim = 0;
    nelem = 0;
    save();
    p2 = pop();
    p1 = pop();
    ndim = p2.tensor.ndim;
    nelem = p2.tensor.nelem;
    p3 = alloc_tensor(nelem);
    p3.tensor.ndim = ndim;
    for (i = l1 = 0, ref2 = ndim; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      p3.tensor.dim[i] = p2.tensor.dim[i];
    }
    a = p2.tensor.elem;
    b = p3.tensor.elem;
    for (i = m1 = 0, ref3 = nelem; 0 <= ref3 ? m1 < ref3 : m1 > ref3; i = 0 <= ref3 ? ++m1 : --m1) {
      push(p1);
      push(a[i]);
      multiply();
      b[i] = pop();
    }
    push(p3);
    return restore();
  };

  check_tensor_dimensions = function(p) {
    if (p.tensor.nelem !== p.tensor.elem.length) {
      console.log("something wrong in tensor dimensions");
      debugger;
    }
  };

  is_square_matrix = function(p) {
    if (istensor(p) && p.tensor.ndim === 2 && p.tensor.dim[0] === p.tensor.dim[1]) {
      return 1;
    } else {
      return 0;
    }
  };

  d_tensor_tensor = function() {
    var a, b, c, i, j, l1, m1, n1, ndim, nelem, ref2, ref3, ref4;
    i = 0;
    j = 0;
    ndim = 0;
    nelem = 0;
    ndim = p1.tensor.ndim;
    nelem = p1.tensor.nelem;
    if (ndim + 1 >= MAXDIM) {
      push_symbol(DERIVATIVE);
      push(p1);
      push(p2);
      list(3);
      return;
    }
    p3 = alloc_tensor(nelem * p2.tensor.nelem);
    p3.tensor.ndim = ndim + 1;
    for (i = l1 = 0, ref2 = ndim; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      p3.tensor.dim[i] = p1.tensor.dim[i];
    }
    p3.tensor.dim[ndim] = p2.tensor.dim[0];
    a = p1.tensor.elem;
    b = p2.tensor.elem;
    c = p3.tensor.elem;
    for (i = m1 = 0, ref3 = nelem; 0 <= ref3 ? m1 < ref3 : m1 > ref3; i = 0 <= ref3 ? ++m1 : --m1) {
      for (j = n1 = 0, ref4 = p2.tensor.nelem; 0 <= ref4 ? n1 < ref4 : n1 > ref4; j = 0 <= ref4 ? ++n1 : --n1) {
        push(a[i]);
        push(b[j]);
        derivative();
        c[i * p2.tensor.nelem + j] = pop();
      }
    }
    return push(p3);
  };

  d_scalar_tensor = function() {
    var a, b, i, l1, ref2;
    p3 = alloc_tensor(p2.tensor.nelem);
    p3.tensor.ndim = 1;
    p3.tensor.dim[0] = p2.tensor.dim[0];
    a = p2.tensor.elem;
    b = p3.tensor.elem;
    for (i = l1 = 0, ref2 = p2.tensor.nelem; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      push(p1);
      push(a[i]);
      derivative();
      b[i] = pop();
    }
    return push(p3);
  };

  d_tensor_scalar = function() {
    var a, b, i, l1, m1, ref2, ref3;
    i = 0;
    p3 = alloc_tensor(p1.tensor.nelem);
    p3.tensor.ndim = p1.tensor.ndim;
    for (i = l1 = 0, ref2 = p1.tensor.ndim; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      p3.tensor.dim[i] = p1.tensor.dim[i];
    }
    a = p1.tensor.elem;
    b = p3.tensor.elem;
    for (i = m1 = 0, ref3 = p1.tensor.nelem; 0 <= ref3 ? m1 < ref3 : m1 > ref3; i = 0 <= ref3 ? ++m1 : --m1) {
      push(a[i]);
      push(p2);
      derivative();
      b[i] = pop();
    }
    return push(p3);
  };

  compare_tensors = function(p1, p2) {
    var i, l1, m1, ref2, ref3;
    i = 0;
    if (p1.tensor.ndim < p2.tensor.ndim) {
      return -1;
    }
    if (p1.tensor.ndim > p2.tensor.ndim) {
      return 1;
    }
    for (i = l1 = 0, ref2 = p1.tensor.ndim; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      if (p1.tensor.dim[i] < p2.tensor.dim[i]) {
        return -1;
      }
      if (p1.tensor.dim[i] > p2.tensor.dim[i]) {
        return 1;
      }
    }
    for (i = m1 = 0, ref3 = p1.tensor.nelem; 0 <= ref3 ? m1 < ref3 : m1 > ref3; i = 0 <= ref3 ? ++m1 : --m1) {
      if (equal(p1.tensor.elem[i], p2.tensor.elem[i])) {
        continue;
      }
      if (lessp(p1.tensor.elem[i], p2.tensor.elem[i])) {
        return -1;
      } else {
        return 1;
      }
    }
    return 0;
  };

  power_tensor = function() {
    var i, k, l1, m1, n, ref2, ref3, results;
    i = 0;
    k = 0;
    n = 0;
    k = p1.tensor.ndim - 1;
    if (p1.tensor.dim[0] !== p1.tensor.dim[k]) {
      push_symbol(POWER);
      push(p1);
      push(p2);
      list(3);
      return;
    }
    push(p2);
    n = pop_integer();
    if (isNaN(n)) {
      push_symbol(POWER);
      push(p1);
      push(p2);
      list(3);
      return;
    }
    if (n === 0) {
      if (p1.tensor.ndim !== 2) {
        stop("power(tensor,0) with tensor rank not equal to 2");
      }
      n = p1.tensor.dim[0];
      p1 = alloc_tensor(n * n);
      p1.tensor.ndim = 2;
      p1.tensor.dim[0] = n;
      p1.tensor.dim[1] = n;
      for (i = l1 = 0, ref2 = n; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
        p1.tensor.elem[n * i + i] = one;
      }
      check_tensor_dimensions(p1);
      push(p1);
      return;
    }
    if (n < 0) {
      n = -n;
      push(p1);
      inv();
      p1 = pop();
    }
    push(p1);
    results = [];
    for (i = m1 = 1, ref3 = n; 1 <= ref3 ? m1 < ref3 : m1 > ref3; i = 1 <= ref3 ? ++m1 : --m1) {
      push(p1);
      inner();
      if (isZeroAtomOrTensor(stack[tos - 1])) {
        break;
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  copy_tensor = function() {
    var i, l1, m1, ref2, ref3;
    i = 0;
    save();
    p1 = pop();
    p2 = alloc_tensor(p1.tensor.nelem);
    p2.tensor.ndim = p1.tensor.ndim;
    for (i = l1 = 0, ref2 = p1.tensor.ndim; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      p2.tensor.dim[i] = p1.tensor.dim[i];
    }
    for (i = m1 = 0, ref3 = p1.tensor.nelem; 0 <= ref3 ? m1 < ref3 : m1 > ref3; i = 0 <= ref3 ? ++m1 : --m1) {
      p2.tensor.elem[i] = p1.tensor.elem[i];
    }
    check_tensor_dimensions(p1);
    check_tensor_dimensions(p2);
    push(p2);
    return restore();
  };

  promote_tensor = function() {
    var i, j, k, l1, m1, n1, ndim, nelem, o1, q1, ref2, ref3, ref4, ref5, ref6;
    i = 0;
    j = 0;
    k = 0;
    nelem = 0;
    ndim = 0;
    save();
    p1 = pop();
    if (!istensor(p1)) {
      push(p1);
      restore();
      return;
    }
    p2 = p1.tensor.elem[0];
    for (i = l1 = 1, ref2 = p1.tensor.nelem; 1 <= ref2 ? l1 < ref2 : l1 > ref2; i = 1 <= ref2 ? ++l1 : --l1) {
      if (!compatible(p2, p1.tensor.elem[i])) {
        stop("Cannot promote tensor due to inconsistent tensor components.");
      }
    }
    if (!istensor(p2)) {
      push(p1);
      restore();
      return;
    }
    ndim = p1.tensor.ndim + p2.tensor.ndim;
    if (ndim > MAXDIM) {
      stop("tensor rank > " + MAXDIM);
    }
    nelem = p1.tensor.nelem * p2.tensor.nelem;
    p3 = alloc_tensor(nelem);
    p3.tensor.ndim = ndim;
    for (i = m1 = 0, ref3 = p1.tensor.ndim; 0 <= ref3 ? m1 < ref3 : m1 > ref3; i = 0 <= ref3 ? ++m1 : --m1) {
      p3.tensor.dim[i] = p1.tensor.dim[i];
    }
    for (j = n1 = 0, ref4 = p2.tensor.ndim; 0 <= ref4 ? n1 < ref4 : n1 > ref4; j = 0 <= ref4 ? ++n1 : --n1) {
      p3.tensor.dim[i + j] = p2.tensor.dim[j];
    }
    k = 0;
    for (i = o1 = 0, ref5 = p1.tensor.nelem; 0 <= ref5 ? o1 < ref5 : o1 > ref5; i = 0 <= ref5 ? ++o1 : --o1) {
      p2 = p1.tensor.elem[i];
      for (j = q1 = 0, ref6 = p2.tensor.nelem; 0 <= ref6 ? q1 < ref6 : q1 > ref6; j = 0 <= ref6 ? ++q1 : --q1) {
        p3.tensor.elem[k++] = p2.tensor.elem[j];
      }
    }
    check_tensor_dimensions(p2);
    check_tensor_dimensions(p3);
    push(p3);
    return restore();
  };

  compatible = function(p, q) {
    var i, l1, ref2;
    if (!istensor(p) && !istensor(q)) {
      return 1;
    }
    if (!istensor(p) || !istensor(q)) {
      return 0;
    }
    if (p.tensor.ndim !== q.tensor.ndim) {
      return 0;
    }
    for (i = l1 = 0, ref2 = p.tensor.ndim; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      if (p.tensor.dim[i] !== q.tensor.dim[i]) {
        return 0;
      }
    }
    return 1;
  };

  Eval_test = function() {
    var checkResult, orig;
    orig = p1;
    p1 = cdr(p1);
    while (iscons(p1)) {
      if (cdr(p1) === symbol(NIL)) {
        push(car(p1));
        Eval();
        return;
      }
      checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(car(p1));
      if (checkResult == null) {
        push(orig);
        return;
      } else if (checkResult) {
        push(cadr(p1));
        Eval();
        return;
      } else {
        p1 = cddr(p1);
      }
    }
    return push_integer(0);
  };

  Eval_testeq = function() {
    var checkResult, orig, subtractionResult;
    orig = p1;
    push(cadr(p1));
    Eval();
    push(caddr(p1));
    Eval();
    subtract();
    subtractionResult = pop();
    checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(subtractionResult);
    if (checkResult) {
      push_integer(0);
      return;
    } else if ((checkResult != null) && !checkResult) {
      push_integer(1);
      return;
    }
    push(cadr(p1));
    Eval();
    simplify();
    push(caddr(p1));
    Eval();
    simplify();
    subtract();
    subtractionResult = pop();
    checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(subtractionResult);
    if (checkResult) {
      push_integer(0);
      return;
    } else if ((checkResult != null) && !checkResult) {
      push_integer(1);
      return;
    }
    return push(orig);
  };

  Eval_testge = function() {
    var comparison, orig;
    orig = p1;
    comparison = cmp_args();
    if (comparison == null) {
      push(orig);
      return;
    }
    if (comparison >= 0) {
      return push_integer(1);
    } else {
      return push_integer(0);
    }
  };

  Eval_testgt = function() {
    var comparison, orig;
    orig = p1;
    comparison = cmp_args();
    if (comparison == null) {
      push(orig);
      return;
    }
    if (comparison > 0) {
      return push_integer(1);
    } else {
      return push_integer(0);
    }
  };

  Eval_testle = function() {
    var comparison, orig;
    orig = p1;
    comparison = cmp_args();
    if (comparison == null) {
      push(orig);
      return;
    }
    if (comparison <= 0) {
      return push_integer(1);
    } else {
      return push_integer(0);
    }
  };

  Eval_testlt = function() {
    var comparison, orig;
    orig = p1;
    comparison = cmp_args();
    if (comparison == null) {
      push(orig);
      return;
    }
    if (comparison < 0) {
      return push_integer(1);
    } else {
      return push_integer(0);
    }
  };

  Eval_not = function() {
    var checkResult, wholeAndExpression;
    wholeAndExpression = p1;
    checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(cadr(p1));
    if (checkResult == null) {
      return push(wholeAndExpression);
    } else if (checkResult) {
      return push_integer(0);
    } else {
      return push_integer(1);
    }
  };


  /* and =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  a,b,...
  
  General description
  -------------------
  Logical-and of predicate expressions.
   */

  Eval_and = function() {
    var andPredicates, checkResult, somePredicateUnknown, wholeAndExpression;
    wholeAndExpression = p1;
    andPredicates = cdr(wholeAndExpression);
    somePredicateUnknown = false;
    while (iscons(andPredicates)) {
      checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(car(andPredicates));
      if (checkResult == null) {
        somePredicateUnknown = true;
        andPredicates = cdr(andPredicates);
      } else if (checkResult) {
        andPredicates = cdr(andPredicates);
      } else if (!checkResult) {
        push_integer(0);
        return;
      }
    }
    if (somePredicateUnknown) {
      return push(wholeAndExpression);
    } else {
      return push_integer(1);
    }
  };

  Eval_or = function() {
    var checkResult, orPredicates, somePredicateUnknown, wholeOrExpression;
    wholeOrExpression = p1;
    orPredicates = cdr(wholeOrExpression);
    somePredicateUnknown = false;
    while (iscons(orPredicates)) {
      checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(car(orPredicates));
      if (checkResult == null) {
        somePredicateUnknown = true;
        orPredicates = cdr(orPredicates);
      } else if (checkResult) {
        push_integer(1);
        return;
      } else if (!checkResult) {
        orPredicates = cdr(orPredicates);
      }
    }
    if (somePredicateUnknown) {
      return push(wholeOrExpression);
    } else {
      return push_integer(0);
    }
  };

  cmp_args = function() {
    var t;
    t = 0;
    push(cadr(p1));
    Eval();
    simplify();
    push(caddr(p1));
    Eval();
    simplify();
    subtract();
    p1 = pop();
    if (p1.k !== NUM && p1.k !== DOUBLE) {
      push(p1);
      yyfloat();
      Eval();
      p1 = pop();
    }
    if (isZeroAtomOrTensor(p1)) {
      return 0;
    }
    switch (p1.k) {
      case NUM:
        if (MSIGN(p1.q.a) === -1) {
          t = -1;
        } else {
          t = 1;
        }
        break;
      case DOUBLE:
        if (p1.d < 0.0) {
          t = -1;
        } else {
          t = 1;
        }
        break;
      default:
        t = null;
    }
    return t;
  };


  /*
  Transform an expression using a pattern. The
  pattern can come from the integrals table or
  the user-defined patterns.
  
  The expression and free variable are on the stack.
  
  The argument s is a null terminated list of transform rules.
  
  For example, see the itab (integrals table)
  
  Internally, the following symbols are used:
  
    F  input expression
  
    X  free variable, i.e. F of X
  
    A  template expression
  
    B  result expression
  
    C  list of conditional expressions
  
  Puts the final expression on top of stack
  (whether it's transformed or not) and returns
  true is successful, false if not.
   */

  transform = function(s, generalTransform) {
    var bookmarkTosToPrintDecomps, eachTransformEntry, i, l1, len, len1, m1, n1, numberOfDecomps, ref2, restTerm, secondTerm, success, theTransform, transform_h, transformationSuccessful, transformedTerms;
    transform_h = 0;
    save();
    p1 = null;
    p4 = pop();
    p3 = pop();
    if (DEBUG) {
      console.log("         !!!!!!!!!   transform on: " + p3);
    }
    saveMetaBindings();
    set_binding(symbol(METAX), p4);
    transform_h = tos;
    push_integer(1);
    push(p3);
    push(p4);
    polyform();
    push(p4);
    bookmarkTosToPrintDecomps = tos - 2;
    decomp(generalTransform);
    numberOfDecomps = tos - bookmarkTosToPrintDecomps;
    if (DEBUG) {
      console.log("  " + numberOfDecomps + " decomposed elements ====== ");
      for (i = l1 = 0, ref2 = numberOfDecomps; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
        console.log("  decomposition element " + i + ": " + stack[tos - 1 - i]);
      }
    }
    transformationSuccessful = false;
    if (generalTransform) {
      if (!isNumericAtom(p3)) {
        theTransform = s;
        if (DEBUG) {
          console.log("applying transform: " + theTransform);
        }
        if (DEBUG) {
          console.log("scanning table entry " + theTransform);
        }
        push(theTransform);
        push(symbol(SYMBOL_A_UNDERSCORE));
        push(symbol(METAA));
        subst();
        push(symbol(SYMBOL_B_UNDERSCORE));
        push(symbol(METAB));
        subst();
        push(symbol(SYMBOL_X_UNDERSCORE));
        push(symbol(METAX));
        subst();
        p1 = pop();
        p5 = car(p1);
        if (DEBUG) {
          console.log("template expression: " + p5);
        }
        p6 = cadr(p1);
        p7 = cddr(p1);

        /*
        p5 = p1.tensor.elem[0]
        p6 = p1.tensor.elem[1]
        for i in [2..(p1.tensor.elem.length-1)]
          push p1.tensor.elem[i]
        list(p1.tensor.elem.length - 2)
        p7 = pop()
         */
        if (f_equals_a(transform_h, generalTransform)) {
          transformationSuccessful = true;
        } else {
          if (DEBUG) {
            console.log("p3 at this point: " + p3);
          }
          transformedTerms = [];
          if (DEBUG) {
            console.log("car(p3): " + car(p3));
          }
          restTerm = p3;
          if (iscons(restTerm)) {
            transformedTerms.push(car(p3));
            restTerm = cdr(p3);
          }
          while (iscons(restTerm)) {
            secondTerm = car(restTerm);
            restTerm = cdr(restTerm);
            if (DEBUG) {
              console.log("tos before recursive transform: " + tos);
            }
            push(secondTerm);
            push_symbol(NIL);
            if (DEBUG) {
              console.log("testing: " + secondTerm);
            }
            if (DEBUG) {
              console.log("about to try to simplify other term: " + secondTerm);
            }
            success = transform(s, generalTransform);
            transformationSuccessful = transformationSuccessful || success;
            transformedTerms.push(pop());
            if (DEBUG) {
              console.log("tried to simplify other term: " + secondTerm + " ...successful?: " + success + " ...transformed: " + transformedTerms[transformedTerms.length - 1]);
            }
          }
          if (transformedTerms.length !== 0) {
            for (m1 = 0, len = transformedTerms.length; m1 < len; m1++) {
              i = transformedTerms[m1];
              push(i);
            }
            list(transformedTerms.length);
            p6 = pop();
          }
        }
      }
    } else {
      for (n1 = 0, len1 = s.length; n1 < len1; n1++) {
        eachTransformEntry = s[n1];
        if (DEBUG) {
          console.log("scanning table entry " + eachTransformEntry);
          if ((eachTransformEntry + "").indexOf("f(sqrt(a+b*x),2/3*1/b*sqrt((a+b*x)^3))") !== -1) {
            debugger;
          }
        }
        if (eachTransformEntry) {
          scan_meta(eachTransformEntry);
          p1 = pop();
          p5 = cadr(p1);
          p6 = caddr(p1);
          p7 = cdddr(p1);

          /*
          p5 = p1.tensor.elem[0]
          p6 = p1.tensor.elem[1]
          for i in [2..(p1.tensor.elem.length-1)]
            push p1.tensor.elem[i]
          list(p1.tensor.elem.length - 2)
          p7 = pop()
           */
          if (f_equals_a(transform_h, generalTransform)) {
            transformationSuccessful = true;
            break;
          }
        }
      }
    }
    moveTos(transform_h);
    if (transformationSuccessful) {
      push(p6);
      Eval();
      p1 = pop();
      transformationSuccessful = true;
    } else {
      if (generalTransform) {
        p1 = p3;
      } else {
        p1 = symbol(NIL);
      }
    }
    restoreMetaBindings();
    push(p1);
    restore();
    return transformationSuccessful;
  };

  saveMetaBindings = function() {
    push(get_binding(symbol(METAA)));
    push(get_binding(symbol(METAB)));
    return push(get_binding(symbol(METAX)));
  };

  restoreMetaBindings = function() {
    set_binding(symbol(METAX), pop());
    set_binding(symbol(METAB), pop());
    return set_binding(symbol(METAA), pop());
  };

  f_equals_a = function(h, generalTransform) {
    var fea_i, fea_j, l1, m1, originalexpanding, ref2, ref3, ref4, ref5;
    fea_i = 0;
    fea_j = 0;
    for (fea_i = l1 = ref2 = h, ref3 = tos; ref2 <= ref3 ? l1 < ref3 : l1 > ref3; fea_i = ref2 <= ref3 ? ++l1 : --l1) {
      set_binding(symbol(METAA), stack[fea_i]);
      if (DEBUG) {
        console.log("  binding METAA to " + get_binding(symbol(METAA)));
      }
      for (fea_j = m1 = ref4 = h, ref5 = tos; ref4 <= ref5 ? m1 < ref5 : m1 > ref5; fea_j = ref4 <= ref5 ? ++m1 : --m1) {
        set_binding(symbol(METAB), stack[fea_j]);
        if (DEBUG) {
          console.log("  binding METAB to " + get_binding(symbol(METAB)));
        }
        p1 = p7;
        while (iscons(p1)) {
          push(car(p1));
          Eval();
          p2 = pop();
          if (isZeroAtomOrTensor(p2)) {
            break;
          }
          p1 = cdr(p1);
        }
        if (iscons(p1)) {
          continue;
        }
        push(p3);
        if (DEBUG) {
          console.log("about to evaluate template expression: " + p5 + " binding METAA to " + get_binding(symbol(METAA)) + " and binding METAB to " + get_binding(symbol(METAB)) + " and binding METAX to " + get_binding(symbol(METAX)));
        }
        push(p5);
        if (generalTransform) {
          originalexpanding = expanding;
          expanding = false;
        }
        Eval();
        if (generalTransform) {
          expanding = originalexpanding;
        }
        if (DEBUG) {
          console.log("  comparing " + stack[tos - 1] + " to: " + stack[tos - 2]);
        }
        subtract();
        p1 = pop();
        if (isZeroAtomOrTensor(p1)) {
          if (DEBUG) {
            console.log("binding METAA to " + get_binding(symbol(METAA)));
            console.log("binding METAB to " + get_binding(symbol(METAB)));
            console.log("binding METAX to " + get_binding(symbol(METAX)));
            console.log("comparing " + p3 + " to: " + p5);
          }
          return 1;
        }
      }
    }
    return 0;
  };

  Eval_transpose = function() {
    push(cadr(p1));
    Eval();
    if (cddr(p1) === symbol(NIL)) {
      push_integer(1);
      push_integer(2);
    } else {
      push(caddr(p1));
      Eval();
      push(cadddr(p1));
      Eval();
    }
    return transpose();
  };

  transpose = function() {
    var a, accumulator, ai, an, b, eachEntry, i, innerTranspSwitch1, innerTranspSwitch2, j, k, l, l1, m, m1, n1, ndim, nelem, o1, q1, r1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, s1, t;
    i = 0;
    j = 0;
    k = 0;
    l = 0;
    m = 0;
    ndim = 0;
    nelem = 0;
    t = 0;
    ai = [];
    an = [];
    for (i = l1 = 0, ref2 = MAXDIM; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      ai[i] = 0;
      an[i] = 0;
    }
    save();
    p3 = pop();
    p2 = pop();
    p1 = pop();
    if (isNumericAtom(p1)) {
      push(p1);
      restore();
      return;
    }
    if ((isplusone(p2) && isplustwo(p3)) || (isplusone(p3) && isplustwo(p2))) {
      if (isidentitymatrix(p1)) {
        push(p1);
        restore();
        return;
      }
    }
    if (istranspose(p1)) {
      innerTranspSwitch1 = car(cdr(cdr(p1)));
      innerTranspSwitch2 = car(cdr(cdr(cdr(p1))));
      if ((equal(innerTranspSwitch1, p3) && equal(innerTranspSwitch2, p2)) || (equal(innerTranspSwitch2, p3) && equal(innerTranspSwitch1, p2)) || ((equal(innerTranspSwitch1, symbol(NIL)) && equal(innerTranspSwitch2, symbol(NIL))) && ((isplusone(p3) && isplustwo(p2)) || (isplusone(p2) && isplustwo(p3))))) {
        push(car(cdr(p1)));
        restore();
        return;
      }
    }
    if (expanding && isadd(p1)) {
      p1 = cdr(p1);
      push(zero);
      while (iscons(p1)) {
        push(car(p1));
        push(p2);
        push(p3);
        transpose();
        add();
        p1 = cdr(p1);
      }
      restore();
      return;
    }
    if (expanding && ismultiply(p1)) {
      p1 = cdr(p1);
      push(one);
      while (iscons(p1)) {
        push(car(p1));
        push(p2);
        push(p3);
        transpose();
        multiply();
        p1 = cdr(p1);
      }
      restore();
      return;
    }
    if (expanding && isinnerordot(p1)) {
      p1 = cdr(p1);
      accumulator = [];
      while (iscons(p1)) {
        accumulator.push([car(p1), p2, p3]);
        p1 = cdr(p1);
      }
      for (eachEntry = m1 = ref3 = accumulator.length - 1; ref3 <= 0 ? m1 <= 0 : m1 >= 0; eachEntry = ref3 <= 0 ? ++m1 : --m1) {
        push(accumulator[eachEntry][0]);
        push(accumulator[eachEntry][1]);
        push(accumulator[eachEntry][2]);
        transpose();
        if (eachEntry !== accumulator.length - 1) {
          inner();
        }
      }
      restore();
      return;
    }
    if (!istensor(p1)) {
      if (!isZeroAtomOrTensor(p1)) {
        push_symbol(TRANSPOSE);
        push(p1);
        if ((!isplusone(p2) || !isplustwo(p3)) && (!isplusone(p3) || !isplustwo(p2))) {
          push(p2);
          push(p3);
          list(4);
        } else {
          list(2);
        }
        restore();
        return;
      }
      push(zero);
      restore();
      return;
    }
    ndim = p1.tensor.ndim;
    nelem = p1.tensor.nelem;
    if (ndim === 1) {
      push(p1);
      restore();
      return;
    }
    push(p2);
    l = pop_integer();
    push(p3);
    m = pop_integer();
    if (l < 1 || l > ndim || m < 1 || m > ndim) {
      stop("transpose: index out of range");
    }
    l--;
    m--;
    p2 = alloc_tensor(nelem);
    p2.tensor.ndim = ndim;
    for (i = n1 = 0, ref4 = ndim; 0 <= ref4 ? n1 < ref4 : n1 > ref4; i = 0 <= ref4 ? ++n1 : --n1) {
      p2.tensor.dim[i] = p1.tensor.dim[i];
    }
    p2.tensor.dim[l] = p1.tensor.dim[m];
    p2.tensor.dim[m] = p1.tensor.dim[l];
    a = p1.tensor.elem;
    b = p2.tensor.elem;
    for (i = o1 = 0, ref5 = ndim; 0 <= ref5 ? o1 < ref5 : o1 > ref5; i = 0 <= ref5 ? ++o1 : --o1) {
      ai[i] = 0;
      an[i] = p1.tensor.dim[i];
    }
    for (i = q1 = 0, ref6 = nelem; 0 <= ref6 ? q1 < ref6 : q1 > ref6; i = 0 <= ref6 ? ++q1 : --q1) {
      t = ai[l];
      ai[l] = ai[m];
      ai[m] = t;
      t = an[l];
      an[l] = an[m];
      an[m] = t;
      k = 0;
      for (j = r1 = 0, ref7 = ndim; 0 <= ref7 ? r1 < ref7 : r1 > ref7; j = 0 <= ref7 ? ++r1 : --r1) {
        k = (k * an[j]) + ai[j];
      }
      t = ai[l];
      ai[l] = ai[m];
      ai[m] = t;
      t = an[l];
      an[l] = an[m];
      an[m] = t;
      b[k] = a[i];
      for (j = s1 = ref8 = ndim - 1; ref8 <= 0 ? s1 <= 0 : s1 >= 0; j = ref8 <= 0 ? ++s1 : --s1) {
        if (++ai[j] < an[j]) {
          break;
        }
        ai[j] = 0;
      }
    }
    push(p2);
    return restore();
  };


  /* d =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept
  
  Parameters
  ----------
  f,x
  
  General description
  -------------------
  Returns the partial derivative of f with respect to x. x can be a vector e.g. [x,y].
   */

  Eval_user_function = function() {
    var bodyAndFormalArguments, h;
    if (DEBUG) {
      console.log("Eval_user_function evaluating: " + car(p1));
    }
    if (car(p1) === symbol(SYMBOL_D) && get_binding(symbol(SYMBOL_D)) === symbol(SYMBOL_D)) {
      Eval_derivative();
      return;
    }
    push(car(p1));
    Eval();
    bodyAndFormalArguments = pop();
    if (isNumericAtom(bodyAndFormalArguments)) {
      stop("expected function invocation, found multiplication instead. Use '*' symbol explicitly for multiplication.");
    } else if (istensor(bodyAndFormalArguments)) {
      stop("expected function invocation, found tensor product instead. Use 'dot/inner' explicitly.");
    } else if (isstr(bodyAndFormalArguments)) {
      stop("expected function, found string instead.");
    }
    p3 = car(cdr(bodyAndFormalArguments));
    p4 = car(cdr(cdr(bodyAndFormalArguments)));
    p5 = cdr(p1);
    if ((car(bodyAndFormalArguments) !== symbol(FUNCTION)) || (bodyAndFormalArguments === car(p1))) {
      h = tos;
      push(bodyAndFormalArguments);
      p1 = p5;
      while (iscons(p1)) {
        push(car(p1));
        Eval();
        p1 = cdr(p1);
      }
      list(tos - h);
      return;
    }
    p1 = p4;
    p2 = p5;
    h = tos;
    while (iscons(p1) && iscons(p2)) {
      push(car(p1));
      push(car(p2));
      p1 = cdr(p1);
      p2 = cdr(p2);
    }
    list(tos - h);
    p6 = pop();
    push(p3);
    if (iscons(p6)) {
      push(p6);
      rewrite_args();
    }
    return Eval();
  };

  rewrite_args = function() {
    var h, n;
    n = 0;
    save();
    p2 = pop();
    p1 = pop();
    if (istensor(p1)) {
      n = rewrite_args_tensor();
      restore();
      return n;
    }
    if (iscons(p1)) {
      h = tos;
      if (car(p1) === car(p2)) {
        push_symbol(EVAL);
        push(car(cdr(p2)));
        list(2);
      } else {
        push(car(p1));
      }
      p1 = cdr(p1);
      while (iscons(p1)) {
        push(car(p1));
        push(p2);
        n += rewrite_args();
        p1 = cdr(p1);
      }
      list(tos - h);
      restore();
      return n;
    }
    if (!issymbol(p1)) {
      push(p1);
      restore();
      return 0;
    }
    p3 = p2;
    while (iscons(p3)) {
      if (p1 === car(p3)) {
        push(cadr(p3));
        restore();
        return 1;
      }
      p3 = cddr(p3);
    }
    p3 = get_binding(p1);
    push(p3);
    if (p1 !== p3) {
      push(p2);
      n = rewrite_args();
      if (n === 0) {
        pop();
        push(p1);
      }
    }
    restore();
    return n;
  };

  rewrite_args_tensor = function() {
    var i, l1, n, ref2;
    n = 0;
    i = 0;
    push(p1);
    copy_tensor();
    p1 = pop();
    for (i = l1 = 0, ref2 = p1.tensor.nelem; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      push(p1.tensor.elem[i]);
      push(p2);
      n += rewrite_args();
      p1.tensor.elem[i] = pop();
    }
    check_tensor_dimensions(p1);
    push(p1);
    return n;
  };

  Eval_zero = function() {
    var i, k, l1, m, m1, n, ref2, ref3;
    i = 0;
    k = [];
    m = 0;
    n = 0;
    for (i = l1 = 0, ref2 = MAXDIM; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      k[i] = 0;
    }
    m = 1;
    n = 0;
    p2 = cdr(p1);
    while (iscons(p2)) {
      push(car(p2));
      Eval();
      i = pop_integer();
      if (i < 1 || isNaN(i)) {
        push(zero);
        return;
      }
      m *= i;
      k[n++] = i;
      p2 = cdr(p2);
    }
    if (n === 0) {
      push(zero);
      return;
    }
    p1 = alloc_tensor(m);
    p1.tensor.ndim = n;
    for (i = m1 = 0, ref3 = n; 0 <= ref3 ? m1 < ref3 : m1 > ref3; i = 0 <= ref3 ? ++m1 : --m1) {
      p1.tensor.dim[i] = k[i];
    }
    return push(p1);
  };


  /*
  // up to 100 blocks of 100,000 atoms
  
  #define M 100
  #define N 100000
  
  U *mem[M]
  int mcount
  
  U *free_list
  int free_count
  
  U *
  alloc(void)
  {
    U *p
    if (free_count == 0) {
      if (mcount == 0)
        alloc_mem()
      else {
        gc()
        if (free_count < N * mcount / 2)
          alloc_mem()
      }
      if (free_count == 0)
        stop("atom space exhausted")
    }
    p = free_list
    free_list = free_list->u.cons.cdr
    free_count--
    return p
  }
   */

  allocatedId = 0;

  alloc_tensor = function(nelem) {
    var i, l1, p, ref2;
    i = 0;
    p = new U();
    p.k = TENSOR;
    p.tensor = new tensor();
    p.tensor.nelem = nelem;
    for (i = l1 = 0, ref2 = nelem; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      p.tensor.elem[i] = zero;
    }
    p.tensor.allocatedId = allocatedId;
    allocatedId++;
    check_tensor_dimensions(p);
    return p;
  };


  /*
  // garbage collector
  
  void
  gc(void)
  {
    int i, j
    U *p
  
    // tag everything
  
    for (i = 0; i < mcount; i++) {
      p = mem[i]
      for (j = 0; j < N; j++)
        p[j].tag = 1
    }
  
    // untag what's used
  
    untag(p0)
    untag(p1)
    untag(p2)
    untag(p3)
    untag(p4)
    untag(p5)
    untag(p6)
    untag(p7)
    untag(p8)
    untag(p9)
  
    untag(one)
    untag(zero)
    untag(imaginaryunit)
  
    for (i = 0; i < NSYM; i++) {
      untag(binding[i])
      untag(arglist[i])
    }
  
    for (i = 0; i < tos; i++)
      untag(stack[i])
  
    for (i = (int) (frame - stack); i < TOS; i++)
      untag(stack[i])
  
    // collect everything that's still tagged
  
    free_count = 0
  
    for (i = 0; i < mcount; i++) {
      p = mem[i]
      for (j = 0; j < N; j++) {
        if (p[j].tag == 0)
          continue
        // still tagged so it's unused, put on free list
        switch (p[j].k) {
        case TENSOR:
          free(p[j].u.tensor)
          break
        case STR:
          free(p[j].u.str)
          break
        case NUM:
          mfree(p[j].u.q.a)
          mfree(p[j].u.q.b)
          break
        }
        p[j].k = CONS; // so no double free occurs above
        p[j].u.cons.cdr = free_list
        free_list = p + j
        free_count++
      }
    }
  }
  
  void
  untag(U *p)
  {
    int i
  
    if (iscons(p)) {
      do {
        if (p->tag == 0)
          return
        p->tag = 0
        untag(p->u.cons.car)
        p = p->u.cons.cdr
      } while (iscons(p))
      untag(p)
      return
    }
  
    if (p->tag) {
      p->tag = 0
       if (istensor(p)) {
        for (i = 0; i < p->u.tensor->nelem; i++)
          untag(p->u.tensor->elem[i])
      }
    }
  }
  
  // get memory for 100,000 atoms
  
  void
  alloc_mem(void)
  {
    int i
    U *p
    if (mcount == M)
      return
    p = (U *) malloc(N * sizeof (struct U))
    if (p == NULL)
      return
    mem[mcount++] = p
    for (i = 0; i < N; i++) {
      p[i].k = CONS; // so no free in gc
      p[i].u.cons.cdr = p + i + 1
    }
    p[N - 1].u.cons.cdr = free_list
    free_list = p
    free_count += N
  }
  
  void
  print_mem_info(void)
  {
    char buf[100]
  
    sprintf(buf, "%d blocks (%d bytes/block)\n", N * mcount, (int) sizeof (U))
    printstr(buf)
  
    sprintf(buf, "%d free\n", free_count)
    printstr(buf)
  
    sprintf(buf, "%d used\n", N * mcount - free_count)
    printstr(buf)
  }
   */

  Find = function(p, q) {
    var i, l1, ref2;
    i = 0;
    if (equal(p, q)) {
      return 1;
    }
    if (istensor(p)) {
      for (i = l1 = 0, ref2 = p.tensor.nelem; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
        if (Find(p.tensor.elem[i], q)) {
          return 1;
        }
      }
      return 0;
    }
    while (iscons(p)) {
      if (Find(car(p), q)) {
        return 1;
      }
      p = cdr(p);
    }
    return 0;
  };

  findPossibleClockForm = function(p) {
    var i, l1, ref2;
    i = 0;
    if (isimaginaryunit(p)) {
      return 0;
    }
    if (car(p) === symbol(POWER) && !isinteger(caddr(p1))) {
      if (Find(cadr(p), imaginaryunit)) {
        return 1;
      }
    }
    if (car(p) === symbol(POWER) && equaln(cadr(p), -1) && !isinteger(caddr(p1))) {
      return 1;
    }
    if (istensor(p)) {
      for (i = l1 = 0, ref2 = p.tensor.nelem; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
        if (findPossibleClockForm(p.tensor.elem[i])) {
          return 1;
        }
      }
      return 0;
    }
    while (iscons(p)) {
      if (findPossibleClockForm(car(p))) {
        return 1;
      }
      p = cdr(p);
    }
    return 0;
  };

  findPossibleExponentialForm = function(p) {
    var i, l1, ref2;
    i = 0;
    if (car(p) === symbol(POWER) && cadr(p) === symbol(E)) {
      return Find(caddr(p), imaginaryunit);
    }
    if (istensor(p)) {
      for (i = l1 = 0, ref2 = p.tensor.nelem; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
        if (findPossibleExponentialForm(p.tensor.elem[i])) {
          return 1;
        }
      }
      return 0;
    }
    while (iscons(p)) {
      if (findPossibleExponentialForm(car(p))) {
        return 1;
      }
      p = cdr(p);
    }
    return 0;
  };

  $.Find = Find;

  init = function() {
    var i, l1, ref2;
    i = 0;
    flag = 0;
    reset_after_error();
    chainOfUserSymbolsNotFunctionsBeingEvaluated = [];
    if (flag) {
      return;
    }
    flag = 1;
    for (i = l1 = 0, ref2 = NSYM; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      symtab[i] = new U();
      symtab[i].k = SYM;
      binding[i] = symtab[i];
      isSymbolReclaimable[i] = false;
    }
    return defn();
  };


  /* cross =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept, script_defined
  
  Parameters
  ----------
  u,v
  
  General description
  -------------------
  Returns the cross product of vectors u and v.
   */


  /* curl =====================================================================
  
  Tags
  ----
  scripting, JS, internal, treenode, general concept, script_defined
  
  Parameters
  ----------
  u
  
  General description
  -------------------
  Returns the curl of vector u.
   */

  defn_str = ["version=\"" + version + "\"", "e=exp(1)", "i=sqrt(-1)", "autoexpand=1", "assumeRealVariables=1", "trange=[-pi,pi]", "xrange=[-10,10]", "yrange=[-10,10]", "last=0", "trace=0", "forceFixedPrintout=1", "maxFixedPrintoutDigits=6", "printLeaveEAlone=1", "printLeaveXAlone=0", "cross(u,v)=[u[2]*v[3]-u[3]*v[2],u[3]*v[1]-u[1]*v[3],u[1]*v[2]-u[2]*v[1]]", "curl(v)=[d(v[3],y)-d(v[2],z),d(v[1],z)-d(v[3],x),d(v[2],x)-d(v[1],y)]", "div(v)=d(v[1],x)+d(v[2],y)+d(v[3],z)", "ln(x)=log(x)"];

  defn = function() {
    var definitionOfInterest, defn_i, l1, originalCodeGen, ref2;
    p0 = symbol(NIL);
    p1 = symbol(NIL);
    p2 = symbol(NIL);
    p3 = symbol(NIL);
    p4 = symbol(NIL);
    p5 = symbol(NIL);
    p6 = symbol(NIL);
    p7 = symbol(NIL);
    p8 = symbol(NIL);
    p9 = symbol(NIL);
    std_symbol("abs", ABS);
    std_symbol("add", ADD);
    std_symbol("adj", ADJ);
    std_symbol("and", AND);
    std_symbol("approxratio", APPROXRATIO);
    std_symbol("arccos", ARCCOS);
    std_symbol("arccosh", ARCCOSH);
    std_symbol("arcsin", ARCSIN);
    std_symbol("arcsinh", ARCSINH);
    std_symbol("arctan", ARCTAN);
    std_symbol("arctanh", ARCTANH);
    std_symbol("arg", ARG);
    std_symbol("atomize", ATOMIZE);
    std_symbol("besselj", BESSELJ);
    std_symbol("bessely", BESSELY);
    std_symbol("binding", BINDING);
    std_symbol("binomial", BINOMIAL);
    std_symbol("ceiling", CEILING);
    std_symbol("check", CHECK);
    std_symbol("choose", CHOOSE);
    std_symbol("circexp", CIRCEXP);
    std_symbol("clear", CLEAR);
    std_symbol("clearall", CLEARALL);
    std_symbol("clearpatterns", CLEARPATTERNS);
    std_symbol("clock", CLOCK);
    std_symbol("coeff", COEFF);
    std_symbol("cofactor", COFACTOR);
    std_symbol("condense", CONDENSE);
    std_symbol("conj", CONJ);
    std_symbol("contract", CONTRACT);
    std_symbol("cos", COS);
    std_symbol("cosh", COSH);
    std_symbol("decomp", DECOMP);
    std_symbol("defint", DEFINT);
    std_symbol("deg", DEGREE);
    std_symbol("denominator", DENOMINATOR);
    std_symbol("det", DET);
    std_symbol("derivative", DERIVATIVE);
    std_symbol("dim", DIM);
    std_symbol("dirac", DIRAC);
    std_symbol("divisors", DIVISORS);
    std_symbol("do", DO);
    std_symbol("dot", DOT);
    std_symbol("draw", DRAW);
    std_symbol("dsolve", DSOLVE);
    std_symbol("erf", ERF);
    std_symbol("erfc", ERFC);
    std_symbol("eigen", EIGEN);
    std_symbol("eigenval", EIGENVAL);
    std_symbol("eigenvec", EIGENVEC);
    std_symbol("eval", EVAL);
    std_symbol("exp", EXP);
    std_symbol("expand", EXPAND);
    std_symbol("expcos", EXPCOS);
    std_symbol("expsin", EXPSIN);
    std_symbol("factor", FACTOR);
    std_symbol("factorial", FACTORIAL);
    std_symbol("factorpoly", FACTORPOLY);
    std_symbol("filter", FILTER);
    std_symbol("float", FLOATF);
    std_symbol("floor", FLOOR);
    std_symbol("for", FOR);
    std_symbol("function", FUNCTION);
    std_symbol("Gamma", GAMMA);
    std_symbol("gcd", GCD);
    std_symbol("hermite", HERMITE);
    std_symbol("hilbert", HILBERT);
    std_symbol("imag", IMAG);
    std_symbol("component", INDEX);
    std_symbol("inner", INNER);
    std_symbol("integral", INTEGRAL);
    std_symbol("inv", INV);
    std_symbol("invg", INVG);
    std_symbol("isinteger", ISINTEGER);
    std_symbol("isprime", ISPRIME);
    std_symbol("laguerre", LAGUERRE);
    std_symbol("lcm", LCM);
    std_symbol("leading", LEADING);
    std_symbol("legendre", LEGENDRE);
    std_symbol("log", LOG);
    std_symbol("lookup", LOOKUP);
    std_symbol("mod", MOD);
    std_symbol("multiply", MULTIPLY);
    std_symbol("not", NOT);
    std_symbol("nroots", NROOTS);
    std_symbol("number", NUMBER);
    std_symbol("numerator", NUMERATOR);
    std_symbol("operator", OPERATOR);
    std_symbol("or", OR);
    std_symbol("outer", OUTER);
    std_symbol("pattern", PATTERN);
    std_symbol("patternsinfo", PATTERNSINFO);
    std_symbol("polar", POLAR);
    std_symbol("power", POWER);
    std_symbol("prime", PRIME);
    std_symbol("print", PRINT);
    std_symbol("print2dascii", PRINT2DASCII);
    std_symbol("printcomputer", PRINTFULL);
    std_symbol("printlatex", PRINTLATEX);
    std_symbol("printlist", PRINTLIST);
    std_symbol("printhuman", PRINTPLAIN);
    std_symbol("printLeaveEAlone", PRINT_LEAVE_E_ALONE);
    std_symbol("printLeaveXAlone", PRINT_LEAVE_X_ALONE);
    std_symbol("product", PRODUCT);
    std_symbol("quote", QUOTE);
    std_symbol("quotient", QUOTIENT);
    std_symbol("rank", RANK);
    std_symbol("rationalize", RATIONALIZE);
    std_symbol("real", REAL);
    std_symbol("rect", YYRECT);
    std_symbol("roots", ROOTS);
    std_symbol("round", ROUND);
    std_symbol("equals", SETQ);
    std_symbol("sgn", SGN);
    std_symbol("silentpattern", SILENTPATTERN);
    std_symbol("simplify", SIMPLIFY);
    std_symbol("sin", SIN);
    std_symbol("sinh", SINH);
    std_symbol("shape", SHAPE);
    std_symbol("sqrt", SQRT);
    std_symbol("stop", STOP);
    std_symbol("subst", SUBST);
    std_symbol("sum", SUM);
    std_symbol("symbolsinfo", SYMBOLSINFO);
    std_symbol("tan", TAN);
    std_symbol("tanh", TANH);
    std_symbol("taylor", TAYLOR);
    std_symbol("test", TEST);
    std_symbol("testeq", TESTEQ);
    std_symbol("testge", TESTGE);
    std_symbol("testgt", TESTGT);
    std_symbol("testle", TESTLE);
    std_symbol("testlt", TESTLT);
    std_symbol("transpose", TRANSPOSE);
    std_symbol("unit", UNIT);
    std_symbol("zero", ZERO);
    std_symbol("nil", NIL);
    std_symbol("autoexpand", AUTOEXPAND);
    std_symbol("bake", BAKE);
    std_symbol("assumeRealVariables", ASSUME_REAL_VARIABLES);
    std_symbol("last", LAST);
    std_symbol("lastprint", LAST_PRINT);
    std_symbol("last2dasciiprint", LAST_2DASCII_PRINT);
    std_symbol("lastfullprint", LAST_FULL_PRINT);
    std_symbol("lastlatexprint", LAST_LATEX_PRINT);
    std_symbol("lastlistprint", LAST_LIST_PRINT);
    std_symbol("lastplainprint", LAST_PLAIN_PRINT);
    std_symbol("trace", TRACE);
    std_symbol("forceFixedPrintout", FORCE_FIXED_PRINTOUT);
    std_symbol("maxFixedPrintoutDigits", MAX_FIXED_PRINTOUT_DIGITS);
    std_symbol("~", YYE);
    std_symbol("$DRAWX", DRAWX);
    std_symbol("$METAA", METAA);
    std_symbol("$METAB", METAB);
    std_symbol("$METAX", METAX);
    std_symbol("$SECRETX", SECRETX);
    std_symbol("version", VERSION);
    std_symbol("pi", PI);
    std_symbol("a", SYMBOL_A);
    std_symbol("b", SYMBOL_B);
    std_symbol("c", SYMBOL_C);
    std_symbol("d", SYMBOL_D);
    std_symbol("i", SYMBOL_I);
    std_symbol("j", SYMBOL_J);
    std_symbol("n", SYMBOL_N);
    std_symbol("r", SYMBOL_R);
    std_symbol("s", SYMBOL_S);
    std_symbol("t", SYMBOL_T);
    std_symbol("x", SYMBOL_X);
    std_symbol("y", SYMBOL_Y);
    std_symbol("z", SYMBOL_Z);
    std_symbol("I", SYMBOL_IDENTITY_MATRIX);
    std_symbol("a_", SYMBOL_A_UNDERSCORE);
    std_symbol("b_", SYMBOL_B_UNDERSCORE);
    std_symbol("x_", SYMBOL_X_UNDERSCORE);
    std_symbol("$C1", C1);
    std_symbol("$C2", C2);
    std_symbol("$C3", C3);
    std_symbol("$C4", C4);
    std_symbol("$C5", C5);
    std_symbol("$C6", C6);
    defineSomeHandyConstants();
    originalCodeGen = codeGen;
    codeGen = false;
    for (defn_i = l1 = 0, ref2 = defn_str.length; 0 <= ref2 ? l1 < ref2 : l1 > ref2; defn_i = 0 <= ref2 ? ++l1 : --l1) {
      definitionOfInterest = defn_str[defn_i];
      scan(definitionOfInterest);
      if (DEBUG) {
        console.log("... evaling " + definitionOfInterest);
        console.log("top of stack:");
        console.log(print_list(stack[tos - 1]));
      }
      Eval();
      pop();
    }
    return codeGen = originalCodeGen;
  };

  defineSomeHandyConstants = function() {
    push_integer(0);
    zero = pop();
    push_integer(1);
    one = pop();
    push_double(1.0);
    one_as_double = pop();
    push_symbol(POWER);
    if (DEBUG) {
      console.log(print_list(stack[tos - 1]));
    }
    push_integer(-1);
    if (DEBUG) {
      console.log(print_list(stack[tos - 1]));
    }
    push_rational(1, 2);
    if (DEBUG) {
      console.log(print_list(stack[tos - 1]));
    }
    list(3);
    if (DEBUG) {
      console.log(print_list(stack[tos - 1]));
    }
    return imaginaryunit = pop();
  };

  mcmp = function(a, b) {
    return a.compare(b);
  };

  mcmpint = function(a, n) {
    var b, t;
    b = bigInt(n);
    t = mcmp(a, b);
    return t;
  };

  strcmp = function(str1, str2) {
    if (str1 === str2) {
      return 0;
    } else if (str1 > str2) {
      return 1;
    } else {
      return -1;
    }
  };

  doubleToReasonableString = function(d) {
    var maxFixedPrintoutDigits, stringRepresentation;
    if (codeGen) {
      return "" + d;
    }
    if (isZeroAtomOrTensor(get_binding(symbol(FORCE_FIXED_PRINTOUT)))) {
      stringRepresentation = "" + d;
      if (printMode === PRINTMODE_LATEX) {
        if (/\d*\.\d*e.*/gm.test(stringRepresentation)) {
          stringRepresentation = stringRepresentation.replace(/e(.*)/gm, "\\mathrm{e}{$1}");
        } else {
          stringRepresentation = stringRepresentation.replace(/(\d+)e(.*)/gm, "$1.0\\mathrm{e}{$2}");
        }
      } else {
        if (/\d*\.\d*e.*/gm.test(stringRepresentation)) {
          stringRepresentation = stringRepresentation.replace(/e(.*)/gm, "*10^($1)");
        } else {
          stringRepresentation = stringRepresentation.replace(/(\d+)e(.*)/gm, "$1.0*10^($2)");
        }
      }
    } else {
      push(get_binding(symbol(MAX_FIXED_PRINTOUT_DIGITS)));
      maxFixedPrintoutDigits = pop_integer();
      stringRepresentation = "" + d.toFixed(maxFixedPrintoutDigits);
      stringRepresentation = stringRepresentation.replace(/(\.\d*?[1-9])0+$/gm, "$1");
      stringRepresentation = stringRepresentation.replace(/\.0+$/gm, "");
      if (stringRepresentation.indexOf(".") === -1) {
        stringRepresentation += ".0";
      }
      if (parseFloat(stringRepresentation) !== d) {
        stringRepresentation = d.toFixed(maxFixedPrintoutDigits) + "...";
      }
    }
    return stringRepresentation;
  };

  clear_term = function() {};

  isspace = function(s) {
    if (s == null) {
      return false;
    }
    return s === ' ' || s === '\t' || s === '\n' || s === '\v' || s === '\f' || s === '\r';
  };

  isdigit = function(str) {
    if (str == null) {
      return false;
    }
    return /^\d+$/.test(str);
  };

  isalpha = function(str) {
    if (str == null) {
      return false;
    }
    return str.search(/[^A-Za-z]/) === -1;
  };

  isalphaOrUnderscore = function(str) {
    if (str == null) {
      return false;
    }
    return str.search(/[^A-Za-z_]/) === -1;
  };

  isunderscore = function(str) {
    if (str == null) {
      return false;
    }
    return str.search(/_/) === -1;
  };

  isalnumorunderscore = function(str) {
    if (str == null) {
      return false;
    }
    return isalphaOrUnderscore(str) || isdigit(str);
  };

  count = function(p) {
    var n;
    if (iscons(p)) {
      n = 0;
      while (iscons(p)) {
        n += count(car(p)) + 1;
        p = cdr(p);
      }
    } else {
      n = 1;
    }
    return n;
  };

  countOccurrencesOfSymbol = function(needle, p) {
    var n;
    n = 0;
    if (iscons(p)) {
      while (iscons(p)) {
        n += countOccurrencesOfSymbol(needle, car(p));
        p = cdr(p);
      }
    } else {
      if (equal(needle, p)) {
        n = 1;
      }
    }
    return n;
  };

  countsize = function(p) {
    var i, l1, n, ref2;
    n = 0;
    if (istensor(p)) {
      for (i = l1 = 0, ref2 = p.tensor.nelem; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
        n += p.tensor.elem[i];
      }
    } else if (iscons(p)) {
      while (iscons(p)) {
        n += count(car(p)) + 1;
        p = cdr(p);
      }
    } else {
      n = 1;
    }
    return n;
  };

  stop = function(s) {
    var message;
    errorMessage += "Stop: ";
    errorMessage += s;
    message = errorMessage;
    errorMessage = '';
    moveTos(0);
    throw new Error(message);
  };

  findDependenciesInScript = function(stringToBeParsed, dontGenerateCode) {
    var allReturnedLatexStrings, allReturnedPlainStrings, bodyForReadableSummaryOfGeneratedCode, cyclesDescriptions, deQuotedDep, dependencyInfo, eachDependency, error, generatedBody, generatedCode, i, indexOfEachReplacement, indexOfPartRemainingToBeParsed, inited, key, l1, len, len1, len2, len3, len4, len5, len6, len7, m1, n, n1, newUserSymbol, o1, origPrintMode, originalUserSymbol, parameters, q1, r1, readableSummaryOfGeneratedCode, recursedDependencies, ref2, replacementsFrom, replacementsTo, s1, scriptEvaluation, stringToBeRun, t1, testableString, timeStartFromAlgebra, toBePrinted, u1, userVariablesMentioned, value, variablesWithCycles;
    if (DEBUG) {
      console.log("stringToBeParsed: " + stringToBeParsed);
    }
    timeStartFromAlgebra = new Date().getTime();
    inited = true;
    codeGen = true;
    symbolsDependencies = {};
    symbolsHavingReassignments = [];
    symbolsInExpressionsWithoutAssignments = [];
    patternHasBeenFound = false;
    indexOfPartRemainingToBeParsed = 0;
    allReturnedPlainStrings = "";
    allReturnedLatexStrings = "";
    n = 0;
    dependencyInfo = {
      affectsVariables: [],
      affectedBy: []
    };
    stringToBeRun = stringToBeParsed;
    while (1) {
      try {
        errorMessage = "";
        check_stack();
        if (DEBUG) {
          console.log("findDependenciesInScript: scanning");
        }
        n = scan(stringToBeParsed.substring(indexOfPartRemainingToBeParsed));
        if (DEBUG) {
          console.log("scanned");
        }
        pop();
        check_stack();
      } catch (error1) {
        error = error1;
        if (PRINTOUTRESULT) {
          console.log(error);
        }
        errorMessage = error + "";
        reset_after_error();
        break;
      }
      if (n === 0) {
        break;
      }
      indexOfPartRemainingToBeParsed += n;
    }
    testableString = "";
    if (DEBUG) {
      console.log("all local dependencies ----------------");
    }
    testableString += "All local dependencies: ";
    for (key in symbolsDependencies) {
      value = symbolsDependencies[key];
      if (DEBUG) {
        console.log("variable " + key + " depends on: ");
      }
      dependencyInfo.affectsVariables.push(key);
      testableString += " variable " + key + " depends on: ";
      for (l1 = 0, len = value.length; l1 < len; l1++) {
        i = value[l1];
        if (DEBUG) {
          console.log("    " + i);
        }
        if (i[0] !== "'") {
          dependencyInfo.affectedBy.push(i);
        }
        testableString += i + ", ";
      }
      testableString += "; ";
    }
    testableString += ". ";
    if (DEBUG) {
      console.log("Symbols with reassignments ----------------");
    }
    testableString += "Symbols with reassignments: ";
    for (m1 = 0, len1 = symbolsHavingReassignments.length; m1 < len1; m1++) {
      key = symbolsHavingReassignments[m1];
      if (dependencyInfo.affectedBy.indexOf(key) === -1) {
        dependencyInfo.affectedBy.push(key);
        testableString += key + ", ";
      }
    }
    testableString += ". ";
    if (DEBUG) {
      console.log("Symbols in expressions without assignments ----------------");
    }
    testableString += "Symbols in expressions without assignments: ";
    for (n1 = 0, len2 = symbolsInExpressionsWithoutAssignments.length; n1 < len2; n1++) {
      key = symbolsInExpressionsWithoutAssignments[n1];
      if (dependencyInfo.affectedBy.indexOf(key) === -1) {
        dependencyInfo.affectedBy.push(key);
        testableString += key + ", ";
      }
    }
    testableString += ". ";
    dependencyInfo.affectedBy.push("PATTERN_DEPENDENCY");
    if (patternHasBeenFound) {
      dependencyInfo.affectsVariables.push("PATTERN_DEPENDENCY");
      testableString += " - PATTERN_DEPENDENCY inserted - ";
    }
    if (DEBUG) {
      console.log("All dependencies recursively ----------------");
    }
    testableString += "All dependencies recursively: ";
    scriptEvaluation = ["", ""];
    generatedCode = "";
    readableSummaryOfGeneratedCode = "";
    if (errorMessage === "" && !dontGenerateCode) {
      try {
        allReturnedPlainStrings = "";
        allReturnedLatexStrings = "";
        scriptEvaluation = run(stringToBeParsed, true);
        allReturnedPlainStrings = "";
        allReturnedLatexStrings = "";
      } catch (error1) {
        error = error1;
        if (PRINTOUTRESULT) {
          console.log(error);
        }
        errorMessage = error + "";
        init();
      }
      if (errorMessage === "") {
        for (key in symbolsDependencies) {
          codeGen = true;
          if (DEBUG) {
            console.log("  variable " + key + " is: " + get_binding(usr_symbol(key)).toString());
          }
          codeGen = false;
          if (DEBUG) {
            console.log("  variable " + key + " depends on: ");
          }
          testableString += " variable " + key + " depends on: ";
          recursedDependencies = [];
          variablesWithCycles = [];
          cyclesDescriptions = [];
          recursiveDependencies(key, recursedDependencies, [], variablesWithCycles, [], cyclesDescriptions);
          for (o1 = 0, len3 = variablesWithCycles.length; o1 < len3; o1++) {
            i = variablesWithCycles[o1];
            if (DEBUG) {
              console.log("    --> cycle through " + i);
            }
          }
          for (q1 = 0, len4 = recursedDependencies.length; q1 < len4; q1++) {
            i = recursedDependencies[q1];
            if (DEBUG) {
              console.log("    " + i);
            }
            testableString += i + ", ";
          }
          testableString += "; ";
          for (r1 = 0, len5 = cyclesDescriptions.length; r1 < len5; r1++) {
            i = cyclesDescriptions[r1];
            testableString += " " + i + ", ";
          }
          if (DEBUG) {
            console.log("  code generation:" + key + " is: " + get_binding(usr_symbol(key)).toString());
          }
          push(get_binding(usr_symbol(key)));
          replacementsFrom = [];
          replacementsTo = [];
          for (s1 = 0, len6 = recursedDependencies.length; s1 < len6; s1++) {
            eachDependency = recursedDependencies[s1];
            if (eachDependency[0] === "'") {
              deQuotedDep = eachDependency.substring(1);
              originalUserSymbol = usr_symbol(deQuotedDep);
              newUserSymbol = usr_symbol("AVOID_BINDING_TO_EXTERNAL_SCOPE_VALUE" + deQuotedDep);
              replacementsFrom.push(originalUserSymbol);
              replacementsTo.push(newUserSymbol);
              push(originalUserSymbol);
              push(newUserSymbol);
              subst();
              if (DEBUG) {
                console.log("after substitution: " + stack[tos - 1]);
              }
            }
          }
          try {
            simplifyForCodeGeneration();
          } catch (error1) {
            error = error1;
            if (PRINTOUTRESULT) {
              console.log(error);
            }
            errorMessage = error + "";
            init();
          }
          for (indexOfEachReplacement = t1 = 0, ref2 = replacementsFrom.length; 0 <= ref2 ? t1 < ref2 : t1 > ref2; indexOfEachReplacement = 0 <= ref2 ? ++t1 : --t1) {
            push(replacementsTo[indexOfEachReplacement]);
            push(replacementsFrom[indexOfEachReplacement]);
            subst();
          }
          clearRenamedVariablesToAvoidBindingToExternalScope();
          if (errorMessage === "") {
            toBePrinted = pop();
            userVariablesMentioned = [];
            collectUserSymbols(toBePrinted, userVariablesMentioned);
            allReturnedPlainStrings = "";
            allReturnedLatexStrings = "";
            codeGen = true;
            generatedBody = toBePrinted.toString();
            codeGen = false;
            origPrintMode = printMode;
            printMode = PRINTMODE_LATEX;
            bodyForReadableSummaryOfGeneratedCode = toBePrinted.toString();
            printMode = origPrintMode;
            if (variablesWithCycles.indexOf(key) !== -1) {
              generatedCode += "// " + key + " is part of a cyclic dependency, no code generated.";
              readableSummaryOfGeneratedCode += "#" + key + " is part of a cyclic dependency, no code generated.";
            } else {

              /*
               * using this paragraph instead of the following one
               * creates methods signatures that
               * are slightly less efficient
               * i.e. variables compare even if they are
               * simplified away.
               * In theory these signatures are more stable, but
               * in practice signatures vary quite a bit anyways
               * depending on previous assignments for example,
               * so it's unclear whether going for stability
               * is sensible at all..
              if recursedDependencies.length != 0
                parameters = "("
                for i in recursedDependencies
                  if i.indexOf("'") != 0
                    parameters += i + ", "
                  else
                    if recursedDependencies.indexOf(i.substring(1)) == -1
                      parameters += i.substring(1) + ", "
               */
              userVariablesMentioned = userVariablesMentioned.filter(function(x) {
                return predefinedSymbolsInGlobalScope_doNotTrackInDependencies.indexOf(x + "") === -1;
              });
              userVariablesMentioned = userVariablesMentioned.filter(function(x) {
                return recursedDependencies.indexOf(x + "") !== -1 || recursedDependencies.indexOf("\'" + x + "") !== -1;
              });
              if (userVariablesMentioned.length !== 0) {
                parameters = "(";
                for (u1 = 0, len7 = userVariablesMentioned.length; u1 < len7; u1++) {
                  i = userVariablesMentioned[u1];
                  if (i.printname !== key) {
                    parameters += i.printname + ", ";
                  }
                }
                parameters = parameters.replace(/, $/gm, "");
                parameters += ")";
                generatedCode += key + " = function " + parameters + " { return ( " + generatedBody + " ); }";
                readableSummaryOfGeneratedCode += key + parameters + " = " + bodyForReadableSummaryOfGeneratedCode;
              } else {
                generatedCode += key + " = " + generatedBody + ";";
                readableSummaryOfGeneratedCode += key + " = " + bodyForReadableSummaryOfGeneratedCode;
              }
            }
            generatedCode += "\n";
            readableSummaryOfGeneratedCode += "\n";
            if (DEBUG) {
              console.log("    " + generatedCode);
            }
          }
        }
      }
    }
    generatedCode = generatedCode.replace(/\n$/gm, "");
    readableSummaryOfGeneratedCode = readableSummaryOfGeneratedCode.replace(/\n$/gm, "");
    symbolsDependencies = {};
    symbolsHavingReassignments = [];
    patternHasBeenFound = false;
    symbolsInExpressionsWithoutAssignments = [];
    if (DEBUG) {
      console.log("testable string: " + testableString);
    }
    if (TIMING_DEBUGS) {
      console.log("findDependenciesInScript time for: " + stringToBeRun + " : " + ((new Date().getTime()) - timeStartFromAlgebra) + "ms");
    }
    return [testableString, scriptEvaluation[0], generatedCode, readableSummaryOfGeneratedCode, scriptEvaluation[1], errorMessage, dependencyInfo];
  };

  recursiveDependencies = function(variableToBeChecked, arrayWhereDependenciesWillBeAdded, variablesAlreadyFleshedOut, variablesWithCycles, chainBeingChecked, cyclesDescriptions) {
    var cyclesDescription, i, k, l1, len, len1, m1, ref2;
    variablesAlreadyFleshedOut.push(variableToBeChecked);
    if (symbolsDependencies[chainBeingChecked[chainBeingChecked.length - 1]] != null) {
      if (symbolsDependencies[chainBeingChecked[chainBeingChecked.length - 1]].indexOf("'" + variableToBeChecked) !== -1) {
        if (DEBUG) {
          console.log("can't keep following the chain of " + variableToBeChecked + " because it's actually a variable bound to a parameter");
        }
        if (arrayWhereDependenciesWillBeAdded.indexOf("'" + variableToBeChecked) === -1 && arrayWhereDependenciesWillBeAdded.indexOf(variableToBeChecked) === -1) {
          arrayWhereDependenciesWillBeAdded.push(variableToBeChecked);
        }
        return arrayWhereDependenciesWillBeAdded;
      }
    }
    chainBeingChecked.push(variableToBeChecked);
    if (symbolsDependencies[variableToBeChecked] == null) {
      if (arrayWhereDependenciesWillBeAdded.indexOf(variableToBeChecked) === -1) {
        arrayWhereDependenciesWillBeAdded.push(variableToBeChecked);
      }
      return arrayWhereDependenciesWillBeAdded;
    } else {
      ref2 = symbolsDependencies[variableToBeChecked];
      for (l1 = 0, len = ref2.length; l1 < len; l1++) {
        i = ref2[l1];
        if (chainBeingChecked.indexOf(i) !== -1) {
          if (DEBUG) {
            console.log("  found cycle:");
          }
          cyclesDescription = "";
          for (m1 = 0, len1 = chainBeingChecked.length; m1 < len1; m1++) {
            k = chainBeingChecked[m1];
            if (variablesWithCycles.indexOf(k) === -1) {
              variablesWithCycles.push(k);
            }
            if (DEBUG) {
              console.log(k + " --> ");
            }
            cyclesDescription += k + " --> ";
          }
          if (DEBUG) {
            console.log(" ... then " + i + " again");
          }
          cyclesDescription += " ... then " + i + " again";
          cyclesDescriptions.push(cyclesDescription);
          if (variablesWithCycles.indexOf(i) === -1) {
            variablesWithCycles.push(i);
          }
        } else {
          recursiveDependencies(i, arrayWhereDependenciesWillBeAdded, variablesAlreadyFleshedOut, variablesWithCycles, chainBeingChecked, cyclesDescriptions);
          chainBeingChecked.pop();
        }
      }
      return arrayWhereDependenciesWillBeAdded;
    }
  };

  inited = false;

  latexErrorSign = "\\rlap{\\large\\color{red}\\bigtriangleup}{\\ \\ \\tiny\\color{red}!}";

  turnErrorMessageToLatex = function(theErrorMessage) {
    theErrorMessage = theErrorMessage.replace(/\n/g, "");
    theErrorMessage = theErrorMessage.replace(/_/g, "} \\_ \\text{");
    theErrorMessage = theErrorMessage.replace(new RegExp(String.fromCharCode(transpose_unicode), 'g'), "}{}^{T}\\text{");
    theErrorMessage = theErrorMessage.replace(new RegExp(String.fromCharCode(dotprod_unicode), 'g'), "}\\cdot \\text{");
    theErrorMessage = theErrorMessage.replace("Stop:", "}  \\quad \\text{Stop:");
    theErrorMessage = theErrorMessage.replace("->", "}  \\rightarrow \\text{");
    theErrorMessage = theErrorMessage.replace("?", "}\\enspace " + latexErrorSign + " \\enspace  \\text{");
    theErrorMessage = "$$\\text{" + theErrorMessage.replace(/\n/g, "") + "}$$";
    return theErrorMessage;
  };

  normaliseDots = function(stringToNormalise) {
    stringToNormalise = stringToNormalise.replace(new RegExp(String.fromCharCode(8901), 'g'), String.fromCharCode(dotprod_unicode));
    stringToNormalise = stringToNormalise.replace(new RegExp(String.fromCharCode(8226), 'g'), String.fromCharCode(dotprod_unicode));
    stringToNormalise = stringToNormalise.replace(new RegExp(String.fromCharCode(12539), 'g'), String.fromCharCode(dotprod_unicode));
    stringToNormalise = stringToNormalise.replace(new RegExp(String.fromCharCode(55296), 'g'), String.fromCharCode(dotprod_unicode));
    stringToNormalise = stringToNormalise.replace(new RegExp(String.fromCharCode(65381), 'g'), String.fromCharCode(dotprod_unicode));
    return stringToNormalise;
  };

  TIMING_DEBUGS = false;

  run = function(stringToBeRun, generateLatex) {
    var allReturnedLatexStrings, allReturnedPlainStrings, collectedLatexResult, collectedPlainResult, error, errorWhileExecution, i, indexOfPartRemainingToBeParsed, n, stringToBeReturned, theErrorMessage, timeStart, timingDebugWrite;
    if (generateLatex == null) {
      generateLatex = false;
    }
    timeStart = new Date().getTime();
    stringToBeRun = normaliseDots(stringToBeRun);
    if (stringToBeRun === "selftest") {
      selftest();
      return;
    }
    if (!inited) {
      inited = true;
      init();
    }
    i = 0;
    n = 0;
    indexOfPartRemainingToBeParsed = 0;
    allReturnedPlainStrings = "";
    allReturnedLatexStrings = "";
    while (1) {
      try {
        errorMessage = "";
        check_stack();
        n = scan(stringToBeRun.substring(indexOfPartRemainingToBeParsed));
        p1 = pop();
        check_stack();
      } catch (error1) {
        error = error1;
        if (PRINTOUTRESULT) {
          console.log(error);
        }
        allReturnedPlainStrings += error.message;
        if (generateLatex) {
          theErrorMessage = turnErrorMessageToLatex(error.message);
          allReturnedLatexStrings += theErrorMessage;
        }
        reset_after_error();
        break;
      }
      if (n === 0) {
        break;
      }
      indexOfPartRemainingToBeParsed += n;
      push(p1);
      errorWhileExecution = false;
      try {
        stringsEmittedByUserPrintouts = "";
        top_level_eval();
        p2 = pop();
        check_stack();
        if (isstr(p2)) {
          if (DEBUG) {
            console.log(p2.str);
          }
          if (DEBUG) {
            console.log("\n");
          }
        }
        if (p2 === symbol(NIL)) {
          collectedPlainResult = stringsEmittedByUserPrintouts;
          if (generateLatex) {
            collectedLatexResult = "$$" + stringsEmittedByUserPrintouts + "$$";
          }
        } else {
          collectedPlainResult = print_expr(p2);
          collectedPlainResult += "\n";
          if (generateLatex) {
            collectedLatexResult = "$$" + collectLatexStringFromReturnValue(p2) + "$$";
            if (DEBUG) {
              console.log("collectedLatexResult: " + collectedLatexResult);
            }
          }
        }
        allReturnedPlainStrings += collectedPlainResult;
        if (generateLatex) {
          allReturnedLatexStrings += collectedLatexResult;
        }
        if (PRINTOUTRESULT) {
          if (DEBUG) {
            console.log("printline");
          }
          if (DEBUG) {
            console.log(collectedPlainResult);
          }
        }
        if (PRINTOUTRESULT) {
          if (DEBUG) {
            console.log("display:");
          }
          print2dascii(p2);
        }
        if (generateLatex) {
          allReturnedLatexStrings += "\n";
        }
      } catch (error1) {
        error = error1;
        errorWhileExecution = true;
        collectedPlainResult = error.message;
        if (generateLatex) {
          collectedLatexResult = turnErrorMessageToLatex(error.message);
        }
        if (PRINTOUTRESULT) {
          console.log(collectedPlainResult);
        }
        allReturnedPlainStrings += collectedPlainResult;
        if (collectedPlainResult !== "") {
          allReturnedPlainStrings += "\n";
        }
        if (generateLatex) {
          allReturnedLatexStrings += collectedLatexResult;
          allReturnedLatexStrings += "\n";
        }
        init();
      }
    }
    if (allReturnedPlainStrings[allReturnedPlainStrings.length - 1] === "\n") {
      allReturnedPlainStrings = allReturnedPlainStrings.substring(0, allReturnedPlainStrings.length - 1);
    }
    if (generateLatex) {
      if (allReturnedLatexStrings[allReturnedLatexStrings.length - 1] === "\n") {
        allReturnedLatexStrings = allReturnedLatexStrings.substring(0, allReturnedLatexStrings.length - 1);
      }
    }
    if (generateLatex) {
      if (DEBUG) {
        console.log("allReturnedLatexStrings: " + allReturnedLatexStrings);
      }
      stringToBeReturned = [allReturnedPlainStrings, allReturnedLatexStrings];
    } else {
      stringToBeReturned = allReturnedPlainStrings;
    }
    if (TIMING_DEBUGS) {
      timingDebugWrite = "run time on: " + stringToBeRun + " : " + (new Date().getTime() - timeStart) + "ms";
      console.log(timingDebugWrite);
    }
    allReturnedPlainStrings = "";
    allReturnedLatexStrings = "";
    return stringToBeReturned;
  };

  check_stack = function() {
    if (tos !== 0) {
      debugger;
      stop("stack error");
    }
    if (frame !== TOS) {
      debugger;
      stop("frame error");
    }
    if (chainOfUserSymbolsNotFunctionsBeingEvaluated.length !== 0) {
      debugger;
      stop("symbols evaluation still ongoing?");
    }
    if (evaluatingAsFloats !== 0) {
      debugger;
      stop("numeric evaluation still ongoing?");
    }
    if (evaluatingPolar !== 0) {
      debugger;
      return stop("evaluation of polar still ongoing?");
    }
  };

  top_level_eval = function() {
    var evalledArgument, originalArgument, shouldAutoexpand;
    if (DEBUG) {
      console.log("#### top level eval");
    }
    trigmode = 0;
    shouldAutoexpand = symbol(AUTOEXPAND);
    if (isZeroAtomOrTensor(get_binding(shouldAutoexpand))) {
      expanding = 0;
    } else {
      expanding = 1;
    }
    originalArgument = top();
    Eval();
    evalledArgument = top();
    if (evalledArgument === symbol(NIL)) {
      return;
    }
    set_binding(symbol(LAST), evalledArgument);
    if (!isZeroAtomOrTensor(get_binding(symbol(BAKE)))) {
      bake();
      evalledArgument = top();
    }
    if ((originalArgument === symbol(SYMBOL_I) || originalArgument === symbol(SYMBOL_J)) && isimaginaryunit(evalledArgument)) {

    } else if (isimaginaryunit(get_binding(symbol(SYMBOL_J)))) {
      push(imaginaryunit);
      push_symbol(SYMBOL_J);
      return subst();
    } else if (isimaginaryunit(get_binding(symbol(SYMBOL_I)))) {
      push(imaginaryunit);
      push_symbol(SYMBOL_I);
      return subst();
    }
  };

  check_esc_flag = function() {
    if (esc_flag) {
      return stop("esc key");
    }
  };

  clearAlgebraEnvironment = function() {
    return do_clearall();
  };

  computeDependenciesFromAlgebra = function(codeFromAlgebraBlock) {
    var i, keepState, l1, len, len1, m1, originalcodeFromAlgebraBlock, userSimplificationsInProgramForm;
    if (DEBUG) {
      console.log("computeDependenciesFromAlgebra!!!");
    }
    originalcodeFromAlgebraBlock = codeFromAlgebraBlock;
    keepState = true;
    called_from_Algebra_block = true;
    codeFromAlgebraBlock = normaliseDots(codeFromAlgebraBlock);
    if (!keepState) {
      userSimplificationsInListForm = [];
      userSimplificationsInProgramForm = "";
      for (l1 = 0, len = userSimplificationsInListForm.length; l1 < len; l1++) {
        i = userSimplificationsInListForm[l1];
        userSimplificationsInProgramForm += "silentpattern(" + car(i) + "," + car(cdr(i)) + "," + car(cdr(cdr(i))) + ")\n";
      }
      do_clearall();
      codeFromAlgebraBlock = userSimplificationsInProgramForm + codeFromAlgebraBlock;
      if (DEBUG) {
        console.log("codeFromAlgebraBlock including patterns: " + codeFromAlgebraBlock);
      }
    }
    if (DEBUG) {
      console.log("computeDependenciesFromAlgebra: patterns in the list --------------- ");
      for (m1 = 0, len1 = userSimplificationsInListForm.length; m1 < len1; m1++) {
        i = userSimplificationsInListForm[m1];
        console.log(car(i) + "," + cdr(i) + ")");
      }
      console.log("...end of list --------------- ");
    }
    called_from_Algebra_block = false;
    return findDependenciesInScript(codeFromAlgebraBlock, true)[6];
  };

  computeResultsAndJavaScriptFromAlgebra = function(codeFromAlgebraBlock) {
    var code, dependencyInfo, i, keepState, l1, latexResult, len, len1, m1, originalcodeFromAlgebraBlock, readableSummaryOfCode, ref2, result, stringToBeRun, testableStringIsIgnoredHere, timeStartFromAlgebra, userSimplificationsInProgramForm;
    originalcodeFromAlgebraBlock = codeFromAlgebraBlock;
    keepState = true;
    called_from_Algebra_block = true;
    timeStartFromAlgebra = new Date().getTime();
    if (TIMING_DEBUGS) {
      console.log(" --------- computeResultsAndJavaScriptFromAlgebra input: " + codeFromAlgebraBlock + " at: " + (new Date()));
    }
    codeFromAlgebraBlock = normaliseDots(codeFromAlgebraBlock);
    stringToBeRun = codeFromAlgebraBlock;
    if (DEBUG) {
      console.log("computeResultsAndJavaScriptFromAlgebra: patterns in the list --------------- ");
      for (l1 = 0, len = userSimplificationsInListForm.length; l1 < len; l1++) {
        i = userSimplificationsInListForm[l1];
        console.log(car(i) + "," + cdr(i) + ")");
      }
      console.log("...end of list --------------- ");
    }
    if (!keepState) {
      userSimplificationsInListForm = [];
      userSimplificationsInProgramForm = "";
      for (m1 = 0, len1 = userSimplificationsInListForm.length; m1 < len1; m1++) {
        i = userSimplificationsInListForm[m1];
        userSimplificationsInProgramForm += "silentpattern(" + car(i) + "," + car(cdr(i)) + "," + car(cdr(cdr(i))) + ")\n";
      }
      do_clearall();
      codeFromAlgebraBlock = userSimplificationsInProgramForm + codeFromAlgebraBlock;
      if (DEBUG) {
        console.log("codeFromAlgebraBlock including patterns: " + codeFromAlgebraBlock);
      }
    }
    ref2 = findDependenciesInScript(codeFromAlgebraBlock), testableStringIsIgnoredHere = ref2[0], result = ref2[1], code = ref2[2], readableSummaryOfCode = ref2[3], latexResult = ref2[4], errorMessage = ref2[5], dependencyInfo = ref2[6];
    called_from_Algebra_block = false;
    if (readableSummaryOfCode !== "" || errorMessage !== "") {
      result += "\n" + readableSummaryOfCode;
      if (errorMessage !== "") {
        result += "\n" + errorMessage;
      }
      result = result.replace(/\n/g, "\n\n");
      latexResult += "\n" + "$$" + readableSummaryOfCode + "$$";
      if (errorMessage !== "") {
        latexResult += turnErrorMessageToLatex(errorMessage);
      }
      latexResult = latexResult.replace(/\n/g, "\n\n");
    }
    latexResult = latexResult.replace(/\n*/, "");
    latexResult = latexResult.replace(/\$\$\$\$\n*/g, "");
    code = code.replace(/Math\./g, "");
    code = code.replace(/\n/g, "\n\n");
    if (TIMING_DEBUGS) {
      console.log("computeResultsAndJavaScriptFromAlgebra time (total time from notebook and back) for: " + stringToBeRun + " : " + ((new Date().getTime()) - timeStartFromAlgebra) + "ms");
    }
    return {
      code: code,
      result: latexResult,
      latexResult: latexResult,
      dependencyInfo: dependencyInfo
    };
  };

  (typeof exports !== "undefined" && exports !== null ? exports : this).run = run;

  (typeof exports !== "undefined" && exports !== null ? exports : this).findDependenciesInScript = findDependenciesInScript;

  (typeof exports !== "undefined" && exports !== null ? exports : this).computeDependenciesFromAlgebra = computeDependenciesFromAlgebra;

  (typeof exports !== "undefined" && exports !== null ? exports : this).computeResultsAndJavaScriptFromAlgebra = computeResultsAndJavaScriptFromAlgebra;

  (typeof exports !== "undefined" && exports !== null ? exports : this).clearAlgebraEnvironment = clearAlgebraEnvironment;

  tos = 0;

  nil_symbols = 0;

  push = function(p) {
    if (p == null) {
      debugger;
    }
    if (p.isZero != null) {
      debugger;
    }
    if (p === symbol(NIL)) {
      nil_symbols++;
      if (DEBUG) {
        console.log("pushing symbol(NIL) #" + nil_symbols);
      }
    }
    if (tos >= frame) {
      stop("stack overflow");
    }
    return stack[tos++] = p;
  };

  moveTos = function(stackPos) {
    if (tos <= stackPos) {
      tos = stackPos;
      return;
    }
    while (tos > stackPos) {
      stack[tos] = null;
      tos--;
    }
  };

  top = function() {
    return stack[tos - 1];
  };

  pop = function() {
    var elementToBeReturned;
    if (tos === 0) {
      debugger;
      stop("stack underflow");
    }
    if (stack[tos - 1] == null) {
      debugger;
    }
    elementToBeReturned = stack[--tos];
    stack[tos] = null;
    return elementToBeReturned;
  };

  push_frame = function(n) {
    var i, l1, ref2, results;
    i = 0;
    frame -= n;
    if (frame < tos) {
      debugger;
      stop("frame overflow, circular reference?");
    }
    results = [];
    for (i = l1 = 0, ref2 = n; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      results.push(stack[frame + i] = symbol(NIL));
    }
    return results;
  };

  pop_frame = function(n) {
    frame += n;
    if (frame > TOS) {
      return stop("frame underflow");
    }
  };

  save = function() {
    frame -= 10;
    if (frame < tos) {
      debugger;
      stop("frame overflow, circular reference?");
    }
    stack[frame + 0] = p0;
    stack[frame + 1] = p1;
    stack[frame + 2] = p2;
    stack[frame + 3] = p3;
    stack[frame + 4] = p4;
    stack[frame + 5] = p5;
    stack[frame + 6] = p6;
    stack[frame + 7] = p7;
    stack[frame + 8] = p8;
    return stack[frame + 9] = p9;
  };

  restore = function() {
    if (frame > TOS - 10) {
      stop("frame underflow");
    }
    p0 = stack[frame + 0];
    p1 = stack[frame + 1];
    p2 = stack[frame + 2];
    p3 = stack[frame + 3];
    p4 = stack[frame + 4];
    p5 = stack[frame + 5];
    p6 = stack[frame + 6];
    p7 = stack[frame + 7];
    p8 = stack[frame + 8];
    p9 = stack[frame + 9];
    return frame += 10;
  };

  swap = function() {
    var p, q;
    p = pop();
    q = pop();
    push(p);
    return push(q);
  };

  dupl = function() {
    var p;
    p = pop();
    push(p);
    return push(p);
  };

  $.dupl = dupl;

  $.swap = swap;

  $.restore = restore;

  $.save = save;

  $.push = push;

  $.pop = pop;

  Eval_symbolsinfo = function() {
    var symbolsinfoToBePrinted;
    symbolsinfoToBePrinted = symbolsinfo();
    if (symbolsinfoToBePrinted !== "") {
      return new_string(symbolsinfoToBePrinted);
    } else {
      return push_symbol(NIL);
    }
  };

  symbolsinfo = function() {
    var bindingi, i, l1, ref2, ref3, symbolsinfoToBePrinted, symtabi;
    symbolsinfoToBePrinted = "";
    for (i = l1 = ref2 = NIL + 1, ref3 = symtab.length; ref2 <= ref3 ? l1 < ref3 : l1 > ref3; i = ref2 <= ref3 ? ++l1 : --l1) {
      if (symtab[i].printname === "") {
        if (isSymbolReclaimable[i] === false) {
          break;
        } else {
          continue;
        }
      }
      symtabi = symtab[i] + "";
      bindingi = (binding[i] + "").substring(0, 4);
      symbolsinfoToBePrinted += "symbol: " + symtabi + " size: " + countsize(binding[i]) + " value: " + bindingi + "...\n";
    }
    return symbolsinfoToBePrinted;
  };

  std_symbol = function(s, n, latexPrint) {
    var p;
    p = symtab[n];
    if (p == null) {
      debugger;
    }
    p.printname = s;
    if (latexPrint != null) {
      return p.latexPrint = latexPrint;
    } else {
      return p.latexPrint = s;
    }
  };

  usr_symbol = function(s) {
    var i, l1, ref2;
    i = 0;
    for (i = l1 = 0, ref2 = NSYM; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      if (s === symtab[i].printname) {
        return symtab[i];
      }
      if (symtab[i].printname === "") {
        break;
      }
    }
    if (i === NSYM) {
      stop("symbol table overflow");
    }
    symtab[i] = new U();
    symtab[i].k = SYM;
    symtab[i].printname = s;
    binding[i] = symtab[i];
    isSymbolReclaimable[i] = false;
    return symtab[i];
  };

  get_printname = function(p) {
    if (p.k !== SYM) {
      stop("symbol error");
    }
    return p.printname;
  };

  set_binding = function(p, q) {
    var indexFound;
    if (p.k !== SYM) {
      stop("symbol error");
    }
    indexFound = symtab.indexOf(p);

    /*
    if indexFound == -1
      debugger
      for i in [0...symtab.length]
        if p.printname == symtab[i].printname
          indexFound = i
          console.log "remedied an index not found!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
          break
     */
    if (symtab.indexOf(p, indexFound + 1) !== -1) {
      console.log("ops, more than one element!");
      debugger;
    }
    if (DEBUG) {
      console.log("lookup >> set_binding lookup " + indexFound);
    }
    isSymbolReclaimable[indexFound] = false;
    return binding[indexFound] = q;
  };

  get_binding = function(p) {
    var indexFound;
    if (p.k !== SYM) {
      stop("symbol error");
    }
    indexFound = symtab.indexOf(p);

    /*
    if indexFound == -1
      debugger
      for i in [0...symtab.length]
        if p.printname == symtab[i].printname
          indexFound = i
          console.log "remedied an index not found!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
          break
     */
    if (symtab.indexOf(p, indexFound + 1) !== -1) {
      console.log("ops, more than one element!");
      debugger;
    }
    if (DEBUG) {
      console.log("lookup >> get_binding lookup " + indexFound);
    }
    return binding[indexFound];
  };

  is_usr_symbol = function(p) {
    var theSymnum;
    if (p.k !== SYM) {
      return false;
    }
    theSymnum = symnum(p);
    if (theSymnum > PI && theSymnum !== SYMBOL_I && theSymnum !== SYMBOL_IDENTITY_MATRIX) {
      return true;
    }
    return false;
  };

  lookupsTotal = 0;

  symnum = function(p) {
    var indexFound;
    lookupsTotal++;
    if (p.k !== SYM) {
      stop("symbol error");
    }
    indexFound = symtab.indexOf(p);
    if (symtab.indexOf(p, indexFound + 1) !== -1) {
      console.log("ops, more than one element!");
      debugger;
    }
    if (DEBUG) {
      console.log("lookup >> symnum lookup " + indexFound + " lookup # " + lookupsTotal);
    }
    return indexFound;
  };

  push_symbol = function(k) {
    return push(symtab[k]);
  };

  clear_symbols = function() {
    var i, l1, ref2, ref3, results;
    results = [];
    for (i = l1 = ref2 = NIL + 1, ref3 = NSYM; ref2 <= ref3 ? l1 < ref3 : l1 > ref3; i = ref2 <= ref3 ? ++l1 : --l1) {
      if (symtab[i].printname === "") {
        if (isSymbolReclaimable[i] === false) {
          break;
        } else {
          continue;
        }
      }
      symtab[i] = new U();
      symtab[i].k = SYM;
      binding[i] = symtab[i];
      results.push(isSymbolReclaimable[i] = false);
    }
    return results;
  };

  collectUserSymbols = function(p, accumulator) {
    var i, l1, ref2;
    if (accumulator == null) {
      accumulator = [];
    }
    if (is_usr_symbol(p)) {
      if (accumulator.indexOf(p) === -1) {
        accumulator.push(p);
        return;
      }
    }
    if (istensor(p)) {
      for (i = l1 = 0, ref2 = p.tensor.nelem; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
        collectUserSymbols(p.tensor.elem[i], accumulator);
      }
      return;
    }
    while (iscons(p)) {
      collectUserSymbols(car(p), accumulator);
      p = cdr(p);
    }
  };

  $.get_binding = get_binding;

  $.set_binding = set_binding;

  $.usr_symbol = usr_symbol;

  $.symbolsinfo = symbolsinfo;

  $.collectUserSymbols = collectUserSymbols;

  if (!inited) {
    inited = true;
    init();
  }

  $.init = init;

  parse_internal = function(argu) {
    if (typeof argu === 'string') {
      return scan(argu);
    } else if (typeof argu === 'number') {
      if (argu % 1 === 0) {
        return push_integer(argu);
      } else {
        return push_double(argu);
      }
    } else if (argu instanceof U) {
      return push(argu);
    } else {
      console.warn('unknown argument type', argu);
      return push(symbol(NIL));
    }
  };

  parse = function(argu) {
    var data, error;
    try {
      parse_internal(argu);
      data = pop();
      check_stack();
    } catch (error1) {
      error = error1;
      reset_after_error();
      throw error;
    }
    return data;
  };

  exec = function() {
    var argu, argus, error, fn, l1, len, name, result;
    name = arguments[0], argus = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    fn = get_binding(usr_symbol(name));
    check_stack();
    push(fn);
    for (l1 = 0, len = argus.length; l1 < len; l1++) {
      argu = argus[l1];
      parse_internal(argu);
    }
    list(1 + argus.length);
    p1 = pop();
    push(p1);
    try {
      top_level_eval();
      result = pop();
      check_stack();
    } catch (error1) {
      error = error1;
      reset_after_error();
      throw error;
    }
    return result;
  };

  $.exec = exec;

  $.parse = parse;

  (function() {
    var builtin_fns, fn, l1, len, results;
    builtin_fns = ["abs", "add", "adj", "and", "approxratio", "arccos", "arccosh", "arcsin", "arcsinh", "arctan", "arctanh", "arg", "atomize", "besselj", "bessely", "binding", "binomial", "ceiling", "check", "choose", "circexp", "clear", "clearall", "clearpatterns", "clock", "coeff", "cofactor", "condense", "conj", "contract", "cos", "cosh", "decomp", "defint", "deg", "denominator", "det", "derivative", "dim", "dirac", "divisors", "do", "dot", "draw", "dsolve", "eigen", "eigenval", "eigenvec", "erf", "erfc", "eval", "exp", "expand", "expcos", "expsin", "factor", "factorial", "factorpoly", "filter", "float", "floor", "for", "Gamma", "gcd", "hermite", "hilbert", "imag", "component", "inner", "integral", "inv", "invg", "isinteger", "isprime", "laguerre", "lcm", "leading", "legendre", "log", "mod", "multiply", "not", "nroots", "number", "numerator", "operator", "or", "outer", "pattern", "patternsinfo", "polar", "power", "prime", "print", "print2dascii", "printcomputer", "printlatex", "printlist", "printhuman", "product", "quote", "quotient", "rank", "rationalize", "real", "rect", "roots", "round", "equals", "shape", "sgn", "silentpattern", "simplify", "sin", "sinh", "sqrt", "stop", "subst", "sum", "symbolsinfo", "tan", "tanh", "taylor", "test", "testeq", "testge", "testgt", "testle", "testlt", "transpose", "unit", "zero"];
    results = [];
    for (l1 = 0, len = builtin_fns.length; l1 < len; l1++) {
      fn = builtin_fns[l1];
      results.push($[fn] = exec.bind(this, fn));
    }
    return results;
  })();

  freeze = function() {
    var frozenContents, frozenHash, frozenPatterns, frozenSymbols, i, l1, ref2;
    frozenSymbols = [];
    frozenContents = [];
    frozenPatterns = [];
    frozenHash = "";
    for (i = l1 = 0, ref2 = symtab.length; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      if (isSymbolReclaimable[i] === false) {
        frozenSymbols.push(symtab[i]);
        frozenContents.push(binding[i]);
      }
    }
    frozenPatterns = userSimplificationsInListForm.slice(0);
    return [frozenSymbols, frozenContents, frozenPatterns, zero, one, imaginaryunit, getStateHash()];
  };

  unfreeze = function(frozen) {
    var frozenContents, frozenPatterns, frozenSymbols, i, l1, ref2;
    frozenSymbols = frozen[0], frozenContents = frozen[1], frozenPatterns = frozen[2], zero = frozen[3], one = frozen[4], imaginaryunit = frozen[5];
    for (i = l1 = 0, ref2 = frozenSymbols.length; 0 <= ref2 ? l1 < ref2 : l1 > ref2; i = 0 <= ref2 ? ++l1 : --l1) {
      symtab[i] = frozenSymbols[i];
      binding[i] = frozenContents[i];
    }
    return userSimplificationsInListForm = frozenPatterns.slice(0);
  };

  compareState = function(previousHash) {
    var frozenHash;
    frozenHash = getStateHash();
    if (frozenHash === previousHash) {
      return true;
    } else {
      return false;
    }
  };

  getStateHash = function() {
    var bindingi, frozenHash, i, l1, len, m1, ref2, ref3, symtabi;
    frozenHash = "";
    for (i = l1 = ref2 = NIL + 1, ref3 = symtab.length; ref2 <= ref3 ? l1 < ref3 : l1 > ref3; i = ref2 <= ref3 ? ++l1 : --l1) {
      if (symtab[i].printname === "") {
        if (isSymbolReclaimable[i] === false) {
          break;
        } else {
          continue;
        }
      }
      symtabi = print_list(symtab[i]);
      bindingi = print_list(binding[i]);
      frozenHash += " //" + symtabi + " : " + bindingi;
    }
    for (m1 = 0, len = userSimplificationsInListForm.length; m1 < len; m1++) {
      i = userSimplificationsInListForm[m1];
      frozenHash += " pattern: " + i;
    }
    if (DEBUG) {
      console.log("frozenHash: " + frozenHash);
    }
    return frozenHash;
  };

}).call(this);

},{"big-integer":3}],3:[function(require,module,exports){
var bigInt = (function (undefined) {
    "use strict";

    var BASE = 1e7,
        LOG_BASE = 7,
        MAX_INT = 9007199254740992,
        MAX_INT_ARR = smallToArray(MAX_INT),
        DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

    var supportsNativeBigInt = typeof BigInt === "function";

    function Integer(v, radix, alphabet, caseSensitive) {
        if (typeof v === "undefined") return Integer[0];
        if (typeof radix !== "undefined") return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
        return parseValue(v);
    }

    function BigInteger(value, sign) {
        this.value = value;
        this.sign = sign;
        this.isSmall = false;
    }
    BigInteger.prototype = Object.create(Integer.prototype);

    function SmallInteger(value) {
        this.value = value;
        this.sign = value < 0;
        this.isSmall = true;
    }
    SmallInteger.prototype = Object.create(Integer.prototype);

    function NativeBigInt(value) {
        this.value = value;
    }
    NativeBigInt.prototype = Object.create(Integer.prototype);

    function isPrecise(n) {
        return -MAX_INT < n && n < MAX_INT;
    }

    function smallToArray(n) { // For performance reasons doesn't reference BASE, need to change this function if BASE changes
        if (n < 1e7)
            return [n];
        if (n < 1e14)
            return [n % 1e7, Math.floor(n / 1e7)];
        return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
    }

    function arrayToSmall(arr) { // If BASE changes this function may need to change
        trim(arr);
        var length = arr.length;
        if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
            switch (length) {
                case 0: return 0;
                case 1: return arr[0];
                case 2: return arr[0] + arr[1] * BASE;
                default: return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
            }
        }
        return arr;
    }

    function trim(v) {
        var i = v.length;
        while (v[--i] === 0);
        v.length = i + 1;
    }

    function createArray(length) { // function shamelessly stolen from Yaffle's library https://github.com/Yaffle/BigInteger
        var x = new Array(length);
        var i = -1;
        while (++i < length) {
            x[i] = 0;
        }
        return x;
    }

    function truncate(n) {
        if (n > 0) return Math.floor(n);
        return Math.ceil(n);
    }

    function add(a, b) { // assumes a and b are arrays with a.length >= b.length
        var l_a = a.length,
            l_b = b.length,
            r = new Array(l_a),
            carry = 0,
            base = BASE,
            sum, i;
        for (i = 0; i < l_b; i++) {
            sum = a[i] + b[i] + carry;
            carry = sum >= base ? 1 : 0;
            r[i] = sum - carry * base;
        }
        while (i < l_a) {
            sum = a[i] + carry;
            carry = sum === base ? 1 : 0;
            r[i++] = sum - carry * base;
        }
        if (carry > 0) r.push(carry);
        return r;
    }

    function addAny(a, b) {
        if (a.length >= b.length) return add(a, b);
        return add(b, a);
    }

    function addSmall(a, carry) { // assumes a is array, carry is number with 0 <= carry < MAX_INT
        var l = a.length,
            r = new Array(l),
            base = BASE,
            sum, i;
        for (i = 0; i < l; i++) {
            sum = a[i] - base + carry;
            carry = Math.floor(sum / base);
            r[i] = sum - carry * base;
            carry += 1;
        }
        while (carry > 0) {
            r[i++] = carry % base;
            carry = Math.floor(carry / base);
        }
        return r;
    }

    BigInteger.prototype.add = function (v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
            return this.subtract(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall) {
            return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
        }
        return new BigInteger(addAny(a, b), this.sign);
    };
    BigInteger.prototype.plus = BigInteger.prototype.add;

    SmallInteger.prototype.add = function (v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
            return this.subtract(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
            if (isPrecise(a + b)) return new SmallInteger(a + b);
            b = smallToArray(Math.abs(b));
        }
        return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
    };
    SmallInteger.prototype.plus = SmallInteger.prototype.add;

    NativeBigInt.prototype.add = function (v) {
        return new NativeBigInt(this.value + parseValue(v).value);
    }
    NativeBigInt.prototype.plus = NativeBigInt.prototype.add;

    function subtract(a, b) { // assumes a and b are arrays with a >= b
        var a_l = a.length,
            b_l = b.length,
            r = new Array(a_l),
            borrow = 0,
            base = BASE,
            i, difference;
        for (i = 0; i < b_l; i++) {
            difference = a[i] - borrow - b[i];
            if (difference < 0) {
                difference += base;
                borrow = 1;
            } else borrow = 0;
            r[i] = difference;
        }
        for (i = b_l; i < a_l; i++) {
            difference = a[i] - borrow;
            if (difference < 0) difference += base;
            else {
                r[i++] = difference;
                break;
            }
            r[i] = difference;
        }
        for (; i < a_l; i++) {
            r[i] = a[i];
        }
        trim(r);
        return r;
    }

    function subtractAny(a, b, sign) {
        var value;
        if (compareAbs(a, b) >= 0) {
            value = subtract(a, b);
        } else {
            value = subtract(b, a);
            sign = !sign;
        }
        value = arrayToSmall(value);
        if (typeof value === "number") {
            if (sign) value = -value;
            return new SmallInteger(value);
        }
        return new BigInteger(value, sign);
    }

    function subtractSmall(a, b, sign) { // assumes a is array, b is number with 0 <= b < MAX_INT
        var l = a.length,
            r = new Array(l),
            carry = -b,
            base = BASE,
            i, difference;
        for (i = 0; i < l; i++) {
            difference = a[i] + carry;
            carry = Math.floor(difference / base);
            difference %= base;
            r[i] = difference < 0 ? difference + base : difference;
        }
        r = arrayToSmall(r);
        if (typeof r === "number") {
            if (sign) r = -r;
            return new SmallInteger(r);
        } return new BigInteger(r, sign);
    }

    BigInteger.prototype.subtract = function (v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
            return this.add(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall)
            return subtractSmall(a, Math.abs(b), this.sign);
        return subtractAny(a, b, this.sign);
    };
    BigInteger.prototype.minus = BigInteger.prototype.subtract;

    SmallInteger.prototype.subtract = function (v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
            return this.add(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
            return new SmallInteger(a - b);
        }
        return subtractSmall(b, Math.abs(a), a >= 0);
    };
    SmallInteger.prototype.minus = SmallInteger.prototype.subtract;

    NativeBigInt.prototype.subtract = function (v) {
        return new NativeBigInt(this.value - parseValue(v).value);
    }
    NativeBigInt.prototype.minus = NativeBigInt.prototype.subtract;

    BigInteger.prototype.negate = function () {
        return new BigInteger(this.value, !this.sign);
    };
    SmallInteger.prototype.negate = function () {
        var sign = this.sign;
        var small = new SmallInteger(-this.value);
        small.sign = !sign;
        return small;
    };
    NativeBigInt.prototype.negate = function () {
        return new NativeBigInt(-this.value);
    }

    BigInteger.prototype.abs = function () {
        return new BigInteger(this.value, false);
    };
    SmallInteger.prototype.abs = function () {
        return new SmallInteger(Math.abs(this.value));
    };
    NativeBigInt.prototype.abs = function () {
        return new NativeBigInt(this.value >= 0 ? this.value : -this.value);
    }


    function multiplyLong(a, b) {
        var a_l = a.length,
            b_l = b.length,
            l = a_l + b_l,
            r = createArray(l),
            base = BASE,
            product, carry, i, a_i, b_j;
        for (i = 0; i < a_l; ++i) {
            a_i = a[i];
            for (var j = 0; j < b_l; ++j) {
                b_j = b[j];
                product = a_i * b_j + r[i + j];
                carry = Math.floor(product / base);
                r[i + j] = product - carry * base;
                r[i + j + 1] += carry;
            }
        }
        trim(r);
        return r;
    }

    function multiplySmall(a, b) { // assumes a is array, b is number with |b| < BASE
        var l = a.length,
            r = new Array(l),
            base = BASE,
            carry = 0,
            product, i;
        for (i = 0; i < l; i++) {
            product = a[i] * b + carry;
            carry = Math.floor(product / base);
            r[i] = product - carry * base;
        }
        while (carry > 0) {
            r[i++] = carry % base;
            carry = Math.floor(carry / base);
        }
        return r;
    }

    function shiftLeft(x, n) {
        var r = [];
        while (n-- > 0) r.push(0);
        return r.concat(x);
    }

    function multiplyKaratsuba(x, y) {
        var n = Math.max(x.length, y.length);

        if (n <= 30) return multiplyLong(x, y);
        n = Math.ceil(n / 2);

        var b = x.slice(n),
            a = x.slice(0, n),
            d = y.slice(n),
            c = y.slice(0, n);

        var ac = multiplyKaratsuba(a, c),
            bd = multiplyKaratsuba(b, d),
            abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));

        var product = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
        trim(product);
        return product;
    }

    // The following function is derived from a surface fit of a graph plotting the performance difference
    // between long multiplication and karatsuba multiplication versus the lengths of the two arrays.
    function useKaratsuba(l1, l2) {
        return -0.012 * l1 - 0.012 * l2 + 0.000015 * l1 * l2 > 0;
    }

    BigInteger.prototype.multiply = function (v) {
        var n = parseValue(v),
            a = this.value, b = n.value,
            sign = this.sign !== n.sign,
            abs;
        if (n.isSmall) {
            if (b === 0) return Integer[0];
            if (b === 1) return this;
            if (b === -1) return this.negate();
            abs = Math.abs(b);
            if (abs < BASE) {
                return new BigInteger(multiplySmall(a, abs), sign);
            }
            b = smallToArray(abs);
        }
        if (useKaratsuba(a.length, b.length)) // Karatsuba is only faster for certain array sizes
            return new BigInteger(multiplyKaratsuba(a, b), sign);
        return new BigInteger(multiplyLong(a, b), sign);
    };

    BigInteger.prototype.times = BigInteger.prototype.multiply;

    function multiplySmallAndArray(a, b, sign) { // a >= 0
        if (a < BASE) {
            return new BigInteger(multiplySmall(b, a), sign);
        }
        return new BigInteger(multiplyLong(b, smallToArray(a)), sign);
    }
    SmallInteger.prototype._multiplyBySmall = function (a) {
        if (isPrecise(a.value * this.value)) {
            return new SmallInteger(a.value * this.value);
        }
        return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
    };
    BigInteger.prototype._multiplyBySmall = function (a) {
        if (a.value === 0) return Integer[0];
        if (a.value === 1) return this;
        if (a.value === -1) return this.negate();
        return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
    };
    SmallInteger.prototype.multiply = function (v) {
        return parseValue(v)._multiplyBySmall(this);
    };
    SmallInteger.prototype.times = SmallInteger.prototype.multiply;

    NativeBigInt.prototype.multiply = function (v) {
        return new NativeBigInt(this.value * parseValue(v).value);
    }
    NativeBigInt.prototype.times = NativeBigInt.prototype.multiply;

    function square(a) {
        //console.assert(2 * BASE * BASE < MAX_INT);
        var l = a.length,
            r = createArray(l + l),
            base = BASE,
            product, carry, i, a_i, a_j;
        for (i = 0; i < l; i++) {
            a_i = a[i];
            carry = 0 - a_i * a_i;
            for (var j = i; j < l; j++) {
                a_j = a[j];
                product = 2 * (a_i * a_j) + r[i + j] + carry;
                carry = Math.floor(product / base);
                r[i + j] = product - carry * base;
            }
            r[i + l] = carry;
        }
        trim(r);
        return r;
    }

    BigInteger.prototype.square = function () {
        return new BigInteger(square(this.value), false);
    };

    SmallInteger.prototype.square = function () {
        var value = this.value * this.value;
        if (isPrecise(value)) return new SmallInteger(value);
        return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
    };

    NativeBigInt.prototype.square = function (v) {
        return new NativeBigInt(this.value * this.value);
    }

    function divMod1(a, b) { // Left over from previous version. Performs faster than divMod2 on smaller input sizes.
        var a_l = a.length,
            b_l = b.length,
            base = BASE,
            result = createArray(b.length),
            divisorMostSignificantDigit = b[b_l - 1],
            // normalization
            lambda = Math.ceil(base / (2 * divisorMostSignificantDigit)),
            remainder = multiplySmall(a, lambda),
            divisor = multiplySmall(b, lambda),
            quotientDigit, shift, carry, borrow, i, l, q;
        if (remainder.length <= a_l) remainder.push(0);
        divisor.push(0);
        divisorMostSignificantDigit = divisor[b_l - 1];
        for (shift = a_l - b_l; shift >= 0; shift--) {
            quotientDigit = base - 1;
            if (remainder[shift + b_l] !== divisorMostSignificantDigit) {
                quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
            }
            // quotientDigit <= base - 1
            carry = 0;
            borrow = 0;
            l = divisor.length;
            for (i = 0; i < l; i++) {
                carry += quotientDigit * divisor[i];
                q = Math.floor(carry / base);
                borrow += remainder[shift + i] - (carry - q * base);
                carry = q;
                if (borrow < 0) {
                    remainder[shift + i] = borrow + base;
                    borrow = -1;
                } else {
                    remainder[shift + i] = borrow;
                    borrow = 0;
                }
            }
            while (borrow !== 0) {
                quotientDigit -= 1;
                carry = 0;
                for (i = 0; i < l; i++) {
                    carry += remainder[shift + i] - base + divisor[i];
                    if (carry < 0) {
                        remainder[shift + i] = carry + base;
                        carry = 0;
                    } else {
                        remainder[shift + i] = carry;
                        carry = 1;
                    }
                }
                borrow += carry;
            }
            result[shift] = quotientDigit;
        }
        // denormalization
        remainder = divModSmall(remainder, lambda)[0];
        return [arrayToSmall(result), arrayToSmall(remainder)];
    }

    function divMod2(a, b) { // Implementation idea shamelessly stolen from Silent Matt's library http://silentmatt.com/biginteger/
        // Performs faster than divMod1 on larger input sizes.
        var a_l = a.length,
            b_l = b.length,
            result = [],
            part = [],
            base = BASE,
            guess, xlen, highx, highy, check;
        while (a_l) {
            part.unshift(a[--a_l]);
            trim(part);
            if (compareAbs(part, b) < 0) {
                result.push(0);
                continue;
            }
            xlen = part.length;
            highx = part[xlen - 1] * base + part[xlen - 2];
            highy = b[b_l - 1] * base + b[b_l - 2];
            if (xlen > b_l) {
                highx = (highx + 1) * base;
            }
            guess = Math.ceil(highx / highy);
            do {
                check = multiplySmall(b, guess);
                if (compareAbs(check, part) <= 0) break;
                guess--;
            } while (guess);
            result.push(guess);
            part = subtract(part, check);
        }
        result.reverse();
        return [arrayToSmall(result), arrayToSmall(part)];
    }

    function divModSmall(value, lambda) {
        var length = value.length,
            quotient = createArray(length),
            base = BASE,
            i, q, remainder, divisor;
        remainder = 0;
        for (i = length - 1; i >= 0; --i) {
            divisor = remainder * base + value[i];
            q = truncate(divisor / lambda);
            remainder = divisor - q * lambda;
            quotient[i] = q | 0;
        }
        return [quotient, remainder | 0];
    }

    function divModAny(self, v) {
        var value, n = parseValue(v);
        if (supportsNativeBigInt) {
            return [new NativeBigInt(self.value / n.value), new NativeBigInt(self.value % n.value)];
        }
        var a = self.value, b = n.value;
        var quotient;
        if (b === 0) throw new Error("Cannot divide by zero");
        if (self.isSmall) {
            if (n.isSmall) {
                return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
            }
            return [Integer[0], self];
        }
        if (n.isSmall) {
            if (b === 1) return [self, Integer[0]];
            if (b == -1) return [self.negate(), Integer[0]];
            var abs = Math.abs(b);
            if (abs < BASE) {
                value = divModSmall(a, abs);
                quotient = arrayToSmall(value[0]);
                var remainder = value[1];
                if (self.sign) remainder = -remainder;
                if (typeof quotient === "number") {
                    if (self.sign !== n.sign) quotient = -quotient;
                    return [new SmallInteger(quotient), new SmallInteger(remainder)];
                }
                return [new BigInteger(quotient, self.sign !== n.sign), new SmallInteger(remainder)];
            }
            b = smallToArray(abs);
        }
        var comparison = compareAbs(a, b);
        if (comparison === -1) return [Integer[0], self];
        if (comparison === 0) return [Integer[self.sign === n.sign ? 1 : -1], Integer[0]];

        // divMod1 is faster on smaller input sizes
        if (a.length + b.length <= 200)
            value = divMod1(a, b);
        else value = divMod2(a, b);

        quotient = value[0];
        var qSign = self.sign !== n.sign,
            mod = value[1],
            mSign = self.sign;
        if (typeof quotient === "number") {
            if (qSign) quotient = -quotient;
            quotient = new SmallInteger(quotient);
        } else quotient = new BigInteger(quotient, qSign);
        if (typeof mod === "number") {
            if (mSign) mod = -mod;
            mod = new SmallInteger(mod);
        } else mod = new BigInteger(mod, mSign);
        return [quotient, mod];
    }

    BigInteger.prototype.divmod = function (v) {
        var result = divModAny(this, v);
        return {
            quotient: result[0],
            remainder: result[1]
        };
    };
    NativeBigInt.prototype.divmod = SmallInteger.prototype.divmod = BigInteger.prototype.divmod;


    BigInteger.prototype.divide = function (v) {
        return divModAny(this, v)[0];
    };
    NativeBigInt.prototype.over = NativeBigInt.prototype.divide = function (v) {
        return new NativeBigInt(this.value / parseValue(v).value);
    };
    SmallInteger.prototype.over = SmallInteger.prototype.divide = BigInteger.prototype.over = BigInteger.prototype.divide;

    BigInteger.prototype.mod = function (v) {
        return divModAny(this, v)[1];
    };
    NativeBigInt.prototype.mod = NativeBigInt.prototype.remainder = function (v) {
        return new NativeBigInt(this.value % parseValue(v).value);
    };
    SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;

    BigInteger.prototype.pow = function (v) {
        var n = parseValue(v),
            a = this.value,
            b = n.value,
            value, x, y;
        if (b === 0) return Integer[1];
        if (a === 0) return Integer[0];
        if (a === 1) return Integer[1];
        if (a === -1) return n.isEven() ? Integer[1] : Integer[-1];
        if (n.sign) {
            return Integer[0];
        }
        if (!n.isSmall) throw new Error("The exponent " + n.toString() + " is too large.");
        if (this.isSmall) {
            if (isPrecise(value = Math.pow(a, b)))
                return new SmallInteger(truncate(value));
        }
        x = this;
        y = Integer[1];
        while (true) {
            if (b & 1 === 1) {
                y = y.times(x);
                --b;
            }
            if (b === 0) break;
            b /= 2;
            x = x.square();
        }
        return y;
    };
    SmallInteger.prototype.pow = BigInteger.prototype.pow;

    NativeBigInt.prototype.pow = function (v) {
        var n = parseValue(v);
        var a = this.value, b = n.value;
        var _0 = BigInt(0), _1 = BigInt(1), _2 = BigInt(2);
        if (b === _0) return Integer[1];
        if (a === _0) return Integer[0];
        if (a === _1) return Integer[1];
        if (a === BigInt(-1)) return n.isEven() ? Integer[1] : Integer[-1];
        if (n.isNegative()) return new NativeBigInt(_0);
        var x = this;
        var y = Integer[1];
        while (true) {
            if ((b & _1) === _1) {
                y = y.times(x);
                --b;
            }
            if (b === _0) break;
            b /= _2;
            x = x.square();
        }
        return y;
    }

    BigInteger.prototype.modPow = function (exp, mod) {
        exp = parseValue(exp);
        mod = parseValue(mod);
        if (mod.isZero()) throw new Error("Cannot take modPow with modulus 0");
        var r = Integer[1],
            base = this.mod(mod);
        if (exp.isNegative()) {
            exp = exp.multiply(Integer[-1]);
            base = base.modInv(mod);
        }
        while (exp.isPositive()) {
            if (base.isZero()) return Integer[0];
            if (exp.isOdd()) r = r.multiply(base).mod(mod);
            exp = exp.divide(2);
            base = base.square().mod(mod);
        }
        return r;
    };
    NativeBigInt.prototype.modPow = SmallInteger.prototype.modPow = BigInteger.prototype.modPow;

    function compareAbs(a, b) {
        if (a.length !== b.length) {
            return a.length > b.length ? 1 : -1;
        }
        for (var i = a.length - 1; i >= 0; i--) {
            if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
        }
        return 0;
    }

    BigInteger.prototype.compareAbs = function (v) {
        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (n.isSmall) return 1;
        return compareAbs(a, b);
    };
    SmallInteger.prototype.compareAbs = function (v) {
        var n = parseValue(v),
            a = Math.abs(this.value),
            b = n.value;
        if (n.isSmall) {
            b = Math.abs(b);
            return a === b ? 0 : a > b ? 1 : -1;
        }
        return -1;
    };
    NativeBigInt.prototype.compareAbs = function (v) {
        var a = this.value;
        var b = parseValue(v).value;
        a = a >= 0 ? a : -a;
        b = b >= 0 ? b : -b;
        return a === b ? 0 : a > b ? 1 : -1;
    }

    BigInteger.prototype.compare = function (v) {
        // See discussion about comparison with Infinity:
        // https://github.com/peterolson/BigInteger.js/issues/61
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }

        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (this.sign !== n.sign) {
            return n.sign ? 1 : -1;
        }
        if (n.isSmall) {
            return this.sign ? -1 : 1;
        }
        return compareAbs(a, b) * (this.sign ? -1 : 1);
    };
    BigInteger.prototype.compareTo = BigInteger.prototype.compare;

    SmallInteger.prototype.compare = function (v) {
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }

        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (n.isSmall) {
            return a == b ? 0 : a > b ? 1 : -1;
        }
        if (a < 0 !== n.sign) {
            return a < 0 ? -1 : 1;
        }
        return a < 0 ? 1 : -1;
    };
    SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;

    NativeBigInt.prototype.compare = function (v) {
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }
        var a = this.value;
        var b = parseValue(v).value;
        return a === b ? 0 : a > b ? 1 : -1;
    }
    NativeBigInt.prototype.compareTo = NativeBigInt.prototype.compare;

    BigInteger.prototype.equals = function (v) {
        return this.compare(v) === 0;
    };
    NativeBigInt.prototype.eq = NativeBigInt.prototype.equals = SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;

    BigInteger.prototype.notEquals = function (v) {
        return this.compare(v) !== 0;
    };
    NativeBigInt.prototype.neq = NativeBigInt.prototype.notEquals = SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;

    BigInteger.prototype.greater = function (v) {
        return this.compare(v) > 0;
    };
    NativeBigInt.prototype.gt = NativeBigInt.prototype.greater = SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.gt = BigInteger.prototype.greater;

    BigInteger.prototype.lesser = function (v) {
        return this.compare(v) < 0;
    };
    NativeBigInt.prototype.lt = NativeBigInt.prototype.lesser = SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lt = BigInteger.prototype.lesser;

    BigInteger.prototype.greaterOrEquals = function (v) {
        return this.compare(v) >= 0;
    };
    NativeBigInt.prototype.geq = NativeBigInt.prototype.greaterOrEquals = SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;

    BigInteger.prototype.lesserOrEquals = function (v) {
        return this.compare(v) <= 0;
    };
    NativeBigInt.prototype.leq = NativeBigInt.prototype.lesserOrEquals = SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;

    BigInteger.prototype.isEven = function () {
        return (this.value[0] & 1) === 0;
    };
    SmallInteger.prototype.isEven = function () {
        return (this.value & 1) === 0;
    };
    NativeBigInt.prototype.isEven = function () {
        return (this.value & BigInt(1)) === BigInt(0);
    }

    BigInteger.prototype.isOdd = function () {
        return (this.value[0] & 1) === 1;
    };
    SmallInteger.prototype.isOdd = function () {
        return (this.value & 1) === 1;
    };
    NativeBigInt.prototype.isOdd = function () {
        return (this.value & BigInt(1)) === BigInt(1);
    }

    BigInteger.prototype.isPositive = function () {
        return !this.sign;
    };
    SmallInteger.prototype.isPositive = function () {
        return this.value > 0;
    };
    NativeBigInt.prototype.isPositive = SmallInteger.prototype.isPositive;

    BigInteger.prototype.isNegative = function () {
        return this.sign;
    };
    SmallInteger.prototype.isNegative = function () {
        return this.value < 0;
    };
    NativeBigInt.prototype.isNegative = SmallInteger.prototype.isNegative;

    BigInteger.prototype.isUnit = function () {
        return false;
    };
    SmallInteger.prototype.isUnit = function () {
        return Math.abs(this.value) === 1;
    };
    NativeBigInt.prototype.isUnit = function () {
        return this.abs().value === BigInt(1);
    }

    BigInteger.prototype.isZero = function () {
        return false;
    };
    SmallInteger.prototype.isZero = function () {
        return this.value === 0;
    };
    NativeBigInt.prototype.isZero = function () {
        return this.value === BigInt(0);
    }

    BigInteger.prototype.isDivisibleBy = function (v) {
        var n = parseValue(v);
        if (n.isZero()) return false;
        if (n.isUnit()) return true;
        if (n.compareAbs(2) === 0) return this.isEven();
        return this.mod(n).isZero();
    };
    NativeBigInt.prototype.isDivisibleBy = SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;

    function isBasicPrime(v) {
        var n = v.abs();
        if (n.isUnit()) return false;
        if (n.equals(2) || n.equals(3) || n.equals(5)) return true;
        if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5)) return false;
        if (n.lesser(49)) return true;
        // we don't know if it's prime: let the other functions figure it out
    }

    function millerRabinTest(n, a) {
        var nPrev = n.prev(),
            b = nPrev,
            r = 0,
            d, t, i, x;
        while (b.isEven()) b = b.divide(2), r++;
        next: for (i = 0; i < a.length; i++) {
            if (n.lesser(a[i])) continue;
            x = bigInt(a[i]).modPow(b, n);
            if (x.isUnit() || x.equals(nPrev)) continue;
            for (d = r - 1; d != 0; d--) {
                x = x.square().mod(n);
                if (x.isUnit()) return false;
                if (x.equals(nPrev)) continue next;
            }
            return false;
        }
        return true;
    }

    // Set "strict" to true to force GRH-supported lower bound of 2*log(N)^2
    BigInteger.prototype.isPrime = function (strict) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined) return isPrime;
        var n = this.abs();
        var bits = n.bitLength();
        if (bits <= 64)
            return millerRabinTest(n, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
        var logN = Math.log(2) * bits.toJSNumber();
        var t = Math.ceil((strict === true) ? (2 * Math.pow(logN, 2)) : logN);
        for (var a = [], i = 0; i < t; i++) {
            a.push(bigInt(i + 2));
        }
        return millerRabinTest(n, a);
    };
    NativeBigInt.prototype.isPrime = SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;

    BigInteger.prototype.isProbablePrime = function (iterations, rng) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined) return isPrime;
        var n = this.abs();
        var t = iterations === undefined ? 5 : iterations;
        for (var a = [], i = 0; i < t; i++) {
            a.push(bigInt.randBetween(2, n.minus(2), rng));
        }
        return millerRabinTest(n, a);
    };
    NativeBigInt.prototype.isProbablePrime = SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;

    BigInteger.prototype.modInv = function (n) {
        var t = bigInt.zero, newT = bigInt.one, r = parseValue(n), newR = this.abs(), q, lastT, lastR;
        while (!newR.isZero()) {
            q = r.divide(newR);
            lastT = t;
            lastR = r;
            t = newT;
            r = newR;
            newT = lastT.subtract(q.multiply(newT));
            newR = lastR.subtract(q.multiply(newR));
        }
        if (!r.isUnit()) throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
        if (t.compare(0) === -1) {
            t = t.add(n);
        }
        if (this.isNegative()) {
            return t.negate();
        }
        return t;
    };

    NativeBigInt.prototype.modInv = SmallInteger.prototype.modInv = BigInteger.prototype.modInv;

    BigInteger.prototype.next = function () {
        var value = this.value;
        if (this.sign) {
            return subtractSmall(value, 1, this.sign);
        }
        return new BigInteger(addSmall(value, 1), this.sign);
    };
    SmallInteger.prototype.next = function () {
        var value = this.value;
        if (value + 1 < MAX_INT) return new SmallInteger(value + 1);
        return new BigInteger(MAX_INT_ARR, false);
    };
    NativeBigInt.prototype.next = function () {
        return new NativeBigInt(this.value + BigInt(1));
    }

    BigInteger.prototype.prev = function () {
        var value = this.value;
        if (this.sign) {
            return new BigInteger(addSmall(value, 1), true);
        }
        return subtractSmall(value, 1, this.sign);
    };
    SmallInteger.prototype.prev = function () {
        var value = this.value;
        if (value - 1 > -MAX_INT) return new SmallInteger(value - 1);
        return new BigInteger(MAX_INT_ARR, true);
    };
    NativeBigInt.prototype.prev = function () {
        return new NativeBigInt(this.value - BigInt(1));
    }

    var powersOfTwo = [1];
    while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE) powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
    var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];

    function shift_isSmall(n) {
        return Math.abs(n) <= BASE;
    }

    BigInteger.prototype.shiftLeft = function (v) {
        var n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0) return this.shiftRight(-n);
        var result = this;
        if (result.isZero()) return result;
        while (n >= powers2Length) {
            result = result.multiply(highestPower2);
            n -= powers2Length - 1;
        }
        return result.multiply(powersOfTwo[n]);
    };
    NativeBigInt.prototype.shiftLeft = SmallInteger.prototype.shiftLeft = BigInteger.prototype.shiftLeft;

    BigInteger.prototype.shiftRight = function (v) {
        var remQuo;
        var n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0) return this.shiftLeft(-n);
        var result = this;
        while (n >= powers2Length) {
            if (result.isZero() || (result.isNegative() && result.isUnit())) return result;
            remQuo = divModAny(result, highestPower2);
            result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
            n -= powers2Length - 1;
        }
        remQuo = divModAny(result, powersOfTwo[n]);
        return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
    };
    NativeBigInt.prototype.shiftRight = SmallInteger.prototype.shiftRight = BigInteger.prototype.shiftRight;

    function bitwise(x, y, fn) {
        y = parseValue(y);
        var xSign = x.isNegative(), ySign = y.isNegative();
        var xRem = xSign ? x.not() : x,
            yRem = ySign ? y.not() : y;
        var xDigit = 0, yDigit = 0;
        var xDivMod = null, yDivMod = null;
        var result = [];
        while (!xRem.isZero() || !yRem.isZero()) {
            xDivMod = divModAny(xRem, highestPower2);
            xDigit = xDivMod[1].toJSNumber();
            if (xSign) {
                xDigit = highestPower2 - 1 - xDigit; // two's complement for negative numbers
            }

            yDivMod = divModAny(yRem, highestPower2);
            yDigit = yDivMod[1].toJSNumber();
            if (ySign) {
                yDigit = highestPower2 - 1 - yDigit; // two's complement for negative numbers
            }

            xRem = xDivMod[0];
            yRem = yDivMod[0];
            result.push(fn(xDigit, yDigit));
        }
        var sum = fn(xSign ? 1 : 0, ySign ? 1 : 0) !== 0 ? bigInt(-1) : bigInt(0);
        for (var i = result.length - 1; i >= 0; i -= 1) {
            sum = sum.multiply(highestPower2).add(bigInt(result[i]));
        }
        return sum;
    }

    BigInteger.prototype.not = function () {
        return this.negate().prev();
    };
    NativeBigInt.prototype.not = SmallInteger.prototype.not = BigInteger.prototype.not;

    BigInteger.prototype.and = function (n) {
        return bitwise(this, n, function (a, b) { return a & b; });
    };
    NativeBigInt.prototype.and = SmallInteger.prototype.and = BigInteger.prototype.and;

    BigInteger.prototype.or = function (n) {
        return bitwise(this, n, function (a, b) { return a | b; });
    };
    NativeBigInt.prototype.or = SmallInteger.prototype.or = BigInteger.prototype.or;

    BigInteger.prototype.xor = function (n) {
        return bitwise(this, n, function (a, b) { return a ^ b; });
    };
    NativeBigInt.prototype.xor = SmallInteger.prototype.xor = BigInteger.prototype.xor;

    var LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
    function roughLOB(n) { // get lowestOneBit (rough)
        // SmallInteger: return Min(lowestOneBit(n), 1 << 30)
        // BigInteger: return Min(lowestOneBit(n), 1 << 14) [BASE=1e7]
        var v = n.value,
            x = typeof v === "number" ? v | LOBMASK_I :
                typeof v === "bigint" ? v | BigInt(LOBMASK_I) :
                    v[0] + v[1] * BASE | LOBMASK_BI;
        return x & -x;
    }

    function integerLogarithm(value, base) {
        if (base.compareTo(value) <= 0) {
            var tmp = integerLogarithm(value, base.square(base));
            var p = tmp.p;
            var e = tmp.e;
            var t = p.multiply(base);
            return t.compareTo(value) <= 0 ? { p: t, e: e * 2 + 1 } : { p: p, e: e * 2 };
        }
        return { p: bigInt(1), e: 0 };
    }

    BigInteger.prototype.bitLength = function () {
        var n = this;
        if (n.compareTo(bigInt(0)) < 0) {
            n = n.negate().subtract(bigInt(1));
        }
        if (n.compareTo(bigInt(0)) === 0) {
            return bigInt(0);
        }
        return bigInt(integerLogarithm(n, bigInt(2)).e).add(bigInt(1));
    }
    NativeBigInt.prototype.bitLength = SmallInteger.prototype.bitLength = BigInteger.prototype.bitLength;

    function max(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.greater(b) ? a : b;
    }
    function min(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.lesser(b) ? a : b;
    }
    function gcd(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        if (a.equals(b)) return a;
        if (a.isZero()) return b;
        if (b.isZero()) return a;
        var c = Integer[1], d, t;
        while (a.isEven() && b.isEven()) {
            d = min(roughLOB(a), roughLOB(b));
            a = a.divide(d);
            b = b.divide(d);
            c = c.multiply(d);
        }
        while (a.isEven()) {
            a = a.divide(roughLOB(a));
        }
        do {
            while (b.isEven()) {
                b = b.divide(roughLOB(b));
            }
            if (a.greater(b)) {
                t = b; b = a; a = t;
            }
            b = b.subtract(a);
        } while (!b.isZero());
        return c.isUnit() ? a : a.multiply(c);
    }
    function lcm(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        return a.divide(gcd(a, b)).multiply(b);
    }
    function randBetween(a, b, rng) {
        a = parseValue(a);
        b = parseValue(b);
        var usedRNG = rng || Math.random;
        var low = min(a, b), high = max(a, b);
        var range = high.subtract(low).add(1);
        if (range.isSmall) return low.add(Math.floor(usedRNG() * range));
        var digits = toBase(range, BASE).value;
        var result = [], restricted = true;
        for (var i = 0; i < digits.length; i++) {
            var top = restricted ? digits[i] : BASE;
            var digit = truncate(usedRNG() * top);
            result.push(digit);
            if (digit < top) restricted = false;
        }
        return low.add(Integer.fromArray(result, BASE, false));
    }

    var parseBase = function (text, base, alphabet, caseSensitive) {
        alphabet = alphabet || DEFAULT_ALPHABET;
        text = String(text);
        if (!caseSensitive) {
            text = text.toLowerCase();
            alphabet = alphabet.toLowerCase();
        }
        var length = text.length;
        var i;
        var absBase = Math.abs(base);
        var alphabetValues = {};
        for (i = 0; i < alphabet.length; i++) {
            alphabetValues[alphabet[i]] = i;
        }
        for (i = 0; i < length; i++) {
            var c = text[i];
            if (c === "-") continue;
            if (c in alphabetValues) {
                if (alphabetValues[c] >= absBase) {
                    if (c === "1" && absBase === 1) continue;
                    throw new Error(c + " is not a valid digit in base " + base + ".");
                }
            }
        }
        base = parseValue(base);
        var digits = [];
        var isNegative = text[0] === "-";
        for (i = isNegative ? 1 : 0; i < text.length; i++) {
            var c = text[i];
            if (c in alphabetValues) digits.push(parseValue(alphabetValues[c]));
            else if (c === "<") {
                var start = i;
                do { i++; } while (text[i] !== ">" && i < text.length);
                digits.push(parseValue(text.slice(start + 1, i)));
            }
            else throw new Error(c + " is not a valid character");
        }
        return parseBaseFromArray(digits, base, isNegative);
    };

    function parseBaseFromArray(digits, base, isNegative) {
        var val = Integer[0], pow = Integer[1], i;
        for (i = digits.length - 1; i >= 0; i--) {
            val = val.add(digits[i].times(pow));
            pow = pow.times(base);
        }
        return isNegative ? val.negate() : val;
    }

    function stringify(digit, alphabet) {
        alphabet = alphabet || DEFAULT_ALPHABET;
        if (digit < alphabet.length) {
            return alphabet[digit];
        }
        return "<" + digit + ">";
    }

    function toBase(n, base) {
        base = bigInt(base);
        if (base.isZero()) {
            if (n.isZero()) return { value: [0], isNegative: false };
            throw new Error("Cannot convert nonzero numbers to base 0.");
        }
        if (base.equals(-1)) {
            if (n.isZero()) return { value: [0], isNegative: false };
            if (n.isNegative())
                return {
                    value: [].concat.apply([], Array.apply(null, Array(-n.toJSNumber()))
                        .map(Array.prototype.valueOf, [1, 0])
                    ),
                    isNegative: false
                };

            var arr = Array.apply(null, Array(n.toJSNumber() - 1))
                .map(Array.prototype.valueOf, [0, 1]);
            arr.unshift([1]);
            return {
                value: [].concat.apply([], arr),
                isNegative: false
            };
        }

        var neg = false;
        if (n.isNegative() && base.isPositive()) {
            neg = true;
            n = n.abs();
        }
        if (base.isUnit()) {
            if (n.isZero()) return { value: [0], isNegative: false };

            return {
                value: Array.apply(null, Array(n.toJSNumber()))
                    .map(Number.prototype.valueOf, 1),
                isNegative: neg
            };
        }
        var out = [];
        var left = n, divmod;
        while (left.isNegative() || left.compareAbs(base) >= 0) {
            divmod = left.divmod(base);
            left = divmod.quotient;
            var digit = divmod.remainder;
            if (digit.isNegative()) {
                digit = base.minus(digit).abs();
                left = left.next();
            }
            out.push(digit.toJSNumber());
        }
        out.push(left.toJSNumber());
        return { value: out.reverse(), isNegative: neg };
    }

    function toBaseString(n, base, alphabet) {
        var arr = toBase(n, base);
        return (arr.isNegative ? "-" : "") + arr.value.map(function (x) {
            return stringify(x, alphabet);
        }).join('');
    }

    BigInteger.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    SmallInteger.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    NativeBigInt.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    BigInteger.prototype.toString = function (radix, alphabet) {
        if (radix === undefined) radix = 10;
        if (radix !== 10) return toBaseString(this, radix, alphabet);
        var v = this.value, l = v.length, str = String(v[--l]), zeros = "0000000", digit;
        while (--l >= 0) {
            digit = String(v[l]);
            str += zeros.slice(digit.length) + digit;
        }
        var sign = this.sign ? "-" : "";
        return sign + str;
    };

    SmallInteger.prototype.toString = function (radix, alphabet) {
        if (radix === undefined) radix = 10;
        if (radix != 10) return toBaseString(this, radix, alphabet);
        return String(this.value);
    };

    NativeBigInt.prototype.toString = SmallInteger.prototype.toString;

    NativeBigInt.prototype.toJSON = BigInteger.prototype.toJSON = SmallInteger.prototype.toJSON = function () { return this.toString(); }

    BigInteger.prototype.valueOf = function () {
        return parseInt(this.toString(), 10);
    };
    BigInteger.prototype.toJSNumber = BigInteger.prototype.valueOf;

    SmallInteger.prototype.valueOf = function () {
        return this.value;
    };
    SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;
    NativeBigInt.prototype.valueOf = NativeBigInt.prototype.toJSNumber = function () {
        return parseInt(this.toString(), 10);
    }

    function parseStringValue(v) {
        if (isPrecise(+v)) {
            var x = +v;
            if (x === truncate(x))
                return supportsNativeBigInt ? new NativeBigInt(BigInt(x)) : new SmallInteger(x);
            throw new Error("Invalid integer: " + v);
        }
        var sign = v[0] === "-";
        if (sign) v = v.slice(1);
        var split = v.split(/e/i);
        if (split.length > 2) throw new Error("Invalid integer: " + split.join("e"));
        if (split.length === 2) {
            var exp = split[1];
            if (exp[0] === "+") exp = exp.slice(1);
            exp = +exp;
            if (exp !== truncate(exp) || !isPrecise(exp)) throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
            var text = split[0];
            var decimalPlace = text.indexOf(".");
            if (decimalPlace >= 0) {
                exp -= text.length - decimalPlace - 1;
                text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
            }
            if (exp < 0) throw new Error("Cannot include negative exponent part for integers");
            text += (new Array(exp + 1)).join("0");
            v = text;
        }
        var isValid = /^([0-9][0-9]*)$/.test(v);
        if (!isValid) throw new Error("Invalid integer: " + v);
        if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(sign ? "-" + v : v));
        }
        var r = [], max = v.length, l = LOG_BASE, min = max - l;
        while (max > 0) {
            r.push(+v.slice(min, max));
            min -= l;
            if (min < 0) min = 0;
            max -= l;
        }
        trim(r);
        return new BigInteger(r, sign);
    }

    function parseNumberValue(v) {
        if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(v));
        }
        if (isPrecise(v)) {
            if (v !== truncate(v)) throw new Error(v + " is not an integer.");
            return new SmallInteger(v);
        }
        return parseStringValue(v.toString());
    }

    function parseValue(v) {
        if (typeof v === "number") {
            return parseNumberValue(v);
        }
        if (typeof v === "string") {
            return parseStringValue(v);
        }
        if (typeof v === "bigint") {
            return new NativeBigInt(v);
        }
        return v;
    }
    // Pre-define numbers in range [-999,999]
    for (var i = 0; i < 1000; i++) {
        Integer[i] = parseValue(i);
        if (i > 0) Integer[-i] = parseValue(-i);
    }
    // Backwards compatibility
    Integer.one = Integer[1];
    Integer.zero = Integer[0];
    Integer.minusOne = Integer[-1];
    Integer.max = max;
    Integer.min = min;
    Integer.gcd = gcd;
    Integer.lcm = lcm;
    Integer.isInstance = function (x) { return x instanceof BigInteger || x instanceof SmallInteger || x instanceof NativeBigInt; };
    Integer.randBetween = randBetween;

    Integer.fromArray = function (digits, base, isNegative) {
        return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
    };

    return Integer;
})();

// Node.js check
if (typeof module !== "undefined" && module.hasOwnProperty("exports")) {
    module.exports = bigInt;
}

//amd check
if (typeof define === "function" && define.amd) {
    define( function () {
        return bigInt;
    });
}

},{}]},{},[1]);
