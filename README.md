# dcke

A terminal tool that sets up new projects and initializes existing ones.

```sh
brew install ericwafula/tools/dcke
dcke init
```

- **Inside an existing project**, it detects the type (android, kmp, ios, springboot) and writes `.dcke/config.json`.
- **Anywhere else**, it asks which type of project you want and creates it in `./<Name>/`.

To skip the prompts, pass flags:

```sh
dcke init --type android --name Todo --package com.acme.todo
```

So far only `android` can be created. See [TODO.md](TODO.md) for what's next.

## Development

```sh
npm install
npm run build && npm link   # puts `dcke` on your PATH
npm test
```
