import {logger} from './logger';
import {app} from './app';

var packageConf = require('../package.json');

export function create(port: number) {
  var server = app.listen(port, function() {

    var host = server.address().address;
    var port = server.address().port;
    logger.debug(`${packageConf.name.bold.red} listening at http://${host}:${port}`);
  });
};