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
const loginRequiredLinks = Array.from(document.querySelectorAll("[data-login-required]"));
const loginRequiredModal = document.querySelector("#login-required-modal");
const loginModalCloseButtons = Array.from(document.querySelectorAll("[data-login-modal-close]"));

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
              <a class="text-link" href="#/serviceCenter">查看更多</a>
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

const trackingSearchTypes = [
  {
    value: "bill",
    label: "HBL NO./ MBL NO./业务参考号",
    placeholder: "HBL NO./ MBL NO./业务参考号 可使用逗号分隔，一次最多查询10个"
  },
  {
    value: "container",
    label: "箱号",
    placeholder: "箱号 可使用逗号分隔，一次最多查询10个"
  }
];

const aboutTimelineItems = [
  {
    label: "成立日",
    value: ["2010年1月15日"]
  },
  {
    label: "资本金",
    value: ["1120万元（约2亿2000万日元）"]
  },
  {
    label: "公司代表",
    value: ["代表董事兼总经理", "盛晓东"]
  },
  {
    label: "主要经营内容",
    value: ["货物运输代理业务", "进出口通关代理业务", "进出口代理业务"]
  },
  {
    label: "员工",
    value: ["上海新悦120名"]
  },
  {
    label: "年营业额",
    value: ["2022年度 4,910,162,400日元", "2023年度 3,854,908,200日元", "……"]
  }
];

const aboutBranches = [
  {
    title: "2002年上海总公司",
    imageUrl: "/media/service-booking.jpg"
  },
  {
    title: "2003年宁波分公司",
    imageUrl: "/media/news-hero.jpg"
  },
  {
    title: "2004年江阴分公司",
    imageUrl: "/media/service-customs.jpg"
  },
  {
    title: "2024年青岛分公司",
    imageUrl: "/media/home-hero.jpg"
  },
  {
    title: "2025年深圳分公司",
    imageUrl: "/media/service-brand-bg.jpg"
  }
];

const officeLocations = [
  {
    title: "上海总公司",
    address: "上海市四川北路525号宇宏大厦9F 901室",
    phone: "86-21-6309-3880"
  },
  {
    title: "宁波分公司",
    address: "宁波市鄞州区泰康中路468号奥丽赛豪如大厦2004室",
    phone: "86-574-8386-6991"
  },
  {
    title: "江阴分公司",
    address: "江阴澄中路118号湾湖国际16楼E座",
    phone: "86-510-8640-9795"
  },
  {
    title: "青岛分公司",
    address: "和达新都汇大厦324室",
    phone: "86-532-5823-6699"
  },
  {
    title: "深圳分公司",
    address: "深圳市福田区新华保险大厦2303M房",
    phone: "0755-23601514"
  },
  {
    title: "日本关联公司",
    address: "東洋ファストトランスポート TOYO FAST TRANSPORT CO., LTD.",
    phone: "TOYO FAST TRANSPORT CO., LTD."
  }
];

function trackingPage(siteAssets) {
  const heroImageUrl = siteAssets?.homeHero?.slides?.[0]?.backgroundImageUrl || "/media/home-hero.jpg";
  const initialType = trackingSearchTypes[0];

  return `
    <div class="tracking-page">
      <section class="tracking-hero" style="background-image: linear-gradient(90deg, rgba(3, 18, 30, 0.86), rgba(3, 18, 30, 0.38) 48%, rgba(3, 18, 30, 0.08)), url('${escapeHtml(heroImageUrl)}');">
        <div class="container tracking-hero-inner">
          <div class="tracking-panel">
            <h1>货物跟踪</h1>
            <form class="tracking-form" data-tracking-form>
              <label class="tracking-select-wrap">
                <span class="sr-only">查询类型</span>
                <select data-tracking-type>
                  ${trackingSearchTypes.map((type) => `<option value="${escapeHtml(type.value)}">${escapeHtml(type.label)}</option>`).join("")}
                </select>
              </label>
              <label class="tracking-input-wrap">
                <span class="sr-only">查询编号</span>
                <input data-tracking-input type="text" placeholder="${escapeHtml(initialType.placeholder)}">
              </label>
              <button class="tracking-submit" type="submit">查询</button>
            </form>
            <p class="tracking-message" data-tracking-message aria-live="polite"></p>
          </div>
        </div>
      </section>

      <section class="tracking-empty" aria-label="查询结果区域">
        <div class="container">
          <div class="tracking-result-shell" data-tracking-result>
            <span>请输入提单号、箱号或业务参考号进行查询。</span>
          </div>
        </div>
      </section>
    </div>
  `;
}

