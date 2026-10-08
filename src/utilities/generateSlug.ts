export function generateSlug(text: string): string {
    return text
        // 1. Convert to lowercase
        .toLowerCase()

        // 2. Convert '&' to 'and'
        .replace(/&/g, 'and')

        // 3. Replace all non-word characters (except spaces, hyphens) with nothing
        // This removes commas, periods, exclamation marks, etc.
        .replace(/[^\w\s-]/g, '')

        // 4. Replace spaces with a single hyphen
        .replace(/\s+/g, '-')

        // 5. Remove consecutive hyphens (e.g., -- to -)
        .replace(/-+/g, '-')

        // 6. Trim leading and trailing hyphens
        .replace(/^-+|-+$/g, '');
}
