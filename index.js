const fs = require("fs");
const readline = require("readline");
const commander = require('commander'); // include commander in git clone of commander repo
const program = new commander.Command();

//$ node my_caesar_cli -a encode -s 7 -i "./input.txt" -o "./output.txt"

program
  .option('-s, --shift <type>', 'number of characters shifted')
  .option('-i, --input <type>', 'input')
  .option('-o, --output <type>', 'output')
  .option('-a, --action <type>', 'encode/decode');

program.parse(process.argv);


const options = program.opts();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let num, inputPath, outputPath, action;
if (options.shift) { 
	num = Number(options.shift);
	checkParams();
} else {
	throw new Error('Please enter correct shift parameter');
}

if (options.input && options.output) {
	outputPath = options.output;
	inputPath = options.input;
} else if(!options.input && options.output){
	ouputPath = options.output;
	rl.question("Please enter correct input path: ", function(name) {
	    inputPath = name;
	    rl.close();
	    if (inputPath) {
			checkParams();
		}
	    else {
	    	throw new Error('Incorrect input path')
	    }
	});
} else if(options.input && !options.output){
	inputPath = options.input;
	rl.question("Please enter correct output path: ", function(name) {
	    outputPath = name;
	    rl.close();
	    if (outputPath) {
	    	checkParams();
	    }
	    else {
	    	throw new Error('Incorrect output path')
	    }
	});	
} else {
	rl.question("Please enter correct input path: ", function(input) {
	    rl.question("Please enter correct output path: ", function(output) {
	        inputPath = input;
	        outputPath = output;
	        rl.close();
	        if (outputPath && inputPath) {
	        	checkParams();
	        }
	        else {
	        	throw new Error('Incorrect input or output path')
	        }
	    });
	});	
}


if (options.action && (options.action == "encode" || options.action == "decode") ) { 
	action = options.action;
	checkParams();

} else {
	throw new Error('Please enter correct action parameter');
}

function checkParams(){
	if (inputPath && outputPath && num && action) {
		execute();
		rl.close();
	}
}

function execute(){

	let newStr = '';

	let readStream = fs.createReadStream(inputPath);
	readStream.on('data', function(chunk){
	    newStr += Buffer.from(chunk);
	});
	 
	readStream.on('end', function(){
	    if (newStr) {
	    	let codedStr = ceaserCipher(newStr, Number(num));
	    	let writeStream = fs.createWriteStream(outputPath, {
	            flags: 'a'
	        });
	    	writeStream.write(codedStr);
	    	writeStream.write("\r\n");
	    }
	});

	function ceaserCipher(str, interval){
		let alphabet = 'abcdefghijklmnopqrstuvwxyz';
		let newStr = []; let initIndex;
		for (var i = 0; i < str.length; i++) {
			let symb = str[i];
			if (action == "encode") {
				if (alphabet.includes(symb.toLowerCase())) {
					if (symb.toUpperCase() == symb) {
						initIndex = alphabet.indexOf(symb.toLowerCase());
						res = (initIndex + interval) % alphabet.length;
						newStr.push((alphabet[res]).toUpperCase());
					}
					else {
						initIndex = alphabet.indexOf(symb);
						res = (initIndex + interval) % alphabet.length;
						newStr.push(alphabet[res]);					
					}
				}
				else {
					newStr.push(symb);
				}
			} else if(action == "decode") {

				if (alphabet.includes(symb.toLowerCase())) {
					if (symb.toUpperCase() == symb) {
						initIndex = alphabet.indexOf(symb.toLowerCase());
						res = (initIndex - interval) % alphabet.length;
						newStr.push((alphabet[res]).toUpperCase());
					}
					else {
						initIndex = alphabet.indexOf(symb);
						res = (initIndex - interval) % alphabet.length;
						newStr.push(alphabet[res]);					
					}
				}
				else {
					newStr.push(symb);
				}

			}
		}
		return newStr.join('');
	} 

}


