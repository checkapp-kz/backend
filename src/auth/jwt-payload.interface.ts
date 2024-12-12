// src/auth/jwt-payload.interface.ts
export interface JwtPayload {
  email: string; // Включите сюда данные, которые вы хотите хранить в токене
  id: string; // ID пользователя или другой идентификатор (субъект)
  role: string; // роль пользователя
}
