export function formatDateTime() {
    const offset = -3 * 60 * 60 * 1000;
    return new Date(Date.now() + offset);
}
