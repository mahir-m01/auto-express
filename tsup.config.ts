import { defineConfig } from 'tsup';
 
export default defineConfig({
    format: ['cjs'],
    entry: ['./src/index.ts', "src/helpers/version.ts", ],
    dts: true,
    shims: true,
    skipNodeModulesBundle: true,
    clean: true,
});
 