import { profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer id="contact" className="site-footer">
      <div className="site-container">
        <div className="contact-row">
          <p className="eyebrow">연락</p>
          <a href={`mailto:${profile.email}`} className="contact-email">
            {profile.email}
            <span aria-hidden="true">↗</span>
          </a>
          <div className="contact-links">
            <a href={profile.github} target="_blank" rel="noreferrer noopener">
              GitHub ↗
            </a>
            <a href={`tel:${profile.phone}`}>{profile.phone}</a>
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
