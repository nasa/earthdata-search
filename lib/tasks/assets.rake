namespace :node do
  desc 'compile node.js assets'
  task :compile do
    unless ENV['skip_node_compile'] == 'true'
      puts `npm install`
      raise 'Could not precompile node.js assets. Try running `npm install`' unless $? == 0
    end
  end
end

Rake::Task['assets:precompile'].enhance ['node:compile']
