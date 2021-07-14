import * as esbuild from 'esbuild';
import path from 'path';
import {
  esbuildPluginImport,
  EsbuildPluginImportOption,
} from '../esbuild-plugin-import';

const configList: Record<string, EsbuildPluginImportOption[]> = {
  basics: [
    {
      libraryName: 'antd',
    },
    { libraryName: 'lodash', libraryDirectory: '' },
  ],
  [`libraryDirectory`]: [{ libraryName: 'antd', libraryDirectory: 'es' }],
  [`styleLibraryDirectory`]: [
    { libraryName: 'antd', styleLibraryDirectory: 'style/customDir' },
  ],
  [`options.style is equal to 'css'`]: [{ libraryName: 'antd', style: 'css' }],
  [`options.style is equal to true`]: [{ libraryName: 'antd', style: true }],
  [`options.style is equal to false`]: [{ libraryName: 'antd', style: false }],
  [`options.style is function`]: [
    {
      libraryName: 'antd',
      style: (importName, importPath) => {
        return `${importPath}/${importName}/css`;
      },
    },
  ],

  [`camel2DashComponentName is equal to false`]: [
    { libraryName: 'antd', camel2DashComponentName: false },
  ],
  [`camel2DashComponentName is equal to true`]: [
    { libraryName: 'antd', camel2DashComponentName: true },
  ],
  [`camel2UnderlineComponentName is equal to false`]: [
    { libraryName: 'antd', camel2UnderlineComponentName: false },
  ],
  [`camel2UnderlineComponentName is equal to true`]: [
    { libraryName: 'antd', camel2UnderlineComponentName: true },
  ],
  [`ignoreImports`]: [
    {
      libraryName: 'antd',
      camel2DashComponentName: true,
      ignoreImports: [/Props$/, 'Dropdown'],
    },
  ],
  [`all config`]: [
    {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: 'css',
      camel2DashComponentName: false,
      ignoreImports: [/Props$/, 'Dropdown'],
    },
    { libraryName: 'lodash', libraryDirectory: '' },
  ],
};

describe('esbuild-plugin-import', () => {
  const entryPoints = [path.resolve(__dirname, './code.ts')];

  Object.entries(configList).forEach(([key, config]) => {
    it(`should ${key} work`, async () => {
      const result = await esbuild.build({
        entryPoints,
        write: false,
        plugins: [esbuildPluginImport(config)],
      });
      const [outputContent] = result.outputFiles;

      expect(outputContent.text).toMatchSnapshot();
    });
  });
});
