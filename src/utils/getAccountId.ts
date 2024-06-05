import getStorageData from "./getStorageData"

const getAccountId = () => {
  const { isSaved } = getStorageData("isLoginPersistValue", ["isSaved"], "sessionStorage") || ""
  const {accountId} = getStorageData("persistedAuthUser", ["authUser"], isSaved ? "localStorage" : "sessionStorage") || ""
  return accountId
}

export default getAccountId