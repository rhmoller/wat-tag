import { WasmModule } from "wabt";
const wabt = require("wabt")();

export async function wat(strings: TemplateStringsArray, ...values: any[]) {
  const buffer = watb(strings, values);
  return WebAssembly.compile(buffer);
}

export function watb(strings: TemplateStringsArray, ...values: any[]) {
  const src = interpolateString(strings, values);
  const module: WasmModule = wabt.parseWat("<inline>", src);
  module.resolveNames();
  module.validate();
  const binaryOutput = module.toBinary({ log: true, write_debug_names: true });
  const buffer = binaryOutput.buffer;
  module.destroy();
  return buffer;
}

function interpolateString(strings: TemplateStringsArray, ...values: any[]) {
  let str = "";
  strings.forEach((string, i) => {
    str += string;
    const value = values[i];
    if (typeof value !== "undefined") {
      str += value;
    }
  });
  return str;
}
