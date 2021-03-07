import jwtDecode from 'jwt-decode';
import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

export interface UserData {
  id: string;
  name: string;
  email: string;
  manager: boolean;
  photo?: string;
}


interface AuthState {
  token: string;
  user: UserData;
}

interface AuthResponse {
  access: string;
  refresh: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: UserData;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: UserData): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@Agenda:token');
    const user = localStorage.getItem('@Agenda:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post<AuthResponse>('user/token/', {
      email,
      password,
    });

    const { access: token } = response.data;
    const decodedToken = jwtDecode<{user: UserData}>(token)
  
    const { user } = decodedToken;

    localStorage.setItem('@Agenda:token', token);
    localStorage.setItem('@Agenda:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@Agenda:token');
    localStorage.removeItem('@Agenda:user');

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback((user) => {
    localStorage.setItem('@Agenda:user', JSON.stringify(user));
    setData(({ token }) => ({ token, user }));
  }, [])

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}