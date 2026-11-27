document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-work-gallery]').forEach((gallery) => {
    const track = gallery.querySelector('[data-work-gallery-track]')
    const previous = gallery.querySelector('[data-work-gallery-prev]')
    const next = gallery.querySelector('[data-work-gallery-next]')
    const counter = gallery.querySelector('[data-work-gallery-counter]')

    if (!track || !previous || !next) {
      return
    }

    const slideCount = track.children.length
    if (slideCount < 2) {
      return
    }

    const currentIndex = () => {
      if (!track.clientWidth) {
        return 0
      }
      return Math.min(slideCount - 1, Math.max(0, Math.round(track.scrollLeft / track.clientWidth)))
    }

    const update = () => {
      const index = currentIndex()
      if (counter) {
        counter.textContent = `${index + 1} / ${slideCount}`
      }
      previous.disabled = index <= 0
      next.disabled = index >= slideCount - 1
    }

    const go = (direction) => {
      track.scrollBy({ left: direction * track.clientWidth, behavior: 'smooth' })
    }

    previous.addEventListener('click', () => go(-1))
    next.addEventListener('click', () => go(1))

    track.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        go(-1)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        go(1)
      }
    })

    track.addEventListener('scroll', () => window.requestAnimationFrame(update), { passive: true })
    window.addEventListener('resize', update)
    update()
  })
})
