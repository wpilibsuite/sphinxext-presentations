"use strict";
export { createSlides, getElements};

import { isMatching } from 'ts-pattern';

import {H, _H} from './element';
import {splitParagraph} from './split';
import { Slide, Item } from './slide';

function createSlides(elements: Element[]): Slide[] {
    let slides: Slide[] = [];

    let title = "";
    for (const element of elements) {
        if (["H1", "H2", "H3", "H4", "H5", "H6"].includes(element.tagName)) {
            // We have a title slide

            for (const child of element.children) {
                // Don't show the paragraph symbol that headerlinks use
                if (child.classList.contains("headerlink")) {
                    child.remove();
                }
            }
            
            title = element.textContent;
            slides.push({ type: "title", title: title, items: [] });
            continue;
        }

        if (element.classList.contains("image-reference")) {
            slides.push({ type: "figure and content", title: title, figure: {type: "figure", h: H(element)}, items:[] });
            continue;
        } else if (! isMatching({type: "figure and content"}, slides[slides.length - 1])) {
            slides.push({ type: "content",  title: title, items: [] });
        }
        
        if (element.tagName.toLowerCase() == "p") {
            let text = element.textContent;
            text = text.replace(/\n/g, " ");
            let paragraphs = splitParagraph(text);

            for(const p of paragraphs) {
                // Create a text item with bullet points for each sentence
                slides[slides.length - 1].items.push({ type: "text", text: p });
            }
            continue;
        }

        slides[slides.length - 1].items.push({type: "html", h: H(element) });

    }

    return slides;

}
(window as any).createSlides = createSlides;

function getElements(): Element[] {
    let elements = [];
    let webSections = document.getElementsByClassName("section");
    if (webSections.length == 0) {
        let rstContent = document.getElementsByClassName("rst-content")[0];
        webSections = rstContent.getElementsByTagName("section");
    }
    for (const section of webSections) {
        for(const child of section.children) {
            if (child.classList.contains("section") || child.tagName.toLowerCase() == "section") {
                break;
            }

            if (child.classList.contains("toctree-wrapper")) {
                continue;
            }

            elements.push(child);
        }
    }
    return elements;
}
(window as any).getElements = getElements;
