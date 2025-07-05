'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { contactsApi } from '@/lib/api/api-client';
import {
  Star,
  StarHalf,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  FileText,
  Link,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface LeadScoreCardProps {
  contactId: string;
  initialScore?: {
    total: number;
    breakdown: {
      engagement: number;
      demographic: number;
      behavioral: number;
      firmographic: number;
    };
    factors: Array<{
      type: string;
      description: string;
      impact: number;
      timestamp: string;
    }>;
    trend: 'up' | 'down' | 'stable';
    lastUpdated: string;
  };
  onScoreUpdate?: (newScore: number) => void;
}

export function LeadScoreCard({
  contactId,
  initialScore,
  onScoreUpdate
}: LeadScoreCardProps) {
  const [score, setScore] = useState(initialScore);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Calculate the score level (0-100)
  const getScoreLevel = (value: number) => {
    if (value >= 80) return 'Hot';
    if (value >= 60) return 'Warm';
    if (value >= 40) return 'Lukewarm';
    return 'Cold';
  };
  
  // Get color based on score
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-red-500';
    if (value >= 60) return 'text-orange-500';
    if (value >= 40) return 'text-yellow-500';
    return 'text-blue-500';
  };
  
  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <BarChart2 className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Get factor icon
  const getFactorIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'form':
        return <FileText className="h-4 w-4" />;
      case 'website':
        return <Link className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };
  
  // Refresh score
  const refreshScore = async () => {
    setIsRefreshing(true);
    try {
      // In a real implementation, this would call the API
      // const response = await contactsApi.refreshLeadScore(contactId);
      // setScore(response.data);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockScore = {
        total: Math.floor(Math.random() * 20) + score.total - 10,
        breakdown: {
          engagement: Math.min(100, score.breakdown.engagement + Math.floor(Math.random() * 10) - 5),
          demographic: score.breakdown.demographic,
          behavioral: Math.min(100, score.breakdown.behavioral + Math.floor(Math.random() * 10) - 5),
          firmographic: score.breakdown.firmographic,
        },
        factors: [
          {
            type: 'email',
            description: 'Opened marketing email',
            impact: 5,
            timestamp: new Date().toISOString()
          },
          ...score.factors.slice(0, 4)
        ],
                 trend: Math.random() > 0.5 ? 'up' as const : 'down' as const,
        lastUpdated: new Date().toISOString()
      };
      
      setScore(mockScore);
      if (onScoreUpdate) {
        onScoreUpdate(mockScore.total);
      }
      
      toast({
        title: "Score Updated",
        description: "Lead score has been recalculated.",
      });
    } catch (error) {
      console.error('Error refreshing lead score:', error);
      toast({
        title: "Error",
        description: "Failed to refresh lead score. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!score) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lead Score</CardTitle>
          <CardDescription>
            No scoring data available
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Lead scoring has not been set up for this contact.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Lead Score</CardTitle>
            <CardDescription>
              Based on engagement and profile data
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={refreshScore}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className={`text-4xl font-bold ${getScoreColor(score.total)}`}>
              {score.total}
            </span>
            {getTrendIcon(score.trend)}
          </div>
          <div>
            <Badge variant="outline" className={getScoreColor(score.total)}>
              {getScoreLevel(score.total)} Lead
            </Badge>
          </div>
        </div>
        
        {/* Score Breakdown */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Score Breakdown</h4>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Engagement</span>
                <span>{score.breakdown.engagement}%</span>
              </div>
              <Progress value={score.breakdown.engagement} />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Demographic</span>
                <span>{score.breakdown.demographic}%</span>
              </div>
              <Progress value={score.breakdown.demographic} />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Behavioral</span>
                <span>{score.breakdown.behavioral}%</span>
              </div>
              <Progress value={score.breakdown.behavioral} />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Firmographic</span>
                <span>{score.breakdown.firmographic}%</span>
              </div>
              <Progress value={score.breakdown.firmographic} />
            </div>
          </div>
        </div>
        
        {/* Recent Factors */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Recent Factors</h4>
          
          <div className="space-y-3">
            {score.factors.map((factor, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className={`p-1 rounded-full bg-muted`}>
                  {getFactorIcon(factor.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{factor.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(factor.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={factor.impact > 0 ? 'default' : 'destructive'}>
                  {factor.impact > 0 ? '+' : ''}{factor.impact}
                </Badge>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date(score.lastUpdated).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 