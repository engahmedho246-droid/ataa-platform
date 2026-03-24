import React, { useEffect, useState } from 'react';
import { volunteerApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Award,
  Clock,
  Briefcase,
  FileCheck,
  Star,
  Calendar,
  TrendingUp,
} from 'lucide-react';

const VolunteerPortfolio: React.FC = () => {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const response = await volunteerApi.getPortfolio();
      if (response.success && response.data) {
        setPortfolio(response.data);
      }
    } catch (error) {
      console.error('Failed to load portfolio:', error);
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

  if (!portfolio) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">فشل تحميل المحفظة</p>
      </div>
    );
  }

  const { summary, completedOpportunities, badges, certificates, hoursHistory } = portfolio;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">محفظتي الرقمية</h1>
        <p className="text-gray-500 mt-1">جميع إنجازاتك التطوعية في مكان واحد</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-ataa">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">إجمالي الساعات</p>
                <p className="text-3xl font-bold text-emerald-600">{summary.totalHours}</p>
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
                <p className="text-3xl font-bold text-teal-600">{summary.completedOpportunities}</p>
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
                <p className="text-gray-500 text-sm">الأوسمة</p>
                <p className="text-3xl font-bold text-purple-600">{summary.totalBadges}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-ataa">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">الشهادات</p>
                <p className="text-3xl font-bold text-amber-600">{summary.totalCertificates}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Badges */}
        <Card className="card-ataa">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              الأوسمة المكتسبة
            </CardTitle>
          </CardHeader>
          <CardContent>
            {badges.length > 0 ? (
              <div className="space-y-3">
                {badges.map((earned: any) => (
                  <div
                    key={earned.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: earned.badge?.color + '20' }}
                    >
                      {earned.badge?.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{earned.badge?.name}</h4>
                      <p className="text-sm text-gray-500">{earned.badge?.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        تاريخ الكسب: {new Date(earned.earnedAt).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">لم تكسب أي أوسمة بعد</p>
            )}
          </CardContent>
        </Card>

        {/* Certificates */}
        <Card className="card-ataa">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-600" />
              الشهادات
            </CardTitle>
          </CardHeader>
          <CardContent>
            {certificates.length > 0 ? (
              <div className="space-y-3">
                {certificates.map((cert: any) => (
                  <div
                    key={cert.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
                      <FileCheck className="w-7 h-7 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{cert.opportunity?.title}</h4>
                      <p className="text-sm text-gray-500">{cert.hours} ساعة تطوعية</p>
                      <p className="text-xs text-gray-400 mt-1">
                        تاريخ الإصدار: {new Date(cert.issuedAt).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-gray-400">رقم الشهادة</p>
                      <p className="text-sm font-mono text-gray-600">{cert.certificateHash}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">لم تحصل على شهادات بعد</p>
            )}
          </CardContent>
        </Card>

        {/* Completed Opportunities */}
        <Card className="card-ataa lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-teal-600" />
              الفرص المكتملة
            </CardTitle>
          </CardHeader>
          <CardContent>
            {completedOpportunities.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {completedOpportunities.map((app: any) => (
                  <div
                    key={app.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-6 h-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{app.opportunity?.title}</h4>
                      <p className="text-sm text-gray-500">{app.opportunity?.organization?.name}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(app.opportunity?.startDate).toLocaleDateString('ar-SA')}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {app.opportunity?.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">لم تكمل أي فرص تطوعية بعد</p>
            )}
          </CardContent>
        </Card>

        {/* Hours History */}
        <Card className="card-ataa lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              سجل الساعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hoursHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">الفرصة</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">تاريخ الدخول</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">تاريخ الخروج</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">الساعات</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hoursHistory.map((log: any) => (
                      <tr key={log.id} className="border-b border-gray-50">
                        <td className="py-3 px-4">{log.application?.opportunity?.title}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {new Date(log.checkInTime).toLocaleString('ar-SA')}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {log.checkOutTime ? new Date(log.checkOutTime).toLocaleString('ar-SA') : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-emerald-600">{log.totalHours || '-'}</span>
                        </td>
                        <td className="py-3 px-4">
                          {log.approvedByOrg ? (
                            <Badge className="bg-green-100 text-green-700">معتمد</Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-700">قيد المراجعة</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">لا يوجد سجل للساعات</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VolunteerPortfolio;
