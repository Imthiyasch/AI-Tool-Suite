const pdf = require('pdf-parse');
async function test() {
    try {
        const dummyBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Count 1\n/Kids [3 0 R]\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n5 0 obj\n<< /Length 44 >>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n(Hello World) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000221 00000 n \n0000000302 00000 n \ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n397\n%%EOF');
        
        console.log('Attempting function call...');
        try {
            const data = await pdf(dummyBuffer);
            console.log('Function call success, text:', data.text);
        } catch (e) {
            console.log('Function call failed:', e.message);
        }

        console.log('Attempting new PDFParse...');
        try {
            const parser = new pdf.PDFParse({ data: dummyBuffer });
            const result = await parser.getText();
            console.log('new PDFParse success, text:', result.text);
        } catch (e) {
            console.log('new PDFParse failed:', e.message);
        }
    } catch (e) {
        console.error('Test error:', e);
    }
}
test();
