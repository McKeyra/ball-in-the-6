'use client';

import {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';
import { useAuth } from './auth-provider';
import {
  ROLES,
  ROLE_DASHBOARDS,
  ROLE_MODULES,
  type Role,
  type ModuleName,
} from '@/lib/roles';

interface RoleContextValue {
  activeRole: Role | null;
  availableRoles: string[];
  switchRole: (role: Role) => void;
  dashboard: string;
  allowedModules: ModuleName[];
  hasAccess: (moduleName: ModuleName) => boolean;
}

const RoleContext = createContext<RoleContextValue | null>(null);

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider = ({ children }: RoleProviderProps): React.JSX.Element => {
  const { user } = useAuth();
  const [activeRole, setActiveRole] = useState<Role | null>(null);

  useEffect(() => {
    if (user?.roles?.length) {
      const savedRole =
        typeof window !== 'undefined'
          ? localStorage.getItem('bit6_active_role')
          : null;
      if (savedRole && user.roles.includes(savedRole)) {
        setActiveRole(savedRole as Role);
      } else {
        setActiveRole(user.roles[0] as Role);
      }
    } else {
      setActiveRole(ROLES.FAN);
    }
  }, [user]);

  const switchRole = (role: Role): void => {
    if (user?.roles?.includes(role) || role === ROLES.FAN) {
      setActiveRole(role);
      if (typeof window !== 'undefined') {
        localStorage.setItem('bit6_active_role', role);
      }
    }
  };

  const availableRoles = user?.roles ?? [ROLES.FAN];
  const dashboard = activeRole
    ? (ROLE_DASHBOARDS[activeRole] ?? '/fan')
    : '/fan';
  const allowedModules: ModuleName[] = activeRole
    ? (ROLE_MODULES[activeRole] ?? ['fan'])
    : ['fan'];

  const hasAccess = (moduleName: ModuleName): boolean =>
    allowedModules.includes(moduleName);

  return (
    <RoleContext.Provider
      value={{
        activeRole,
        availableRoles,
        switchRole,
        dashboard,
        allowedModules,
        hasAccess,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextValue => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
