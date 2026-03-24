import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { organizationApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  Users,
  Clock,
  FileText,
  TrendingUp,
  Plus,
  ArrowLeft,
  Calendar,
  User,
} from 'lucide-react';

const OrganizationDashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await organizationApi.getDashboard();
      if (response.success && response.data) {
        setDashboard(response.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">فشل تحميل البيانات</p>
      </div>
    );
  }

  const { stats, recentApplications } = dashboard;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-amber-100 text-amber-700">قيد الانتظار</Badge>;
      case 'ACCEPTED':
        return <Badge className="bg-green-100 text-green-700">مقبول</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-700">مرفوض</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-500 mt-1">ملخص نشاط جهتك</p>
        </div>
        <Link to="/organization/opportunities/create">
          <Button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            فرصة جديدة
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="card-ataa">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">إجمالي الفرص</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.totalOpportunities}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-ataa">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">الفرص النشطة</p>
                <p className="text-2xl font-bold text-teal-600">{stats.activeOpportunities}</p>
              </div>
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-ataa">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">المتطوعين</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalVolunteers}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-ataa">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">طلبات جديدة</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pendingApplications}</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-ataa">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">إجمالي الساعات</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalHours}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card className="card-ataa">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            أحدث الطلبات
          </CardTitle>
          <Link to="/organization/opportunities">
            <Button variant="ghost" size="sm" className="gap-1">
              عرض الكل
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentApplications.length > 0 ? (
            <div className="space-y-4">
              {recentApplications.map((app: any) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{app.volunteer?.user?.name}</p>
                      <p className="text-sm text-gray-500">
                        تقدم على: {app.opportunity?.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(app.appliedAt).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(app.status)}
                    <Link to={`/organization/opportunities/${app.opportunityId}/applications`}>
                      <Button variant="outline" size="sm">
                        مراجعة
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد طلبات جديدة</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationDashboard;
