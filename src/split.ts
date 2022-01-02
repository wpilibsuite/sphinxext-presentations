export {splitParagraph, getToken};

import {Token, Tokenizer, StringIterator, TokenIterable} from 'lexing';
import { match, select } from 'ts-pattern';
import * as cldrSegmentation from 'cldr-segmentation';

const rules = [
    [/^$/, (m) => Token("EOF", null)],
    [/^\s+/, (m) => Token("Space", " ")],
    [/^\(.*?\)/, (m) => Token("Parenthesis", m[0])],
    [/^".*?"/, (m) => Token("Quote", m[0])],
    [/^'.*?'/, (m) => Token("Quote", m[0])],
    [/^(\.|\!|\?) /, (m) => Token("Punctuation", m[0])],
    [/^(\.|\!|\?)$/, (m) => Token("Punctuation", m[0])],
    // [/^\S+/, (match) => Token("Word", match[0])],
    [/^[^\s]+\.[^\s]+/, (m) => Token("Word", m[0])],
    [/^[^\.\!\?\s]+/, (m) => Token("Word", m[0])],
    [/^\.\.\./, (m) => Token("Word", m[0])],
    [/^(\.|\!|\?)[^\s]+/, (m) => Token("Word", m[0])],
];


// @ts-ignore
const tokenizer = new Tokenizer(rules);

function getToken(text: string) {
    /* Convert a string into a single token */
    const output = tokenizer.map(new StringIterator(text));
    return output.next();
}

function parse(output: TokenIterable<any>): string[] {
    /* Parse a token stream into a list of sentences. */
    let sentences = [];
    let sent = "";
    do {
        var token = output.next();
        sent += 
        match(token)
         .with({name: "EOF", value: select()}, (v) => "")
         .with({name: "Space", value: select()}, (v) => " ")
         .with({name: "Parenthesis", value: select()}, (v) => v)
         .with({name: "Quote", value: select()}, (v) => v)
         .with({name: "Punctuation", value: select()}, (v) => v[0])
         .with({name: "Word", value: select()}, (v) => v)
         .run();
        if (token.name == 'Punctuation' || (token.name == 'EOF' && sent.length > 0)) {
            sentences.push(sent.trim());
            sent = "";
        }
    } while (token.name !== 'EOF');
    return sentences;
}

function splitParagraph(paragraph:string) {
    /* Split a paragraph into sentences. */

    let sentences: string[] = [];

    // ------------------------------------------------------------
    // Custom Lexer

    const output = tokenizer.map(new StringIterator(paragraph));
    sentences = parse(output);

    // ------------------------------------------------------------
    // cldrSegmentation

    // const suppressions = cldrSegmentation.suppressions.en;
    // sentences = cldrSegmentation.sentenceSplit(paragraph, suppressions);

    // sentences = sentences.map((sentence: string) => sentence.trim());

    // ------------------------------------------------------------

    return sentences;

}
