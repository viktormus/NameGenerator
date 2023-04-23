// Name/Word generator
// Finnish-sounding names/Words

console.log("Welcome to the name generator!");
console.log("Let's generate a couple cool names for ya\n");

// Skip Å

// Clean vovels
let cleanVovels = ["a", "e", "i", "o", "u"];
// Rough vovels
let roughVovels = ["e", "i", "y", "ä", "ö"];

// Skip B, D, F, G C, Q, W, X, Y, Z
let consonants = ["h", "j", "k", "l", "m", "n", "p", "r", "s", "t", "v"]

// I was just thinking, that name word structures may be a subset of all word structures!

// Skipping word structure construction for a moment, and using ready-made templates
// Separating different word lengths

let templates = 
	// Ari 								3 letters
	[["VCV"],
	// Jari, Ukko, Nooa, Aaro			4 letters
	["CVCV", "VCCV", "CVVC", "VVCV"],
	// Risto, Olavi, Noola, Aarni		5 letters
	["CVCCV", "VCVCV", "CVVCV", "VVCCV"],
	// Aleksi, Jaakko, Elmeri, Markus	6 letters
	["VCVCCV", "CVVCCV", "VCCVCV", "CVCCVC"], 
	// Jalmari  						7 letters
	["CVCCVCV"], 			
	// Joonatan, Eveliina				8 letters
	["CVVCVCVC", "VCVCVVCV"]]
	// Karoliina (9 letters)

// Probability with which a double consonant or a double vovel is chosen
//const DOUBLEPROB = 0.5;

// Return a random element from the list
function rand(list) {
	return list[Math.floor(Math.random() * list.length)];
}

// Helper function that chooses a random letter from the available options
function chooseLetter(type, vovels) {
	if (type == "C") {
		return rand(consonants);
	}
	return rand(vovels);
}

// Should I limit the pool of possible letters? it might be unlikely sometimes, that many letters appears a single time
function assignLetters(structure, vovels, doubleProb) {
	let word = "";
	for (let i = 0; i < structure.length; i++) {
		// If we see that this letter could be a double vovel/consonant (skip at the first letter)
		if (i != 0 && structure[i - 1] == structure[i]) {
			if (Math.random() < doubleProb) {
				word += word[word.length - 1];
			} else {
				// If not a double, must prevent 'accidental' double
				letter = chooseLetter(structure[i], vovels);
				while (letter == word[i - 1]) {
					letter = chooseLetter(structure[i], vovels);
				}
				word += letter;
			}
			// If no double letter, choose randomly
		} else {
			word += chooseLetter(structure[i], vovels);
		}
	}
	return word;
}

// Some letters cannot be doubles. Eg. V, H, J
// Some letter's don't sound good at the end. Eg. J, V, H(?)
// - Might add a "redact" function, that edits the generated name
// - Separate function to avoid complicating the generator

let noDouble = ["v", "h", "j"];
let noEnd = ["v", "h", "j"];

function redactWord(word) {
	if (word.length == 1) return word

	let modified = word[0];
	
	// At the moment not modifying the first letter at all -> i = 1
	// Scan for doubles, modify if letter is forbidden
	for (let i = 1; i < word.length - 1; i++) {
		if (word[i] == word[i + 1] &&
		 (noDouble.indexOf(word[i]) != -1)) {
			let newL = "";
			do {
				newL = rand(consonants);
			} while (noDouble.indexOf(newL) != -1);
			modified += newL + newL;
			i++;
		} else {
			modified += word[i];
		}
	}

	// Avoiding problems with custom words
	// Where two last letters can be the same
	if (modified.length == word.length) {
		return modified;
	}

	// Check the last letter, modify if forbidden
	let last = word.length - 1;
	if (noEnd.indexOf(word[last]) != -1) {
		let newL = "";
		do {
			newL = rand(consonants);
		} while (noEnd.indexOf(newL) != -1);
		return modified += newL;
	}
	return modified += word[last];
}

// Validating arguments for 'generate' function
// Returns [true if there's an error & false otherwise, instruction string]
function validateArgs(length, vovels, number, structure, doubleProb) {
	if (length < 3 || length > 8) return [true, "The word length needs to be 3-8 characters."];
	if (!(vovels == 0 || vovels == 1)) return [true, "The vovel variable must be 0 or 1."];
	if (number < 1 || number > 20) return [true, "The number of generated names must be 1-20."];
	if (structure != "" && (structure.length < 1 || structure.length > 20)) return [true, "The word structure must be 1-20 characters."]
	if (structure != "") {
		for (let i = 0; i < structure.length; i++) {
			if (!(structure[i] == "C" || structure[i] == "V")) return [true, "The word structure must only contain letters C and V."]
		}
	}
	if (doubleProb < 0 || doubleProb > 1) return [true, "Double letter probability must be between 0 and 1."]
	return [false, "Arguments validated and accepted."]
}

