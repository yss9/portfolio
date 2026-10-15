import { profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer id="contact" className="site-footer">
      <div className="site-container">
        <div className="contact-grid">
          <div>
            <p className="eyebrow">연락</p>
            <h2>
              함께 일할 기회를
              <br />
              <em>기다리고 있습니다.</em>
            </h2>
            <p className="contact-lead">
              프로젝트에서 내린 판단이나 코드에 대해 더 이야기하고 싶다면 편하게
              연락해 주세요.
            </p>
          </div>
          <div>
            <a href={`mailto:${profile.email}`} className="contact-email">
              {profile.email}
              <span aria-hidden="true">↗</span>
            </a>
            <div className="contact-links">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
              >
                GitHub ↗
              </a>
              <a href={`tel:${profile.phone}`}>{profile.phone}</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {profile.name} · Backend Developer
          </p>
          <a href="#main">맨 위로 ↑</a>
        </div>
      </div>
    </footer>
  );
}
