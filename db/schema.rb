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

ActiveRecord::Schema.define(version: 20140613183356) do

  create_table "accepted_data_quality_summaries", force: true do |t|
    t.string   "dqs_id"
    t.string   "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "dataset_extras", force: true do |t|
    t.string   "echo_id"
    t.boolean  "has_browseable_granules"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "has_granules"
    t.string   "browseable_granule"
    t.string   "granule"
  end

  create_table "orders", force: true do |t|
    t.string   "order_id"
    t.string   "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "projects", force: true do |t|
    t.text     "path"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "retrievals", force: true do |t|
    t.integer  "user_id"
    t.text     "jsondata"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "echo_id"
    t.text     "site_preferences"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
