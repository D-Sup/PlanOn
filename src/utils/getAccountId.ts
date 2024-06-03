import getSessionStorageData from "./getSessionStorageData";

const getAccountId = () => {
  const {accountId} = getSessionStorageData("persistedAuthUser", ["authUser"]) || ""
  return accountId
}

export default getAccountId