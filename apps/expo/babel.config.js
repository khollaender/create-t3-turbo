module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      "nativewind/babel",
      [
        "module-resolver",
        {
          alias: {
            crypto: "react-native-quick-crypto",
            stream: "stream-browserify",
            buffer: "@craftzdog/react-native-buffer",
          },
        },
      ],
    ],

    presets: ["babel-preset-expo"],
  };
};
