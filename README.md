# FTB Tool #

A simple CLI tool for searching for and downloading Feed the Beast modpacks.

<!-- omit in toc -->
## Table of Contents ##

* [FTB Tool](#ftb-tool)
    * [Contributing](#contributing)
        * [Setup](#setup)
        * [Code Styling](#code-styling)
        * [Testing](#testing)
    * [Building Standalone Binaries](#building-standalone-binaries)
    * [License](#license)

## Contributing ##

This project accepts outside contributions. Please see the following sections
for information about how to get setup for contributing.

### Setup ###

Getting setup to develop is fairly straight forward. Follow these steps:

1. Run `npm install` to install required dependencies.

That's about it! To run the tool locally simply use:

```sh
npm run dev -- <ARGS>
```

### Code Styling ###

This project uses a combination of [Husky](https://www.npmjs.com/package/husky),
[ESLint](https://www.npmjs.com/package/eslint), and
[Prettier](https://www.npmjs.com/package/prettier) for code styling. To run
ESLint you can use:

```sh
npm run lint
```

To automatically fix any lint issues that can be fixed you can run:

```sh
npm run lint:fix
```

This project is configured with a `pre-commit` hook to run the linting tool and
abort a Git commit if it finds issues. You can bypass this with the
`--no-verify` flag:

```sh
git commit --no-verify
```

Please do not use this unless you only changed non-linted files and there was
already a linting error in the codebase.

All pull requests should not fail linting. The linting rules can be changed with
discussion.

### Testing ###

To run unit tests use:

```sh
npm test
```

All existing tests should pass before you submit a pull request.

## Building Standalone Binaries ##

This project uses [@yao-pkg/pkg](https://www.npmjs.com/package/@yao-pkg/pkg) to
create standalone binaries for use on various operating systems.

To create a standalone binary for your current operating system:

```sh
npm run build:standalone
```

To create a standalone binary for your all supported operating systems:

```sh
npm run build:standalone:all
```

The final binaries will be placed in the `dist` folder, suffixed with the
operating system they are destined for.

## License ##

Copyright (c) 2023 G'lek Tarssza

Licensed under the MIT License.

See [LICENSE.md](LICENSE.md) for the full license.
