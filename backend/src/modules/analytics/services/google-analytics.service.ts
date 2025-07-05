import { Injectable, BadRequestException } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleAnalyticsService {
  private analytics = google.analyticsreporting('v4');
  private analyticsData = google.analyticsdata('v1beta');

  /**
   * Real Google Analytics 4 API Integration Example
   * This replaces the mock implementation
   */
  async testConnection(credentials: any): Promise<boolean> {
    try {
      // Set up OAuth2 client with real credentials
      const auth = new google.auth.OAuth2(
        credentials.clientId,
        credentials.clientSecret,
        'http://localhost:3001/auth/google/callback'
      );

      auth.setCredentials({
        access_token: credentials.accessToken,
        refresh_token: credentials.refreshToken,
      });

      // Test connection by making a simple API call
      const response = await this.analyticsData.properties.runReport({
        property: `properties/${credentials.propertyId}`,
        auth: auth,
        requestBody: {
          dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
          metrics: [{ name: 'sessions' }],
        },
      });

      return response.status === 200;
    } catch (error) {
      throw new BadRequestException(`Google Analytics connection failed: ${error.message}`);
    }
  }

  async fetchAnalyticsData(credentials: any, dateRange: { startDate: string; endDate: string }) {
    try {
      const auth = new google.auth.OAuth2(
        credentials.clientId,
        credentials.clientSecret
      );

      auth.setCredentials({
        access_token: credentials.accessToken,
        refresh_token: credentials.refreshToken,
      });

      // Fetch real data from Google Analytics 4
      const response = await this.analyticsData.properties.runReport({
        property: `properties/${credentials.propertyId}`,
        auth: auth,
        requestBody: {
          dateRanges: [dateRange],
          metrics: [
            { name: 'sessions' },
            { name: 'users' },
            { name: 'pageviews' },
            { name: 'bounceRate' },
            { name: 'averageSessionDuration' },
          ],
          dimensions: [
            { name: 'date' },
            { name: 'country' },
            { name: 'deviceCategory' },
            { name: 'channelGrouping' },
          ],
        },
      });

      // Process and return the real data
      return this.processAnalyticsData(response.data);
    } catch (error) {
      throw new BadRequestException(`Failed to fetch analytics data: ${error.message}`);
    }
  }

  private processAnalyticsData(data: any) {
    // Process the raw Google Analytics data into our format
    return {
      sessions: this.extractMetricValue(data, 'sessions'),
      users: this.extractMetricValue(data, 'users'),
      pageviews: this.extractMetricValue(data, 'pageviews'),
      bounceRate: this.extractMetricValue(data, 'bounceRate'),
      avgSessionDuration: this.extractMetricValue(data, 'averageSessionDuration'),
      // Process dimensions for charts
      dailyData: this.processDailyData(data),
      countryData: this.processCountryData(data),
      deviceData: this.processDeviceData(data),
      channelData: this.processChannelData(data),
    };
  }

  private extractMetricValue(data: any, metricName: string): number {
    // Extract specific metric values from GA4 response
    const rows = data.rows || [];
    if (rows.length === 0) return 0;
    
    const metricIndex = data.metricHeaders?.findIndex(
      (header: any) => header.name === metricName
    );
    
    if (metricIndex === -1) return 0;
    
    return parseFloat(rows[0].metricValues[metricIndex].value) || 0;
  }

  private processDailyData(data: any) {
    // Process daily trend data for charts
    return data.rows?.map((row: any) => ({
      date: row.dimensionValues[0].value,
      sessions: parseFloat(row.metricValues[0].value),
      users: parseFloat(row.metricValues[1].value),
    })) || [];
  }

  private processCountryData(data: any) {
    // Process country-wise data
    const countryMap = new Map();
    data.rows?.forEach((row: any) => {
      const country = row.dimensionValues[1].value;
      const sessions = parseFloat(row.metricValues[0].value);
      countryMap.set(country, (countryMap.get(country) || 0) + sessions);
    });
    
    return Array.from(countryMap.entries())
      .map(([country, sessions]) => ({ country, sessions }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 10); // Top 10 countries
  }

  private processDeviceData(data: any) {
    // Process device category data
    const deviceMap = new Map();
    data.rows?.forEach((row: any) => {
      const device = row.dimensionValues[2].value;
      const sessions = parseFloat(row.metricValues[0].value);
      deviceMap.set(device, (deviceMap.get(device) || 0) + sessions);
    });
    
    return Array.from(deviceMap.entries()).map(([device, sessions]) => ({
      device,
      sessions,
      percentage: 0 // Calculate percentage later
    }));
  }

  private processChannelData(data: any) {
    // Process channel grouping data
    const channelMap = new Map();
    data.rows?.forEach((row: any) => {
      const channel = row.dimensionValues[3].value;
      const sessions = parseFloat(row.metricValues[0].value);
      channelMap.set(channel, (channelMap.get(channel) || 0) + sessions);
    });
    
    return Array.from(channelMap.entries()).map(([channel, sessions]) => ({
      channel,
      sessions,
      percentage: 0 // Calculate percentage later
    }));
  }

  /**
   * OAuth2 flow for getting user consent and access tokens
   */
  getAuthUrl(): string {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_ANALYTICS_CLIENT_ID,
      process.env.GOOGLE_ANALYTICS_CLIENT_SECRET,
      'http://localhost:3001/auth/google/callback'
    );

    return auth.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/analytics.readonly',
        'https://www.googleapis.com/auth/analytics.manage.users.readonly',
      ],
    });
  }

  async handleAuthCallback(code: string) {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_ANALYTICS_CLIENT_ID,
      process.env.GOOGLE_ANALYTICS_CLIENT_SECRET,
      'http://localhost:3001/auth/google/callback'
    );

    const { tokens } = await auth.getAccessToken(code);
    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date,
    };
  }
} 