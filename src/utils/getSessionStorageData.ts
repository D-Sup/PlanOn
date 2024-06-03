const getSessionStorageData = (key: string, propertyPath: string[]) => {
  const item = sessionStorage.getItem(key);
  let result = item ? JSON.parse(item) : null;

  for (const property of propertyPath) {
    result = result ? result[property] : null;
  }

  return result;
}

export default getSessionStorageData;
