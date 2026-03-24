import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  HandHeart,
  Users,
  Building2,
  Award,
  Clock,
  FileCheck,
  Star,
  ArrowLeft,
  TrendingUp,
  Heart,
  Calendar,
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: HandHeart,
      title: 'فرص تطوعية متنوعة',
      description: 'اكتشف فرص تطوعية في مجالات متعددة تناسب مهاراتك واهتماماتك',
    },
    {
      icon: Clock,
      title: 'تتبع الساعات',
      description: 'سجل ساعات تطوعك بسهولة واحصل على اعتماد فوري',
    },
    {
      icon: Award,
      title: 'شهادات معتمدة',
      description: 'احصل على شهادات رقمية معتمدة لإنجازاتك التطوعية',
    },
    {
      icon: Star,
      title: 'نظام الأوسمة',
      description: 'اكسب الأوسمة وحقق الإنجازات مع نظام التلعيب المتكامل',
    },
    {
      icon: FileCheck,
      title: 'محفظة رقمية',
      description: 'محفظة رقمية توثق جميع ساعاتك وإنجازاتك التطوعية',
    },
    {
      icon: TrendingUp,
      title: 'تقارير وإحصائيات',
      description: 'تابع تقدمك مع لوحات تحكم تفاعلية وإحصائيات مفصلة',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'متطوع نشط' },
    { value: '500+', label: 'جهة منظمة' },
    { value: '50,000+', label: 'ساعة تطوعية' },
    { value: '2,000+', label: 'فرصة تطوعية' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative container-mobile py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              <span>منصة العمل التطوعي الرائدة</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              اصنع فرقاً مع
              <span className="text-gradient block mt-2">منصة عطاء</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              انضم إلى أكبر مجتمع تطوعي في المملكة. اكتشف الفرص، سجل ساعاتك، 
              واحصل على شهادات معتمدة توثق إنجازاتك.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="lg" className="btn-primary text-lg px-8">
                    لوحة التحكم
                    <ArrowLeft className="w-5 h-5 mr-2" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register/volunteer">
                    <Button size="lg" className="btn-primary text-lg px-8">
                      <Heart className="w-5 h-5 mr-2" />
                      تطوع معنا
                    </Button>
                  </Link>
                  <Link to="/register/organization">
                    <Button size="lg" variant="outline" className="text-lg px-8">
                      <Building2 className="w-5 h-5 mr-2" />
                      شريك معنا
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container-mobile">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-gray-50">
                <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="container-mobile">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              مميزات منصة عطاء
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              كل ما تحتاجه لإدارة العمل التطوعي في مكان واحد
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-ataa card-hover p-6 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Volunteers Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container-mobile">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
                <Users className="w-4 h-4" />
                <span>للمتطوعين</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                ابدأ رحلتك التطوعية اليوم
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                سواء كنت تبحث عن فرصة تطوعية قصيرة أو مشروع طويل الأمد، 
                منصة عطاء توفر لك الوصول إلى آلاف الفرص في مختلف المجالات.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'ابحث عن فرص تناسب مهاراتك واهتماماتك',
                  'سجل ساعاتك التطوعية بسهولة',
                  'احصل على شهادات معتمدة',
                  'ابنِ شبكة علاقات مهنية',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register/volunteer">
                <Button size="lg" className="btn-primary">
                  سجل كمتطوع
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-3xl transform rotate-3" />
              <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">فرصة تطوعية جديدة</h3>
                    <p className="text-gray-500">تدريس الأطفال</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>الرياض، حي النخيل</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <span>10 ساعات تطوعية</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Users className="w-5 h-5" />
                    <span>5 متطوعين مطلوبين</span>
                  </div>
                </div>
                <Button className="w-full mt-6 btn-primary">
                  تقدم الآن
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Organizations Section */}
      <section className="py-16 sm:py-24">
        <div className="container-mobile">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-3xl transform -rotate-3" />
              <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900">إحصائيات سريعة</h3>
                  <span className="text-sm text-gray-500">هذا الشهر</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-emerald-600">24</div>
                    <div className="text-sm text-gray-600">متطوع جديد</div>
                  </div>
                  <div className="bg-teal-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-teal-600">156</div>
                    <div className="text-sm text-gray-600">ساعة تطوعية</div>
                  </div>
                  <div className="bg-cyan-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-cyan-600">8</div>
                    <div className="text-sm text-gray-600">فرص منشورة</div>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-amber-600">12</div>
                    <div className="text-sm text-gray-600">شهادة مصدرة</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-6">
                <Building2 className="w-4 h-4" />
                <span>للجهات المنظمة</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                أتمتة إدارة العمل التطوعي
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                نسهل عليك إدارة المتطوعين وتتبع ساعاتهم وإصدار الشهادات. 
                ركز على مهمتك ودع الباقي لنا.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'أنشئ وانشر فرص تطوعية في دقائق',
                  'إدارة المتطوعين والتطبيقات بسهولة',
                  'تتبع الساعات التطوعية تلقائياً',
                  'إصدار شهادات رقمية معتمدة',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="w-3 h-3 text-teal-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register/organization">
                <Button size="lg" className="btn-secondary">
                  سجل كجهة
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container-mobile">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-500 p-8 sm:p-16 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                جاهز لبدء رحلتك التطوعية؟
              </h2>
              <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
                انضم إلى مجتمع عطاء اليوم وكن جزءاً من التغيير الإيجابي
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register/volunteer">
                  <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 text-lg px-8">
                    <Heart className="w-5 h-5 mr-2" />
                    تطوع معنا
                  </Button>
                </Link>
                <Link to="/register/organization">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8">
                    <Building2 className="w-5 h-5 mr-2" />
                    شريك معنا
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
