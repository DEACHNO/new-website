const serviceItems = {
  booking: {
    key: "booking",
    tab: "订舱服务",
    title: "订舱服务",
    text: "针对整箱（FCL）及拼箱（LCL）国际运输，我们将根据实际情况，为您推荐所需的货船或航班，并安排最佳货运舱位。",
    mediaClass: "service-media-booking",
    illustration: `
      <div class="service-illustration service-illustration-booking" aria-hidden="true">
        <span class="ship-main"></span>
        <span class="ship-bridge"></span>
        <span class="ship-cargo"></span>
        <span class="far-ship"></span>
      </div>
    `
  },
  customs: {
    key: "customs",
    tab: "清关·查验",
    title: "通关·检查",
    text: "凭借广博深厚的专业学识，以及久经沉淀的丰富经验，全方位助力进出口货物合法依规、高效快捷地通过行政许可流程，确保每一次货物流转都畅行无阻。",
    mediaClass: "service-media-customs",
    illustration: `
      <div class="service-illustration service-illustration-customs" aria-hidden="true">
        <span class="port-blocks"></span>
        <span class="truck-line"></span>
        <span class="worker"></span>
      </div>
    `
  },
  warehouse: {
    key: "warehouse",
    tab: "仓储配送服务",
    title: "仓库·配送",
    text: "我们珍视客户所托，定将其重要货物如期送达，不负所望。同时，对于客户的细致需求与特殊条件，将竭尽所能，全力提升服务品质，不负每一份信任。",
    mediaClass: "service-media-warehouse",
    illustration: `
      <div class="service-illustration service-illustration-warehouse" aria-hidden="true">
        <span class="warehouse-roof"></span>
        <span class="container-door"></span>
        <span class="cargo-pallet cargo-a"></span>
        <span class="cargo-pallet cargo-b"></span>
        <span class="cargo-pallet cargo-c"></span>
      </div>
    `
  }
};

const noticesApiUrl = "/api/notices";
const noticesFallbackUrl = "/data/notices.json";
const siteAssetsApiUrl = "/api/site-assets";
const siteAssetsFallbackUrl = "/data/site-assets.json?v=20260506-split-logo2";
const app = document.querySelector("#app");
const navLinks = Array.from(document.querySelectorAll(".nav a"));

let noticesCache = null;
let siteAssetsCache = null;
let heroCarouselTimer = null;

const defaultNotices = [
  {
    id: "2026-05-shidao-lianyungang-qingdao",
    title: "2026年5月 石岛/连云/青岛港 船期表",
    updatedAt: "2026-04-24 16:26",
    fileName: "2026-05-shidao-lianyungang-qingdao.pdf",
    downloadUrl: "/downloads/2026-05-shidao-lianyungang-qingdao.pdf"
  },
  {
    id: "2026-05-taicang",
    title: "2026年5月 太仓港 船期表",
    updatedAt: "2026-04-24 15:30",
    fileName: "2026-05-taicang.pdf",
    downloadUrl: "/downloads/2026-05-taicang.pdf"
  },
  {
    id: "2026-05-tianjin-dalian",
    title: "2026年5月 天津/大连港 船期表",
    updatedAt: "2026-04-24 15:26",
    fileName: "2026-05-tianjin-dalian.pdf",
    downloadUrl: "/downloads/2026-05-tianjin-dalian.pdf"
  },
  {
    id: "2026-05-ningbo-zhapu",
    title: "2026年5月 宁波/乍浦港 船期表",
    updatedAt: "2026-04-24 09:36",
    fileName: "2026-05-ningbo-zhapu.pdf",
    downloadUrl: "/downloads/2026-05-ningbo-zhapu.pdf"
  },
  {
    id: "2026-05-shanghai",
    title: "2026年5月 上海港 船期表",
    updatedAt: "2026-04-24 09:32",
    fileName: "2026-05-shanghai.pdf",
    downloadUrl: "/downloads/2026-05-shanghai.pdf"
  },
  {
    id: "2026-04-shidao-lianyungang-qingdao",
    title: "2026年4月 石岛/连云/青岛港 船期表",
    updatedAt: "2026-03-27 13:31",
    fileName: "2026-04-shidao-lianyungang-qingdao.pdf",
    downloadUrl: "/downloads/2026-04-shidao-lianyungang-qingdao.pdf"
  },
  {
    id: "2026-04-tianjin-dalian",
    title: "2026年4月 天津/大连港 船期表",
    updatedAt: "2026-03-27 13:29",
    fileName: "2026-04-tianjin-dalian.pdf",
    downloadUrl: "/downloads/2026-04-tianjin-dalian.pdf"
  },
  {
    id: "2026-04-taicang",
    title: "2026年4月 太仓港 船期表",
    updatedAt: "2026-03-27 13:27",
    fileName: "2026-04-taicang.pdf",
    downloadUrl: "/downloads/2026-04-taicang.pdf"
  },
  {
    id: "2026-04-shanghai",
    title: "2026年4月 上海港 船期表",
    updatedAt: "2026-03-27 13:24",
    fileName: "2026-04-shanghai.pdf",
    downloadUrl: "/downloads/2026-04-shanghai.pdf"
  },
  {
    id: "2026-04-ningbo-zhapu",
    title: "2026年4月 宁波/乍浦港 船期表",
    updatedAt: "2026-03-27 13:23",
    fileName: "2026-04-ningbo-zhapu.pdf",
    downloadUrl: "/downloads/2026-04-ningbo-zhapu.pdf"
  }
];

