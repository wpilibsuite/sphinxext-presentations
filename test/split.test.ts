import { describe } from 'mocha';
import { expect } from 'chai';
import { getToken, splitParagraph } from '../src/split';

describe("splitParagraph", () => {
    it("newlines", () => {
        let text = "qwe\nqwe\nqwe";
        let result = splitParagraph(text);
        expect(result).to.deep.equal(["qwe qwe qwe"]);
    });

    it("spaces", () => {
        let text = "qwe qwe qwe";
        let result = splitParagraph(text);
        expect(result).to.deep.equal(["qwe qwe qwe"]);
    });

    it("no quotes and no parenthesis", () => {
        let text = "qwe qwe. hello. qwe";
        let result = splitParagraph(text);
        expect(result).to.deep.equal(["qwe qwe.", "hello.", "qwe"]);
    });

    it("quotes", () => {
        let text = "qwe. \"qwe. hello. \". qwe";
        let result = splitParagraph(text);
        expect(result).to.deep.equal(["qwe.", "\"qwe. hello. \".", "qwe"]);
    });

    it("parenthesis", () => {
        let text = "qwe. (qwe. hello. ). qwe";
        let result = splitParagraph(text);
        expect(result).to.deep.equal(["qwe.", "(qwe. hello. ).", "qwe"]);
    })

    it("real world 1", () => {
        let text = "PWM motor controllers can be controlled in the same way as a CAN motor controller. For a more detailed background on how they work, see PWM Motor Controllers in Depth. To use a PWM motor controller, simply use the appropriate motor controller class provided by WPI and supply it the port the motor controller(s) are plugged into on the roboRIO. All approved motor controllers have WPI classes provided for them.";
        let result = splitParagraph(text);
        expect(result).to.deep.equal([
            "PWM motor controllers can be controlled in the same way as a CAN motor controller.",
            "For a more detailed background on how they work, see PWM Motor Controllers in Depth.",
            "To use a PWM motor controller, simply use the appropriate motor controller class provided by WPI and supply it the port the motor controller(s) are plugged into on the roboRIO.",
            "All approved motor controllers have WPI classes provided for them."
        ]);
    });

    it("real world 2", () => {
        let text = "Under the interactive system, the user types OCaml phrases terminated by ;; in response to the # prompt, and the system compiles them on the fly, executes them, and prints the outcome of evaluation. Phrases are either simple expressions, or let definitions of identifiers (either values or functions).";
        let result = splitParagraph(text);
        expect(result).to.deep.equal([
            "Under the interactive system, the user types OCaml phrases terminated by ;; in response to the # prompt, and the system compiles them on the fly, executes them, and prints the outcome of evaluation.",
            "Phrases are either simple expressions, or let definitions of identifiers (either values or functions)."
        ]);
    });

});


describe("tokenizer", () => {
    it("eof", () => { expect(getToken("").name).to.equal("EOF");});
    it("space", () => { expect(getToken(" ").name).to.equal("Space");});
    it("space", () => { expect(getToken("          ").name).to.equal("Space");});
    it("space", () => { expect(getToken("\n").name).to.equal("Space");});
    it("parenthesis", () => { expect(getToken("()").name).to.equal("Parenthesis");});
    it("parenthesis", () => { expect(getToken("(qwe. asd. 1.23 )").name).to.equal("Parenthesis");});
    it("quote", () => { expect(getToken("\"qwe. asd. 1.23 \"").name).to.equal("Quote");});
    it("quote", () => { expect(getToken("\'qwe. asd. 1.23 \'").name).to.equal("Quote");});
    it("punctuation", () => { expect(getToken(".").name).to.equal("Punctuation");});
    it("punctuation", () => { expect(getToken("?").name).to.equal("Punctuation");});
    it("punctuation", () => { expect(getToken("!").name).to.equal("Punctuation");});
    it("punctuation", () => { expect(getToken(". ").name).to.equal("Punctuation");});
    it("punctuation", () => { expect(getToken("? ").name).to.equal("Punctuation");});
    it("punctuation", () => { expect(getToken("! ").name).to.equal("Punctuation");});
    it("word", () => { expect(getToken("hello").name).to.equal("Word");});
    it("word", () => { expect(getToken("1.23").name).to.equal("Word");});
    it("word", () => { expect(getToken(".toggle()").name).to.equal("Word");});
    it("word", () => { expect(getToken("...").name).to.equal("Word");});
});