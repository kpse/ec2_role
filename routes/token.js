var express = require('express');
var router = express.Router();

var AWS = require('aws-sdk');

AWS.config.credentials = new AWS.EnvironmentCredentials('AWS');


AWS.config.credentials = new AWS.TemporaryCredentials({
  RoleArn: 'arn:aws:iam::676890035424:role/delegate', 
  RoleSessionName: 'RoleSessionName1',
  expireTime: new Date()
});

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(AWS.config.credentials);
  AWS.config.credentials.refresh(function () {
    res.send({
      accessKeyId: AWS.config.credentials.accessKeyId,
      secretAccessKey: AWS.config.credentials.secretAccessKey,
      sessionToken: AWS.config.credentials.sessionToken
    });
  })

});

module.exports = router;
