import { afterEach, describe, expect, it } from 'vitest';
import { initializeAnalytics } from './analytics';

afterEach(() => {
    document.getElementById('google-analytics')?.remove();
    delete window.dataLayer;
    delete window.gtag;
});

describe('optional Google Analytics', () => {
    it.each([undefined, '', 'not-a-measurement-id'])('does not create broken tracking requests for %s', id => {
        initializeAnalytics(id);
        expect(document.getElementById('google-analytics')).toBeNull();
        expect(window.dataLayer).toBeUndefined();
    });

    it('loads the configured property once', () => {
        initializeAnalytics('G-75H31NF76J');
        initializeAnalytics('G-75H31NF76J');
        expect(document.querySelectorAll('#google-analytics')).toHaveLength(1);
        expect(document.getElementById('google-analytics')).toHaveAttribute('src',
            'https://www.googletagmanager.com/gtag/js?id=G-75H31NF76J');
        expect(window.dataLayer).toHaveLength(2);
        expect(Array.from(window.dataLayer![1] as IArguments)).toEqual(['config', 'G-75H31NF76J']);
    });
});
