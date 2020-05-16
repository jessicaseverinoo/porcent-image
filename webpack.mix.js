let mix = require('laravel-mix');
let SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
let frontendImports = require('./resources/js/frontend-imports');
const environment = require('./resources/js/environment.js');

const httpRegex = 'http:\\/\\/|https:\\/\\/';
const projectProxy = environment.domain.replace(new RegExp(httpRegex), '');

require('laravel-mix-purgecss');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

/*
 * USAGE
 * <svg role="img">
 *   <use xlink:href="/svg/sprite.svg#050-santa-claus"/>
 * </svg>
 * <svg role="img">
 *   <use xlink:href="/svg/sprite.svg#049-deer"/>
 * </svg>
 * */
let wpConfig = {
  plugins: [
    new SVGSpritemapPlugin('resources/svg/*.svg', {
      output: {
        filename: 'public/svg/sprite.svg',
        svgo: {
          removeTitle: true,
        },
        chunk: {
          name: '../resources/js/spritemap',
        },
      },
      sprite: {
        prefix: false,
      },
    }),
  ],
};

mix.options({
  imgLoaderOptions: {
    enabled: true,
    gifsicle: {},
    mozjpeg: {
      quality: 85,
      progressive: true,
    },
    optipng: {
      enabled: false,
    },
    pngquant: {
      quality: '85-90',
      speed: 4,
    },
    svgo: {},
  },
});

mix
    .sass('resources/sass/frontend.scss', 'public/css')
    .options({
      processCssUrls: false,
      //     postCss: [
      //         require('postcss-sprites')({
      //             spritePath: 'images'
      //         }),
      //     ]
    })
    .copyDirectory('resources/fonts', 'public/fonts')
    .copyDirectory('resources/html', 'public')
    //.copyDirectory('resources/images', 'public/images')
    //.copy('resources/images/*', 'public/images')
    .babel(frontendImports, 'public/js/frontend.js');

if (!mix.inProduction()) {
  wpConfig.devtool = 'source-map';
  mix.sourceMaps()
  // .copyDirectory('resources/images', 'public/images')
      .copy('resources/images/**/*', 'public/images')
      .copy('resources/images/icons/favicon.ico', 'public');
}

mix.webpackConfig(wpConfig);

mix
  .js('resources/js/compress.js', 'public/js')
  .purgeCss({
    enabled: mix.inProduction(),
    globs: [
      path.join(__dirname, 'node_modules/@fancyapps/fancybox/dist/*.js'),
      path.join(__dirname, 'node_modules/tiny-slider/**/*.js'),
      path.join(
        __dirname,
        'node_modules/sweetalert2/dist/sweetalert2.min.js',
      ),
      path.join(__dirname, 'node_modules/jquery/dist/jquery.min.js'),
      path.join(__dirname, 'node_modules/select2/dist/**/*.js'),
      path.join(__dirname, 'node_modules/sweetalert2/dist/*.js'),
      path.join(
        __dirname,
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
      ),
    ],
    // Include classes we don't have direct access
    whitelistPatterns: [/hs-*/, /tns-*/],
  });

/*
 |--------------------------------------------------------------------------
 | BrowserSync
 |--------------------------------------------------------------------------
 */
mix.browserSync({
  host: '192.168.10.10',
  proxy: projectProxy,
  open: false,
  files: [
    'app/**/*.php',
    'resources/views/**/*.php',
    'packages/mixdinternet/frontend/src/**/*.php',
    'resources/js/**/*.js',
    'resources/sass/**/*.scss',
    'public/js/**/*.js',
    'public/css/**/*.css',
    'public/*.html',
  ],
  watchOptions: {
    usePolling: true,
    interval: 500,
  },
});
