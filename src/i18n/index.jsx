import { createContext, useContext, useState } from "react";
import en from "./locales/en";
import it from "./locales/it";

const locales = { en, it };

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
	const getInitial = () => {
		const stored = localStorage.getItem("language");
		if (stored && locales[stored]) return stored;
		const browser = navigator.language.slice(0, 2);
		return locales[browser] ? browser : "en";
	};

	const [language, setLanguage] = useState(getInitial);

	const setLang = (lang) => {
		if (!locales[lang]) return;
		localStorage.setItem("language", lang);
		setLanguage(lang);
	};

	const t = (key) => locales[language][key] ?? key;

	return (
		<LanguageContext.Provider value={{ language, setLang, t }}>
			{children}
		</LanguageContext.Provider>
	);
};

export const useLanguage = () => useContext(LanguageContext);
