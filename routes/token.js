var express = require('express');
var _ = require('lodash');
var router = express.Router();

var AWS = require('aws-sdk');

function ec2Auth() {
  return new AWS.EC2MetadataCredentials();
}

function localAuth() {
  AWS.config.credentials = new AWS.EnvironmentCredentials('AWS');

  AWS.config.credentials = new AWS.TemporaryCredentials({
    RoleArn: 'arn:aws:iam::676890035424:role/delegate',
    RoleSessionName: 'RoleSessionName1',
    expireTime: new Date()
  });
  return AWS.config.credentials;
}

// AWS.config.credentials = localAuth();
AWS.config.credentials = ec2Auth();

AWS.config.credentials.refresh();

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(AWS.config.credentials);
  AWS.config.credentials.refresh(function () {
    res.send(
      _.pick(AWS.config.credentials, ['accessKeyId', 'secretAccessKey', 'sessionToken', 'expireTime'])
      );
  })

});

module.exports = router;
