export const constructUserInformationPayload = (echoProfile, ursProfile) => {
  const {
    country,
    email_address: emailAddress,
    first_name: firstName,
    last_name: lastName,
    organization
  } = ursProfile

  const {
    user_domain: userDomain,
    user_region: userRegion
  } = echoProfile

  const contactInformation = {
    email: emailAddress,
    first_name: firstName,
    last_name: lastName,
    organization,
    address: {
      country
    },
    phones: {
      0: {
        number: '0000000000',
        phone_number_type: 'BUSINESS'
      }
    },
    role: 'Order Contact'
  }

  return {
    user_information: {
      shipping_contact: contactInformation,
      billing_contact: contactInformation,
      order_contact: contactInformation,
      user_domain: userDomain,
      user_region: userRegion
    }
  }
}
