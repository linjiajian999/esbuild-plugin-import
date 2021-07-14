# esbuild-plugin-import

Modularly import plugin for esbuild.

inspired by [ant-design/babel-plugin-import](https://github.com/ant-design/babel-plugin-import)

## Example

```ts
import { Button } from 'antd';

// 👇🏻 👇🏻 👇🏻 👇🏻 👇🏻 👇🏻 👇🏻 👇🏻 👇🏻 👇🏻 //

import 'antd/lib/button/style/css';
import Button from 'antd/lib/button';
```

## Usage

```shell
npm install @linjiajian999/esbuild-plugin-import
```

### config

### options

```ts
export interface EsbuildPluginImportOption {
  libraryName: string;
  /**
   * @default 'lib'
   */
  libraryDirectory?: string;
  style: 'css' | boolean | ((importPath: string) => string);
  styleLibraryDirectory: string;
  customStyleName: string;
  /**
   * @default true
   */
  camel2DashComponentName?: boolean;
  camel2UnderlineComponentName?: boolean;
  fileName: string;
  customName: string;
  /**
   * @default true
   */
  transformToDefaultImport: string;
}
```

#### libraryName

todo

## Contributors

This project exists thanks to all the people who contribute.

<a href="https://github.com/linjiajian999/esbuild-plugin-import/graphs/contributors">contributors</a>
