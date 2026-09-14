// ============ PROJECT DATA ============
// Edit / add entries here. "gallery" can hold as many images as you like —
// just add more paths to the array once you send over the real project photos.
var projectsData = {
  lancome: {
    name: "Lancôme",
    category: "Retail Concept",
    mainImage: "imges/09-project-lancome.jpg",
    gallery: ["imges/09-project-lancome.jpg"],
    client: "Lancôme (Almaza)",
    location: "Almaza City Centre, Cairo",
    scope: "Retail concept design, fabrication & installation",
    materials: "MDF, acrylic, LED lighting, branded vinyl",
    description:
      "Art Vision delivered a full retail concept setup for Lancôme, focused on a clean, premium in-store experience that reflects the brand's identity while guiding customers naturally through the space.",
  },
  nike: {
    name: "Nike",
    category: "Flagship Store",
    mainImage: "imges/nike edited.jfif",
    gallery: ["imges/nike edited.jfif"],
    client: "Nike",
    location: "Cairo",
    scope: "Store interior design, branding & fit-out",
    materials: "Steel framing, acrylic signage, LED strips, branded panels",
    description:
      "A flagship store interior for Nike, combining bold branding elements with a layout designed to highlight products and create an energetic shopping experience.",
  },
  birkenstock: {
    name: "Birkenstock",
    category: "Store Front",
    mainImage: "imges/bricken stock.jfif",
    gallery: ["imges/bricken stock.jfif"],
    client: "Birkenstock",
    location: "Cairo",
    scope: "Store front design & fabrication",
    materials: "Aluminum framing, glass, illuminated signage",
    description:
      "A store front build for Birkenstock designed to stand out on the retail strip while staying true to the brand's minimal, natural aesthetic.",
  },
  guru: {
    name: "GURU",
    category: "Retail Interior",
    mainImage: "imges/guru editd.jfif",
    gallery: ["imges/guru editd.jfif"],
    client: "GURU",
    location: "Cairo",
    scope: "Retail interior fit-out & branding",
    materials: "Wood veneer, acrylic signage, spotlighting",
    description:
      "A retail interior fit-out for GURU, built to create a warm, inviting shopping environment that puts the product range front and center.",
  },
  ysl: {
    name: "Yves Saint Laurent",
    category: "Stand & Gondola",
    mainImage: "imges/13-project-ysl.jpg",
    gallery: ["imges/13-project-ysl.jpg"],
    client: "Yves Saint Laurent",
    location: "Cairo",
    scope: "Stand & gondola design, fabrication & installation",
    materials: "MDF, high-gloss laminate, mirror finishes, LED lighting",
    description:
      "A luxury stand and gondola display for Yves Saint Laurent, designed with premium finishes to match the brand's high-end positioning.",
  },
  loreal: {
    name: "L'Oréal Paris",
    category: "Retail Stand",
    mainImage: "imges/14-project-loreal.jpg",
    gallery: ["imges/14-project-loreal.jpg"],
    client: "L'Oréal Paris",
    location: "Cairo",
    scope: "Retail stand design & fabrication",
    materials: "MDF, acrylic, branded graphics, LED lighting",
    description:
      "A retail stand for L'Oréal Paris designed to showcase the product line with clear branding and an accessible layout for shoppers.",
  },
  kerastase: {
    name: "Kérastase",
    category: "Salon Setup",
    mainImage: "imges/15-project-kerastase.jpg",
    gallery: ["imges/15-project-kerastase.jpg"],
    client: "Kérastase",
    location: "Cairo",
    scope: "Salon interior setup & branding",
    materials: "Wood finishes, acrylic display units, ambient lighting",
    description:
      "A salon setup for Kérastase, blending brand identity with a refined, spa-like atmosphere suited to the professional haircare experience.",
  },
  boss: {
    name: "BOSS",
    category: "Retail Stand",
    mainImage: "imges/16-project-boss.jpg",
    gallery: ["imges/16-project-boss.jpg"],
    client: "BOSS",
    location: "Cairo",
    scope: "Retail stand design, fabrication & installation",
    materials: "Powder-coated steel, matte laminate, LED lighting",
    description:
      "A retail stand for BOSS designed with sharp lines and a dark, premium palette that fits the brand's sophisticated identity.",
  },
};

var projectOrder = ["lancome", "nike", "birkenstock", "guru", "ysl", "loreal", "kerastase", "boss"];

// ============ PAGE LOGIC ============
document.addEventListener("DOMContentLoaded", function () {
  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");
  var resolvedId = projectsData[id] ? id : projectOrder[0];
  var project = projectsData[resolvedId];
  var index = projectOrder.indexOf(resolvedId);

  document.getElementById("pageTitle").textContent = project.name + " — Art Vision";
  document.getElementById("crumbName").textContent = project.name;
  document.getElementById("projTitle").textContent = project.name;
  document.getElementById("projIndex").textContent =
    String(index + 1).padStart(2, "0") + " / " + String(projectOrder.length).padStart(2, "0");
  document.getElementById("projCategory").textContent = project.category;
  document.getElementById("mainImage").src = project.mainImage;
  document.getElementById("mainImage").alt = project.name + " — " + project.category;
  document.getElementById("detClient").textContent = project.client;
  document.getElementById("detLocation").textContent = project.location;
  document.getElementById("detScope").textContent = project.scope;
  document.getElementById("detMaterials").textContent = project.materials;
  document.getElementById("projDescription").textContent = project.description;

  var filmstrip = document.getElementById("filmstrip");
  project.gallery.forEach(function (src) {
    var img = document.createElement("img");
    img.src = src;
    img.alt = project.name;
    filmstrip.appendChild(img);
  });

  var prevId = projectOrder[(index - 1 + projectOrder.length) % projectOrder.length];
  var nextId = projectOrder[(index + 1) % projectOrder.length];
  document.getElementById("prevProjectLink").href = "project.html?id=" + prevId;
  document.getElementById("prevProjectName").textContent = projectsData[prevId].name;
  document.getElementById("nextProjectLink").href = "project.html?id=" + nextId;
  document.getElementById("nextProjectName").textContent = projectsData[nextId].name;

  // Drag-to-scroll on the filmstrip
  var wrap = document.querySelector(".proj-filmstrip-wrap");
  if (wrap) {
    var isDown = false;
    var startX, scrollLeft;
    wrap.addEventListener("mousedown", function (e) {
      isDown = true;
      startX = e.pageX - wrap.offsetLeft;
      scrollLeft = wrap.scrollLeft;
    });
    wrap.addEventListener("mouseleave", function () {
      isDown = false;
    });
    wrap.addEventListener("mouseup", function () {
      isDown = false;
    });
    wrap.addEventListener("mousemove", function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - wrap.offsetLeft;
      wrap.scrollLeft = scrollLeft - (x - startX);
    });
  }

  // Mobile menu toggle
  var burger = document.querySelector(".burger");
  var navLinks = document.querySelector(".nav-links");
  if (burger && navLinks) {
    burger.addEventListener("click", function () {
      navLinks.classList.toggle("mobile-open");
    });
  }

  // Scroll-reveal animation
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in");
    });
  }
});