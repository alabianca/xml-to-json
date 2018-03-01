const traverse = require('../lib/xmlToJson');
const mockData = require('./mockXML').MOCK_DATA;
const clean = require('../lib/cleanXML');


describe('TRAVERSE: With Attributes', ()=>{
    const attributeMode = true;


    it('should collect all 3 attributes of the "employee" tag', ()=>{

        const cleanXML = clean(mockData.TEST1)
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
        //const cleanXML = mockData.TEST2.replace(/>\s*</g, '><');
        const cleanXML = clean(mockData.TEST2)
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
        const cleanXML = clean(mockData.TEST3)
        const json = traverse(cleanXML,attributeMode);

        const result = {
            employee: {
                name: 'Alex',
                age: '25'
            }
        }

        expect(JSON.stringify(json)).toBe(JSON.stringify(result))
    })

    it('should read the single attribute', ()=>{
        const cleanXML = clean(mockData.TEST4)
        const json = traverse(cleanXML,attributeMode);
        
        const result = {
            employee: {
                id: '12345'
            }
        }

        expect(JSON.stringify(json)).toBe(JSON.stringify(result))
    });

    it('should pass sanity check', ()=>{

        const cleanXML = clean(mockData.TEST5)
        const converted = traverse(cleanXML, true);

        const result = {
            employee: {
                name: "Alex"
            },
            role: "Software Dev",
            locality: {
                country: "US",
                region: "TX",
                city: "Austin"
            }
        }

        expect(JSON.stringify(converted)).toBe(JSON.stringify(result));
    })


});

describe('TRAVERSE: Without Attributes', ()=>{
    const attributeMode = false;

    it('should not collect any attributes', ()=>{
        const cleanXML = clean(mockData.TEST1)
        const json = traverse(cleanXML,attributeMode);

        const result = {
            employee : {
                name: "Alex"
            }
        }

        expect(JSON.stringify(json)).toBe(JSON.stringify(result));
    });

    it('should creeate an array', ()=>{
        const cleanXML = clean(mockData.TEST2)
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

    it('should not read the single attribute', ()=>{
        const cleanXML = clean(mockData.TEST4)
        const json = traverse(cleanXML,attributeMode);

        const result = {
            employee: {}
        }

        expect(JSON.stringify(json)).toBe(JSON.stringify(result))
    })
});

