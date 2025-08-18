import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Stethoscope, 
  Bug, 
  Pill, 
  AlertCircle, 
  Info,
  BookOpen
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export interface KnowledgeBaseInfo {
  disease_name: string;
  symptoms: string[];
  causes: string[];
  treatments: string[];
  prevention?: string[];
  severity?: 'low' | 'medium' | 'high';
  description?: string;
}

interface KnowledgeBaseProps {
  info: KnowledgeBaseInfo | null;
  isLoading: boolean;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  info,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!info) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Upload an image to get detailed plant disease information
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSeverityVariant = (severity?: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Disease Information
          </CardTitle>
          {info.severity && (
            <Badge variant={getSeverityVariant(info.severity)}>
              <AlertCircle className="h-3 w-3 mr-1" />
              {info.severity.toUpperCase()} Severity
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Disease Name and Description */}
        <div>
          <h3 className="text-xl font-bold mb-2">{info.disease_name}</h3>
          {info.description && (
            <p className="text-muted-foreground leading-relaxed">
              {info.description}
            </p>
          )}
        </div>

        <Separator />

        {/* Symptoms */}
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 font-semibold text-lg">
            <Stethoscope className="h-5 w-5 text-info" />
            Symptoms
          </h4>
          <div className="grid gap-2">
            {info.symptoms.map((symptom, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-info mt-2 flex-shrink-0" />
                <p className="text-sm leading-relaxed">{symptom}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Causes */}
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 font-semibold text-lg">
            <Bug className="h-5 w-5 text-warning" />
            Causes
          </h4>
          <div className="grid gap-2">
            {info.causes.map((cause, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-warning mt-2 flex-shrink-0" />
                <p className="text-sm leading-relaxed">{cause}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Treatment */}
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 font-semibold text-lg">
            <Pill className="h-5 w-5 text-success" />
            Treatment
          </h4>
          <div className="grid gap-2">
            {info.treatments.map((treatment, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0" />
                <p className="text-sm leading-relaxed">{treatment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Prevention (if available) */}
        {info.prevention && info.prevention.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold text-lg">
                <AlertCircle className="h-5 w-5 text-primary" />
                Prevention
              </h4>
              <div className="grid gap-2">
                {info.prevention.map((prevention, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-sm leading-relaxed">{prevention}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};