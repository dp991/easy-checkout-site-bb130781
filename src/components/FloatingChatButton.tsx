import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Facebook Messenger icon
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 15.06 3.61 17.72 6.07 19.25V22.04L8.74 20.56C9.75 20.83 10.86 20.97 12 20.97C17.5 20.97 22 16.48 22 10.95C22 5.43 17.5 2.04 12 2.04ZM13.18 14.87L10.58 12.14L5.5 14.87L11.08 8.97L13.68 11.7L18.76 8.97L13.18 14.87Z" />
  </svg>
);

// WhatsApp icon
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

interface FloatingChatButtonProps {
  whatsappNumber?: string;
  facebookUrl?: string;
}

export default function FloatingChatButton({
  whatsappNumber = '8613221018869',
  facebookUrl = 'https://m.me/yourpage'
}: FloatingChatButtonProps) {
  const { locale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsApp = () => {
    const message = locale === 'zh' ? '您好，我想咨询产品信息' : 'Hi, I would like to inquire about your products';
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    setIsOpen(false);
  };

  const handleFacebook = () => {
    window.open(facebookUrl, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-6 md:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 mb-2 flex flex-col gap-3"
          >
            {/* WhatsApp Option */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWhatsApp}
              className="flex items-center gap-3 bg-violet-600 hover:bg-violet-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow whitespace-nowrap"
            >
              <WhatsAppIcon />
              <span className="font-medium text-sm">WhatsApp</span>
            </motion.button>

            {/* Facebook Option */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFacebook}
              className="flex items-center gap-3 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow whitespace-nowrap"
            >
              <FacebookIcon />
              <span className="font-medium text-sm">Facebook</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen
          ? 'bg-muted/90 text-foreground shadow-lg'
          : 'text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
          }`}
        style={!isOpen ? { background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)' } : {}}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {!isOpen && (
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-20 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)' }}
        />
      )}
    </div>
  );
}