function aboutTimelineMarkup() {
  return `
    <div class="about-timeline" aria-label="公司信息">
      ${aboutTimelineItems.map((item) => `
        <div class="about-timeline-row">
          <div class="about-timeline-label">${escapeHtml(item.label)}</div>
          <div class="about-timeline-dot" aria-hidden="true"></div>
          <div class="about-timeline-value">
            ${item.value.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function branchCardsMarkup() {
  return `
    <div class="branch-grid">
      ${aboutBranches.map((branch) => `
        <article class="branch-card" style="background-image: linear-gradient(180deg, rgba(12, 18, 32, 0.08), rgba(12, 18, 32, 0.58)), url('${escapeHtml(branch.imageUrl)}');">
          <h3>${escapeHtml(branch.title)}</h3>
        </article>
      `).join("")}
    </div>
  `;
}

function qualificationMarkup() {
  const qualifications = [
    ["NVOCC certificate", "无船承运业务经营资格"],
    ["Regular member of Shanghai shipping exchange certificate", "上海航运交易所正式会员"],
    ["Air transport sales agency services certificate", "中国民用航空国际运输业务的指定一级代理"],
    ["International Air Transport Association (IATA)", "中国航空运输协会（CATA）资格认可"],
    ["ISO9001认证", "可自行签发提单（BL）"]
  ];

  return `
    <section class="about-section about-qualification" id="about-qualification">
      <div class="container">
        <h2 class="about-section-title">公司资质</h2>
        <div class="qualification-grid">
          <div class="qualification-copy">
            ${qualifications.map(([en, zh]) => `
              <p>
                <span>${escapeHtml(en)}</span>
                <strong>${escapeHtml(zh)}</strong>
              </p>
            `).join("")}
            <p>一级货运代理可直接向船舶公司订舱，提供更优惠的价格并获取更准确的信息。</p>
            <p>上海航运交易所正式会员可提供更顺畅的服务，覆盖知识产权商品等特殊货物的无船承运服务。</p>
          </div>
          <div class="certificate-collage" aria-label="资质证书展示">
            <span class="certificate-paper certificate-paper-a">NVOCC</span>
            <span class="certificate-paper certificate-paper-b">CATA</span>
            <span class="certificate-paper certificate-paper-c">IATA</span>
            <span class="certificate-paper certificate-paper-d">ISO</span>
          </div>
        </div>
      </div>
    </section>
  `;
}

function relatedCompanyMarkup() {
  const flowSteps = ["工厂出货", "办理出口通关手续", "海运、空运运输", "指定仓库交货", "集装箱配送", "日本侧清关与卸载"];
  const features = ["自行签发提单", "可直接向船公司订舱，提供更优惠的价格", "快速通关配送"];
  const performance = ["2024年出口货物量达78000标准箱（TEU）以上", "可从中国所有港口出口", "中国国内客户（发货人）约20000家以上"];
  const japan = ["可应对日本国内所有港口", "日本国内的客户超过7000家", "日本国内合作清关行"];
  const sections = [
    {
      id: "overview",
      label: "公司概要",
      content: `
        <div class="related-overview">
          <h3>公司概要</h3>
          <dl>
            <dt>公司名</dt>
            <dd>株式会社 東洋ファストトランスポート<br>TOYO FAST TRANSPORT CO., LTD.</dd>
            <dt>成立日</dt>
            <dd>2010年1月15日</dd>
            <dt>资本金</dt>
            <dd>1000万日元</dd>
            <dt>公司法人</dt>
            <dd>代表董事兼总经理 盛晓亮</dd>
            <dt>主要经营内容</dt>
            <dd>货物运输 / 进出口通关代理业务 / 进出口代理业务</dd>
          </dl>
        </div>
      `
    },
    {
      id: "flow",
      label: "进出口流程图",
      content: `
        <div class="related-flow">
          <p>例如：中国出口到日本的情况</p>
          <strong>从中国工厂出货到日本仓库纳品，都请放心交给我们！</strong>
          <div class="flow-grid">
            ${flowSteps.map((step) => `
              <div class="flow-step">
                <span aria-hidden="true"></span>
                <p>${escapeHtml(step)}</p>
              </div>
            `).join("")}
          </div>
        </div>
      `
    },
    {
      id: "features",
      label: "公司特色",
      content: `
        <div class="related-text-panel">
          <h3>公司特色</h3>
          ${features.map((item, index) => `<p>${index + 1}. ${escapeHtml(item)}</p>`).join("")}
        </div>
      `
    },
    {
      id: "performance",
      label: "货物处理量的业绩表现",
      content: `
        <div class="related-performance">
          <div class="related-text-panel">
            <h3>货物处理量的业绩表现</h3>
            ${performance.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
          </div>
          <div class="china-route-map" aria-label="中国港口覆盖示意图">
            <span>天津</span>
            <span>大连</span>
            <span>青岛</span>
            <span>上海</span>
            <span>宁波·舟山</span>
            <span>厦门</span>
            <span>广州</span>
            <span>深圳</span>
          </div>
        </div>
      `
    },
    {
      id: "japan",
      label: "日本侧业绩",
      content: `
        <div class="related-performance">
          <div class="related-text-panel">
            <h3>日本侧业绩</h3>
            ${japan.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
          </div>
          <div class="japan-route-map" aria-label="日本港口覆盖示意图">
            <span>北海道</span>
            <span>东京</span>
            <span>名古屋</span>
            <span>大阪</span>
            <span>福冈</span>
          </div>
        </div>
      `
    }
  ];

  return `
    <section class="about-section related-company" id="about-related">
      <div class="container">
        <h2 class="about-section-title related-title">关联公司 TOYO FAST TRANSPORT CO.,LTD.</h2>
        <div class="related-layout">
          <div class="related-menu" aria-label="关联公司内容">
            ${sections.map((section, index) => `
              <button class="${index === 0 ? "is-active" : ""}" type="button" data-related-tab="${escapeHtml(section.id)}">${escapeHtml(section.label)}</button>
            `).join("")}
          </div>
          <div class="related-panel">
            ${sections.map((section, index) => `
              <article class="related-panel-item ${index === 0 ? "is-active" : ""}" data-related-panel="${escapeHtml(section.id)}">
                ${section.content}
              </article>
            `).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function officeMapMarkup() {
  return `
    <section class="about-section about-contact-section" id="about-contact">
      <div class="container">
        <h2 class="about-section-title">联系我们</h2>
        <div class="office-layout">
          <div class="office-list">
            ${officeLocations.map((office, index) => `
              <article class="${index === 0 ? "is-active" : ""}">
                <h3>${escapeHtml(office.title)}</h3>
                <p>地址：${escapeHtml(office.address)}</p>
                <p>电话：${escapeHtml(office.phone)}</p>
              </article>
            `).join("")}
          </div>
          <div class="office-map" aria-label="公司网点示意图">
            <span class="map-line map-line-a"></span>
            <span class="map-line map-line-b"></span>
            <span class="map-pin map-pin-shanghai">上海总公司</span>
            <span class="map-pin map-pin-ningbo">宁波</span>
            <span class="map-pin map-pin-jiangyin">江阴</span>
            <span class="map-pin map-pin-qingdao">青岛</span>
            <span class="map-pin map-pin-shenzhen">深圳</span>
          </div>
        </div>
      </div>
    </section>
  `;
}

function aboutPage(siteAssets) {
  const heroImageUrl = siteAssets?.aboutHero?.backgroundImageUrl || "/media/service-brand-bg.jpg";

  return `
    <div class="about-page" id="about-top">
      <section class="about-hero-page" style="background-image: linear-gradient(90deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.32)), url('${escapeHtml(heroImageUrl)}');"></section>

      <nav class="about-tabs" aria-label="关于我们页面导航">
        <a class="is-active" href="#/aboutUs" data-about-jump="about-intro">新悦简介</a>
        <a href="#/aboutUs" data-about-jump="about-related">关联公司</a>
        <a href="#/contact-us" data-about-jump="about-contact">联系我们</a>
      </nav>

      <section class="about-section about-intro-section" id="about-intro">
        <div class="container">
          <h1 class="about-section-title">新悦简介</h1>
          <div class="about-intro-grid">
            <img src="/media/service-booking.jpg" alt="新悦航运海运服务">
            <div class="about-intro-copy">
              <p>上海新悦航运有限公司是一家获中国交通运输部正式认可，具备无船承运人（NVOCC）资质的货运代理公司，同时也是上海航运交易所的正式会员。此外，公司还获得中国航空运输协会（CATA）认可，成为中国民用航空国际运输业务的指定代理。</p>
              <p>公司在中国国内港口以及全球各主要港口间构建了紧密的网络，为客户提供优质、高效且安全的物流服务。</p>
            </div>
          </div>
          ${aboutTimelineMarkup()}
        </div>
      </section>

      <section class="about-section branch-section">
        <div class="container">
          <h2 class="about-section-title">联系我们</h2>
          ${branchCardsMarkup()}
        </div>
      </section>

      <section class="about-section strength-section">
        <div class="container">
          <h2 class="about-section-title">海运方面的实力</h2>
          <div class="strength-row">
            <img src="/media/service-customs.jpg" alt="海运代理服务">
            <div>
              <p>我司除了提供整箱和拼箱的海运进出口货物的国际运输代理业务的一条龙服务以外，还可安排上门提货和将货物按时送达客户所指定地点等服务。</p>
              <p>我司拥有日本、美洲、欧洲、澳洲等多条优势航线，并与多家船公司保持良好的合作关系。</p>
            </div>
          </div>
        </div>
      </section>

      <section class="about-section strength-section">
        <div class="container">
          <h2 class="about-section-title">空运方面的实力</h2>
          <div class="strength-row is-reversed">
            <div>
              <p>公司与多家航空公司签订长期协议，在舱位和运费上拥有优势，早上9点前交货可安排当天班机，解决客户的紧急需求。</p>
            </div>
            <img src="/media/service-brand-bg.jpg" alt="空运服务">
          </div>
        </div>
      </section>

      ${qualificationMarkup()}
      ${relatedCompanyMarkup()}
      ${officeMapMarkup()}
    </div>
  `;
}

function bindTrackingPage() {
  const form = document.querySelector("[data-tracking-form]");
  const typeSelect = document.querySelector("[data-tracking-type]");
  const input = document.querySelector("[data-tracking-input]");
  const message = document.querySelector("[data-tracking-message]");
  const result = document.querySelector("[data-tracking-result]");

  if (!form || !typeSelect || !input || !message || !result) {
    return;
  }

  typeSelect.addEventListener("change", () => {
    const selected = trackingSearchTypes.find((item) => item.value === typeSelect.value) || trackingSearchTypes[0];
    input.placeholder = selected.placeholder;
    message.textContent = "";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim();

    if (!query) {
      message.textContent = "请输入查询编号。";
      result.innerHTML = "<span>请输入提单号、箱号或业务参考号进行查询。</span>";
      return;
    }

    message.textContent = "";
    result.innerHTML = `
      <div class="tracking-result-card">
        <strong>${escapeHtml(query)}</strong>
        <span>追踪查询功能正在接入中，请联系客户服务获取最新状态。</span>
      </div>
    `;
  });
}

function bindRelatedCompanyTabs() {
  const buttons = Array.from(document.querySelectorAll("[data-related-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-related-panel]"));

  if (!buttons.length || !panels.length) {
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.relatedTab;

      buttons.forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });

      panels.forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.relatedPanel === target);
      });
    });
  });
}

function bindAboutPage(initialSection = "about-intro") {
  const tabs = Array.from(document.querySelectorAll("[data-about-jump]"));
  bindRelatedCompanyTabs();

  const scrollToSection = (sectionId) => {
    const section = document.querySelector(`#${sectionId}`);

    if (!section) {
      return;
    }

    tabs.forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.aboutJump === sectionId);
    });

    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      scrollToSection(tab.dataset.aboutJump);
    });
  });

  if (initialSection !== "about-intro") {
    window.requestAnimationFrame(() => scrollToSection(initialSection));
  }
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

