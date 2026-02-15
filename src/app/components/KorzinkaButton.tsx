import { ExternalLink, ShoppingBag, Smartphone } from 'lucide-react';
import { ShoppingListItem } from '../types/kitchen';
import { toast } from 'sonner';

interface KorzinkaButtonProps {
  items: ShoppingListItem[];
}

export function KorzinkaButton({ items }: KorzinkaButtonProps) {
  const activeItems = items.filter((item) => !item.checked);

  const handleOrderClick = () => {
    const listText = activeItems.map((item) => `${item.name} - ${item.quantity || '1x'}`).join('\n');

    navigator.clipboard
      .writeText(listText)
      .then(() => {
        toast.success('Shopping list copied to clipboard!', {
          description: 'Opening Korzinka.uz...',
        });

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
          const korzinkaAppUrl = 'korzinka://';
          const korzinkaWebUrl = 'https://korzinka.uz';
          const appStoreUrl = 'https://apps.apple.com/uz/app/korzinka-uz/id1234567890';
          const playStoreUrl = 'https://play.google.com/store/apps/details?id=uz.korzinka';

          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = korzinkaAppUrl;
          document.body.appendChild(iframe);

          setTimeout(() => {
            document.body.removeChild(iframe);
            const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
            const storeUrl = isIOS ? appStoreUrl : playStoreUrl;

            if (
              confirm(
                "Korzinka Go app not found. Would you like to download it from the app store?",
              )
            ) {
              window.location.href = storeUrl;
            } else {
              window.open(korzinkaWebUrl, '_blank');
            }
          }, 2000);
        } else {
          window.open('https://korzinka.uz', '_blank');
        }
      })
      .catch(() => {
        toast.error('Failed to copy list', {
          description: 'Please try again',
        });
      });
  };

  if (activeItems.length === 0) {
    return null;
  }

  return (
    <button
      onClick={handleOrderClick}
      className="group fixed bottom-6 right-6 z-40 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-[24px] px-6 py-4 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
    >
      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
        <ShoppingBag className="w-5 h-5" />
      </div>
      <div className="text-left hidden sm:block">
        <div className="text-sm">Order from Korzinka</div>
        <div className="text-xs opacity-90">{activeItems.length} items ready</div>
      </div>
      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
        <ExternalLink className="w-4 h-4" />
      </div>
    </button>
  );
}
