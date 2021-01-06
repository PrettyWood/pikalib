import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-css-porter';
import sass from 'rollup-plugin-sass';
import typescript from 'rollup-plugin-typescript2';
import vue from 'rollup-plugin-vue';

import packageJson from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      name: 'Pikalib',
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      name: 'Pikalib',
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    }
  ],
  external: [
    'vue'
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
      objectHashIgnoreUnknownHack: true,
      tsconfig: 'tsconfig.json',
      tsconfigOverride: { exclude: ['node_modules', 'src/main.ts', 'tests'] }
    }),
    commonjs(),
    vue({
      css: true,
    }),
    sass(),
    css(),
    resolve(),
  ]
};
