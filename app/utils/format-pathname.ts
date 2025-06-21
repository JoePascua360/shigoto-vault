export function formatPathName(path: string): string {
  if (path.includes("-") && path.includes("/")) {
    const removedSlash = path.replace("/", "");

    /**
     * Splits the string starting in the '-' character, transforms it into array and joined as a string.
     *
     * @example
     * // (eg. job-applications becomes ["job", "applications"])
     * // Then join the array into string = job applications
     */
    const formattedPath = removedSlash.split("-").join(" ");

    return formattedPath;
  } else if (path.includes("/")) {
    return path.replace("/", "");
  } else {
    return "";
  }
}
