import getStorageData from "./getStorageData"

const getAccountId = () => {

  const isAccountId =  getStorageData("sessionPersistedAuthUser", ["authUser"],  "sessionStorage")?.accountId 
  if (isAccountId) {
    return isAccountId
  } else {
    return getStorageData("localPersistedAuthUser", ["authUser"],  "localStorage")?.accountId 
  }
}

export default getAccountId