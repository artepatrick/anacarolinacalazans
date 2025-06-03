const PhoneNumberFormatter = require("./phoneNumberFormatter");
const { createClient } = require("@supabase/supabase-js");
const { Log } = require("node-api-rest-framework");

class PhoneNumberMaintenance {
  constructor(supabaseUrl, supabaseKey) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.formatter = new PhoneNumberFormatter();
  }

  /**
   * Atualiza números de telefone em uma tabela do Supabase
   * @param {string} tableName - Nome da tabela
   * @param {string} phoneColumn - Nome da coluna de telefone
   * @param {string} idColumn - Nome da coluna de ID
   * @returns {Promise<{success: boolean, updated: number, errors: Array}>}
   */
  async updatePhoneNumbers(tableName, phoneColumn, idColumn = "id") {
    try {
      // Busca todos os registros com números de telefone
      const { data: records, error: fetchError } = await this.supabase
        .from(tableName)
        .select(`${idColumn}, ${phoneColumn}`)
        .not(phoneColumn, "is", null);

      if (fetchError) throw fetchError;

      const results = {
        success: true,
        updated: 0,
        errors: [],
      };

      // Processa cada registro
      for (const record of records) {
        try {
          const originalNumber = record[phoneColumn];
          const formattedNumber = this.formatter.formatToFull(originalNumber);

          // Atualiza apenas se o número foi alterado
          if (formattedNumber !== originalNumber) {
            const { error: updateError } = await this.supabase
              .from(tableName)
              .update({ [phoneColumn]: formattedNumber })
              .eq(idColumn, record[idColumn]);

            if (updateError) {
              results.errors.push({
                id: record[idColumn],
                error: updateError.message,
              });
            } else {
              results.updated++;
            }
          }
        } catch (recordError) {
          results.errors.push({
            id: record[idColumn],
            error: recordError.message,
          });
        }
      }

      return results;
    } catch (error) {
      Log.error(`Erro na manutenção de números de telefone: ${error.message}`);
      return {
        success: false,
        updated: 0,
        errors: [{ error: error.message }],
      };
    }
  }

  /**
   * Valida um número de telefone antes de salvar no Supabase
   * @param {string} phoneNumber - Número de telefone a ser validado
   * @returns {Object} - Resultado da validação
   */
  validatePhoneNumber(phoneNumber) {
    try {
      const formattedNumber = this.formatter.formatToFull(phoneNumber);
      const displayNumber = this.formatter.formatForDisplay(phoneNumber);

      return {
        isValid: true,
        formattedNumber,
        displayNumber,
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message,
      };
    }
  }

  /**
   * Insere ou atualiza um registro com número de telefone formatado
   * @param {string} tableName - Nome da tabela
   * @param {Object} data - Dados a serem inseridos/atualizados
   * @param {string} phoneColumn - Nome da coluna de telefone
   * @returns {Promise<Object>} - Resultado da operação
   */
  async upsertWithFormattedPhone(tableName, data, phoneColumn) {
    try {
      if (data[phoneColumn]) {
        const validation = this.validatePhoneNumber(data[phoneColumn]);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }
        data[phoneColumn] = validation.formattedNumber;
      }

      const { data: result, error } = await this.supabase
        .from(tableName)
        .upsert(data)
        .select();

      if (error) throw error;

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      Log.error(`Erro ao inserir/atualizar registro: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = PhoneNumberMaintenance;
