const XMLtoJSONstream = require('./lib/xmlToJsonStream');
const traverse = require('./lib/xmlToJson');
const cleanXML = require('./lib/cleanXML');
const validator = require('./lib/validator');


module.exports = function(options) {
    const opts = options || {}
    const attributeMode =  typeof opts.attributeMode === 'undefined' ? true : opts.attributeMode;


    
    const createStream = function() {
        return new XMLtoJSONstream({attributeMode: attributeMode});
    } 


     const xmlToJson = function(xml,cb) {
        const clean = cleanXML(xml);

        if(!validator(clean)) {
            const err = new Error('Invalid XML. XML is missing closing or opening tag');
            return cb(err);
        }

        let json;
        try {
            json = traverse(clean,attributeMode);
            return cb(null,json);
        }catch(e) {
            return cb(e);
        }
        
    }



    


    return {
        createStream : createStream,
        xmlToJson : xmlToJson
    }
}


