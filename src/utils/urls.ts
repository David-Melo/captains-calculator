export const getTenantSlug = (): string => {
    return window.location.hostname.split('.').slice(0, -2).join('.')
}