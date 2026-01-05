import { useEffect } from 'react'

import routerHelper from '../../router/router'
import { changePath } from '../../util/url/changePath'

const HistoryContainer = () => {
  const { router } = routerHelper

  useEffect(() => {
    const unsubscribe = router.subscribe((event) => {
      const {
        historyAction,
        location
      } = event

      const {
        pathname,
        search
      } = location

      if (historyAction === 'POP') {
        changePath(`${pathname}${search}`)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return null
}

export default HistoryContainer
