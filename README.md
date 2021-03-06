[![Build Status](https://secure.travis-ci.org/boluge/bespoke-theme-boluge.png?branch=master)](https://travis-ci.org/boluge/bespoke-theme-boluge)

# bespoke-theme-boluge

A theme for [Bespoke.js](http://markdalgleish.com/projects/bespoke.js) &mdash; [View demo](http://boluge.github.io/bespoke-theme-boluge)

## Download

Download the [production version][min] or the [development version][max], or use a [package manager](#package-managers).

[min]: https://raw.github.com/boluge/bespoke-theme-boluge/master/dist/bespoke-theme-boluge.min.js
[max]: https://raw.github.com/boluge/bespoke-theme-boluge/master/dist/bespoke-theme-boluge.js

## Usage

This theme is shipped in a [UMD format](https://github.com/umdjs/umd), meaning that it is available as a CommonJS/AMD module or browser global.

For example, when using CommonJS modules:

```js
var bespoke = require('bespoke'),
  boluge = require('bespoke-theme-boluge');

bespoke.from('#presentation', [
  boluge()
]);
```

When using browser globals:

```js
bespoke.from('#presentation', [
  bespoke.themes.boluge()
]);
```

## Gulpfile

Add 'fontTheme' to copy fonts files and use it in fonts.

```js
gulp.task('fontTheme', function() {
  return gulp.src('node_modules/bespoke-theme-boluge/demo/src/fonts/**/*')
    .pipe(gulp.dest('src/fonts'))
    .pipe(connect.reload());
});
// Call the copy method "fontTheme" in the "fonts" task 
gulp.task('fonts', ['fontTheme', 'clean:fonts'], function() {
  return gulp.src('src/fonts/*')
    .pipe(gulp.dest('dist/fonts'))
    .pipe(connect.reload());
});
```

## Package managers

### npm

```bash
$ npm install bespoke-theme-boluge
```

### Bower

```bash
$ bower install bespoke-theme-boluge
```

## Credits

This theme was built with [generator-bespoketheme](https://github.com/markdalgleish/generator-bespoketheme).

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
