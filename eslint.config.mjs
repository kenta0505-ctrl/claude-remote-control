import next from "eslint-config-next";

const config = [
  { ignores: [".next/**", "node_modules/**", "data/**"] },
  ...next,
];

export default config;
