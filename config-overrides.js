const { addBabelPlugin } = require("customize-cra");

const babelPluginTransformTypeScriptSettings = [
  "@babel/plugin-transform-typescript",
  {
    allowNamespaces: true,
  },
];

module.exports =
  function override(config, env) {
    const func = addBabelPlugin(babelPluginTransformTypeScriptSettings);
    func(config);
    return config;
  };