const defaultSiteAssets = {
  brand: {
    headerLogoImageUrl: "/media/logo-black.png?v=20260506-split-logo2",
    footerLogoImageUrl: "/media/logo-white.png?v=20260506-split-logo2"
  },
  homeHero: {
    slides: [
      {
        title: "专业成就可能",
        subtitle: "精准安排每一段航程，连接你的全球交付计划。",
        backgroundImageUrl: "/media/home-hero.jpg"
      },
      {
        title: "专业成就可能",
        subtitle: "海运、空运与仓配协同，提升每一次履约效率。",
        backgroundImageUrl: "/media/service-booking.jpg"
      },
      {
        title: "专业成就可能",
        subtitle: "合规清关与现场查验支持，让货物流转更顺畅。",
        backgroundImageUrl: "/media/service-customs.jpg"
      },
      {
        title: "专业成就可能",
        subtitle: "稳定仓储与配送执行，保障重要货物按期送达。",
        backgroundImageUrl: "/media/service-warehouse.jpg"
      }
    ]
  },
  newsHero: {
    title: "通知与船舶计划",
    subtitle: "我们将提供最新资讯和船期表等相关通知",
    backgroundImageUrl: "/media/news-hero.jpg"
  },
  services: {
    booking: {
      imageUrl: "/media/service-booking.jpg",
      imageAlt: "订舱服务"
    },
    customs: {
      imageUrl: "/media/service-customs.jpg",
      imageAlt: "清关查验"
    },
    warehouse: {
      imageUrl: "/media/service-warehouse.jpg",
      imageAlt: "仓储配送服务"
    }
  }
};

async function loadNotices() {
  if (noticesCache) {
    return noticesCache;
  }

  const payload = await loadJsonWithFallback(noticesApiUrl, noticesFallbackUrl);
  noticesCache = Array.isArray(payload?.items) ? payload.items : defaultNotices;
  return noticesCache;
}

async function loadSiteAssets() {
  if (siteAssetsCache) {
    return siteAssetsCache;
  }

  const payload = await loadJsonWithFallback(siteAssetsApiUrl, siteAssetsFallbackUrl);
  siteAssetsCache = payload || defaultSiteAssets;
  return siteAssetsCache;
}

