import React from "react";

const IMAGE_FORMATS = ["jpg", "jpeg", "png", "webp"];

const GameImage = ({ name, id }) => {
	const placeholder = "/images/fallback.jpg";

	const [formatIndex, setFormatIndex] = React.useState(0);
	const [src, setSrc] = React.useState(`/images/${id}.${IMAGE_FORMATS[0]}`);

	React.useEffect(() => {
		setFormatIndex(0);
		setSrc(`/images/${id}.${IMAGE_FORMATS[0]}`);
	}, [id]);

	const handleError = () => {
		const next = formatIndex + 1;
		if (next < IMAGE_FORMATS.length) {
			setFormatIndex(next);
			setSrc(`/images/${id}.${IMAGE_FORMATS[next]}`);
		} else {
			setSrc(placeholder);
		}
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
