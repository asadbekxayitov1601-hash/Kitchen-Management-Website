import { Link } from 'react-router-dom';
import { ChefHat, Package, ShoppingCart, Smartphone, TrendingUp, Users, Flame } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { recipes } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { AnimatedNumber } from '../components/AnimatedNumber';

interface HomePageProps {
  dailyCalories: number;
}

export function HomePage({ dailyCalories }: HomePageProps) {
  const { t } = useTranslation();
  const featuredRecipes = recipes.slice(0, 3);

  const features = [
    {
      icon: ChefHat,
      title: t('home.authentic_recipes'),
      description: t('home.authentic_recipes_desc'),
      gradient: 'from-primary to-primary/70',
    },
    {
      icon: Package,
      title: t('home.smart_pantry'),
      description: t('home.smart_pantry_desc'),
      gradient: 'from-secondary to-secondary/70',
    },
    {
      icon: ShoppingCart,
      title: t('home.shopping_lists'),
      description: t('home.shopping_lists_desc'),
      gradient: 'from-accent to-accent/70',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-muted/30 to-accent/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-gray-900 mb-6">
                {t('home.hero_title')}{' '}
                <span className="text-primary">Dasturkhon</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                {t('home.hero_subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/recipes"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[20px] bg-gradient-to-r from-primary to-primary/80 text-white hover:shadow-xl transition-all duration-300"
                >
                  <ChefHat className="w-5 h-5" />
                  {t('home.explore_recipes')}
                </Link>
                {/* sync button removed */}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                {featuredRecipes.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={`rounded-[24px] overflow-hidden shadow-lg ${index === 0 ? 'col-span-2' : ''
                      }`}
                  >
                    <div className="relative aspect-video">
                      <ImageWithFallback
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white text-sm sm:text-base">{recipe.title}</h3>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">
              {t('home.everything_you_need')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('home.everything_subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full p-8 rounded-[28px] bg-white border border-primary/10 hover:shadow-2xl transition-all duration-300">
                  <div className={`w-16 h-16 rounded-[20px] bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <AnimatedNumber
                value={50}
                suffix="+"
                className="text-4xl sm:text-5xl text-white mb-2"
              />
              <div className="text-primary-foreground/80">{t('home.recipes_stat')}</div>
            </div>
            <div>
              <AnimatedNumber
                value={100}
                suffix="+"
                className="text-4xl sm:text-5xl text-white mb-2"
              />
              <div className="text-primary-foreground/80">{t('home.cooks_stat')}</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl text-white mb-2">24/7</div>
              <div className="text-primary-foreground/80">{t('home.companion_stat')}</div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 rounded-[32px] bg-gradient-to-br from-muted to-accent/20 border border-accent/30"
          >
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">
              {t('home.ready_to_transform')}
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('home.ready_subtitle')}
            </p>
            <Link
              to="/recipes"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-[20px] bg-gradient-to-r from-primary to-primary/80 text-white hover:shadow-xl transition-all duration-300"
            >
              {t('home.get_started')}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
