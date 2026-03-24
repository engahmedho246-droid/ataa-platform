import React, { useEffect, useState } from 'react';
import { volunteerApi } from '@/services/api';
import { Application } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  FileText,
  Calendar,
  MapPin,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: 'قيد الانتظار', color: 'bg-amber-100 text-amber-700', icon: Clock },
  ACCEPTED: { label: 'مقبول', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  REJECTED: { label: 'مرفوض', color: 'bg-red-100 text-red-700', icon: XCircle },
  WITHDRAWN: { label: 'تم الانسحاب', color: 'bg-gray-100 text-gray-700', icon: RotateCcw },
  COMPLETED: { label: 'مكتمل', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
};

const MyApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    loadApplications();
  }, [filter]);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (filter !== 'ALL') {
        params.status = filter;
      }
      const response = await volunteerApi.getMyApplications(params);
      if (response.success && response.data) {
        setApplications(response.data);
      }
    } catch (error) {
      console.error('Failed to load applications:', error);
      toast.error('فشل تحميل الطلبات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (id: string) => {
    try {
      const response = await volunteerApi.withdrawApplication(id);
      if (response.success) {
        toast.success('تم الانسحاب من الطلب بنجاح');
        loadApplications();
      }
    } catch (error) {
      toast.error('فشل الانسحاب من الطلب');
    }
  };

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const canWithdraw = (status: string) => ['PENDING', 'ACCEPTED'].includes(status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">طلباتي</h1>
        <p className="text-gray-500 mt-1">متابعة حالة طلبات التطوع</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {[
          { value: 'ALL', label: 'الكل' },
          { value: 'PENDING', label: 'قيد الانتظار' },
          { value: 'ACCEPTED', label: 'مقبول' },
          { value: 'REJECTED', label: 'مرفوض' },
          { value: 'COMPLETED', label: 'مكتمل' },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              filter === option.value
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id} className="card-ataa">
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {app.opportunity?.title}
                        </h3>
                        <p className="text-gray-500 flex items-center gap-2 mt-1">
                          <Building2 className="w-4 h-4" />
                          {app.opportunity?.organization?.name}
                        </p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {app.opportunity?.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(app.opportunity?.startDate || '').toLocaleDateString('ar-SA')}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        تاريخ التقديم: {new Date(app.appliedAt).toLocaleDateString('ar-SA')}
                      </span>
                    </div>

                    {app.message && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-gray-600">رسالتك: {app.message}</p>
                      </div>
                    )}

                    {app.responseNote && (
                      <div className="bg-emerald-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-emerald-700">رد الجهة: {app.responseNote}</p>
                      </div>
                    )}
                  </div>

                  {canWithdraw(app.status) && (
                    <Button
                      variant="outline"
                      onClick={() => handleWithdraw(app.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      انسحاب
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="card-ataa">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد طلبات
            </h3>
            <p className="text-gray-500 mb-4">
              لم تقم بتقديم أي طلبات تطوعية بعد
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyApplications;
