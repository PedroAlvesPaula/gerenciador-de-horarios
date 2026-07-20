import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ptTranslations from "./pt/index";
import enTranslations from "./en/index";

const resources = {
  "pt-BR": { translation: ptTranslations },
  en: { translation: enTranslations },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "pt-BR",
    fallbackLng: "pt-BR",
    supportedLngs: ["pt-BR", "en"],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
