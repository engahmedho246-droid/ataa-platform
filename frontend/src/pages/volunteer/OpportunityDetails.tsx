import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { volunteerApi } from '@/services/api';
import { Opportunity } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  Star,
  Briefcase,
  CheckCircle,
  ArrowLeft,
  Building2,
} from 'lucide-react';
import { toast } from 'sonner';

const OpportunityDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [message, setMessage] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    if (id) {
      loadOpportunity();
    }
  }, [id]);

  const loadOpportunity = async () => {
    try {
      const response = await volunteerApi.getOpportunityById(id!);
      if (response.success && response.data) {
        setOpportunity(response.data);
      }
    } catch (error) {
      console.error('Failed to load opportunity:', error);
      toast.error('فشل تحميل تفاصيل الفرصة');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    if (!id) return;
    
    setIsApplying(true);
    try {
      const response = await volunteerApi.applyForOpportunity(id, message);
      if (response.success) {
        toast.success('تم تقديم الطلب بنجاح');
        setShowApplyForm(false);
        loadOpportunity();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'فشل تقديم الطلب');
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">الفرصة غير موجودة</p>
        <Button onClick={() => navigate('/volunteer/opportunities')} className="mt-4">
          العودة للفرص
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/volunteer/opportunities')}
        className="gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        العودة للفرص
      </Button>

      {/* Opportunity Header */}
      <Card className="card-ataa overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-emerald-500 to-teal-500" />
        <CardContent className="p-6 -mt-12">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <Building2 className="w-12 h-12 text-emerald-600" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className="bg-emerald-100 text-emerald-700">
                  {opportunity.category}
                </Badge>
                {opportunity.status === 'OPEN' && (
                  <Badge className="bg-green-100 text-green-700">متاح</Badge>
                )}
                {opportunity.hasApplied && (
                  <Badge className="bg-amber-100 text-amber-700">
                    تم التقديم
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{opportunity.title}</h1>
              <p className="text-gray-500 flex items-center gap-2 mt-1">
                {opportunity.organization?.name}
                {opportunity.organization?.isVerified && (
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-ataa">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                وصف الفرصة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {opportunity.description}
              </p>
            </CardContent>
          </Card>

          {opportunity.requiredSkills.length > 0 && (
            <Card className="card-ataa">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  المهارات المطلوبة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {opportunity.requiredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Apply Form */}
          {showApplyForm && (
            <Card className="card-ataa border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg">تقديم على الفرصة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رسالة (اختياري)
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="اخبرنا لماذا تريد الانضمام لهذه الفرصة..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowApplyForm(false)}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleApply}
                    disabled={isApplying}
                    className="flex-1 btn-primary"
                  >
                    {isApplying ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'تقديم الطلب'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="card-ataa">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">الموقع</p>
                  <p className="font-medium">{opportunity.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">تاريخ البدء</p>
                  <p className="font-medium">
                    {new Date(opportunity.startDate).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">تاريخ الانتهاء</p>
                  <p className="font-medium">
                    {new Date(opportunity.endDate).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">المتطوعين المطلوبين</p>
                  <p className="font-medium">{opportunity.requiredVolunteers}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">المتقدمين</p>
                  <p className="font-medium">{opportunity._count?.applications || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Apply Button */}
          {opportunity.status === 'OPEN' && !opportunity.hasApplied && !showApplyForm && (
            <Button
              onClick={() => setShowApplyForm(true)}
              className="w-full btn-primary"
            >
              تقدم على الفرصة
            </Button>
          )}

          {opportunity.hasApplied && (
            <Alert className="bg-amber-50 border-amber-200">
              <CheckCircle className="w-4 h-4 text-amber-600" />
              <AlertDescription className="text-amber-700">
                لقد قدمت على هذه الفرصة. حالة الطلب: {opportunity.applicationStatus}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetails;
