"use strict";

export {htmlToElement, createScriptElement, createScriptSrcElement, getNextSiblings, onLoad};

import {H, Hwrappable, _H} from './element';

function htmlToElement(html) {
    /* Create a HTMLElement from a string of HTML. */
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return H(<HTMLElement>template.content.firstChild);
}

function createScriptElement(code) {
    /* Create a script element from a string of JavaScript. */
    let s = document.createElement("script");
    s.type = "text/javascript";
    s.innerText = code;
    return s;
}

function createScriptSrcElement(src, onload) {
    /* Create a script element from a url pointing to a js file. */
    let s = document.createElement("script");
    s.type = "text/javascript";
    s.src = src;
    s.async = false;
    s.onload = onload;
    return s;
}

// https://stackoverflow.com/questions/4378784/how-to-find-all-siblings-of-the-currently-selected-dom-object
function getNextSiblings(elem) {
    /* Get all siblings following an element (elem). */
    var sibs = [];
    while (elem = elem.nextElementSibling) {
        if (elem.nodeType === 3) continue; // text node
        sibs.push(elem);
    }
    return sibs;
}

function onLoad(callback: () => void) {
    /* This function is called when the page loads.*/
    if (document.readyState != "loading") {
        callback();
    } else {
        document.addEventListener("DOMContentLoaded", callback);
    }
}
