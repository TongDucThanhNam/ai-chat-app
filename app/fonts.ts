import localFont from 'next/font/local'

// local font
export const MapleMonoNormal = localFont({
    src: '../public/fonts/MapleMonoNormalNL-Light.woff2',
    variable: '--font-maple-mono-normal',
})

export const MapleMonoMedium = localFont({
    src: '../public/fonts/MapleMonoNormalNL-Medium.woff2',
    variable: '--font-maple-mono-bold',
})

export const MapleMonoBold = localFont({
    src: '../public/fonts/MapleMonoNormalNL-Bold.woff2',
    variable: '--font-maple-mono-bold',
})

export const MapleMonoItalic = localFont({
    src: '../public/fonts/MapleMonoNormalNL-Italic.woff2',
    variable: '--font-maple-mono-italic',
    style: 'italic',
})