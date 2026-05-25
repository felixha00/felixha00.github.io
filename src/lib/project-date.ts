export function getProjectDateYear(date?: string | null) {
    if (!date) return null;

    const yearMatch = date.match(/^(\d{4})/);
    if (yearMatch) return yearMatch[1];

    const timestamp = Date.parse(date);
    if (Number.isNaN(timestamp)) return null;

    return String(new Date(timestamp).getUTCFullYear());
}

export function formatProjectDate(
    date?: string | null,
    isCurrent?: boolean | null
) {
    const year = getProjectDateYear(date);

    if (isCurrent) {
        return year ? `${year} - Current` : "Current";
    }

    return year;
}
