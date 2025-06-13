const PhoneNumberMaintenance = require("./phoneNumberMaintenance");
const { createClient } = require("@supabase/supabase-js");

class SupabasePhoneMaintenance {
  constructor(supabaseUrl, supabaseKey) {
    this.phoneMaintenance = new PhoneNumberMaintenance(
      supabaseUrl,
      supabaseKey
    );
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Atualiza todos os números de telefone na tabela presence_confirmations
   * @returns {Promise<{success: boolean, updated: number, errors: Array}>}
   */
  async updateAllPhoneNumbers() {
    return this.phoneMaintenance.updatePhoneNumbers(
      "presence_confirmations",
      "phone"
    );
  }

  /**
   * Insere ou atualiza um participante com número de telefone formatado
   * @param {Object} participant - Dados do participante
   * @returns {Promise<Object>} - Resultado da operação
   */
  async upsertParticipant(participant) {
    return this.phoneMaintenance.upsertWithFormattedPhone(
      "presence_confirmations",
      participant,
      "phone"
    );
  }

  /**
   * Valida um número de telefone antes de salvar
   * @param {string} phoneNumber - Número de telefone a ser validado
   * @returns {Object} - Resultado da validação
   */
  validatePhoneNumber(phoneNumber) {
    return this.phoneMaintenance.validatePhoneNumber(phoneNumber);
  }

  /**
   * Busca participantes com números de telefone inválidos
   * @returns {Promise<Array>} - Lista de participantes com números inválidos
   */
  async findInvalidPhoneNumbers() {
    try {
      const { data: participants, error } = await this.supabase
        .from("presence_confirmations")
        .select("id, phone")
        .not("phone", "is", null);

      if (error) throw error;

      const invalidParticipants = [];

      for (const participant of participants) {
        const validation = this.validatePhoneNumber(participant.phone);
        if (!validation.isValid) {
          invalidParticipants.push({
            id: participant.id,
            phone: participant.phone,
            error: validation.error,
          });
        }
      }

      return invalidParticipants;
    } catch (error) {
      console.error("Erro ao buscar números inválidos:", error);
      throw error;
    }
  }
}

module.exports = SupabasePhoneMaintenance;
