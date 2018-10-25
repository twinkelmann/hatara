const mix = require('laravel-mix')

const folder = mix.inProduction() ? 'docs' : 'public'

mix
  .setPublicPath(folder)
  .js('src/app.js', folder)
  .extract([
    'mithril',
  ])
  .sass('src/app.scss', folder)

  .copy('res', folder)
  .copy('src/index.html', folder)

  .disableNotifications()
  .options({ processCssUrls: false })
  .sourceMaps(false)  // enable source maps but not in production
