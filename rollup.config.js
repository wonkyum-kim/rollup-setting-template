import path from 'path';
import dts from 'rollup-plugin-dts';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import { babel } from '@rollup/plugin-babel';

const extensions = ['.js', '.ts', '.tsx'];

const external = [
  /* ... */
];

function buildJS(input, output, module) {
  return {
    input,
    output: {
      file: output,
      format: module,
    },
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

// CJS 모듈 시스템을 사용하는 코드
function buildCJS(input) {
  const parsed = path.parse(input);
  return buildJS(
    `src/${input}`,
    `dist/cjs/${parsed.dir}/${parsed.name}.cjs`,
    'cjs'
  );
}

// ES 모듈 시스템을 사용하는 코드
function buildESM(input) {
  const parsed = path.parse(input);
  return buildJS(
    `src/${input}`,
    `dist/esm/${parsed.dir}/${parsed.name}.js`,
    'esm'
  );
}

function buildDTS(input, module) {
  const parsed = path.parse(input);
  const isESM = module === 'esm';
  const dir = `dist/${isESM ? 'esm' : 'cjs'}/${parsed.dir}/`;
  const ext = isESM ? '.ts' : '.cts';

  return {
    input: `./types/${input}`,
    output: {
      file: `${dir}${parsed.name}${ext}`,
      format: module,
    },
    plugins: [dts()],
  };
}

function buildCJSDTS(input) {
  return buildDTS(input, 'cjs');
}

function buildESMDTS(input) {
  return buildDTS(input, 'esm');
}

export default [
  buildESM('index.ts'),
  buildCJS('index.ts'),
  buildESMDTS('index.d.ts'),
  buildCJSDTS('index.d.ts'),
];
