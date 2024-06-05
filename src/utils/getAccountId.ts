import getStorageData from "./getStorageData"

const getAccountId = () => {
  const {accountId} = getStorageData("persistedAuthUser", ["authUser"]) || ""
  return accountId
}

export default getAccountId