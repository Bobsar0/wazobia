import { getNoCachedSetting } from '@/lib/actions/setting.actions'
import SettingForm from './setting-form'
import SettingNav from './setting-nav'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Setting',
}
/**
 * SettingPage is a Next.js page component that renders the Setting page.
 * The Setting page displays the Setting form and the Setting navigation.
 *
 * The Setting form is rendered with the site setting object from the database.
 * The Setting object is retrieved by calling the getNoCachedSetting function.
 *
 * The Setting navigation is rendered on the left side of the page.
 * It is a list of links to anchor tags with ids that start with "setting-".
 * The links are styled as buttons and are fixed on the right side of the page when
 * the page is scrolled.
 *
 * When the user scrolls to an anchor tag, the corresponding link is highlighted.
 *
 * @returns {React.ReactElement} The Setting page component.
 */
const SettingPage = async () => {
  return (
    <div className='grid md:grid-cols-5 max-w-6xl mx-auto gap-4'>
      <SettingNav />
      <main className='col-span-4 '>
        <div className='my-8'>
          <SettingForm setting={await getNoCachedSetting()} />
        </div>
      </main>
    </div>
  )
}

export default SettingPage