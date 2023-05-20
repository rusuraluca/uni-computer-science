
      import {createRequire as __cjsCompatRequire} from 'module';
      const require = __cjsCompatRequire(import.meta.url);
      const __ESM_IMPORT_META_URL__ = import.meta.url;
    
import {
  mainNgcc
} from "../chunk-6S4GKCLN.js";
import "../chunk-R3C7RFJ4.js";
import {
  clearTsConfigCache
} from "../chunk-YYOMS5IC.js";
import "../chunk-6DYPLTK7.js";
import "../chunk-MSOUQGBK.js";
import "../chunk-Q5GIQ3RV.js";
import {
  ConsoleLogger,
  LogLevel
} from "../chunk-LX5Q27EF.js";
import "../chunk-EIFOOEXQ.js";
import "../chunk-WXB5AWIG.js";
import {
  NodeJSFileSystem,
  setFileSystem
} from "../chunk-CLV7JFJQ.js";
import "../chunk-R4NY3TJC.js";
import "../chunk-GMSUYBZP.js";

// bazel-out/k8-fastbuild/bin/packages/compiler-cli/ngcc/index.mjs
import { dirname, join } from "path";
import { fileURLToPath } from "url";
function process(options) {
  setFileSystem(new NodeJSFileSystem());
  return mainNgcc(options);
}
var containingDirPath = typeof __dirname !== "undefined" ? __dirname : dirname(fileURLToPath(__ESM_IMPORT_META_URL__));
var ngccMainFilePath = join(containingDirPath, "./main-ngcc.js");
export {
  ConsoleLogger,
  LogLevel,
  clearTsConfigCache,
  containingDirPath,
  ngccMainFilePath,
  process
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
//# sourceMappingURL=index.js.map
