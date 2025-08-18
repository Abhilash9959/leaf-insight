import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { DiseaseResults, type DiseaseResult } from '@/components/DiseaseResults';
import { KnowledgeBase, type KnowledgeBaseInfo } from '@/components/KnowledgeBase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Leaf, Scan, Brain, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [diseaseResults, setDiseaseResults] = useState<DiseaseResult[]>([]);
  const [knowledgeInfo, setKnowledgeInfo] = useState<KnowledgeBaseInfo | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingKB, setIsLoadingKB] = useState(false);
  const { toast } = useToast();

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    
    // Reset previous results
    setDiseaseResults([]);
    setKnowledgeInfo(null);
  };

  const analyzeImage = async () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please select an image first",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Create FormData for the API call
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Call the /predict API
      const predictResponse = await fetch('/predict', {
        method: 'POST',
        body: formData,
      });

      if (!predictResponse.ok) {
        throw new Error('Failed to analyze image');
      }

      const results: DiseaseResult[] = await predictResponse.json();
      setDiseaseResults(results);

      // If we have results, fetch knowledge base info for the top result
      if (results.length > 0) {
        await fetchKnowledgeBase(results[0].disease_name);
      }

      toast({
        title: "Analysis complete",
        description: `Detected ${results.length} potential issue(s)`,
      });

    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: "Unable to analyze the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchKnowledgeBase = async (diseaseName: string) => {
    setIsLoadingKB(true);
    
    try {
      const response = await fetch(`/kb/search?disease=${encodeURIComponent(diseaseName)}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch knowledge base information');
      }

      const info: KnowledgeBaseInfo = await response.json();
      setKnowledgeInfo(info);

    } catch (error) {
      console.error('Knowledge base error:', error);
      toast({
        title: "Knowledge base unavailable",
        description: "Could not load detailed information for this disease.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingKB(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setDiseaseResults([]);
    setKnowledgeInfo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Plant Disease Detector
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload a photo of your plant to instantly detect diseases and get expert treatment advice
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Upload Section */}
          <div className="space-y-6">
            <ImageUpload 
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              isLoading={isAnalyzing}
            />

            {selectedImage && !diseaseResults.length && (
              <div className="text-center">
                <Button 
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  size="lg"
                  className="shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isAnalyzing ? (
                    <>
                      <Scan className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing Image...
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5 mr-2" />
                      Analyze Plant Disease
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Results Section */}
          {(diseaseResults.length > 0 || knowledgeInfo || isLoadingKB) && (
            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* Disease Detection Results */}
              {diseaseResults.length > 0 && selectedImage && (
                <div className="space-y-4">
                  <DiseaseResults 
                    results={diseaseResults}
                    selectedImage={selectedImage}
                  />
                  
                  <div className="text-center">
                    <Button 
                      onClick={resetAnalysis}
                      variant="outline"
                      className="shadow-sm"
                    >
                      Analyze New Image
                    </Button>
                  </div>
                </div>
              )}

              {/* Knowledge Base Information */}
              <div className="space-y-4">
                <KnowledgeBase 
                  info={knowledgeInfo}
                  isLoading={isLoadingKB}
                />
              </div>
            </div>
          )}

          {/* Features Section */}
          {!selectedImage && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                      <Scan className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Upload & Analyze</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Upload a photo from your device or take one with your camera for instant analysis
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                      <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>AI Detection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Advanced AI identifies diseases with confidence scores and precise location mapping
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                      <Leaf className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Expert Guidance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Get detailed information about symptoms, causes, and proven treatment methods
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
