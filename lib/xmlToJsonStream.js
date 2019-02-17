const stream = require('stream');
const xmlToJson = require('./xmlToJson');
const cleanXML = require('./cleanXML');
const validator = require('./validator');

//Basic transform stream implementation utilizing the xmlToJson function
class XMLtoJSONstream extends stream.Transform {
    constructor(options) {
        super({writableObjectMode:true,readableObjectMode:true});
        this.attributeMode = typeof options.attributeMode === "undefined" ? true : options.attributeMode

        this.bufferList = {
            list: [],
            totalLength:0
        }
        this.xml = '';
        this.json = null;
    }

    _transform(chunk,encoding,next) {
        if(typeof chunk === 'string') {
            this.xml += chunk;
        }else {
            this.bufferList.list.push(chunk);
            this.bufferList.totalLength = this.bufferList.totalLength + chunk.length;
        }
        
        
        next();
    }

    _final(done) {
        if(this.xml === '') {
            const buffer = Buffer.concat(this.bufferList.list,this.bufferList.totalLength);
            this.xml = buffer.toString();
        }
        
        const clean =  cleanXML(this.xml);

        if(!validator(clean)) {
            const error = new Error("Invalid XML. XML is missing opening or closing tag.");
            this.emit('error', error);
            return;
        }

        try {
            this.json = xmlToJson(clean, this.attributeMode);
            this.push(JSON.stringify(this.json, null, 2));
        }catch(e) {
            this.emit('error', e);
        }
        
        
        reset(this);
        done();
    }
}


module.exports = XMLtoJSONstream;



//private

function reset(self) {
    self.bufferList.list = [];
    self.bufferList.totalLength = 0;
    self.xml = '';
    self.json = null;
}

