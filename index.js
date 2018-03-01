const XMLtoJSONstream = require('./lib/xmlToJsonStream');
const traverse = require('./lib/xmlToJson');


module.exports = function(options) {
    const opts = options || {}
    const attributeMode =  typeof opts.attributeMode === 'undefined' ? true : false;


    const createStream = function() {
        return new XMLtoJSONstream({attributeMode: attributeMode});
    } 


     const xmlToJson = function(xml,cb) {
        const cleanXML = xml.replace(/>\s*</g, '><');
        let json;
        try {
            json = traverse(cleanXML,attributeMode);
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