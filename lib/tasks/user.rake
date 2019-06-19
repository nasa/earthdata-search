namespace :user do
  desc 'Print User based on URS UID'
  task :print_user_by_urs_uid, [:uid] => ['environment'] do |_task, args|
    puts User.where('urs_profile LIKE ?', "%#{args[:uid]}%").inspect
  end

  desc 'Print User based on echo_id'
  task :print_user_by_echo_id, [:echo_id] => ['environment'] do |_task, args|
    puts User.where(echo_id: args[:echo_id]).inspect
  end
end
