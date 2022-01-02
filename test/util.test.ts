import { describe } from 'mocha';
import { expect } from 'chai';
import { htmlToElement, createScriptElement, createScriptSrcElement, getNextSiblings } from '../src/utils';

describe("htmlToElement", () => {
    describe("test element creation", () => {
        it("div", () => {
            let el = htmlToElement("<div>");
            expect(el.element.tagName).to.equal("DIV");
        });

        it("h1", () => {
            let el = htmlToElement("<h1>qwe</h1>");
            expect(el.element.tagName).to.equal("H1");
        });
    });

    describe("test element attributes", () => {
        it("id", () => {
            let el = htmlToElement("<div id='asd'>");
            expect(el.element.id).to.equal("asd");
        });

        it("class", () => {
            let el = htmlToElement("<div class='asd'>");
            expect(el.element.className).to.equal("asd");
        });

    });

    describe("test element children", () => {

        it("element", () => {
            let el = htmlToElement("<div><h1>qwe</h1></div>");
            expect(el.element.children[0].tagName).to.equal("H1");
        });

    });

});

describe("createScriptElement", () => {
    it("element", () => {
        let el = createScriptElement("qwe");
        expect(el.tagName).to.equal("SCRIPT");
    })

    it("type", () => {
        let el = createScriptElement("qwe");
        expect(el.type).to.equal("text/javascript");
    });

    it("code", () => {
        let el = createScriptElement("qwe");
        expect(el.innerText).to.equal("qwe");
    });

});

describe("createScriptSrcElement", () => {
    it("element", () => {
        let el = createScriptSrcElement("qwe", () => {});
        expect(el.tagName).to.equal("SCRIPT");
    })

    it("type", () => {
        let el = createScriptSrcElement("qwe", () => {});
        expect(el.type).to.equal("text/javascript");
    });

    it("src", () => {
        let el = createScriptSrcElement("qwe", () => {});
        expect(el.src).to.equal("qwe");
    });

});

describe("getNextSiblings", () => {
    it("0", () => {
        let el = htmlToElement("<div><h1>qwe</h1></div>");
        expect(getNextSiblings(el.element).length).to.equal(0);
    });

    it("1", () => {
        let el = htmlToElement("<div><h1>qwe</h1><h2>qwe</h2></div>");
        expect(getNextSiblings(el.element.children[0]).length).to.equal(1);
    });
});