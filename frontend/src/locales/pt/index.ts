type TranslationModule = { default: Record<string, unknown> };

const modules = import.meta.glob<TranslationModule>("./**/*.json", {
  eager: true,
});

const translations: Record<string, Record<string, unknown>> = {};

for (const path in modules) {
  const moduleName = path.split("/").pop()?.replace(".json", "");

  if (moduleName) translations[moduleName] = modules[path].default;
}

export default translations;
