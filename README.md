# xml-to-json-stream

Simple module to convert XML to JSON with javascript

## Download
`npm install xml-to-json-stream` or `npm install xml-to-json-stream -g`
Installing the package globally allows you to convert xml file to json files via the command line.
`cat config.xml | tojson > config.json` . If you want to ignore xml attribute simply add the `-no-attr` flag.

## Public API

xml-to-json-stream only has two public methods `xmlToJson` and `createStream` .
Use xmlToJson if you simply want to pass in some XML and access the resulting JSON in the callback function. 
Use createStream if you need to pipe some readable XML stream into a writable destination and convert the XML to JSON along the way. 

The module currently accepts `attributeMode` as an option, which defaults to `true ` . `attributeMode` decides whether XML attributes should 
be ignored or not. 

```javascript
const xmlToJson = require('xml-to-json-stream');
const parser = xmlToJson({attributeMode:false});

const xml = `
<employee id="123456">
    <name>Alex</name>
</employee>
`

parser.xmlToJson(xml, (err,json)=>{
    if(err) {
        //error handling
    }

    //json
    //{
    //  employee: {
    //      name: "Alex"
    //  }    
    //}
});

//the 'id' attribute of employee is ignored. If attributeMode was set to true or omitted, the json would have been:
// {
//   employee: {
//      id: "123456",
//      name: "Alex"
//   }    
// }

```

### xmlToJson

```javascript
const xmlToJson = require('xml-to-json-stream');
const parser = xmlToJson({attributeMode:false});

parser.xmlToJson(xml, (err,json)=>{
    if(err) {
        //error handling
    }

    //json is converted xml
});
```

### createStream

`createStream` allows you to create a Node.js Transform stream that can be written to and read from. 
Consider a hypothetical weather service that only responds with XML data. `createStream` will remove some of the boilerplate for you by
letting you pipe service responses through the parser/stream.

```javascript
const xmlToJson = require('xml-to-json-stream');
const parser = xmlToJson();
const stream = parser.createStream();

const server = http.createServer((req,res)=>{

    http.get('http://someHypothecialXMLWeatherService/api', (response)=>{ //since response is a readable stream we can pipe it through our stream
        response.pipe(stream).pipe(res); //the client will receive the json representation of the XML response
    })
})
```

#### Or...
...If you have an XML file you want to convert on the fly via the command line `$ cat file.xml | node app`

```javascript
const xmlToJson = require('xml-to-json-stream');
const fs = require('fs');

const parser = xmlToJson();
const stream = parser.createStream();
const jsonFile = fs.createWriteStream('jsonFile.json')

process.stdin.pipe(stream).pipe(jsonFile);
```


#### Additional Considerations

  * Comments are removed
  * Root elements are removed
  * If an element occurs multiple times in the same depth then that element will be represented as an array in the JSON
    ```
        <xml>
            <employee id="123" name="alex"></employee>
            <employee id="456" name="jon"></employee>
            <employee id="789" name="ashley"></employee>
        </xml>

        will turn into...

        {
            xml: {
                employee: [
                    {
                        id: "123",
                        name: "alex"
                    },
                    {
                        id: "456",
                        name: "jon"
                    },
                    {
                        id: "789",
                        name: "ashley"
                    }
                ]
            }
        }
    ```
    * If an element contains a textNode and attributes the textNode will have the key textNode
    ```
        <employee id="98765">Alex</employee>
        
        will turn into...
        
        employee: {
            id: "98765",
            textNode: "Alex"
        }

        and ...

        <employee>Alex</employee>
        
        will turn into...

        employee: "Alex"
    ```



    License: MIT

