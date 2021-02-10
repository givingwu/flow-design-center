// @ts-ignore
import Http from 'axios'
import { PARTICIPANT_TYPES } from '../constants/ENUM_DEFINITIONS'

const FETCH_FLOW_MODEL_URL = '/api/wf/flow/flowModel/'
const CHECK_USER_EXIST_URL = '/api/wf/participant/existsUser'
const FETCH_FLOW_MODEL_BY_DEPLOYMENT_URL = '/api/wf/flow/flowModelByDeployment/'

/**
 * fetchFlowModel
 * @param {string} flowCode
 * @returns { applyScopeName: string, flowModel: {}, formModel: {}}
 */
export const fetchFlowModel = (flowCode) => {
  return Http.get(FETCH_FLOW_MODEL_URL + flowCode)
}

/**
 * fetchFlowModelByDeployment
 * @param {string} deploymentId
 * @returns { applyScopeName: string, flowModel: {}, formModel: {}}
 */
export const fetchFlowModelByDeployment = (deploymentId) => {
  return Http.get(FETCH_FLOW_MODEL_BY_DEPLOYMENT_URL + deploymentId)
}

/**
 * checkUserExistsOrNot
 * @param {{ participantType: string, sysNoList: number[] }} data
 * @returns {Promise<{ participantType: string, sysNo: number, existsUser: boolean }[]>}
 */
export const checkUserExistsOrNot = (data) => {
  return Http.post(CHECK_USER_EXIST_URL, data)
}

export const checkDoesUserExist = (participant) => {
  const { list, type } = participant

  if (
    (type === PARTICIPANT_TYPES.POSITION ||
      type === PARTICIPANT_TYPES.DEPARTMENT) &&
    list &&
    list.length &&
    !list.every((item) => item.hasUser !== undefined && item.hasUser)
  ) {
    return checkUserExistsOrNot({
      participantType: type,
      sysNoList: list.map((item) => item.value)
    }).then((users = []) => {
      const userExistStatus = users.reduce((status, { sysNo, existsUser }) => {
        status[sysNo] = existsUser
        return status
      }, {})

      list.forEach((item) => {
        item.hasUser = userExistStatus[item.value]
      })
    })
  }
}
