// Đổi ngày giờ cưới tại đây. Định dạng: YYYY-MM-DDTHH:mm:ss+07:00
const weddingDate = new Date("2026-08-08T10:00:00+07:00");

const countdownParts = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

function updateCountdown() {
  const now = new Date();
  const distance = weddingDate - now;
  const safeDistance = Math.max(distance, 0);

  const days = Math.floor(safeDistance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((safeDistance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((safeDistance / (1000 * 60)) % 60);
  const seconds = Math.floor((safeDistance / 1000) % 60);

  countdownParts.days.textContent = days;
  countdownParts.hours.textContent = hours;
  countdownParts.minutes.textContent = minutes;
  countdownParts.seconds.textContent = seconds;
}

updateCountdown();
setInterval(updateCountdown, 1000);

const rsvpForm = document.getElementById("rsvpForm");
const formMessage = document.getElementById("formMessage");

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(rsvpForm);
  const guestName = formData.get("guestName").trim();
  const attendance = formData.get("attendance");

  formMessage.textContent = `Cảm ơn ${guestName}! Phản hồi của bạn: ${attendance}.`;
  rsvpForm.reset();
});

const musicButton = document.querySelector(".music-button");
const weddingMusic = document.getElementById("weddingMusic");

musicButton.addEventListener("click", async () => {
  if (!weddingMusic) {
    musicButton.classList.toggle("is-playing");
    return;
  }

  if (weddingMusic.paused) {
    await weddingMusic.play();
    musicButton.classList.add("is-playing");
  } else {
    weddingMusic.pause();
    musicButton.classList.remove("is-playing");
  }
});

// Hiệu ứng xuất hiện mượt theo từng chữ/ảnh khi cuộn thiệp.
const revealSelectors = [
  ".hero-section .eyebrow",
  ".hero-section .wedding-date",
  ".hero-section .hero-names .name-groom",
  ".hero-section .hero-names .name-amp",
  ".hero-section .hero-names .name-bride",
  ".hero-section .hero-photo",
  ".hero-section .ticket-title",
  ".family-grid article",
  ".family-grid img",
  ".couple-section h2",
  ".couple-section h3",
  ".couple-section p",
  ".countdown div",
  ".paper-section h2",
  ".paper-section .formal-text",
  ".paper-section .time-label",
  ".paper-section .venue",
  ".photo-row img",
  ".date-strip",
  ".calendar-card",
  ".map-link",
  ".map-link img",
  ".rsvp-section .double-happiness",
  ".rsvp-form",
  ".story-section .quote",
  ".signature-photo",
  ".signature",
  ".signature-photo img",
  ".album-grid img",
  ".chapter-title",
  ".album-description",
  ".thanks-section img",
  ".thanks-section p"
];

function prepareSmoothReveal() {
  const items = Array.from(document.querySelectorAll(revealSelectors.join(",")));

  items.forEach((item) => {
    if (item.classList.contains("smooth-reveal")) {
      return;
    }

    const section = item.closest("section") || document.body;
    const order = Array.from(section.querySelectorAll(".smooth-reveal")).length;

    item.classList.add("smooth-reveal");
    item.style.setProperty("--smooth-delay", `${Math.min(order * 130, 760)}ms`);

    if (item.matches(".hero-section .name-groom")) {
      item.classList.add("from-right");
      item.style.setProperty("--smooth-delay", "180ms");
    } else if (item.matches(".hero-section .name-bride")) {
      item.classList.add("from-left");
      item.style.setProperty("--smooth-delay", "180ms");
    } else if (item.matches(".hero-section .name-amp")) {
      item.classList.add("from-scale");
      item.style.setProperty("--smooth-delay", "820ms");
    } else if (item.matches(".hero-section .hero-photo")) {
      item.classList.add("from-scale");
      item.style.setProperty("--smooth-delay", "1250ms");
    } else if (item.matches(".photo-row img:nth-child(1), .album-grid img:nth-child(odd):not(.wide), .family-grid article:nth-child(1), .family-grid article:nth-child(1) img")) {
      item.classList.add("from-left");
    } else if (item.matches(".photo-row img:nth-child(3), .album-grid img:nth-child(even):not(.wide), .family-grid article:nth-child(2), .family-grid article:nth-child(2) img")) {
      item.classList.add("from-right");
    } else if (item.matches("img, .ticket-title, .date-strip, .calendar-card, .map-link, .rsvp-form, .signature-photo, .double-happiness")) {
      item.classList.add("from-scale");
    } else {
      item.classList.add("from-bottom");
    }
  });

  return items;
}

const revealItems = prepareSmoothReveal();
document.body.classList.add("effects-ready");

let invitationEffectsStarted = false;
let revealObserver = null;

function startInvitationEffects() {
  if (invitationEffectsStarted) {
    return;
  }

  invitationEffectsStarted = true;

  revealItems.forEach((item) => item.classList.remove("is-revealed"));

  setTimeout(() => {
    function revealVisibleItems() {
      revealItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight * 0.92 && rect.bottom > window.innerHeight * 0.04;
        if (isInView) {
          item.classList.add("is-revealed");
          if (revealObserver) {
            revealObserver.unobserve(item);
          }
        }
      });
    }

    if ("IntersectionObserver" in window) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.04, rootMargin: "0px 0px -3% 0px" }
      );

      revealItems.forEach((item) => revealObserver.observe(item));
      revealVisibleItems();
      window.addEventListener("scroll", revealVisibleItems, { passive: true });
    } else {
      revealItems.forEach((item) => item.classList.add("is-revealed"));
    }
  }, 120);
}

