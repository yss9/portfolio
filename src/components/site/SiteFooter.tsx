import { profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer id="contact" className="site-footer">
      <div className="site-container">
        <div className="contact-content">
          <div>
            <p className="section-label">
              <span>04 / CONTACT</span>함께 만들 다음 서비스
            </p>
            <h2>
              좋은 서비스는
              <br />
              함께 만들어집니다<span className="text-signal">.</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-8 text-muted">
              프로젝트와 개발 경험에 대해 더 이야기하고 싶다면 편하게
              연락해주세요.
            </p>
          </div>
          <div className="contact-links">
            <a href={`mailto:${profile.email}`} className="contact-email">
              {profile.email}
              <span aria-hidden="true">↗</span>
            </a>
            <div className="flex flex-wrap gap-x-7 gap-y-4">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                className="text-link"
              >
                GitHub ↗
              </a>
              <a
                href="/seo-youngseok-portfolio.pdf"
                download
                className="text-link"
              >
                포트폴리오 PDF ↓
              </a>
              <a href={`tel:${profile.phone}`} className="text-link">
                {profile.phone}
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p className="font-mono">YOUNGSEOK SEO · BACKEND DEVELOPER</p>
          <a href="#main" className="text-link">
            맨 위로 ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
