import { BookOpen, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-primary-dark text-white/80">
      <div className="container-custom py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg text-white mb-3">
            <BookOpen className="w-5 h-5 text-accent" />
            Nurul-Ardhi Hub
          </div>
          <p className="text-sm leading-relaxed">
            Your digital portal for Qur'anic learning, accreditation, and community land endowment in Nigeria.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/madrasatu-tahfiz" className="hover:text-accent transition-colors">Madrasatu Tahfiz</a></li>
            <li><a href="/talim-classes" className="hover:text-accent transition-colors">Talim Classes</a></li>
            <li><a href="/itqa-registration" className="hover:text-accent transition-colors">ITQA Registration</a></li>
            <li><a href="/waqf-e-ardhi" className="hover:text-accent transition-colors">Waqf E Ardhi</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent" />
              info@nurulardhi.org
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-accent" />
              +234 800 000 0000
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" />
              Kano, Nigeria
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-custom py-4 text-center text-xs text-white/50">
          &copy; {new Date().getFullYear()} National Ta'lim-ul-Qur'an & Waqf-e-Ardhi. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
