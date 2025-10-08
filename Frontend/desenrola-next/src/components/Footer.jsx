'use client';

import { useRouter } from 'next/navigation';
import styles from './Footer.module.css';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin,
  Heart,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function Footer() {
  const router = useRouter();

  const footerLinks = {
    platform: [
      { label: 'Encontrar Serviços', path: '/servicos' },
      { label: 'Categorias', path: '/servicos' },
      { label: 'Como Funciona', path: '/sobre' },
      { label: 'Tornar-se Prestador', path: '/auth/register' }
    ],
    support: [
      { label: 'Central de Ajuda', path: '/ajuda' },
      { label: 'FAQ', path: '/faq' },
      { label: 'Políticas de Uso', path: '/politicas' },
      { label: 'Contato', path: '/contato' }
    ],
    company: [
      { label: 'Sobre Nós', path: '/sobre' },
      { label: 'Nossa Equipe', path: '/equipe' },
      { label: 'Trabalhe Conosco', path: '/carreiras' },
      { label: 'Blog', path: '/blog' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', url: '#' },
    { icon: Instagram, label: 'Instagram', url: '#' },
    { icon: Twitter, label: 'Twitter', url: '#' },
    { icon: Linkedin, label: 'LinkedIn', url: '#' }
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Main Footer */}
      <div className={styles.footerMain}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            {/* Brand Section */}
            <div className={styles.footerBrand}>
              <div className={styles.brandLogo}>
                <div className={styles.logoIcon}>
                  <span>🔧</span>
                </div>
                <span className={styles.brandName}>ServiçosApp</span>
              </div>
              
              <p className={styles.brandDescription}>
                Conectando você aos melhores profissionais de Picos-PI. 
                Qualidade, confiança e praticidade em um só lugar.
              </p>

              {/* Contact Info */}
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <MapPin size={18} />
                  <span>Picos, Piauí - Brasil</span>
                </div>
                <div className={styles.contactItem}>
                  <Mail size={18} />
                  <a href="mailto:contato@servicosapp.com">contato@servicosapp.com</a>
                </div>
                <div className={styles.contactItem}>
                  <Phone size={18} />
                  <a href="tel:+558999999999">(89) 99999-9999</a>
                </div>
              </div>

              {/* Social Links */}
              <div className={styles.socialLinks}>
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className={styles.footerLinks}>
              <div className={styles.linksColumn}>
                <h3 className={styles.linksTitle}>Plataforma</h3>
                <ul className={styles.linksList}>
                  {footerLinks.platform.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => router.push(link.path)}
                        className={styles.footerLink}
                      >
                        <ChevronRight size={16} />
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.linksColumn}>
                <h3 className={styles.linksTitle}>Suporte</h3>
                <ul className={styles.linksList}>
                  {footerLinks.support.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => router.push(link.path)}
                        className={styles.footerLink}
                      >
                        <ChevronRight size={16} />
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.linksColumn}>
                <h3 className={styles.linksTitle}>Empresa</h3>
                <ul className={styles.linksList}>
                  {footerLinks.company.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => router.push(link.path)}
                        className={styles.footerLink}
                      >
                        <ChevronRight size={16} />
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className={styles.footerNewsletter}>
              <h3 className={styles.newsletterTitle}>
                Fique por dentro
              </h3>
              <p className={styles.newsletterDescription}>
                Receba novidades, dicas e ofertas exclusivas diretamente no seu e-mail.
              </p>
              
              <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
                <div className={styles.newsletterInputWrapper}>
                  <Mail className={styles.newsletterIcon} size={18} />
                  <input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    className={styles.newsletterInput}
                    required
                  />
                </div>
                <button type="submit" className={styles.newsletterButton}>
                  Inscrever-se
                </button>
              </form>

              <p className={styles.newsletterDisclaimer}>
                Ao se inscrever, você concorda com nossa Política de Privacidade.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        <div className={styles.container}>
          <div className={styles.footerBottomContent}>
            <p className={styles.copyright}>
              © {currentYear} ServiçosApp. Todos os direitos reservados.
            </p>
            
            <div className={styles.madeWith}>
              Feito com <Heart size={14} className={styles.heartIcon} /> em Picos-PI
            </div>

            <div className={styles.legalLinks}>
              <button onClick={() => router.push('/privacidade')} className={styles.legalLink}>
                Privacidade
              </button>
              <span className={styles.separator}>•</span>
              <button onClick={() => router.push('/termos')} className={styles.legalLink}>
                Termos de Uso
              </button>
              <span className={styles.separator}>•</span>
              <button onClick={() => router.push('/cookies')} className={styles.legalLink}>
                Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}