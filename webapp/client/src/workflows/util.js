import config from 'src/config'
import { postData } from 'src/edge/common/util'

export const apis = {
  publicStructures: '/api/public/structures',
  userStructures: '/api/auth-user/structures',
  userStructuresAll: '/api/auth-user/structures/all',
  adminStructures: '/api/admin/structures',
  publicTrame: '/api/public/trame',
  userTrame: '/api/auth-user/trame',
}

export const structureUrl = config.APP.API_URI + '/structures'

// validators
export const isValidChromosomes = (name) => {
  const regexp = new RegExp(/^([xy]|[1-9]|[1-2]\d{1})(,([xy]|[1-9]|[1-2]\d{1}))*$/)
  return regexp.test(name.trim().toLowerCase())
}
// used in slurpy/forms/HiC.js
export const isValidChromosome = (name) => {
  const regexp = new RegExp(/^[a-zA-Z0-9\-_.]{3,}$/)
  return regexp.test(name.trim())
}

export const isValidTextInput = (name) => {
  const regexp = new RegExp(/^[a-zA-Z0-9\-_.,\s]{1,}$/)
  return regexp.test(name.trim())
}

export const submitTrameSession = (params, userType) => {
  return new Promise((resolve, reject) => {
    // call api to launch a trame instance and redirect to trame
    let formData = new FormData()
    formData.append('params', JSON.stringify(params))
    let apiUrl = apis.userTrame
    if (userType === 'public') {
      apiUrl = apis.publicTrame
    }
    postData(apiUrl, formData)
      .then((data) => {
        if (data.success) {
          resolve(data)
        } else {
          reject(data.message)
        }
      })
      .catch((error) => {
        if (error.message) {
          reject(error.message)
        } else {
          reject(error)
        }
      })
  })
}
