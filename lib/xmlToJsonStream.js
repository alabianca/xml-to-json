const stream = require('stream');
const xmlToJson = require('./xmlToJson');

//Basic transform stream implementation utilizing the xmlToJson function
class XMLtoJSONstream extends stream.Transform {
    constructor(options) {
        super({writableObjectMode:true,readableObjectMode:true});
        this.attributeMode = options.attributeMode || true;

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
        
        const cleanXML = this.xml.replace(/>\s*</g, '><').replace(/<\?xml[\w|\s|"|=|.|-]*\?>/g, ''); //remove whie spaces between tags and remove the root tag

        try {
            this.json = xmlToJson(cleanXML, this.attributeMode);
            this.push(JSON.stringify(this.json));
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

