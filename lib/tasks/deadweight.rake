unless Rails.env.production?
  namespace :test do
    require 'deadweight'

    desc 'Run deadweight to discover CSS rules that are not exercised in the pattern portfolio'
    task deadweight: 'doc:ui'
    Deadweight::RakeTask.new do |dw|
      dw.root = './'
      dw.stylesheets = Dir.glob('public/assets/**/*.css')
      ignored_class_prefixes = ['fa',
                                'leaflet',
                                'toast',
                                'xdsoft',
                                'dropzone',
                                'dz',
                                'slider',
                                'popover',
                                'tooltip',
                                'modal',
                                'dropdown',
                                'dropup',
                                'navbar',
                                'nav',
                                'tab',
                                'alert',
                                'echoforms',
                                'old-ie',
                                'no-js',
                                'lt-ie9',
                                'geojson',
                                'knockout',
                                'clearfix',
                                'tt',
                                'projection',
                                'is',
                                'alert',
                                'nav',
                                'map',      # Map and timeline are custom but their elements are generally meant to be created
                                'timeline', # in Javascript and their styles aren't meant to be reused outside of their context
                                'noscript']

      dynamic_selectors = ['data-level="\d"', # Classes describing dynamic behavior, typically just hiding things
                           '-hide',
                           '-minimized',
                           '-hidden']
      dw.ignore_selectors = /(^(.*:-webkit-|.panel([^-]|-[^l])|@|#|(\.|#)(#{ignored_class_prefixes.join('|')})([\W_]|$))|.*(#{dynamic_selectors.join('|')})).*/
      dw.pages = Dir.glob('doc/ui/portfolio/*.html')
    end
  end
end
