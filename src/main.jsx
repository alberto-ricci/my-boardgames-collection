import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "./i18n";
import App from "./App";
import "./index.css";

const root = document.getElementById("root");

if (!root) throw new Error("Root element not found. Check your index.html.");

createRoot(root).render(
	<StrictMode>
		<BrowserRouter>
			<LanguageProvider>
				<App />
			</LanguageProvider>
		</BrowserRouter>
	</StrictMode>,
);
