type Gtag = (...args: unknown[]) => void;

declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: Gtag;
    }
}

// Analytics is optional. Never load a tracking script with an empty identifier.
export const initializeAnalytics = (measurementId: string | undefined): void => {
    if (!measurementId || !/^G-[A-Z0-9]+$/.test(measurementId)) return;
    if (document.getElementById('google-analytics')) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer!.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId);

    const script = document.createElement('script');
    script.id = 'google-analytics';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
};
