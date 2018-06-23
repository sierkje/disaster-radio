This is the web app served up by the ESP8266 for Disaster Radio + the simulator web server.

# Setup

```
npm install
cp settings.js.example settings.js
```

# Building and running

```
npm run build # build the js and css
npm start # run the simulator server
```

Then in a browser open http://localhost:8000/

# Developing

```
npm run dev # starts simulator server and auto-builder with HMR
```

or if you don't like HMR:

```
./bin/dev.js --cold
```

# Uploading to ESP8266

After building with npm, the web app can be uploaded with `make flash_fs'

# License

* Code in this ../web/ folder is licensed under
  [AGPL version 3](https://github.com/sudomesh/disaster-radio/raw/master/web/LICENSE).
* This folder contains some SVG content,
  [designed by Smashicons from Flaticon](https://www.flaticon.com/packs/monsters-6),
  that is licensed under the
  [Flaticon Free License](https://github.com/sudomesh/disaster-radio/raw/master/web/src/core/assets/svg/source/avatars/license.pdf):
  - [./src/core/assets/svg/avatars.svg](https://github.com/sudomesh/disaster-radio/tree/master/web/src/core/assets/svg/avatars.svg)
  - [./src/core/assets/svg/source/avatars/*.svg](https://github.com/sudomesh/disaster-radio/tree/master/web/src/core/assets/svg/source/avatars)
