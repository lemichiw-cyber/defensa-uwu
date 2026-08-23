import { useEffect } from "react"

/**
 * Réplica del IntersectionObserver del NewIndex.HTML original:
 * los elementos .reveal aparecen con fade-up al entrar en pantalla.
 */
export function useReveal() {
  useEffect(() => {
    const elementos = document.querySelectorAll(".reveal")
    const observer = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("reveal-visible")
            observer.unobserve(entrada.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )
    elementos.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
