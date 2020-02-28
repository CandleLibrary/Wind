declare enum TokenType {
    number = 1,
    num = 1,
    identifier = 2,
    string = 4,
    white_space = 8,
    open_bracket = 16,
    close_bracket = 32,
    operator = 64,
    symbol = 128,
    new_line = 256,
    data_link = 512,
    number_bin = 1025,
    number_oct = 2049,
    number_hex = 4097,
    number_int = 8193,
    number_sci = 16385,
    number_flt = 32769,
    alpha_numeric = 3,
    white_space_new_line = 264,
    id = 2,
    str = 4,
    ws = 8,
    ob = 16,
    cb = 32,
    op = 64,
    sym = 128,
    nl = 256,
    dl = 512,
    int = 8193,
    integer = 8193,
    bin = 1025,
    binary = 1025,
    oct = 2049,
    octal = 2049,
    hex = 4097,
    hexadecimal = 4097,
    flt = 32769,
    float = 32769,
    sci = 16385,
    scientific = 16385
}
declare type SymbolMap = Map<number, number | SymbolMap> & {
    IS_SYM: boolean;
};
/**
 * Partially configurable token producing lexer.
 */
declare class Lexer {
    char: number;
    tk: number;
    type: TokenType;
    off: number;
    line: number;
    tl: number;
    sl: number;
    masked_values: number;
    str: string;
    p: Lexer;
    symbol_map: SymbolMap;
    id_lu: Uint16Array;
    addCharacter: any;
    static types: typeof TokenType;
    /**
     *
     * @param string
     * @param INCLUDE_WHITE_SPACE_TOKENS
     * @param PEEKING
     */
    constructor(string?: string, INCLUDE_WHITE_SPACE_TOKENS?: boolean, PEEKING?: boolean);
    /**
     * Restore the Lexer back to it's initial state.
     * @public
     */
    reset(): Lexer;
    resetHead(): void;
    /**
     * Copies the data to a new Lexer object.
     * @return {Lexer}  Returns a new Lexer instance with the same property values.
     */
    copy(destination?: Lexer): Lexer;
    /**
     * Given another Lexer with the same `str` property value, it will copy the state of that Lexer.
     * @param      {Lexer}  [marker=this.peek]  The Lexer to clone the state from.
     * @throws     {Error} Throws an error if the Lexers reference different strings.
     * @public
     */
    sync(marker?: Lexer): Lexer;
    /**
     * Sets the internal state to point to the next token. Sets Lexer.prototype.END to `true` if the end of the string is hit.
     * @public
     * @param {Lexer} [marker=this] - If another Lexer is passed into this method, it will advance the token state of that Lexer.
     */
    next(marker?: Lexer, USE_CUSTOM_SYMBOLS?: boolean): Lexer;
    /**
     * Restricts max parse distance to the other Lexer's current position.
     * @param      {Lexer}  Lexer   The Lexer to limit parse distance by.
     */
    fence(marker?: this): Lexer;
    /**
        Looks for the string within the text and returns a new lexer at the location of the first occurance of the token or
    */
    find(string: string): Lexer;
    /**
     * Creates an error message with a diagram illustrating the location of the error.
     */
    errorMessage(message?: string, window_size?: number, tab_size?: number): string;
    errorMessageWithIWS(...v: string[]): string;
    /**
     * Will throw a new Error, appending the parsed string line and position information to the the error message passed into the function.
     * @instance
     * @public
     * @param {String} message - The error message.
     */
    throw(message: string): never;
    /**
     * Proxy for Lexer.prototype.reset
     * @public
     */
    r(): Lexer;
    /**
     * Proxy for Lexer.prototype.assert
     * @public
     */
    a(text: string): Lexer;
    /**
     * Compares the string value of the current token to the value passed in. Advances to next token if the two are equal.
     * @public
     * @throws {Error} - `Expecting "${text}" got "${this.text}"`
     * @param {String} text - The string to compare.
     */
    assert(text: string): Lexer;
    /**
     * Proxy for Lexer.prototype.assertCharacter
     * @public
     */
    aC(char: string): Lexer;
    /**
     * Compares the character value of the current token to the value passed in. Advances to next token if the two are equal.
     * @public
     * @throws {Error} - `Expecting "${text}" got "${this.text}"`
     * @param {String} text - The string to compare.
     */
    assertCharacter(char: string): Lexer;
    /**
     * Returns the Lexer bound to Lexer.prototype.p, or creates and binds a new Lexer to Lexer.prototype.p. Advences the other Lexer to the token ahead of the calling Lexer.
     * @public
     * @type {Lexer}
     * @param {Lexer} [marker=this] - The marker to originate the peek from.
     * @param {Lexer} [peeking_marker=this.p] - The Lexer to set to the next token state.
     * @return {Lexer} - The Lexer that contains the peeked at token.
     */
    peek(marker?: Lexer, peeking_marker?: Lexer): Lexer;
    /**
     * Proxy for Lexer.prototype.slice
     * @public
     */
    s(start: number | Lexer): string;
    /**
     * Returns a slice of the parsed string beginning at `start` and ending at the current token.
     * @param {Number | LexerBeta} start - The offset in this.str to begin the slice. If this value is a LexerBeta, sets the start point to the value of start.off.
     * @return {String} A substring of the parsed string.
     * @public
     */
    slice(start?: number | Lexer): string;
    /**
     * Skips to the end of a comment section.
     * @param {boolean} ASSERT - If set to true, will through an error if there is not a comment line or block to skip.
     * @param {Lexer} [marker=this] - If another Lexer is passed into this method, it will advance the token state of that Lexer.
     */
    comment(ASSERT?: boolean, marker?: Lexer): Lexer;
    /**
     * Replaces the string the Lexer is tokenizing.
     * @param string - New string to replace the existing one with.
     * @param RESET - Flag that if set true will reset the Lexers position to the start of the string
     */
    setString(string: string, RESET?: boolean): void;
    toString(): string;
    /**
     * Returns new Whind Lexer that has leading and trailing whitespace characters removed from input.
     * @param leave_leading_amount - Maximum amount of leading space caracters to leave behind. Default is zero
     * @param leave_trailing_amount - Maximum amount of trailing space caracters to leave behind. Default is zero
     */
    trim(leave_leading_amount?: number, leave_trailing_amount?: number): Lexer;
    /**
     * Adds symbol to symbol_map. This allows custom symbols to be defined and tokenized by parser.
    */
    addSymbol(sym: string): void;
    /** Getters and Setters ***/
    get string(): string;
    get string_length(): number;
    set string_length(s: number);
    /**
     * The current token in the form of a new Lexer with the current state.
     * Proxy property for Lexer.prototype.copy
     * @type {Lexer}
     * @public
     * @readonly
     */
    get token(): Lexer;
    get ch(): string;
    /**
     * Proxy for Lexer.prototype.text
     * @public
     * @type {String}
     * @readonly
     */
    get tx(): string;
    /**
     * The string value of the current token.
     * @type {string}
     * @public
     * @readonly
     */
    get text(): string;
    /**
     * The type id of the current token.
     * @type {TokenType}
     * @public
     * @readonly
     */
    get ty(): TokenType;
    /**
     * The current token's offset position from the start of the string.
     * @type {Number}
     * @public
     * @readonly
     */
    get pos(): number;
    /**
     * Proxy for Lexer.prototype.peek
     * @public
     * @readonly
     * @type {Lexer}
     */
    get pk(): Lexer;
    /**
     * Proxy for Lexer.prototype.next
     * @public
     */
    get n(): Lexer;
    /**
     * Boolean value set to true if position of Lexer is at the end of the string.
     */
    get END(): boolean;
    set END(v: boolean);
    /**
        get type() {
            return 1 << (this.masked_values & TYPE_MASK);
        }

        set type(value) {
            //assuming power of 2 value.
            this.masked_values = (this.masked_values & ~TYPE_MASK) | ((getNumbrOfTrailingZeroBitsFromPowerOf2(value)) & TYPE_MASK);
        }
    */
    /**
    get tl() {
        return this.token_length;
    }

    set tl(valmjsue) {
        this.token_length = value;
    }

    get token_length() {
        return ((this.masked_values & TOKEN_LENGTH_MASK) >> 8);
    }

    set token_length(value) {
        this.masked_values = (this.masked_values & ~TOKEN_LENGTH_MASK) | (((value << 8) | 0) & TOKEN_LENGTH_MASK);
    }
    */
    get IGNORE_WHITE_SPACE(): boolean;
    set IGNORE_WHITE_SPACE(bool: boolean);
    get CHARACTERS_ONLY(): boolean;
    set CHARACTERS_ONLY(boolean: boolean);
    get IWS(): boolean;
    set IWS(boolean: boolean);
    get PARSE_STRING(): boolean;
    set PARSE_STRING(boolean: boolean);
    get USE_EXTENDED_ID(): boolean;
    set USE_EXTENDED_ID(boolean: boolean);
    get USE_EXTENDED_NUMBER_TYPES(): boolean;
    set USE_EXTENDED_NUMBER_TYPES(boolean: boolean);
    /**
     * Reference to token id types.
     */
    get types(): typeof TokenType;
}
declare function whind(string: string, INCLUDE_WHITE_SPACE_TOKENS?: boolean): Lexer;
declare namespace whind {
    var constructor: typeof Lexer;
    var types: typeof TokenType;
}
import * as ascii from "./ascii_code_points.js";
export { Lexer, ascii, TokenType };
export default whind;
