/* library package */
import {
  FC,
  useEffect,
  useRef,
  useState
} from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import {
  RiEyeCloseLine,
  RiEye2Line,
  RiArrowLeftSLine,
  RiWhatsappFill,
  RiMailFill
} from 'react-icons/ri'
import { toast } from 'react-toastify'
import ReCAPTCHA from 'react-google-recaptcha'
import {
  Login,
  WhatsAppOTPInput,
  SingleSignOn,
  useAuthToken,
  useI18n
} from '@sirclo/nexus'
/* library template */
import { parseCookies } from 'lib/parseCookies'
import redirectIfAuthenticated from 'lib/redirectIfAuthenticated'
import { useBrand } from 'lib/useBrand'
import { useGoogleAuth } from 'lib/useGoogleAuth'
import { useFacebookAuth } from 'lib/useFacebookAuth'
import { useWhatsAppOTPSetting } from 'lib/useWhatsAppOtp'
/* components */
import SEO from 'components/SEO'
import Layout from 'components/Layout/Layout'
import LoaderPages from 'components/Loader/LoaderPages'
import Loader from 'components/Loader/Loader'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
/* styles */
import styleLogin from 'public/scss/pages/Login.module.scss'
import styleForm from 'public/scss/components/Form.module.scss'
import styleButton from 'public/scss/components/Button.module.scss'
import stylePassword from 'public/scss/components/Password.module.scss'
import styleWaOTP from 'public/scss/components/WhatsAppOTP.module.scss'
import styleDisclaimer from 'public/scss/components/Disclaimer.module.scss'

const loginClasses = {
  containerClassName: styleLogin.login_containerForm,
  inputContainerClassName: `${styleLogin.login_inputContainer} ${styleForm.form}`,
  passwordContainerClassName: stylePassword.password_passwordContainer,
  buttonClassName: `${styleButton.btn} ${styleButton.btn_primary}`,
  signUpText: `${styleButton.btn} ${styleButton.btn_secondary} ${styleLogin.login_signUp}`,
  forgotPasswordClass: styleLogin.login_forgotContainer,
  disclaimerMessageContainerClassName: 'd-none',
  disclaimerMessageLinkClassName: styleDisclaimer.disclaimerMessageLink,
}

const classesWhatsAppOTP = {
  //form
  inputFormTitleClassName: 'd-none',
  inputFormHeaderClassName: styleWaOTP.whatsapp_header,
  inputFormDescriptionClassName: styleWaOTP.whatsapp_descWa,
  formWAContainerClassName: `${styleLogin.login_inputContainer} ${styleForm.form}`,
  inputLabelClassName: styleWaOTP.whatsapp_formWaLabel,
  btnSubmitClassName: `${styleButton.btn} ${styleButton.btn_primary} mt-4`,
  inputDescriptionClassName: styleWaOTP.whatsapp_formWaDesc,
  termsAndConditionClassName: styleWaOTP.whatsapp_formWaPointer,
  privacyPolicyClassName: styleWaOTP.whatsapp_formWaPointer,
  //confirmation
  confirmationContainerClassName: styleWaOTP.whatsapp_confirmContainer,
  confirmationHeaderContainerClassName: styleWaOTP.whatsapp_confirmHeader,
  confirmationBackContainerClassName: styleWaOTP.whatsapp_confirmBack,
  confirmationBackLabelClassName: `${styleWaOTP.whatsapp_confirmBackLabel} ml-2`,
  confirmationHeaderTitleClassName: styleWaOTP.whatsapp_confirmTitle,
  confirmationHeaderSubtitleClassName: styleWaOTP.whatsapp_confirmSubtitle,
  confirmationButtonOTPClassName: `${styleButton.btn} ${styleButton.btn_primary}`,
  noWhatsAppLabelClassName: styleWaOTP.whatsapp_confirmQuestion,
  anotherLoginMethodClassName: styleWaOTP.whatsapp_confirmWithOtherMethod,
  //verification
  verificationContainerClassName: styleWaOTP.whatsapp_verifContainer,
  verificationHeaderClassName: styleWaOTP.whatsapp_verifHeader,
  verificationTitleClassName: styleWaOTP.whatsapp_verifTitle,
  verificationBodyClassName: styleWaOTP.whatsapp_verifBody,
  infoLabelClassName: styleWaOTP.whatsapp_verifSubtitle,
  fieldOTPInputContainerClassName: styleWaOTP.whatsapp_verifInputContainer,
  fieldOTPInputClassName: styleWaOTP.whatsapp_verifInputOtp,
  verificationFooterClassName: styleWaOTP.whatsapp_verifFooter,
  btnResendOTPClassName: `${styleButton.btn} ${styleButton.btn_primary} ${styleWaOTP.whatsapp_buttonOtp}`,
  footerLabelClassName: styleWaOTP.whatsapp_verifFooterLabel,
  btnChangeMethodClassName: styleWaOTP.whatsapp_confirmWithOtherMethod,
  //choose account
  chooseAccountHeaderClassName: styleWaOTP.whatsapp_accountHeader,
  chooseAccountTitleClassName: styleWaOTP.whatsapp_accountTitle,
  chooseAccountDescriptionClassName: styleWaOTP.whatsapp_accountDesc,
  accountOptionsContainerClassName: styleWaOTP.whatsapp_accountOptionContainer,
  accountOptionClassName: styleWaOTP.whatsapp_accountOption,
  selectedAccountClassName: styleWaOTP.whatsapp_accountOptionSelected,
  accountContainerClassName: styleWaOTP.whatsapp_accountContainer,
  accountNameClassName: styleWaOTP.whatsapp_accountName,
  accountEmailClassName: styleWaOTP.whatsapp_accountEmail,
  btnChooseAccountClassName: `${styleButton.btn} ${styleButton.btn_primary} ${styleWaOTP.whatsapp_buttonOtp}`,
  disclaimerMessageContainerClassName: styleDisclaimer.disclaimerMessageContainer,
  disclaimerMessageLinkClassName: styleDisclaimer.disclaimerMessageLink,
}

