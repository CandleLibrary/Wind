import wind from "@candlefw/wind";

"Creates Error Message";

const lex = wind("test message that this is the best test message.");

assert(!lex.createWindSyntaxError("test"));
