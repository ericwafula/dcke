# TODO

## Project types for `dcke init`

- [x] android: single-module Jetpack Compose app
- [ ] kmp: Compose Multiplatform (androidApp, iosApp, shared)
- [ ] ios: SwiftUI app (decide between xcodegen and a checked-in .xcodeproj)
- [ ] springboot: Kotlin + Gradle Spring Boot service

## Existing projects

- [ ] Decide what `dcke init` should do in an existing project beyond writing `.dcke/config.json`

## Distribution

- [ ] Publish the source as the public repo `ericwafula/dcke`
- [ ] Tag v0.1.0
- [ ] Create the public tap repo `ericwafula/homebrew-tools` with `Formula/dcke.rb`, installed via `brew install ericwafula/tools/dcke` (depends on node; builds dist/ and installs dist/ and templates/ into libexec)
- [ ] Add a release workflow that bumps the formula when a new tag is pushed
