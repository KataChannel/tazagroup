'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { decodeToken } from '@/lib/auth-utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('ADMIN' | 'SUPERADMIN' | 'INSTRUCTOR' | 'USER' | 'GUEST')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    // If roles are specified, check user role
    if (allowedRoles && allowedRoles.length > 0) {
      try {
        const payload = decodeToken(token);
        
        if (!payload) {
          console.error('Failed to decode token');
          router.push('/login');
          return;
        }
        
        const userRole = payload.roleType as 'ADMIN' | 'SUPERADMIN' | 'INSTRUCTOR' | 'USER' | 'GUEST';
        
        // Check legacy roleType field first
        let hasAccess = allowedRoles.includes(userRole);
        
        // If not allowed by roleType, check RBAC roles array
        if (!hasAccess && payload.roles && Array.isArray(payload.roles)) {
          // Map RBAC role names to legacy roleType equivalents
          const roleMapping: Record<string, ('ADMIN' | 'SUPERADMIN' | 'INSTRUCTOR' | 'USER' | 'GUEST')[]> = {
            'admin': ['ADMIN'],
            'super_admin': ['SUPERADMIN'],
            'administrator': ['ADMIN', 'SUPERADMIN'],
            'giangvien': ['INSTRUCTOR'],
            'instructor': ['INSTRUCTOR'],
          };
          
          hasAccess = payload.roles.some(role => {
            const mappedRoles = roleMapping[role.name] || [];
            return mappedRoles.some(mapped => allowedRoles.includes(mapped));
          });
          
          if (hasAccess) {
            console.log(`✅ Access granted via RBAC role: ${payload.roles.map(r => r.name).join(', ')}`);
          }
        }
        
        // Check if user has access
        if (!hasAccess) {
          console.warn(`❌ Access denied. User roleType: ${userRole}, RBAC roles: ${payload.roles?.map(r => r.name).join(', ') || 'none'}, Allowed roles: ${allowedRoles.join(', ')}`);
          
          // Redirect based on user's actual role
          switch (userRole) {
            case 'ADMIN':
            case 'SUPERADMIN':
              router.push('/lms/admin');
              break;
            case 'INSTRUCTOR':
              router.push('/lms/instructor');
              break;
            case 'USER':
              // Check if user has instructor role in RBAC
              if (payload.roles?.some(r => r.name === 'giangvien' || r.name === 'instructor')) {
                router.push('/lms/instructor');
              } else {
                router.push('/lms/my-learning');
              }
              break;
            default:
              router.push('/lms/courses');
          }
          return;
        }
        
        // User is authorized
        setIsAuthorized(true);
        setIsChecking(false);
      } catch (error) {
        console.error('Failed to parse token:', error);
        router.push('/login');
        return;
      }
    } else {
      // No role check required, just check token exists
      setIsAuthorized(true);
      setIsChecking(false);
    }
  }, [router, allowedRoles]);

  // Show loading state while checking authorization
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only render children if authorized
  return isAuthorized ? <>{children}</> : null;
}
