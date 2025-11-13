export function base64ToUtf8(base64Str) {
	const cleanBase64 = base64Str.replace(/\s/g, '');

	const binaryString = atob(cleanBase64);
	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	const decoder = new TextDecoder('utf-8');
	return decoder.decode(bytes);
}

export function utf8ToBase64(str) {
	const encoder = new TextEncoder();
	const utf8Bytes = encoder.encode(str);
	const binaryString = Array.from(utf8Bytes)
		.map(byte => String.fromCharCode(byte))
		.join('');
	return btoa(binaryString);
}

export function fixDoubleEncoding(str) {
	if (!str) return str;

	try {
		const decoder = new TextDecoder('utf-8');
		const bytes = [];
		for (let i = 0; i < str.length; i++) {
			bytes.push(str.charCodeAt(i) & 0xFF);
		}
		const fixed = decoder.decode(new Uint8Array(bytes));
		if (fixed === str) return str;

		const countHighAscii = (s) => {
			let count = 0;
			for (let i = 0; i < s.length; i++) {
				const code = s.charCodeAt(i);
				if (code >= 0x80 && code <= 0xFF) count++;
			}
			return count;
		};

		const originalHighAscii = countHighAscii(str);
		const fixedHighAscii = countHighAscii(fixed);

		if (!fixed.includes('\uFFFD') && fixedHighAscii < originalHighAscii) {
			return fixed;
		}
	} catch (e) {
		console.error('Error fixing encoding:', e.message);
	}

	return str;
}
