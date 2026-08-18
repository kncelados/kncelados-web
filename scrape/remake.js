import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.CO_API_KEY
});

export async function remakeDescription(description) {
  const { text } = await cohere.chat({
    temperature: 0.6,
    chatHistory: [
      {
        role: "USER",
        message: `
          Eres el equipo de Kncelados, un pódcast de humor en español de España.
          Te paso la descripción original de un episodio de YouTube.
          Reescríbela con tus propias palabras para que Google no la detecte como texto duplicado, quedándote SOLO con el texto que describe de qué va el episodio.

          Normas:
          - Elimina los timestamps de capítulos (líneas tipo "00:00 Tema 1").
          - Elimina los enlaces (Spotify, tienda, redes sociales, etc.).
          - Elimina los hashtags.
          - Elimina textos promocionales, llamadas a la acción y mensajes de cierre.
          - Conserva únicamente el texto narrativo que describe el contenido del episodio.
          - Kncelados es un nombre propio: no lo modifiques.
          - Escribe en primera persona del plural (nosotros), como si fuerais el equipo de Kncelados.
          - Tono desenfadado, natural, sin ser recargado ni ñoño.
          - Usa "vosotros" (español de España), no "ustedes".
          - No uses emojis.
          - No envuelvas la respuesta en comillas.
          - No añadas explicaciones ni mensajes sobre el trabajo realizado.
        `
      }
    ],
    message: description
  });

  return text;
}
