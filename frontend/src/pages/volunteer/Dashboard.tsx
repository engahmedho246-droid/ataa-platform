import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { volunteerApi } from '@/services/api';
import { VolunteerDashboard as VolunteerDashboardType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Briefcase,
  FileText,
  Award,
  Bell,
  TrendingUp,
  Calendar,
  MapPin,
  ArrowLeft,
  Star,
} from 'lucide-react';

const VolunteerDashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<VolunteerDashboardType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await volunteerApi.getDashboard();
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
        <Button onClick={loadDashboard} className="mt-4">
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  const { stats, upcomingOpportunities, recentBadges, notifications } = dashboard;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            أهلاً بك، {dashboard.profile.user?.name}
          </h1>
          <p className="text-gray-500 mt-1">إليك ملخص نشاطك التطوعي</p>
        </div>
        <Link to="/volunteer/opportunities">
          <Button className="btn-primary">
            <Briefcase className="w-4 h-4 mr-2" />
            استكشف الفرص
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-ataa">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">إجمالي الساعات</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.totalHours}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-ataa">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">الفرص المكتملة</p>
                <p className="text-3xl font-bold text-teal-600">{stats.completedOpportunities}</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-ataa">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">طلبات قيد الانتظار</p>
                <p className="text-3xl font-bold text-amber-600">{stats.pendingApplications}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-ataa">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">الأوسمة</p>
                <p className="text-3xl font-bold text-purple-600">{recentBadges.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Opportunities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">الفرص القادمة</h2>
            <Link to="/volunteer/applications">
              <Button variant="ghost" size="sm" className="gap-1">
                عرض الكل
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {upcomingOpportunities.length > 0 ? (
            <div className="space-y-4">
              {upcomingOpportunities.map((app) => (
                <Card key={app.id} className="card-ataa card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-7 h-7 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">
                          {app.opportunity?.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {app.opportunity?.organization?.name}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(app.opportunity?.startDate || '').toLocaleDateString('ar-SA')}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {app.opportunity?.location}
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700">
                        مقبول
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="card-ataa">
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">لا توجد فرص قادمة</p>
                <Link to="/volunteer/opportunities">
                  <Button className="mt-4 btn-primary">
                    استكشف الفرص
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Badges */}
          <Card className="card-ataa">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                أحدث الأوسمة
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentBadges.length > 0 ? (
                <div className="space-y-3">
                  {recentBadges.slice(0, 3).map((earned) => (
                    <div
                      key={earned.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                        style={{ backgroundColor: earned.badge?.color + '20' }}
                      >
                        {earned.badge?.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{earned.badge?.name}</p>
                        <p className="text-xs text-gray-500">{earned.badge?.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">لم تكسب أي أوسمة بعد</p>
              )}
              <Link to="/volunteer/portfolio">
                <Button variant="outline" className="w-full mt-4">
                  عرض المحفظة
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="card-ataa">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-600" />
                الإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.slice(0, 3).map((notification) => (
                    <div
                      key={notification.id}
                      className="p-3 bg-gray-50 rounded-xl"
                    >
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">لا توجد إشعارات جديدة</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
