Delayed::Worker.destroy_failed_jobs = true
Delayed::Worker.logger = Rails.logger
Delayed::Worker.delay_jobs = !Rails.env.test?
Delayed::Worker.max_attempts = 3
Delayed::Worker.default_queue_name = 'default'
