#!/usr/bin/env node
'use strict';
var program = require('commander');
var server = require('./dist');

var packageConf = require('./package.json');

program
  .version(packageConf.version)
  .option('-p, --port <port>', 'specify the port [3000]', Number, 3000)
.parse(process.argv);

server.create(process.env.PORT || program.port);
