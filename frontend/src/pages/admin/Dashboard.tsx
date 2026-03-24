import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Building2,
  Briefcase,
  Clock,
  TrendingUp,
  ArrowLeft,
  User,
  Star,
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await adminApi.getDashboard();
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

  const { stats, recentUsers, recentOpportunities } = dashboard;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-500 mt-1">نظرة عامة على النظام</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="card-ataa">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">المستخدمين</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.totalUsers}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-ataa">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">المتطوعين</p>
                <p className="text-2xl font-bold text-teal-600">{stats.totalVolunteers}</p>
              </div>
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-ataa">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">الجهات</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalOrganizations}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-ataa">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">بانتظار التوثيق</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pendingVerifications}</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-ataa">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">الفرص</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalOpportunities}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-ataa">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">الساعات</p>
                <p className="text-2xl font-bold text-cyan-600">{stats.totalHours}</p>
              </div>
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card className="card-ataa">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              أحدث المستخدمين
            </CardTitle>
            <Link to="/admin/users">
              <Button variant="ghost" size="sm" className="gap-1">
                عرض الكل
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentUsers.length > 0 ? (
              <div className="space-y-3">
                {recentUsers.map((user: any) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Badge className={
                      user.role === 'VOLUNTEER' ? 'bg-teal-100 text-teal-700' :
                      user.role === 'ORGANIZATION' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }>
                      {user.role === 'VOLUNTEER' ? 'متطوع' :
                       user.role === 'ORGANIZATION' ? 'جهة' : 'أدمن'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">لا يوجد مستخدمين جدد</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Opportunities */}
        <Card className="card-ataa">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              أحدث الفرص
            </CardTitle>
            <Link to="/admin/opportunities">
              <Button variant="ghost" size="sm" className="gap-1">
                عرض الكل
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentOpportunities.length > 0 ? (
              <div className="space-y-3">
                {recentOpportunities.map((opp: any) => (
                  <div
                    key={opp.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{opp.title}</p>
                      <p className="text-sm text-gray-500">{opp.organization?.name}</p>
                    </div>
                    <Badge className={
                      opp.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                      opp.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                      'bg-emerald-100 text-emerald-700'
                    }>
                      {opp.status === 'OPEN' ? 'مفتوح' :
                       opp.status === 'DRAFT' ? 'مسودة' : 'مكتمل'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">لا توجد فرص جديدة</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
