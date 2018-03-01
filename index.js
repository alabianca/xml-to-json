const XMLtoJSONstream = require('./lib/xmlToJsonStream');
const traverse = require('./lib/xmlToJson');
const cleanXML = require('./lib/cleanXML');


module.exports = function(options) {
    const opts = options || {}
    const attributeMode =  typeof opts.attributeMode === 'undefined' ? true : opts.attributeMode;

    


    const createStream = function() {
        return new XMLtoJSONstream({attributeMode: attributeMode});
    } 


     const xmlToJson = function(xml,cb) {
        const clean = cleanXML(xml);
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


