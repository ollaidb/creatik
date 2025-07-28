import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Heart, 
  Share2, 
  Bookmark, 
  Download, 
  Copy, 
  Edit, 
  Trash2, 
  Eye, 
  Settings,
  TrendingUp,
  Users,
  Calendar,
  Star,
  MessageCircle,
  Camera,
  Video,
  Music,
  FileText,
  Link,
  Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  action: () => void;
  color?: string;
  isNetworkSpecific?: boolean;
}

interface DynamicSubcategoryMenuProps {
  subcategoryId: string;
  subcategoryName: string;
  selectedNetwork: string;
  onClose: () => void;
}

const DynamicSubcategoryMenu: React.FC<DynamicSubcategoryMenuProps> = ({
  subcategoryId,
  subcategoryName,
  selectedNetwork,
  onClose
}) => {
  // Configuration des menus par réseau
  const getMenuItems = (): MenuItem[] => {
    const baseItems: MenuItem[] = [
      {
        id: 'view',
        label: 'Voir le contenu',
        icon: Eye,
        action: () => console.log('Voir le contenu'),
        color: 'text-blue-600'
      },
      {
        id: 'favorite',
        label: 'Ajouter aux favoris',
        icon: Heart,
        action: () => console.log('Ajouter aux favoris'),
        color: 'text-red-500'
      },
      {
        id: 'share',
        label: 'Partager',
        icon: Share2,
        action: () => console.log('Partager'),
        color: 'text-green-600'
      }
    ];

    // Items spécifiques par réseau
    const networkSpecificItems: Record<string, MenuItem[]> = {
      tiktok: [
        {
          id: 'trending',
          label: 'Tendances',
          icon: TrendingUp,
          action: () => console.log('Tendances TikTok'),
          color: 'text-purple-600',
          isNetworkSpecific: true
        },
        {
          id: 'challenge',
          label: 'Créer un défi',
          icon: Video,
          action: () => console.log('Créer un défi TikTok'),
          color: 'text-pink-600',
          isNetworkSpecific: true
        },
        {
          id: 'duet',
          label: 'Duo',
          icon: Users,
          action: () => console.log('Duo TikTok'),
          color: 'text-blue-600',
          isNetworkSpecific: true
        }
      ],
      instagram: [
        {
          id: 'story',
          label: 'Story',
          icon: Camera,
          action: () => console.log('Créer une story Instagram'),
          color: 'text-pink-600',
          isNetworkSpecific: true
        },
        {
          id: 'reel',
          label: 'Reel',
          icon: Video,
          action: () => console.log('Créer un reel Instagram'),
          color: 'text-purple-600',
          isNetworkSpecific: true
        },
        {
          id: 'post',
          label: 'Post',
          icon: Image,
          action: () => console.log('Créer un post Instagram'),
          color: 'text-orange-600',
          isNetworkSpecific: true
        }
      ],
      youtube: [
        {
          id: 'video',
          label: 'Vidéo',
          icon: Video,
          action: () => console.log('Créer une vidéo YouTube'),
          color: 'text-red-600',
          isNetworkSpecific: true
        },
        {
          id: 'shorts',
          label: 'Shorts',
          icon: TrendingUp,
          action: () => console.log('Créer un short YouTube'),
          color: 'text-red-500',
          isNetworkSpecific: true
        },
        {
          id: 'live',
          label: 'Live',
          icon: Users,
          action: () => console.log('Faire un live YouTube'),
          color: 'text-red-700',
          isNetworkSpecific: true
        }
      ],
      linkedin: [
        {
          id: 'article',
          label: 'Article',
          icon: FileText,
          action: () => console.log('Créer un article LinkedIn'),
          color: 'text-blue-700',
          isNetworkSpecific: true
        },
        {
          id: 'post',
          label: 'Post professionnel',
          icon: MessageCircle,
          action: () => console.log('Créer un post LinkedIn'),
          color: 'text-blue-600',
          isNetworkSpecific: true
        },
        {
          id: 'poll',
          label: 'Sondage',
          icon: TrendingUp,
          action: () => console.log('Créer un sondage LinkedIn'),
          color: 'text-blue-500',
          isNetworkSpecific: true
        }
      ],
      twitter: [
        {
          id: 'tweet',
          label: 'Tweet',
          icon: MessageCircle,
          action: () => console.log('Créer un tweet'),
          color: 'text-blue-400',
          isNetworkSpecific: true
        },
        {
          id: 'thread',
          label: 'Thread',
          icon: FileText,
          action: () => console.log('Créer un thread Twitter'),
          color: 'text-blue-500',
          isNetworkSpecific: true
        },
        {
          id: 'poll',
          label: 'Sondage',
          icon: TrendingUp,
          action: () => console.log('Créer un sondage Twitter'),
          color: 'text-blue-600',
          isNetworkSpecific: true
        }
      ],
      facebook: [
        {
          id: 'post',
          label: 'Post',
          icon: MessageCircle,
          action: () => console.log('Créer un post Facebook'),
          color: 'text-blue-600',
          isNetworkSpecific: true
        },
        {
          id: 'story',
          label: 'Story',
          icon: Camera,
          action: () => console.log('Créer une story Facebook'),
          color: 'text-blue-500',
          isNetworkSpecific: true
        },
        {
          id: 'group',
          label: 'Groupe',
          icon: Users,
          action: () => console.log('Créer un groupe Facebook'),
          color: 'text-blue-700',
          isNetworkSpecific: true
        }
      ],
      twitch: [
        {
          id: 'stream',
          label: 'Stream',
          icon: Video,
          action: () => console.log('Démarrer un stream Twitch'),
          color: 'text-purple-600',
          isNetworkSpecific: true
        },
        {
          id: 'clip',
          label: 'Clip',
          icon: Camera,
          action: () => console.log('Créer un clip Twitch'),
          color: 'text-purple-500',
          isNetworkSpecific: true
        },
        {
          id: 'community',
          label: 'Communauté',
          icon: Users,
          action: () => console.log('Gérer la communauté Twitch'),
          color: 'text-purple-700',
          isNetworkSpecific: true
        }
      ]
    };

    // Combiner les items de base avec les items spécifiques au réseau
    const networkItems = networkSpecificItems[selectedNetwork] || [];
    return [...baseItems, ...networkItems];
  };

  const menuItems = getMenuItems();

  const handleItemClick = (item: MenuItem) => {
    item.action();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {subcategoryName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Actions disponibles pour {selectedNetwork !== 'all' ? selectedNetwork : 'tous les réseaux'}
          </p>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                hover:bg-gray-50 dark:hover:bg-gray-700 group
                ${item.isNetworkSpecific ? 'border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20' : ''}
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${item.color}`}>
                <item.icon size={20} />
              </div>
              <div className="flex-1 text-left">
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.label}
                </span>
                {item.isNetworkSpecific && (
                  <span className="text-xs text-purple-600 dark:text-purple-400 ml-2">
                    Spécifique au réseau
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Fermer
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DynamicSubcategoryMenu; 