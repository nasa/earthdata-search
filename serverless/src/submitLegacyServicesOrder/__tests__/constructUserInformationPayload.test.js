import { constructUserInformationPayload } from '../constructUserInformationPayload'

describe('constructUserInformationPayload', () => {
  test('returns a user_information object', () => {
    const echoProfile = {
      id: '9C8EBA20-C49C-533E-2C06-4D3C6B11B9BF',
      email: 'ryan@element84.com',
      opt_in: false,
      username: 'rabbott',
      addresses: [{
        id: 'DCE860FA-3321-370A-D9BB-BD7456AFC1F4',
        country: 'United States',
        us_format: false
      }],
      last_name: 'Abbott',
      user_type: 'UNSPECIFIED',
      first_name: 'Ryan',
      user_domain: 'OTHER',
      user_region: 'USA',
      creation_date: '2016-05-05T14:58:54Z',
      organization_name: 'Element 84',
      primary_study_area: 'OTHER'
    }

    const ursProfile = {
      uid: 'testuser',
      country: 'United States',
      last_name: 'User',
      nams_auid: 'testuser',
      user_type: 'Application',
      first_name: 'Test',
      study_area: 'Other',
      affiliation: 'Something',
      user_groups: [],
      organization: 'NASA',
      email_address: 'testuser@nasa.gov',
      registered_date: ' 2 Oct 2018 02:31:32AM',
      agreed_to_meris_eula: true,
      user_authorized_apps: 8,
      allow_auth_app_emails: true,
      agreed_to_sentinel_eula: true
    }

    const response = constructUserInformationPayload(echoProfile, ursProfile)

    expect(response).toEqual({
      user_information: {
        billing_contact: {
          address: {
            country: 'United States'
          },
          email: 'testuser@nasa.gov',
          first_name: 'Test',
          last_name: 'User',
          organization: 'NASA',
          phones: {
            0: {
              number: '0000000000',
              phone_number_type: 'BUSINESS'
            }
          },
          role: 'Order Contact'
        },
        order_contact: {
          address: {
            country: 'United States'
          },
          email: 'testuser@nasa.gov',
          first_name: 'Test',
          last_name: 'User',
          organization: 'NASA',
          phones: {
            0: {
              number: '0000000000',
              phone_number_type: 'BUSINESS'
            }
          },
          role: 'Order Contact'
        },
        shipping_contact: {
          address: {
            country: 'United States'
          },
          email: 'testuser@nasa.gov',
          first_name: 'Test',
          last_name: 'User',
          organization: 'NASA',
          phones: {
            0: {
              number: '0000000000',
              phone_number_type: 'BUSINESS'
            }
          },
          role: 'Order Contact'
        },
        user_domain: 'OTHER',
        user_region: 'USA'
      }
    })
  })
})
