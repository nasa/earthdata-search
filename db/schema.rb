# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170316054224) do

  create_table "access_configurations", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "dataset_id"
    t.text     "service_options"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "echoform_digest"
  end

  add_index "access_configurations", ["user_id"], name: "index_access_configurations_on_user_id"

  create_table "cron_job_histories", force: :cascade do |t|
    t.string   "task_name"
    t.datetime "last_run"
    t.string   "status"
    t.text     "message"
    t.string   "host"
  end

  add_index "cron_job_histories", ["task_name", "last_run"], name: "index_cron_job_histories_on_task_name_and_last_run"

  create_table "dataset_extras", force: :cascade do |t|
    t.string   "echo_id",                 null: false
    t.boolean  "has_browseable_granules"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "has_granules"
    t.string   "browseable_granule"
    t.string   "granule"
    t.text     "searchable_attributes"
    t.text     "orbit"
  end

  add_index "dataset_extras", ["echo_id"], name: "index_dataset_extras_on_echo_id", unique: true

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer  "priority",   default: 0, null: false
    t.integer  "attempts",   default: 0, null: false
    t.text     "handler",                null: false
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["created_at"], name: "index_delayed_jobs_on_created_at"
  add_index "delayed_jobs", ["failed_at"], name: "index_delayed_jobs_on_failed_at"
  add_index "delayed_jobs", ["priority", "run_at"], name: "delayed_jobs_priority"

  create_table "projects", force: :cascade do |t|
    t.text     "path"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
    t.string   "name"
  end

  create_table "retrievals", force: :cascade do |t|
    t.integer  "user_id"
    t.text     "jsondata"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "retrievals", ["user_id"], name: "index_retrievals_on_user_id"

  create_table "users", force: :cascade do |t|
    t.string   "echo_id"
    t.text     "site_preferences"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
