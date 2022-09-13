/* library package */
import {
  FC,
  useEffect,
  useState
} from 'react'
import { Newsletter } from '@sirclo/nexus'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
/* library template */
import useWindowSize from 'lib/useWindowSize'
/* component */
import styles from 'public/scss/components/Newsletter.module.scss'

const classesNewsletter = {
  newsLetterWrapperClassName: styles.newsletter_wrapper,
  newsLetterContainerClassName: styles.newsletter_container,
  newsLetterCloseButtonClassName: styles.newsletter_close,
  newsLetterContentContainerClassName: styles.newsletter_contentContainer,
  newsLetterContentClassName: styles.newsletter_content,
  newsLetterImageContainerClassName: styles.newsletter_imageContainer,
  newsLetterImageClassName: styles.newsletter_image,
  newsLetterNoThanksButtonClassName: styles.newsletter_noThanks,
  newsLetterFormContainerClassName: styles.newsletter_formContainer,
  newsLetterFormLabelClassName: styles.newsletter_label,
  newsLetterFormInputClassName: styles.newsletter_input,
  newsLetterFormButtonClassName: styles.newsletter_buttonSubmit
}

type TNewsletterPopup = {
  i18n: any
  brand: any
}

const Newsletters: FC<TNewsletterPopup> = ({ i18n, brand }) => {
  const size: any = useWindowSize()
  const newsletterContent = brand?.settings?.newsletter?.content
  
  const [displayPopup, setDisplayPopup] = useState<boolean>(true)

  useEffect(() => {
    if (newsletterContent || newsletterContent == "") {
      if (Cookies.get('POPUP_NEWSLETTER_CLOSED') == undefined) {
        setDisplayPopup(Cookies.get('POPUP_NEWSLETTER') == undefined ? true : false)
      } else {
        setDisplayPopup(false)
      }
    }
  }, [])

  const handleClose = () => {
    setDisplayPopup(false)
    Cookies.set('POPUP_NEWSLETTER', newsletterContent)
    Cookies.set('POPUP_NEWSLETTER_CLOSED', true)
  }

  return (
    <>
      {displayPopup &&
        <div className={styles.newsletter_overlay} onClick={handleClose}>
          <div className={styles.newsletter_popupContainer}>
            <Newsletter
              classes={classesNewsletter}
              withForm
              noThanksButton={i18n.t("home.later")}
              buttonComponent={i18n.t("newsletter.subscribe")}
              onComplete={() => toast.success(i18n.t("newsletter.submitSuccess"))}
              onError={() => toast.error(i18n.t("newsletter.submitError"))}
              thumborSetting={{
                width: size.width < 768 ? 512 : 800,
                format: 'webp',
                quality: 85,
              }}
            />
          </div>
        </div>
      }
    </>
  )
}

export default Newsletters
