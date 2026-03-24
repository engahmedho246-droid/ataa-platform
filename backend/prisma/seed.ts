import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await hashPassword('admin123456');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ataa.sa' },
    update: {},
    create: {
      email: 'admin@ataa.sa',
      password: adminPassword,
      name: 'System Administrator',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create sample badges
  const badges = [
    {
      name: 'المتطوع الجديد',
      description: 'أكمل أول فرصة تطوعية',
      icon: '🌟',
      criteriaType: 'COMPLETED_OPPORTUNITIES' as const,
      threshold: 1,
      color: '#10B981',
    },
    {
      name: 'متطوع نشط',
      description: 'أكمل 5 فرص تطوعية',
      icon: '⚡',
      criteriaType: 'COMPLETED_OPPORTUNITIES' as const,
      threshold: 5,
      color: '#3B82F6',
    },
    {
      name: 'متطوع ذهبي',
      description: 'أكمل 20 فرصة تطوعية',
      icon: '🏆',
      criteriaType: 'COMPLETED_OPPORTUNITIES' as const,
      threshold: 20,
      color: '#F59E0B',
    },
    {
      name: 'ساعة خير',
      description: 'ساهم بـ 10 ساعات تطوعية',
      icon: '⏰',
      criteriaType: 'TOTAL_HOURS' as const,
      threshold: 10,
      color: '#8B5CF6',
    },
    {
      name: 'ساعات مضيئة',
      description: 'ساهم بـ 50 ساعة تطوعية',
      icon: '💫',
      criteriaType: 'TOTAL_HOURS' as const,
      threshold: 50,
      color: '#EC4899',
    },
    {
      name: 'بطل التطوع',
      description: 'ساهم بـ 100 ساعة تطوعية',
      icon: '👑',
      criteriaType: 'TOTAL_HOURS' as const,
      threshold: 100,
      color: '#EF4444',
    },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { id: '00000000-0000-0000-0000-00000000000' + badges.indexOf(badge) },
      update: {},
      create: badge,
    });
  }
  console.log('✅ Badges created:', badges.length);

  // Create sample volunteer
  const volunteerPassword = await hashPassword('volunteer123');
  const volunteerUser = await prisma.user.upsert({
    where: { email: 'volunteer@example.com' },
    update: {},
    create: {
      email: 'volunteer@example.com',
      password: volunteerPassword,
      name: 'أحمد محمد',
      phone: '+966501234567',
      role: 'VOLUNTEER',
      status: 'ACTIVE',
    },
  });

  await prisma.volunteer.upsert({
    where: { userId: volunteerUser.id },
    update: {},
    create: {
      userId: volunteerUser.id,
      city: 'الرياض',
      skills: ['تدريس', 'تصميم', 'برمجة'],
      interests: ['تعليم', 'بيئة', 'تقنية'],
      bio: 'شغوف بالتطوع ومساعدة الآخرين',
    },
  });
  console.log('✅ Sample volunteer created:', volunteerUser.email);

  // Create sample organization
  const orgPassword = await hashPassword('org123456');
  const orgUser = await prisma.user.upsert({
    where: { email: 'org@example.com' },
    update: {},
    create: {
      email: 'org@example.com',
      password: orgPassword,
      name: 'جمعية الخير',
      phone: '+966508765432',
      role: 'ORGANIZATION',
      status: 'ACTIVE',
    },
  };

  await prisma.organization.upsert({
    where: { userId: orgUser.id },
    update: {},
    create: {
      userId: orgUser.id,
      name: 'جمعية الخير للتنمية المجتمعية',
      type: 'NON_PROFIT',
      licenseNumber: '123456789',
      description: 'جمعية خيرية تعنى بالتنمية المجتمعية والعمل التطوعي',
      website: 'https://example.org',
      address: 'شارع الملك فهد، الرياض',
      city: 'الرياض',
      isVerified: true,
      verificationStatus: 'APPROVED',
    },
  });
  console.log('✅ Sample organization created:', orgUser.email);

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
