import React, { useState, useEffect, useCallback } from "react";

const IMAGE_FORMATS = ["jpg", "jpeg", "png", "webp"];
const PLACEHOLDER = "/images/fallback.jpg";

const getImageSrc = (id, index) => `/images/${id}.${IMAGE_FORMATS[index]}`;

const GameImage = ({ name, id }) => {
	const [src, setSrc] = useState(() => getImageSrc(id, 0));
	const [formatIndex, setFormatIndex] = useState(0);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		setSrc(getImageSrc(id, 0));
		setFormatIndex(0);
		setLoaded(false);
	}, [id]);

	const handleError = useCallback(() => {
		const next = formatIndex + 1;
		if (next < IMAGE_FORMATS.length) {
			setFormatIndex(next);
			setSrc(getImageSrc(id, next));
		} else {
			setSrc(PLACEHOLDER);
		}
	}, [formatIndex, id]);

	const handleLoad = useCallback(() => {
		setLoaded(true);
	}, []);

	return (
		<div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
			{!loaded && (
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600 border-t-blue-500 animate-spin" />
				</div>
			)}
			<img
				src={src}
				alt={name || "Board game image"}
				className={`object-contain w-full h-full transition-opacity duration-300 ${
					loaded ? "opacity-100" : "opacity-0"
				}`}
				onError={handleError}
				onLoad={handleLoad}
				loading="lazy"
			/>
		</div>
	);
};

export default GameImage;
