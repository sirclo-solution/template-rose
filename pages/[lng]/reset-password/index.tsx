/* library package */
import { FC } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import {
  SetNewPassword,
  useAuthToken,
  useI18n
} from '@sirclo/nexus'
import {
  RiCheckboxCircleFill,
  RiCheckboxCircleLine,
  RiEye2Line,
  RiEyeCloseLine,
} from 'react-icons/ri'
import { toast } from 'react-toastify'
/* components */
import SEO from 'components/SEO'
import Layout from 'components/Layout/Layout'
import Loader from 'components/Loader/Loader'
import Breadcrumbs from 'components/Breadcrumb/Breadcrumb'
/* library template */
import { useBrand } from 'lib/useBrand'
/* styles */
import styleResetPassword from 'public/scss/pages/ResetPassword.module.scss'
import styleLogin from 'public/scss/pages/Login.module.scss'
import styleForm from 'public/scss/components/Form.module.scss'
import styleButton from 'public/scss/components/Button.module.scss'
import stylePassword from 'public/scss/components/Password.module.scss'

const classesSetNewPassword = {
  containerClassName: styleResetPassword.resetPassword_container,
  inputContainerClassName: `${styleLogin.login_inputContainer} ${styleForm.form} ${stylePassword.password_passwordContainer}`,
  passwordStrengthBarContainerClassName: stylePassword.password,
  passwordStrengthBarClassName: stylePassword.password_bar,
  passwordStrengthLabelClassName: stylePassword.password_label,
  passwordCriteriaListClassName: `${stylePassword.password_criteria} d-none`,
  buttonClassName: `${styleButton.btn} ${styleButton.btn_primary}`,
  errorClassName: styleResetPassword.resetPassword_error,
}

const ResetPasswordPage: FC<any> = ({
  lng,
  lngDict,
  brand,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n()

  const layoutProps = {
    i18n,
    lng,
    lngDict,
    brand,
    headerTitle: i18n.t('resetPassword.setNew'),
    withCopyright: true,
    SEO: {
      title: i18n.t("resetPassword.setNew")
    }
  }

  return (
    <Layout {...layoutProps}>
      <SEO title={i18n.t('resetPassword.setNew')} />
      <div className={styleLogin.login_breadcrumb}>
        <Breadcrumbs
          steps={[
            { label: i18n.t('breadcrumb.home') },
            { label: i18n.t('breadcrumb.resetPassword') },
          ]}
        />
      </div>
      <div className={styleResetPassword.resetPassword}>
        <SetNewPassword
          classes={classesSetNewPassword}
          onErrorMsg={(msg: string) => toast.error(msg)}
          onSuccessMsg={(msg: string) => toast.success(msg)}
          passwordViewIcon={<RiEyeCloseLine />}
          passwordHideIcon={<RiEye2Line />}
          passwordFulfilledCriteriaIcon={<RiCheckboxCircleFill color="#53B671" size={10} />}
          passwordUnfulfilledCriteriaIcon={<RiCheckboxCircleLine color="#BCBCBC" size={10} />}
          loadingComponent={<Loader color="text-light" />}
        />
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
  
  const defaultLanguage = brand?.settings?.defaultLanguage || params.lng || 'id'
  const { default: lngDict = {} } = await import(`locales/${defaultLanguage}.json`)

  return {
    props: {
      lng: defaultLanguage,
      lngDict,
      brand: brand || ""
    }
  }
}

export default ResetPasswordPage
