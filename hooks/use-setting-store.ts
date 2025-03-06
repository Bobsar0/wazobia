/* eslint-disable no-unused-vars */

import data from '@/lib/data/data'
import { ClientSetting, SiteCurrency } from '@/types'
import { create } from 'zustand'

interface SettingState {
  setting: ClientSetting
  setSetting: (newSetting: ClientSetting) => void
  getCurrency: () => SiteCurrency
  setCurrency: (currency: string) => void
}

const useSettingStore = create<SettingState>((set, get) => ({
  setting: {
    ...data.settings[0],
    currency: data.settings[0].defaultCurrency,
  } as ClientSetting,
  
  /**
   * Updates the setting state with the newSetting object.
   * If newSetting.currency is not provided, it will not be updated.
   * @param {ClientSetting} newSetting
   */
  setSetting: (newSetting: ClientSetting) => {
    set({
      setting: {
        ...newSetting,
        currency: newSetting.currency || get().setting.currency,
      },
    })
  },

  /**
   * Retrieves the current currency setting.
   *
   * @returns {SiteCurrency} The currency object corresponding to the current currency code.
   * If the current currency code is not found, returns the first available currency.
   */
  getCurrency: () => {
    return (
      get().setting.availableCurrencies.find(
        (c) => c.code === get().setting.currency
      ) || data.settings[0].availableCurrencies[0]
    )
  },
  
  /**
   * Sets the current currency in the setting store.
   *
   * @param {string} currency The code of the currency to set.
   * @returns {Promise<void>}
   */
  setCurrency: async (currency: string) => {
    set({ setting: { ...get().setting, currency } })
  },
}))

export default useSettingStore