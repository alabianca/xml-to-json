#!/usr/bin/env node

const xmlToJson = require('../index')
const [,, ...args] = process.argv;

const attributeMode = args.includes("-no-attr") ? false : true;

const parser = xmlToJson({attributeMode})

const stream = parser.createStream();

process.stdin.pipe(stream).pipe(process.stdout)