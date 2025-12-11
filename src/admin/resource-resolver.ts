/**
 * This function normalizes the :resource req.param to pascalCase so it can match prsima model name.
 * @param rawModelName
 * @returns string
 * @example normalizeResourceName('themes') returns "Theme"
 */
export const normalizeResourceName = (rawModelName: string): string => {
	const cleaned = rawModelName.trim().toLowerCase();

	const singular = cleaned.endsWith("s") ? cleaned.slice(0, -1) : cleaned;

	const normalizedModelName = singular
		.split("-")
		.map((piece) => piece.charAt(0).toUpperCase() + piece.slice(1))
		.join("");

	return normalizedModelName;
};
