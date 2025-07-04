/**
 * @param {string} key - refers to the environment variable's key in env file (eg. process.env.**NODE_ENV**)
 */
export const envChecker = (key: string) => {
  const env = process.env[key];

  if (!env) {
    throw new Error(
      `Environment variable for ${key} ${process.env[key]} is missing.`
    );
  } else {
    return env;
  }
};
