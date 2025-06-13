const {
  parsePhoneNumberFromString,
  isValidPhoneNumber,
} = require("libphonenumber-js");
const { Log } = require("node-api-rest-framework");

/**
 * Classe para formatação de números de telefone brasileiros
 * @class PhoneNumberFormatter
 */
class PhoneNumberFormatter {
  /**
   * Cria uma instância de PhoneNumberFormatter
   * @param {string} defaultCountryCode - Código de país padrão (ISO 3166-1 alpha-2)
   * @param {string} defaultAreaCode - Código de área padrão (DDD)
   */
  constructor(defaultCountryCode = "BR", defaultAreaCode = "31") {
    this.defaultCountryCode = defaultCountryCode;
    this.defaultAreaCode = defaultAreaCode;
  }

  /**
   * Formata um número de telefone para o formato E.164 sem o caractere '+'
   * @param {string|number|object} input - Número de telefone a ser formatado
   * @returns {string} - Número formatado no padrão E.164 sem o '+'
   * @throws {Error} - Se o número for inválido ou não puder ser formatado
   */
  formatToFull(input) {
    try {
      if (!input) return input;
      const cleanNumber = this.prepareNumber(input);

      if (!cleanNumber) {
        throw new Error("Número inválido ou não pode ser formatado.");
      }

      const phoneNumber = parsePhoneNumberFromString(
        cleanNumber,
        this.defaultCountryCode
      );

      if (
        phoneNumber &&
        isValidPhoneNumber(phoneNumber.number, this.defaultCountryCode)
      ) {
        return phoneNumber.format("E.164").replace("+", "");
      }

      throw new Error("Número inválido ou não pode ser formatado.");
    } catch (error) {
      let errMsg = `Erro ao formatar para formato completo: ${input} ->  ${error.message}`;
      Log.error(errMsg);
      return input;
    }
  }

  /**
   * Remove o dígito 9 de números de celular brasileiros, se presente
   * @param {string|number|object} input - Número de telefone a ser formatado
   * @returns {string} - Número formatado sem o dígito extra
   * @throws {Error} - Se o número for inválido
   */
  formatWithoutExtraDigit(input) {
    try {
      const fullNumber = this.formatToFull(input);

      if (!fullNumber) {
        throw new Error("Número inválido.");
      }

      if (fullNumber.startsWith("55") && fullNumber.length === 13) {
        return fullNumber.slice(0, 4) + fullNumber.slice(5);
      }

      return fullNumber;
    } catch (error) {
      Log.error("Erro ao formatar sem dígito extra:", error.message);
      return input;
    }
  }

  /**
   * Formata um número de telefone para exibição no formato +55 (31) 99999-9999
   * Adiciona o dígito 9 se não estiver presente em números de celular
   * @param {string|number|object} input - Número de telefone a ser formatado
   * @returns {string} - Número formatado para exibição
   * @throws {Error} - Se o número for inválido ou não puder ser formatado
   */
  formatForDisplay(input) {
    try {
      if (!input) return input;

      let cleanNumber = this.prepareNumber(input);

      if (!cleanNumber) {
        throw new Error(
          "Número inválido ou não pode ser formatado para exibição."
        );
      }

      if (cleanNumber.startsWith("55") && cleanNumber.length === 12) {
        cleanNumber = cleanNumber.slice(0, 4) + "9" + cleanNumber.slice(4);
      }

      if (cleanNumber.length === 13 && cleanNumber.startsWith("55")) {
        const countryCode = cleanNumber.slice(0, 2);
        const areaCode = cleanNumber.slice(2, 4);
        const firstPart = cleanNumber.slice(4, 9);
        const secondPart = cleanNumber.slice(9, 13);

        return `+${countryCode} (${areaCode}) ${firstPart}-${secondPart}`;
      }

      throw new Error("Formato de número não suportado para exibição.");
    } catch (error) {
      Log.error(`Erro ao formatar para exibição: ${error.message}`);
      return input;
    }
  }

  /**
   * Prepara e normaliza um número de telefone para processamento
   * Limpa caracteres não numéricos, adiciona código de país e DDD se necessário
   * @param {string|number|object} input - Número de telefone a ser preparado
   * @returns {string} - Número preparado para processamento
   * @throws {Error} - Se o número for inválido após a preparação
   */
  prepareNumber(input) {
    try {
      if (!input) return input;

      let phoneNumber = "";

      if (typeof input === "object") {
        phoneNumber = JSON.stringify(input);
      } else if (typeof input !== "string") {
        phoneNumber = String(input);
      } else {
        phoneNumber = input;
      }

      let cleanNumber = phoneNumber.replace(/\D/g, "");

      if (cleanNumber.startsWith("550")) {
        cleanNumber = cleanNumber.replace(/^550/, "55");
      }

      if (cleanNumber.startsWith("55") && cleanNumber.length > 10) {
        cleanNumber = cleanNumber.replace(/^55(0\d{2})/, "55$1");
      } else if (cleanNumber.startsWith("0")) {
        cleanNumber = cleanNumber.replace(/^0(\d{2})/, "$1");
      }

      if (cleanNumber.length === 8 || cleanNumber.length === 9) {
        cleanNumber = this.defaultAreaCode + cleanNumber;
      }

      if (!cleanNumber.startsWith("55")) {
        cleanNumber = "55" + cleanNumber;
      }

      if (cleanNumber.startsWith("55") && cleanNumber.length === 12) {
        const dddAndNumber = cleanNumber.slice(4);
        if (/^[6-9]\d{7}$/.test(dddAndNumber)) {
          cleanNumber = cleanNumber.slice(0, 4) + "9" + cleanNumber.slice(4);
        }
      }

      if (cleanNumber.length < 12) {
        Log.error(
          "Número de telefone inválido. Deve conter pelo menos 8 dígitos além do DDD e do código nacional."
        );
        throw new Error(`Número de telefone inválido: ${cleanNumber}`);
      }

      return cleanNumber;
    } catch (e) {
      let err = `${e?.message}`;
      let errMsg = `ERRO: em prepareNumber() -> ${err}`;
      Log.error(errMsg);
      return input;
    }
  }
}

module.exports = PhoneNumberFormatter;
