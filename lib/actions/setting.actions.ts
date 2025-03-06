'use server'
import { ISettingInput } from '@/types'
import Setting from '../db/models/setting.model'
import { connectToDatabase } from '../db'
import { formatError } from '../utils'
import { cookies } from 'next/headers'
import data from '../data/data'

const globalForSettings = global as unknown as {
  cachedSettings: ISettingInput | null
}

  /**
   * Gets the setting from the database without using the cache.
   * Useful for development environments where the setting can change frequently.
   * @returns The site setting object.
   */
export const getNoCachedSetting = async (): Promise<ISettingInput> => {
  await connectToDatabase()
  const setting = await Setting.findOne()
  return JSON.parse(JSON.stringify(setting)) as ISettingInput
}

  /**
   * Gets the setting from the database and caches it.
   * If the database returns null, it uses the default setting from the data file.
   * @returns The site setting object.
   */
export const getSetting = async (): Promise<ISettingInput> => {
  if (!globalForSettings.cachedSettings) {
    await connectToDatabase()
    const setting = await Setting.findOne().lean()
    globalForSettings.cachedSettings = setting
      ? JSON.parse(JSON.stringify(setting))
      : data.settings[0]
  }
  return globalForSettings.cachedSettings as ISettingInput
}

  /**
   * Updates the setting in the database and updates the cache.
   * @param newSetting The new setting to update with.
   * @returns A promise resolving to an object containing a success boolean, a message string, and the updated setting object if the update is successful, otherwise an error message.
   */
export const updateSetting = async (newSetting: ISettingInput) => {
  try {
    await connectToDatabase()
    const updatedSetting = await Setting.findOneAndUpdate({}, newSetting, {
      upsert: true,
      new: true,
    }).lean()
    globalForSettings.cachedSettings = JSON.parse(
      JSON.stringify(updatedSetting)
    ) // Update the cache
    return {
      success: true,
      message: 'Setting updated successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

/**
 * Updates the currency cookie on the server.
 * @param {string} newCurrency The new currency code to set.
 * @returns {Promise<{ success: boolean, message: string }>} A promise resolving to an object containing a success boolean and a message string indicating the result of the update operation.
 */
export const setCurrencyOnServer = async (newCurrency: string) => {
  'use server'
  const cookiesStore = await cookies()
  cookiesStore.set('currency', newCurrency)

  return {
    success: true,
    message: 'Currency updated successfully',
  }
}