function serviceDetailPage(type = "1") {
  const details = {
    "1": {
      title: "订舱服务详情",
      sectionTitle: "关于订舱",
      heroImageUrl: "/media/service-customs.jpg",
      primaryImageUrl: "/media/service-booking.jpg",
      secondaryImageUrl: "/media/service-customs.jpg",
      primaryAlt: "航空货物订舱服务",
      secondaryAlt: "国际海运订舱服务",
      intro: [
        "本公司专为有整箱（FCL）及拼箱（LCL）等货物国际运输需求的客户，以最优方式妥善安排船运或航空舱位，确保货物在指定日期前送达目的地。",
        "公司的专业团队成员，皆秉持着诚挚热忱的服务理念，深度融入客户视角，耐心倾听您的每一项需求与期望，凭借深厚的物流知识与行业经验，为客户量身定制最佳运输方案。在费用方面，我们坚守透明公正的原则，提供快速、精准的报价服务，报价清晰透明，绝无任何隐藏的额外费用，致力于为客户打造安心、省心的运输体验。"
      ],
      followup: [
        "作为全球化企业，我们凭借强大实力，承接各地港口货物运输，包括偏港，都能为您妥善处理。",
        "公司持有一级货运代理资质，具备直接与船运公司谈判的资格，能够为您提供极具竞争力的最低海运价格。",
        "倘若您有任何疑问或需求，请随时联系我们。即使您是初次涉足海外货物进出口业务，也能毫无负担地享受优质物流服务，这正是我司优势所在。如您正在为国际货物运输探寻最佳方案，欢迎即刻与我们联系"
      ]
    },
    "2": {
      title: "清关·查验详情",
      sectionTitle: "清关·查验",
      heroImageUrl: "/media/service-customs.jpg",
      primaryImageUrl: "/media/service-brand-bg.jpg",
      secondaryImageUrl: "/media/service-booking.jpg",
      primaryAlt: "现场查验与物流协调",
      secondaryAlt: "通关业务现场协作",
      primaryClass: "service-detail-focus-brand-top",
      secondaryClass: "service-detail-focus-bottom",
      intro: [
        "为助力客户顺畅开展进出口贸易，我们提供申报所需文件制作、关税缴纳、审查、海关查验见证等代理服务。"
      ],
      followup: [
        "本公司驻有经验丰富的报关员，他们积极与海关协调，精准完成各类繁琐文件的准备、申报、精确计算并支付税金，仔细确认国际物流相关法令，全方位助力客户，达成其期待的高效畅达的国际物流运作。"
      ]
    },
    "3": {
      title: "仓库·配送服务详情",
      sectionTitle: "仓库·配送",
      heroImageUrl: "/media/service-customs.jpg",
      heroPosition: "center bottom",
      primaryImageUrl: "/media/service-customs.jpg",
      secondaryImageUrl: "/media/service-brand-bg.jpg",
      primaryAlt: "仓储配送货物装载",
      secondaryAlt: "配送车辆与现场人员",
      primaryClass: "service-detail-focus-warehouse",
      secondaryClass: "service-detail-focus-brand-top",
      intro: [
        "我们将负责把国际货物安全、稳妥地送达您指定的交货地点。您可依据货物尺寸，随心选用从小型货车到大型拖车等各类车辆。"
      ],
      followup: [
        "除常规的包装货物运输服务外，不管是散装货物（散装）、冷冻货物、危险货物，还是运输难度极大的特殊货物运输需求，都请放心交给本公司。"
      ]
    }
  };
  const detail = details[type] || details["1"];
  const primaryClass = detail.primaryClass || "service-detail-focus-bottom";
  const secondaryClass = detail.secondaryClass || "service-detail-focus-top";
  const heroPosition = detail.heroPosition || "center top";

  return `
    <div class="page-shell service-detail-page">
      <section class="service-detail-hero" style="background-position: ${escapeHtml(heroPosition)}; background-image: linear-gradient(90deg, rgba(10, 18, 30, 0.3), rgba(10, 18, 30, 0.04)), url('${escapeHtml(detail.heroImageUrl)}');">
        <div class="container service-detail-hero-inner">
          <h1>${escapeHtml(detail.title)}</h1>
        </div>
      </section>

      <section class="service-detail-section">
        <div class="container service-detail-inner">
          <h2>${escapeHtml(detail.sectionTitle)}</h2>

          <article class="service-detail-block">
            <div class="service-detail-media">
              <img class="${escapeHtml(primaryClass)}" src="${escapeHtml(detail.primaryImageUrl)}" alt="${escapeHtml(detail.primaryAlt)}">
            </div>
            <div class="service-detail-copy">
              ${detail.intro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
            </div>
          </article>

          <article class="service-detail-block is-reversed">
            <div class="service-detail-copy">
              ${detail.followup.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
            </div>
            <div class="service-detail-media">
              <img class="${escapeHtml(secondaryClass)}" src="${escapeHtml(detail.secondaryImageUrl)}" alt="${escapeHtml(detail.secondaryAlt)}">
            </div>
          </article>
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

function serviceCenterPage(siteAssets) {
  const serviceCenterItems = [
    {
      key: "booking",
      label: "ブッキング",
      heading: "国际货物的订舱服务",
      description: serviceItems.booking.text,
      imageUrl: "/media/service-customs.jpg",
      imageAlt: "国际货物订舱服务",
      imageClass: "service-center-focus-top"
    },
    {
      key: "customs",
      label: "通関・検査",
      heading: "进出口的通关业务",
      description: serviceItems.customs.text,
      imageUrl: "/media/service-booking.jpg",
      imageAlt: "进出口通关业务",
      imageClass: "service-center-focus-bottom"
    },
    {
      key: "warehouse",
      label: "仓储配送服务",
      heading: "配送服务",
      description: serviceItems.warehouse.text,
      imageUrl: "/media/service-warehouse.jpg",
      imageAlt: "仓储配送服务",
      imageClass: "service-center-focus-bottom-left"
    }
  ];
  const heroImageUrl = siteAssets?.homeHero?.slides?.[0]?.backgroundImageUrl || "/media/home-hero.jpg";

  return `
    <div class="page-shell service-center-page">
      <section class="service-center-hero" style="background-image: linear-gradient(90deg, rgba(11, 17, 25, 0.16), rgba(11, 17, 25, 0.08)), url('${escapeHtml(heroImageUrl)}');">
        <div class="container service-center-hero-inner">
          <h1>全力打造理想物流方案的货运先锋</h1>
        </div>
      </section>

      <section class="service-center-list">
        <div class="container service-center-list-inner">
          ${serviceCenterItems
            .map((item, index) => {
              const asset = getServiceAsset(siteAssets, item.key);
              const imageUrl = item.imageUrl || asset.imageUrl || "";
              const alt = item.imageAlt || asset.imageAlt || item.label;
              const imageClass = item.imageClass ? ` class="${escapeHtml(item.imageClass)}"` : "";

              return `
                <article class="service-center-item ${index % 2 === 1 ? "is-reversed" : ""}">
                  <div class="service-center-label">${escapeHtml(item.label)}</div>
                  <div class="service-center-media">
                    ${imageUrl ? `<img${imageClass} src="${escapeHtml(imageUrl)}" alt="${escapeHtml(alt)}">` : serviceMediaMarkup(serviceItems[item.key], asset)}
                  </div>
                  <div class="service-center-copy">
                    <h2>${escapeHtml(item.heading)}</h2>
                    <p>${escapeHtml(item.description)}</p>
                    <a class="text-link" href="#/serviceDetail?type=${index + 1}">查看详情</a>
                  </div>
                </article>
              `;
            })
            .join("")}
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

function normalizeRoute(hash) {
  return hash.replace(/^#/, "") || "/home";
}

function routePath(route) {
  return route.split("?")[0];
}

function setActiveNav(route) {
  const path = routePath(route);
  let activeRoute = path;

  if (path === "/service" || path === "/serviceDetail") {
    activeRoute = "/serviceCenter";
  }

  if (path === "/tracking") {
    activeRoute = "/orderTracking";
  }

  if (path === "/about" || path === "/contact" || path === "/contact-us") {
    activeRoute = "/aboutUs";
  }

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.route === activeRoute);
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

function stopHeroCarousel() {
  if (heroCarouselTimer) {
    window.clearInterval(heroCarouselTimer);
    heroCarouselTimer = null;
  }
}

function initHeroCarousel(siteAssets) {
  stopHeroCarousel();

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

function openLoginRequiredModal() {
  if (!loginRequiredModal) {
    return;
  }

  loginRequiredModal.classList.add("is-open");
  loginRequiredModal.setAttribute("aria-hidden", "false");
}

function closeLoginRequiredModal() {
  if (!loginRequiredModal) {
    return;
  }

  loginRequiredModal.classList.remove("is-open");
  loginRequiredModal.setAttribute("aria-hidden", "true");
}

function bindLoginRequiredModal() {
  loginRequiredLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openLoginRequiredModal();
    });
  });

  loginModalCloseButtons.forEach((button) => {
    button.addEventListener("click", closeLoginRequiredModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLoginRequiredModal();
    }
  });
}

