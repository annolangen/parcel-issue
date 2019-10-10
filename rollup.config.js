import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'ts/app.ts',
  plugins: [typescript(), resolve()],
  output:{
    file: 'build/app.js',
    format: 'esm'
  }
};
