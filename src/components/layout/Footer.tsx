import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Youtube, Mail } from "lucide-react";
const footerSections = {
  resources: {
    title: "แหล่งเรียนรู้",
    links: [{
      name: "คอร์สทั้งหมด",
      href: "/courses"
    }, {
      name: "เครื่องมือ",
      href: "/tools"
    }, {
      name: "eBooks",
      href: "/ebooks"
    }, {
      name: "บทความ",
      href: "/blog"
    }]
  },
  company: {
    title: "เกี่ยวกับเรา",
    links: [{
      name: "เกี่ยวกับเรา",
      href: "/about"
    }, {
      name: "ติดต่อเรา",
      href: "/contact"
    }, {
      name: "รับปรึกษาโปรเจค",
      href: "/consultation"
    }]
  },
  legal: {
    title: "กฎหมาย",
    links: [{
      name: "ข้อกำหนดการใช้งาน",
      href: "/terms"
    }, {
      name: "นโยบายความเป็นส่วนตัว",
      href: "/privacy"
    }, {
      name: "นโยบายคุกกี้",
      href: "/cookies"
    }, {
      name: "คำถามที่พบบ่อย",
      href: "/faq"
    }]
  }
};
export const Footer = () => {
  return <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">Dev</span>
              </div>
              <span className="text-lg font-bold text-gradient">นัก dev ฝึกหัด</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6">
              แพลตฟอร์มเรียนเขียนโปรแกรมสำหรับนักพัฒนาระดับเริ่มต้น พร้อมคอร์สคุณภาพและเครื่องมือที่จะช่วยให้คุณก้าวสู่ความสำเร็จ
            </p>
            
            {/* Newsletter */}
            
            
          </div>

          {/* Links Sections */}
          {Object.entries(footerSections).map(([key, section]) => <div key={key}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map(link => <li key={link.name}>
                    <Link to={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>)}
              </ul>
            </div>)}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 นัก dev ฝึกหัด. สงวนลิขสิทธิ์.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Button variant="ghost" size="sm">
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Youtube className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>;
};