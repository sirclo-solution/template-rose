/* library package */
import { useState, useEffect } from 'react'
import { PageTransition } from 'next-page-transitions'
import {
  useApollo,
  ApolloProvider,
  PackageFeatureProvider,
  TemplateFeatureFlag,
  Widget,
  I18n
} from '@sirclo/nexus'
/* components */
import MaintenanceMode from '@sirclo/nexus/lib/component/MaintenanceMode'
/* styles */
import '@brainhubeu/react-carousel/lib/style.css'
import 'react-toastify/dist/ReactToastify.css'
import 'public/scss/main.scss'
import styleMaintenance from 'public/scss/components/Maintenance.module.scss'
import { handleWebVitals } from 'lib/handleWebVitals'

const classesMaintenance = {
  maintenanceContainerClassName: styleMaintenance.maintenance_container,
  maintenanceTitleClassName: styleMaintenance.maintenance_containerTitle,
  maintenanceInfoClassName: styleMaintenance.maintenance_containerInfo,
  imageContainerClassName: styleMaintenance.maintenance_containerImages,
  imageClassName: styleMaintenance.maintenance_containerImagesImg,
}

export const reportWebVitals = (metric) => handleWebVitals(metric)

const MyApp = ({ 
  Component,
  pageProps,
  router
}) => {
  const apolloClient = useApollo(pageProps.initialApolloState)
  const [hash, setHash] = useState('')

  useEffect(() => {
    const routeChangeHandler = () => {
      setHash(Math.random().toString(36).substring(7))
    }

    router.events.on('routeChangeComplete', routeChangeHandler)

    return () => {
      router.events.off('routeChangeComplete', routeChangeHandler)
    }
  }, [])

  return (
    <PageTransition
      timeout={200}
      loadingDelay={100}
      classNames='page-transition'
    >
      <ApolloProvider client={apolloClient} key={router.route}>
        <PackageFeatureProvider>
          <TemplateFeatureFlag>
            <MaintenanceMode classes={classesMaintenance}>
              <I18n lngDict={pageProps.lngDict} locale={pageProps.lng}>
                <Component {...pageProps} />
                <Widget 
                  pos='script' 
                  hash={hash}
                />
              </I18n>
            </MaintenanceMode>
          </TemplateFeatureFlag>
        </PackageFeatureProvider>
      </ApolloProvider>
    </PageTransition>
  )
}

export default MyApp
