///*
export const jump_table = [];

//Add value to individual indexes
function aii(table, value, ...indices){
	for(const i of indices)
		table[i] = value;
}

//Add value to index ranges
function air(t, v, ...i_r){
	for(const r of i_r.reduce((r,v,i)=> (((i%2) ? (r[r.length-1].push(v)) : r.push([v])),r) , [])){
		const size = r[1] + 1 - r[0], a = [];
		for(let i = 0; i < size; i++)
			a[i] = r[0] + i;
		aii(t, v, ...a);
	}
}

const j = jump_table;

//0. Number
air(j, 0, 48, 57);

//1. Identifier
air(j, 1, 65, 90, 97, 122);

//2. QUOTE STRING
aii(j, 2, 34, 39, 96);

//3. SPACE SET
aii(j, 3, 32);

//4. SPACE SET
aii(j, 4, 9);

//5. CARIAGE RETURN 
aii(j, 5, 13);

//6. CARIAGE RETURN 
aii(j, 6, 10);

//7. Symbol
air(j, 7, 0,8,  11,12,  14,15,  17,31,  35,36,  44,47, 59,59,  63,64,   92,92,  94,94,  95,95, 124,124,  126,127);

//8. Operator
aii(j, 8, 33, 37, 38, 42, 43, 58, 60, 61, 62);

//9. Open Bracket
aii(j, 9, 40, 91, 123);

//10. Close Bracket
aii(j, 10, 41, 93, 125);

//10. Close Bracket
aii(j, 11, 16);


/**
 * Lexer Number and Identifier jump table reference
 * Number are masked by 12(4|8) and Identifiers are masked by 10(2|8)
 * entries marked as `0` are not evaluated as either being in the number set or the identifier set.
 * entries marked as `2` are in the identifier set but not the number set
 * entries marked as `4` are in the number set but not the identifier set
 * entries marked as `8` are in both number and identifier sets
 */

export const number_and_identifier_table = [];
const nait = number_and_identifier_table;

/**
 * LExer Number and Identifier jump table reference
 * Number are masked by 12(4|8) and Identifiers are masked by 10(2|8)
 */

// entries marked as `0` are not evaluated as either being in the number set or the identifier set.
air(nait, 0,  0,47, 58,64, 91,96, 123,127);

// entries marked as `2` are in the identifier set but not the number set
air(nait, 2, 65,90, 97,122);

// entries marked as `4` are in the number set but not the identifier set
//air(nait, 4, 48,57);

// entries marked as `8` are in both number and identifier sets
air(nait, 8, 48,57);