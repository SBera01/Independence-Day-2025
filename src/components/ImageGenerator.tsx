import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Download, Upload, Image as ImageIcon, Type, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ImageGeneratorProps {
  onBack: () => void;
}

interface BackgroundImage {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
}

export const ImageGenerator = ({ onBack }: ImageGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('');
  const [selectedBackground, setSelectedBackground] = useState<BackgroundImage | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [photoSize, setPhotoSize] = useState([150]);
  const [photoPosition, setPhotoPosition] = useState({ x: 20, y: 20 });
  const [namePosition, setNamePosition] = useState({ x: 50, y: 80 });
  const [textSize, setTextSize] = useState([48]);
  const [textColor, setTextColor] = useState('#FFFFFF');

  // Your provided background images - Replace these URLs with your actual images
  const backgroundImages: BackgroundImage[] = [
    {
      id: 'independence-1',
      name: 'Tricolor',
      url: 'https://www.shutterstock.com/shutterstock/videos/3562312795/thumb/1.jpg?ip=x480?w=800&h=600&fit=crop',
      thumbnail: 'https://www.shutterstock.com/shutterstock/videos/3562312795/thumb/1.jpg?ip=x480?w=200&h=150&fit=crop'
    },
    {
      id: 'independence-2', 
      name: 'India Gate',
      url: 'https://images.pexels.com/photos/14520365/pexels-photo-14520365.jpeg&fit=crop',
      thumbnail: 'https://images.pexels.com/photos/14520365/pexels-photo-14520365.jpeg?w=200&h=150&fit=crop'
    },
    {
      id: 'independence-3',
      name: 'Taj Mahal',
      url: 'https://images.hindustantimes.com/img/2024/08/14/original/happy_independence_day_3_1723619700479.jpg?w=800&h=600',
      thumbnail: 'https://images.hindustantimes.com/img/2024/08/14/original/happy_independence_day_3_1723619700479.jpg?w=200&h=150&fit=crop'
    },
    {
      id: 'independence-4',
      name: 'Red Fort Delhi',
      url: 'https://images.news18.com/ibnlive/uploads/2024/08/shutterstock_2494715889-2024-08-abeeabdecc72f275aa5a2c43926f8842.jpg?impolicy=website&width=0&height=0?w=800&h=600&fit=crop',
      thumbnail: 'https://images.news18.com/ibnlive/uploads/2024/08/shutterstock_2494715889-2024-08-abeeabdecc72f275aa5a2c43926f8842.jpg?impolicy=website&width=0&height=0?w=200&h=150&fit=crop'
    },
    {
      id: 'independence-5',
      name: 'Red Fort',
      url: 'https://img.jagranjosh.com/images/2024/August/1482024/ind-day-poster.webp?w=800&h=600&fit=crop',
      thumbnail: 'https://img.jagranjosh.com/images/2024/August/1482024/ind-day-poster.webp?w=200&h=150&fit=crop'
    },
    {
      id: 'independence-6',
      name: 'Ashoka Chakra',
      url: 'https://img.freepik.com/premium-vector/15th-august-happy-independence-day-india-social-media-post-free-template_1256331-79.jpg?semt=ais_hybrid&w=740&q=80',
      thumbnail: 'https://img.freepik.com/premium-vector/15th-august-happy-independence-day-india-social-media-post-free-template_1256331-79.jpg?semt=ais_hybrid&w=740&q=80'
    }
  ];

  const generateImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedBackground) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Load and draw background image
    const bgImg = new Image();
    bgImg.crossOrigin = 'anonymous';
    bgImg.onload = () => {
      // Draw background image to cover entire canvas
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // Add semi-transparent overlay for better text visibility
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw user photo if uploaded
      if (userPhoto) {
        const userImg = new Image();
        userImg.onload = () => {
          const size = photoSize[0];
          const x = (canvas.width * photoPosition.x) / 100;
          const y = (canvas.height * photoPosition.y) / 100;

          // Save context for clipping
          ctx.save();
          
          // Create circular clipping path
          ctx.beginPath();
          ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
          ctx.clip();
          
          // Draw user photo
          ctx.drawImage(userImg, x, y, size, size);
          
          // Restore context
          ctx.restore();
          
          // Add border to photo
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 4;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
          ctx.stroke();
          ctx.shadowColor = 'transparent';
        };
        userImg.src = userPhoto;
      }

      // Draw user name if provided
      if (name.trim()) {
        const nameX = (canvas.width * namePosition.x) / 100;
        const nameY = (canvas.height * namePosition.y) / 100;

        ctx.font = `bold ${textSize[0]}px Arial, sans-serif`;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add text shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.fillText(name, nameX, nameY);
        
        // Draw Independence Day text
        ctx.font = `bold ${textSize[0] * 0.6}px Arial, sans-serif`;
        ctx.fillText('Happy Independence Day 2025', nameX, nameY - textSize[0] - 20);
        ctx.fillText('🇮🇳 Jai Hind! 🇮🇳', nameX, nameY + textSize[0] + 20);
        
        ctx.shadowColor = 'transparent';
      }
    };
    bgImg.src = selectedBackground.url;
  }, [selectedBackground, name, userPhoto, photoSize, photoPosition, namePosition, textSize, textColor]);

  useEffect(() => {
    if (selectedBackground) {
      generateImage();
    }
  }, [selectedBackground, generateImage]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size too large. Please select an image under 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedBackground) {
      toast.error('Please select a background image first');
      return;
    }

    if (!name.trim()) {
      toast.error('Please enter your name first');
      return;
    }

    const link = document.createElement('a');
    link.download = `IndependenceDay2025_${name.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    
    toast.success('Image downloaded successfully! 🇮🇳');
  };

  const shareToWhatsApp = async () => {
    if (!selectedBackground || !name.trim()) {
      toast.error('Please complete your image first');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      toast.error('Image not ready');
      return;
    }

    // Create the message text
    const shareText = `🇮🇳 Happy Independence Day 2025! 🇮🇳

