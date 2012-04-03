var express   = require('express'),
    fs        = require('fs'),
    search    = require('server/search.js'),
    favs      = require('server/favorites.js'),
    site      = express.createServer(),
    staticDir = express['static'];

site.configure(function() {
  [ 'app', 'lib', 'css' ].forEach(function(dir) {
    site.use('/' + dir, staticDir('./' + dir));
  });
  site.use(express.bodyParser());
});

site.get("/", function(req, res) {
  fs.createReadStream('./index.html').pipe(res);
});

site.get("/search/:term", function(req, res) {
  var term = req.params.term;

  search(req.params.term).then(
    function(data) {
      res.end(JSON.stringify(data));
    },
    function(statusCode) {
      throw new Error();
    }
  );
});

site.put("/favorites", function(req, res) {
  var fav = JSON.parse(req.body.favorite);
  var id = favs.add(fav);
  res.end(JSON.stringify({ id : id }));
});

site.delete("/favorites/:id", function(req, res) {
  favs.remove(req.params.id);
  res.end(JSON.stringify({ success : true }));
});

site.get("/favorites", function(req, res) {
  res.end(JSON.stringify({ favorites : favs.get() }));
});

// Actually listen
site.listen(4444);