module.exports = traverse;

function traverse(xml,attributeMode) {
    const tagFinder = new RegExp('<(.*?)[>|\\s|/]', 'g'); //find the current tag we are working on

    const json = {};
    let tagShouldBeArray = false;
    
    //recursion base case
    if(xml === '' || (xml.charAt(0) !== '<' && xml.charAt(xml.length-1) !== '>')) {
        return xml;
    }

    var currentLevelTags;
    var skip = 0;
    while((currentLevelTags = tagFinder.exec(xml)) !== null) {
        let selfClosing = false;
        const tag = currentLevelTags[1];

        const finishTag = '</'+tag+'>';
        const input = currentLevelTags.input;
        const tagLength = input.indexOf('>',skip)+1;

        const start = currentLevelTags.index;
        const end = currentLevelTags.input.indexOf('>',start)+1;
        const currentTag = currentLevelTags.input.substring(start,end);

        selfClosing = isSelfClosing(currentTag);

        if(!validate(currentTag)) {
            const err = new Error('Invalid XML tag');
            throw err;
        }

        const closingTagIndex = findClosingIndex(input,finishTag,tagLength);
        if(selfClosing === false && closingTagIndex < 0) {
            const err = new Error('Invalid XML');
            throw err;
        }
        
        let substring; //substring will be either all child tags or if self closing tag just a blank string. i.e: <employee><name>Alex</name></employee> : <name>Alex</name> will be the substring of the <employee> parent tag
        if(selfClosing) {
            substring = '';
            skip = currentTag.length + skip;

        } else {
            substring = input.substring(input.indexOf('>', skip)+1, closingTagIndex);
            skip = tagLength + substring.length + finishTag.length;
        }
        

        // The index at which to start the next match
        tagFinder.lastIndex = skip; //skip all child tags of current level

        if(!json[tag]) {
            json[tag] = {};
        } else {
            tagShouldBeArray = true;
        }
        
        let temporary = {};
        let attributes;
        if(attributeMode) {
            attributes = collectAttributes(currentTag);
        }

        //if currentTag contains attributes and attributeMode is enabled, attach them to json
        if(tagShouldBeArray && attributeMode) {
            temporary = attributes;

        } else if(!tagShouldBeArray && attributeMode) {
            for(let key in attributes) {
                json[tag][key] = attributes[key];
            }
        }
        

        //go one level deeper
        const next = traverse(substring,attributeMode);
        
        //when returning from recursion, build up the json
        
        if(typeof next === 'object') {
            //const key = Object.keys(next)[0];
            if(tagShouldBeArray && !json[tag].length) {
                const temp = json[tag];

                // if the first object is empty, set json[tag] to a new empty array
                // else wrap the object in an array
                if(typeof temp === 'object' && Object.keys(temp).length === 0) {
                    json[tag] = [];
                } else {
                    json[tag] = [temp];
                }

                const nextObj = {}
                for(let key in next) {
                    nextObj[key] = next[key];
                }
                temporary = {...temporary,...nextObj};
                json[tag].push(temporary);
            }else if(tagShouldBeArray) {
                const nextObj = {};
                for(let key in next) {
                    nextObj[key] = next[key];
                }
                temporary = {...temporary,...nextObj};
                json[tag].push(temporary);
            }else {
                for(let key in next) {
                    json[tag][key] = next[key];
                }
            }
            

        } else if(Object.keys(json[tag]).length>0) {
        
            if((tagShouldBeArray  && !json[tag].length) || typeof json[tag] === 'string') {
                const temp = json[tag];
                json[tag] = [temp];
                
                if(typeof next !== 'object') {
                    if(Object.keys(temporary).length === 0) {
                        json[tag].push(next);
                    } else {
                        // temporary['data'] = next;
                        if(next !== '') {
                            temporary['textNode'] = next;
                        }
                        json[tag].push(temporary);
                    }
                    

                } else {
                    temporary = {...temporary,next};
                    json[tag].push(next);
                }
                //json[tag].push(next);

            } else if(tagShouldBeArray) {
                //json[tag].push(next);
                if(typeof next !== 'object') {
                    if(Object.keys(temporary).length === 0) {
                        json[tag].push(next);
                    } else {
                        //temporary['data'] = next;
                        if(next !== '') {
                            temporary['textNode'] = next;
                        }
                        json[tag].push(temporary);
                    }
                    

                } else {
                    temporary = {...temporary,next};
                    json[tag].push(next);
                }

            } else {
                if(next !== '') {
                    json[tag] = {
                        ...json[tag],
                        textNode: next
                    }
                }
                
            }
            
        } else {
            if(tagShouldBeArray && typeof json[tag] !== 'object') {
                const temp = json[tag];
                json[tag] = [];
                json[tag].push(...temp,next);
            }else {
                json[tag] = next;
            }
            //json[tag] = next;
        }
        
    }


    return json;
}




