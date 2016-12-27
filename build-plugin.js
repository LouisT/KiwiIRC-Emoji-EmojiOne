#!/usr/bin/env node
/*
  Emoji Plugin Generator - Build an emoji plugin for Kiwi IRC using EmojiOne.

  Usage: build-plugin [--local] [--baseurl=<URL or Path>]
*/
var fs = require('fs'),
    path = require('path'),
    args = process.argv.slice(2);

if (!fs.existsSync('./emojione/package.json')) {
   console.log('\nEmojiOne is missing! Install with git and run again:\n\n   git clone https://github.com/Ranks/emojione.git\n');
   process.exit(1);
}

/*
  Load the EmojiOne package.json to get version information.
*/
var emojione = require('./emojione/package.json');

/*
  Parse argv for settings.
*/
var settings = {
    overwrite: false,
    baseurl: '//cdn.jsdelivr.net/emojione/'+emojione.version,
    imghost: '//cdn.jsdelivr.net/emojione',
    local: false,
    version: emojione.version,
    method: 'shortnameToUnicode'
};

args.forEach(function (arg) {
    var match = null;
    if ((match = arg.match(/--baseurl=(.+)/i))) {
       settings.baseurl = match[1];
     } else if ((match = arg.match(/--local/i))) {
       settings.local = true;
     } else if ((match = arg.match(/--use-shortnames?/i))) {
       settings.method = 'toShort';
       console.log('\nNOTICE: Shortname mode enabled; will not be converting to unicode.');
    }
});
if (settings.local) {
   if (settings.baseurl.indexOf('jsdelivr') >= 0) {
      settings.baseurl = "/kiwi/assets/emojione";
      console.log('\nNOTICE: Local install mode enabled without "--baseurl" - Default: "'+settings.baseurl+'"');
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
            var emoji = {
                u: data.unicode,
                s: data.shortname
            };
            if (data.unicode_alternates) {
               emoji.a = data.unicode_alternates;
            }
            mapped[data.category].push(emoji);
            count++;
         }
   });

   Object.keys(mapped).forEach(function (key, idx) {
        stringed.push('    '+key+': '+JSON.stringify(mapped[key]));
        toggles.push(['    <span class="emojiToggle'+(idx==0?' emojiInit':'')+'" target="'+key+'">',
                      '<img src="'+settings.imghost+'/assets/png/'+mapped[key][0].u+'.png" width="20px" height="20px" title="Category: '+key+'" />',
                      '</span>'].join(''));
        tabs.push('    <div class="emojiTab" id="'+key+'"></div>');
   });

   var data = fs.readFileSync('./src/plugin.html').toString();
   var format = {
       method: settings.method,
       baseurl: settings.baseurl,
       imghost: settings.imghost,
       buildmode: (settings.local?'Local Install':'CDN Install'),
       date: new Date(),
       count: count,
       emojiToggles: '\n'+toggles.join('\n')+'\n ',
       emojiTabs: '\n'+tabs.join('\n')+'\n ',
       emojis: '{\n'+stringed.join(',\n')+'\n};',
   };

   var plug = 'emoji-plugin.'+(settings.method=='toShort'?'sn.':'')+(settings.local?'local':'cdn')+'.html';
   fs.writeFileSync('./'+plug,formatter(data,format));
   if (!fs.existsSync('./'+plug)) {
      console.warn('\nFailed installing pluign to '+paths.plugin+'\n');
    } else {
      console.log('\nPlugin created: '+plug+' (EmojiOne: '+settings.version+')\n');
   }

 } else {
   console.log('\nCould not find emoji.json!\n');
   process.exit(1);
}

function formatter (str, values) {
         return str.replace(/{{(?:\\?:)([^|}]+)(?:\|([^|]+))?}}/g,function(match, key, opt) {
                return (values[key]?values[key]:(opt?opt:match));
         });
}