const effectLayer = document.createElement("div");
effectLayer.className = "effect-layer";
document.body.appendChild(effectLayer);

const pieces = ["♥", "♡", "✦"];

function createFallingPiece() {
  const piece = document.createElement("span");
  piece.className = "falling-piece";
  if (Math.random() > 0.58) {
    piece.classList.add("is-red");
  }

  piece.textContent = pieces[Math.floor(Math.random() * pieces.length)];
  piece.style.left = `${Math.random() * 100}%`;
  piece.style.setProperty("--piece-size", `${10 + Math.random() * 12}px`);
  piece.style.setProperty("--fall-duration", `${10 + Math.random() * 8}s`);
  piece.style.setProperty("--drift", `${-30 + Math.random() * 60}px`);

  effectLayer.appendChild(piece);
  piece.addEventListener("animationend", () => piece.remove());
}

setInterval(createFallingPiece, 1700);

// Màn mở thiệp: bấm nút để mở thiệp và tạo hiệu ứng tim bung.
const openingScreen = document.getElementById("openingScreen");
const openInvitationButton = document.getElementById("openInvitation");

function createHeartBurst() {
  for (let index = 0; index < 18; index += 1) {
    const heart = document.createElement("span");
    const angle = (Math.PI * 2 * index) / 18;
    const distance = 70 + Math.random() * 55;

    heart.className = "burst-heart";
    heart.textContent = index % 3 === 0 ? "♡" : "♥";
    heart.style.setProperty("--burst-x", `${Math.cos(angle) * distance}px`);
    heart.style.setProperty("--burst-y", `${Math.sin(angle) * distance}px`);

    document.body.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove());
  }
}

if (openingScreen && openInvitationButton) {
  document.body.classList.add("invitation-locked");

  openInvitationButton.addEventListener("click", async () => {
    createHeartBurst();
    openingScreen.classList.add("is-hidden");
    document.body.classList.remove("invitation-locked");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(startInvitationEffects, 850);

    if (weddingMusic && weddingMusic.paused) {
      try {
        await weddingMusic.play();
        musicButton.classList.add("is-playing");
      } catch (error) {
        musicButton.classList.remove("is-playing");
      }
    }
  });
}

// ĐOẠN XỬ LÝ ĐÓNG MỞ POP-UP HỘP QUÀ
const openGiftBtn = document.getElementById('openGiftBtn');
const closeGiftBtn = document.getElementById('closeGiftBtn');
const modalOverlay = document.getElementById('modalOverlay');
const giftModal = document.getElementById('giftModal');

function toggleGiftModal(isOpen) {
  if (isOpen) {
    giftModal.classList.add('is-active');
    giftModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  } else {
    giftModal.classList.remove('is-active');
    giftModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

if (openGiftBtn && giftModal) {
  openGiftBtn.addEventListener('click', () => toggleGiftModal(true));
  closeGiftBtn.addEventListener('click', () => toggleGiftModal(false));
  modalOverlay.addEventListener('click', () => toggleGiftModal(false));
}
