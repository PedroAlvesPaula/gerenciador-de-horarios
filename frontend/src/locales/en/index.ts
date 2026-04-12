const modules = import.meta.glob("./**/*.json", {eager: true});

const translations: Record<string, any> = {};

for (const path in modules) {
  const moduleName = path?.split("/")?.pop()?.replace(".json", "");

  if (moduleName) translations[moduleName] = (modules[path] as any).default;
}

export default translations;
