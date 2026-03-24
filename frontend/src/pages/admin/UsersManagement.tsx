import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/api';
import { User } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Users,
  Search,
  User as UserIcon,
  Building2,
  Shield,
  Ban,
  CheckCircle,
  Trash2,
} from 'lucide-react';

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (filter !== 'ALL') {
        params.role = filter;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      const response = await adminApi.getUsers(params);
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('فشل تحميل المستخدمين');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers();
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await adminApi.updateUserStatus(id, status);
      if (response.success) {
        toast.success('تم تحديث الحالة بنجاح');
        loadUsers();
      }
    } catch (error) {
      toast.error('فشل تحديث الحالة');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    
    try {
      const response = await adminApi.deleteUser(id);
      if (response.success) {
        toast.success('تم حذف المستخدم بنجاح');
        loadUsers();
      }
    } catch (error) {
      toast.error('فشل حذف المستخدم');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'VOLUNTEER':
        return <Badge className="bg-teal-100 text-teal-700">متطوع</Badge>;
      case 'ORGANIZATION':
        return <Badge className="bg-blue-100 text-blue-700">جهة</Badge>;
      case 'ADMIN':
        return <Badge className="bg-purple-100 text-purple-700">أدمن</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-700">نشط</Badge>;
      case 'INACTIVE':
        return <Badge className="bg-gray-100 text-gray-700">غير نشط</Badge>;
      case 'SUSPENDED':
        return <Badge className="bg-red-100 text-red-700">موقوف</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
        <p className="text-gray-500 mt-1">إدارة حسابات المستخدمين في النظام</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="البحث في المستخدمين..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <Button type="submit" className="btn-primary">
            بحث
          </Button>
        </form>

        <div className="flex gap-2 overflow-x-auto">
          {[
            { value: 'ALL', label: 'الكل' },
            { value: 'VOLUNTEER', label: 'متطوعين' },
            { value: 'ORGANIZATION', label: 'جهات' },
            { value: 'ADMIN', label: 'أدمن' },
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
      </div>

      {/* Users List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : users.length > 0 ? (
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id} className="card-ataa">
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      user.role === 'VOLUNTEER' ? 'bg-teal-100' :
                      user.role === 'ORGANIZATION' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      {user.role === 'VOLUNTEER' ? <UserIcon className="w-7 h-7 text-teal-600" /> :
                       user.role === 'ORGANIZATION' ? <Building2 className="w-7 h-7 text-blue-600" /> :
                       <Shield className="w-7 h-7 text-purple-600" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{user.name}</h3>
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.status)}
                      </div>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        تاريخ التسجيل: {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>

                  {user.role !== 'ADMIN' && (
                    <div className="flex items-center gap-2">
                      {user.status === 'ACTIVE' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(user.id, 'SUSPENDED')}
                          className="text-amber-600 border-amber-200 hover:bg-amber-50"
                        >
                          <Ban className="w-4 h-4 mr-2" />
                          إيقاف
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(user.id, 'ACTIVE')}
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          تفعيل
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        حذف
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
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا يوجد مستخدمين
            </h3>
            <p className="text-gray-500">
              لم يتم العثور على مستخدمين مطابقين للبحث
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UsersManagement;
