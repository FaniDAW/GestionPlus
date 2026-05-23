import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const VARIANTS = {
    left:   { hidden: { opacity: 0, x: -72 }, visible: { opacity: 1, x: 0 } },
    right:  { hidden: { opacity: 0, x:  72 }, visible: { opacity: 1, x: 0 } },
    bottom: { hidden: { opacity: 0, y:  72 }, visible: { opacity: 1, y: 0 } },
    top:    { hidden: { opacity: 0, y: -72 }, visible: { opacity: 1, y: 0 } },
    fade:   { hidden: { opacity: 0         }, visible: { opacity: 1       } },
    zoom:   { hidden: { opacity: 0, scale: 0.88, y: 24 }, visible: { opacity: 1, scale: 1, y: 0 } },
}

export default function AnimateOnScroll(
    {children, from = 'bottom',
        delay = 0,
        className,
    }
) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-40px' })
    const variant = VARIANTS[from] ?? VARIANTS.bottom
    const transition = from === 'zoom'
        ? { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }
        : { type: 'spring', stiffness: 90, damping: 16, delay }

    return (
        <motion.div
            ref={ref}
            className={className}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={variant}
            transition={transition}
            style={{ willChange: 'transform, opacity' }}
        >
            {children}
        </motion.div>
    )
}
