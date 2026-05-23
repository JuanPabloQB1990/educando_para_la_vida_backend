import { randomUUID } from 'crypto';

export function generateSecurePassword(length: number = 12): string {
    const base = randomUUID().replace(/-/g, '');

    return (
        base.slice(0, 4).toUpperCase() +
        '@' +
        base.slice(4, 8) +
        '9#'
    ).slice(0, length + 2);
}