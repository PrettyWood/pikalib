import cjs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import { terser } from 'rollup-plugin-terser'
import less from 'rollup-plugin-less'
import nodeResolve from './build/resolve'
import vue from 'rollup-plugin-vue'
import babel from './build/babel'
import typescript from 'rollup-plugin-typescript2';
import fs from 'fs'
import alias from 'rollup-plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-css-only';

const isProduction = !process.env.ROLLUP_WATCH

export default () => {
  let config = [
    // {
    //   input: 'src/index.ts',
    //   output: { format: 'esm', file: 'dist/equal.esm.js', exports: 'named' },
    //   external: (id) => {
    //     return /core|^vue$/.test(id)
    //   },
    //   plugins: [

    //     nodeResolve(),
    //     VuePlugin(),
    //     cjs(),
    //     less({
    //       output: (css) => {
    //         const newcss = new CleanCSS().minify(css)
    //         fs.writeFile('dist/equal.css', newcss.styles, () => {})
    //         return newcss.styles
    //       },
    //     }),
    //     babel(),
    //     terser(),
    //   ],
    // },
    // {
    //   input: 'src/index.ts',
    //   output: { format: 'cjs', file: 'dist/equal.cjs.js', exports: 'named' },
    //   external: (id) => {
    //     return /core|^vue$/.test(id)
    //   },
    //   plugins: [nodeResolve(), VuePlugin(), cjs(), less({output: false}), babel(), terser()],
    // },
    {
      input: 'src/index.ts',
      output: {
        format: 'umd',
        file: 'dist/equal.umd.js',
        name: 'Equal',
        exports: 'named',
        globals: {
          vue: 'Vue',
        },
      },
      external: ['vue'],
      plugins: [
        resolve(),
        vue({ preprocessStyles: true }),
        typescript(),
        css({ output: 'dist/app.css' }),
      ],
    },
  ]

  config.forEach((c) => c.plugins.push(filesize({ showBrotliSize: true })))

  // config
  //   .filter((c) => c.output.format === 'umd')
  //   .forEach((c) => {
  //     config.push({
  //       ...c,
  //       output: {
  //         ...c.output,
  //         file: c.output.file.replace(/\.js/g, '.min.js'),
  //       },
  //       plugins: [...c.plugins, terser()],
  //     })
  //   })

  // if (!isProduction) {
  //   config = config.filter((c) => c.output.format === 'esm')
  // }

  return config
}