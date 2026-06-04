import AnimateOnScroll from './AnimateOnScroll'
import portatilImg from '../assets/Responsive_portatil.png'
import tabletImg   from '../assets/Responsive_tablet.png'
import movilImg    from '../assets/Responsive_movil.png'

export default function DevicesSection() {
  return (
    <section className="pt-12 pb-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Encabezado */}
        <AnimateOnScroll from="bottom" className="text-center mb-8">
          <span className="inline-block bg-sky-100 text-sky-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            Multiplataforma
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-4">
            Tu programa de fidelización,{' '}
            <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              en cualquier dispositivo
            </span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            Sin apps que descargar. Tus clientes y tú accedéis desde el móvil,
            la tablet o el ordenador.
          </p>
        </AnimateOnScroll>

        {/* Composición de dispositivos superpuestos */}
        <div className="relative h-[280px] sm:h-[360px] lg:h-[420px] max-w-4xl mx-auto">

          {/* Portátil — izquierda, el más grande, z-10 */}
          <div className="absolute bottom-0 left-0 w-[56%] z-10">
            <AnimateOnScroll from="bottom" delay={0.1}>
              <img
                src={portatilImg}
                alt="Gestion+ en portátil"
                className="w-full drop-shadow-xl hover:-translate-y-2 transition-transform duration-300"
              />
            </AnimateOnScroll>
          </div>

          {/* Tablet — derecha, mediana, z-20 */}
          <div className="absolute bottom-0 right-0 w-[36%] z-20">
            <AnimateOnScroll from="bottom" delay={0.25}>
              <img
                src={tabletImg}
                alt="Gestion+ en tablet"
                className="w-full drop-shadow-xl hover:-translate-y-2 transition-transform duration-300"
              />
            </AnimateOnScroll>
          </div>

          {/* Móvil — centro-frente, el más pequeño, z-30 */}
          <div className="absolute bottom-0 left-[50%] translate-y-8 w-[18%] z-30">
            <AnimateOnScroll from="bottom" delay={0.4}>
              <img
                src={movilImg}
                alt="Gestion+ en móvil"
                className="w-full drop-shadow-xl hover:-translate-y-2 transition-transform duration-300"
              />
            </AnimateOnScroll>
          </div>

        </div>
      </div>
    </section>
  )
}