const LoginPage: FC<any> = ({
  lng,
  lngDict,
  brand,
  hasGoogleAuth,
  hasFacebookAuth,
  hasOtp
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n()
  const router: any = useRouter()
  const query = router?.query || {}
  const recaptchaRef = useRef<any>()

  const STEPS = {
    WA: 'whatsapp-input',
    EMAIL: 'email'
  }

  const [step, setStep] = useState<string>(STEPS.WA)

  const getReCAPTCHAToken = async () => {
    const token = await recaptchaRef.current.executeAsync()
    recaptchaRef.current.reset()
    return token
  }

  const brandName = (brand: string): string => {
    const lower = brand?.toLowerCase()
    return brand?.charAt(0).toUpperCase() + lower?.slice(1)
  }

  const handleChangeStep = (step: string) => {
    if (step === STEPS.EMAIL) setStep(STEPS.WA)
    if (step === STEPS.WA) setStep(STEPS.EMAIL)
  }

  const layoutProps = {
    i18n,
    lng,
    lngDict,
    brand,
    layoutClassName: 'layout_fullHeight',
    withCopyright: true,
    SEO: {
      title: i18n.t("login.title")
    }
  }

  useEffect(() => {
    if (!document.body.classList.contains("auth"))
      document.body.classList.add("auth")
  }, [])

  useEffect(() => {
    const removeAuthClassName = () => {
      document.body.classList.remove("auth")
    }

    router.events.on('routeChangeComplete', removeAuthClassName)

    return () => {
      router.events.off('routeChangeComplete', removeAuthClassName)
    }
  }, [])

  return (
    <Layout {...layoutProps}>
      <SEO title={i18n.t('login.title')} />
      <div className={styleLogin.login}>
        <div className={styleLogin.login_breadcrumb}>
          <Breadcrumb
            steps={[{ label: i18n.t('breadcrumb.home') }, { label: i18n.t('breadcrumb.account') }]}
          />
        </div>
        {step === STEPS.EMAIL || !hasOtp ?
          <>
            <div className={styleLogin.login_header}>
              <h3>{i18n.t('login.title')}</h3>
            </div>
            <div className={styleLogin.login_container}>
              <Login
                classes={loginClasses}
                onCompletedMsg={(msg) => toast.success(msg)}
                onErrorMsg={(msg) => toast.error(msg)}
                passwordViewIcon={<RiEyeCloseLine />}
                passwordHideIcon={<RiEye2Line />}
                loadingComponent={<Loader color='text-light' />}
              />
            </div>
          </> :
          <>
            {(step === STEPS.WA) &&
              <div className={styleLogin.login_header}>
                <h3>{i18n.t('login.titleWA')}</h3>
              </div>
            }
            <div className={`${styleLogin.login_container} pt-2`}>
              <WhatsAppOTPInput
                getReCAPTCHAToken={getReCAPTCHAToken}
                brandName={brandName(brand?.name)}
                onStepChange={setStep}
                classes={classesWhatsAppOTP}
                loginRedirectPath='account'
                inputPlaceholder={i18n.t('whatsAppOTPInput.inputPlaceholder')}
                onErrorMsg={(msg) => toast.error(msg)}
                onCompletedMsg={(msg) => toast.success(msg)}
                loadingComponent={
                  <div>
                    <LoaderPages />
                  </div>
                }
                icons={{
                  back: <RiArrowLeftSLine size={20} color="#998060" />
                }}
                customLocales={{
                  continue: i18n.t('login.title'),
                  disclaimer: i18n.t('login.disclaimer'),
                  inputWhatsApp: i18n.t('login.inputWhatsApp'),
                  loginWithAnotherMethod: i18n.t('login.loginWithAnotherMethod'),
                  chooseAnyAccountToLogin: i18n.t('login.chooseAnyAccountToLogin'),
                }}
              />
            </div>
            {(step === STEPS.WA) &&
              <div className={`${styleLogin.login_container} pt-2`}>
                <div className={styleLogin.login_haveAccount}>
                  {i18n.t('login.dontHaveAccount')}{' '}
                  <span
                    onClick={() => router.push({
                      pathname: '/[lng]/register',
                      query: query,
                    })}
                  >
                    {i18n.t('login.toRegister')}
                  </span>
                </div>
              </div>
            }
          </>
        }
        {(step === STEPS.EMAIL || step === STEPS.WA) &&
          <div className={styleLogin.login_container}>
            {(hasGoogleAuth || hasFacebookAuth || hasOtp) &&
              <>
                <label className={styleLogin.login_separator}>
                  <span>{i18n.t('login.or')}</span>
                </label>
                <div className={styleLogin.login_containerAuth}>
                  {(hasGoogleAuth || hasFacebookAuth) &&
                    <SingleSignOn
                      className={styleLogin.login_containerAuth_item}
                      googleButtonText={'signin_with'}
                      googleButtonSize={'medium'}
                      googleButtonType={'icon'}
                      googleButtonTheme={'outline'}
                      googleButtonShape={'circle'}
                      loadingComponent={
                        <div>
                          <LoaderPages />
                        </div>
                      }
                    />
                  }
                  {hasOtp &&
                    <button
                      className={styleLogin.login_containerAuth_item}
                      onClick={() => handleChangeStep(step)}
                    >
                      {step === STEPS.EMAIL ?
                        <RiWhatsappFill size={20} color="#53B671" /> :
                        <RiMailFill size={20} color="#998060" />
                      }
                      <span>
                        {step === STEPS.EMAIL ?
                          i18n.t("login.whatsapp") :
                          i18n.t("login.email")
                        }
                      </span>
                    </button>
                  }
                </div>
              </>
            }
          </div>
        }
      </div>
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={process.env.NEXT_PUBLIC_SITEKEY_RECAPTCHA_INVISIBLE}
        size='invisible'
      />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params
}) => {
  const [
    brand,
    hasGoogleAuth,
    hasFacebookAuth,
    hasOtp
  ] = await Promise.all([
    useBrand(req),
    useGoogleAuth(req),
    useFacebookAuth(req),
    useWhatsAppOTPSetting(req),
    useAuthToken({req, res, env: process.env})
  ])
  const defaultLanguage = brand?.settings?.defaultLanguage || params.lng || 'id'
  const { default: lngDict = {} } = await import(`locales/${defaultLanguage}.json`)

  const cookies = parseCookies(req)

  redirectIfAuthenticated(res, cookies, 'account', defaultLanguage)

  return {
    props: {
      lng: defaultLanguage,
      lngDict,
      hasGoogleAuth,
      hasFacebookAuth,
      hasOtp,
      brand: brand || ""
    }
  }
}

export default LoginPage