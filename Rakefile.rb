# Based on https://github.com/jhabdas/habd.as/blob/master/Rakefile.rb

# Usage: rake build
desc "Regenerate files for production"
task :build do
  puts "* Regenerating files for production..."
  system "JEKYLL_ENV=production bundle exec jekyll build"
end

# Usage: rake s3_website
desc "push the contents of ./_site to S3"
task :s3_website do
  puts "* syncing the contents of ./_site to the server"
  system "s3_website push" # use --force with S3 config updates
end

# Usage: rake deploy
task :deploy => ["deploy:prod"]
namespace :deploy do
  desc "Regenerate and sync production files"
  task :prod => ["build", "s3_website"] do
  end
end
