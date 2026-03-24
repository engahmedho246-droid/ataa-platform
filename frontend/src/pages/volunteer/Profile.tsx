import React, { useEffect, useState } from 'react';
import { volunteerApi } from '@/services/api';
import { Volunteer } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  Star,
  Briefcase,
  Award,
} from 'lucide-react';

const SKILL_OPTIONS = [
  'تدريس', 'تصميم', 'برمجة', 'كتابة', 'ترجمة',
  'تصوير', 'تنظيم فعاليات', 'خدمة عملاء', 'قيادة', 'طبخ'
];

const INTEREST_OPTIONS = [
  'تعليم', 'بيئة', 'صحة', 'تقنية', 'ثقافة',
  'رياضة', 'اجتماعي', 'فني', 'إغاثة', 'تنمية'
];

const VolunteerProfile: React.FC = () => {
  const [profile, setProfile] = useState<Volunteer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await volunteerApi.getProfile();
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
      const response = await volunteerApi.updateProfile({
        city: formData.city,
        skills: formData.skills,
        interests: formData.interests,
        bio: formData.bio,
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

  const toggleSkill = (skill: string) => {
    setFormData((prev: any) => ({
      ...prev,
      skills: prev.skills?.includes(skill)
        ? prev.skills.filter((s: string) => s !== skill)
        : [...(prev.skills || []), skill]
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev: any) => ({
      ...prev,
      interests: prev.interests?.includes(interest)
        ? prev.interests.filter((i: string) => i !== interest)
        : [...(prev.interests || []), interest]
    }));
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
        <Button onClick={loadProfile} className="mt-4">
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الملف الشخصي</h1>
          <p className="text-gray-500 mt-1">إدارة بياناتك الشخصية</p>
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
                  <User className="w-12 h-12 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{profile.user?.name}</h2>
                  <p className="text-gray-500">متطوع</p>
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

          {/* Bio */}
          <Card className="card-ataa">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                نبذة عني
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="اخبرنا عن نفسك..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
                />
              ) : (
                <p className="text-gray-700">
                  {profile.bio || 'لم تضف نبذة عنك بعد'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="card-ataa">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="w-5 h-5 text-emerald-600" />
                المهارات
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {SKILL_OPTIONS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        formData.skills?.includes(skill)
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.length > 0 ? (
                    profile.skills.map((skill, idx) => (
                      <Badge key={idx} className="bg-emerald-100 text-emerald-700">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500">لم تضف مهارات بعد</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interests */}
          <Card className="card-ataa">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                مجالات الاهتمام
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        formData.interests?.includes(interest)
                          ? 'bg-teal-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.interests?.length > 0 ? (
                    profile.interests.map((interest, idx) => (
                      <Badge key={idx} className="bg-teal-100 text-teal-700">
                        {interest}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500">لم تضف اهتمامات بعد</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card className="card-ataa">
            <CardHeader>
              <CardTitle className="text-lg">الإحصائيات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span className="text-gray-700">إجمالي الساعات</span>
                </div>
                <span className="text-2xl font-bold text-emerald-600">{profile.totalHours}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-teal-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-teal-600" />
                  <span className="text-gray-700">الفرص المكتملة</span>
                </div>
                <span className="text-2xl font-bold text-teal-600">{profile.completedOpportunities}</span>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="card-ataa">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                الموقع
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Input
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="المدينة"
                />
              ) : (
                <p className="text-gray-700">{profile.city || 'لم تحدد المدينة'}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VolunteerProfile;
