import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { organizationApi } from '@/services/api';
import { Opportunity } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Briefcase,
  Plus,
  Calendar,
  MapPin,
  Users,
  Edit,
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Pause,
  Play,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'مسودة', color: 'bg-gray-100 text-gray-700' },
  OPEN: { label: 'مفتوح', color: 'bg-green-100 text-green-700' },
  CLOSED: { label: 'مغلق', color: 'bg-amber-100 text-amber-700' },
  CANCELLED: { label: 'ملغي', color: 'bg-red-100 text-red-700' },
  COMPLETED: { label: 'مكتمل', color: 'bg-emerald-100 text-emerald-700' },
};

const ManageOpportunities: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    loadOpportunities();
  }, [filter]);

  const loadOpportunities = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (filter !== 'ALL') {
        params.status = filter;
      }
      const response = await organizationApi.getOpportunities(params);
      if (response.success && response.data) {
        setOpportunities(response.data);
      }
    } catch (error) {
      console.error('Failed to load opportunities:', error);
      toast.error('فشل تحميل الفرص');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await organizationApi.changeOpportunityStatus(id, status);
      if (response.success) {
        toast.success('تم تغيير الحالة بنجاح');
        loadOpportunities();
      }
    } catch (error) {
      toast.error('فشل تغيير الحالة');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الفرص التطوعية</h1>
          <p className="text-gray-500 mt-1">إدارة فرص التطوع الخاصة بجهتك</p>
        </div>
        <Link to="/organization/opportunities/create">
          <Button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            فرصة جديدة
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {[
          { value: 'ALL', label: 'الكل' },
          { value: 'DRAFT', label: 'مسودة' },
          { value: 'OPEN', label: 'مفتوح' },
          { value: 'CLOSED', label: 'مغلق' },
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

      {/* Opportunities List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : opportunities.length > 0 ? (
        <div className="space-y-4">
          {opportunities.map((opportunity) => (
            <Card key={opportunity.id} className="card-ataa">
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{opportunity.title}</h3>
                      <Badge className={STATUS_CONFIG[opportunity.status]?.color || STATUS_CONFIG.DRAFT.color}>
                        {STATUS_CONFIG[opportunity.status]?.label || 'مسودة'}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {opportunity.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(opportunity.startDate).toLocaleDateString('ar-SA')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {opportunity._count?.applications || 0} متقدم
                      </span>
                    </div>

                    {opportunity.requiredSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {opportunity.requiredSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/organization/opportunities/${opportunity.id}/applications`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="w-4 h-4" />
                        الطلبات
                      </Button>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {opportunity.status === 'DRAFT' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(opportunity.id, 'OPEN')}>
                            <Play className="w-4 h-4 mr-2" />
                            نشر
                          </DropdownMenuItem>
                        )}
                        {opportunity.status === 'OPEN' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(opportunity.id, 'CLOSED')}>
                            <Pause className="w-4 h-4 mr-2" />
                            إغلاق
                          </DropdownMenuItem>
                        )}
                        {['OPEN', 'CLOSED'].includes(opportunity.status) && (
                          <DropdownMenuItem onClick={() => handleStatusChange(opportunity.id, 'COMPLETED')}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            إكمال
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="card-ataa">
          <CardContent className="p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد فرص
            </h3>
            <p className="text-gray-500 mb-4">
              ابدأ بإنشاء أول فرصة تطوعية
            </p>
            <Link to="/organization/opportunities/create">
              <Button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                فرصة جديدة
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManageOpportunities;
