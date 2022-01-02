"use strict";
export { splitSlide, buildItem, buildSlide, Slide, Item, Text, Html, Figure, Presentation };

import { match, __, select } from 'ts-pattern';

import {H, _H} from './element';

// ----- ADT Types -----

type Html =
    | { type: "html"; h: _H }

type Figure =
    | { type: "figure"; h: _H }

type Text =
    | { type: "text"; text: string}

type Item = Html | Figure | Text | Slide

type Slide =
    { items: Item[], title: string }
    & (
        | { type: "title" }
        | { type: "content" }
        | { type: "figure and content"; figure: Figure }
    )

type Presentation =
    | { slides: Slide[] }


// Presentation container
let presentation: Presentation = { slides: [] };
(window as any).presentation = presentation;

function splitSlide(slide: Slide): Slide[] {
    /* Splits 1 slide into 2 slides if possible. If not, returns the input. */
    return match(slide)
        .with({type: "title"}, () => [{type: "title", title: slide.title, items: slide.items} as Slide])
        .with({type: "content"}, () => {
            // small slides shouldn't be split
            if (slide.items.length < 2) {
                return [slide];
            }

            let slide1 = {type: "content", title: slide.title, items: slide.items.slice(0, slide.items.length / 2)} as Slide;
            let slide2 = {type: "content", title: slide.title, items: slide.items.slice(slide.items.length / 2)} as Slide;

            return [slide1, slide2];
        })
        .with({type: "figure and content"}, (slide) => {
            // small slides shouldn't be split
            if (slide.items.length < 2) {
                return [slide];
            }

            let figure2 = {type: "figure", h: (slide.figure.h.deepcopy())};

            let slide1 = {type: "figure and content", title: slide.title, figure: slide.figure, items: slide.items.slice(0, slide.items.length / 2)} as Slide;
            let slide2 = {type: "figure and content", title: slide.title, figure: figure2, items: slide.items.slice(slide.items.length / 2)} as Slide;


            return [slide1, slide2];
        })
        .exhaustive();
}
(window as any).splitSlide = splitSlide;


function buildItem(item:Item): _H {
    /* Generate HTML from an Item 
        This recurses with buildSlide as a Slide is an Item.
    */
    return match(item)
        .with({type: "html", h: select()}, (h) => h)
        .with({type: "figure", h: select()}, (h) => h)
        .with({type: "text", text: select()}, (t) => {
            let p = H("p");
            p.element.textContent = t;
            p.element.style.fontSize = "0.7em";
            p.element.style.lineHeight = "1.2";
            p.element.style.textAlign = "left";
            return p;
        })
        .with({items: __}, (s) => buildSlide(s))
        .exhaustive();
}

function buildSlide(slide:Slide): _H {
    /* Generate HTML from a Slide.
        All items in a Slide are built.
        Then, the HTML for the slide is generated based on slide type.
        This recurses with buildItem as a Slide is an Item.
    */
    return match(slide)
        .with({type: "title"}, (slide: Slide) => {
            let section = H("section");
            section.element.style.textAlign = "left";
            let div = H("div");
            section.append(div);
            div.element.style.margin = "32px";
            let h1 = H("h1");
            h1.element.textContent = slide.title;
            div.append(h1);
            return section;
        })
        .with({type: "content"}, () => {
            let section = H("section");
            section.element.style.textAlign = "left";
            let div = H("div");
            section.append(div);
            div.element.style.margin = "32px";
            let h1 = H("h1");
            h1.element.style.marginBottom = "48px";
            h1.element.textContent = slide.title;
            h1.element.style.textAlign = "left";
            div.append(h1);
            let ul = H("ul");
            div.append(ul);
            for (const item of slide.items) {
                let li = H("li");
                li.element.style.fontSize = "2.5em";
                li.element.style.lineHeight = "1.2";
                li.append(buildItem(item));
                li.element.style.marginBottom = "24px";
                ul.append(li);
            }
            return section;
        })
        .with({type: "figure and content"}, (slide) => {
            let section = H("section");
            section.element.style.textAlign = "left";
            let div = H("div");
            div.element.style.margin = "32px";
            let table = H("table");
            let row = H("tr");
            let col1 = H("td");
            let col2 = H("td");

            col1.element.style.width = "50%";
            col1.element.style.paddingRight = "16px";
            col2.element.style.paddingLeft = "16px";

            let h1 = H("h1");
            h1.element.style.marginBottom = "48px";
            h1.element.textContent = slide.title;
            h1.element.style.textAlign = "left";
            section.append(div);
            div.append(h1);

            div.append(table);
            table.append(row);
            row.append(col1);
            row.append(col2);

            slide.figure.h.element.querySelectorAll("img").forEach((img) => {
                img.style.width = "100%";
            });

            col1.append(buildItem(slide.figure));
            let ul = H("ul");
            col2.append(ul);
            for (const item of slide.items) {
                let li = H("li");
                li.element.style.fontSize = "2.5em";
                li.element.style.lineHeight = "1.2";
                li.append(buildItem(item));
                li.element.style.marginBottom = "24px";
                ul.append(li);
            }
            return section;
        })
        .exhaustive();
}