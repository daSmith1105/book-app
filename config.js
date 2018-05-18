'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/library';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://admin:das1105@ds033477.mlab.com:33477/test-library';
exports.PORT = process.env.PORT || 8080;