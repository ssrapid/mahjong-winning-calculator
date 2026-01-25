export * from './define.js'
export * from './builder.js'


/**
 * 共通Agariテンプレート
 * @typedef {object} AgariTemplateInterface
 * @property {"tsumo"|"ron"} templateType
 * @property {string} templateID
 * @property {number} yakumanLevel
 * @property {{fu:number,han:number}[]|undefined} fuAndHan
 * @property {string|undefined} limitLabel
 * @property {boolean|undefined} isUnavailableWhenRiichi
 * @property {string} description
 */

/**
 * @typedef {AgariTemplateInterface & {
 *   templateType: "tsumo",
 *   tsumoPaymentToChild: number,
 *   tsumoPaymentToDealer: number,
 *   tsumoGainAsChild: number,
 *   tsumoGainAsDealer: number
 * }} TsumoAgariTemplate
 */

/**
 * @typedef {AgariTemplateInterface & {
 *   templateType: "ron",
 *   ronGainAsChild: number,
 *   ronGainAsDealer: number
 * }} RonAgariTemplate
 */

/**
 * @typedef {TsumoAgariTemplate | RonAgariTemplate} AgariTemplate
 */

