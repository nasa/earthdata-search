// TODO: Remove this file if it is not needed. I saw a few supposed fixes
// mentioning that this might resolve the issue with the svgs in tests
import React from 'react'

declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGSVGElement>>
  export default content
}

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}
