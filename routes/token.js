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
    expireTime: 1000
  });
  return AWS.config.credentials;
}

console.log('process.env.ENV', process.env.ENV);
if (process.env.ENV == 'EC2') {
  AWS.config.credentials = ec2Auth();
} else {
  AWS.config.credentials = localAuth();
}


AWS.config.credentials.refresh();

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(AWS.config.credentials);
  AWS.config.credentials.refresh(function () {
    res.send(
      {
        data: {
          type: "publisherAwsToken",                 // singular as per latest API standard
          attributes: {
            token: {
              awsAccessKeyId: AWS.config.credentials.accessKeyId,                     //credentials.AccessKeyId,
              awsSecretAccessKey: AWS.config.credentials.secretAccessKey,                 //credentials.SecretAccessKey,
              awsSessionToken: AWS.config.credentials.sessionToken,                   //credentials.SessionToken,
              expiration: AWS.config.credentials.expireTime                         //credentials.Expiration,
            },

            resource: {
              eventType: 'ledgerDetailEvent',                        //streamConfig.enventType (e.g. "ledgerDetailEvent"),
              kinesisStreamName: 'louis_stream',              //streamConfig.kinesisStream (e.g. "lc-prod-essentials"),
              region: 'us-west-2'                           //region (e.g."us-west-2")
            }
          }
        }

      }
    );
  })

});

module.exports = router;
