import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const contacts = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: '#25D366',
      href: 'https://wa.me/8613800138000?text=Hello%2C%20I%20am%20interested%20in%20your%20POS%20products',
    },
    {
      name: 'Telegram',
      icon: Send,
      color: '#0088cc',
      href: 'https://t.me/posstore',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 mb-2"
          >
            <div className="bg-card border border-border rounded-2xl shadow-elevated p-2 space-y-2">
              {contacts.map((contact) => (
                <a
                  key={contact.name}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors group"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${contact.color}20` }}
                  >
                    <contact.icon className="w-5 h-5" style={{ color: contact.color }} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {contact.name === 'WhatsApp' ? t.contact.whatsapp : t.contact.telegram}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-muted text-foreground' 
            : 'bg-gradient-gold text-primary-foreground animate-pulse-glow'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
        )}
      </motion.button>
    </div>
  );
}
