// Exhibition Website JavaScript Functionality
document.addEventListener("DOMContentLoaded", () => {
  try {
    // Initialize all functionality with error handling
    initializeLoading()
    initializeCustomCursor()
    initializeNavigation()
    initializeHeroSlideshow()
    initializeVenues()
    initializeScrollEffects()
    initializeSmoothScrolling()
    initializeAccessibility()
  } catch (error) {
    console.error("Error initializing website:", error)
    // Fallback: ensure basic functionality works
    document.getElementById("loading-screen").style.display = "none"
  }
})

// Loading Animation
function initializeLoading() {
  const loadingScreen = document.getElementById("loading-screen")

  // Hide loading screen after 2 seconds
  setTimeout(() => {
    loadingScreen.style.opacity = "0"
    setTimeout(() => {
      loadingScreen.style.display = "none"
    }, 500)
  }, 2000)
}

// Custom Cursor (Desktop Only)
function initializeCustomCursor() {
  const cursor = document.getElementById("custom-cursor")

  // Only enable on desktop with hover capability
  if (window.innerWidth >= 768 && window.matchMedia("(hover: hover)").matches) {
    document.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX + "px"
      cursor.style.top = e.clientY + "px"
    })

    // Hide cursor when mouse leaves window
    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0"
    })

    document.addEventListener("mouseenter", () => {
      cursor.style.opacity = "1"
    })

    // Scale cursor on hover over interactive elements
    const interactiveElements = document.querySelectorAll("button, a, .venue-card, .slide")
    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursor.style.transform = "scale(1.5)"
      })

      element.addEventListener("mouseleave", () => {
        cursor.style.transform = "scale(1)"
      })
    })
  }
}

// Dynamic Navigation System
function initializeNavigation() {
  const navigation = document.getElementById("navigation")
  const mobileNavBar = document.getElementById("mobile-nav-bar")
  const desktopNav = document.getElementById("desktop-nav")
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")

  let isScrolled = false
  let isMobile = window.innerWidth <= 768

  // Handle scroll-based navigation transformation
  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const shouldBeScrolled = scrollTop > 100

    if (shouldBeScrolled !== isScrolled) {
      isScrolled = shouldBeScrolled

      if (isMobile) {
        if (isScrolled) {
          // Transform to dropdown on mobile when scrolled
          mobileNavBar.style.display = "none"
          desktopNav.style.display = "block"
          navigation.style.background = "rgba(255, 255, 255, 0.98)"
          navigation.style.backdropFilter = "blur(10px)"
        } else {
          // Show nav bar on mobile when at top
          mobileNavBar.style.display = "flex"
          desktopNav.style.display = "none"
          navigation.style.background = "rgba(255, 255, 255, 0.95)"
        }
      }
    }
  }

  let touchStartY = 0
  let touchEndY = 0

  document.addEventListener("touchstart", (e) => {
    touchStartY = e.changedTouches[0].screenY
  })

  document.addEventListener("touchend", (e) => {
    touchEndY = e.changedTouches[0].screenY
    handleSwipeGesture()
  })

  function handleSwipeGesture() {
    const swipeThreshold = 50
    const diff = touchStartY - touchEndY

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiping up - hide mobile nav faster
        if (isMobile && !isScrolled && window.pageYOffset > 50) {
          handleScroll()
        }
      }
    }
  }

  // Handle window resize
  function handleResize() {
    const wasMobile = isMobile
    isMobile = window.innerWidth <= 768

    if (wasMobile !== isMobile) {
      // Reset navigation state on device type change
      if (isMobile) {
        if (isScrolled) {
          mobileNavBar.style.display = "none"
          desktopNav.style.display = "block"
        } else {
          mobileNavBar.style.display = "flex"
          desktopNav.style.display = "none"
        }
      } else {
        // Desktop view
        mobileNavBar.style.display = "none"
        desktopNav.style.display = "block"
      }
    }
  }

  // Toggle dropdown menu
  navToggle.addEventListener("click", () => {
    const isActive = navMenu.classList.contains("active")
    navMenu.classList.toggle("active")

    // Animate hamburger menu
    const spans = navToggle.querySelectorAll("span")
    if (!isActive) {
      spans[0].style.transform = "rotate(45deg) translate(5px, 5px)"
      spans[1].style.opacity = "0"
      spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)"
    } else {
      spans[0].style.transform = "none"
      spans[1].style.opacity = "1"
      spans[2].style.transform = "none"
    }
  })

  // Close menu when clicking on a link
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active")
      const spans = navToggle.querySelectorAll("span")
      spans[0].style.transform = "none"
      spans[1].style.opacity = "1"
      spans[2].style.transform = "none"
    })
  })

  // Initialize based on current state
  handleResize()
  handleScroll()

  // Add event listeners
  window.addEventListener("scroll", handleScroll)
  window.addEventListener("resize", handleResize)
}

