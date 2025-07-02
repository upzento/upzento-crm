import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Don't include the password in the returned object
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: Omit<User, 'password'>) {
    // Create tenant context based on user's role
    const tenantContext = await this.createTenantContext(user);
    
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantContext,
    };

    // Generate access token
    const accessToken = this.jwtService.sign(payload);
    
    // Generate refresh token with longer expiry
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      tenantContext,
    };
  }

  async refreshToken(token: string) {
    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      
      // Get the user
      const user = await this.usersService.findById(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      
      // Generate new tokens
      const { password: _, ...userWithoutPassword } = user;
      return this.login(userWithoutPassword);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private async createTenantContext(user: Omit<User, 'password'>) {
    // Create tenant context based on user's role
    let tenantContext = {};
    
    switch (user.role) {
      case 'ADMIN':
        // Admin has access to everything
        tenantContext = { isAdmin: true };
        break;
        
      case 'AGENCY_ADMIN':
      case 'AGENCY_USER':
        // Agency users have access to their agency and its clients
        if (user.agencyId) {
          tenantContext = {
            agencyId: user.agencyId,
            isAgencyUser: true,
            isAgencyAdmin: user.role === 'AGENCY_ADMIN',
          };
        }
        break;
        
      case 'CLIENT_ADMIN':
      case 'CLIENT_USER':
        // Client users have access only to their client
        if (user.clientId) {
          // Get the agency ID for the client
          const client = await this.usersService.getClientById(user.clientId);
          tenantContext = {
            clientId: user.clientId,
            agencyId: client?.agencyId,
            isClientUser: true,
            isClientAdmin: user.role === 'CLIENT_ADMIN',
          };
        }
        break;
    }
    
    return tenantContext;
  }
} 