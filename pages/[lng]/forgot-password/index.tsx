/* library package */
import { FC, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import {
  ResetPassword,
  useAuthToken,
  useI18n
} from '@sirclo/nexus'
import { toast } from 'react-toastify'
/* library template */
import { parseCookies } from 'lib/parseCookies'
import redirectIfAuthenticated from 'lib/redirectIfAuthenticated'
import { useBrand } from 'lib/useBrand'
/* components */
import Loader from 'components/Loader/Loader'
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
/* styles */
import styleLogin from 'public/scss/pages/Login.module.scss'
import styleForm from 'public/scss/components/Form.module.scss'
import styleButton from 'public/scss/components/Button.module.scss'

const classesResetPassword = {
  containerClassName: styleLogin.login_containerForm,
  inputContainerClassName: `${styleLogin.login_inputContainer} ${styleForm.form}`,
  buttonClassName: `${styleButton.btn} ${styleButton.btn_primary}`,
  spinnerClassName: 'spinner-border text-light spinner-border-sm',
}

const ForgotPassword: FC<any> = ({
  lng,
  lngDict,
  brand,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n()
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  const layoutProps = {
    i18n,
    lng,
    lngDict,
    brand,
    headerTitle: i18n.t('resetPassword.title'),
    layoutClassName: 'layout_fullHeight',
    withCopyright: true,
    withFooter: false,
    withFooterOnly: true,
    SEO: {
      title: i18n.t("resetPassword.title")
    }
  }

  return (
    <Layout {...layoutProps}>
      <div className={styleLogin.login_breadcrumb}>
        <Breadcrumb
          steps={[
            { label: i18n.t('breadcrumb.home') },
            { label: i18n.t('breadcrumb.forgotPassword') },
          ]}
        />
      </div>
      <div className={styleLogin.forgotPassword}>
        {isSuccess ? (
          <>
            <div className={styleLogin.forgotPassword_successTitle}>
              {i18n.t('forgotPassword.titleSuccessful')}
            </div>
            <div className={styleLogin.forgotPassword_successDesc}>
              {i18n.t('forgotPassword.requestSuccessful')}
            </div>
          </>
        ) : (
          <>
            <div className={styleLogin.login_forgotPasswordDesc}>
              <span>{i18n.t('resetPassword.enterEmailBody')}</span>
            </div>
            <div className={styleLogin.login_container}>
              <ResetPassword
                classes={classesResetPassword}
                onErrorMsg={(msg) => toast.error(msg)}
                loadingComponent={<Loader color="text-light" />}
                onSuccessMsg={() => setIsSuccess(true)}
              />
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params
}) => {
  const tokenData = await useAuthToken({ req, res, env: process.env });
  const token = tokenData.value;
  const brand = await useBrand(req, token);
  
  const cookies = parseCookies(req)
  const defaultLanguage = brand?.settings?.defaultLanguage || params.lng || 'id'
  const { default: lngDict = {} } = await import(`locales/${defaultLanguage}.json`)

  redirectIfAuthenticated(res, cookies, 'account', defaultLanguage)

  return {
    props: {
      lng: defaultLanguage,
      lngDict,
      brand: brand || ""
    }
  }
}

export default ForgotPassword