// Hero Section Slideshow
function initializeHeroSlideshow() {
  const slides = document.querySelectorAll(".slide")
  const dots = document.querySelectorAll(".dot")
  const slideshowContainer = document.querySelector(".slideshow-container")
  let currentSlide = 0
  let slideInterval
  let touchStartX = 0
  let touchEndX = 0
  let isPlaying = true

  function showSlide(index) {
    try {
      // Hide all slides
      slides.forEach((slide, i) => {
        slide.classList.remove("active")
        slide.setAttribute("aria-hidden", i !== index)
      })
      dots.forEach((dot, i) => {
        dot.classList.remove("active")
        dot.setAttribute("aria-selected", i === index)
      })

      // Show current slide
      slides[index].classList.add("active")
      slides[index].setAttribute("aria-hidden", "false")
      dots[index].classList.add("active")
      dots[index].setAttribute("aria-selected", "true")

      currentSlide = index
    } catch (error) {
      console.warn("Error showing slide:", error)
    }
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length
    showSlide(next)
  }

  function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length
    showSlide(prev)
  }

  function startSlideshow() {
    if (isPlaying) {
      slideInterval = setInterval(nextSlide, 4000)
    }
  }

  function stopSlideshow() {
    clearInterval(slideInterval)
  }

  // Touch/swipe support
  if (slideshowContainer) {
    slideshowContainer.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX
      stopSlideshow()
    })

    slideshowContainer.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX
      handleSlideSwipe()
      startSlideshow()
    })
  }

  function handleSlideSwipe() {
    const swipeThreshold = 50
    const diff = touchStartX - touchEndX

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.target.closest(".slideshow-container")) {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault()
          prevSlide()
          stopSlideshow()
          startSlideshow()
          break
        case "ArrowRight":
          e.preventDefault()
          nextSlide()
          stopSlideshow()
          startSlideshow()
          break
        case " ":
          e.preventDefault()
          isPlaying = !isPlaying
          if (isPlaying) {
            startSlideshow()
          } else {
            stopSlideshow()
          }
          break
      }
    }
  })

  // Add click handlers to dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index)
      stopSlideshow()
      startSlideshow()
    })
  })

  // Pause slideshow on hover/focus
  if (slideshowContainer) {
    slideshowContainer.addEventListener("mouseenter", stopSlideshow)
    slideshowContainer.addEventListener("mouseleave", startSlideshow)
    slideshowContainer.addEventListener("focusin", stopSlideshow)
    slideshowContainer.addEventListener("focusout", startSlideshow)
  }

  // Start the slideshow
  startSlideshow()
}

// Venues Section Expandable Functionality
function initializeVenues() {
  const venuesToggleBtn = document.getElementById("venues-toggle-btn")
  const additionalVenues = document.querySelectorAll(".additional-venue")
  let showingAll = false

  venuesToggleBtn.addEventListener("click", () => {
    showingAll = !showingAll

    if (showingAll) {
      // Show all venues with animation
      additionalVenues.forEach((venue, index) => {
        setTimeout(() => {
          venue.style.display = "block"
          venue.classList.add("fade-in")
        }, index * 100) // Stagger the animations
      })
      venuesToggleBtn.textContent = "Show Less Venues"
    } else {
      // Hide additional venues
      additionalVenues.forEach((venue) => {
        venue.style.display = "none"
        venue.classList.remove("fade-in")
      })
      venuesToggleBtn.textContent = "Show All Venues"

      // Scroll back to venues section
      document.getElementById("venues").scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
}

// Scroll Effects and Animations
function initializeScrollEffects() {
  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: window.innerWidth <= 768 ? 0.05 : 0.1, // Lower threshold for mobile
    rootMargin: window.innerWidth <= 768 ? "0px 0px -20px 0px" : "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in")
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animateElements = document.querySelectorAll(".venue-card, .section-header, .theme-text, .citizenship-text")
  animateElements.forEach((element) => {
    observer.observe(element)
  })

  if (window.innerWidth > 768) {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset
      const shapes = document.querySelectorAll(".floating-shape")

      shapes.forEach((shape, index) => {
        const speed = 0.5 + index * 0.1
        const yPos = -(scrolled * speed)
        shape.style.transform = `translateY(${yPos}px)`
      })
    })
  }
}

