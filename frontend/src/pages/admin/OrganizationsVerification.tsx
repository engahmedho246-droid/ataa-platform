import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Building2,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  FileText,
  Star,
} from 'lucide-react';

const OrganizationsVerification: React.FC = () => {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getPendingOrganizations();
      if (response.success && response.data) {
        setOrganizations(response.data);
      }
    } catch (error) {
      console.error('Failed to load organizations:', error);
      toast.error('فشل تحميل الجهات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await adminApi.verifyOrganization(id, status);
      if (response.success) {
        toast.success(status === 'APPROVED' ? 'تم توثيق الجهة' : 'تم رفض الجهة');
        loadOrganizations();
      }
    } catch (error) {
      toast.error('فشل معالجة الطلب');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">توثيق الجهات</h1>
        <p className="text-gray-500 mt-1">مراجعة وتوثيق الجهات المنظمة</p>
      </div>

      {/* Organizations List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : organizations.length > 0 ? (
        <div className="space-y-4">
          {organizations.map((org) => (
            <Card key={org.id} className="card-ataa">
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{org.name}</h3>
                          <Badge className="bg-amber-100 text-amber-700 mt-1">
                            <Star className="w-3 h-3 mr-1" />
                            قيد التوثيق
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {org.user?.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {org.user?.phone || 'غير متوفر'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {org.city || 'غير محدد'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="w-4 h-4" />
                        رقم الترخيص: {org.licenseNumber || 'غير متوفر'}
                      </div>
                    </div>

                    {org.description && (
                      <div className="bg-gray-50 p-4 rounded-xl mb-4">
                        <p className="text-sm text-gray-600">{org.description}</p>
                      </div>
                    )}

                    <p className="text-xs text-gray-400">
                      تاريخ التسجيل: {new Date(org.createdAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleVerify(org.id, 'REJECTED')}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      رفض
                    </Button>
                    <Button
                      onClick={() => handleVerify(org.id, 'APPROVED')}
                      className="btn-primary"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      توثيق
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
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد جهات بانتظار التوثيق
            </h3>
            <p className="text-gray-500">
              جميع الجهات تم توثيقها
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrganizationsVerification;
