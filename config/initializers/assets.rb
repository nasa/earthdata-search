# Ensures an exclusive system-wide lock on the given file, preventing simultaneous runs
def pidlock(pidfile)
  if pidfile
    File.open(pidfile, File::RDWR | File::CREAT) do |file|
      if file.flock(File::LOCK_EX | File::LOCK_NB)
        begin
          yield
        ensure
          file.flock(File::LOCK_UN)
        end
      end
    end
  else
    yield nil
  end
rescue => e
  Rails.logger.info e.message
  Rails.logger.info e.backtrace.join("\n")
end

# Run the script defined in package.json, logging its output to the Rails log.
def npm(command)
  # We do things this way to avoid having zombie sub-processes
  package = JSON.parse(File.open(Rails.root.join('package.json')) { |f| f.read } )
  executable = package['scripts'][command]
  announce = "== ASSETS: Running node compilation process: #{executable}"
  Rails.logger.info announce
  puts announce
  require 'open3'
  pid = nil
  Open3::popen3(executable, chdir: Rails.root, pgroup: true) do |stdin, stdout, stderr, thread|
    pid = thread.pid
    Thread.new do
      until (line = stdout.gets).nil?
        Rails.logger.info("== ASSETS: #{line.chomp}")
      end
    end
    Thread.new do
      until (line = stderr.gets).nil?
        Rails.logger.error("== ASSETS: #{line.chomp}")
      end
    end
    thread.join
    pid = nil
  end
ensure
  Process.kill('INT', pid) unless pid.nil?
end

# In development mode, when running a server, also precompile assets in the background, ensuring
# that only one process runs at once
if Rails.env.development? && ENV['IS_RACK_RUN'] == 'true'
  npm 'prepublish'
  pidlock(Rails.root.join('tmp', 'pids', 'npm-start')) do
    Thread.new do
      npm 'start'
    end
  end
end

# When running rspec tests, start by precompiling assets, unless flags say otherwise
npm 'prepublish' if Rails.env.test? && ENV['PRECOMPILE_NODE_ASSETS'] == 'true'
