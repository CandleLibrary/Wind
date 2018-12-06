export default {
    input: "./source/whind.mjs",
    treeshake: true,
    output: [{
    	name:"whind",
        file: "./build/whind.js",
        format: "iife",
        exports: "named"

    },{
    	name:"whind_cjs",
        file: "./build/whind.node.js",
        format: "cjs",
        exports: "named"
    }],
    plugins: []
};