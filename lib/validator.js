

module.exports = function(tag) {
    if((tag.charAt(0) === '<' && tag.charAt(1) === '?') && (tag.charAt(tag.length-1) === '>' && tag.charAt(tag.length-2) === '?')) {
        return true;
    }

    if(tag.charAt(0) === '<' && (tag.charAt(tag.length-2)+tag.charAt(tag.length-1) === '/>' || tag.charAt(tag.length-1) === '>')) {
        return true;
    }

    return false;
}