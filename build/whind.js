const HORIZONTAL_TAB = 9;
const SPACE = 32;

/**
 * Lexer Jump table reference 
 * 0. NUMBER
 * 1. IDENTIFIER
 * 2. QUOTE STRING
 * 3. SPACE SET
 * 4. TAB SET
 * 5. CARIAGE RETURN
 * 6. LINEFEED
 * 7. SYMBOL
 * 8. OPERATOR
 * 9. OPEN BRACKET
 * 10. CLOSE BRACKET 
 * 11. DATA_LINK
 */ 
const jump_table = [
7, 	 	/* A */
7, 	 	/* a */
7, 	 	/* ACKNOWLEDGE */
7, 	 	/* AMPERSAND */
7, 	 	/* ASTERISK */
7, 	 	/* AT */
7, 	 	/* B */
7, 	 	/* b */
7, 	 	/* BACKSLASH */
4, 	 	/* BACKSPACE */
6, 	 	/* BELL */
7, 	 	/* C */
7, 	 	/* c */
5, 	 	/* CANCEL */
7, 	 	/* CARET */
11, 	/* CARRIAGE_RETURN */
7, 	 	/* CLOSE_CURLY */
7, 	 	/* CLOSE_PARENTH */
7, 	 	/* CLOSE_SQUARE */
7, 	 	/* COLON */
7, 	 	/* COMMA */
7, 	 	/* d */
7, 	 	/* D */
7, 	 	/* DATA_LINK_ESCAPE */
7, 	 	/* DELETE */
7, 	 	/* DEVICE_CTRL_1 */
7, 	 	/* DEVICE_CTRL_2 */
7, 	 	/* DEVICE_CTRL_3 */
7, 	 	/* DEVICE_CTRL_4 */
7, 	 	/* DOLLAR */
7, 	 	/* DOUBLE_QUOTE */
7, 	 	/* e */
3, 	 	/* E */
8, 	 	/* EIGHT */
2, 	 	/* END_OF_MEDIUM */
7, 	 	/* END_OF_TRANSMISSION */
7, 	 	/* END_OF_TRANSMISSION_BLOCK */
8, 	 	/* END_OF_TXT */
8, 	 	/* ENQUIRY */
2, 	 	/* EQUAL */
9, 	 	/* ESCAPE */
10, 	 /* EXCLAMATION */
8, 	 	/* f */
8, 	 	/* F */
7, 	 	/* FILE_SEPERATOR */
7, 	 	/* FIVE */
7, 	 	/* FORM_FEED */
7, 	 	/* FORWARD_SLASH */
0, 	 	/* FOUR */
0, 	 	/* g */
0, 	 	/* G */
0, 	 	/* GRAVE */
0, 	 	/* GREATER_THAN */
0, 	 	/* GROUP_SEPERATOR */
0, 	 	/* h */
0, 	 	/* H */
0, 	 	/* HASH */
0, 	 	/* HORIZONTAL_TAB */
8, 	 	/* HYPHEN */
7, 	 	/* i */
8, 	 	/* I */
8, 	 	/* j */
8, 	 	/* J */
7, 	 	/* k */
7, 	 	/* K */
1, 	 	/* l */
1, 	 	/* L */
1, 	 	/* LESS_THAN */
1, 	 	/* LINE_FEED */
1, 	 	/* m */
1, 	 	/* M */
1, 	 	/* n */
1, 	 	/* N */
1, 	 	/* NEGATIVE_ACKNOWLEDGE */
1, 	 	/* NINE */
1, 	 	/* NULL */
1, 	 	/* o */
1, 	 	/* O */
1, 	 	/* ONE */
1, 	 	/* OPEN_CURLY */
1, 	 	/* OPEN_PARENTH */
1, 	 	/* OPEN_SQUARE */
1, 	 	/* p */
1, 	 	/* P */
1, 	 	/* PERCENT */
1, 	 	/* PERIOD */
1, 	 	/* PLUS */
1, 	 	/* q */
1, 	 	/* Q */
1, 	 	/* QMARK */
1, 	 	/* QUOTE */
9, 	 	/* r */
7, 	 	/* R */
10, 	/* RECORD_SEPERATOR */
7, 	 	/* s */
7, 	 	/* S */
2, 	 	/* SEMICOLON */
1, 	 	/* SEVEN */
1, 	 	/* SHIFT_IN */
1, 	 	/* SHIFT_OUT */
1, 	 	/* SIX */
1, 	 	/* SPACE */
1, 	 	/* START_OF_HEADER */
1, 	 	/* START_OF_TEXT */
1, 	 	/* SUBSTITUTE */
1, 	 	/* SYNCH_IDLE */
1, 	 	/* t */
1, 	 	/* T */
1, 	 	/* THREE */
1, 	 	/* TILDE */
1, 	 	/* TWO */
1, 	 	/* u */
1, 	 	/* U */
1, 	 	/* UNDER_SCORE */
1, 	 	/* UNIT_SEPERATOR */
1, 	 	/* v */
1, 	 	/* V */
1, 	 	/* VERTICAL_BAR */
1, 	 	/* VERTICAL_TAB */
1, 	 	/* w */
1, 	 	/* W */
1, 	 	/* x */
1, 	 	/* X */
9, 	 	/* y */
7, 	 	/* Y */
10,  	/* z */
7,  	/* Z */
7 		/* ZERO */
];	

