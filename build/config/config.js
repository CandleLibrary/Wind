export default {
    input: "./source/main",
    treeshake: true,
    output: [{
    	name:"whind",
        file: "./build/whind.mjs",
        format: "es",
    },{
    	name:"whind_cjs",
        file: "./build/whind_cjs.js",
        format: "cjs",
    }],
    plugins: []
};