import wind from "../build/library/wind.js";

"Wind Test Suite";
const test_string = `
        Here in lies all that matters: a nuൗmber, 101, a symbol, #, a string,
        "some day", the brackets, [{<()>}], and the rest, +=!@.

    `;

const test_string2 = `
        Here in lies all that matters: a nuൗmber, 101, a symbol, #, a string,
            "some day", the brackets, [{<()>}], and the rest, +=!@.
        This is a another line that contains far less then it should.
    `;

"Identifies Wind Lexer Types";
{
    "#";
    const a = wind("0o123456");
    a.USE_EXTENDED_NUMBER_TYPES = true;
    a.reset();
    ((a.ty == wind.types.oct));

}
{
    "#";
    const a = wind("0x123456");
    a.USE_EXTENDED_NUMBER_TYPES = true;
    a.reset();
    ((a.ty == wind.types.hex));
}

let types = wind.types;

"Correctly parses string, ignoring whites space, and creates token lexemes matching character syntax.";
{

    let lex = wind(test_string);
    "test name";
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
}


"Finds the end of string without missing any tokens";
{

    let lex = wind("This is 'the' string");
    let compare = ["This", "is", "'the'", "string"];
    let i = 0;

    while (!lex.END) {
        ((lex.tx = compare[i]));
        i++;
        lex.n;
    };

    ((i == 4));
}

"Is able to find the start of a matched substring";
{
    ((wind(test_string2).find("[{<(").tx == "["));
    ((wind(test_string2).find("rest, +").tx == "rest"));
    ((wind(test_string2).find("nuൗmber").tx == "nuൗmber"));
};

/*
"Creates a meaningful syntax error message";
{
    const lex = wind(test_string2);
    let r = lex.find("[{<(");

    ((r.errorMessage(`[ ${r.tx} ]`) == `[ [ ] at 3:39
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 2: 
        Here in lies all that matters: a nuൗmber, 101, a symbol, #, a string,
 3:             "some day", the brackets, [{<()>}], and the rest, +=!@.           
──────────────────────────────────────────⮉
 4:         This is a another line that contains far less then it should.         
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`));

    r = lex.find("nuൗmber");

    ((r.errorMessage(`[ ${r.tx} ]`) == `[ nuൗmber ] at 1:41
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 1: ... all that matters: a nuൗmber, 101, a symb ...
────────────────────────────⮉
 2: ... , the brackets, [{<()>}], and the rest,  ...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`));

}
*/


"Creates Error Message";
{
    const lex = wind("test message that this is the best test message.");

    "This is the new test name";
    ((lex.createWindSyntaxError("test")));
}