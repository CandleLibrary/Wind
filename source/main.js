import { SPACE, HORIZONTAL_TAB } from "./ascii_code_points";

import { jump_table, number_and_identifier_table } from "./tables/basic";

/**
 * The types object bound to Lexer#types
 * @type       {Object}
 * @alias module:wick~internals.lexer.Types
 * @see {@link module:wick.core.common.Lexer}
 */
const number = 1,
    identifier = 2,
    string = 4,
    white_space = 8,
    open_bracket = 16,
    close_bracket = 32,
    operator = 64,
    symbol = 128,
    new_line = 256,
    data_link = 512,
    alpha_numeric = (identifier | number),
    white_space_new_line = (white_space | new_line),
    Types = {
        num: number,
        number,
        id: identifier,
        identifier,
        str: string,
        string,
        ws: white_space,
        white_space,
        ob: open_bracket,
        open_bracket,
        cb: close_bracket,
        close_bracket,
        op: operator,
        operator,
        sym: symbol,
        symbol,
        nl: new_line,
        new_line,
        dl: data_link,
        data_link,
        alpha_numeric,
        white_space_new_line,
    };



/**
 * @classdesc A simple Lexical tokenizer for use with text processing. 
 * 
 * The Lexer parses an input string and yield lexical tokens.  It also provides methods for looking ahead and asserting token values. 
 *
 * There are 9 types of tokens that the Lexer will create:
 * 
 * > 1. **Identifier** - `types.identifier` or `types.id`
 * >    - Any set of characters beginning with `_`|`a-z`|`A-Z`, and followed by `0-9`|`a-z`|`A-Z`|`-`|`_`|`#`|`$`.
 * > 2. **Number** - `types.number` or `types.num`
 * >    - Any set of characters beginning with `0-9`|`.`, and followed by `0-9`|`.`.
 * > 3. **String**: 2 - `types.string` or `types.str`
 * >    - A set of characters beginning with either `'` or `"` and ending with a matching `'` or `"`.
 * > 4. **Open Bracket** - `types.open_bracket` or `types.ob`
 * >    - A single character from the set `<`|`(`|`{`|`[`.
 * > 5. **Close Bracket** - `types.close_bracket` or `types.cb`
 * >    - A single character from the set `>`|`)`|`}`|`]`.
 * > 7. **Operator**: 
 * >    - A single character from the set `*`|`+`|`<`|`=`|`>`|`\`|`&`|`%`|`!`|`|`|`^`|`:`.
 * > 8. **New Line**: 
 * >    - A single `newline` (`LF` or `NL`) character. It may also be `LFCR` if the text is formated for Windows.
 * > 9. **White Space**: 
 * >    - An uninterrupted set of `tab` or `space` characters.
 * > 10. **Symbol**:
 * >        - All other characters not defined by the the above, with each symbol token being comprised of one character.
 * 
 * Types are identified by a binary index value and are defined in Lexer.prototype.types. A token's type can be verified by with 
 * ```js
 * Lexer.token.type === Lexer.types.*`
 * ```
 * @alias Lexer
 * @memberof module:wick.core.common
 * @param {String} string - The string to parse. 
 * @param {Boolean} [IGNORE_WHITE_SPACE=true] - If set to true, the Lexer will not generate tokens for newline and whitespace characters, and instead skip to the next no whitespace/newline token. 
 * @throws     {Error} Throws "String value must be passed to Lexer" if a non-string value is passed as `string`.
 */
class Lexer {

    constructor(string = "", IGNORE_WHITE_SPACE = true, PEEKING = false) {

        if (typeof(string) !== "string") throw new Error("String value must be passed to Lexer");

        /**
         * The string that the Lexer tokenizes.
         */
        this.str = string;

        /**
         * Reference to the peeking Lexer.
         */
        this.p = null;

        /**
         * The type id of the current token.
         */
        this.type = -1;

        /**
         * The offset in the string of the start of the current token.
         */
        this.off = 0;

        /**
         * The length of the current token.
         */
        this.tl = 0;

        /**
         * The character offset of the current token within a line.
         */
        this.char = 0;

        /**
         * The line position of the current token.
         */
        this.line = 0;

        /**
         * The length of the string being parsed
         */
        this.sl = string.length;


        /**
         * Flag to ignore white spaced.
         */
        this.IWS = IGNORE_WHITE_SPACE;

        /**
         * Flag set to true if the end of the string is met.
         */
        this.END = false;

        /**
         * Flag to force the lexer to parse string contents
         */
         this.PARSE_STRING = false;

        if (!PEEKING) this.next();
    }

