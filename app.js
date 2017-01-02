var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var AWS_KEY = "YOUR_AWS_KEY";
var AWS_SECRET = "YOUR_AWS_SECRET";
var ENCODING_PROFILE_ID = 122195;
var OUTPUT_ID = 185573;
var INPUT_ID = 597127;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var bitcodin = require('bitcodin')('your bitmovin api key');
var inputConfig = {
    type: 's3',
    accessKey: YOUR_AWS_KEY,
    secretKey: YOUR_AWS_SECRET,
    bucket: 'inpbk',
    region: 'eu-west-1',
    objectKey: 'video.mp4'
};
var opConfig = {
    type: 's3',
    accessKey: AWS_KEY,
    secretKey: AWS_SECRET,
    bucket: 'outputbk',
    region: 'eu-west-1',
    name: 'AWS OP'
};
var encodingProfileConfiguration = {
    "name": "Airfi Encoding Profile",
    "videoStreamConfigs": [{
        "defaultStreamId": 0,
        "bitrate": 300000,
        "codec": "h264",
        "profile": "Baseline",
        "preset": "standard",
        "height": 360,
        "width": 640,
        "rate": 25
    }, {
        "defaultStreamId": 0,
        "bitrate": 100000,
        "codec": "h264",
        "profile": "Baseline",
        "preset": "standard",
        "height": 240,
        "width": 424,
        "rate": 25
    }],
    "audioStreamConfigs": [{
        "defaultStreamId": 0,
        "bitrate": 64000,
        "rate": 44100
    }]
};

/*var ipPromise = bitcodin.input.create(inputConfig);
 ipPromise.then(function (resp) {
 console.log(resp);
 }, function (err) {
 console.log(err);
 });
 var opPromise = bitcodin.output.s3.create(opConfig);
 opPromise.then(function (res) {
 console.log(res);
 }, function (err) {
 console.log(err);
 });

 bitcodin.encodingProfile.create(encodingProfileConfiguration).then(function (res) {
 console.log(res);
 }, function (err) {
 console.log(err);
 });*/
var jobConfiguration = {
    inputId: INPUT_ID,
    encodingProfileId: ENCODING_PROFILE_ID,
    outputId: OUTPUT_ID,
    manifestTypes: ["mpd", "m3u8"],
    speed: "standard"
};
var jobId = "";
bitcodin.job.create(jobConfiguration).then(function (res) {
    console.log(res);
    jobId = res.jobId;
}, function (err) {
    console.log(err);
}, function (prog) {
    console.log("prog" + prog);
});
app.get("/", function (req, res) {
    res.send("Welcome ").end();
});
app.get("/jobStatus", function (req, res) {
    if (jobId) {
        bitcodin.job.getStatus(jobId).then(function (resp) {
            console.log(resp);
            res.status(200).send(resp).end();
        }, function (err) {
            console.log(err);
        });
    }
    else {
        res.send(400).send("Bad Request").end();
    }
});
app.listen("8080", function () {
    console.log("Running at http://localhost:8080");
});