async function render() {
  const route = normalizeRoute(location.hash);
  const path = routePath(route);
  setActiveNav(route);
  stopHeroCarousel();

  if (path === "/service" || path === "/serviceCenter") {
    app.innerHTML = loadingPage();

    try {
      const siteAssets = await loadSiteAssets();
      applyBrandAssets(siteAssets);
      app.innerHTML = serviceCenterPage(siteAssets);
      window.scrollTo({ top: 0, behavior: "auto" });
    } catch (error) {
      console.error(error);
      app.innerHTML = errorPage();
    }

    return;
  }

  if (path === "/serviceDetail") {
    app.innerHTML = loadingPage();

    try {
      const siteAssets = await loadSiteAssets();
      const params = new URLSearchParams(route.split("?")[1] || "");
      applyBrandAssets(siteAssets);
      app.innerHTML = serviceDetailPage(params.get("type") || "1");
      window.scrollTo({ top: 0, behavior: "auto" });
    } catch (error) {
      console.error(error);
      app.innerHTML = errorPage();
    }

    return;
  }

  if (path === "/tracking" || path === "/orderTracking") {
    app.innerHTML = loadingPage();

    try {
      const siteAssets = await loadSiteAssets();
      applyBrandAssets(siteAssets);
      app.innerHTML = trackingPage(siteAssets);
      bindTrackingPage();
      window.scrollTo({ top: 0, behavior: "auto" });
    } catch (error) {
      console.error(error);
      app.innerHTML = errorPage();
    }

    return;
  }

  if (path === "/about" || path === "/aboutUs" || path === "/contact" || path === "/contact-us") {
    app.innerHTML = loadingPage();

    try {
      const siteAssets = await loadSiteAssets();
      const initialSection = path === "/contact" || path === "/contact-us" ? "about-contact" : "about-intro";
      applyBrandAssets(siteAssets);
      app.innerHTML = aboutPage(siteAssets);
      bindAboutPage(initialSection);

      if (initialSection === "about-intro") {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    } catch (error) {
      console.error(error);
      app.innerHTML = errorPage();
    }

    return;
  }

  if (path !== "/home" && path !== "/news") {
    location.replace("#/home");
    return;
  }

  app.innerHTML = loadingPage();

  try {
    const [notices, siteAssets] = await Promise.all([loadNotices(), loadSiteAssets()]);
    applyBrandAssets(siteAssets);
    app.innerHTML = path === "/home" ? homePage(notices, siteAssets) : newsPage(notices, siteAssets);
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

bindLoginRequiredModal();
window.addEventListener("hashchange", render);
