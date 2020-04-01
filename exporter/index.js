// config
const path = '../web/assets/mc-html-recipes.json';
const width = 1024;

// imports
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

// entry point
request('https://minecraft.gamepedia.com/Template:InvSprite', function (error, response, body) {
  console.error('error:', error);
  console.log('status:', response && response.statusCode);

  const $ = cheerio.load(body);
  var data = {width: width, nameIdMap: {}};

  $('.spritedoc-box').each(function(i, elem) {
    elem = $(elem);
    var image = elem.children('.spritedoc-image').first();
    var sprite = image.children('.inv-sprite').first();

    var names = elem.children('.spritedoc-names').first();
    var name = names.children('.spritedoc-name').first().children('code').first().html();

    var pos = sprite.css('background-position').replace(/px/g, '').split(' ');
    var col = Math.floor(-pos[0] / 32);
    var row = Math.floor(-pos[1] / 32);

    var id = row * 32 + col;
    data.nameIdMap[name] = id;
    // console.log(`${name} | ${sprite.css('background-position')} | ${id}`);
  });

  data = JSON.stringify(data);
  fs.writeFileSync(path, data);
  console.log(`Output written to '${path}!'`)
});