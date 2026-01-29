import localFont from "next/font/local"

export const fontSaint = localFont({
    src: [
        {
            path: '../../public/fonts/Saint-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
    ],
    variable: '--font-saint',
    display: 'swap',
});

export const fontRedaction = localFont({
    src: [
        { path: '../../public/fonts/redaction/Redaction-Regular.woff2', weight: '400', style: 'normal' },
        { path: '../../public/fonts/redaction/Redaction-Italic.woff2', weight: '400', style: 'italic' },
        { path: '../../public/fonts/redaction/Redaction-Bold.woff2', weight: '700', style: 'normal' },
    ],
    variable: '--font-redaction',
})

export const fontRedaction10 = localFont({
    src: [
        { path: '../../public/fonts/redaction/Redaction_10-Regular.woff2', weight: '400', style: 'normal' },
        { path: '../../public/fonts/redaction/Redaction_10-Italic.woff2', weight: '400', style: 'italic' },
        { path: '../../public/fonts/redaction/Redaction_10-Bold.woff2', weight: '700', style: 'normal' },
    ],
    variable: '--font-redaction-10',
})

export const fontRedaction20 = localFont({
    src: [
        { path: '../../public/fonts/redaction/Redaction_20-Regular.woff2', weight: '400', style: 'normal' },
        { path: '../../public/fonts/redaction/Redaction_20-Italic.woff2', weight: '400', style: 'italic' },
        { path: '../../public/fonts/redaction/Redaction_20-Bold.woff2', weight: '700', style: 'normal' },
    ],
    variable: '--font-redaction-20',
})

export const fontRedaction35 = localFont({
    src: [
        { path: '../../public/fonts/redaction/Redaction_35-Regular.woff2', weight: '400', style: 'normal' },
        { path: '../../public/fonts/redaction/Redaction_35-Italic.woff2', weight: '400', style: 'italic' },
        { path: '../../public/fonts/redaction/Redaction_35-Bold.woff2', weight: '700', style: 'normal' },
    ],
    variable: '--font-redaction-35',
})

export const fontRedaction50 = localFont({
    src: [
        { path: '../../public/fonts/redaction/Redaction_50-Regular.woff2', weight: '400', style: 'normal' },
        { path: '../../public/fonts/redaction/Redaction_50-Italic.woff2', weight: '400', style: 'italic' },
        { path: '../../public/fonts/redaction/Redaction_50-Bold.woff2', weight: '700', style: 'normal' },
    ],
    variable: '--font-redaction-50',
})

export const fontRedaction70 = localFont({
    src: [
        { path: '../../public/fonts/redaction/Redaction_70-Regular.woff2', weight: '400', style: 'normal' },
        { path: '../../public/fonts/redaction/Redaction_70-Italic.woff2', weight: '400', style: 'italic' },
        { path: '../../public/fonts/redaction/Redaction_70-Bold.woff2', weight: '700', style: 'normal' },
    ],
    variable: '--font-redaction-70',
})

export const fontRedaction100 = localFont({
    src: [
        { path: '../../public/fonts/redaction/Redaction_100-Regular.woff2', weight: '400', style: 'normal' },
        { path: '../../public/fonts/redaction/Redaction_100-Italic.woff2', weight: '400', style: 'italic' },
        { path: '../../public/fonts/redaction/Redaction_100-Bold.woff2', weight: '700', style: 'normal' },
    ],
    variable: '--font-redaction-100',
})