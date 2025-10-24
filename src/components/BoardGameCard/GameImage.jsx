import React from "react";

const GameImage = ({ name, id, image_url }) => {
	// Local hardcoded images fallback
	const placeholder = "/images/fallback.jpg"; // put in /public/images/

	// Try to load `/images/<id>.jpg`
	const localPath = `/images/${id}.jpg`;
	const [src, setSrc] = React.useState(image_url || localPath);

	const handleError = () => {
		if (src !== placeholder) setSrc(placeholder);
	};

	return (
		<div className="relative w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
			<img
				src={src}
				alt={name || "Board game image"}
				className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
				onError={handleError}
				loading="lazy"
			/>
		</div>
	);
};

export default GameImage;
