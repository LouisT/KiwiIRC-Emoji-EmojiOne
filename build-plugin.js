#!/usr/bin/env node
/*
  Emoji Plugin Generator - Build an emoji plugin for Kiwi IRC using EmojiOne.

  Usage: build-plugin [--local] [--baseurl=<URL or Path>]
*/
var fs = require('fs'),
    path = require('path'),
    args = process.argv.slice(2);

if (!fs.existsSync('./emojione/')) {
   console.log('EmojiOne is missing! Install with git and run again:\n\n   git clone https://github.com/Ranks/emojione.git');
   process.exit(1);
}

/*
  Parse argv for settings.
*/
var settings = {
    overwrite: false,
    baseurl: '//cdn.jsdelivr.net/emojione/2.0.1',
    imghost: '//cdn.jsdelivr.net/emojione',
    local: false
};
args.forEach(function (arg) {
    var match = null;
    if ((match = arg.match(/--baseurl=(.+)/i))) {
       settings.baseurl = match[1];
     } else if ((match = arg.match(/--local/i))) {
       settings.local = true;
    }
});
if (settings.local) {
   if (settings.baseurl.indexOf('maxcdn') >= 0) {
      settings.baseurl = "/kiwi/assets/emojione";
      console.log('\n\nNOTICE: Local install mode enabled without "--baseurl" - Default: "'+settings.baseurl+'"\n');
   }
   settings.imghost = settings.baseurl;
   console.log('\nPlease copy "./emojione/" to: /client/assets/emojione/');
}

if (fs.existsSync('./emojione/emoji.json')) {
   var json = require('./emojione/emoji.json');

   var mapped = {}, stringed = [], toggles = [], tabs = [], count = 0;

   Object.keys(json).forEach(function (key) {
         var data = json[key];

         // XXX: http://unicode.org/reports/tr51/#Emoji_Modifiers_Table
         if (data.category !== 'modifier') {
            if (!mapped[data.category]) {
               mapped[data.category] = [];
            }
            mapped[data.category].push({
                unicode: data.unicode,
                shortname: data.shortname
            });
            count++;
         }
   });

   Object.keys(mapped).forEach(function (key, idx) {
        stringed.push('    '+key+': '+JSON.stringify(mapped[key]));
        toggles.push(['    <span class="emojiToggle'+(idx==0?' emojiInit':'')+'" target="'+key+'">',
                      '<img src="'+settings.imghost+'/assets/png/'+mapped[key][0].unicode+'.png" width="20px" height="20px" title="Category: '+key+'" />',
                      '</span>'].join(''));
        tabs.push('    <div class="emojiTab" id="'+key+'"></div>');
   });

   var data = fs.readFileSync('./src/plugin.html').toString();
   var format = {
       baseurl: settings.baseurl,
       imghost: settings.imghost,
       buildmode: (settings.local?'Local Install':'CDN Install'),
       date: new Date(),
       count: count,
       emojiToggles: '\n'+toggles.join('\n')+'\n ',
       emojiTabs: '\n'+tabs.join('\n')+'\n ',
       emojis: '{\n'+stringed.join(',\n')+'\n};',
   };

   var plug = 'emoji-plugin.'+(settings.local?'local':'cdn')+'.html';
   fs.writeFileSync('./'+plug,formatter(data,format));
   if (!fs.existsSync('./'+plug)) {
      console.warn('Failed installing pluign to '+paths.plugin);
    } else {
      console.log('\nPlugin created: '+plug+'\n');
   }

 } else {
   console.log('Could not find emoji.json!');
   process.exit(1);
}

function formatter (str, values) {
         return str.replace(/{{(?:\\?:)([^|}]+)(?:\|([^|]+))?}}/g,function(match, key, opt) {
                return (values[key]?values[key]:(opt?opt:match));
         });
}
