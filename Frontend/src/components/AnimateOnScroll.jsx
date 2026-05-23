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

const SMOOTH = [0.22, 1, 0.36, 1]

function buildVariant(from, distance) {
    if (!distance) return VARIANTS[from] ?? VARIANTS.bottom
    const d = Math.abs(distance)
    const map = {
        left:   { hidden: { opacity: 0, x: -d }, visible: { opacity: 1, x: 0 } },
        right:  { hidden: { opacity: 0, x:  d }, visible: { opacity: 1, x: 0 } },
        bottom: { hidden: { opacity: 0, y:  d }, visible: { opacity: 1, y: 0 } },
        top:    { hidden: { opacity: 0, y: -d }, visible: { opacity: 1, y: 0 } },
    }
    return map[from] ?? VARIANTS[from] ?? VARIANTS.bottom
}

export default function AnimateOnScroll(
    {children, from = 'bottom',
        delay = 0,
        distance,
        className,
    }
) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-40px' })
    const variant = buildVariant(from, distance)
    const transition = from === 'zoom' || distance
        ? { duration: distance ? 0.7 : 0.5, ease: SMOOTH, delay }
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
