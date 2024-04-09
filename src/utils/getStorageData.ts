const getStorageData = (key: string, propertyPath: string[], type: "sessionStorage" | "localStorage") => {
  const item = type === "sessionStorage" ? sessionStorage.getItem(key) : localStorage.getItem(key)
  let result = item ? JSON.parse(item) : null;

  for (const property of propertyPath) {
    result = result ? result[property] : null;
  }
  return result;
}

export default getStorageData;
