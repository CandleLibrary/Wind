import chai from "chai";
chai.should();

const test_string = `
        Here in lies all that matters: a nuൗmber, 101, a symbol, #, a string,
        "some day", the brackets, [{<()>}], and the rest, +=!@.

    `;

    const test_string2 = `
        Here in lies all that matters: a nuൗmber, 101, a symbol, #, a string,
            "some day", the brackets, [{<()>}], and the rest, +=!@.
        This is a another line that contains far less then it should.
    `;


import whind from "../source/whind.mjs";

const constr = whind.constructor;

describe("Test", function() {

    let types = whind.types;

    it("Correctly parses string, ignoring whites space, and creates token lexums matching character syntax.", function() {
        let lex = whind(test_string);
        lex.tx.should.equal("Here");
        lex.n.n.n.n.tx.should.equal("that");
        lex.n.n.ch.should.equal(":");
        let lex_copy = lex.copy();
        lex_copy.off += 1;
        lex.n.n.n.n.ty.should.equal(types.number);
        lex.n.slice(lex_copy).should.equal(" a nuൗmber, 101");
        lex.n.n.n.n.ty.should.equal(types.symbol);
        lex.n.n.n.n.n.ty.should.equal(types.string);
        lex.n.n.n.n.n.ty.should.equal(types.open_bracket);
        lex.ch.should.equal("[");
        lex.n.ty.should.equal(types.open_bracket);
        lex.ch.should.equal("{");
        lex.n.ty.should.equal(types.operator);
        lex.ch.should.equal("<");
        lex.n.ty.should.equal(types.open_bracket);
        lex.ch.should.equal("(");
        lex.n.ty.should.equal(types.close_bracket);
        lex.n.ty.should.equal(types.operator);
        lex.n.ty.should.equal(types.close_bracket);
        lex.n.ty.should.equal(types.close_bracket);
        lex.n.ty.should.equal(types.symbol);
        let start = lex.pos + 1;
        lex.n.n.n.n.ch.should.equal(",");
        lex.n.slice(start).should.equal(" and the rest, ");
        lex.ty.should.equal(types.operator);
        lex.n.ty.should.equal(types.operator);
        lex.n.ty.should.equal(types.operator);
        lex.n.ty.should.equal(types.symbol);
        lex.n.ty.should.equal(types.symbol);
        lex.n.END.should.equal(true);
    });

    it("Finds the end of string without missing any tokens", function(){
        let lex = whind("This is 'the' string");
        let compare = ["This", "is", "'the'", "string"];
        let i = 0;

        while(!lex.END){
            lex.tx.should.equal(compare[i]);
            i++;
            lex.n;
        };

        i.should.equal(4);

    });

    it("Is able to find the start of a matched substring", function(){
        whind(test_string2).find("[{<(").tx.should.equal("[");
        whind(test_string2).find("rest, +").tx.should.equal("rest");
        whind(test_string2).find("nuൗmber").tx.should.equal("nuൗmber");
    });

    it("Creates a meaningful syntax error message", function(){
        const lex = whind(test_string2);
        let r = lex.find("[{<(");
        r.errorMessage(`[ ${r.tx} ]`).should.equal(
`[ [ ] at 2:38
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 1: ... ies all that matters: a nuൗmber, 101, a  ...
 2: ... day", the brackets, [{<()>}], and the re ...
────────────────────────────⮉
 3: ... another line that contains far less then ...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        r = lex.find("nuൗmber");
        r.errorMessage(`[ ${r.tx} ]`).should.equal(
`[ nuൗmber ] at 1:41
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 1: ... all that matters: a nuൗmber, 101, a symb ...
────────────────────────────⮉
 2: ... , the brackets, [{<()>}], and the rest,  ...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    });
});