// Smooth Scrolling for Navigation Links
function initializeSmoothScrolling() {
  // Handle explore button
  const exploreBtn = document.getElementById("explore-btn")
  exploreBtn.addEventListener("click", () => {
    document.getElementById("venues").scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  })

  // Handle all navigation links
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = link.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80 // Account for fixed nav
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })
}

// Utility Functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Handle window resize events
window.addEventListener(
  "resize",
  debounce(() => {
    const wasMobile = window.innerWidth <= 768

    // Reinitialize features based on screen size
    if (window.innerWidth < 768) {
      const cursor = document.getElementById("custom-cursor")
      cursor.style.display = "none"

      // Disable parallax on mobile
      const shapes = document.querySelectorAll(".floating-shape")
      shapes.forEach((shape) => {
        shape.style.transform = "none"
      })
    } else if (window.matchMedia("(hover: hover)").matches) {
      const cursor = document.getElementById("custom-cursor")
      cursor.style.display = "block"
    }

    // Reinitialize navigation if device type changed
    if (wasMobile !== window.innerWidth <= 768) {
      initializeNavigation()
    }
  }, 250),
)

// Add loading states and error handling
window.addEventListener("load", () => {
  const images = document.querySelectorAll("img")
  let loadedImages = 0
  let failedImages = 0

  images.forEach((img) => {
    if (img.complete) {
      loadedImages++
    } else {
      img.addEventListener("load", () => {
        loadedImages++
        if (loadedImages + failedImages === images.length) {
          console.log(`All images processed: ${loadedImages} loaded, ${failedImages} failed`)
        }
      })

      img.addEventListener("error", () => {
        console.warn("Failed to load image:", img.src)
        // Provide fallback for failed images
        img.alt = img.alt + " (Image failed to load)"
        img.style.display = "none"
        failedImages++
        if (loadedImages + failedImages === images.length) {
          console.log(`All images processed: ${loadedImages} loaded, ${failedImages} failed`)
        }
      })
    }
  })
})

// Performance optimization: Throttle scroll events
let ticking = false
function updateOnScroll() {
  // Any scroll-based updates go here
  ticking = false
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(updateOnScroll)
    ticking = true
  }
})

// Accessibility Enhancements
function initializeAccessibility() {
  // Update ARIA attributes for slideshow
  const slides = document.querySelectorAll(".slide")
  const dots = document.querySelectorAll(".dot")

  function updateSlideAria(activeIndex) {
    slides.forEach((slide, index) => {
      slide.setAttribute("aria-hidden", index !== activeIndex)
    })

    dots.forEach((dot, index) => {
      dot.setAttribute("aria-selected", index === activeIndex)
    })
  }

  // Update navigation toggle ARIA
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isExpanded = navMenu.classList.contains("active")
      navToggle.setAttribute("aria-expanded", isExpanded)
    })
  }

  // Update venues toggle ARIA
  const venuesToggle = document.getElementById("venues-toggle-btn")
  if (venuesToggle) {
    venuesToggle.addEventListener("click", () => {
      const additionalVenues = document.querySelectorAll(".additional-venue")
      const isExpanded = additionalVenues[0].style.display !== "none"
      venuesToggle.setAttribute("aria-expanded", isExpanded)
    })
  }

  // Keyboard navigation for slideshow
  dots.forEach((dot, index) => {
    dot.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        dot.click()
      }
    })
  })

  // Initial ARIA state
  updateSlideAria(0)
}

if ("performance" in window) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType("navigation")[0]
      if (perfData) {
        console.log("Page load time:", perfData.loadEventEnd - perfData.fetchStart, "ms")
      }
    }, 0)
  })
}
