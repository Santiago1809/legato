/**
 * LazyAppear - Sistema de lazy loading con animaciones suaves
 * Compatible con Astro usando IntersectionObserver API
 *
 * @description Detecta cuando los elementos entran en el viewport y aplica animaciones de aparición
 * @author Desarrollador Senior Fullstack
 * @optimized Rendimiento y UX optimizados
 */

class LazyAppear {
  // Campos de clase para valores estáticos
  observer = null;
  elements = new Set();
  initialized = false;

  /**
   * Inicializa el sistema de lazy loading
   * @param {Object} options - Configuración del observer
   */
  init(options = {}) {
    if (this.initialized) return;

    const defaultOptions = {
      threshold: 0.1,
      rootMargin: "50px 0px -50px 0px",
    };

    const config = { ...defaultOptions, ...options };

    // Crear el IntersectionObserver
    this.observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          this.observer.unobserve(entry.target);
          this.elements.delete(entry.target);
        }
      }
    }, config);

    this.initialized = true;
    this.observeElements();
  }

  /**
   * Busca y observa todos los elementos con la clase lazy-appear
   */
  observeElements() {
    const elements = document.querySelectorAll(".lazy-appear");

    for (const element of elements) {
      // Aplicar estado inicial
      this.setInitialState(element);

      // Observar elemento
      this.observer.observe(element);
      this.elements.add(element);
    }
  }

  /**
   * Establece el estado inicial del elemento antes de la animación
   * @param {HTMLElement} element - Elemento a configurar
   */
  setInitialState(element) {
    element.style.opacity = "0";
    element.style.transform = "translateY(40px)";
    element.style.transition =
      "opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  }

  /**
   * Anima la aparición del elemento
   * @param {HTMLElement} element - Elemento a animar
   */
  animateElement(element) {
    // Añadir clase para indicar que está visible
    element.classList.add("lazy-visible");

    // Aplicar animación de aparición
    element.style.opacity = "1";
    element.style.transform = "translateY(0)";

    // Stagger animation para elementos hijos si existen
    const children = element.querySelectorAll(".lazy-child");
    for (const [index, child] of Array.from(children).entries()) {
      setTimeout(() => {
        child.style.opacity = "1";
        child.style.transform = "translateY(0)";
      }, index * 100);
    }
  }

  /**
   * Observa nuevos elementos dinámicamente
   * @param {HTMLElement} element - Nuevo elemento a observar
   */
  observe(element) {
    if (!this.initialized) {
      console.warn("LazyAppear no está inicializado. Llama a init() primero.");
      return;
    }

    this.setInitialState(element);
    this.observer.observe(element);
    this.elements.add(element);
  }

  /**
   * Limpia recursos y desconecta el observer
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.elements.clear();
    this.initialized = false;
  }
}

// Instancia global
const lazyAppear = new LazyAppear();

// Auto-inicialización cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    lazyAppear.init();
  });
} else {
  lazyAppear.init();
}

// Exportar para uso manual si es necesario
export default lazyAppear;
