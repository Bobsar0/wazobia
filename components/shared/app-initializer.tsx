import React, { useEffect, useState } from 'react'
import useSettingStore from '@/hooks/use-setting-store'
import { ClientSetting } from '@/types'

/**
 * AppInitializer initializes the app with the given setting.
 * It sets the setting state once and then renders the children.
 * The setting is passed as a prop to the component.
 * The children is the content of the app.
 * @prop {ClientSetting} setting The setting of the app.
 * @prop {React.ReactNode} children The content of the app.
 * @returns {React.ReactElement} The initialized app.
 */
export default function AppInitializer({
  setting,
  children,
}: {
  setting: ClientSetting
  children: React.ReactNode
}) {
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    setRendered(true)
  }, [setting])
  if (!rendered) {
    useSettingStore.setState({
      setting,
    })
  }

  return children
}