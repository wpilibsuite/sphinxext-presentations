import { describe } from 'mocha';
import { expect } from 'chai';
import { splitSlide, buildItem, buildSlide,  Slide, Item, Text, Html, Figure, Presentation } from '../src/slide';
import { H } from '../src/element';

describe("splitSlide", () => {

    describe("title", () => {
        it("size small slide", () => {
            let slide: Slide = {type: "title", items: [], title: "title"};
            let splitSlides = splitSlide(slide);
            expect(splitSlides.length).to.equal(1);
        });

        it("size big slide", () => {
            let slide: Slide = {type: "title", items: [{type: "text", text: "asdf1"}, {type: "text", text: "asdf2"}], title: "title"};
            let splitSlides = splitSlide(slide);
            expect(splitSlides.length).to.equal(1);
        });

        it("contents small slide", () => {
            let slide: Slide = {type: "title", items: [], title: "title"};
            let splitSlides = splitSlide(slide);
            expect(splitSlides[0]).to.deep.equal(slide);
        });

        it("contents big slide", () => {
            let slide: Slide = {type: "title", items: [{type: "text", text: "asdf1"}, {type: "text", text: "asdf2"}, {type: "text", text: "asdf3"}], title: "title"};
            let splitSlides = splitSlide(slide);
            expect(splitSlides[0]).to.deep.equal(slide);
        });

    });

    describe("content", () => {
        it("size small slide", () => {
            let slide: Slide = {type: "content", items: [{type: "text", text: "asdf1"}], title: "title"};
            let splitSlides = splitSlide(slide);
            expect(splitSlides.length).to.equal(1);
        });

        it("size big slide", () => {
            let slide: Slide = {type: "content", items: [{type: "text", text: "asdf1"}, {type: "text", text: "asdf2"}, {type: "text", text: "asdf3"}], title: "title"};
            let splitSlides = splitSlide(slide);
            expect(splitSlides.length).to.equal(2);
        });

        it("contents small slide", () => {
            let slide: Slide = {type: "content", items: [{type: "text", text: "asdf1"}], title: "title"};
            let splitSlides = splitSlide(slide);
            expect(splitSlides[0]).to.deep.equal(slide);
        });

        it("contents big slide", () => {
            let slide: Slide = {type: "content", items: [{type: "text", text: "asdf1"}, {type: "text", text: "asdf2"}, {type: "text", text: "asdf3"}, {type: "text", text: "asdf4"}], title: "title"};
            let splitSlides = splitSlide(slide);
            expect(splitSlides[0]).to.deep.equal({type: "content", items: [{type: "text", text: "asdf1"}, {type: "text", text: "asdf2"}], title: "title"});
            expect(splitSlides[1]).to.deep.equal({type: "content", items: [{type: "text", text: "asdf3"}, {type: "text", text: "asdf4"}], title: "title"});
        });

    });


    describe("figure and content", () => {
        it("size small slide", () => {
            let slide: Slide = {type: "figure and content", figure: {type: "figure", h: H("q")}, items: [{type: "text", text: "asdf2"}], title: "title"};
            let splitSlides = splitSlide(slide);
            expect(splitSlides.length).to.equal(1);
        });

        it("size big slide", () => {
            let slide: Slide = {type: "figure and content", figure: {type: "figure", h: H("q")}, items: [{type: "text", text: "asdf2"}, {type: "text", text: "asdf3"}], title: "title"};
            let splitSlides = splitSlide(slide);
            expect(splitSlides.length).to.equal(2);
        });

        it("contents small slide", () => {
            let slide: Slide = {type: "figure and content", figure: {type: "figure", h: H("q")}, items: [{type: "text", text: "asdf2"}], title: "title"};
            let splitSlides = splitSlide(slide);
            expect(splitSlides[0]).to.deep.equal(slide);
        });

        it("contents big slide", () => {
            let slide: Slide = {type: "figure and content", figure: {type: "figure", h: H("q")}, items: [{type: "text", text: "asdf2"}, {type: "text", text: "asdf3"}], title: "title"};
            let splitSlides = splitSlide(slide);
            expect(splitSlides[0].type).to.equal("figure and content");
            // @ts-ignore
            expect(splitSlides[0].figure.type).to.equal("figure");
            // @ts-ignore
            expect(splitSlides[0].figure.h.element.tagName).to.equal("Q");
            expect(splitSlides[0].items[0].type).to.equal("text");
            // @ts-ignore
            expect(splitSlides[0].items[0].text).to.equal("asdf2");
            expect(splitSlides[0].items.length).to.equal(1);


            expect(splitSlides[1].type).to.equal("figure and content");
            // @ts-ignore
            expect(splitSlides[1].figure.type).to.equal("figure");
            // @ts-ignore
            expect(splitSlides[1].figure.h.element.tagName).to.equal("Q");
            expect(splitSlides[1].items[0].type).to.equal("text");
            // @ts-ignore
            expect(splitSlides[1].items[0].text).to.equal("asdf3");
            expect(splitSlides[1].items.length).to.equal(1);

        });

    });

});