async function loadJsonWithFallback(primaryUrl, fallbackUrl) {
  try {
    const primaryResponse = await fetch(primaryUrl, {
      headers: { Accept: "application/json" }
    });

    if (primaryResponse.ok) {
      return await primaryResponse.json();
    }
  } catch (error) {
    console.warn(`Failed to fetch ${primaryUrl}`, error);
  }

  try {
    const fallbackResponse = await fetch(fallbackUrl, {
      headers: { Accept: "application/json" }
    });

    if (fallbackResponse.ok) {
      return await fallbackResponse.json();
    }
  } catch (error) {
    console.warn(`Failed to fetch ${fallbackUrl}`, error);
  }

  return null;
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getServiceAsset(siteAssets, serviceKey) {
  return siteAssets?.services?.[serviceKey] || {};
}

function getHomeHeroSlides(siteAssets) {
  const slides = siteAssets?.homeHero?.slides;

  if (Array.isArray(slides) && slides.length) {
    return slides;
  }

  if (siteAssets?.homeHero?.backgroundImageUrl) {
    return [
      {
        title: siteAssets.homeHero.title || "专业成就可能",
        subtitle: siteAssets.homeHero.subtitle || "",
        backgroundImageUrl: siteAssets.homeHero.backgroundImageUrl
      }
    ];
  }

  return defaultSiteAssets.homeHero.slides;
}

function serviceMediaMarkup(service, serviceAsset) {
  if (serviceAsset?.imageUrl) {
    const alt = serviceAsset.imageAlt || service.title;

    return `
      <div id="service-media" class="service-media service-media-image">
        <img class="service-media-photo" src="${escapeHtml(serviceAsset.imageUrl)}" alt="${escapeHtml(alt)}">
      </div>
    `;
  }

  return `
    <div id="service-media" class="service-media ${service.mediaClass}">
      ${service.illustration}
    </div>
  `;
}

function scheduleRows(items, limit = 5) {
  return items
    .slice(0, limit)
    .map(
      (item) => `
        <a class="schedule-row" href="#/news">
          <span>${escapeHtml(item.title)}</span>
          <span>${escapeHtml(item.updatedAt)}</span>
        </a>
      `
    )
    .join("");
}

function newsRows(items) {
  return items
    .map(
      (item) => `
        <div class="news-row">
          <span class="news-title">${escapeHtml(item.title)}</span>
          <span class="news-pdf">
            <a class="pdf-download" href="${escapeHtml(item.downloadUrl)}" download="${escapeHtml(item.fileName || "")}" target="_blank" rel="noopener noreferrer" aria-label="下载 ${escapeHtml(item.title)}">
              <span class="pdf-icon" aria-hidden="true"></span>
            </a>
          </span>
          <span class="news-time">${escapeHtml(item.updatedAt)}</span>
        </div>
      `
    )
    .join("");
}

function homePage(items, siteAssets) {
  const initial = serviceItems.booking;
  const initialAsset = getServiceAsset(siteAssets, initial.key);
  const heroSlides = getHomeHeroSlides(siteAssets);
  const firstSlide = heroSlides[0];
  const newsTitle = siteAssets?.newsHero?.title || "通知与船舶计划";

  return `
    <div class="page-shell">
      <section class="hero">
        <div class="hero-carousel" aria-hidden="true">
          ${heroSlides
            .map(
              (slide, index) => `
                <div
                  class="hero-slide ${index === 0 ? "is-active" : ""}"
                  data-hero-slide="${index}"
                  style="background-image: linear-gradient(90deg, rgba(14, 26, 38, 0.58), rgba(14, 26, 38, 0.14) 40%, rgba(255, 255, 255, 0) 75%), url('${escapeHtml(slide.backgroundImageUrl)}');"
                ></div>
              `
            )
            .join("")}
        </div>
        <div class="hero-overlay"></div>
        <div class="container hero-inner">
          <div class="hero-copy">
            <h1 id="hero-title">${escapeHtml(firstSlide.title || "专业成就可能")}</h1>
            <p id="hero-subtitle">${escapeHtml(firstSlide.subtitle || "")}</p>
          </div>
        </div>
        <div class="hero-indicators" role="tablist" aria-label="首页轮播图">
          ${heroSlides
            .map(
              (slide, index) => `
                <button
                  class="hero-indicator ${index === 0 ? "is-active" : ""}"
                  type="button"
                  data-hero-indicator="${index}"
                  aria-label="切换到第 ${index + 1} 张轮播图"
                ></button>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="section section-services">
        <div class="container">
          <div class="section-heading">
            <h2>服务项目介绍</h2>
          </div>

          <div class="service-tabs" role="tablist" aria-label="服务项目">
            ${Object.entries(serviceItems)
              .map(
                ([key, item], index) => `
                  <button class="service-tab ${index === 0 ? "is-active" : ""}" type="button" data-service="${key}">
                    ${escapeHtml(item.tab)}
                  </button>
                `
              )
              .join("")}
          </div>

          <article class="service-panel">
            ${serviceMediaMarkup(initial, initialAsset)}

            <div class="service-content">
              <h3 id="service-title">${escapeHtml(initial.title)}</h3>
              <p id="service-text">${escapeHtml(initial.text)}</p>
              <a class="text-link" href="#/service">查看更多</a>
            </div>
          </article>
        </div>
      </section>

      <section class="section section-schedule">
        <div class="container">
          <div class="section-heading">
            <h2>${escapeHtml(newsTitle)}</h2>
          </div>

          <div class="schedule-table">
            <div class="schedule-head">
              <span>标题</span>
              <span>更新时间</span>
            </div>
            ${scheduleRows(items, 5)}
          </div>

          <div class="section-more">
            <a class="text-link" href="#/news">查看更多</a>
          </div>
        </div>
      </section>

      <section class="section section-split">
        <div class="container split-grid">
          <article class="about-card">
            <div class="about-card-inner">
              <h2>关于我们</h2>
              <p>上海新悦航运有限公司，已正式获中国交通运输部认可，荣膺无船承运人（NVOCC）资质。凭借专业与实力，公司以“上海新悦”之名广为人知，且作为上海航运交易所(Shanghai shipping Exchange)的正式会员，我司始终专注于海运、空运领域，深耕中国至日本市场，业务规模持续拓展，服务品质稳步提升。展望未来，我们将坚守初心，致力于优化货物运输流程，不断提升运输效率与服务质量，为全球客户打造更卓越、更省心的物流体验。</p>
              <a class="btn btn-light" href="#/about">查看更多</a>
            </div>
          </article>

          <article class="contact-card">
            <h2>联系我们</h2>
            <p>如果您在物流方面有任何疑问，欢迎随时与我们联系。</p>
            <a class="btn btn-primary wide" href="#/contact">查看更多</a>
          </article>
        </div>
      </section>
    </div>
  `;
}

function newsPage(items, siteAssets) {
  const heroTitle = siteAssets?.newsHero?.title || "通知与船舶计划";
  const heroSubtitle = siteAssets?.newsHero?.subtitle || "我们将提供最新资讯和船期表等相关通知";
  const heroStyle = siteAssets?.newsHero?.backgroundImageUrl
    ? ` style="background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.58), rgba(0, 0, 0, 0.18) 45%, rgba(0, 0, 0, 0.05)), url('${escapeHtml(siteAssets.newsHero.backgroundImageUrl)}');"`
    : "";

  return `
    <div class="page-shell">
      <section class="news-hero news-hero-has-asset"${heroStyle}>
        <div class="container news-hero-inner">
          <div class="news-hero-copy">
            <h1>${escapeHtml(heroTitle)}</h1>
            <p>${escapeHtml(heroSubtitle)}</p>
          </div>
        </div>
      </section>

      <section class="news-section">
        <div class="container">
          <div class="news-table">
            <div class="news-head">
              <span>标题</span>
              <span>PDF下载</span>
              <span>更新时间</span>
            </div>
            ${newsRows(items)}
          </div>

          <div class="pagination" aria-label="分页">
            <span>前往</span>
            <span class="page-chip">1</span>
            <span>页</span>
            <span>&lt;</span>
            <span class="page-number is-active">1</span>
            <span class="page-number">2</span>
            <span class="page-number">3</span>
            <span class="page-number">4</span>
          </div>
        </div>
      </section>
    </div>
  `;
}

function placeholderPage(title, text) {
  return `
    <section class="placeholder-page">
      <div class="container">
        <div class="placeholder-card">
          <h1>${escapeHtml(title)}</h1>
          <p>${escapeHtml(text)}</p>
        </div>
      </div>
    </section>
  `;
}

function loadingPage() {
  return `
    <section class="placeholder-page">
      <div class="container">
        <div class="placeholder-card">
          <h1>加载中</h1>
          <p>正在读取网站素材和通知数据...</p>
        </div>
      </div>
    </section>
  `;
}

function errorPage() {
  return `
    <section class="placeholder-page">
      <div class="container">
        <div class="placeholder-card">
          <h1>数据加载失败</h1>
          <p>请检查 <code>/api/notices</code>、<code>/api/site-assets</code> 以及素材文件路径是否已正确部署。</p>
        </div>
      </div>
    </section>
  `;
}

function normalizeRoute(hash) {
  return hash.replace(/^#/, "") || "/home";
}

function setActiveNav(route) {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.route === route);
  });
}

function applyBrandAssets(siteAssets) {
  const headerLogoUrl = siteAssets?.brand?.headerLogoImageUrl || siteAssets?.brand?.logoImageUrl;
  const footerLogoUrl = siteAssets?.brand?.footerLogoImageUrl || headerLogoUrl;
  const brandMarks = document.querySelectorAll(".brand-mark");

  brandMarks.forEach((element) => {
    const brand = element.closest(".brand");
    const logoUrl = brand?.classList.contains("brand-footer") ? footerLogoUrl : headerLogoUrl;
    if (logoUrl) {
      brand?.classList.add("has-logo-image");
      element.classList.add("has-image");
      element.style.backgroundImage = `url('${logoUrl}')`;
    } else {
      brand?.classList.remove("has-logo-image");
      element.classList.remove("has-image");
      element.style.backgroundImage = "";
    }
  });
}

function initHeroCarousel(siteAssets) {
  if (heroCarouselTimer) {
    window.clearInterval(heroCarouselTimer);
    heroCarouselTimer = null;
  }

  const slides = getHomeHeroSlides(siteAssets);
  const slideElements = Array.from(document.querySelectorAll("[data-hero-slide]"));
  const indicatorElements = Array.from(document.querySelectorAll("[data-hero-indicator]"));
  const titleElement = document.querySelector("#hero-title");
  const subtitleElement = document.querySelector("#hero-subtitle");

  if (slides.length <= 1 || !slideElements.length || !indicatorElements.length || !titleElement || !subtitleElement) {
    return;
  }

  let activeIndex = 0;

  const applySlide = (nextIndex) => {
    activeIndex = nextIndex;

    slideElements.forEach((element, index) => {
      element.classList.toggle("is-active", index === nextIndex);
    });

    indicatorElements.forEach((element, index) => {
      element.classList.toggle("is-active", index === nextIndex);
    });

    titleElement.textContent = slides[nextIndex].title || "专业成就可能";
    subtitleElement.textContent = slides[nextIndex].subtitle || "";
  };

  indicatorElements.forEach((element, index) => {
    element.addEventListener("click", () => {
      applySlide(index);
    });
  });

  heroCarouselTimer = window.setInterval(() => {
    const nextIndex = (activeIndex + 1) % slides.length;
    applySlide(nextIndex);
  }, 4000);
}

function bindServiceTabs(siteAssets) {
  const tabs = document.querySelectorAll(".service-tab");
  const title = document.querySelector("#service-title");
  const text = document.querySelector("#service-text");
  const panel = document.querySelector(".service-panel");

  if (!tabs.length || !title || !text || !panel) {
    return;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const next = serviceItems[tab.dataset.service];

      if (!next) {
        return;
      }

      const nextAsset = getServiceAsset(siteAssets, next.key);
      const media = panel.querySelector("#service-media");

      tabs.forEach((item) => item.classList.remove("is-active"));
      tab.classList.add("is-active");
      title.textContent = next.title;
      text.textContent = next.text;

      if (media) {
        media.outerHTML = serviceMediaMarkup(next, nextAsset);
      }
    });
  });
}

async function render() {
  const route = normalizeRoute(location.hash);
  setActiveNav(route);

  if (route === "/service") {
    app.innerHTML = placeholderPage("业务中心", "服务详情页可继续在这里扩展，当前已将首页“服务项目介绍”调整为三部分展示。");
    return;
  }

  if (route === "/tracking") {
    app.innerHTML = placeholderPage("货物追踪", "这里可以接入提单号、箱号或订单号查询功能。");
    return;
  }

  if (route === "/about") {
    app.innerHTML = placeholderPage("关于我们", "公司介绍、资质证书与发展历程可在此继续补充。");
    return;
  }

  if (route === "/workspace") {
    app.innerHTML = placeholderPage("我的工作台", "请先登录后查看工作台。");
    return;
  }

  if (route !== "/home" && route !== "/news") {
    location.replace("#/home");
    return;
  }

  app.innerHTML = loadingPage();

  try {
    const [notices, siteAssets] = await Promise.all([loadNotices(), loadSiteAssets()]);
    applyBrandAssets(siteAssets);
    app.innerHTML = route === "/home" ? homePage(notices, siteAssets) : newsPage(notices, siteAssets);
    bindServiceTabs(siteAssets);
    initHeroCarousel(siteAssets);
    window.scrollTo({ top: 0, behavior: "auto" });
  } catch (error) {
    console.error(error);
    app.innerHTML = errorPage();
  }
}

if (!location.hash) {
  location.replace("#/home");
} else {
  render();
}

window.addEventListener("hashchange", render);
