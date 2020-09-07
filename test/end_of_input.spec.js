import wind from "@candlefw/wind";

let lex = wind("This is 'the' string");
let compare = ["This", "is", "'the'", "string"];
let i = 0;

while (!lex.END) {
    assert(lex.tx == compare[i]);
    i++;
    lex.n;
};

assert("Detect end of input without missing any tokens", i == 4);