/**
 * LExer Number and Identifier jump table reference
 * Number are masked by 12(4|8) and Identifiers are masked by 10(2|8)
 * entries marked as `0` are not evaluated as either being in the number set or the identifier set.
 * entries marked as `2` are in the identifier set but not the number set
 * entries marked as `4` are in the number set but not the identifier set
 * entries marked as `8` are in both number and identifier sets
 */
const number_and_identifier_table = [
0, 		/* A */
0, 		/* a */
0, 		/* ACKNOWLEDGE */
0, 		/* AMPERSAND */
0, 		/* ASTERISK */
0, 		/* AT */
0,		/* B */
0,		/* b */
0,		/* BACKSLASH */
0,		/* BACKSPACE */
0,		/* BELL */
0,		/* C */
0,		/* c */
0,		/* CANCEL */
0,		/* CARET */
0,		/* CARRIAGE_RETURN */
0,		/* CLOSE_CURLY */
0,		/* CLOSE_PARENTH */
0,		/* CLOSE_SQUARE */
0,		/* COLON */
0,		/* COMMA */
0,		/* d */
0,		/* D */
0,		/* DATA_LINK_ESCAPE */
0,		/* DELETE */
0,		/* DEVICE_CTRL_1 */
0,		/* DEVICE_CTRL_2 */
0,		/* DEVICE_CTRL_3 */
0,		/* DEVICE_CTRL_4 */
0,		/* DOLLAR */
0,		/* DOUBLE_QUOTE */
0,		/* e */
0,		/* E */
0,		/* EIGHT */
0,		/* END_OF_MEDIUM */
0,		/* END_OF_TRANSMISSION */
8,		/* END_OF_TRANSMISSION_BLOCK */
0,		/* END_OF_TXT */
0,		/* ENQUIRY */
0,		/* EQUAL */
0,		/* ESCAPE */
0,		/* EXCLAMATION */
0,		/* f */
0,		/* F */
0,		/* FILE_SEPERATOR */
2,		/* FIVE */
4,		/* FORM_FEED */
0,		/* FORWARD_SLASH */
8,		/* FOUR */
8,		/* g */
8,		/* G */
8,		/* GRAVE */
8,		/* GREATER_THAN */
8,		/* GROUP_SEPERATOR */
8,		/* h */
8,		/* H */
8,		/* HASH */
8,		/* HORIZONTAL_TAB */
0,		/* HYPHEN */
0,		/* i */
0,		/* I */
0,		/* j */
0,		/* J */
0,		/* k */
0,		/* K */
2,		/* l */
8,		/* L */
2,		/* LESS_THAN */
2,		/* LINE_FEED */
8,		/* m */
2,		/* M */
2,		/* n */
2,		/* N */
2,		/* NEGATIVE_ACKNOWLEDGE */
2,		/* NINE */
2,		/* NULL */
2,		/* o */
2,		/* O */
2,		/* ONE */
8,		/* OPEN_CURLY */
2,		/* OPEN_PARENTH */
2,		/* OPEN_SQUARE */
2,		/* p */
2,		/* P */
2,		/* PERCENT */
2,		/* PERIOD */
2,		/* PLUS */
2,		/* q */
8,		/* Q */
2,		/* QMARK */
2,		/* QUOTE */
0,		/* r */
0,		/* R */
0,		/* RECORD_SEPERATOR */
0,		/* s */
2,		/* S */
0,		/* SEMICOLON */
2,		/* SEVEN */
8,		/* SHIFT_IN */
2,		/* SHIFT_OUT */
2,		/* SIX */
2,		/* SPACE */
2,		/* START_OF_HEADER */
2,		/* START_OF_TEXT */
2,		/* SUBSTITUTE */
2,		/* SYNCH_IDLE */
2,		/* t */
2,		/* T */
2,		/* THREE */
2,		/* TILDE */
2,		/* TWO */
8,		/* u */
2,		/* U */
2,		/* UNDER_SCORE */
2,		/* UNIT_SEPERATOR */
2,		/* v */
2,		/* V */
2,		/* VERTICAL_BAR */
2,		/* VERTICAL_TAB */
2,		/* w */
8,		/* W */
2,		/* x */
2,		/* X */
0,		/* y */
0,		/* Y */
0,		/* z */
0,		/* Z */
0		/* ZERO */
];

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
        let t$$1 = ("________________________________________________"),
            n$$1 = "\n",
            is_iws = (!this.IWS) ? "\n The Lexer produced whitespace tokens" : "";
        this.IWS = false;
        let pk = this.copy();
        while (!pk.END && pk.ty !== Types.nl) { pk.n(); }
        let end = pk.off;
        throw new Error(message + "at " + this.line + ":" + this.char + n$$1 + t$$1 + n$$1 + this.str.slice(this.off - this.char, end) + n$$1 + ("").padStart(this.char - 2) + "^" + n$$1 + t$$1 + is_iws);
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
        let l$$1 = marker.sl;
        let IWS = marker.IWS;
        let type = symbol;
        let char = marker.char + length;
        let line = marker.line;
        let base = off;

        if (off >= l$$1) {

            marker.END = true;
            length = 0;
            base = l$$1;
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
                        while (++off < l$$1 && (12 & number_and_identifier_table[str.charCodeAt(off)])) {}

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
                        while (++off < l$$1 && ((10 & number_and_identifier_table[str.charCodeAt(off)]))) {}
                        type = identifier;
                        length = off - base;
                        break;
                    case 2: //QUOTED STRING
                        if (this.PARSE_STRING) {
                            type = symbol;
                        } else {
                            while (++off < l$$1 && str.charCodeAt(off) !== code) {}
                            type = string;
                            length = off - base + 1;
                        }
                        break;
                    case 3: //SPACE SET
                        while (++off < l$$1 && str.charCodeAt(off) === SPACE) {}
                        type = white_space;
                        length = off - base;
                        break;
                    case 4: //TAB SET
                        while (++off < l$$1 && str[off] === HORIZONTAL_TAB) {}
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
                if (off < l$$1) {
                    char += length;
                    type = symbol;
                    continue;
                } else {
                    length = 0;
                    base = l$$1;
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

function whind(string, INCLUDE_WHITE_SPACE_TOKENS) { return new Lexer(string, INCLUDE_WHITE_SPACE_TOKENS); }
whind.constructor = Lexer;

export default whind;
