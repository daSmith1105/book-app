'use strict';

exports.DATABASE_URL = 'mongodb://admin:das1105@ds237815.mlab.com:37815/library' || 'mongodb://localhost/library';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-library';
exports.PORT = process.env.PORT || 8080;