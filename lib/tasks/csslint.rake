unless Rails.env.production? || Rails.env.uat? || Rails.env.sit?
  namespace :test do
    require 'csslint/testtask'

    # This is ugly.  There's a problem with our use of the CSSLint gem.
    # CSSLint::TestTask evaluates its constructor block immediately, which
    # means the list of CSS files gets set as soon as this file is loaded.
    # We subsequently clobber the assets directory and re-generate it,
    # which means CSSLint looks for files that don't exist.  This class
    # is an enumerable-like class that only fetches the asset files when
    # it's time to actually iterate over them.
    class CssLintFiles
      def files
        @files ||= Dir['public/assets/**/*.css']
      end

      def each(*args)
        files.each(*args)
      end

      def length
        files.length
      end
    end

    CSSLint::TestTask.new do |t|
      t.file_list = CssLintFiles.new
    end
    task csslint: 'doc:ui'
  end
end
