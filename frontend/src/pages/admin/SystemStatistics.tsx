import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart3,
  Users,
  Briefcase,
  Clock,
  TrendingUp,
  Award,
  Star,
} from 'lucide-react';

const SystemStatistics: React.FC = () => {
  const [statistics, setStatistics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const response = await adminApi.getStatistics();
      if (response.success && response.data) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
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

  if (!statistics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">فشل تحميل الإحصائيات</p>
      </div>
    );
  }

  const { usersByRole, opportunitiesByStatus, applicationsByStatus, topVolunteers, topOrganizations } = statistics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">الإحصائيات</h1>
        <p className="text-gray-500 mt-1">إحصائيات النظام والأداء</p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Users by Role */}
        <Card className="card-ataa">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              المستخدمين حسب الدور
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {usersByRole.map((item: any) => (
                <div key={item.role} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">
                    {item.role === 'VOLUNTEER' ? 'متطوع' :
                     item.role === 'ORGANIZATION' ? 'جهة' : 'أدمن'}
                  </span>
                  <span className="font-bold text-emerald-600">{item._count.id}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Opportunities by Status */}
        <Card className="card-ataa">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              الفرص حسب الحالة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {opportunitiesByStatus.map((item: any) => (
                <div key={item.status} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">
                    {item.status === 'OPEN' ? 'مفتوح' :
                     item.status === 'DRAFT' ? 'مسودة' :
                     item.status === 'CLOSED' ? 'مغلق' :
                     item.status === 'COMPLETED' ? 'مكتمل' : 'ملغي'}
                  </span>
                  <span className="font-bold text-teal-600">{item._count.id}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Applications by Status */}
        <Card className="card-ataa">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              الطلبات حسب الحالة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {applicationsByStatus.map((item: any) => (
                <div key={item.status} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">
                    {item.status === 'PENDING' ? 'قيد الانتظار' :
                     item.status === 'ACCEPTED' ? 'مقبول' :
                     item.status === 'REJECTED' ? 'مرفوض' :
                     item.status === 'COMPLETED' ? 'مكتمل' : 'منسحب'}
                  </span>
                  <span className="font-bold text-blue-600">{item._count.id}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Volunteers */}
        <Card className="card-ataa">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              أفضل المتطوعين
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topVolunteers.length > 0 ? (
              <div className="space-y-3">
                {topVolunteers.slice(0, 5).map((volunteer: any, index: number) => (
                  <div
                    key={volunteer.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-gray-200 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{volunteer.user?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">{volunteer.totalHours}</p>
                      <p className="text-xs text-gray-500">ساعة</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">لا يوجد بيانات</p>
            )}
          </CardContent>
        </Card>

        {/* Top Organizations */}
        <Card className="card-ataa">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              أفضل الجهات
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topOrganizations.length > 0 ? (
              <div className="space-y-3">
                {topOrganizations.slice(0, 5).map((org: any, index: number) => (
                  <div
                    key={org.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-gray-200 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{org.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-teal-600">{org.opportunities?.length || 0}</p>
                      <p className="text-xs text-gray-500">فرصة مكتملة</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">لا يوجد بيانات</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemStatistics;
