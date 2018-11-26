namespace :doc do
  desc 'Generate the UI documentation and tests'
  task ui: ['environment', 'assets:clobber', 'assets:precompile'] do
    require 'fileutils'
    require Rails.root.join('doc', 'ui', 'support', 'offline_template')
    doc_portfolio = Rails.root.join('doc', 'ui', 'portfolio')
    FileUtils.mkdir_p(doc_portfolio)
    FileUtils.rm_r(doc_portfolio)

    Dir.glob(Rails.root.join('doc', 'ui', 'templates', '**', '*.html.erb')) do |template|
      output_path = template.gsub('/templates/', '/portfolio/').gsub(/\.erb$/, '')
      FileUtils.mkdir_p(File.dirname(output_path))
      File.delete(output_path) if File.exist?(output_path) # clean up previous versions
      f = File.new(output_path, 'w')
      f.puts(OfflineTemplate.new.render_to_string(layout: 'layouts/application', file: template))
      f.flush
      f.close
    end

    app_assets = Rails.root.join('public', 'assets')
    FileUtils.cp_r(app_assets, doc_portfolio)

    css_files = Dir.glob("#{doc_portfolio}/assets/*.css")
    css_files.each do |file|
      text = File.read(file)
      replacement = text.gsub('url(/assets/', 'url(./')
      File.open(file, 'w') { |file| file.puts replacement }
    end
  end
end

Rake::Task[:doc].enhance(['doc:ui'])
