(function () {
  var config = window.SITE_CONFIG || {};
  var lineUrl = (config.lineUrl || "").trim();

  // LINE登録ボタン（data-line-link 属性が付いたリンク）にURLを反映
  var links = document.querySelectorAll("[data-line-link]");
  links.forEach(function (link) {
    if (lineUrl) {
      link.href = lineUrl;
      link.target = "_blank";
      link.rel = "noopener";
    } else {
      link.href = "#cta";
      link.addEventListener("click", function (e) {
        e.preventDefault();
        alert("LINE公式アカウントは現在準備中です。公開まで少々お待ちください。");
      });
    }
  });

  // スクロールに合わせてふわっと表示
  var targets = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach(function (el) { observer.observe(el); });
})();
