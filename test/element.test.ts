import { describe } from 'mocha';
import { expect } from 'chai';
import {H, Hwrappable, _H} from '../src/element';

describe("H", () => {
    it("_H", () => {
        let h: _H = H("a");
        expect(H(h)).to.equal(h);
    });
    it("HTMLElement", () => {
        let h: HTMLElement = H("a").element;
        expect(H(h).element).to.equal(h);
    });
    it("Element", () => {
        let h: Element = H("a").element;
        expect(H(h).element).to.equal(h as HTMLElement);
    });
    it("Node", () => {
        let h: Node = H("a").element.cloneNode();
        expect(H(h).element).to.equal(h as HTMLElement);
    })
});

describe("prepend", () => {
    it("Hwrappable", () => {
        let h: _H = H("a");
        let h2: _H = H("b");
        h.prepend(h2);
        expect(h.element.firstChild).to.equal(h2.element);
    });
    it("Hwrappable[]", () => {
        let h: _H = H("a");
        let h2: _H = H("b");
        h.prepend([h2]);
        expect(h.element.firstChild).to.equal(h2.element);
    });
});

describe("append", () => {
    it("Hwrappable", () => {
        let h: _H = H("a");
        let h2: _H = H("b");
        h.append(h2);
        expect(h.element.lastChild).to.equal(h2.element);
    });
    it("Hwrappable[]", () => {
        let h: _H = H("a");
        let h2: _H = H("b");
        h.append([h2]);
        expect(h.element.lastChild).to.equal(h2.element);
    });
});

describe("class", () => {
    it("name", () => {
        let h: _H = H("a");
        h.class("a");
        expect(h.element.className).to.equal("a");
    });
});

describe("id", () => {
    it("name", () => {
        let h: _H = H("a");
        h.id("a");
        expect(h.element.id).to.equal("a");
    });
});

describe("addClass", () => {
    it("name", () => {
        let h: _H = H("a");
        h.addClass("a");
        expect(h.element.classList.contains("a")).to.be.true;
    });
});

describe("copy", () => {
    it("copy", () => {
        let h: _H = H("a");
        let h2: _H = h.copy();
        expect(h2.element.outerHTML).to.equal(h.element.outerHTML);
    });

    it("deepcopy", () => {
        let h: _H = H("a");
        let h2: _H = h.deepcopy();
        expect(h2.element.outerHTML).to.equal(h.element.outerHTML);
    });

})