describe("buildItem", () => {
    it("html", () => {
        let item: Item = {type: "html", h: H("p")};
        let html = buildItem(item);
        expect(html.element.outerHTML).to.deep.equal("<p></p>");
    });

    it("text", () => {
        let item: Item = {type: "text", text: "asdf"};
        let html = buildItem(item);
        expect(html.element.outerHTML).to.equal(`<p style="font-size: 0.7em; line-height: 1.2; text-align: left;">asdf</p>`);
    });

    it("figure", () => {
        let item: Item = {type: "figure", h: H("img")};
        item.h.element.setAttribute("src", "asdf");
        let html = buildItem(item);
        expect(html.element.outerHTML).to.equal("<img src=\"asdf\">");
    });

    it("slide", () => {
        let item: Slide = {type: "title", items: [], title: "title"};
        let html = buildItem(item);
        expect(html.element.outerHTML).to.equal(`<section style="text-align: left;"><div style="margin: 32px;"><h1>title</h1></div></section>`);
    });
});


describe("buildSlide", () => {
    it("title", () => {
        let slide: Slide = {type: "title", items: [], title: "title"};
        let html = buildSlide(slide);
        expect(html.element.outerHTML).to.equal(`<section style="text-align: left;"><div style="margin: 32px;"><h1>title</h1></div></section>`);
    });

    it("title and content", () => {
        let slide: Slide = {type: "content", items: [{type: "text", text: "asdf2"}], title: "asdf1"};
        let html = buildSlide(slide);
        expect(html.element.outerHTML).to.equal(`<section style="text-align: left;"><div style="margin: 32px;"><h1 style="margin-bottom: 48px; text-align: left;">asdf1</h1><ul><li style="font-size: 2.5em; line-height: 1.2; margin-bottom: 24px;"><p style="font-size: 0.7em; line-height: 1.2; text-align: left;">asdf2</p></li></ul></div></section>`);
    });

    it("figure and content", () => {
        let slide: Slide = {type: "figure and content", figure: {type: "figure", h: H("q")}, items:[{type: "text", text: "asdf2"}], title: "asdf1"};
        let html = buildSlide(slide);
        expect(html.element.outerHTML).to.equal(`<section style="text-align: left;"><div style="margin: 32px;"><h1 style="margin-bottom: 48px; text-align: left;">asdf1</h1><table><tr><td style="width: 50%; padding-right: 16px;"><q></q></td><td style="padding-left: 16px;"><ul><li style="font-size: 2.5em; line-height: 1.2; margin-bottom: 24px;"><p style="font-size: 0.7em; line-height: 1.2; text-align: left;">asdf2</p></li></ul></td></tr></table></div></section>`);
    });
});
