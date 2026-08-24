import es from "./es.json"

const diccionario = es as Record<string, string>

/** Traduce una clave; si no existe devuelve la clave misma. */
export const t = (clave: string): string => diccionario[clave] ?? clave
