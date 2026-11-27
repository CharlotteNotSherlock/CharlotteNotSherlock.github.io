document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-selected-work-gallery]').forEach((gallery) => {
    const track = gallery.querySelector('[data-selected-work-track]')
    const previous = gallery.querySelector('[data-selected-work-prev]')
    const next = gallery.querySelector('[data-selected-work-next]')

    if (!track) {
      return
    }

    const step = () => {
      const slide = track.querySelector('.selected-work-slide')
      if (!slide) {
        return track.clientWidth * 0.8
      }
      const styles = window.getComputedStyle(track)
      const gap = parseFloat(styles.columnGap || styles.gap) || 0
      return slide.getBoundingClientRect().width + gap
    }

    const update = () => {
      if (!previous || !next) {
        return
      }
      previous.disabled = track.scrollLeft <= 1
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1
    }

    const go = (direction) => {
      track.scrollBy({ left: direction * step(), behavior: 'smooth' })
    }

    if (previous) {
      previous.addEventListener('click', () => go(-1))
    }
    if (next) {
      next.addEventListener('click', () => go(1))
    }

    track.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        go(-1)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        go(1)
      }
    })

    let dragging = false
    let startX = 0
    let startScroll = 0

    track.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse') {
        return
      }
      dragging = true
      startX = event.clientX
      startScroll = track.scrollLeft
      track.classList.add('is-dragging')
      track.setPointerCapture(event.pointerId)
    })

    track.addEventListener('pointermove', (event) => {
      if (!dragging) {
        return
      }
      track.scrollLeft = startScroll - (event.clientX - startX)
    })

    const endDrag = (event) => {
      if (!dragging) {
        return
      }
      dragging = false
      track.classList.remove('is-dragging')
      if (track.hasPointerCapture(event.pointerId)) {
        track.releasePointerCapture(event.pointerId)
      }
    }

    track.addEventListener('pointerup', endDrag)
    track.addEventListener('pointercancel', endDrag)

    track.querySelectorAll('img').forEach((image) => {
      image.addEventListener('dragstart', (event) => event.preventDefault())
    })

    track.addEventListener('scroll', () => window.requestAnimationFrame(update), { passive: true })
    window.addEventListener('resize', update)

    const details = gallery.closest('details')
    if (details) {
      details.addEventListener('toggle', () => window.requestAnimationFrame(update))
    }

    update()
  })
})
