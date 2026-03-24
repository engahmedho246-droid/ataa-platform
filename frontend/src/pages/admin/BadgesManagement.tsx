import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/api';
import { Badge as BadgeType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Star,
  Target,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const CRITERIA_TYPES: Record<string, string> = {
  TOTAL_HOURS: 'إجمالي الساعات',
  COMPLETED_OPPORTUNITIES: 'الفرص المكتملة',
  SPECIFIC_CATEGORY: 'تصنيف محدد',
  STREAK_DAYS: 'أيام متتالية',
  SPECIAL_ACHIEVEMENT: 'إنجاز خاص',
};

const BadgesManagement: React.FC = () => {
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<BadgeType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🌟',
    criteriaType: 'TOTAL_HOURS',
    threshold: 10,
    color: '#10B981',
  });

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getBadges();
      if (response.success && response.data) {
        setBadges(response.data);
      }
    } catch (error) {
      console.error('Failed to load badges:', error);
      toast.error('فشل تحميل الأوسمة');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBadge) {
        const response = await adminApi.updateBadge(editingBadge.id, formData);
        if (response.success) {
          toast.success('تم تحديث الوسام بنجاح');
        }
      } else {
        const response = await adminApi.createBadge(formData);
        if (response.success) {
          toast.success('تم إنشاء الوسام بنجاح');
        }
      }
      setIsDialogOpen(false);
      setEditingBadge(null);
      resetForm();
      loadBadges();
    } catch (error) {
      toast.error('فشل حفظ الوسام');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الوسام؟')) return;
    
    try {
      const response = await adminApi.deleteBadge(id);
      if (response.success) {
        toast.success('تم حذف الوسام بنجاح');
        loadBadges();
      }
    } catch (error) {
      toast.error('فشل حذف الوسام');
    }
  };

  const handleEdit = (badge: BadgeType) => {
    setEditingBadge(badge);
    setFormData({
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      criteriaType: badge.criteriaType,
      threshold: badge.threshold,
      color: badge.color,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '🌟',
      criteriaType: 'TOTAL_HOURS',
      threshold: 10,
      color: '#10B981',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الأوسمة</h1>
          <p className="text-gray-500 mt-1">إدارة نظام الأوسمة والإنجازات</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="btn-primary"
              onClick={() => {
                setEditingBadge(null);
                resetForm();
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              وسام جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingBadge ? 'تعديل الوسام' : 'وسام جديد'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>الاسم</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="اسم الوسام"
                />
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف الوسام"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الأيقونة (إيموجي)</Label>
                  <Input
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="🌟"
                  />
                </div>
                <div className="space-y-2">
                  <Label>اللون</Label>
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>نوع المعيار</Label>
                <select
                  value={formData.criteriaType}
                  onChange={(e) => setFormData({ ...formData, criteriaType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                >
                  {Object.entries(CRITERIA_TYPES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>الحد الأدنى</Label>
                <Input
                  type="number"
                  value={formData.threshold}
                  onChange={(e) => setFormData({ ...formData, threshold: parseInt(e.target.value) })}
                  placeholder="10"
                />
              </div>
              <Button type="submit" className="w-full btn-primary">
                <Save className="w-4 h-4 mr-2" />
                {editingBadge ? 'تحديث' : 'إنشاء'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Badges Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : badges.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <Card key={badge.id} className="card-ataa">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                      style={{ backgroundColor: badge.color + '20' }}
                    >
                      {badge.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{badge.name}</h3>
                      <p className="text-sm text-gray-500">{badge.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {CRITERIA_TYPES[badge.criteriaType]}
                        </span>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                          {badge.threshold}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(badge)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(badge.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="card-ataa">
          <CardContent className="p-12 text-center">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد أوسمة
            </h3>
            <p className="text-gray-500 mb-4">
              ابدأ بإنشاء أول وسام
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BadgesManagement;
