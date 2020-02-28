declare const j: Uint16Array;
/**
 * Lexer Number and Identifier jump table reference
 * Number are masked by 12(4|8) and Identifiers are masked by 10(2|8)
 * entries marked as `0` are not evaluated as either being in the number set or the identifier set.
 * entries marked as `2` are in the identifier set but not the number set
 * entries marked as `4` are in the number set but not the identifier set
 * entries marked as `8` are in both number and identifier sets
 * entries marked as `8` are in number, identifier, hex, bin, and oct sets;
 */
export declare const id = 2, num = 4, hex = 16, oct = 32, bin = 64;
export { j as jump_table };
