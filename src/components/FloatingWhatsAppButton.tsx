const WHATSAPP_URL = "https://wa.me/27872500972?text=Hi%2C%20I%27m%20interested%20in%20South%20Bound.%20Can%20you%20show%20me%20the%20main%20menu%3F";

const FloatingWhatsAppButton = () => {
	return (
		<a
			href={WHATSAPP_URL}
			target="_blank"
			rel="noopener noreferrer"
			aria-label="Chat with South Bound on WhatsApp"
			className="fixed bottom-5 right-4 md:bottom-6 md:right-6 z-50 inline-flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-large transition transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
			style={{
				bottom: `calc(var(--wa-bottom, 1.25rem) + env(safe-area-inset-bottom))`,
				right: `calc(var(--wa-right, 1rem) + env(safe-area-inset-right))`,
			}}
		>
			<span className="sr-only">Chat on WhatsApp</span>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 32 32"
				className="h-6 w-6 md:h-7 md:w-7"
				fill="currentColor"
				aria-hidden="true"
			>
				<path d="M19.11 17.3c-.27-.14-1.6-.8-1.85-.9-.25-.09-.43-.14-.61.14-.18.27-.7.9-.86 1.08-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.35-.8-.71-1.34-1.58-1.5-1.85-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.46-.16 0-.34-.02-.52-.02s-.48.07-.73.34c-.25.27-.96.94-.96 2.29 0 1.35.98 2.66 1.12 2.84.14.18 1.93 2.95 4.68 4.02.65.28 1.16.45 1.56.58.65.2 1.24.17 1.71.1.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.16.16-1.28-.07-.12-.25-.2-.52-.34z"/>
				<path d="M26.67 5.33C23.8 2.47 20.05 1 16.01 1 7.75 1 1 7.75 1 16.01c0 2.54.66 5.03 1.9 7.23L1 31l7.9-1.87a15.01 15.01 0 0 0 7.11 1.81h.01c8.26 0 15.01-6.75 15.01-15.01 0-4.01-1.56-7.77-4.36-10.6zM16.02 28.32h-.01a12.3 12.3 0 0 1-6.27-1.72l-.45-.27-4.69 1.11 1-4.57-.3-.47A12.31 12.31 0 0 1 3.7 16C3.69 9.3 9.31 3.7 16 3.7c3.29 0 6.38 1.28 8.71 3.61a12.25 12.25 0 0 1 3.62 8.7c0 6.79-5.53 12.31-12.31 12.31z"/>
			</svg>
		</a>
	);
};

export default FloatingWhatsAppButton;