    /**
     * Restricts max parse distance to the other Lexer's current position.
     * @param      {Lexer}  Lexer   The Lexer to limit parse distance by.
     */
    fence(lexer = this) {
        if (lexer.str !== this.str)
            return;
        this.sl = lexer.off;
        return this;
    }

    /**
     * Reference to token id types.
     */
    get types() {
        return Types;
    }

    /**
     * Copies the Lexer.
     * @return     {Lexer}  Returns a new Lexer instance with the same property values.
     */
    copy() {
        let out = new Lexer(this.str, this.IWS, true);
        out.type = this.type;
        out.off = this.off;
        out.tl = this.tl;
        out.char = this.char;
        out.line = this.line;
        out.sl = this.sl;
        out.END = this.END;
        return out;
    }

    /**
     * Given another Lexer with the same `str` property value, it will copy the state of that Lexer.
     * @param      {Lexer}  [marker=this.peek]  The Lexer to clone the state from. 
     * @throws     {Error} Throws an error if the Lexers reference different strings.
     * @public
     */
    sync(marker = this.p) {

        if (marker instanceof Lexer) {
            if (marker.str !== this.str) throw new Error("Cannot sync Lexers with different strings!");
            this.type = marker.type;
            this.off = marker.off;
            this.tl = marker.tl;
            this.char = marker.char;
            this.line = marker.line;
            this.END = marker.END;
        }

        return this;
    }

    /**
     * Will throw a new Error, appending the parsed string line and position information to the the error message passed into the function.
     * @instance
     * @public
     * @param {String} message - The error message.
     */
    throw (message) {
        let t = ("________________________________________________"),
            n = "\n",
            is_iws = (!this.IWS) ? "\n The Lexer produced whitespace tokens" : "";
        this.IWS = false;
        let pk = this.copy();
        while (!pk.END && pk.ty !== Types.nl) { pk.n(); }
        let end = pk.off;
        throw new Error(message + "at " + this.line + ":" + this.char + n + t + n + this.str.slice(this.off - this.char, end) + n + ("").padStart(this.char - 2) + "^" + n + t + is_iws);
    }

    /**
     * Proxy for Lexer.prototype.reset
     * @public
     */
    r() { return this.reset(); }

    /**
     * Restore the Lexer back to it's initial state.
     * @public
     */
    reset() {
        this.p = null;
        this.type = -1;
        this.off = 0;
        this.tl = 0;
        this.char = 0;
        this.line = 0;
        this.END = false;
        this.n();
        return this;
    }

    resetHead() {
        this.off = 0;
        this.tl = 0;
        this.char = 0;
        this.line = 0;
        this.END = false;
        this.p = null;
        this.type = -1;
    }

    /**
     * Proxy for Lexer.prototype.next
     * @public
     */
    n() { return this.next(); }

