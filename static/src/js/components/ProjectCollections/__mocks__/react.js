import React from 'react'

const react = jest.requireActual('react')

// eslint-disable-next-line react/prop-types
const Suspense = () => <div />
Suspense.displayName = 'Suspense'

module.exports = { ...react, Suspense }
