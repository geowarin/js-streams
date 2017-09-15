import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';

export default [
    // browser-friendly UMD build
    {
        input: 'src/index.ts',
        output: {
            file: pkg.browser,
            format: 'umd'
        },
        name: 'Stream',
        plugins: [
            typescript()
        ]
    }
];