// Function that encompasses all necessary arguments

/*
length: length of the word, 3-8 (inclusive) (disregarded if custom structure is given)
vowels: whether we use clean or rough vovels, binary variable
number: number of generated words, 1-20 (inclusive)
structure: custom structure, "CV" string, 1-20 letters (default: chosen randomly based on length)
doubleProb: probability of a repeated letter (default: 0.5)
*/

function generate(length, vovels, number, structure = "", doubleProb = 0.5) {
	// Preparing stuff for generation
	// Determine vovel type
	let vovs = cleanVovels;
	if (vovels == 0) {
		vovs = roughVovels;
	}
	// Choose a random template for the given word length (otherwise ignore length parameter)
	if (structure == "") {
		structure = rand(templates[length - 3]);
	}

	// Generating names
	let names = [];
	for (i = 0; i < number; i++) {
		let original = assignLetters(structure, vovs, doubleProb);
		let modified = redactWord(original);
		names.push(modified);
	}
	return names;
}


function valGenPrint(length, vovels, number, structure = "", doubleProb = 0.5) {
	// Validate arguments
	length = Math.round(length);
	number = Math.round(number);
	structure = structure.toUpperCase();
	let val = validateArgs(length, vovels, number, structure, doubleProb);
	if (val[0]) {
		return val[1];
	}
	// Generate if arguments are OK
	let names = generate(length, vovels, number, structure, doubleProb);
	let nameList = "";
	for (let i = 0; i < names.length; i++) {
		nameList += names[i]
		nameList += "\n";
	}
	return nameList.slice(0, nameList.length - 1);
}

console.log(valGenPrint(4, 1, 10, "VCCV", 0));




// ARCHIVE

/*
HOW TO CREATE A WORD (NAME)
1. Generate syllables
2. Combine syllables

Possible syllables
V = vovel, C = consonant
// Let's examine words in their "base form"

Beginning of word
(V - a li as, but quite rare?) 
VV - ui da
VC - us va, uk ko | Possible double-C!
CV - ko ri
CVV - maa | Can the word end with a single vowel after this? :D
CVC - lun ta ta, luk ko | Possible double-C!
CVCC - kort ti, kort su | Possible double-C!
CVVC - huis ka ta, saat tu e | Possible double-C!

Mid-word
CV - ri pu li
CVC - taa tus ti
CVV - pu nai nen
CVVC - haa huil la, pie rais ta | Possible double-C!; can there be a 1-word ending after?
CVCC - pe tank ki | Sounds more rare to me, possible double-C!; can there be a 1-word ending after?

End of word
V - kaa tu a
CV - ki vi
CVV - ku set taa, us kal taa | Possible double-C
CVC - on nel li nen, a si a kas | Most often "nen"?

*/

/*

// List of possible syllables for beginning, middle, and end word
let bSylls = ["VV", "VC", "CV", "CVV", "CVC", "CVCC", "CVVC"];
let mSylls = ["CV", "CVC", "CVV", "CVVC", "CVCC"];
let eSylls = ["V", "CV", "CVV", "CVC"];

// Generate a syllable by combining a consonant with a vovel
function gNormalPair(c, v) {
	let res = rand(c);
	res += rand(v);
	return res;
}

// Generate word structure
function gStructure(n) {
	let res = "";
	let tempList = [];

	// Let's first get a set of syllables that match the word length
	// Random first syllable
	tempList.push(rand(bSylls));
	res += tempList[0];

	// Fill with middle syllables
	while (res.length + 3 < n) {
		let midSyll = rand(mSylls);
		// We want to leave enough room for ending syllable
		if (midSyll.length + res.length < n) {
			tempList.push(midSyll);
			res += midSyll;
		}
	}

	// Choose a suitable end syllable
	let endSyll;
	if (res.length == n - 1) {
		endSyll = eSylls[0];
	} else if (res.length == n - 2) {
		endSyll = eSylls[1];
	} else {
		endSyll = rand(eSylls.slice(-2));
	}
	tempList.push(endSyll);
	res += endSyll;
	
	return tempList;
}

function generate(n, vovelType, doubleCprob) {
	let structure = gStructure(n);
	let word = "";
	//console.log(structure);

	for (let i = 0; i < structure.length; i++) {
		for (let j = 0; j < structure[i].length; j++) {
			let type = structure[i].charAt(j);
			let letter;
			if (type == "C") {
				// First consonant of non-first syllable can be double-C
				if (i != 0 && j == 0 && structure[i - 1][structure[i - 1].length - 1] != "V") {
					if (Math.random() < doubleCprob) {
						letter = word[word.length - 1];
					} else {
						letter = rand(consonants);
					}
				} else {
					letter = rand(consonants);
				}
				
			} else {
				letter = rand(vovelType);
			}
			word += letter;
		}
	}


	return word;
}

for (i = 0; i < 10; i++) {
	//console.log(generate(5, cleanVovels, 0.5));
}

*/