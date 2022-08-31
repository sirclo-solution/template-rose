/* library package */
import {
  FC,
  useState,
  useEffect
} from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ToastContainer } from 'react-toastify'
import { withBrand } from '@sirclo/nexus'
/* components */
import Header from '../Header'
import Footer from '../Footer/Footer'
import SEOHead from '../SEO'
import PageNotFound from 'components/PageNotFound'
import Copyright from 'components/Copyright'
import Newsletter from 'components/Newsletter'
import GoogleTagManager from 'components/GoogleTagManager'

type LayoutPropType = {
  lngDict: any
  i18n: any
  lng: string
  layoutClassName?: string
  withAnnouncement?: boolean
  withHeader?: boolean
  headerTitle?: string
  withFooter?: boolean
  withCopyright?: boolean
  withAllowed?: boolean | undefined
  [otherProp: string]: any
}

const Layout: FC<LayoutPropType> = ({
  lngDict,
  i18n,
  lng,
  layoutClassName = "",
  withAnnouncement = false,
  withHeader = true,
  headerTitle,
  withFooter = true,
  withCopyright = false,
  withAllowed = true,
  brand,
  SEO,
  ...props
}) => {
  const router: any = useRouter()
  const [isSticky, setSticky] = useState<boolean>(false)

  const handleScroll = () => {
    const offset = window.scrollY
    setSticky(offset > 0)
  }

  const newsletterSetting = brand?.settings?.newsletter?.popupOnFirstVisit

  useEffect(() => {
    i18n?.locale(lng, lngDict)
  }, [lng, lngDict])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', () => handleScroll);
    }
  }, [])

  useEffect(() => {
    if (brand?.googleAdsWebsiteMetaToken) getToken()
  }, [brand])

  const stickyMechanic = (pathname: string) => {
    let className = 'transparent'
    let stickyNavPathCategories = ['/[lng]', '/[lng]/lookbook/categories']
    let stickyNavPathHome = ['/[lng]', '/[lng]']
    let stickyActive = stickyNavPathCategories.includes(pathname) || stickyNavPathHome.includes(pathname)

    if (!stickyActive) className = 'notSticky'
    else if (isSticky && stickyActive) className = 'notSticky'

    return className
  }

  const getToken = (): string => {
    const googleAdsWebsiteMetaToken = brand?.googleAdsWebsiteMetaToken
    const token: string = googleAdsWebsiteMetaToken.replace(/.*content="([^"]*)".*/, "$1")
    return token
  }

  const SEOprops = {
    title: `${brand?.settings?.websiteTitle} - ${SEO?.title}` || "",
    description: SEO?.desc || brand?.settings?.websiteDescription,
    image: SEO?.image || brand?.logoURL,
    keywords: SEO?.keywords || ""
  }

  return (
    <>
    <GoogleTagManager brand={brand}>
      <Head>
        {brand?.settings?.hideFromSearchEngine && (
          <meta name="robots" content="noindex, nofollow"></meta>
        )}
        <title>{brand?.settings?.websiteTitle} {SEO?.title && "-"} {SEO?.title}</title>
        {brand?.googleAdsWebsiteMetaToken &&
          <meta name="google-site-verification" content={getToken()} />
        }
        {brand?.settings?.googleSearchConsole?.metaTagCode && (
          <meta
            name="google-site-verification"
            content={brand?.settings?.googleSearchConsole?.metaTagCode}
          />
        )}
        <link
          rel="shortcut icon"
          href={brand?.settings?.faviconURL}
          type="image/x-icon"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="preload"
          href="webfonts/Inter-Regular.ttf"
          as="font"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="webfonts/Inter-SemiBold.ttf"
          as="font"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="webfonts/Lora-Medium.ttf"
          as="font"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://thumbor.sirclocdn.com" />
        <link rel="preconnect" href="https://storage.googleapis.com" />
      </Head>
      <SEOHead {...SEOprops} />
      {withHeader &&
        <Header
          withAnnouncement={withAnnouncement}
          headerTitle={headerTitle}
          stickyClass={stickyMechanic(router.pathname)}
        />
      }
      <main className={layoutClassName}>
        {withAllowed ?
          props.children :
          <PageNotFound i18n={i18n} />
        }
        {withFooter &&
          <Footer brand={brand} />
        }
        {withCopyright &&
          <Copyright brand={brand} />
        }
      </main>
      <ToastContainer />
      {newsletterSetting &&
        <Newsletter i18n={i18n} brand={brand} />
      }
    </GoogleTagManager>
    </>
  )
}

export default withBrand(Layout)