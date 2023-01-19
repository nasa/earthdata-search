import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { FooterLink } from '../FooterLink'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps = {}) {
  const props = {
    href: 'http://example.com',
    title: 'Example Link',
    ...overrideProps
  }

  const enzymeWrapper = shallow(<FooterLink {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('FooterLink component', () => {
  test('it renders the link', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('a').props().href).toEqual('http://example.com')
    expect(enzymeWrapper.find('a').props().children).toEqual('Example Link')
  })

  test('it renders the link with secondary classNames', () => {
    const { enzymeWrapper } = setup({ secondary: true })

    expect(enzymeWrapper.find('span').props().className).toContain('footer-link__info-bit--clean footer-link__info-bit--emph')

    expect(enzymeWrapper.find('a').props().href).toEqual('http://example.com')
    expect(enzymeWrapper.find('a').props().children).toEqual('Example Link')
    expect(enzymeWrapper.find('a').props().className).toContain('footer-link__info-link--underline')
  })
})
