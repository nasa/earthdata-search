import {
  useCallback,
  useEffect,
  useState
} from 'react'

/**
 * Attempts to import a portal logo, if the logo exists, the path is returned. If a logo
 * does not exist, an empty string is returned. While the src is loading, the value will
 * be undefined.
 * @prop {String} portalId - The portal id
 * @returns {String} - The url for a portal image, an empty string, or undefined
*/
export const usePortalLogo = (portalId) => {
  const [portalLogoSrc, setPortalLogoSrc] = useState()

  const getPortalLogo = useCallback(async () => {
    // If a portal id is not provided, do nothing. The default empty string will be
    // returned from the hook.
    if (!portalId) return

    try {
      // Attempt to import a portal logo. If one exists, set the state value to
      // to the url for the image.
      const logo = await import(`../../../../portals/${portalId}/images/logo.png`)
      const { default: imgSrc } = logo
      setPortalLogoSrc(imgSrc)
    } catch (e) {
      // If the import fails, set the state to an empty string.
      setPortalLogoSrc('')
    }
  }, [portalId])

  // Set an effect to set the logo url any time the portalId changes.
  useEffect(() => {
    getPortalLogo()

    // Cleanup any in flight imports
    return () => {}
  }, [portalId])

  return portalLogoSrc
}

export default usePortalLogo
