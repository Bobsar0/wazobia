import { useState, useEffect } from 'react'

/**
 * A custom React hook that determines the device type based on window width.
 *
 * This hook returns 'mobile' if the window width is less than or equal to 768 pixels,
 * and 'desktop' otherwise. It updates the device type dynamically on window resize.
 *
 * @returns {string} - The current device type: either 'mobile' or 'desktop'.
 */

function useDeviceType() {
  const [deviceType, setDeviceType] = useState('unknown')

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(window.innerWidth <= 768 ? 'mobile' : 'desktop')
    }

    handleResize() // Set initial value
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return deviceType
}

export default useDeviceType