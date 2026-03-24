import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { volunteerApi } from '@/services/api';
import { Opportunity } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ArrowLeft,
  Filter,
  Briefcase,
  Star,
} from 'lucide-react';

const CATEGORIES = [
  'الكل', 'تعليم', 'بيئة', 'صحة', 'تقنية', 'ثقافة', 'رياضة', 'اجتماعي', 'فني', 'إغاثة'
];

const OpportunitiesList: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    loadOpportunities();
  }, [page, selectedCategory]);

  const loadOpportunities = async () => {
    try {
      setIsLoading(true);
      const filters: any = { page, limit: 10 };
      if (selectedCategory !== 'الكل') {
        filters.category = selectedCategory;
      }
      if (searchQuery) {
        filters.search = searchQuery;
      }
      
      const response = await volunteerApi.getOpportunities(filters);
      if (response.success && response.data) {
        setOpportunities(response.data);
        setMeta(response.meta);
      }
    } catch (error) {
      console.error('Failed to load opportunities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadOpportunities();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Badge className="bg-emerald-100 text-emerald-700">متاح</Badge>;
      case 'CLOSED':
        return <Badge className="bg-gray-100 text-gray-700">مغلق</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الفرص التطوعية</h1>
          <p className="text-gray-500 mt-1">اكتشف الفرص المناسبة لمهاراتك</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="البحث في الفرص..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <Button type="submit" className="btn-primary">
            بحث
          </Button>
        </form>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : opportunities.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {opportunities.map((opportunity) => (
            <Link key={opportunity.id} to={`/volunteer/opportunities/${opportunity.id}`}>
              <Card className="card-ataa card-hover h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 line-clamp-1">
                          {opportunity.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {opportunity.organization?.name}
                          {opportunity.organization?.isVerified && (
                            <Star className="w-3 h-3 inline mr-1 text-amber-500 fill-amber-500" />
                          )}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(opportunity.status)}
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {opportunity.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
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
                      {opportunity._count?.applications || 0} / {opportunity.requiredVolunteers}
                    </span>
                  </div>

                  {opportunity.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {opportunity.requiredSkills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {opportunity.requiredSkills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{opportunity.requiredSkills.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="card-ataa">
          <CardContent className="p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد فرص متاحة
            </h3>
            <p className="text-gray-500">
              جرب تغيير الفلاتر أو البحث بكلمات مختلفة
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            السابق
          </Button>
          <span className="text-sm text-gray-600">
            صفحة {page} من {meta.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
            disabled={page === meta.totalPages}
          >
            التالي
          </Button>
        </div>
      )}
    </div>
  );
};

export default OpportunitiesList;