//Helper methods

//Determine if a tag is self closing or not. Could be improved
function isSelfClosing(currentTag) {
    if(currentTag.indexOf('/>') > -1) {
        return true;
    }
    return false;
}

//Collect all the attributes of the current tag and return an object in form of {attribute:values}
function collectAttributes(currentTag) {
    const attributeFinder = new RegExp('(\\S*)="(.*?)"', 'g');
    const foundAttributes = {};

    let attributes
    while((attributes = attributeFinder.exec(currentTag)) !== null) {
        const key = attributes[1];
        const value = attributes[2];

        foundAttributes[key] = value;
    }

    return foundAttributes;
}

function validate(currentTag) {
    // return true for a root element containing '?'
    if((currentTag.charAt(0) === '<' && currentTag.charAt(1) === '?') && (currentTag.charAt(currentTag.length-1) === '>' && currentTag.charAt(currentTag.length-2) === '?')) {
        return true;
    }

    // return true for either a selfclosing tag or regular tag
    if(currentTag.charAt(0) === '<' && (currentTag.charAt(currentTag.length-2)+currentTag.charAt(currentTag.length-1) === '/>' || currentTag.charAt(currentTag.length-1) === '>')) {
        return true;
    }

    return false;
}

function isMiddleTag(searchString, openTag, closeTag) {
    const firstCloseTagIndex  = searchString.indexOf(closeTag);

    if (searchString.lastIndexOf(openTag, firstCloseTagIndex) != -1) {
        // an opening tag has been found between the first open tag and first encountered close tag, return true
        return true;
    } else {
        // otherwise return false
        return false;
    }
}

// counts the number of open tags before the first closing tag
function countOpenTags(searchString, openTag, closeTag) {
    // find the index of the first closing tag and then work backwards,
    // finding and counting all opening tags between it and the start of the searchString
    let startIndex = searchString.indexOf(closeTag);
    let count = 0;

    while (searchString.lastIndexOf(openTag, startIndex) !== -1 && startIndex > 0) {
        count += 1;
        // subtract 1 from the returned index so that we do not find the same occurence again
        startIndex = searchString.lastIndexOf(openTag, startIndex) - 1;
    }

    return count;
}


function findClosingIndex(searchString,tag,start) {

    const openinTag   = tag.replace('</', '<').replace('>', '');

    const lastTag = searchString.substr(searchString.length - tag.length)
    let closingIndex

    let substr = searchString.substr(start)

    // Look between the openinTag and the first found closing tag (tag)
    // and see if there is an openinTag (with a closing bracket) between the two.
    // If an opening tag is found between the first opening tag and first closing tag, grab the last closing tag.
    // Otherwise check for middle tags between the open tag and first closing tag
    // If found, count them, update the index, and grab the correct closing tag
    // Otherwise grab the first found closing tag

    if (lastTag === tag && isMiddleTag(substr, openinTag + '>', tag)) {
        closingIndex  = substr.lastIndexOf(tag);

        // if closingIndex found, add start length
        if(closingIndex != -1) {
            closingIndex += start
        }

    } else if (isMiddleTag(substr, openinTag + '>', tag)) {
        // TODO: one problem could remain, open tags with properties inside them (since we are matching the single tag with no properties exactly)
        let count = countOpenTags(substr, openinTag + '>', tag)
        let index = start
        while (count > 0) {
            // find the index of the next occurence of the closing tag
            index = searchString.indexOf(tag, index)
            // add the tag length to search beyond this closing tag
            index += tag.length
            // decrement the counter
            count -= 1
        }

        // we now have an index beyond the closing tags we need to skip
        // find the next closing tag and return this as the closingIndex
        closingIndex = searchString.indexOf(tag, index)
    } else {
        closingIndex  = searchString.indexOf(tag, start);
    }

    // looks for an occurence of openinTag that happens after the current tag
    const openIndexFinder = new RegExp(`${openinTag}.*\/>`, 'g'); // find the next opening tag that is not self closing
    // create a new version of the serach string without any self closing tags that match openinTag
    const cleansedSearchString = searchString.replace(openIndexFinder, '');

    // use the cleansed search string to ensure the openingIndex we find is of the next non self-closing tag
    let openingIndex  = cleansedSearchString.indexOf(openinTag,start);

    if(closingIndex < openingIndex) {
        return closingIndex;
    }

    const sub  = searchString.substr(openingIndex,closingIndex-openingIndex);

    if(!sub.match(new RegExp(openinTag + "\\W"))) {
        return closingIndex;
    }

    while(closingIndex > 0) {
        const tempIndex = searchString.indexOf(tag,closingIndex+1);
        if(tempIndex > 0) {
            closingIndex = tempIndex;
        } else {
            break;
        }
    }

    return closingIndex;
}