Proud to be Indian! Jai Hind!

I've created my personalized Independence Day image with my name "${name}".

Check out my patriotic image! 🇮🇳

#IndependenceDay2025 #ProudIndian #JaiHind`;

    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png', 1.0);
      });

      // Create file from blob
      const file = new File([blob], `IndependenceDay2025_${name.replace(/\s+/g, '_')}.png`, {
        type: 'image/png',
      });

      // Check if Web Share API is supported and can share files
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        // Use Web Share API to share directly
        await navigator.share({
          title: 'Independence Day 2025',
          text: shareText,
          files: [file],
        });
        
        toast.success('Image sent to WhatsApp successfully! 🇮🇳');
        return;
      }

      // Fallback: Use WhatsApp Web API with sharing intent
      // Create a data URL for the image
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      
      // Try to use the clipboard API to copy image
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob,
          }),
        ]);
        
        // Open WhatsApp with text
        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
        window.location.href = whatsappUrl;
        
        // Fallback to web version
        setTimeout(() => {
          window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
        }, 1000);
        
        toast.success('Image copied to clipboard! Paste it in WhatsApp chat 📋🇮🇳', {
          duration: 6000,
        });
        return;
      }

      // Final fallback: Download and open WhatsApp
      const link = document.createElement('a');
      link.download = `IndependenceDay2025_${name.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();

      // Open WhatsApp
      setTimeout(() => {
        const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
        
        toast.info('Image downloaded! Please attach it manually in WhatsApp 📎', {
          duration: 5000,
        });
      }, 1000);

    } catch (error) {
      console.error('Sharing failed:', error);
      toast.error('Unable to share directly. Please try downloading the image first.');
    }
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
              Independence Day Image Creator
            </h1>
            <p className="text-muted-foreground mt-2">
              Add your photo and name to beautiful Independence Day backgrounds
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:h-[calc(100vh-200px)]">
          {/* Controls Panel - Scrollable on Desktop Only */}
          <div className="lg:col-span-1 space-y-6 lg:overflow-y-auto lg:pr-2 lg:max-h-full lg:scrollbar-thin lg:scrollbar-thumb-primary/20 lg:scrollbar-track-transparent hover:lg:scrollbar-thumb-primary/40">
            <div className="hidden lg:block sticky top-0 bg-subtle/80 backdrop-blur-sm z-10 py-2 mb-2 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                Scroll down for more options ↓
              </p>
            </div>
            
            {/* Step 1: Select Background */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Step 1: Choose Background
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {backgroundImages.map((bg) => (
                    <div
                      key={bg.id}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        selectedBackground?.id === bg.id
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-primary/20 hover:border-primary/40'
                      }`}
                      onClick={() => setSelectedBackground(bg)}
                    >
                      <img
                        src={bg.thumbnail}
                        alt={bg.name}
                        className="w-full h-20 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center">
                        {bg.name}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 2: User Details */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Type className="w-5 h-5 mr-2" />
                  Step 2: Your Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="glass-card border-primary/20"
                  />
                </div>
                
                <div>
                  <Label>Your Photo (Optional)</Label>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full glass-card border-primary/20"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {userPhoto ? 'Change Photo' : 'Upload Photo'}
                    </Button>
                    {userPhoto && (
                      <div className="text-center">
                        <img 
                          src={userPhoto} 
                          alt="Preview" 
                          className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-primary/20"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Customize Position */}
            {selectedBackground && (
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    🎨 Step 3: Customize
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userPhoto && (
                    <>
                      <div>
                        <Label>Photo Size: {photoSize[0]}px</Label>
                        <Slider
                          value={photoSize}
                          onValueChange={setPhotoSize}
                          min={80}
                          max={200}
                          step={10}
                          className="mt-2"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Photo X: {photoPosition.x}%</Label>
                          <Slider
                            value={[photoPosition.x]}
                            onValueChange={(value) => setPhotoPosition(prev => ({ ...prev, x: value[0] }))}
                            min={5}
                            max={75}
                            step={5}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Photo Y: {photoPosition.y}%</Label>
                          <Slider
                            value={[photoPosition.y]}
                            onValueChange={(value) => setPhotoPosition(prev => ({ ...prev, y: value[0] }))}
                            min={5}
                            max={75}
                            step={5}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <Label>Text Size: {textSize[0]}px</Label>
                    <Slider
                      value={textSize}
                      onValueChange={setTextSize}
                      min={24}
                      max={72}
                      step={4}
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
                      <Label>Name X: {namePosition.x}%</Label>
                      <Slider
                        value={[namePosition.x]}
                        onValueChange={(value) => setNamePosition(prev => ({ ...prev, x: value[0] }))}
                        min={10}
                        max={90}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Name Y: {namePosition.y}%</Label>
                      <Slider
                        value={[namePosition.y]}
                        onValueChange={(value) => setNamePosition(prev => ({ ...prev, y: value[0] }))}
                        min={10}
                        max={90}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview and Download - Fixed Height on Desktop Only */}
          <div className="lg:col-span-2 lg:max-h-full">
            <Card className="glass-card border-0 h-full lg:sticky lg:top-0">
              <CardHeader>
                <CardTitle className="text-primary">Preview & Download</CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <div className="space-y-6">
                  {!selectedBackground ? (
                    <div className="flex flex-col items-center justify-center h-96 text-muted-foreground border-2 border-dashed border-primary/20 rounded-lg bg-background/50">
                      <ImageIcon className="w-20 h-20 mb-6 opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">Ready to Create Your Independence Day Image?</h3>
                      <p className="text-center max-w-md">Select a background image to start creating your personalized Independence Day image</p>
                      <div className="mt-4 text-sm opacity-75">
                        Step 1: Choose Background → Step 2: Add Details → Step 3: Download 🇮🇳
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <canvas
                        ref={canvasRef}
                        className="w-full max-w-2xl border-2 border-primary/20 rounded-lg shadow-lg bg-white"
                        style={{ aspectRatio: '4/3' }}
                      />
                    </div>
                  )}
                  
                  <div className="flex gap-4 justify-center flex-wrap">
                    <Button
                      onClick={downloadImage}
                      disabled={!selectedBackground || !name.trim()}
                      className="bg-primary hover:bg-primary-glow disabled:opacity-50 px-6 py-3 text-base"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Image
                    </Button>
                    
                    <Button
                      onClick={shareToWhatsApp}
                      disabled={!selectedBackground || !name.trim()}
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-8 py-3 text-base text-black font-semibold shadow-lg"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Send to WhatsApp
                    </Button>
                  </div>
                  
                  {selectedBackground && name.trim() && (
                    <div className="text-center bg-primary/5 rounded-lg p-4 border border-primary/20">
                      <p className="text-primary font-medium">🇮🇳 Your Independence Day image is ready to download! 🇮🇳</p>
                      <p className="text-sm text-muted-foreground mt-1">High-quality PNG image • 800x600 pixels</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};