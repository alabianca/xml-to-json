const traverse = require('../lib/xmlToJson');
const mockData = require('./mockXML').MOCK_DATA;


describe('TRAVERSE: With Attributes', ()=>{
    const attributeMode = true;


    it('should collect all 3 attributes of the "employee" tag', ()=>{

        const cleanXML = mockData.TEST1.replace(/>\s*</g, '><');
        const json = traverse(cleanXML,attributeMode);

        const result = {
            employee : {
                id: "12345",
                building: '1',
                geo: "US",
                name: "Alex"
            }
        }

        expect(JSON.stringify(json)).toBe(JSON.stringify(result));
    });

    it('should create an array if the same tag exist on the same level', ()=>{
        const cleanXML = mockData.TEST2.replace(/>\s*</g, '><');
        const json = traverse(cleanXML,attributeMode);

        const result = {
            employee: [
                {
                    id: '12345',
                    name: 'Alex',
                },
                {
                    id: '56789',
                    name: 'Jon'
                }
            ]
        }

        expect(JSON.stringify(json)).toBe(JSON.stringify(result));
    });

    it('should parse xml without attributes even if attributeMode is enabled', ()=>{
        const cleanXML = mockData.TEST3.replace(/>\s*</g, '><');
        const json = traverse(cleanXML,attributeMode);

        const result = {
            employee: {
                name: 'Alex',
                age: '25'
            }
        }

        expect(JSON.stringify(json)).toBe(JSON.stringify(result))
    })


});

describe('TRAVERSE: Without Attributes', ()=>{
    const attributeMode = false;

    it('should not collect any attributes', ()=>{
        const cleanXML = mockData.TEST1.replace(/>\s*</g, '><');
        const json = traverse(cleanXML,attributeMode);

        const result = {
            employee : {
                name: "Alex"
            }
        }

        expect(JSON.stringify(json)).toBe(JSON.stringify(result));
    });

    it('should creeate an array', ()=>{
        const cleanXML = mockData.TEST2.replace(/>\s*</g, '><');
        const json = traverse(cleanXML,attributeMode);

        const result = {
            employee: [
                {
                    name: 'Alex',
                },
                {
                    name: 'Jon'
                }
            ]
        }

        expect(JSON.stringify(json)).toBe(JSON.stringify(result));
    });
});

