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

ActiveRecord::Schema.define(version: 20141009161446) do

  create_table "access_configurations", force: true do |t|
    t.integer  "user_id"
    t.string   "dataset_id"
    t.text     "service_options"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "access_configurations", ["user_id"], name: "index_access_configurations_on_user_id"

  create_table "cmep_collections", force: true do |t|
    t.string   "username"
    t.string   "provider"
    t.string   "entry_title"
    t.text     "xml"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "validation_errors"
  end

  create_table "dataset_extras", force: true do |t|
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

  create_table "projects", force: true do |t|
    t.text     "path"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
    t.string   "name"
  end

  create_table "recent_datasets", force: true do |t|
    t.integer  "user_id"
    t.string   "echo_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "recent_datasets", ["user_id"], name: "index_recent_datasets_on_user_id"

  create_table "retrievals", force: true do |t|
    t.integer  "user_id"
    t.text     "jsondata"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "retrievals", ["user_id"], name: "index_retrievals_on_user_id"

  create_table "users", force: true do |t|
    t.string   "echo_id"
    t.text     "site_preferences"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
