import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import { babel } from '@rollup/plugin-babel';
import pkg from './package.json' assert { type: 'json' };

const extensions = ['.js', '.ts', '.tsx'];

const external = Object.keys(pkg.dependencies);

function buildJS(input) {
  const parsed = path.parse(input);

  return {
    input: `src/${input}`,
    output: [
      {
        file: `dist/cjs/${parsed.dir}/${parsed.name}.cjs`,
        format: 'cjs',
      },
      {
        file: `dist/esm/${parsed.dir}/${parsed.name}.js`,
        format: 'esm',
      },
    ],
    external,
    plugins: [
      commonjs(),
      resolve({ extensions }),
      typescript({
        declaration: false,
      }),
      babel({ babelHelpers: 'bundled', extensions }),
      terser(),
    ],
  };
}

export default [buildJS('index.ts')];
