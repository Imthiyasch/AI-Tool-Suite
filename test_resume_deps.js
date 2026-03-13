const pdf = require('pdf-parse');
const mammoth = require('mammoth');

async function test() {
    console.log('Testing pdf-parse...');
    try {
        console.log('pdf type:', typeof pdf);
        // If it's a function, it's correct
    } catch (e) {
        console.error('pdf-parse error:', e);
    }

    console.log('Testing mammoth...');
    try {
        console.log('mammoth type:', typeof mammoth);
        console.log('mammoth.extractRawText type:', typeof mammoth.extractRawText);
    } catch (e) {
        console.error('mammoth error:', e);
    }
}

test();
