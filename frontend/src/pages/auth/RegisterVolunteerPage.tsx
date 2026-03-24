import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin, Heart, ArrowLeft, Check, X } from 'lucide-react';

const SKILL_OPTIONS = [
  'تدريس', 'تصميم', 'برمجة', 'كتابة', 'ترجمة',
  'تصوير', 'تنظيم فعاليات', 'خدمة عملاء', 'قيادة', 'طبخ'
];

const INTEREST_OPTIONS = [
  'تعليم', 'بيئة', 'صحة', 'تقنية', 'ثقافة',
  'رياضة', 'اجتماعي', 'فني', 'إغاثة', 'تنمية'
];

const RegisterVolunteerPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerVolunteer } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    skills: [] as string[],
    interests: [] as string[],
    bio: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return false;
    }
    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await registerVolunteer(registerData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-xl border-0">
      <CardHeader className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold">تسجيل كمتطوع</CardTitle>
        <CardDescription>
          انضم إلى مجتمع المتطوعين واصنع فرقاً
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-emerald-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100'
            }`}>
              1
            </div>
            <span className="text-sm hidden sm:inline">البيانات الأساسية</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-200">
            <div className={`h-full bg-emerald-600 transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} />
          </div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-emerald-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= 2 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100'
            }`}>
              2
            </div>
            <span className="text-sm hidden sm:inline">التفاصيل</span>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 1 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل *</Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="name"
                  placeholder="محمد أحمد"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pr-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pr-10 text-left"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور *</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pr-10 pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الجوال</Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    placeholder="05xxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pr-10 text-left"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">المدينة</Label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="city"
                    placeholder="الرياض"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="pr-10"
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleNext} className="w-full btn-primary">
              التالي
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>المهارات</Label>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      formData.skills.includes(skill)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>مجالات الاهتمام</Label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      formData.interests.includes(interest)
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">نبذة عنك</Label>
              <textarea
                id="bio"
                rows={3}
                placeholder="اخبرنا عن نفسك وخبراتك التطوعية..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                السابق
              </Button>
              <Button
                type="submit"
                className="flex-1 btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'إنشاء الحساب'
                )}
              </Button>
            </div>
          </form>
        )}

        <div className="text-center text-sm">
          <span className="text-gray-600">لديك حساب بالفعل؟ </span>
          <Link to="/login" className="text-emerald-600 hover:underline font-medium">
            سجل دخولك
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterVolunteerPage;
