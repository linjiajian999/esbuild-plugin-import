import esbuild from 'esbuild';

const esbuildPluginImportOptions = [
  {
    libraryName: '@arco-design/web-react',
    libraryDirectory: 'es',
    camel2DashComponentName: false,
    style: true, // 样式按需加载
  },
  {
    libraryName: '@arco-design/web-react/icon',
    libraryDirectory: 'react-icon',
    camel2DashComponentName: false,
  },
  {
    libraryName: '@byted/hooks',
    libraryDirectory: 'lib',
    camel2DashComponentName: false,
  },
];

const code = `
import { Button, ButtonProps } from '@arco-design/web-react';
`;

describe('esbuild-plugin-import', () => {
  it(`should work`, () => {
    const result = esbuild.transformSync(code);
    console.log('result', result);
  });
});
