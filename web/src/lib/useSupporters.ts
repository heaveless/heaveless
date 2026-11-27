import { useEffect, useState } from 'preact/hooks'
import { tiktokAuth, type Supporter } from './api'

export function useSupporters() {
  const [supporters, setSupporters] = useState<Supporter[]>([])

  useEffect(() => {
    let active = true
    void tiktokAuth.supporters().then(list => {
      if (active) setSupporters(list ?? [])
    })
    return () => {
      active = false
    }
  }, [])

  return supporters
}
