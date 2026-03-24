import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Building2, Mail, Lock, Phone, MapPin, Globe, FileText, ArrowLeft } from 'lucide-react';

const ORG_TYPES = [
  { value: 'NON_PROFIT', label: 'جمعية خيرية' },
  { value: 'GOVERNMENT', label: 'جهة حكومية' },
  { value: 'PRIVATE', label: 'قطاع خاص' },
  { value: 'EDUCATIONAL', label: 'مؤسسة تعليمية' },
  { value: 'HEALTHCARE', label: 'مؤسسة صحية' },
  { value: 'OTHER', label: 'أخرى' },
];

const RegisterOrganizationPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerOrganization } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    orgName: '',
    orgType: '',
    licenseNumber: '',
    description: '',
    website: '',
    address: '',
    city: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.orgName || !formData.orgType) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await registerOrganization(registerData);
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
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold">تسجيل كجهة منظمة</CardTitle>
        <CardDescription>
          سجل جهتك وابدأ في إنشاء فرص تطوعية
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contact Person Info */}
          <div className="bg-gray-50 p-4 rounded-xl space-y-4">
            <h3 className="font-semibold text-gray-700">بيانات المسؤول</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">اسم المسؤول *</Label>
              <div className="relative">
                <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
          </div>

          {/* Organization Info */}
          <div className="bg-gray-50 p-4 rounded-xl space-y-4">
            <h3 className="font-semibold text-gray-700">بيانات الجهة</h3>
            
            <div className="space-y-2">
              <Label htmlFor="orgName">اسم الجهة *</Label>
              <Input
                id="orgName"
                placeholder="جمعية الخير للتنمية المجتمعية"
                value={formData.orgName}
                onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgType">نوع الجهة *</Label>
              <Select
                value={formData.orgType}
                onValueChange={(value) => setFormData({ ...formData, orgType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الجهة" />
                </SelectTrigger>
                <SelectContent>
                  {ORG_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber">رقم الترخيص</Label>
              <div className="relative">
                <FileText className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="licenseNumber"
                  placeholder="رقم السجل التجاري أو الترخيص"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  className="pr-10 text-left"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">وصف الجهة</Label>
              <textarea
                id="description"
                rows={3}
                placeholder="نبذة عن الجهة وأهدافها..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">الموقع الإلكتروني</Label>
              <div className="relative">
                <Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="website"
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="pr-10 text-left"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="address"
                    placeholder="العنوان"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="pr-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">المدينة</Label>
                <Input
                  id="city"
                  placeholder="الرياض"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'تسجيل الجهة'
            )}
          </Button>
        </form>

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

export default RegisterOrganizationPage;
