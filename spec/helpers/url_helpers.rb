require 'addressable/uri'

module Helpers
  module UrlHelpers
    class QueryBuilder
      def add_to(url, options)
        url = url.to_s
        url = '/projects/new' if url == 'projects_page'
        url = '/search/collection-details' if url == 'collection_details'
        url = '' if url == 'root'
        url = '/' + url unless url.start_with?('/')
        [path_from_options(url, options), params_from_options(options)].map(&:presence).compact.join('?')
      end

      private

      def path_from_options(url, options)
        if url == '/search'
          url = '/search/collections' unless options[:facets]
          url = '/search/map' if options[:overlay] == false
          url = '/search/project' if options[:view] == :project
          url = '/search/granules' if options[:focus]
        end
        url = "/portal/#{options[:portal]}#{url}" if options[:portal]
        url
      end

      def params_from_options(options)
        params = {}

        %i[bounding_box sb point sp polygon].each do |type|
          params[type.to_s] = spatial(options[type]) if options[type]
        end

        envs = { sit: 'sit', uat: 'uat', prod: 'prod' }
        params['cmr_env'] = envs[options[:env].to_sym] if options[:env]
        params['qt'] = temporal(*options[:temporal]) if options[:temporal]
        params['tl'] = "#{options[:timeline].to_i}!4!!" if options[:timeline]
        params['sgd'] = options[:granule_id] if options[:granule_id]
        if options[:q]
          params['q'] = options[:q]
          params['ok'] = options[:q]
        end
        params['ff'] = options[:ff] if options[:ff]
        params['fpj'] = options[:fpj] if options[:fpj]
        params['fl'] = options[:fl] if options[:fl]
        params['test_facets'] = true if options[:facets]

        p = ([options[:focus]] + Array.wrap(options[:project])).join('!')
        params['p'] = p if p.present?

        Array.wrap(options[:queries]).each_with_index do |q, i|
          obj = {}
          obj = q if q
          if obj.keys.present?
            params['pg'] ||= {}
            params['pg'][i] = obj
          end
        end

        [:labs].each do |direct_param|
          params[direct_param.to_s] = options[direct_param] if options.key?(direct_param)
        end

        params['ac'] = true if options[:ac]

        result = []
        params.each do |k, v|
          param = {}
          param[k] = v
          result << param.to_param
        end

        # Ensure sorted order
        result.join('&')
      end

      def temporal(start, stop = nil, range = nil)
        start = start.strftime('%Y-%m-%dT%H:%M:%S.000Z') if start && start.is_a?(DateTime)
        stop = stop.strftime('%Y-%m-%dT%H:%M:%S.000Z') if stop && stop.is_a?(DateTime)
        ([start || '', stop || ''] + Array.wrap(range)).join(',')
      end

      def spatial(latlngs)
        lnglats = latlngs.each_slice(2).map(&:reverse).flatten
        lnglats.join(',')
      end
    end

    def clear_rack_session
      page.set_rack_session(expires_in: 0)
      page.set_rack_session(access_token: nil)
      page.set_rack_session(refresh_token: nil)
      page.set_rack_session(user_name: nil)
      page.set_rack_session(user_id: nil)
      page.set_rack_session(logged_in_at: nil)
    end

    def load_page(url, options = {})
      close_banner = options.delete(:close_banner)
      keep_tour_open = options.delete(:keep_tour_open)

      ActiveSupport::Notifications.instrument 'edsc.performance', activity: 'Page load' do
        options[:env] = 'prod' unless options.key?(:env)

        options[:env] ||= cmr_env.to_sym

        # If the cmr_env is production, we reset the session values because it wont be provided to this method
        if options[:env].to_s == 'prod'
          Capybara.reset_sessions!

          clear_rack_session
        end

        options.select { |option| [:env].include?(option) }.each do |key, value|
          page.set_rack_session(key => value)
        end

        authenticate_as = options.delete(:authenticate)

        User.find_or_create_by(echo_id: authenticate_as || 'edsc') do |user|
          user.urs_profile = {"uid"=>"edsc", "first_name"=>"Earthdata", "last_name"=>"Search", "registered_date"=>"17 Mar 2016 18:03:52PM", "email_address"=>"patrick+edsc@element84.com", "organization"=>"EDSC", "country"=>"United States", "affiliation"=>"Government", "authorized_date"=>" 8 Jan 2019 20:41:07PM", "allow_auth_app_emails"=>true, "agreed_to_meris_eula"=>false, "agreed_to_sentinel_eula"=>false, "user_groups"=>[], "user_authorized_apps"=>2}
          user.echo_profile = {"user"=>{"addresses"=>[{"country"=>"United States", "id"=>"9EB3CF47-42B8-3FAA-34FB-65020CF1DABD", "us_format"=>false}], "creation_date"=>"2016-03-17T22:03:52Z", "email"=>"patrick+edsc@element84.com", "first_name"=>"EDSC", "id"=>"BA9DCE89-8B18-478F-2C71-76D31846E351", "last_name"=>"System", "opt_in"=>false, "primary_study_area"=>"UNSPECIFIED", "user_domain"=>"GOVERNMENT", "user_region"=>"USA", "user_type"=>"UNSPECIFIED", "username"=>"edsc"}} 
          user.echo_preferences = {"preferences":{"general_contact":{"first_name":"Earthdata","last_name":"Search", "email_address":"patrick+edsc@element84.com","organization":"EDSC","address":{"country":"United States"}, "phones":{"0":{"number":"0000000000","phone_number_type":"BUSINESS"}},"role":"Order Contact"},"order_notification_level":"NONE"}}
        end

        be_logged_in_as(authenticate_as, options[:env]) if authenticate_as

        url = QueryBuilder.new.add_to(url, options)

        # Leave for debugging, comment out when not in use
        # puts "URL: #{url}"

        visit url

        wait_for_xhr

        # Close tour modal
        unless keep_tour_open
          page.execute_script("$('#closeInitialTourModal').trigger('click')")
        end

        # Close banner
        if close_banner.present? && close_banner || close_banner.nil?
          while page.evaluate_script('document.getElementsByClassName("banner-close").length != 0')
            page.execute_script("$('.banner-close').click()")
          end
        end
      end
    end
  end
end
