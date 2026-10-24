import Script from "next/script";


const GA_MEASUREMENT_ID = 'G-1R5N19K2M6';

export default function GoogleAnalytics() {
    return (
        <>
            <Script
                {...{
                    strategy: 'afterInteractive',
                    src: `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`,
                    async: true
                }}
            />
            <Script
                {...{
                    id: 'gtag-init',
                    strategy: 'afterInteractive',
                    dangerouslySetInnerHTML: {
                        __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', ${GA_MEASUREMENT_ID});
                    `
                    }
                }}
            />
        </>
    );
}
