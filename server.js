const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongo = require("mongodb");
const key = require("./key").mongoURI;

let dbo;
const app = express();

app.use(bodyParser.json());
app.use(cors());
mongo.connect(
  key,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) throw err;
    dbo = client.db("test");
    console.log("DB Connected");
  }
);

app.get("/envs", (req, res) => {
  dbo
    .collection("infant")
    .find()
    .toArray((err, data) => {
      console.log(data);
      res.send(data);
    });
});

app.post("/sample", (req, res) => {
  dbo
    .collection("infant")
    .find()
    .toArray((err, data ) => {
      console.log(data);
       var array1 = req.body.data
       console.log(array1);
       var array2 =[];
      data.forEach(function(item) {
        array1.forEach(function(item1){
          if(item.name == item1)
            array2.push(item);
        })
       })
      res.send(array2);
    });
});

app.post("/envs", function(req, res) {
  var myobj = {
    name: req.body.name,
    value: req.body.value
  };
  dbo.collection("infant").insertOne(myobj, function(err, obj) {
    if (err) throw err;
    console.log("inserted");
    res.send("Successs");
  });
});

app.delete("/envs/:name", function(req, res) {
  var myquery = {
    name: req.params.name
  };
  dbo.collection("infant").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log("deleted");
    res.send("deleted");
  });
});

app.put("/envs", function(req, res) {
  var myquery = {
    name: req.body.update
  };
  var newvalues = {
    $set: {
      name: req.body.name,
      value: req.body.value
    }
  };
  console.log(
    "Name" + req.body.name + ", Update" + req.body.update,
    +"value" + req.body.name + ", Update" + req.body.update
  );
  dbo.collection("infant").updateOne(myquery, newvalues, function(err, data) {
    if (err) {
      res.send({ error: err });
    } else {
      res.send({ success: err });
    }
  });
});


app.listen(4000, "localhost", () => console.log("Running"));
