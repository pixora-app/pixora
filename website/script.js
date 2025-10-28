// Create scroll progress indicator
const createScrollProgress = () => {
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", () => {
    const windowHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = scrolled + "%";
  });
};

createScrollProgress();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Enhanced navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  lastScroll = currentScroll;
});

// Animate elements on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe all feature cards, privacy cards, and FAQ items
document
  .querySelectorAll(".feature-card, .privacy-card, .faq-item, .why-point")
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

// Add animation to comparison rows
document.querySelectorAll(".comparison-row").forEach((row, index) => {
  row.style.opacity = "0";
  row.style.transform = "translateX(-20px)";
  row.style.transition = `opacity 0.5s ease ${
    index * 0.1
  }s, transform 0.5s ease ${index * 0.1}s`;
  observer.observe(row);
});

// Download button tracking (you can replace with actual analytics)
document.querySelectorAll(".download-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // Add your analytics tracking here
    console.log(
      "Download button clicked:",
      btn.querySelector(".download-store").textContent
    );
  });
});

// Mobile menu toggle (if you add a hamburger menu later)
const createMobileMenu = () => {
  const navMenu = document.querySelector(".nav-menu");
  const navWrapper = document.querySelector(".nav-wrapper");

  // Create hamburger button
  const hamburger = document.createElement("button");
  hamburger.className = "hamburger";
  hamburger.innerHTML = "☰";
  hamburger.style.cssText = `
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-dark);
    `;

  // Add hamburger to nav
  navWrapper.appendChild(hamburger);

  // Toggle menu on mobile
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  // Show hamburger on mobile
  const mediaQuery = window.matchMedia("(max-width: 768px)");
  const handleMobile = (e) => {
    if (e.matches) {
      hamburger.style.display = "block";
      navMenu.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                flex-direction: column;
                padding: 1rem;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                display: none;
            `;
    } else {
      hamburger.style.display = "none";
      navMenu.style.cssText = "";
    }
  };

  mediaQuery.addListener(handleMobile);
  handleMobile(mediaQuery);
};

// Initialize mobile menu
createMobileMenu();

// Add active class to mobile menu
const style = document.createElement("style");
style.textContent = `
    .nav-menu.active {
        display: flex !important;
    }
`;
document.head.appendChild(style);

// Stats counter animation
const animateCounter = (element, target, duration = 2000) => {
  let current = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
};

// Trigger counter animation when stats are visible
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll(".stat-number");
        statNumbers.forEach((stat) => {
          const text = stat.textContent;
          if (text.includes("%")) {
            const num = parseInt(text);
            animateCounter(stat, num);
            stat.textContent = num + "%";
          }
        });
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const heroStats = document.querySelector(".hero-stats");
if (heroStats) {
  statsObserver.observe(heroStats);
}

// Add parallax effect to hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  const heroContent = document.querySelector(".hero-content");

  if (hero && scrolled < hero.offsetHeight) {
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
      heroContent.style.opacity = 1 - (scrolled / hero.offsetHeight) * 0.5;
    }
  }
});

// Add hover effect to feature cards
document.querySelectorAll(".feature-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// Lazy load images with fade-in effect
const lazyLoadImages = () => {
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add("loaded");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
};

lazyLoadImages();

// Add typing effect to hero title (optional enhancement)
const addTypingEffect = () => {
  const highlight = document.querySelector(".highlight");
  if (highlight) {
    const text = highlight.textContent;
    highlight.textContent = "";
    let i = 0;

    const typeWriter = () => {
      if (i < text.length) {
        highlight.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    };

    setTimeout(typeWriter, 500);
  }
};

// Uncomment to enable typing effect
// addTypingEffect();

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

document.addEventListener("keydown", (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);

  if (konamiCode.join(",") === konamiSequence.join(",")) {
    document.body.style.animation = "rainbow 2s infinite";
    setTimeout(() => {
      document.body.style.animation = "";
    }, 5000);
  }
});

// Add rainbow animation
const rainbowStyle = document.createElement("style");
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

// Performance monitoring
if ("performance" in window) {
  window.addEventListener("load", () => {
    const perfData = performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(
      `🎉 Pixora website loaded in ${pageLoadTime}ms! Your photos, your privacy.`
    );
  });
} else {
  console.log("🎉 Pixora website loaded! Your photos, your privacy.");
}
