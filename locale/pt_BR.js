/* eslint-disable */
import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `Valor inválido.`,
  after: (field, [target]) => `Este campo deve estar depois do campo ${target}.`,
  alpha: (field) => `Este campo deve conter somente letras.`,
  alpha_dash: (field) => `Este campo deve conter letras, números e traços.`,
  alpha_num: (field) => `Este campo deve conter somente letras e números.`,
  alpha_spaces: (field) => `Este campo só pode conter caracteres alfabéticos e espaços.`,
  before: (field, [target]) => `Este campo deve estar antes do campo ${target}.`,
  between: (field, [min, max]) => `Este campo deve estar entre ${min} e ${max}.`,
  confirmed: (field, [confirmedField]) => `Os campos ${field} e ${confirmedField} devem ser iguais.`,
  credit_card: (field) => `Este campo é inválido.`,
  date_between: (field, [min, max]) => `Este campo deve estar entre ${min} e ${max}.`,
  date_format: (field, [format]) => `Este campo deve estar no formato ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `Este campo deve ser numérico e deve conter ${!decimals || decimals === '*' ? '' : decimals} casas decimais.`,
  digits: (field, [length]) => `Este campo deve ser numérico e ter exatamente ${length} dígitos.`,
  dimensions: (field, [width, height]) => `Este campo deve ter ${width} pixels de largura por ${height} pixels de altura.`,
  email: (field) => `Este campo deve ser um email válido.`,
  excluded: (field) => `Este campo deve ser um valor válido.`,
  ext: (field) => `Este campo deve ser um arquivo válido.`,
  image: (field) => `Este campo deve ser uma imagem.`,
  included: (field) => `Este campo deve ter um valor válido.`,
  integer: (field) => `Este campo deve ser um número inteiro.`,
  ip: (field) => `Este campo deve ser um endereço IP válido.`,
  length: (field, [length, max]) => {
    if (max) {
      return `O tamanho deste campo está entre ${length} e ${max}.`;
    }

    return `O tamanho deste campo deve ser ${length}.`;
  },
  max: (field, [length]) => `Este campo não deve ter mais que ${length} caracteres.`,
  max_value: (field, [max]) => `Este campo precisa ser ${max} ou menor.`,
  mimes: (field) => `Este campo deve ser um tipo de arquivo válido.`,
  min: (field, [length]) => `Este campo deve conter pelo menos ${length} caracteres.`,
  min_value: (field, [min]) => `Este campo precisa ser ${min} ou maior.`,
  numeric: (field) => `Este campo deve conter apenas números`,
  regex: (field) => `Este campo possui um formato inválido.`,
  required: (field) => `Este campo é obrigatório.`,
  size: (field, [size]) => `Este campo deve ser menor que ${formatFileSize(size)}.`,
  url: (field) => `Este campo não é uma URL válida.`
};

const locale = {
  name: 'pt_BR',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
