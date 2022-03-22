## Running the project on dev

Most straightforward way is

`"dev": "ts-node src/index.ts"`

Meaning that we are compiling the typescript files and using the ts files directly.

To use a way that's more similar to production we can do:

` "watch": "tsc -w",`

`"dev": "nodemon dist/index.js"`

The watch script is looking at the .ts files and compiling dist at each change, while nodemon re-runs the built project in dist.
