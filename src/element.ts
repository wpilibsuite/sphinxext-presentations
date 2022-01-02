"use strict";

export {H, Hwrappable, _H};

type Hwrappable = _H | HTMLElement | string | Element | Node

function H(element: Hwrappable) {
    if (element instanceof _H) return element
    if (element instanceof HTMLElement) return new _H(element)
    if (element instanceof Element) return new _H(element as HTMLElement)
    if (element instanceof Node) return new _H(element as HTMLElement)

    return new _H(document.createElement(element))
}

class _H {
    element: HTMLElement

    constructor(element: HTMLElement) {
        this.element = element
    }

    prepend(elements: Hwrappable | Hwrappable[]) {
        if (!Array.isArray(elements)) elements = [elements]
        this.element.prepend(...elements.map(e => H(e).element))
        return this
    }

    append(elements: Hwrappable | Hwrappable[]) {
        if (!Array.isArray(elements)) elements = [elements]
        this.element.append(...elements.map(e => H(e).element))
        return this
    }

    class(name: string = "") {
        this.element.className = name
        return this
    }

    addClass(name: string) {
        this.element.classList.add(name)
        return this
    }

    id(name: string) {
        this.element.id = name
        return this
    }

    copy() {
        return H(this.element.cloneNode(false) as HTMLElement)
    }

    deepcopy() {
        return H(this.element.cloneNode(true) as HTMLElement)
    }

}
