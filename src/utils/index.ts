/**
 * Agrupa un array de objetos por un atributo.
 */
export const groupBy = (array: any[], key: string) =>
  array.reduce((preValue, curValue) => {
    ;(preValue[curValue[key]] = preValue[curValue[key]] || []).push(curValue)
    return preValue
  }, {})
