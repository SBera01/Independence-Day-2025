import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Download, Upload, Palette, Type, Move } from 'lucide-react';
import { toast } from 'sonner';

interface ImageGeneratorProps {
  onBack: () => void;
}

interface Template {
  id: string;
  name: string;
  preview: string;
  background: string;
  textPosition: { x: number; y: number };
}

export const ImageGenerator = ({ onBack }: ImageGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [selectedFont, setSelectedFont] = useState('Poppins');
  const [fontSize, setFontSize] = useState([48]);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [textPosition, setTextPosition] = useState({ x: 50, y: 80 });

  const templates: Template[] = [
    {
      id: 'flag-wave',
      name: 'Flag Wave',
      preview: '🇮🇳 Tricolor Background',
      background: 'linear-gradient(45deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)',
      textPosition: { x: 50, y: 20 }
    },
    {
      id: 'independence-day',
      name: 'Independence Day',
      preview: '🗽 Freedom Theme',
      background: 'linear-gradient(135deg, #FF9933 0%, #0B4DA2 50%, #138808 100%)',
      textPosition: { x: 50, y: 15 }
    },
    {
      id: 'ashoka-chakra',
      name: 'Ashoka Chakra',
      preview: '☸️ Chakra Design',
      background: 'radial-gradient(circle, #0B4DA2 0%, #FFFFFF 40%, #FF9933 100%)',
      textPosition: { x: 50, y: 85 }
    },
    {
      id: 'patriotic-stripes',
      name: 'Patriotic Stripes',
      preview: '📏 Horizontal Stripes',
      background: 'linear-gradient(0deg, #FF9933 0%, #FF9933 33%, #FFFFFF 33%, #FFFFFF 66%, #138808 66%, #138808 100%)',
      textPosition: { x: 50, y: 50 }
    },
    {
      id: 'freedom-gradient',
      name: 'Freedom Gradient',
      preview: '🌅 Sunset Colors',
      background: 'linear-gradient(180deg, #FF9933 0%, #FFD700 25%, #FFFFFF 50%, #87CEEB 75%, #138808 100%)',
      textPosition: { x: 50, y: 30 }
    },
    {
      id: 'unity-circle',
      name: 'Unity Circle',
      preview: '⭕ Circular Design',
      background: 'conic-gradient(from 0deg, #FF9933, #FFFFFF, #138808, #0B4DA2, #FF9933)',
      textPosition: { x: 50, y: 50 }
    },
    {
      id: 'vintage-india',
      name: 'Vintage India',
      preview: '📜 Vintage Look',
      background: 'linear-gradient(45deg, #8B4513 0%, #FF9933 25%, #FFFFFF 50%, #138808 75%, #2F4F4F 100%)',
      textPosition: { x: 50, y: 25 }
    },
    {
      id: 'modern-tricolor',
      name: 'Modern Tricolor',
      preview: '🔲 Modern Design',
      background: 'linear-gradient(135deg, rgba(255,153,51,0.8) 0%, rgba(255,255,255,0.9) 33%, rgba(255,255,255,0.9) 66%, rgba(19,136,8,0.8) 100%)',
      textPosition: { x: 50, y: 40 }
    }
  ];

  const fonts = ['Poppins', 'Merriweather', 'Arial'];

  useEffect(() => {
    if (selectedTemplate) {
      generatePreview();
    }
  }, [selectedTemplate, name, profilePhoto, selectedFont, fontSize, textColor, textPosition]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePreview = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedTemplate) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create background gradient
    const gradient = createGradientFromCSS(ctx, selectedTemplate.background, canvas.width, canvas.height);
    ctx.fillStyle = gradient || selectedTemplate.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Ashoka Chakra if template includes it
    if (selectedTemplate.id === 'ashoka-chakra') {
      drawAshokaChakra(ctx, canvas.width / 2, canvas.height / 2, 100);
    }

    // Draw profile photo if uploaded
    if (profilePhoto) {
      const img = new Image();
      img.onload = () => {
        const photoSize = 120;
        const photoX = canvas.width - photoSize - 30;
        const photoY = 30;
        
        // Draw circular photo
        ctx.save();
        ctx.beginPath();
        ctx.arc(photoX + photoSize/2, photoY + photoSize/2, photoSize/2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
        ctx.restore();
        
        // Add border
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(photoX + photoSize/2, photoY + photoSize/2, photoSize/2, 0, Math.PI * 2);
        ctx.stroke();
      };
      img.src = profilePhoto;
    }

    // Draw text
    if (name) {
      ctx.font = `bold ${fontSize[0]}px ${selectedFont}`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Add text shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      const textX = (canvas.width * textPosition.x) / 100;
      const textY = (canvas.height * textPosition.y) / 100;
      
      ctx.fillText(`Happy Independence Day`, textX, textY - fontSize[0]/2);
      ctx.fillText(name, textX, textY + fontSize[0]/2);
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
    }
  };

  const createGradientFromCSS = (ctx: CanvasRenderingContext2D, cssGradient: string, width: number, height: number) => {
    // Simple gradient parsing - in a real app, you'd use a proper CSS parser
    if (cssGradient.includes('linear-gradient')) {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      
      if (cssGradient.includes('#FF9933') && cssGradient.includes('#FFFFFF') && cssGradient.includes('#138808')) {
        gradient.addColorStop(0, '#FF9933');
        gradient.addColorStop(0.5, '#FFFFFF');
        gradient.addColorStop(1, '#138808');
      }
      
      return gradient;
    }
    
    return null;
  };

  const drawAshokaChakra = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    ctx.save();
    ctx.strokeStyle = '#0B4DA2';
    ctx.lineWidth = 3;
    
    // Outer circle
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner circle
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.1, 0, Math.PI * 2);
    ctx.fill();
    
    // Spokes (24 spokes)
    const spokeCount = 24;
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i * 2 * Math.PI) / spokeCount;
      const innerRadius = radius * 0.15;
      const outerRadius = radius * 0.9;
      
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * innerRadius, y + Math.sin(angle) * innerRadius);
      ctx.lineTo(x + Math.cos(angle) * outerRadius, y + Math.sin(angle) * outerRadius);
      ctx.stroke();
    }
    
    ctx.restore();
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !name) {
      toast.error('Please enter your name first');
      return;
    }

    const link = document.createElement('a');
    link.download = `IndependenceDay2025_${name.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    toast.success('Image downloaded successfully! 🇮🇳');
  };

  const shareToLinkedIn = () => {
    const canvas = canvasRef.current;
    if (!canvas || !name) {
      toast.error('Please enter your name first');
      return;
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const text = `Celebrating Independence Day 2025! Proud to be Indian 🇮🇳 #IndependenceDay2025 #ProudIndian #JaiHind`;
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`;
        window.open(linkedinUrl, '_blank');
      }
    });
  };

  return (
    <div className="min-h-screen bg-subtle p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="glass-card border-primary/20 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-3xl md:text-4xl font-bold font-merriweather text-gradient">
              Patriotic Image Generator
            </h1>
            <p className="text-muted-foreground mt-2">
              Create beautiful Independence Day images
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Info */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Type className="w-5 h-5 mr-2" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="glass-card border-primary/20"
                  />
                </div>
                
                <div>
                  <Label>Profile Photo (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 glass-card border-primary/20"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Template Selection */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Palette className="w-5 h-5 mr-2" />
                  Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-3 rounded-lg cursor-pointer border-2 transition-all ${
                        selectedTemplate?.id === template.id
                          ? 'border-primary bg-primary/10'
                          : 'border-primary/20 hover:border-primary/40'
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <div className="text-xs font-medium mb-1">{template.name}</div>
                      <div className="text-xs text-muted-foreground">{template.preview}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customization */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Move className="w-5 h-5 mr-2" />
                  Customization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Font</Label>
                  <select
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className="w-full p-2 rounded glass-card border border-primary/20 bg-background"
                  >
                    {fonts.map((font) => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label>Font Size: {fontSize[0]}px</Label>
                  <Slider
                    value={fontSize}
                    onValueChange={setFontSize}
                    min={24}
                    max={72}
                    step={2}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Text Color</Label>
                  <Input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-10 glass-card border-primary/20"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>X Position: {textPosition.x}%</Label>
                    <Slider
                      value={[textPosition.x]}
                      onValueChange={(value) => setTextPosition(prev => ({ ...prev, x: value[0] }))}
                      min={10}
                      max={90}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Y Position: {textPosition.y}%</Label>
                    <Slider
                      value={[textPosition.y]}
                      onValueChange={(value) => setTextPosition(prev => ({ ...prev, y: value[0] }))}
                      min={10}
                      max={90}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview and Download */}
          <div className="lg:col-span-2">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-primary">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <canvas
                    ref={canvasRef}
                    className="w-full max-w-2xl mx-auto border border-primary/20 rounded-lg shadow-lg"
                    style={{ aspectRatio: '4/3' }}
                  />
                  
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={downloadImage}
                      disabled={!name || !selectedTemplate}
                      className="bg-primary hover:bg-primary-glow"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PNG
                    </Button>
                    
                    <Button
                      onClick={shareToLinkedIn}
                      disabled={!name || !selectedTemplate}
                      variant="outline"
                      className="glass-card border-primary/20 hover:bg-primary/10"
                    >
                      Share on LinkedIn
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};