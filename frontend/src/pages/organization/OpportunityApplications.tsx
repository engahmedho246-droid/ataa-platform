import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { organizationApi } from '@/services/api';
import { Application } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
} from 'lucide-react';

const OpportunityApplications: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [opportunity, setOpportunity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id, filter]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (filter !== 'ALL') {
        params.status = filter;
      }
      
      const [oppResponse, appsResponse] = await Promise.all([
        organizationApi.getOpportunityById(id!),
        organizationApi.getApplications(id!, params),
      ]);

      if (oppResponse.success) {
        setOpportunity(oppResponse.data);
      }
      if (appsResponse.success) {
        setApplications(appsResponse.data || []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('فشل تحميل البيانات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespond = async (applicationId: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      const response = await organizationApi.respondToApplication(id!, applicationId, status);
      if (response.success) {
        toast.success(status === 'ACCEPTED' ? 'تم قبول الطلب' : 'تم رفض الطلب');
        loadData();
      }
    } catch (error) {
      toast.error('فشل معالجة الطلب');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-amber-100 text-amber-700">قيد الانتظار</Badge>;
      case 'ACCEPTED':
        return <Badge className="bg-green-100 text-green-700">مقبول</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-700">مرفوض</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-emerald-100 text-emerald-700">مكتمل</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/organization/opportunities')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            طلبات التقديم
          </h1>
          <p className="text-gray-500 mt-1">{opportunity?.title}</p>
        </div>
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
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
                          <User className="w-7 h-7 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{app.volunteer?.user?.name}</h3>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {app.volunteer?.user?.email}
                            </span>
                            {app.volunteer?.user?.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {app.volunteer.user.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        تاريخ التقديم: {new Date(app.appliedAt).toLocaleDateString('ar-SA')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        الساعات: {app.volunteer?.totalHours || 0}
                      </span>
                    </div>

                    {app.message && (
                      <div className="bg-gray-50 p-4 rounded-xl mb-4">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          رسالة المتطوع:
                        </p>
                        <p className="text-gray-700 mt-1">{app.message}</p>
                      </div>
                    )}

                    {app.responseNote && (
                      <div className="bg-emerald-50 p-4 rounded-xl mb-4">
                        <p className="text-sm text-emerald-700">ردك: {app.responseNote}</p>
                      </div>
                    )}
                  </div>

                  {app.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleRespond(app.id, 'REJECTED')}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        رفض
                      </Button>
                      <Button
                        onClick={() => handleRespond(app.id, 'ACCEPTED')}
                        className="btn-primary"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        قبول
                      </Button>
                    </div>
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
            <p className="text-gray-500">
              لم يتقدم أي متطوع على هذه الفرصة بعد
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OpportunityApplications;
