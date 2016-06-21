require "spec_helper"

describe DataAccessController do
  describe "GET options" do
    let(:hits) { 0 }
    let(:downloadable) { 0 }
    let(:orderable) { 0 }
    let(:serviceable) { 0 }
    let(:size) { nil }
    let(:order_refs) { [{'id' => 'opt_1', 'name' => 'Order Option 1'}, {'id' => 'opt_2', 'name' => 'Order Option 2'}] }
    let(:order_forms) { {'opt_1' => '<first_form/>', 'opt_2' => '<second_form/>'} }
    let(:service_ref) { {'id' => 'opt_1'} }
    let(:service_form) { {'opt_1' => {'form' => '<service_form/>', 'name' => 'Service Option 1', 'name' => 'Service Option 1'}} }

    let(:body) do
      session[:urs_user] = {present: true}
      session[:user_id] = 'myid'
      session[:access_token] = 'some token'
      session[:refresh_token] = 'some refresh token'
      session[:expires_in] = 99999999
      session[:logged_in_at] = Time.now.to_i

      granule_count = [hits, 150].min

      granules = ((0...granule_count).map {|i| {'id' => "granule_id_#{i}"}}).to_a

      granules.take(downloadable).each do |granule|
        granule['online_access_flag'] = 'true'
      end

      unless size.nil?
        sizeMB = (size.to_f / (1024 * 1024 * hits)).to_s
        granules.each do |granule|
          granule['granule_size'] = sizeMB
        end
      end

      granules_response = MockResponse.atom(granules, {'cmr-hits' => hits.to_s})
      mock_client = Object.new
      allow(Echo::Client).to receive('client_for_environment').and_return(mock_client)
      expect(mock_client).to receive('get_granules').and_return(granules_response)

      if hits > 0
        order_info_response = []

        order_infos = granules.take(orderable).map do |granule|
          {
            'order_information' => {
              'catalog_item_ref' => {'id' => granule['id']},
              'option_definition_refs' => order_refs
            }
          }
        end

        order_info_response = MockResponse.new(order_infos)
        expect(mock_client).to receive('get_order_information').and_return(order_info_response)

        if orderable > 0
          order_refs.each do |ref|
            id = ref['id']
            option_def_response = MockResponse.new('option_definition' => {'form' => order_forms[id]})
            expect(mock_client).to receive('get_option_definition').with(id, session[:access_token]).and_return(option_def_response)
          end
        end

        service_infos = []
        serviceable.times do |index|
          service_infos << {
                              "service_option_assignment" => {
                                "catalog_item_id" => "item_id",
                                "id" => "assignment_id",
                                "service_entry_id" => "entry_id",
                                "service_option_definition_id" => "opt_1"
                              }
                            }
        end

        service_info_response = MockResponse.new(service_infos)
        expect(mock_client).to receive('get_service_order_information').and_return(service_info_response)

        if serviceable > 0
          id = service_ref['id']
          service_option_def_response = MockResponse.new('service_option_definition' => {'form' => service_form[id]['form'], 'name' => service_form[id]['name']})
          expect(mock_client).to receive('get_service_option_definition').with(id, session[:access_token]).and_return(service_option_def_response)
        end
      end

      get :options, format: 'json'

      JSON.parse(response.body)
    end

    let(:access_methods) { body['methods'] }

    context 'when requesting options for a collection with no matching granules' do
      let(:hits) { 0 }

      it "returns 0 granule hits" do
        expect(body['hits']).to eql(0)
      end

      it "returns an empty list of available methods" do
        expect(body['methods']).to eql([])
      end
    end

    context 'when requesting options for a collection with matching granules' do
      let(:hits) { 10 }

      it "returns a response containing the number of matching granules" do
        expect(body['hits']).to eql(hits)
      end

      context 'whose granules are downloadable' do
        let(:downloadable) { 1 }

        it 'returns a response containing a "Download" access method' do
          expect(body['methods'].size).to eql(1)
          expect(access_methods.first['name']).to eql('Download')
        end

        context 'when there are more than 150 matching granules' do
          let(:hits) { 200 }

          context 'and all are downloadable' do
            let(:downloadable) { 150 }

            it 'indicates that all matching granules are downloadable' do
              expect(access_methods.first['all']).to eql(true)
            end

            it 'gives a count equal to the granule hits' do
              expect(access_methods.first['count']).to eql(hits)
            end
          end

          context 'and not all are downloadable' do
            let(:downloadable) { 75 }

            it 'indicates that not all matching granules are downloadable' do
              expect(access_methods.first['all']).to eql(false)
            end

            it 'gives an estimated count produced by the percentage of downloadable granules found' do
              expect(access_methods.first['count']).to eql(hits / 2)
            end
          end
        end

        context 'when there are fewer than 150 matching granules' do
          let(:hits) { 10 }

          context 'and all are downloadable' do
            let(:downloadable) { 10 }

            it 'indicates that all matching granules are downloadable' do
              expect(access_methods.first['all']).to eql(true)
            end

            it 'gives a count equal to the granule hits' do
              expect(access_methods.first['count']).to eql(hits)
            end
          end

          context 'and not all are downloadable' do
            let(:downloadable) { 5 }

            it 'indicates that not all matching granules are downloadable' do
              expect(access_methods.first['all']).to eql(false)
            end

            it 'gives a count equal to the exact number of downloadable granules' do
              expect(access_methods.first['count']).to eql(5)
            end
          end
        end
      end

      context 'whose granules are not downloadable' do
        let(:downloadable) { 0 }

        it 'does not return "Download" as an access method' do
          expect(body['methods']).to eql([])
        end
      end

      context 'whose granules have order options' do
        let(:orderable) { 1 }

        it 'returns a response containing access methods for each option' do
          expect(access_methods.size).to eql(2)
          expect(access_methods.first['name']).to eql('Order Option 1')
          expect(access_methods.second['name']).to eql('Order Option 2')
        end

        it 'retrieves and returns the corresponding form for each option' do
          expect(access_methods.size).to eql(2)
          expect(access_methods.first['form']).to eql('<first_form/>')
          expect(access_methods.second['form']).to eql('<second_form/>')
        end

        context 'when there are more than 150 matching granules' do
          let(:hits) { 200 }

          context 'and all have a given order option' do
            let(:orderable) { 150 }
            it 'indicates that all matching granules have the order option' do
              expect(access_methods.first['all']).to eql(true)
            end

            it 'gives a count equal to the granule hits' do
              expect(access_methods.first['count']).to eql(hits)
            end
          end

          context 'and not all have a given order option' do
            let(:orderable) { 75 }
            it 'indicates that not all matching granules have the order option' do
              expect(access_methods.first['all']).to eql(false)
            end

            it 'gives an estimated count produced by the percentage of granules found with the given order option' do
              expect(access_methods.first['count']).to eql(hits / 2)
            end
          end
        end

        context 'when there are fewer than 150 matching granules' do
          let(:hits) { 10 }

          context 'and all have a given order option' do
            let(:orderable) { 10 }

            it 'indicates that all matching granules have the order option' do
              expect(access_methods.first['all']).to eql(true)
            end

            it 'gives a count equal to the granule hits' do
              expect(access_methods.first['count']).to eql(hits)
            end
          end

          context 'and not all have a given order option' do
            let(:orderable) { 5 }

            it 'indicates that not all matching granules have the order option' do
              expect(access_methods.first['all']).to eql(false)
            end

            it 'gives a count equal to the exact number of granules with the given order option' do
              expect(access_methods.first['count']).to eql(5)
            end
          end
        end
      end

      context 'whose granules have no order options' do
        let(:order_options) { 0 }
        let(:option_defs) { nil }

        it 'does not return any order option access methods' do
          expect(body['methods']).to eql([])
        end
      end

      context 'whose collection is serviceable' do
        let(:serviceable) { 1 }

        it 'returns a response containing a service access method' do
          expect(access_methods.size).to eql(1)
          expect(access_methods.first['name']).to eql('Service Option 1')
        end

        it 'retrieves and returns the corresponding form for each option' do
          expect(access_methods.size).to eql(1)
          expect(access_methods.first['form']).to eql('<service_form/>')
        end
      end

      context 'whose collection is not serviceable' do
        let(:serviceable) { 0 }

        it 'does not return and service access methods' do
          expect(access_methods.size).to eql(0)
        end
      end

      context 'whose granules are downloadable and have order options' do
        let(:hits) { 10 }
        let(:downloadable) { 10 }
        let(:orderable) { 10 }

        it 'returns a response containing a download access method followed by access methods for each option' do
          expect(access_methods.size).to eql(3)
          expect(access_methods.first['name']).to eql('Download')
          expect(access_methods.second['name']).to eql('Order Option 1')
          expect(access_methods.last['name']).to eql('Order Option 2')
        end
      end

      context 'whose granules are downloadable and have order options and have a serviceable collection' do
        let(:hits) { 10 }
        let(:downloadable) { 10 }
        let(:orderable) { 10 }
        let(:serviceable) { 1 }

        it 'returns a response containing a download access method followed by access methods for each option' do
          expect(access_methods.size).to eql(4)
          expect(access_methods.first['name']).to eql('Download')
          expect(access_methods.second['name']).to eql('Order Option 1')
          expect(access_methods.third['name']).to eql('Order Option 2')
          expect(access_methods.last['name']).to eql('Service Option 1')
        end
      end

      context 'whose granules have size information' do
        let(:hits) { 2 }

        context 'when the aggregate size is smaller than 1024 bytes' do
          let(:size) { 512 << 0 }

          it 'returns the aggregate size expressed in bytes' do
            expect(body['size']).to eql(512.0)
          end

          it 'returns a size unit of "Bytes"' do
            expect(body['sizeUnit']).to eql('Bytes')
          end
        end

        context 'when the aggregate size is between 1KB and 1MB' do
          let(:size) { 512 << 10 }

          it 'returns the aggregate size expressed in kilobytes' do
            expect(body['size']).to eql(512.0)
          end

          it 'returns a size unit of "Kilobytes"' do
            expect(body['sizeUnit']).to eql('Kilobytes')
          end
        end

        context 'when the aggregate size is between 1MB and 1GB' do
          let(:size) { 512 << 20 }

          it 'returns the aggregate size expressed in megabytes' do
            expect(body['size']).to eql(512.0)
          end

          it 'returns a size unit of "Megabytes"' do
            expect(body['sizeUnit']).to eql('Megabytes')
          end
        end

        context 'when the aggregate size is between 1GB and 1TB' do
          let(:size) { 512 << 30 }

          it 'returns the aggregate size expressed in gigabytes' do
            expect(body['size']).to eql(512.0)
          end

          it 'returns a size unit of "Gigabytes"' do
            expect(body['sizeUnit']).to eql('Gigabytes')
          end
        end

        context 'when the aggregate size is between 1TB and 1PB' do
          let(:size) { 512 << 40 }

          it 'returns the aggregate size expressed in terabytes' do
            expect(body['size']).to eql(512.0)
          end

          it 'returns a size unit of "Terabytes"' do
            expect(body['sizeUnit']).to eql('Terabytes')
          end
        end

        # Here we get a little excessive
        context 'when the aggregate size is between 1PB and 1EB' do
          let(:size) { 512 << 50 }

          it 'returns the aggregate size expressed in petabytes' do
            expect(body['size']).to eql(512.0)
          end

          it 'returns a size unit of "Petabytes"' do
            expect(body['sizeUnit']).to eql('Petabytes')
          end
        end

        context 'when the aggregate size is greater than 1EB' do
          let(:size) { 512 << 60 }

          it 'returns the aggregate size expressed in exabytes' do
            expect(body['size']).to eql(512.0)
          end

          it 'returns a size unit of "Exabytes"' do
            expect(body['sizeUnit']).to eql('Exabytes')
          end
        end

        context 'when there are more than 150 matching granules' do
          let(:hits) { 300 }
          let(:size) { 512 << 20 }

          it 'estimates size based on the average size of the matching granules' do
            expect(body['size']).to eql(512.0)
            expect(body['sizeUnit']).to eql('Megabytes')
          end
        end
      end

      context 'whose granules have no size information' do
        let(:hits) { 10 }
        let(:size) { nil }

        it 'returns a size of 0' do
          expect(body['size']).to eql(0.0)
        end
      end
    end

  end
end
