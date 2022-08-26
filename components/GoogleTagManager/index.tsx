import { FC, ReactNode } from "react";
import { GTMProvider } from "@elgorditosalsero/react-gtm-hook";

type GoogleTagManagerPropType = {
  brand: any,
  children: ReactNode
}

const GoogleTagManager:FC<GoogleTagManagerPropType> = ({
  brand,
  children
}) => {

  const containerId = brand?.settings?.googleTagManager?.specs?.containerId || ''

  return containerId ?
    <GTMProvider state={{ id: containerId }}>
      {children}
    </GTMProvider>
  :
    <>
      {children}
    </>
}

export default GoogleTagManager