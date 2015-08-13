Delayed::Worker.destroy_failed_jobs = false
Delayed::Worker.logger = Rails.logger
Delayed::Worker.delay_jobs = !Rails.env.test?
Delayed::Worker.max_attempts = 3
