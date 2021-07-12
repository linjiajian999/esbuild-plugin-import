import { Loader, Plugin } from 'esbuild';
import fsExtra from 'fs-extra';
import path from 'path';
// import { } from 'lodash';

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

export const transCamel = (str: string, symbol: string) => {
  const _str = str[0].toLowerCase() + str.substr(1);
  return _str.replace(/([A-Z])/g, $1 => `${symbol}${$1.toLowerCase()}`);
};

const importReg = /^import\s+{((?:.|\n)*?)}\s+from\s+['"](.*?)['"];?/m;

// eslint-disable-next-line max-statements
const generateImportExpression = (
  importExpressionInfo: {
    importExpression: string;
    memberString: string;
    libraryString: string;
  },
  config: EsbuildPluginImportOption,
) => {
  const { memberString, libraryString } = importExpressionInfo;

  const {
    libraryDirectory = 'lib',
    camel2DashComponentName = true,
    camel2UnderlineComponentName,
    styleLibraryDirectory,
    // customStyleName,
    style = false,
  } = config;

  const importLines = [];
  const members = memberString

    .split(',')
    .map(v => v.replace(/(^\s+|\s+$)/g, ''))
    .filter(Boolean);

  for (const member of members) {
    // 包含注释的情况就就忽略
    if (/^(?:\/\/|\/\*)/.test(member)) {
      continue;
    }
    const [rawMemberName, aliasMemberName] = member.split(/\s+as\s+/);
    const memberName = aliasMemberName || rawMemberName;

    // eslint-disable-next-line no-nested-ternary
    const transformedMemberName = camel2UnderlineComponentName
      ? transCamel(rawMemberName, '-')
      : camel2DashComponentName
      ? transCamel(rawMemberName, '-')
      : rawMemberName;

    const memberImportDirectory = path.join(
      libraryString,
      libraryDirectory,
      transformedMemberName,
    );

    let stylePath = memberImportDirectory;

    if (styleLibraryDirectory) {
      stylePath = path.join(stylePath, styleLibraryDirectory);
    } else if (style === true) {
      stylePath = path.join(stylePath, 'style');
      importLines.push(`import "${stylePath}";`);
    } else if (style === 'css') {
      stylePath = path.join(stylePath, 'style', 'css');
      importLines.push(`import "${stylePath}";`);
    } else if (typeof style === 'function') {
      stylePath = style(stylePath);
      importLines.push(`import "${stylePath}";`);
    }
    importLines.push(`import ${memberName} from "${memberImportDirectory}";`);
  }
  return importLines.join('\n');
};

const generateNewContent = (
  content: string,
  libraryConfigMap: Record<string, EsbuildPluginImportOption>,
) => {
  let newContent = '';
  let matchContent = content;

  while (true) {
    const matches = importReg.exec(matchContent);

    if (!matches) {
      break;
    }
    const [importExpression, memberString, libraryString] = matches;

    const config = libraryConfigMap[libraryString];

    if (config) {
      newContent += matchContent.substring(0, matches.index);

      newContent += generateImportExpression(
        { importExpression, memberString, libraryString },
        config,
      );
    } else {
      newContent += matchContent.substring(
        0,
        matches.index + importExpression.length,
      );
    }

    matchContent = matchContent.substring(
      matches.index + importExpression.length,
      matchContent.length,
    );
  }
  newContent += matchContent;

  return newContent;
};

export const esbuildPluginImport = (
  options: EsbuildPluginImportOption[] = [],
) => {
  const plugin: Plugin = {
    name: 'esbuild-plugin-import',
    setup(build) {
      const filter = /[t|j]sx?$/;

      const libraryConfigMap = options.reduce((pre, option) => {
        if (option.libraryName) {
          pre[option.libraryName] = option;
        }
        return pre;
      }, {} as Record<string, EsbuildPluginImportOption>);

      build.onLoad({ filter }, async args => {
        const { path: filePath, namespace } = args;

        let fileContent = '';

        if (namespace === 'file') {
          const fileContentBuffer = await fsExtra.readFile(filePath);
          fileContent = fileContentBuffer.toString();
        }

        const content = generateNewContent(fileContent, libraryConfigMap);

        return {
          contents: content,
          loader: path.extname(filePath).replace('.', '') as Loader,
        };
      });
      return undefined;
    },
  };
  return plugin;
};
