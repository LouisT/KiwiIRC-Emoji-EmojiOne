# Kiwi IRC Emoji Plugin

This plugin uses the [emoji] set [EmojiOne]! Would you prefer [Twemoji]? Check out [KiwiIRC-Emoji-Twemoji]!

[EmojiOne] has a CDN hosted version, provided by [jsDelivr].
Therefore you can run [emoji-plugin.cdn.html](emoji-plugin.cdn.html) without any changes.

#### NOTE: Due to some languages not supporting the unicode encoding, this plugin wont work out of the box for everyone. As a workaround, please try [emoji-plugin.sn.cdn.html](emoji-plugin.sn.cdn.html).

![Example](https://github.com/LouisT/KiwiIRC-Emoji-EmojiOne/blob/master/assets/KiwiIRC-Emoji-EmojiOne.gif)

Usage
-
Place [emoji-plugin.cdn.html](emoji-plugin.cdn.html) in `/client/assets/plugins/` and edit `config.js` to include it in your plugins list.

```javascript
conf.client_plugins = [
    // "http://server.com/kiwi/plugins/myplugin.html"
    "/kiwi/assets/plugins/emoji-plugin.cdn.html",
    "/kiwi/assets/plugins/textstyle.html"
];
```

Plugin Generation
-
If you would prefer to host a copy of the [EmojiOne] files yourself, you can build a copy of the plugin using `./build-plugin.js --local`. If you wish to change the location of [EmojiOne] files you can do so with `--baseurl=<URL or Path>`; useful if your Kiwi IRC install is not at `http://domain.tld/kiwi/` or you want to use a different CDN.

#### NOTE: Due to some languages not supporting the unicode encoding, this plugin wont work out of the box for everyone. As a workaround, please try building with `--use-shortnames`.

In order to build the plugin, you will need to clone the [EmojiOne] repository relative to `build-plugin.js` using `git clone https://github.com/Ranks/emojione.git`

License
-
Copyright 2016 Louis T.

Code licensed under the MIT License: http://opensource.org/licenses/MIT

See http://creativecommons.org/licenses/by-sa/4.0/ for [EmojiOne] graphics license.


[Twemoji]: https://github.com/twitter/twemoji
[EmojiOne]: https://github.com/Ranks/emojione
[KiwiIRC-Emoji-Twemoji]: https://github.com/LouisT/KiwiIRC-Emoji-Twemoji
[emoji]: https://en.wikipedia.org/wiki/Emoji
[jsDelivr]: https://www.jsdelivr.com/
