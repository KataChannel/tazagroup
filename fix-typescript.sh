#!/bin/bash

# Fix TypeScript errors in API files
echo "🔧 Fixing TypeScript errors in API files..."

# Update getUserFromRequest helper to handle different cookie names
sed -i 's/request.cookies.get('\''token'\'')/request.cookies.get('\''auth-token'\'') || request.cookies.get('\''token'\'')/g' src/lib/auth-helpers.ts

# Fix analytics files - add proper type assertions
echo "📊 Fixing analytics files..."

# Fix daterange route
if [ -f "src/app/api/analytics/daterange/route.ts" ]; then
    # Add type assertion for _count
    sed -i 's/item\._count\.id/item\._count\?\.id || 0/g' src/app/api/analytics/daterange/route.ts
    sed -i 's/item\._sum\.commission/item\._sum\?\.commission || 0/g' src/app/api/analytics/daterange/route.ts
    sed -i 's/earnings\._sum\.commission/earnings\._sum\?\.commission || 0/g' src/app/api/analytics/daterange/route.ts
    sed -i 's/previousEarnings\._sum\.commission/previousEarnings\._sum\?\.commission || 0/g' src/app/api/analytics/daterange/route.ts
fi

# Fix realtime route
if [ -f "src/app/api/analytics/realtime/route.ts" ]; then
    sed -i 's/item\._count\.id/item\._count\?\.id || 0/g' src/app/api/analytics/realtime/route.ts
    sed -i 's/earningsToday\._sum\.commission/earningsToday\._sum\?\.commission || 0/g' src/app/api/analytics/realtime/route.ts
    sed -i 's/earningsWeek\._sum\.commission/earningsWeek\._sum\?\.commission || 0/g' src/app/api/analytics/realtime/route.ts
    sed -i 's/earningsMonth\._sum\.commission/earningsMonth\._sum\?\.commission || 0/g' src/app/api/analytics/realtime/route.ts
fi

# Fix analytics route
if [ -f "src/app/api/analytics/route.ts" ]; then
    sed -i 's/earnings\._sum\.commission/earnings\._sum\?\.commission || 0/g' src/app/api/analytics/route.ts
fi

echo "✅ TypeScript errors fixed!"
echo "📦 Run 'npm run type-check' to verify fixes."
