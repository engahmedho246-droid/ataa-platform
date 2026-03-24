import React, { useEffect, useState } from 'react';
import { organizationApi } from '@/services/api';
import { Organization } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Edit2,
  Save,
  X,
  FileText,
  Star,
  CheckCircle,
} from 'lucide-react';

const ORG_TYPES: Record<string, string> = {
  NON_PROFIT: 'جمعية خيرية',
  GOVERNMENT: 'جهة حكومية',
  PRIVATE: 'قطاع خاص',
  EDUCATIONAL: 'مؤسسة تعليمية',
  HEALTHCARE: 'مؤسسة صحية',
  OTHER: 'أخرى',
};

const OrganizationProfile: React.FC = () => {
  const [profile, setProfile] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await organizationApi.getProfile();
      if (response.success && response.data) {
        setProfile(response.data);
        setFormData(response.data);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error('فشل تحميل الملف الشخصي');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await organizationApi.updateProfile({
        name: formData.name,
        description: formData.description,
        website: formData.website,
        address: formData.address,
        city: formData.city,
      });
      if (response.success) {
        setProfile(response.data);
        setIsEditing(false);
        toast.success('تم حفظ التغييرات بنجاح');
      }
    } catch (error) {
      toast.error('فشل حفظ التغييرات');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">فشل تحميل الملف الشخصي</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الملف الشخصي</h1>
          <p className="text-gray-500 mt-1">إدارة بيانات جهتك</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
            <Edit2 className="w-4 h-4" />
            تعديل
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={() => setIsEditing(false)} variant="outline" className="gap-2">
              <X className="w-4 h-4" />
              إلغاء
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="btn-primary gap-2">
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              حفظ
            </Button>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-ataa">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                    {profile.isVerified ? (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        موثق
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700">
                        <Star className="w-3 h-3 mr-1" />
                        قيد التوثيق
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-500">{ORG_TYPES[profile.type] || profile.type}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {profile.user?.email}
                    </span>
                    {profile.user?.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {profile.user.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="card-ataa">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                وصف الجهة
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="نبذة عن الجهة..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
                />
              ) : (
                <p className="text-gray-700">
                  {profile.description || 'لم تضف وصفاً للجهة بعد'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="card-ataa">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-600" />
                معلومات التواصل
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>الموقع الإلكتروني</Label>
                {isEditing ? (
                  <div className="relative">
                    <Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      value={formData.website || ''}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://example.com"
                      className="pr-10 text-left"
                    />
                  </div>
                ) : (
                  <p className="text-gray-700">
                    {profile.website || 'لم يتم إضافة موقع'}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>العنوان</Label>
                  {isEditing ? (
                    <div className="relative">
                      <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="العنوان"
                        className="pr-10"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-700">{profile.address || 'لم يتم إضافة عنوان'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>المدينة</Label>
                  {isEditing ? (
                    <Input
                      value={formData.city || ''}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="المدينة"
                    />
                  ) : (
                    <p className="text-gray-700">{profile.city || 'لم يتم إضافة مدينة'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Verification Status */}
          <Card className="card-ataa">
            <CardHeader>
              <CardTitle className="text-lg">حالة التوثيق</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-xl ${profile.isVerified ? 'bg-green-50' : 'bg-amber-50'}`}>
                <div className="flex items-center gap-3">
                  {profile.isVerified ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="font-bold text-green-700">جهة موثقة</p>
                        <p className="text-sm text-green-600">يمكنك إنشاء الفرص والتطوع</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Star className="w-8 h-8 text-amber-600" />
                      <div>
                        <p className="font-bold text-amber-700">قيد التوثيق</p>
                        <p className="text-sm text-amber-600">سيتم مراجعة بياناتك قريباً</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* License Info */}
          <Card className="card-ataa">
            <CardHeader>
              <CardTitle className="text-lg">معلومات الترخيص</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">رقم الترخيص</p>
                  <p className="font-medium">{profile.licenseNumber || 'غير متوفر'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">نوع الجهة</p>
                  <p className="font-medium">{ORG_TYPES[profile.type] || profile.type}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrganizationProfile;
