import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DiseaseResult {
  disease_name: string;
  confidence: number;
  bounding_box?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface DiseaseResultsProps {
  results: DiseaseResult[];
  selectedImage: string;
}

export const DiseaseResults: React.FC<DiseaseResultsProps> = ({
  results,
  selectedImage
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-success';
    if (confidence >= 0.6) return 'text-warning';
    return 'text-destructive';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return CheckCircle;
    if (confidence >= 0.6) return AlertTriangle;
    return AlertTriangle;
  };

  const topResult = results[0];

  return (
    <div className="space-y-6">
      {/* Image with Bounding Box */}
      {topResult?.bounding_box && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Detection Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative inline-block">
              <img
                src={selectedImage}
                alt="Analysis result"
                className="max-w-full h-auto rounded-lg"
              />
              {/* Bounding Box Overlay */}
              <div
                className="absolute border-2 border-primary bg-primary/10 backdrop-blur-sm"
                style={{
                  left: `${topResult.bounding_box.x}%`,
                  top: `${topResult.bounding_box.y}%`,
                  width: `${topResult.bounding_box.width}%`,
                  height: `${topResult.bounding_box.height}%`,
                }}
              >
                <div className="absolute -top-8 left-0 bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-medium">
                  {topResult.disease_name}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detection Results */}
      <Card>
        <CardHeader>
          <CardTitle>Disease Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result, index) => {
              const ConfidenceIcon = getConfidenceIcon(result.confidence);
              const confidencePercentage = Math.round(result.confidence * 100);
              
              return (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg border",
                    index === 0 ? "bg-accent/30 border-primary" : "bg-muted/30"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <ConfidenceIcon
                        className={cn(
                          "h-5 w-5",
                          getConfidenceColor(result.confidence)
                        )}
                      />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {result.disease_name}
                        </h3>
                        {index === 0 && (
                          <Badge variant="secondary" className="mt-1">
                            Primary Detection
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={cn(
                        "text-lg font-bold",
                        getConfidenceColor(result.confidence)
                      )}>
                        {confidencePercentage}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Confidence
                      </div>
                    </div>
                  </div>
                  
                  <Progress
                    value={confidencePercentage}
                    className="h-2"
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};