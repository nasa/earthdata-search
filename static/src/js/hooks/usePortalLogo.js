import { useCallback, useEffect, useState } from 'react'

const usePortalLogo = (portalId) => {
  const [portalLogoSrc, setPortalLogoSrc] = useState('')
  let logo = ''

  const getPortalLogo = useCallback(async () => {
    if (!portalId) return

    try {
      logo = await import(`../../../../portals/${portalId}/images/logo.png`)
      const { default: imgSrc } = logo
      setPortalLogoSrc(imgSrc)
    } catch (e) {
      setPortalLogoSrc('')
    }
  }, [portalId])

  useEffect(() => {
    getPortalLogo()

    return () => {}
  }, [portalId])

  return portalLogoSrc
}

export default usePortalLogo
