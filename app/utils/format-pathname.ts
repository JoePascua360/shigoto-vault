export function formatPathName(path: string): string {
  const removedAppPath = path.replace("/app/", "");

  // replace '/' and '-' characters with a whitespace
  const convertToOnePath = removedAppPath.replace(/[/-]/g, " ");

  const trimmedPath = convertToOnePath.trim();

  const splitArr = trimmedPath.split(" ");

  //  remove the excess elements so that only 1 path is returned
  if (splitArr.length > 2) {
    splitArr.splice(2, splitArr.length);
    return splitArr.join(" ");
  } else {
    return trimmedPath;
  }
}