    /**
     * Sets the internal state to point to the next token. Sets Lexer.prototype.END to `true` if the end of the string is hit.
     * @public
     * @param {Lexer} [marker=this] - If another Lexer is passed into this method, it will advance the token state of that Lexer.
     */
    next(marker = this) {

        let str = marker.str;

        if (marker.sl < 1) {
            marker.off = -1;
            marker.type = -1;
            marker.tl = 0;
            marker.END = true;
            return marker;
        }

        //Token builder
        let length = marker.tl;
        let off = marker.off + length;
        let l = marker.sl;
        let IWS = marker.IWS;
        let type = symbol;
        let char = marker.char + length;
        let line = marker.line;
        let base = off;

        if (off >= l) {

            marker.END = true;
            length = 0;
            base = l;
            char -= base - off;

            marker.type = type;
            marker.off = base;
            marker.tl = length;
            marker.char = char;
            marker.line = line;

            return marker;
        }

        while (true) {

            base = off;

            length = 1;

            let code = str.charCodeAt(off);

            if (code < 128) {

                switch (jump_table[code]) {
                    case 0: //NUMBER
                        while (++off < l && (12 & number_and_identifier_table[str.charCodeAt(off)])) {}

                        if (str[off] == "e" || str[off] == "E") {
                            off++;
                            if (str[off] == "-") off++;
                            marker.off = off;
                            marker.tl = 0;
                            marker.n();
                            off = marker.off + marker.tl;
                            //Add e to the number string
                        }

                        type = number;
                        length = off - base;

                        break;
                    case 1: //IDENTIFIER
                        while (++off < l && ((10 & number_and_identifier_table[str.charCodeAt(off)]))) {}
                        type = identifier;
                        length = off - base;
                        break;
                    case 2: //QUOTED STRING
                        if (this.PARSE_STRING) {
                            type = symbol;
                        } else {
                            while (++off < l && str.charCodeAt(off) !== code) {}
                            type = string;
                            length = off - base + 1;
                        }
                        break;
                    case 3: //SPACE SET
                        while (++off < l && str.charCodeAt(off) === SPACE) {}
                        type = white_space;
                        length = off - base;
                        break;
                    case 4: //TAB SET
                        while (++off < l && str[off] === HORIZONTAL_TAB) {}
                        type = white_space;
                        length = off - base;
                        break;
                    case 5: //CARIAGE RETURN
                        length = 2;
                    case 6: //LINEFEED
                        type = new_line;
                        char = 0;
                        line++;
                        off += length;
                        break;
                    case 7: //SYMBOL
                        type = symbol;
                        break;
                    case 8: //OPERATOR
                        type = operator;

                        break;
                    case 9: //OPEN BRACKET
                        type = open_bracket;
                        break;
                    case 10: //CLOSE BRACKET
                        type = close_bracket;
                        break;
                    case 11: //Data Link Escape
                        type = data_link;
                        length = 4; //Stores two UTF16 values and a data link sentinel
                        break;
                }
            }

            if (IWS && (type & white_space_new_line)) {
                if (off < l) {
                    char += length;
                    type = symbol;
                    continue;
                } else {
                    length = 0;
                    base = l;
                    char -= base - off;
                    marker.END = true;
                }
            }

            break;
        }

        marker.type = type;
        marker.off = base;
        marker.tl = length;
        marker.char = char;
        marker.line = line;

        return marker;
    }
    

    /**
     * Proxy for Lexer.prototype.assert
     * @public
     */
    a(text) {
        if (this.off < 0) this.throw(`Expecting ${text} got null`);

        if (this.text == text)
            this.next();
        else
            this.throw(`Expecting "${text}" got "${this.text}"`);

        return this;
    }

    /**
     * Compares the string value of the current token to the value passed in. Advances to next token if the two are equal.
     * @public
     * @throws {Error} - `Expecting "${text}" got "${this.text}"`
     * @param {String} text - The string to compare.
     */
    assert(text) {

        if (this.off < 0) this.throw(`Expecting ${text} got null`);

        if (this.text == text)
            this.next();
        else
            this.throw(`Expecting "${text}" got "${this.text}"`);

        return this;
    }

    /**
     * Proxy for Lexer.prototype.assertChcatever
     * @public
     */
    _appendChild_(text) { return this.assert(text); }
    /**
     * Compares the character value of the current token to the value passed in. Advances to next token if the two are equal.
     * @public
     * @throws {Error} - `Expecting "${text}" got "${this.text}"`
     * @param {String} text - The string to compare.
     */
    assertCharacer(char) {

        if (this.off < 0) this.throw(`Expecting ${text} got null`);

        if (this.tx[this.off] == char)
            this.next();
        else
            this.throw(`Expecting "${char}" got "${this.tx}"`);

        return this;
    }

