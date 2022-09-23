/* Library Package */
import { FC } from 'react'
import { Copyright, Widget } from '@sirclo/nexus'

/* Styles */
import styles from 'public/scss/components/Copyright.module.scss'

const CopyrightComp: FC<any> = () => {
  return (
    <div className={styles.copyright}>
      <Copyright>
        <Widget
          pos="copyright-and-policy"
          thumborSetting={{
            width: 1,
            format: 'webp',
            quality: 5,
          }}
        />
      </Copyright>
    </div>
  )
}

export default CopyrightComp