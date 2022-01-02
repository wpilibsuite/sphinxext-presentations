"use strict";
export { present, buildPresentation};

import Reveal from 'reveal.js';
import { match, __, not, select, when, isMatching } from 'ts-pattern';

import {H, _H} from './element';
import {splitParagraph} from './split';
import { createScriptElement, createScriptSrcElement, htmlToElement, onLoad} from './utils';
import {Slide, Item, buildSlide, Presentation, splitSlide} from './slide';
import { createSlides, getElements } from './sphinx';


function buildPresentation(presentation: Presentation, slidesElement: _H){
    /* Generate HTML for an entire presentation.
        This is non-idempotent. The slidesElement passed in is modified.
        If a new slidesElement is returned, then the presentation library
        will have an reference to an out-of-date slide deck.
    */
    while (slidesElement.element.firstChild) {
        slidesElement.element.removeChild(slidesElement.element.firstChild);
    }
    for (const [index, slide] of presentation.slides.entries()) {
        
        let builtSlide = buildSlide(slide);
        slidesElement.append(
            builtSlide
        )
    }
}
(window as any).buildPresentation = buildPresentation;


function present(): void {
    /* Start the presentation.
        This function gets called when the page loads at the window level in the browser.
        It is responsible for setting up the presentation and building it.
        This function reads the source HTML and generates the ADT.
        buildPresentation is then called to generate the presentation.
    */

    // Structure created below is:
    // -----
    // <reveal>
    //   <slides>
    //     <section> -> 1 section per slide
    //   </slides>
    // </reveal>
    // -----

    let reveal = H("div")
        .addClass("reveal")

    let slides = H("div")
        .addClass("slides");

    (window as any).slides = slides;

    let peabody = H("body")
        .addClass("rst-content")
        .append(
            reveal
                .append(slides)
        );

    let elements = getElements();
    let slidesArray = createSlides(elements);

    let promo = H(
        htmlToElement(
            `<p>
                This presentation was made possible by 
                <a href="https://github.com/wpilibsuite/sphinxext-presentations">sphinxext-presentations</a> 
                and by contributions to documentation from viewers like you.
                Thank You
            </p>`
        )
    )

    slidesArray.push(
        {
            type: "content",
            title: "End of Presentation",
            items: [
                {type: "html", h: promo},
            ],
        }
    );

    console.log(slidesArray);
    let presentation = {slides: slidesArray};

    buildPresentation(presentation, slides);

    // Inject the built presentation into the page
    let sherman = document.getElementsByTagName("body")[0];
    sherman.parentNode.replaceChild(peabody.element, sherman);
    
    initializePresentation(presentation, Reveal);
    
}
(window as any).present = present;

function initializePresentation(presentation: Presentation, reveal: Reveal) {
    /* This function is called after the presentation has been built.
        It initializes the presentation library and sets up a callback for splitting slides.
    */

    // Load revealjs css

    const thisURL = new Error().stack.match(`((https.*?)/js/present.js)`)[2];
    const cssURL = thisURL + "/css/reveal.css";
    document.getElementsByTagName("head")[0].appendChild(
        htmlToElement(
            `<link rel="stylesheet" href="${cssURL}">`
        ).element
    );

    // Initialize the presentation library
    reveal.initialize({
        controls: true,
        width: '100%',
        height: '100%',
        progress: true,
        slideNumber: true,
        history: false,
        keyboard: true,
        overview: true,
        center: false,
        disableLayout: true,
        touch: true,
        loop: false,
        rtl: false,
        shuffle: false,
        fragments: true,
        embedded: false,
        help: true,
        showNotes: false,
        autoPlayMedia: null,
        autoSlide: 0,
        autoSlideStoppable: true,
        autoSlideMethod: Reveal.navigateNext,
        mouseWheel: false,
        hideAddressBar: false,
        previewLinks: true,
        transition: 'slide', 
        transitionSpeed: 'default',
        backgroundTransition: 'fade',
        viewDistance: 3,
        parallaxBackgroundImage: '', 
        parallaxBackgroundSize: '',
        parallaxBackgroundHorizontal: null,
        parallaxBackgroundVertical: null,
        display: 'block'
    });

    function onSlideTransitioned(event: any) {
        // This is called when the current slide changes.
        let slideIndex = event.indexh;
        let slideHeight = reveal.getCurrentSlide().getBoundingClientRect().height;
        let windowHeight = window.innerHeight;

        console.log(slideHeight, windowHeight);

        if (slideHeight > windowHeight) {
            // Split the current slide if it is too tall for the browser window
            let slide = presentation.slides[slideIndex];
            let newSlides = splitSlide(slide);
            if (newSlides.length == 1) {
                return;
            }
            let [slide1, slide2] = newSlides;
            presentation.slides[slideIndex] = slide1;
            presentation.slides.splice(slideIndex + 1, 0, slide2);

            // @ts-ignore
            buildPresentation(presentation, window.slides);

            // Force a refresh of the presentation
            // reveal.sync();
            reveal.slide( event.indexh, event.indexv, event.indexf );
            onSlideTransitioned(event);
        }
    }

    reveal.on( 'slidetransitionend', event => {onSlideTransitioned(event)} );
}
(window as any).initializePresentation = initializePresentation;
