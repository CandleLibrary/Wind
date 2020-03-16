import whind from "../build/library/whind.js";

"Lexer Tests";

const test_string = `
        Here in lies all that matters: a nuൗmber, 101, a symbol, #, a string,
        "some day", the brackets, [{<()>}], and the rest, +=!@.

    `;

const test_string2 = `
        Here in lies all that matters: a nuൗmber, 101, a symbol, #, a string,
            "some day", the brackets, [{<()>}], and the rest, +=!@.
        This is a another line that contains far less then it should.
    `;

let types = whind.types;

"Correctly parses string, ignoring whites space, and creates token lexums matching character syntax.";
{
    let lex = whind(test_string);

    ((lex.tx == "Here"));

    lex.n.n.n.n;
    ((lex.tx == "that"));

    lex.n.n;
    ((lex.ch == ":"));

    let lex_copy = lex.copy();

    lex_copy.off += 1;

    lex.n.n.n.n;
    ((lex.ty == types.number));

    lex.n;
    ((lex.slice(lex_copy) == " a nuൗmber, 101"));

    lex.n.n.n.n;
    ((lex.ty == types.symbol));

    lex.n.n.n.n.n;
    ((lex.ty == types.string));

    lex.n.n.n.n.n;
    ((lex.ty == types.open_bracket));

    ((lex.ch == "["));

    lex.n;
    ((lex.ty == types.open_bracket));

    ((lex.ch == "{"));

    lex.n;
    ((lex.ty == types.operator));
    ((lex.ch == "<"));

    lex.n;
    ((lex.ty == types.open_bracket));
    ((lex.ch == "("));

    lex.n;
    ((lex.ty == types.close_bracket));

    lex.n;
    ((lex.ty == types.operator));

    lex.n;
    ((lex.ty == types.close_bracket));

    lex.n;
    ((lex.ty == types.close_bracket));

    lex.n;
    ((lex.ty == types.symbol));

    let start = lex.pos + 1;
    lex.n.n.n.n;
    ((lex.ch == ","));

    lex.n;
    ((lex.slice(start) == " and the rest, "));
    ((lex.ty == types.operator));

    lex.n;
    ((lex.ty == types.operator));

    lex.n;
    ((lex.ty == types.operator));

    lex.n;
    ((lex.ty == types.symbol));

    lex.n;
    ((lex.ty == types.symbol));

    lex.n;
    ((lex.END == true));
};

"Finds the end of string without missing any tokens";
{
    let lex = whind("This is 'the' string");

    let compare = ["This", "is", "'the'", "string"];

    let i = 0;

    while (!lex.END) {
        ((lex.tx == compare[i]));
        i++;
        lex.n;
    };

    ((i == 4));

};

"Is able to find the start of a matched substring";
{
    ((whind(test_string2).find("[{<(").tx == "["));
    ((whind(test_string2).find("rest, +").tx == "rest"));
    ((whind(test_string2).find("nuൗmber").tx == "nuൗmber"));
}; 