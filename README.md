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

## Releasing

Bump `version` in `package.json`, commit, then tag and push:

```sh
git tag -a v0.2.0 -m "v0.2.0" && git push origin v0.2.0
```

The `release` workflow checks the tag matches `package.json`, runs the typecheck and tests, and updates `url` and `sha256` in [`ericwafula/homebrew-tools`](https://github.com/ericwafula/homebrew-tools). Users then pick it up with `brew upgrade dcke`. It pushes to the tap with the `HOMEBREW_TAP_DEPLOY_KEY` secret, a deploy key with write access to that repo only.
