require 'rails_helper'

describe OrderStatusJob do
  context 'stall time' do
    it 'correctly determines the stall time for jobs created less than 20 minutes ago' do
      stall_time = OrderStatusJob.new.stall_time(Time.zone.now - 15.minutes)

      expect(stall_time).to eq(30)
    end

    it 'correctly determines the stall time for jobs created 20 minutes ago' do
      stall_time = OrderStatusJob.new.stall_time(Time.zone.now - 20.minutes)

      expect(stall_time).to eq(5.minutes)
    end

    it 'correctly determines the stall time for jobs created less than 2 hours ago' do
      stall_time = OrderStatusJob.new.stall_time(Time.zone.now - 110.minutes)

      expect(stall_time).to eq(5.minutes)
    end

    it 'correctly determines the stall time for jobs created 2 hours ago' do
      stall_time = OrderStatusJob.new.stall_time(Time.zone.now - 120.minutes)

      expect(stall_time).to eq(1.hour)
    end

    it 'correctly determines the stall time for jobs created more than 2 hours ago' do
      stall_time = OrderStatusJob.new.stall_time(Time.zone.now - 121.minutes)

      expect(stall_time).to eq(1.hour)
    end

    it 'correctly determines the stall time for jobs created 2 weeks ago' do
      stall_time = OrderStatusJob.new.stall_time(Time.zone.now - 2.weeks)

      expect(stall_time).to eq(false)
    end

    it 'correctly determines the stall time for jobs created more than 2 weeks ago' do
      stall_time = OrderStatusJob.new.stall_time(Time.zone.now - 1.month)

      expect(stall_time).to eq(false)
    end
  end
end
