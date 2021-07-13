import * as esbuild from 'esbuild';
import path from 'path';
import {
  esbuildPluginImport,
  EsbuildPluginImportOption,
} from '../esbuild-plugin-import';

describe('esbuild-plugin-import', () => {
  it(`should work`, async () => {
    const config: EsbuildPluginImportOption[] = [
      {
        libraryName: 'antd',
      },
    ];

    const result = await esbuild.build({
      entryPoints: [path.resolve(__dirname, './code.ts')],
      write: false,
      plugins: [esbuildPluginImport(config)],
    });
    const [outputContent] = result.outputFiles;

    expect(outputContent.text).toMatchSnapshot();
  });
});
