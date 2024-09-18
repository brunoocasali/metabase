import type { HTMLAttributes, Ref } from "react";
import { forwardRef } from "react";
import { t } from "ttag";

import { LogoRoot } from "./MetabotLogo.styled";

export type MetabotVariant = "happy" | "sad" | "cool" | "thinking";

const urlByVariant = {
  happy: "app/assets/img/metabot-happy.svg",
  sad: "app/assets/img/metabot-sad.svg",
  cool: "app/assets/img/metabot-shades.svg",
  thinking: "app/assets/img/thinking_metabot_blue.svg",
};

export interface MetabotLogoProps extends HTMLAttributes<HTMLImageElement> {
  className?: string;
  variant?: MetabotVariant;
}

const MetabotLogo = forwardRef(function MetabotLogo(
  { variant = "happy", ...rest }: MetabotLogoProps,
  ref: Ref<HTMLImageElement>,
) {
  return (
    <LogoRoot
      {...rest}
      ref={ref}
      alt={t`Metabot`}
      src={urlByVariant[variant]}
    />
  );
});

// eslint-disable-next-line import/no-default-export -- deprecated usage
export default MetabotLogo;