    /**
     * Proxy for Lexer.prototype.peek
     * @public
     * @readonly
     * @type {Lexer}
     */
    get pk() { return this.peek(); }

    /**
     * Returns the Lexer bound to Lexer.prototype.p, or creates and binds a new Lexer to Lexer.prototype.p. Advences the other Lexer to the token ahead of the calling Lexer.
     * @public
     * @type {Lexer}
     * @param {Lexer} [marker=this] - The marker to originate the peek from. 
     * @param {Lexer} [peek_marker=this.p] - The Lexer to set to the next token state.
     * @return {Lexer} - The Lexer that contains the peeked at token.
     */
    peek(marker = this, peek_marker = this.p) {

        if (!peek_marker) {
            if (!marker) return null;
            if (!this.p) {
                this.p = new Lexer(this.str, this.IWS, true);
                peek_marker = this.p;
            }
        }

        peek_marker.type = marker.type;
        peek_marker.off = marker.off;
        peek_marker.tl = marker.tl;
        peek_marker.char = marker.char;
        peek_marker.line = marker.line;
        this.next(peek_marker);
        return peek_marker;
    }

    /**
     * Proxy for Lexer.prototype.text
     * @public
     * @type {String}
     * @readonly
     */
    get tx() { return this.text; }
    /**
     * The string value of the current token.
     * @type {String}
     * @public
     * @readonly
     */
    get text() {
        return (this.off < 0) ? "" : this.str.slice(this.off, this.off + this.tl);
    }

    /**
     * The type id of the current token.
     * @type {Number}
     * @public
     * @readonly
     */
    get ty() { return this.type; }

    /**
     * The current token's offset position from the start of the string.
     * @type {Number}
     * @public
     * @readonly
     */
    get pos() {
        return this.off;
    }

    /**
     * Proxy for Lexer.prototype.slice
     * @public
     */
    s(start) { return this.slice(start); }

    /**
     * Returns a slice of the parsed string beginning at `start` and ending at the current token.
     * @param {Number | LexerBeta} start - The offset in this.str to begin the slice. If this value is a LexerBeta, sets the start point to the value of start.off.
     * @return {String} A substring of the parsed string.
     * @public
     */
    slice(start) {

        if (typeof start === "number" || typeof start === "object") {
            if (start instanceof Lexer) start = start.off;
            return (this.END) ? this.str.slice(start, this.sl) : this.str.slice(start, this.off);
        }
        return this.str.slice(this.off, this.sl);
    }

    get ch() {
        return this.str[this.off];
    }

    /**
     * The current token in the form of a new Lexer with the current state.
     * Proxy property for Lexer.prototype.copy
     * @type {Lexer}
     * @public
     * @readonly
     */
    get token() {
        return this.copy();
    }
    /**
     * Skips to the end of a comment section.
     * @param {boolean} ASSERT - If set to true, will through an error if there is not a comment line or block to skip.
     * @param {Lexer} [marker=this] - If another Lexer is passed into this method, it will advance the token state of that Lexer.
     */
    comment(ASSERT = false, marker = this) {

        if (!(marker instanceof Lexer)) return marker;

        if (marker.tx == "/") {
            if (marker.pk.tx == "*") {
                marker.sync();
                while (!marker.END && (marker.n().tx != "*" || marker.pk.tx != "/")) { /* NO OP */ }
                marker.sync().a("/");
            } else if (marker.pk.tx == "/") {
                let IWS = marker.IWS;
                while (marker.n().ty != types.new_line && !marker.END) { /* NO OP */ }
                marker.IWS = IWS;
                marker.n();
            } else
            if (ASSERT) marker.throw("Expecting the start of a comment");
        }

        return marker;
    }

    get string() {
        return this.str;
    }

    setString(string, reset = true) {
        this.str = string;
        this.sl = string.length;
        if (reset) this.resetHead();
    }

    toString(){
        return this.slice();
    }
}

export default function whind(string, INCLUDE_WHITE_SPACE_TOKENS) { return new Lexer(string, INCLUDE_WHITE_SPACE_TOKENS); };

whind.constructor = Lexer;