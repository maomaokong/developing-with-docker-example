let express = require('express');
let path = require('path');
let fs = require('fs');
let MongoClient = require('mongodb').MongoClient;
let bodyParser = require('body-parser');
let app = express();

app.use(bodyParser.urlencoded({
    extended: true    
}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// mongoEnv = 1-local; 2-docker
const mongoEnv = 'docker';
let mongoUrl;

if (mongoEnv === 'local') {
    // use when starting application locally
    mongoUrl = `mongodb://admin:${encodeURIComponent('P@ssw0rd')}@localhost:27017`;
} else {
    // use when starting application as docker container
    mongoUrl = `mongodb://admin:${encodeURIComponent('P@ssw0rd')}@mongodb`;
}

app.get('/profile-picture', function(req, res) {
    let img = fs.readFileSync(path.join(__dirname, '/images/profile-1.jpg'));
    res.writeHead(200, {
        'Content-Type': 'image/jpg',
    });
    res.end(img, 'binary');
});

app.post('/update-profile', function(req, res) {
    let userObj = req.body;

    console.log("connecting to the db...");

    MongoClient.connect(mongoUrl, function(err, client) {
        if (err) throw err;

        let db = client.db('user-account');
        userObj['userid'] = 1;

        let myQuery = { userid: 1 };
        let newValues = { $set: userObj };

        console.log("successfully connected to the user-account db...");

        db.collection('users').updateOne(myQuery, newValues, {upsert: true}, function(err, res) {
            if (err) throw err;
            console.log("successfully inserted or updated...");
            client.close();
        });
    });
    // send response
    res.send(userObj);
});

app.get('/get-profile', function(req, res) {
    let response = {};

    // connect to the db
    MongoClient.connect(mongoUrl, function(err, client) {
        if (err) throw err;

        let db = client.db('user-account');

        let myQuery = { userid: 1 };

        db.collection('users').findOne(myQuery, function(err, result) {
            if (err) throw err;

            response = result;
            client.close();

            // send response
            res.send(response ? response: {});
        });
    });
});

app.listen(3000, function() {
    console.log("app listening on port 3000!");
});
